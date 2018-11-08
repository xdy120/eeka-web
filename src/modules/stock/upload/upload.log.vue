<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input v-model="filter.batchId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select v-model="filter.status">
                <el-option value="成功" label="成功"></el-option>
                <el-option value="失败" label="失败"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上传日期">
              <el-date-picker v-model="filter.beginTime" type="datetime"
                              placeholder="开始"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至">
              <el-date-picker v-model="filter.endTime" type="datetime"
                              placeholder="结束"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>

    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
        <!--<el-button @click="exportLogs()">导出</el-button>-->
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="logs" :height="mainHeight">
        <el-table-column prop="_source.batchId" label="批次号" :width="150"/>
        <el-table-column prop="_source.storeName" label="店铺" :width="100"/>
        <el-table-column prop="_source.productCode" label="商品编码" :width="150" sortable/>
        <el-table-column prop="_source.skuCode" label="规格编码" :width="150" sortable/>
        <el-table-column prop="_source.quantity" label="上传数量" :width="100"/>
        <el-table-column prop="_source.status" label="状态" :width="80"/>
        <el-table-column prop="_source.oper" label="操作人" :width="80"/>
        <go-date-time-column label="上传日期" prop="_source.@timestamp"
                             type="datetime"></go-date-time-column>
        <el-table-column prop="_source.message" label="内容"/>
      </el-table>
    </el-main>

    <el-footer>
      <el-pagination :current-page.sync="pager.page" :page-size="pager.pageSize"
                     :total="pager.total" @current-change="search" @size-change="handleSizeChange"/>
    </el-footer>
  </el-container>
</template>
<script>
  import {TableResize,Log,List} from '@/libs/mixins/index';
  import {StoreSelector} from '@/modules/selector';
  import {LogApi} from '@/component/log/api';
  import {StockUploadApi} from  './api';

  export default {
    mixins: [TableResize,Log],
    components: {StoreSelector,StockUploadApi},
    data() {
      return {
        logApi: LogApi,
        StockUploadApi:StockUploadApi,
        logIndex: 'stock-upload-*'
      };
    },
    methods: {
      buildFilter(query) {
        if (this.filter.skuCode) {
          query.push({match: {'skuCode': this.filter.skuCode}});
        }
        if (this.filter.productCode) {
          query.push({match: {'productCode': this.filter.productCode}});
        }
        if (this.filter.storeId) {
          query.push({match: {'storeId': this.filter.storeId}});
        }
        if (this.filter.batchId) {
          query.push({match: {'batchId': this.filter.batchId}});
        }
        if (this.filter.status) {
          query.push({match: {'status': this.filter.status}});
        }
      },
      exportLogs(){
        this.exportData(value => this.StockUploadApi.exportLogs(value, this.filter));
      }
    }
  };
</script>