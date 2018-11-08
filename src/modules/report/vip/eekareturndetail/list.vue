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
            <el-form-item label="日期" prop="lastInTimeBegin" >
              <go-date-picker valueFormat="yyyy-MM-dd HH:mm:ss" v-model="filter.lastInTimeBegin"></go-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到" prop="lastInTimeEnd" >
              <go-date-picker valueFormat="yyyy-MM-dd HH:mm:ss" v-model="filter.lastInTimeEnd"></go-date-picker>
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
      <el-button @click="exportVipRetrunDetail">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="200"></el-table-column>
        <el-table-column label="退货单号" prop="vipReturnNoticeCode" width="150"></el-table-column>
        <el-table-column label="规格编码" prop="skuCode" width="150px"></el-table-column>
        <go-money-column label="金额" prop="refundableAmount" width="100px"></go-money-column>
        <go-quantity-column label="通知数量" prop="noticeQuantity" width="100px"></go-quantity-column>
        <go-quantity-column label="入库数量" prop="inQuantity" width="100px"></go-quantity-column>
        <el-table-column label="入库时间" prop="lastInTime" width="160px"></el-table-column>
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
  import {ReportVipReturnDetailApi} from '@/modules/report/api';
  import {ExpressSelector, StoreSelector, WarehouseSelector} from '@/modules/selector';
  import {Util, ValidateRules} from '@/libs/util';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      ExpressSelector,
      StoreSelector, WarehouseSelector
    },
    data() {
      return {
        api: ReportVipReturnDetailApi,
        paging: {page: 1, pageSize: 20},
        columns: [],
        filter: {statisticsType: 'month'},
        rules: {
          lastInTimeBegin: ValidateRules.required,
          lastInTimeEnd: ValidateRules.required
        }
      };
    },
    methods: {
      searchValidate () {
        this.$refs.filterForm.validate().then(() => {
          this.search();
        });
      },
      exportVipRetrunDetail() {
        if (!this.filter.lastInTimeBegin && !this.filter.lastInTimeEnd) {
          this.$message.warning('日期不能为空');
          return;
        }
        this.exportData(value=>this.api.exportData(value, this.filter));
      }
    }
  };
</script>