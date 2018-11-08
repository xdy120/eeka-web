<template>
  <el-container>
    <el-header class="oms-search" :height="180">
      <el-row :gutter="10">
        <advance-query ref="advanceQuery" :customFields="customFields" component-name="SalesOrderBatch">
          <el-radio-group v-model="createdTime">
            <el-radio style="margin-left: 10px" label="1">近一周</el-radio>
            <el-radio style="margin-left: 10px" label="2">一个月内</el-radio>
            <el-radio style="margin-left: 10px" label="3">三个月内</el-radio>
          </el-radio-group>
        </advance-query>
      </el-row>
    </el-header>
    <el-header class="oms-action" container-id="1234">
      <el-button-group>
        <go-search-button @click="search">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="batchAuditOrder" v-permission="101010101">批量审核</el-button>
      </el-button-group>
      <el-dropdown>
        <el-button>更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-permission="101010101">
            <el-button type="text" @click="batchDispatch">自动配货</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010105">
            <el-button type="text" @click="batchSuggestExpress">设置推荐快递</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided v-permission="101010108">
            <el-button type="text" @click="batchMatchProduct">匹配异常商品</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided v-permission="101010111">
            <el-button type="text" @click="batchAddGift">添加赠品</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchReplaceGift">替换赠品</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchRemoveGift">作废赠品</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010103">
            <el-button type="text" @click="batchResetOrder">重置订单</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided v-permission="101010111">
            <el-button type="text" @click="batchHold">设置留单</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchCancelHold">取消留单</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight"
                @selection-change="selectionChange" :row-style="rowStyle">
        <go-selection-column/>
        <el-table-column type="index" label="序号"/>
        <el-table-column label="标记" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sub.cod">到</el-tag>
            <el-tag v-if="scope.row.sub.newMember">新</el-tag>
            <el-tag v-if="scope.row.sub.prepay">预</el-tag>
            <el-tag v-if="scope.row.sub.hasInvoice">票</el-tag>
            <el-tag v-if="scope.row.oos" type="danger">缺</el-tag>
            <el-tag v-if="scope.row.hold">留</el-tag>
            <el-tag v-if="scope.row.urgent" type="danger">急</el-tag>
            <el-tag v-if="scope.row.manual">手</el-tag>
            <el-tag v-if="scope.row.forceSplit">拆</el-tag>
            <el-tag v-if="scope.row.sub.salesOrderType==='EXCHANGE'" type="danger">换</el-tag>
            <el-tag v-if="scope.row.sub.salesOrderType==='REISSUE'" type="danger">补</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salesOrderCode" label="订单编号" width="150"/>
        <el-table-column prop="tradeId" label="交易号" width="150"/>
        <go-enum-column prop="status" label="状态" enum-name="SalesOrderStatus" width="80px"
                        align="center"/>
        <go-enum-column prop="dispatchStatus" label="配货状态" width="80px" enum-name="DispatchStatus"/>
        <go-enum-column prop="deliveryStatus" enum-name="DeliveryStatus" label="发货状态" width="80px"
                        align="center"/>
        <go-enum-column prop="refundStatus" enum-name="RefundStatus" label="退款状态" width="80px"
                        align="center"/>
        <el-table-column prop="sub.memberName" label="会员名称" width="120"/>
        <el-table-column prop="sub.buyerMemo" label="买家备注" width="120"/>
        <el-table-column prop="sub.sellerMemo" label="卖家备注" width="120"/>
        <el-table-column prop="suggestExpressName" label="建议快递" width="100"/>
        <el-table-column prop="storeName" label="店铺" width="100"/>
        <el-table-column label="区域" width="150px">
          <template slot-scope="scope">
            {{scope.row.countryName}}/{{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.districtName}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="150"/>
        <go-date-time-column prop="createdTime" label="制单时间"/>
        <go-date-time-column prop="modifiedTime" label="修改时间"/>
        <!--<go-enum-column prop="sub.salesOrderType" label="类型" enum-name="SalesOrderType" width="60"/>-->
      </el-table>
    </el-main>

    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     :page-sizes="[200, 500, 1000]" @current-change="search"
                     @size-change="pageSizeChange"/>
    </el-footer>

    <batch-processor ref="batchProcessor" @finish="batchProcessFinish" @cancel="cancel">
      <el-checkbox v-if="showGift" v-model="giftFlag">赠品</el-checkbox>
    </batch-processor>
    <suggest-express ref="suggestExpress" @change="search"/>
    <gift-add ref="giftAdd" @ok="search"/>
    <gift-replace ref="giftReplace" @ok="search"/>
    <gift-remove ref="giftRemove" @ok="search"/>
    <hold ref="hold" @ok="search"/>

  </el-container>
</template>
<script>
  import {BatchProcessor} from '@/component/ui';
  import {AdvanceQuery} from '@/component';
  import {List, PageList, TableResize} from '@/libs/mixins/index';
  import {CustomFields, SalesOrderBatchApi, SalesOrderBatchBookmarkApi} from './api';
  import {SalesOrderApi} from '../api';
  import {RegionSelector, StoreSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';
  import {SalesOrderUtil} from '@/modules/trade/sales/util';
  import {GiftAdd, GiftRemove, GiftReplace, Hold, SuggestExpress} from '../action';

  export default {
    mixins: [List, PageList, TableResize],
    components: {
      RegionSelector,
      StoreSelector,
      BatchProcessor,
      SuggestExpress,
      GiftAdd,
      GiftReplace,
      GiftRemove,
      Hold,
      AdvanceQuery,
      CustomFields
    },
    data() {
      return {
        api: SalesOrderBatchApi,
        SalesOrderBatchBookmarkApi,
        SalesOrderApi,
        pk: 'salesOrderId',
        codeProp: 'salesOrderCode',
        paging: {page: 1, pageSize: 200},
        ValidateRules: ValidateRules,
        SalesOrderUtil,
        showGift: false,
        giftFlag: false,
        customFields: CustomFields,
        createdTime: '1'
      };
    },
    methods: {
      reset() {
        this.$refs.advanceQuery.resetDomain();
      },
      rowStyle({row}) {
        if (row.oos) {
          return {color: 'red'};
        }
      },
      batchAuditOrder() {
        this.doBatch('订单批量审核', item => {
          return SalesOrderApi.audit(item);
        }, SalesOrderUtil.isBeforeDispatch);
      },
      batchProcessFinish() {
        this.search();
        this.resetShowGift();
      },
      resetShowGift() {
        this.showGift = false;
        this.giftFlag = false;
      },
      cancel() {
        this.resetShowGift();
      },
      batchDispatch() {
        this.doBatch('订单批量自动配货', item => {
          return SalesOrderApi.autoDispatch(item);
        }, SalesOrderUtil.canAutoDispatch);
      },
      batchSuggestExpress() {
        this.validateSelectedItems(SalesOrderUtil.isBeforeAllDispatch).then(
          items => this.$refs.suggestExpress.show(items));
      },
      batchMatchProduct() {
        this.doBatch('订单批量匹配异常商品', item => {
          return SalesOrderApi.matchProduct(item);
        }, item => item.productAbnormal);
      },
      batchAddGift() {
        this.validateSelectedItems(SalesOrderUtil.isBeforeAllDispatch).then(
          items => this.$refs.giftAdd.show(items));
      },
      batchReplaceGift() {
        this.validateSelectedItems(SalesOrderUtil.isBeforeAllDispatch).then(
          items => this.$refs.giftReplace.show(items));
      },
      batchRemoveGift() {
        this.validateSelectedItems(SalesOrderUtil.isBeforeAllDispatch).then(
          items => this.$refs.giftRemove.show(items));
      },
      batchHold() {
        this.validateSelectedItems(this.isBeforeAllDispatch).then(
          items => this.$refs.hold.show(items));
      },
      batchCancelHold() {
        this.doBatch('批量取消留单', item => {
          return SalesOrderApi.cancelHold(item);
        }, SalesOrderUtil.isHoldAndBeforeAllDispatch);
      },
      batchResetOrder() {
        this.doBatch('订单批量重置', item => {
          return SalesOrderApi.reset(item);
        }, SalesOrderUtil.canReset);
      },
      search() {
        let queryDomain = this.$refs.advanceQuery.constructQueryDomain();
        let time = {
          field: 'created_time',
          type: 'DATETIME',
          operator: 'GREATER_THAN_EQUAL',
          boolType: 'MUST'
        };
        if (this.createdTime === '3') {
          time.value = new Date() - 7776000000;
        } else if (this.createdTime === '2') {
          time.value = new Date() - 2592000000;
        } else {
          time.value = new Date() - 604800000;
        }
        let fields = JSON.parse(queryDomain.get('fields'));
        fields.push(time);
        queryDomain.set('fields', JSON.stringify(fields));
        return this.doSearch(this.api.list(queryDomain, this.paging));
      }
    }
  };
</script>