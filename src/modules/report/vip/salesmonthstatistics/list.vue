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
            <el-form-item label="统计类型">
              <el-select v-model="filter.statisticsType" :clearable="false" placeholder="请选择">
                <el-option label="按月" value="month"></el-option>
                <el-option label="按年" value="year"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <div v-show="filter.statisticsType ==='year'">
            <el-col :span="6">
              <el-form-item label="起始年" prop="timeBegin">
                <el-date-picker v-model="filter.timeBegin" type="year" placeholder="按制单时间"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终止年" prop="timeEnd">
                <el-date-picker v-model="filter.timeEnd" type="year" placeholder="按制单时间"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
          </div>
          <div v-show="filter.statisticsType ==='month'">
            <el-col :span="6">
              <el-form-item label="起始月" prop="timeBegin">
                  <el-date-picker v-model="filter.timeBegin" type="month" placeholder="按制单时间"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终止月" prop="timeEnd">
                <el-date-picker v-model="filter.timeEnd" type="month" placeholder="按制单时间"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
          </div>

        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="searchValidate">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="exportSalesStatistics">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="150"></el-table-column>
        <go-money-column v-for="item in columns" :prop="item.prop" :label="item.label"
                         :key="item.prop"
                         width="100"></go-money-column>
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
  import {ReportVipSalesMonthStatisticsApi} from '@/modules/report/api';
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
        api: ReportVipSalesMonthStatisticsApi,
        paging: {page: 1, pageSize: 20},
        columns: [],
        filter: {statisticsType: 'month'},
        rules: {
          timeBegin: ValidateRules.required,
          timeEnd: ValidateRules.required
        }
      };
    },
    methods: {
      searchValidate() {
        this.$refs.filterForm.validate().then(() => {
          ReportVipSalesMonthStatisticsApi.list(this.filter, this.paging).then(res => {
            this.restColumn();
            if (res.columns.length > 0) {
              let columns;
              if (this.filter.statisticsType === 'month') {
                columns = res.columns.map(x => {
                  return {prop: x, label: `${x}月`};
                });
              } else if (this.filter.statisticsType === 'year') {
                columns = res.columns.map(x => {
                  return {prop: x, label: `${x}年`};
                });
              }
              this.columns.push(...columns);
            }
            this.list = res.data;
          });
        });
      },
      exportSalesStatistics() {
        this.exportData(value=>this.api.exportData(value, this.filter));
      },
      restColumn() {
        this.columns = [];
        this.list = [];
      },
      reset(){
        this.filter = {statisticsType: 'month'};
      }
    }
  };
</script>