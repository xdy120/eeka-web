<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="85px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input v-model="filter.batchId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交易号">
              <el-input v-model="filter.tradeId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="日志级别">
              <el-select v-model="filter.level" placeholder="请选择">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="转化时间">
              <el-date-picker v-model="filter.beginTime" type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="至">
              <el-date-picker v-model="filter.endTime" type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="logs" :height="mainHeight">
        <el-table-column label="序号" fixed type="index" width="50"></el-table-column>
        <el-table-column label="日志级别" prop="_source.level" width="100px"></el-table-column>
        <el-table-column label="店铺名称" prop="_source.storeName" width="150px"></el-table-column>
        <el-table-column label="交易号" prop="_source.tradeId" width="150px"></el-table-column>
        <go-date-time-column label="转化日期" prop="_source.@timestamp"
                             type="datetime"></go-date-time-column>
        <el-table-column label="内容" prop="_source.message"></el-table-column>
      </el-table>
    </el-main>

    <el-footer>
      <el-pagination :current-page.sync="pager.page" :page-size="pager.pageSize"
                     :total="pager.total" @current-change="search" @size-change="handleSizeChange"/>
    </el-footer>
  </el-container>
</template>
<script>
  import {Log, TableResize} from '@/libs/mixins/index';
  import {StoreSelector} from '@/modules/selector';
  import {LogApi} from '@/component/log/api';

  export default {
    mixins: [TableResize, Log],
    components: {StoreSelector},
    data() {
      return {
        logApi: LogApi,
        logIndex: 'translate-order-*'
      };
    },
    methods: {
      buildFilter(query) {
        if (this.filter.batchId) {
          query.push({match: {'batchId': this.filter.batchId}});
        }
        if (this.filter.tradeId) {
          query.push({match: {'tradeId': this.filter.tradeId}});
        }
        if (this.filter.storeId) {
          query.push({match: {'storeId': this.filter.storeId}});
        }
      }
    }
  };
</script>