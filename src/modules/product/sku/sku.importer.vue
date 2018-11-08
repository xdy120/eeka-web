<template>
  <el-dialog :visible.sync="visible" :title="title" :before-close="dialogCloseConfirm" width="800px"
             append-to-body>
    <excel-import ref="uploader" @change="change" :disabled="fileDisabled"
                  :template-url="templateUrl"></excel-import>
    <slot name="header"></slot>
    <el-container>
      <el-main>
        <el-container>
          <el-main>
            <el-container>
              <el-main>
                <el-table :data="pageList" :height="300">
                  <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop"
                                   :label="item.label" :width="item.width"></el-table-column>
                  <el-table-column></el-table-column>
                  <el-table-column width="60" fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                      <go-delete-button @click="remove(scope.row)"></go-delete-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-footer>
                <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize"
                               :total="list.length" layout="prev,pager,next,total"
                               @current-change="search"></el-pagination>
              </el-footer>

            </el-container>
          </el-main>
          <el-aside v-if="hasFailed" width="350px" style="padding-left: 5px">
            <el-container>
              <el-main>
                <el-table :data="failedPageList" :height="300" row-class-name="danger">
                  <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop"
                                   :label="item.label" :width="item.width"></el-table-column>
                  <el-table-column width="80" fixed="right" label="校验状态"
                                   :formatter="()=>'系统不存在此商品'"></el-table-column>
                  <el-table-column width="60" fixed="right" label="操作" align="center">
                    <template slot-scope="scope">
                      <go-delete-button @click="remove(scope.row)"></go-delete-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-footer>
                <el-pagination :current-page.sync="failedPaging.page"
                               :page-size="failedPaging.pageSize" :total="failedList.length"
                               layout="prev,pager,next,total"
                               @current-change="search"></el-pagination>
              </el-footer>
            </el-container>
          </el-aside>
        </el-container>
      </el-main>
      <el-footer height="35px">
        <span style="float: right">共{{skuMap.size}}个规格</span>
        <slot></slot>
      </el-footer>
    </el-container>
    <el-progress v-show="currentStatus===3" :text-inside="true" status="success" :stroke-width="18"
                 :percentage="percentage" style="margin-top: 10px"></el-progress>
    <div slot="footer" class="dialog-footer">
      <el-button @click="begin" v-show="currentStatus===1">开始</el-button>
      <span v-show="currentStatus===2">校验中...</span>
      <span v-show="currentStatus===3">导入中...</span>
      <el-button @click="finish" v-show="currentStatus===4">完成</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>

  import {Assert} from '@/libs/util';
  import {ExcelImport} from '@/component/ui';
  import {SkuApi} from '@/modules/product/api';

  export default {
    props: {
      title: {
        type: String,
        default: '数据导入'
      },
      status: {
        type: Number,
        default: 1
      },
      batch: {
        type: Boolean,
        default: false
      },
      batchSize: {
        type: Number,
        default: 10
      },
      columnBuilder: {
        type: Function
      },
      columnValidator: {
        type: Function,
        default: function (columns) {
          if (!Assert.isEmpty(this.mustColumns)) {
            return this.mustColumns.every(col => columns.some(x => x.label === col));
          }
          return true;
        }
      },
      mustColumns: {
        type: Array,
        default: []
      },
      productCodeProp: {
        type: String,
        default: '商品编码'
      },
      skuCodeProp: {
        type: String,
        default: '规格编码'
      },
      autoCheck: {
        type: Boolean,
        default: true
      },
      templateUrl: String
    },
    components: {ExcelImport},
    data() {
      return {
        visible: false,
        cancel: false,
        hasData: true,
        currentStatus: this.status,
        columns: [],
        pageList: [],
        list: [],
        failedPageList: [],
        failedList: [],
        currentProcessPage: 0,
        skuMap: new Map(),
        paging: {
          pages: 0,
          pageSize: this.batchSize,
          page: 1
        },
        failedPaging: {
          pageSize: this.batchSize,
          page: 1
        }
      };
    },
    computed: {
      hasFailed() {
        return this.failedList.length > 0;
      },
      percentage() {
        return Math.floor(
          this.paging.pages > 0 ? this.currentProcessPage * 100 / this.paging.pages : 0);
      },
      fileDisabled() {
        return Assert.inArray(this.currentStatus, [2, 3]);
      }
    },
    methods: {
      show(doImport) {
        this.clear();
        this.cancel = false;
        this.visible = true;
        if (this.$refs.uploader) {
          this.$refs.uploader.clearFile();
        }
        this.doImport = doImport;
      },
      clear() {
        this.list = [];
        this.pageList = [];
        this.failedList = [];
        this.failedPageList = [];
        this.columns = [];
        this.paging.pages = 0;
        this.paging.page = 1;
        this.failedPaging.page = 1;
        this.currentStatus = 1;
        this.currentProcessPage = 1;
        this.skuMap.clear();
      },
      begin() {
        if (this.skuMap.size <= 0) {
          this.$message.warning('请选择文件');
          return;
        }
        if (this.autoCheck) {
          this.checkPage(1);
        } else {
          this.goImport();
        }
      },
      finish() {
        this.$emit('finish', this.skuMap);
        this.visible = false;
      },
      goImport() {
        this.currentStatus = 3;
        if (this.batch) {
          this.processPage(1);
        } else if (!this.doImport) {
          this.finish();
        } else {
          this.doImport(this.list).then(() => {
            this.done();
          });
        }
      },
      processPage(page) {
        this.currentProcessPage = page;
        let pageData = this.doPage(this.list, page, this.paging.pageSize);
        this.doImport(pageData).then(() => {
          if (page < this.paging.pages && !this.cancel) {
            this.processPage(++page);
          } else {
            this.done();
          }
        });
      },
      search() {
        this.pageList = this.doPaging();
        this.paging.pages = Math.floor((this.list.length + this.paging.pageSize - 1)
          / this.paging.pageSize);
      },
      searchFailed() {
        this.failedPageList = this.doFailedPaging();
      },
      doPaging() {
        return this.doPage(this.list, this.paging.page, this.paging.pageSize);
      },
      doFailedPaging() {
        return this.doPage(this.failedList, this.failedPaging.page, this.failedPaging.pageSize);
      },
      doPage(list, page, pageSize) {
        let begin = (page - 1) * pageSize;
        let end = begin + pageSize;
        end = end >= list.length ? list.length : end;
        return list.slice(begin, end);
      },
      done() {
        this.currentStatus = 4;
      },
      remove(item) {
        this.list.splice(this.list.indexOf(item), 1);
        this.failedList.splice(this.failedList.indexOf(item), 1);
        this.skuMap.delete(item[this.skuCodeProp]);
        this.search();
        this.searchFailed();
      },
      handleClose() {
        this.$confirm('确认关闭？').then(() => {
          this.cancel = true;
          this.$emit('cancel');
          this.visible = false;
        });
      },
      change(data) {
        this.clear();
        if (this.columnBuilder) {
          this.columns = this.columnBuilder(data);
        } else {
          this.columns = this.buildColumns(data);
        }
        if (data != null && data.length > 1) {
          data.splice(0, 1);
        }
        if (this.columnValidator) {
          if (!this.columnValidator(this.columns)) {
            this.$message.error('模板数据错误，请检查是否缺少列或重新下载模板');
            return;
          }
        }
        this.list = data;
        this.search();
        this.currentStatus = 1;
        this.list.forEach(x => {
          x['规格编码'] = x['规格编码'].trim();
          this.skuMap.set(x[this.skuCodeProp], x);
        });
        this.$emit('change', data);
      },
      buildColumns(data) {
        return Object.values(data[0]).map(x => {
          return {prop: x, label: x};
        });
      },
      checkPage(page) {
        this.currentStatus = 2;
        this.currentProcessPage = page;
        let pageData = this.doPage(this.list, page, this.paging.pageSize);
        this.checkPageData(pageData).then(() => {
          if (page < this.paging.pages && !this.cancel) {
            this.checkPage(++page);
          } else {
            if (this.failedList.length > 0) {
              this.currentStatus = 1;
              this.searchFailed();
            } else {
              this.goImport();
            }
          }
        });
      },
      checkPageData(list) {
        let skuCodes = list.map(x => x[this.skuCodeProp]);
        let skuCodeSet = new Set(skuCodes);
        let skuCodesString = skuCodes.join();
        return SkuApi.listFullByCode(skuCodesString).then(skus => {
          skus.forEach(sku => {
            let s = this.skuMap.get(sku.skuCode);
            if (s) {
              skuCodeSet.delete(sku.skuCode);
              Object.assign(s, sku);
            }
          });
          if (skuCodeSet.size > 0) {
            skuCodeSet.forEach(x => {
              this.failedList.push(this.skuMap.get(x));
            });
          }
        });
      }
    }
  };
</script>