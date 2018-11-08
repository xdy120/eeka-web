<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row>
          <el-col :span="6">
            <el-form-item label="借出单号">
              <el-input v-model="filter.stockLoanOutCodes"
                        :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库仓库">
              <virtual-warehouse-selector
                  v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="StockLoanOutStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库状态">
              <enum-selector v-model="filter.outStatuses" multiple
                             enum-name="OutStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="借调人">
              <el-input v-model="filter.loanUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="制单时间">
              <go-date-time-picker v-model="filter.createdTimeBegin">
              </go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.createdTimeEnd">
              </go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <three-checkbox style="margin-left: 5px" v-model="filter.overdue">超期</three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.needReturn">归还</three-checkbox>
          </el-col>

        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="showCreator()">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <go-boolean-column prop="needReturn" label="需归还" width="50"></go-boolean-column>
        <go-link-column @click="showDetailEditor" label="借出单号" prop="stockLoanOutCode"
                        width="140"></go-link-column>
        <go-enum-column label="状态" prop="status" enum-name="StockLoanOutStatus"></go-enum-column>
        <go-enum-column label="出库状态" prop="outStatus" enum-name="OutStatus"></go-enum-column>
        <el-table-column label="借调类型" prop="loanType"></el-table-column>
        <go-date-column label="预计归还日期" prop="expectReturnDate" width="120px"></go-date-column>
        <go-quantity-column label="超期天数" width="80">
          <template slot-scope="scope">
            <template>
              {{overdueDay(scope.row)}}
            </template>
          </template>
        </go-quantity-column>
        <el-table-column label="借调人" prop="loanUser"></el-table-column>
        <el-table-column label="联系方式" prop="telephone"></el-table-column>
        <el-table-column label="联系地址" prop="address"></el-table-column>
        <el-table-column label="出库仓库" prop="virtualWarehouseName" width="120px"></el-table-column>
        <el-table-column label="制单人" prop="creator" width="120px"></el-table-column>
        <go-date-time-column label="制单日期" prop="createdTime" width="120px"></go-date-time-column>
        <el-table-column label="审核人" prop="auditor" width="120px"></el-table-column>
        <go-date-time-column label="审核日期" prop="auditedTime" width="120px"></go-date-time-column>
        <el-table-column label="品牌" prop="brandName"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <go-wms-button v-if="scope.row.status==='AUDITED'||scope.row.status==='NOTICE_FAILED'"
                           @click="noticeWms(scope.row)" :disabled="isDisabled"></go-wms-button>
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row,'审核后不可修改')"></go-audit-button>
            <go-cancel-button v-if="scope.row.status!=='CANCEL'&&scope.row.outStatus==='NO_OUT'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <go-tooltip-button v-if="scope.row.status!=='CANCEL'&&scope.row.outStatus!=='ALL_OUT'" @click="delay(scope.row)"
                               tooltip="延期"></go-tooltip-button>
            <log-popover module-name="STOCK_LOAN_OUT"
                         :biz-id="scope.row.stockLoanOutId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <out-creator ref="creator" @ok="search"></out-creator>
    <out-editor ref="editor" @ok="search"></out-editor>
    <detail-edit ref="detailEditor" @ok="search"></detail-edit>
    <delay ref="delay" @ok="search"></delay>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins/index';
  import {Placeholders} from '@/libs/util';
  import {VirtualWarehouseSelector} from '@/modules/selector';
  import {StockLoanOutApi} from './api';
  import {LogPopover} from '@/component/log/index';
  import OutCreator from './loan.out.create.vue';
  import OutEditor from './loan.out.edit.vue';
  import DetailEdit from './loan.out.detail.edit.vue';
  import Delay from './loan.out.delay';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      OutEditor, OutCreator, DetailEdit, VirtualWarehouseSelector, LogPopover, Delay
    },
    props: {},
    data() {
      return {
        api: StockLoanOutApi,
        pk: 'stockLoanOutId',
        nowDay: parseInt(new Date().getTime() / (1000 * 60 * 60 * 24)),
        isDisabled: false,
        Placeholders
      };
    },
    methods: {
      delay(row) {
        this.$refs.delay.show(row);
      },
      noticeWms(row) {
        this.isDisabled = true;
        this.api.noticeWms(row).then(() => {
          this.isDisabled = false;
          this.search();
        }).catch(() => {
          this.isDisabled = false;
        });
      },
      clickSearch() {
        this.search();
      },
      overdueDay(row) {
        let newDate = (Date.parse(row.expectReturnDate)) / (1000 * 60 * 60 * 24);
        let overdueDay = this.nowDay - newDate;
        return overdueDay > 0 ? overdueDay : 0;
      },
    },
  };
</script>