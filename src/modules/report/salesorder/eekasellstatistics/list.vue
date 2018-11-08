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
            <el-form-item label="日期" prop="createTimeBegin" >
              <go-date-picker valueFormat="yyyy-MM-dd HH:mm:ss" v-model="filter.createTimeBegin"></go-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到" prop="createTimeEnd" >
              <go-date-picker valueFormat="yyyy-MM-dd HH:mm:ss" v-model="filter.createTimeEnd"></go-date-picker>
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
      <el-button @click="exportSalesDetailStatistics">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="200"></el-table-column>
        <go-quantity-column label="发货件数" prop="salesQuantity" width="100"></go-quantity-column>
        <go-money-column label="发货金额" prop="salesAmount" width="100px"></go-money-column>
        <go-quantity-column label="退货件数" prop="returnQuantity" width="100px"></go-quantity-column>
        <go-money-column label="退货金额" prop="returnAmount" width="100px"></go-money-column>
        <go-quantity-column label="实际销售件数" prop="actualQuantity" width="100px"></go-quantity-column>
        <go-money-column label="实际销售金额" prop="actualAmount" width="100px"></go-money-column>
        <go-money-column label="数量退货率(%)" prop="returnQuantityRatio" width="100px"></go-money-column>
        <go-money-column label="金额退货率(%)" prop="returnAmountRatio" width="100px"></go-money-column>
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
  import {ReportB2CSellStatisticsApi} from '@/modules/report/api';
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
        api: ReportB2CSellStatisticsApi,
        rules: {
          createTimeBegin: ValidateRules.required,
          createTimeEnd: ValidateRules.required
        }
      };
    },
    methods: {
      searchValidate () {
        this.$refs.filterForm.validate().then(() => {
          this.search();
        });
      },
      exportSalesDetailStatistics() {
        if (!this.filter.createTimeBegin && !this.filter.createTimeEnd) {
          this.$message.warning('日期不能为空');
          return;
        }
        this.exportData(value=>this.api.exportData(value, this.filter));
      }
    }
  };
</script>