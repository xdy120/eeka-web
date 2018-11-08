<template>
  <el-container>
    <el-aside width="600px">
      <el-card style="height: calc(100% - 5px)" body-style="height: calc(100% - 20px);padding:10px">
        <el-container>
          <el-header height="70px" class="oms-search">
            <el-row :gutter="10">
              <el-col :span="8">
                <stock-upload-setting-selector v-model="strategyId"></stock-upload-setting-selector>
              </el-col>
              <el-col :span="16">
                <sku-selector :quantity="isShowQuantity" @confirm="selectSkus"></sku-selector>
                <el-button @click="showImportSku">导入</el-button>
                <el-button type="warning" @click="clearList">清空</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 10px">
              <el-col :span="8">
                <el-select v-model="uploadType" :clearable="false" size="mini">
                  <el-option label="按系统库存上传" value="cover"></el-option>
                  <el-option label="按导入数量上传" value="fixCover"></el-option>
                  <el-option label="按导入数量增量上传" value="increment"></el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-button @click="upload" :disabled="disabledUploadButton">开始上传</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main v-resize="mainHeight">
            <el-table :data="list" :height="mainHeight">
              <el-table-column prop="productCode" label="商品编码"></el-table-column>
              <el-table-column prop="productName" label="商品名称"></el-table-column>
              <el-table-column prop="skuCode" label="规格编码"></el-table-column>
              <el-table-column prop="skuName" label="规格名称"></el-table-column>
              <go-boolean-column prop="combination" label="套装"></go-boolean-column>
              <el-table-column label="数量" v-if="isShowQuantity" width="90">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.quantity"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="60">
                <template slot-scope="scope">
                  <go-delete-button @click="list.splice(scope.$index,1)"/>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer></el-footer>
        </el-container>
      </el-card>
    </el-aside>
    <el-main>
      <el-card style="height: calc(100% - 5px);margin-left: 10px"
               body-style="height: calc(100% - 20px);padding:10px">
        <el-container>
          <el-header>
            <el-form>
              <el-row :gutter="10">
                <el-col :span="7">
                  <el-form-item label="批次号">
                    <el-input v-model="filter.batchId"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="状态" label-width="55px">
                    <el-select v-model="filter.status">
                      <el-option value="失败" label="失败"></el-option>
                      <el-option value="成功" label="成功"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-button @click="search" :disabled="disabledLogButton" type="success"
                             icon="el-icon-refresh">刷新
                  </el-button>
                  <el-button type="warning" @click="clearLog">清空</el-button>
                  <el-button @click="failReupload()">失败重传</el-button>
                  <el-button @click="exportLogs()">导出</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-header>
          <el-main>
            <el-table :data="logs" :height="mainHeight">
              <el-table-column prop="_source.batchId" label="批次号" :width="150"/>
              <el-table-column prop="_source.productCode" label="商品编码" :width="150" sortable/>
              <el-table-column prop="_source.skuCode" label="规格编码" :width="150" sortable/>
              <el-table-column prop="_source.quantity" label="上传数量" :width="80"/>
              <el-table-column prop="_source.status" label="状态" :width="80"/>
              <el-table-column prop="_source.message" label="内容"/>
              <go-date-time-column prop="_source.@timestamp" label="上传日期"
                                   type="datetime"></go-date-time-column>
            </el-table>
            <sku-importer ref="skuImporter" :must-columns="mustColumns"
                          templateUrl="/file/template/stock_upload.xlsx/库存上传导入模板"></sku-importer>
          </el-main>
          <el-footer>
            <el-pagination :current-page.sync="pager.page" :page-size="pager.pageSize"
                           :total="pager.total" @current-change="search"
                           @size-change="handleSizeChange"/>
          </el-footer>
        </el-container>
      </el-card>
    </el-main>
  </el-container>
</template>
<script>
  import {Log, TableResize} from '@/libs/mixins';
  import {SkuSelector, StockUploadSettingSelector} from '@/modules/selector';
  import {LogApi} from '@/component';
  import {Assert, Util} from '@/libs/util';
  import {MustColumns, StockUploadApi} from './api';
  import {SkuImporter} from '@/modules/product';
  import {StrategyProduct} from '../util';

  export default {
    mixins: [TableResize, Log],
    components: {SkuSelector, StockUploadSettingSelector, SkuImporter},
    data() {
      return {
        uploadType: 'cover',
        strategyId: null,
        list: [],
        filter: {
          batchId: null,
        },
        logApi: LogApi,
        logIndex: 'stock-upload-*',
        mustColumns: MustColumns,
        logParams: {},
        failedList: [],
        logFlag: false
      };
    },
    computed: {
      disabledLogButton() {
        return Assert.isEmpty(this.filter.batchId);
      },
      disabledUploadButton() {
        return Assert.isEmpty(this.strategyId) || this.list.length === 0;
      },
      isShowQuantity() {
        return this.uploadType === 'increment' || this.uploadType === 'fixCover';
      }
    },
    methods: {
      clearList() {
        this.list = [];
      },
      clearLog() {
        this.logs = [];
        this.pager.total = 0;
      },
      upload() {
        if (this.uploadType === 'increment') {
          StockUploadApi.increment({configId: this.strategyId, skus: this.list}).then(rsp => {
            this.filter.batchId = rsp;
          });
        } else if (this.uploadType === 'cover') {
          StockUploadApi.cover({configId: this.strategyId, skus: this.list}).then(rsp => {
            this.filter.batchId = rsp;
          });
        } else if (this.uploadType === 'fixCover') {
          StockUploadApi.fixedCover({configId: this.strategyId, skus: this.list}).then(rsp => {
            this.filter.batchId = rsp;
          });
        }
      },
      failReupload() {
        this.logParams.query = this.buildQuery();
        this.logParams.from = 0;
        this.logParams.size = 20;
        this.getLogs();
      },
      getLogs() {
        this.logApi.listIndex(this.logIndex, this.logParams).then(response => {
          let logs = response.hits.hits;
          this.getReuploadList(logs);
          if (response.hits.total > this.logParams.from + this.logParams.size) {
            this.logParams.from += this.logParams.size;
            this.getLogs();
          } else {
            this.logFlag = !this.logFlag;
          }
        });
      },
      getReuploadList(logs) {
        let failList = logs.filter(x => x._source.status === '失败').map(y => y._source.skuCode);
        if (failList.length > 0) {
          let reuploadList = this.list.filter(x => this.contains(failList, x.skuCode));
          if (reuploadList.length > 0) {
            reuploadList.forEach(x => this.failedList.push(x));
          }
        }
      },
      selectSkus(skus) {
        let data = [];
        skus.forEach(sku => {
          if (!this.list.some(x => x.skuId === sku.skuId)) {
            data.push(
              {
                productId: sku.productId,
                productCode: sku.productCode,
                productName: sku.productName,
                skuId: sku.skuId,
                skuCode: sku.skuCode,
                skuName: sku.skuName
              });
          }
        });
        this.list.push(...data);
      },
      showImportSku() {
        this.$refs.skuImporter.show(skus => {
          return new Promise(resolve => {
            this.list = [];
            for (let sku of skus) {
              let skuNumber = new StrategyProduct(sku);
              skuNumber.quantity = Util.getNumberProp(sku, '数量');
              skuNumber.skuCode = Util.getStringProp(sku, '规格编码');
              this.list.push(skuNumber);
            }
            return resolve();
          });
        });
      },
      buildFilter(query) {
        if (this.filter.batchId) {
          query.push({match: {'batchId': this.filter.batchId}});
        }
        if (this.filter.status) {
          query.push({match: {'status': this.filter.status}});
        }
      },
      contains(arr, obj) {
        let i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      },
      exportLogs(){
        if (!this.filter.batchId){
          this.$message.warning('批次号不能为空!');
          return;
        }
        this.exportData(value => StockUploadApi.exportLogs(value, this.filter));
      }
    },
    watch: {
      ['logFlag'](val) {
        if (this.failedList.length === 0) {
          this.$message.warning('无上传失败');
          return;
        }
        this.list = this.failedList;
        this.failedList = [];
        this.upload();
      }
    }
  };
</script>