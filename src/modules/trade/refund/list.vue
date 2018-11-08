<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="filter.refundOrderCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交易号">
              <el-input v-model="filter.tradeIds" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input v-model="filter.salesOrderCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退换货单号">
              <el-input v-model="filter.returnOrderCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="RefundOrderStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退款类型">
              <enum-selector v-model="filter.refundType" enum-name="RefundType"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退款方式">
              <data-dict-item-selector v-model="filter.refundMethod"
                                       :dataDictId="10305"></data-dict-item-selector>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-row>
        <el-col :span="10">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button-group>
            <el-button @click="showCreator()">新增</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange">
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column label="标记" :width="100" fixed>
          <template slot-scope="scope">
            <span v-if="scope.row.cod">到付</span>
            <span v-if="scope.row.quickRefund">急速</span>
            <span v-if="scope.row.refunded">已退</span>
          </template>
        </el-table-column>
        <el-table-column prop="refundOrderCode" label="单据编号" width="150" fixed></el-table-column>
        <go-enum-column label="状态" prop="status" enum-name="RefundOrderStatus"
                        fixed></go-enum-column>
        <el-table-column prop="storeName" label="店铺" width="100"></el-table-column>
        <go-enum-column prop="refundType" enum-name="RefundType" label="退款类型"></go-enum-column>
        <el-table-column prop="refundMethod" label="退款方式" width="100"></el-table-column>
        <el-table-column prop="tradeId" label="交易号" width="150"></el-table-column>
        <el-table-column prop="salesOrderCode" label="订单号" width="150"></el-table-column>
        <el-table-column prop="returnOrderCode" label="退换货单号" width="150"></el-table-column>
        <el-table-column prop="payeeNo" label="退入帐号" width="100"></el-table-column>
        <el-table-column prop="payeeName" label="退入户名" width="100"></el-table-column>
        <go-money-column prop="refundableAmount" label="应退金额" width="100"
                         sortable></go-money-column>
        <go-money-column prop="actualAmount" label="实退金额" width="100"></go-money-column>
        <el-table-column prop="returnReasonType" label="退款原因" width="100"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="creator" label="制单人" width="100"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间" width="100"></go-date-time-column>
        <el-table-column prop="auditor" label="审核人" width="100"></el-table-column>
        <go-date-time-column prop="auditedTime" label="审核时间" width="100"></go-date-time-column>
        <el-table-column prop="reviewer" label="复核人" width="100"></el-table-column>
        <go-date-time-column prop="checkedTime" label="复核时间" width="100"></go-date-time-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <go-invalid-button v-if="scope.row.status==='CREATED'"
                               @click="invalid(scope.row)"></go-invalid-button>
            <go-review-button v-if="scope.row.status==='AUDITED'"
                              @click="review(scope.row)"></go-review-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <tabs-footer ref="tabsFooter" @updated="scrollToRow">
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <refund-order-basic :parentData="selectedItem"></refund-order-basic>
        </el-tab-pane>
        <el-tab-pane label="明细" name="detail">
          <refund-order-detail :parentData="selectedItem"
                               :currentTab="currentTab"></refund-order-detail>
        </el-tab-pane>
        <el-tab-pane label="日志" name="log">
          <log-tab module-name="REFUND_ORDER" :parent-data="selectedItem" :prop="this.pk"
                   :current-tab="currentTab"></log-tab>
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <!--退换货单新增界面-->
    <refund-creator ref="creator" @ok="search"></refund-creator>
    <!--退款单编辑界面-->
    <refund-edit ref="editor" @ok="search"></refund-edit>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {DataDictItemSelector, StoreSelector} from '@/modules/base/index';
  import RefundEdit from './edit.vue';
  import {RefundOrderApi} from './api';
  import RefundOrderBasic from './basic.vue';
  import RefundOrderDetail from './detail.vue';
  import RefundCreator from './create.vue';
  import {LogTab} from '@/component/log';

  export default {
    name: 'RefundOrder',
    mixins: [List, PageList, TableResize],
    components: {
      StoreSelector,
      RefundEdit,
      RefundOrderBasic,
      RefundOrderDetail,
      DataDictItemSelector,
      RefundCreator,
      LogTab
    },
    data() {
      return {
        api: RefundOrderApi,
        pk: 'refundOrderId',
        currentTab: 'basic',
        currentEditOrder: null,
        advanceQueryVisible: false,
      };
    },
    methods: {
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
      }
    }
  };
</script>