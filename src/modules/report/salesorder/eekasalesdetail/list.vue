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
            <el-form-item label="日期" prop="deliveryTimeBegin" >
              <go-date-picker valueFormat="yyyy-MM-dd HH:mm:ss" v-model="filter.deliveryTimeBegin"></go-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到" prop="deliveryTimeEnd" >
              <go-date-picker valueFormat="yyyy-MM-dd HH:mm:ss" v-model="filter.deliveryTimeEnd"></go-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="searchValidate">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="exportSalesDetail">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="200"></el-table-column>
        <el-table-column label="发货单号" prop="dispatchOrderCode" width="150"></el-table-column>
        <el-table-column label="规格编码" prop="skuCode" width="150px"></el-table-column>
        <go-money-column label="金额" prop="settlementAmount" width="100px"></go-money-column>
        <go-quantity-column label="通知数量" prop="noticeQuantity" width="100px"></go-quantity-column>
        <go-quantity-column label="出库数量" prop="outQuantity" width="100px"></go-quantity-column>
        <el-table-column label="快递公司" prop="expressName" width="100px"></el-table-column>
        <el-table-column label="快递单号" prop="expressNo" width="150px"></el-table-column>
        <el-table-column label="发货时间" prop="deliveryTime" width="160px"></el-table-column>
      </el-table>
    </el-main>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="searchValidate" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins/index';
  import {ReportSalesDetailApi} from '@/modules/report/api';
  import {ExpressSelector, StoreSelector, WarehouseSelector} from '@/modules/selector';
  import {Util,ValidateRules} from '@/libs/util';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      ExpressSelector,
      StoreSelector, WarehouseSelector
    },
    data() {
      return {
        api: ReportSalesDetailApi,
        rules: {
          deliveryTimeBegin: ValidateRules.required,
          deliveryTimeEnd: ValidateRules.required
        }
      };
    },
    methods: {
      searchValidate () {
        this.$refs.filterForm.validate().then(() => {
          this.search();
        });
      },
      exportSalesDetail() {
        if (!this.filter.deliveryTimeBegin && !this.filter.deliveryTimeEnd) {
          this.$message.warning('日期不能为空');
          return;
        }
        this.exportData(value=>this.api.exportData(value, this.filter));
      }
    }
  };
</script>