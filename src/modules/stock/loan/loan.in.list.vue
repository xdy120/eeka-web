<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch">
        <el-row>
          <el-col :span="6">
            <el-form-item label="还入单号">
              <el-input v-model="filter.stockLoanInCodes"
                        :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库仓库">
              <virtual-warehouse-selector
                  v-model="filter.virtualWarehouseId"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="StockLoanInStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库状态">
              <enum-selector v-model="filter.inStatuses" multiple
                             enum-name="InStatus"></enum-selector>
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
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="还入单号" prop="stockLoanInCode"
                        width="140"></go-link-column>
        <el-table-column label="借出单号" prop="stockLoanOutCode"
                         width="140"></el-table-column>
        <go-enum-column label="状态" prop="status" enum-name="StockLoanInStatus"></go-enum-column>
        <go-enum-column label="入库状态" prop="inStatus" enum-name="InStatus"></go-enum-column>
        <el-table-column label="借调人" prop="loanUser"></el-table-column>
        <el-table-column label="入库仓库" prop="virtualWarehouseName" width="120px"></el-table-column>
        <el-table-column label="制单人" prop="creator" width="120px"></el-table-column>
        <go-date-time-column label="制单时间" prop="createdTime" width="120px"></go-date-time-column>
        <el-table-column label="审核人" prop="auditor" width="120px"></el-table-column>
        <go-date-time-column label="审核时间" prop="auditedTime" width="120px"></go-date-time-column>
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <go-wms-button v-if="scope.row.status==='AUDITED'||scope.row.status==='FAILED'"
                           @click="noticeWms(scope.row)" :disabled="isDisabled"></go-wms-button>
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row,'审核后不可修改')"></go-audit-button>
            <go-cancel-button v-if="scope.row.status!=='CANCEL'&&scope.row.outStatus!=='NO_IN'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <log-popover module-name="STOCK_LOAN_IN"
                         :bizId="scope.row.stockLoanInId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <in-creator ref="creator" @ok="search"></in-creator>
    <in-editor ref="editor" @ok="search"></in-editor>
    <detail-edit ref="detailEditor" @ok="search"></detail-edit>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {Placeholders} from '@/libs/util';
  import {DataDictItemSelector, VirtualWarehouseSelector} from '@/modules/selector';
  import {StockLoanInApi} from './api';
  import {LogPopover} from '@/component/log';
  import InCreator from './loan.in.create.vue';
  import InEditor from './loan.in.edit.vue';
  import DetailEdit from './loan.in.detail.edit.vue';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      InEditor, InCreator, DetailEdit, VirtualWarehouseSelector, LogPopover, DataDictItemSelector
    },
    props: {},
    data() {
      return {
        api: StockLoanInApi,
        pk: 'stockLoanInId',
        isDisabled: false,
        Placeholders
      };
    },
    methods: {
      noticeWms(row) {
        this.isDisabled = true;
        this.api.noticeWms(row).then(() => {
          this.isDisabled = false;
          this.search();
        }).catch(() => {
          this.isDisabled = false;
        });
      },
    }
  };
</script>