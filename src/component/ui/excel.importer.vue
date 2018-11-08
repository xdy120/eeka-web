<template>
  <el-dialog :visible.sync="visible" :title="title" :before-close="dialogCloseConfirm"
             append-to-body :fullscreen="true">
    <excel-import ref="uploader" @change="change" :disabled="fileDisabled"
                  :template-url="templateUrl"></excel-import>
    <slot name="header"></slot>
    <el-table :data="pageList" height="300" v-if="hasData">
      <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop"
                       :label="item.label" :width="item.width"></el-table-column>
      <el-table-column fixed="right">
        <template slot-scope="scope">
          <go-delete-button @click="remove(scope.$index)"></go-delete-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="14">
        <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize"
                       :total="list.length" layout="prev,pager,next,total"
                       @current-change="search"></el-pagination>
      </el-col>
      <el-col :span="10" style="padding: 2px 5px">
        <slot></slot>
      </el-col>
    </el-row>
    <el-progress :text-inside="true" status="success" :stroke-width="18" :percentage="percentage"
                 style="margin-top: 10px"></el-progress>
    <div slot="footer" class="dialog-footer">
      <el-button @click="run" :disabled="buttonDisabled">{{buttonText}}</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Assert} from '@/libs/util';
  import ExcelImport from './excel.import';

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
        default: 100
      },
      columnBuilder: {
        type: Function
      },
      validator: {
        type: Function
      },
      templateUrl: String,
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
    },
    components: {ExcelImport},
    data() {
      return {
        visible: false,
        hasData: true,
        currentStatus: this.status,
        columns: [],
        pageList: [],
        list: [],
        currentProcessPage: 0,
        paging: {
          pages: 0,
          pageSize: this.batchSize,
          page: 1
        }
      };
    },
    watch: {
      status(val) {
        this.currentStatus = val;
      }
    },
    computed: {
      percentage() {
        return this.paging.pages > 0 ? this.currentProcessPage * 100 / this.paging.pages : 0;
      },
      fileDisabled() {
        return Assert.inArray(this.currentStatus, [2, 3]);
      },
      buttonDisabled() {
        return this.list.length === 0 || this.currentStatus === 2;
      },
      buttonText() {
        switch (this.currentStatus) {
          case 1:
            return '开始导入';
          case 2:
            return '导入中...';
          case 3:
            return '导入完成';
        }
      }
    },
    methods: {
      show(doImport) {
        this.list = [];
        this.pageList = [];
        this.columns = [];
        this.visible = true;
        this.currentProcessPage = 0;
        this.paging.pages = 0;
        this.paging.page = 1;
        this.currentStatus = 1;
        if (this.$refs.uploader) {
          this.$refs.uploader.clearFile();
        }
        this.doImport = doImport;
      },
      run() {
        switch (this.currentStatus) {
          case 1:
            if (this.validator) {
              this.validator().then(this.begin);
            } else {
              this.begin();
            }
            break;
          case 3:
            this.$emit('finish');
            this.visible = false;
            break;
        }
      },
      begin() {
        this.currentStatus = 2;
        if (this.batch) {
          this.processPage(1);
        } else {
          this.doImport(this.list).then(() => {
            this.done();
          });
        }
      },
      processPage(page) {
        this.currentProcessPage = page;
        this.paging.page = page;
        this.pageList = this.doPaging();
        this.doImport(this.pageList).then(() => {
          if (page < this.paging.pages) {
            this.processPage(++page);
          } else {
            this.done();
          }
        });
      },
      search() {
        this.pageList = this.doPaging();
      },
      doPaging() {
        let begin = (this.paging.page - 1) * this.paging.pageSize;
        let end = begin + this.paging.pageSize;
        end = end >= this.list.length ? this.list.length : end;
        return this.list.slice(begin, end);
      },
      done() {
        this.currentStatus = 3;
      },
      remove(index) {
        this.list.splice(index, 1);
        this.search();
      },
      handleClose() {
        this.$confirm('确认关闭？').then(() => {
          this.$emit('cancel');
          this.visible = false;
        });
      },
      change(data) {
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
        this.paging.pages = Math.floor((data.length + this.paging.pageSize - 1)
          / this.paging.pageSize);
        this.search();
        this.currentStatus = 1;
        this.$emit('change', data);
      },
      buildColumns(data) {
        return Object.values(data[0]).map(x => {
          return {prop: x, label: x};
        });
      }
    }
  };
</script>