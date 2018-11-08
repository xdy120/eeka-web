<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector multiple v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货时间">
              <go-date-time-picker v-model="filter.deliveryTimeBegin"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.deliveryTimeEnd"></go-date-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
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
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickQuery">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="exportVipSales">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="180px"></el-table-column>
        <el-table-column label="商品编码" prop="productCode" width="120px" sortable></el-table-column>
        <el-table-column label="商品名称" prop="productName" width="120px"></el-table-column>
        <el-table-column label="规格编码" prop="skuCode" width="120px" sortable></el-table-column>
        <el-table-column label="规格名称" prop="skuName" width="120px"></el-table-column>
        <go-quantity-column label="发货数量" prop="quantity" width="120px"></go-quantity-column>
        <go-money-column label="销售金额" prop="sellingAmount" width="100px"></go-money-column>
        <go-date-time-column label="发货时间" prop="lastOutTime" width="150px"></go-date-time-column>
      </el-table>
    </el-main>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins/index';
  import {ReportVipSalesApi} from '@/modules/report/api';
  import {StoreSelector} from '@/modules/selector';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      StoreSelector
    },
    props: {},
    data() {
      return {
        api: ReportVipSalesApi,
        rules: {}
      };
    },
    methods: {
      clickQuery(){
        if (!this.filter.deliveryTimeBegin && !this.filter.deliveryTimeEnd) {
          this.$message.warning('发货时间不能为空');
          return;
        }
        this.clickSearch();
      },
      exportVipSales() {
        if (!this.filter.deliveryTimeBegin && !this.filter.deliveryTimeEnd) {
          this.$message.warning('发货时间不能为空');
          return;
        }
        this.exportData(value=>this.api.exportVipSales(value, this.filter));
      },
    }
  };
</script>