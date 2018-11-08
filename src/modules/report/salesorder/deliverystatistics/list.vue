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
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickQuery">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="exportDelivery">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="120px"></el-table-column>
        <go-quantity-column label="订单总数量" prop="orderQuantityTotal"
                            width="100px"></go-quantity-column>
        <go-quantity-column label="已发货订单" prop="orderDeliveryTotal"
                            width="100px"></go-quantity-column>
        <go-quantity-column label="未发货订单" prop="orderNotDeliveryTotal"
                            width="100px"></go-quantity-column>
        <go-quantity-column label="商品总数量" prop="productQuantity" width="100px"></go-quantity-column>
        <go-quantity-column label="已发货商品" prop="deliveryQuantity"
                            width="100px"></go-quantity-column>
        <go-quantity-column label="未发货商品" prop="notDeliveryQuantity"
                            width="100px"></go-quantity-column>
        <go-money-column label="订单总金额" prop="orderAmountTotal" width="100px"></go-money-column>
        <go-money-column label="已发货金额" prop="deliveryAmountTotal" width="100px"></go-money-column>
        <go-money-column label="未发货金额" prop="notDeliveryAmountTotal"
                         width="100px"></go-money-column>
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
  import {ReportSalesOrderDeliveryApi} from '@/modules/report/api';
  import {ExpressSelector, StoreSelector, WarehouseSelector} from '@/modules/selector';
  import {Util} from '@/libs/util';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      ExpressSelector,
      StoreSelector, WarehouseSelector
    },
    props: {},
    data() {
      return {
        api: ReportSalesOrderDeliveryApi,
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
      exportDelivery() {
        if (!this.filter.mallPaidTimeBegin && !this.filter.mallPaidTimeEnd) {
          this.$message.warning('支付时间不能为空');
          return;
        }
        this.exportData(value=>this.api.exportData(value, this.filter));
      }
    }
  };
</script>