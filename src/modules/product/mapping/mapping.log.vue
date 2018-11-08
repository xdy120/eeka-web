<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" label-width="100px" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="平台商品ID">
              <el-input v-model="filter.mallProductId" placeholder="只能单值查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台规格ID">
              <el-input v-model="filter.mallSkuId" placeholder="只能单值查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商家商品编码">
              <el-input v-model="filter.mallProductOutCode" placeholder="只能单值查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商家规格编码">
              <el-input v-model="filter.mallSkuOutCode" placeholder="只能单值查询"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
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
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="_source.storeName" label="店铺" width="150px"></el-table-column>
        <el-table-column prop="_source.mallProductId" label="平台商品ID"
                         width="150px"></el-table-column>
        <el-table-column prop="_source.mallSkuId" label="平台规格ID" width="150px"></el-table-column>
        <el-table-column prop="_source.mallProductOutCode" label="商家商品编码"
                         width="120px" sortable></el-table-column>
        <el-table-column prop="_source.mallSkuOutCode" label="商家规格编码"
                         width="120px" sortable></el-table-column>
        <go-date-time-column label="操作时间" prop="_source.@timestamp"
                             type="datetime"></go-date-time-column>
        <el-table-column prop="_source.oper" label="操作人" width="100px"></el-table-column>
        <el-table-column prop="_source.message" label="内容"></el-table-column>
      </el-table>
    </el-main>

    <el-footer>
      <el-pagination :current-page.sync="pager.page" :page-size="pager.pageSize"
                     :total="pager.total" @current-change="search" @size-change="handleSizeChange"/>
    </el-footer>
  </el-container>
</template>
<script>
  import {Log, TableResize} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/selector';
  import {LogApi} from '@/component/log/api';

  export default {
    mixins: [TableResize, Log],
    components: {StoreSelector},
    data() {
      return {
        logApi: LogApi,
        logIndex: 'product-mall-mapping-*'
      };
    },
    methods: {
      buildFilter(query) {
        if (this.filter.mallProductId) {
          query.push({match: {'mallProductId': this.filter.mallProductId}});
        }
        if (this.filter.mallSkuId) {
          query.push({match: {'mallSkuId': this.filter.mallSkuId}});
        }
        if (this.filter.mallProductOutCode) {
          query.push({match: {'mallProductOutCode': this.filter.mallProductOutCode}});
        }
        if (this.filter.mallSkuOutCode) {
          query.push({match: {'mallSkuOutCode': this.filter.mallSkuOutCode}});
        }
        if (this.filter.storeId) {
          query.push({match: {'storeId': this.filter.storeId}});
        }
      }
    }
  };
</script>