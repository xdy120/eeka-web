<template>
  <el-container>
    <el-header class="oms-search" :height="120">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch"
               label-width="100px" v-if="!advanceQueryVisible">
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: right">
            <three-checkbox style="margin-left: 5px" v-model="filter.productAbnormal">异常
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.dropShipping">代发
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.oos">缺货</three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter['sub.cod']">到付</three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter['sub.prepay']">预付
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter['sub.hasInvoice']">发票
            </three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.urgent">加急</three-checkbox>
            <three-checkbox style="margin-left: 5px" v-model="filter.manual">手工处理</three-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="编码">
              <el-input v-model="filter.smartKeys" placeholder="订单编号/交易号/配货单号/手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员昵称">
              <el-input v-model="filter['sub.memberName']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector enum-name="SalesOrderStatus" multiple
                             v-model="filter.statuses"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="支付时间">
              <go-date-time-picker v-model="filter['sub.mallPaidTimeBegin']"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter['sub.mallPaidTimeEnd']"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector multiple v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分销单号">
              <el-input v-model="filter.distributionTradeIds"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <advance-query ref="advanceQuery" :customFields="customFields" component-name="SalesOrder"
                     :visible="advanceQueryVisible"/>
    </el-header>
    <el-header class="oms-action" container-id="1234">
      <el-button-group>
        <el-switch v-model="advanceQueryVisible" active-text="高级" inactive-text="精简"></el-switch>
      </el-button-group>
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="batchAuditOrder" v-permission="101010101">批量审核</el-button>
        <el-button @click="batchDispatch" v-permission="101010101">自动配货</el-button>
        <el-button @click="batchSuggestExpress" v-permission="101010101">推荐快递</el-button>
        <el-button @click="batchHold" v-permission="101010101">留单</el-button>
        <el-button @click="batchUrgent" v-permission="101010101">加急</el-button>
      </el-button-group>
      <el-dropdown>
        <el-button>
          赠品<i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided v-permission="101010111">
            <el-button type="text" @click="batchAddGift">添加赠品</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchReplaceGift">替换赠品</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchRemoveGift">作废赠品</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown>
        <el-button>
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided v-permission="101010102">
            <el-button type="text" @click="batchInvalidOrder">作废订单</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010103">
            <el-button type="text" @click="batchResetOrder">重置订单</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010104">
            <el-button type="text" @click="batchSuggestWarehouse">设置推荐仓库</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided v-permission="101010108">
            <el-button type="text" @click="batchMatchProduct">匹配异常商品</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text">商城手工发货</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchCancelHold">取消留单</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchCancelUrgent">取消加急</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided v-permission="101010111">
            <el-button type="text" @click="batchManual">人工处理</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchCancelManual">取消人工处理</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchOfflineDelivery">线下发货</el-button>
          </el-dropdown-item>
          <el-dropdown-item v-permission="101010111">
            <el-button type="text" @click="batchReplaceDetail">替换商品</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button-group>
        <el-button @click="showCreator()" v-permission="101010101">新增</el-button>
        <el-button @click="manualDownload" v-permission="101010102">下载</el-button>
        <el-button @click="showImport" v-permission="101010103">导入</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange" @selection-change="selectionChange"
                :row-style="rowStyle">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" label="序号" fixed></el-table-column>
        <el-table-column label="标记" width="120" fixed>
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
            <el-tag v-if="scope.row.prerefund">预退</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salesOrderCode" label="订单编号" width="150" fixed></el-table-column>
        <el-table-column prop="tradeId" label="交易号" width="150" fixed></el-table-column>
        <go-abnormal-column prop="productAbnormal" label="异常商品" width="80px"
                            fixed></go-abnormal-column>
        <go-enum-column prop="status" label="状态" enum-name="SalesOrderStatus" width="80px"
                        align="center" fixed></go-enum-column>
        <go-enum-column prop="dispatchStatus" label="配货状态" width="80px"
                        enum-name="DispatchStatus"></go-enum-column>
        <go-enum-column prop="deliveryStatus" enum-name="DeliveryStatus" label="发货状态" width="80px"
                        align="center"/>
        <go-enum-column prop="refundStatus" enum-name="RefundStatus" label="退款状态" width="80px"
                        align="center"/>
        <el-table-column prop="sub.memberName" label="会员名称" width="120"></el-table-column>
        <el-table-column prop="sub.buyerMemo" label="买家备注" width="120"></el-table-column>
        <el-table-column prop="sub.sellerMemo" label="卖家备注" width="120"></el-table-column>
        <el-table-column prop="storeName" label="店铺" width="100"></el-table-column>
        <el-table-column prop="distributionTradeId" label="分销单号" width="100"></el-table-column>
        <go-enum-column prop="sub.salesOrderType" label="类型" enum-name="SalesOrderType"
                        width="60"></go-enum-column>
        <go-enum-column prop="sub.presellType" label="预售类型" enum-name="PresellType"
                        width="80"></go-enum-column>
        <go-enum-column prop="mallSalesOrderStatus" enum-name="MallSalesOrderStatus" label="商城订单状态"
                        width="100"
                        align="center"/>
        <go-enum-column prop="payStatus" enum-name="SalesOrderPayStatus" label="付款状态" width="80"
                        align="center"/>
        <go-date-time-column prop="sub.mallPaidTime" label="支付时间"></go-date-time-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <el-table-column label="区域" width="150px">
          <template slot-scope="scope">
            {{scope.row.countryName}}/{{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.districtName}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="150"></el-table-column>
        <el-table-column prop="manualUser" label="手工标记人" width="100"></el-table-column>
        <el-table-column label="操作" fixed="right" width="250px">
          <template slot-scope="scope">
            <go-audit-button :disabled="!SalesOrderUtil.isBeforeAudit(scope.row)"
                             @click="auditOrder(scope.row)"></go-audit-button>
            <go-copy-button @click="copySalesOrder(scope.row)"></go-copy-button>
            <go-copy-button @click="salesOrderReissue(scope.row)" tooltip="补发"></go-copy-button>
            <go-tooltip-button :disabled="!SalesOrderUtil.canManualDispatch(scope.row)"
                               tooltip="手工配货" icon="dispatch"
                               @click="manualDispatch(scope.row)"></go-tooltip-button>
            <el-dropdown>
              <el-button type="text"> 更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeDispatch(scope.row)"
                                   @click="resetOrder(scope.row)">重置订单
                </go-drop-down-item>
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeDispatch(scope.row)"
                                   @click="invalidOrder(scope.row)">作废
                </go-drop-down-item>
                <go-drop-down-item :disabled="scope.row.status!=='DELIVERY_ABNORMAL'"
                                   @click="manualDelivery(scope.row)">手工发货
                </go-drop-down-item>
                <go-drop-down-item :disabled="!scope.row.productAbnormal"
                                   @click="matchProduct(scope.row)">匹配异常商品
                </go-drop-down-item>
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeAllDispatch(scope.row)"
                                   @click="addGift(scope.row)">添加赠品
                </go-drop-down-item>
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeAllDispatch(scope.row)"
                                   @click="manual(scope.row)">手工处理
                </go-drop-down-item>
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeAllDispatch(scope.row)"
                                   @click="hold(scope.row)">留单
                </go-drop-down-item>
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeAudit(scope.row)"
                                   @click="showEditor(scope.row)">修改
                </go-drop-down-item>
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeAllDispatch(scope.row)"
                                   @click="offlineDelivery(scope.row)">线下发货
                </go-drop-down-item>
                <go-drop-down-item :disabled="!SalesOrderUtil.isBeforeAllDispatch(scope.row)||
                !scope.row.prerefund" @click="cancelPrerefund(scope.row)">取消预退款
                </go-drop-down-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <tabs-footer ref="tabsFooter">
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane label="附属信息" name="sub">
          <sales-order-info :parent-data="selectedItem" @change="reloadSelectedItem"/>
        </el-tab-pane>
        <el-tab-pane label="商品明细" name="detail">
          <sales-order-detail :parent-data="selectedItem" :current-tab="currentTab"
                              @change="reloadSelectedItem"/>
        </el-tab-pane>
        <el-tab-pane label="支付信息" name="payment">
          <sales-order-payment :parent-data="selectedItem" :remote="true" :current-tab="currentTab"
                               @change="reloadSelectedItem"/>
        </el-tab-pane>
        <el-tab-pane label="优惠信息" name="discount">
          <sales-order-discount :parent-data="selectedItem" :current-tab="currentTab"/>
        </el-tab-pane>
        <el-tab-pane label="发票信息" name="invoice">
          <sales-order-invoice :parent-data="selectedItem" :remote="true" :current-tab="currentTab"
                               @change="reloadSelectedItem"/>
        </el-tab-pane>
        <el-tab-pane label="配货信息" name="dispatch">
          <sales-order-dispatch :parent-data="selectedItem" :current-tab="currentTab"
                                @change="reloadSelectedItem"/>
        </el-tab-pane>
        <el-tab-pane label="发货信息" name="delivery">
          <sales-order-delivery :parent-data="selectedItem" :current-tab="currentTab"/>
        </el-tab-pane>
        <el-tab-pane label="活动信息" name="marketing">
          <sales-order-marketing :parent-data="selectedItem" :current-tab="currentTab"/>
        </el-tab-pane>
        <el-tab-pane label="日志" name="log">
          <log-tab module-name="SALES_ORDER" :parent-data="selectedItem" prop="salesOrderId"
                   :current-tab="currentTab"/>
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <sales-order-creator ref="creator" @ok="search"></sales-order-creator>
    <sales-order-editor ref="editor" @ok="search"></sales-order-editor>
    <hold ref="hold" @ok="search"></hold>
    <download ref="download"></download>
    <detail-replace ref="detailReplace" @ok="search"></detail-replace>
    <gift-add ref="giftAdd" @ok="search"></gift-add>
    <gift-replace ref="giftReplace" @ok="search"></gift-replace>
    <gift-remove ref="giftRemove" @ok="search"></gift-remove>
    <suggest-express ref="suggestExpress" @change="search"></suggest-express>
    <suggest-warehouse ref="suggestWarehouse" @change="search"></suggest-warehouse>
    <manual-dispatch ref="manualDispatch" @ok="search"></manual-dispatch>
    <offline-delivery ref="offlineDelivery" @ok="search"></offline-delivery>
    <batch-processor ref="batchProcessor" @finish="batchProcessFinish" @cancel="cancel">
      <el-checkbox v-if="showGift" v-model="giftFlag">赠品</el-checkbox>
    </batch-processor>
    <ratio-query ref="ratioQuery"></ratio-query>
    <excel-importer ref="excelImport" title="订单导入" :must-columns="mustColumns" :batch="true"
                    :column-builder="buildColumns" :validator="importValidate"
                    @finish="search" @change="fileReady"
                    templateUrl="/file/template/sales_order.xlsx/B2C订单导入模板">
      <el-form ref="importForm" slot="header" :model="importDomain" :rules="importRules" inline>
        <el-form-item label="店铺" prop="storeId">
          <store-selector v-model="importDomain.storeId"
                          :store-name.sync="importDomain.storeName"></store-selector>
        </el-form-item>
        <el-form-item label="订单类型" prop="orderType">
          <enum-selector v-model="importDomain.orderType"
                         enum-name="SalesOrderType"></enum-selector>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="importDomain.needDelivery">需发货</el-checkbox>
        </el-form-item>
      </el-form>
      <span style="float: right">共{{quantity}}个订单</span>
    </excel-importer>
  </el-container>
</template>
<script>
  import {AdvanceQuery} from '@/component';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {Placeholders, ValidateRules} from '@/libs/util';
  import {StoreSelector} from '@/modules/selector';
  import SalesOrderCreator from './order.create.vue';
  import SalesOrderEditor from './order.edit.vue';
  import SalesOrderAdvanceQuery from './order.advance.query.vue';
  import {MustColumns, SalesOrderApi} from './api';
  import {CustomFields} from './batch/api';
  import {
    SalesOrderDelivery,
    SalesOrderDetail,
    SalesOrderDiscount,
    SalesOrderDispatch,
    SalesOrderInfo,
    SalesOrderInvoice,
    SalesOrderMarketing,
    SalesOrderPayment
  } from './tabs';
  import {
    Download,
    GiftAdd,
    GiftRemove,
    GiftReplace,
    Hold,
    ManualDispatch,
    OfflineDelivery,
    RatioQuery,
    SuggestExpress,
    SuggestWarehouse,
    DetailReplace
  } from './action';
  import {BatchProcessor, ExcelImporter} from '@/component/ui';
  import {LogTab} from '@/component/log';
  import {SalesOrderUtil} from '@/modules/trade/sales/util';

  export default {
    mixins: [List, PageList, TableResize],
    components: {
      SalesOrderInfo,
      SalesOrderMarketing,
      SalesOrderDispatch,
      SalesOrderInvoice,
      SalesOrderPayment,
      SalesOrderDiscount,
      SalesOrderDetail,
      SalesOrderDelivery,
      Hold,
      Download,
      GiftAdd,
      GiftReplace,
      GiftRemove,
      SuggestExpress,
      SuggestWarehouse,
      ManualDispatch,
      OfflineDelivery,
      RatioQuery,
      StoreSelector,
      SalesOrderCreator,
      SalesOrderEditor,
      SalesOrderAdvanceQuery,
      BatchProcessor,
      LogTab,
      ExcelImporter,
      AdvanceQuery,
      CustomFields,
      DetailReplace
    },
    data() {
      return {
        api: SalesOrderApi,
        pk: 'salesOrderId',
        codeProp: 'salesOrderCode',
        Placeholders,
        advanceQueryVisible: false,
        currentTab: 'sub',
        currentEditOrder: null,
        quantity: 0,
        importDomain: {needDelivery: false},
        importRules: {
          storeId: ValidateRules.required,
          orderType: ValidateRules.required
        },
        SalesOrderUtil,
        showGift: false,
        giftFlag: false,
        mustColumns: MustColumns,
        needLayout: false,
        customFields: CustomFields
      };
    },
    updated() {
      if (this.needLayout) {
        this.$nextTick(() => {
          this.needLayout = false;
          this.scrollToRow();
        });
      }
    },
    methods: {
      rowStyle({row}) {
        if (row.oos) {
          return {color: 'red'};
        }
      },
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
        this.needLayout = true;
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
      reloadSelectedItem() {
        this.search();
      },
      manualDownload() {
        this.$refs.download.show();
      },
      batchDispatch() {
        this.doBatch('订单批量自动配货', item => {
          return SalesOrderApi.autoDispatch(item);
        }, SalesOrderUtil.canAutoDispatch);
      },
      batchInvalidOrder() {
        this.doBatch('订单批量作废', item => {
          return SalesOrderApi.invalid(item);
        }, SalesOrderUtil.isBeforeDispatch);
      },
      batchAuditOrder() {
        this.doBatch('订单批量审核', item => {
          return SalesOrderApi.audit(item);
        }, SalesOrderUtil.isBeforeDispatch);
      },
      batchResetOrder() {
        this.doBatch('订单批量重置', item => {
          return SalesOrderApi.reset(item);
        }, SalesOrderUtil.canReset);
      },
      batchMatchProduct() {
        this.doBatch('订单批量匹配异常商品', item => {
          return SalesOrderApi.matchProduct(item);
        }, item => item.productAbnormal);
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
      batchManual() {
        this.doBatch('批量手工处理', item => {
          return SalesOrderApi.manual(item);
        }, SalesOrderUtil.isBeforeAllDispatch);
      },
      batchCancelManual() {
        this.doBatch('批量取消手工处理', item => {
          return SalesOrderApi.cancelManual(item);
        }, SalesOrderUtil.isManualAndBeforeAllDispatch);
      },
      batchOfflineDelivery() {
        this.showGift = true;
        this.giftFlag = false;
        this.validateSelectedItems(this.isBeforeDispatch).then(items => {
          let buildItem = this.buildBatchItem;
          let orderCode = this.codeProp;
          let list = items.map(function (item) {
            return buildItem(item);
          });
          this.$refs.batchProcessor.show('线下发货', orderCode, list,
            item => {
              item.giftFlag = this.giftFlag;
              return SalesOrderApi.offlineDelivery(item);
            });
        });
      },
      batchUrgent() {
        this.doBatch('批量加急', item => {
          return SalesOrderApi.urgent(item);
        }, SalesOrderUtil.isBeforeAllDispatch);
      },
      batchCancelUrgent() {
        this.doBatch('批量取消加急', item => {
          return SalesOrderApi.cancelUrgent(item);
        }, SalesOrderUtil.isUrgentAndBeforeAllDispatch);
      },
      batchReplaceDetail() {
        this.validateSelectedItems(SalesOrderUtil.isBeforeAllDispatch).then(
          items => this.$refs.detailReplace.show(items));
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
      batchSuggestExpress() {
        this.validateSelectedItems(SalesOrderUtil.isBeforeAllDispatch).then(
          items => this.$refs.suggestExpress.show(items));
      },
      batchSuggestWarehouse() {
        this.validateSelectedItems(SalesOrderUtil.isBeforeAllDispatch).then(
          items => this.$refs.suggestWarehouse.show(items));
      },
      invalidOrder(order) {
        this.$confirm('作废后不可恢复,是否作废？').then(() => {
          SalesOrderApi.invalid(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
        });
      },
      auditOrder(order) {
        SalesOrderApi.audit(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
      },
      resetOrder(order) {
        SalesOrderApi.reset(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
      },
      matchProduct(order) {
        SalesOrderApi.matchProduct(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
      },
      manual(order) {
        if (!order.manual) {
          SalesOrderApi.manual(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
        } else {
          SalesOrderApi.cancelManual(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
        }
      },
      hold(order) {
        if (!order.hold) {
          this.$refs.hold.show(order);
        } else {
          SalesOrderApi.cancelHold(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
        }
      },
      urgent(order) {
        if (!order.urgent) {
          SalesOrderApi.urgent(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
        } else {
          SalesOrderApi.cancelUrgent(SalesOrderUtil.buildSalesOrderBO(order)).then(this.search);
        }
      },
      addGift(order) {
        this.$refs.giftAdd.show(order);
      },
      ratioQuery(order, warehouseType) {
        this.$refs.ratioQuery.show(order, warehouseType);
      },
      removeGift(order) {
        this.$refs.giftRemove.show(order);
      },
      replaceGift(order) {
        this.$refs.giftReplace.show(order);
      },
      suggestExpress(order) {
        this.$refs.suggestExpress.show(order);
      },
      suggestWarehouse(order) {
        this.$refs.suggestWarehouse.show(order);
      },
      manualDispatch(order) {
        this.$refs.manualDispatch.show(order);
      },
      offlineDelivery(order) {
        this.$refs.offlineDelivery.show(order);
      },
      manualDelivery(order) {
        SalesOrderApi.manualMallDelivery(order).then(this.search);
      },
      buildColumns(data) {
        let width = 80;
        return Object.values(data[0]).map(x => {
          let w = Math.floor(x.toString().length - 4) * 10;
          return {prop: x, label: x, width: width + w};
        });
      },
      importValidate() {
        return this.$refs.importForm.validate();
      },
      showImport() {
        this.quantity = 0;
        this.importDomain = {needDelivery: false};
        this.$refs.excelImport.show(this.doImport);
      },
      doImport(list) {
        if (list.length > 0) {
          this.importDomain.list = list;
          return SalesOrderApi.importSalesOrder(this.importDomain);
        } else {
          this.$message.error('导入模板错误或没有数据！');
        }
      },
      fileReady(list) {
        let set = new Set();
        list.forEach(x => set.add(x['交易号']));
        this.quantity = set.size;
      },
      copySalesOrder(order) {
        SalesOrderApi.copySalesOrder(order.salesOrderId).then(response => {
          if (this.$refs.creator) {
            if (this.$refs.creator.stepTitle) {
              this.$refs.creator.stepTitle = '基本信息';
              this.$refs.creator.step = 0;
            }
            this.$refs.creator.showCopy(response, '订单复制');
          }
        });
      },
      currentRowChange(data) {
        if (data) {
          if (!data.isDecrypt) {
            SalesOrderApi.get(data.salesOrderId).then(order => {
              data.isDecrypt = true;
              data.contact = order.contact;
              data.mobile = order.mobile;
              data.telephone = order.telephone;
              this.selectedItem = data;
            });
          } else {
            this.selectedItem = data;
          }
        }
      },
      salesOrderReissue(data) {
        SalesOrderApi.copySalesOrder(data.salesOrderId).then(response => {
          if (this.$refs.creator) {
            if (this.$refs.creator.stepTitle) {
              this.$refs.creator.stepTitle = '基本信息';
              this.$refs.creator.step = 0;
            }
            this.$refs.creator.orderReissue(response, '订单补发');
          }
        });
      },
      reset() {
        if (this.advanceQueryVisible) {
          this.$refs.advanceQuery.resetDomain();
        } else {
          this.resetFilter();
        }
      },
      search() {
        if (this.advanceQueryVisible) {
          let queryDomain = this.$refs.advanceQuery.constructQueryDomain();
          return this.doSearch(this.api.listAdvance(queryDomain, this.paging));
        } else {
          return this.doSearch(this.api.list(this.filter, this.paging));
        }
      },
      cancelPrerefund(order) {
        if (order.prerefund) {
          SalesOrderApi.cancelPrerefund(order).then(this.search);
        } else {
          this.$message.warning('订单非预退款');
        }
      }
    }
  };
</script>