<template>
  <el-container>
    <el-header class="oms-search" height="100px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: right">
            <three-checkbox style="margin-left: 5px" v-model="filter.oos">缺货</three-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector multiple v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="配货状态">
              <enum-selector enum-name="DispatchStatus"
                             v-model="filter.dispatchStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货状态">
              <enum-selector enum-name="DeliveryStatus"
                             v-model="filter.deliveryStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="预售类型">
              <enum-selector enum-name="PresellType" v-model="filter.presellType"></enum-selector>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="10">
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
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
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
      <el-button @click="exportSalesDetail">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="订单号" prop="salesOrderCode" width="120px"></el-table-column>
        <el-table-column label="平台交易号" prop="tradeId" width="120px"></el-table-column>
        <el-table-column label="商品编码" prop="productName" width="180px" sortable></el-table-column>
        <el-table-column label="商品名称" prop="productCode" width="120px"></el-table-column>
        <el-table-column label="规格编码" prop="skuName" width="180px" sortable></el-table-column>
        <el-table-column label="规格名称" prop="skuCode" width="120px"></el-table-column>
        <el-table-column label="付款时间" prop="paidTime" width="120px"></el-table-column>
        <go-enum-column prop="dispatchStatus" enum-name="DispatchStatus" label="配货状态" width="80px"
                        align="center"></go-enum-column>
        <go-enum-column prop="deliveryStatus" enum-name="DeliveryStatus" label="发货状态" width="80px"
                        align="center"></go-enum-column>
        <go-enum-column prop="presellType" enum-name="PresellType" label="预售状态" width="80px"
                        align="center"></go-enum-column>
        <go-enum-column prop="salesOrderDetailRefundStatus" enum-name="SalesOrderDetailRefundStatus"
                        label="退款状态" width="80px" align="center"></go-enum-column>
        <el-table-column label="店铺" prop="storeName" width="150px"></el-table-column>
        <go-money-column label="销售价" prop="sellingPrice" width="120px"></go-money-column>
        <go-quantity-column label="数量" prop="quantity" width="60px"></go-quantity-column>
        <go-money-column label="销售价" prop="sellingPrice"></go-money-column>
        <go-money-column label="销售金额" prop="sellingAmount"></go-money-column>
        <go-money-column label="结算价" prop="settlementPrice"></go-money-column>
        <go-money-column label="结算金额" prop="settlementAmount"></go-money-column>
        <go-money-column label="分销价" prop="distributionPrice"></go-money-column>
        <go-money-column label="分销金额" prop="distributionAmount"></go-money-column>
        <go-money-column label="实际金额" prop="actualAmount"></go-money-column>
        <go-money-column label="优惠金额" prop="discountAmount"></go-money-column>
        <el-table-column label="省份" prop="provinceName" width="120px"></el-table-column>
        <el-table-column label="城市" prop="cityName" width="120px"></el-table-column>
        <el-table-column label="区县" prop="districtName" width="120px"></el-table-column>
        <el-table-column label="快递名称" prop="expressName" width="120px"></el-table-column>
        <el-table-column label="快递单号" prop="expressNo" width="120px"></el-table-column>
        <el-table-column label="下单时间" prop="mallCreatedTime" width="120px"></el-table-column>
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
  import {ReportSalesOrderDetailApi} from '@/modules/report/api';
  import {StoreSelector} from '@/modules/selector';
  import {Placeholders} from '@/libs/util';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      StoreSelector
    },
    props: {},
    data() {
      return {
        api: ReportSalesOrderDetailApi,
        rules: {},
        Placeholders
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
      exportSalesDetail() {
        if (!this.filter.mallPaidTimeBegin && !this.filter.mallPaidTimeEnd) {
          this.$message.warning('支付时间不能为空');
          return;
        }
        this.exportData(value=>this.api.exportSalesDetail(value, this.filter));
      }
    }
  };
</script>