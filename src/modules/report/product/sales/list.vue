<template>
  <el-container>
    <el-header class="oms-search" height="90px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: right">
            <three-checkbox style="margin-left: 5px" v-model="filter.deliveryOnly">只查已发货</three-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="10">
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
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector multiple v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-row>
        <el-col :span="20">
          <el-button-group>
            <go-search-button @click="clickQuery">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
            <el-button @click="showExport">导出</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"/>
        <el-table-column label="发货时间" prop="deliveryTime" width="150px"/>
        <el-table-column label="支付时间" prop="mallPaidTime" width="150px"/>
        <el-table-column label="商品编码" prop="productCode" width="120px" sortable/>
        <el-table-column label="商品名称" prop="productName" width="120px"/>
        <el-table-column label="规格编码" prop="skuCode" width="120px" sortable/>
        <el-table-column label="规格名称" prop="skuName" width="120px"/>
        <go-quantity-column label="销量" prop="quantity" width="120px"/>
        <go-money-column label="结算金额" prop="settlementAmount" width="100px"/>
        <go-money-column label="财务成本" prop="costPrice" width="100px"/>
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
  import {ReportProductSalesApi} from '@/modules/report/api';
  import {Placeholders} from '@/libs/util';
  import {StoreSelector} from '@/modules/selector';

  export default {
    mixins: [TableResize, List, PageList],
    components: {StoreSelector},
    props: {},
    data() {
      return {
        api: ReportProductSalesApi,
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
      showExport() {
        if (!this.filter.mallPaidTimeBegin && !this.filter.mallPaidTimeEnd) {
          this.$message.warning('支付时间不能为空');
          return;
        }
        this.exportData(value=>this.api.exportSales(value, this.filter));
      },
    }
  };
</script>