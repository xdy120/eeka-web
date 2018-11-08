<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector multiple v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支付时间">
              <go-date-time-picker v-model="filter.mallPaidTimeBegin"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.mallPaidTimeEnd"></go-date-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickQuery">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="exportSalesOrder">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="120px"></el-table-column>
        <go-quantity-column label="销售总数量" prop="quantity" width="120px"></go-quantity-column>
        <go-money-column label="结算总金额" prop="settlementAmountTotal" width="120px"></go-money-column>
        <go-money-column label="优惠总金额" prop="discounAmountTotal"
                         width="120px"></go-money-column>
        <go-quantity-column label="退货数量" prop="returnQuantity" width="120px"></go-quantity-column>
        <go-money-column label="退货金额" prop="returnAmountTotal"
                         width="120px"></go-money-column>
        <go-money-column label="退货率" prop="refundRate"
                         width="120px"></go-money-column>
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
  import {ReportSalesOrderSalesStatisticsApi} from '@/modules/report/api';
  import {StoreSelector} from '@/modules/selector';
  import {Util} from '@/libs/util';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      StoreSelector
    },
    props: {},
    data() {
      return {
        api: ReportSalesOrderSalesStatisticsApi,
        rules: {}
      };
    },
    methods: {
      clickQuery(){
        if (!this.filter.mallPaidTimeBegin && !this.filter.mallPaidTimeEnd) {
          this.$message.warning('支付时间不能为空');
          return;
        }
        this.clickSearch();
      },
      exportSalesOrder() {
        if (!this.filter.mallPaidTimeBegin && !this.filter.mallPaidTimeEnd) {
          this.$message.warning('支付时间不能为空');
          return;
        }
        this.exportData(value=>this.api.exportData(value, this.filter));
      }
    }
  };
</script>