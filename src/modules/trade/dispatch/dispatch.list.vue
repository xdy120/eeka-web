<template>
  <el-container>
    <el-header class="oms-search" :height="120">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="24" style="text-align: right">
            <go-toggle v-model="advanceQueryVisible" on-text="高级搜索" off-text="精简搜索"
                       :show-text="true"
                       :show-icon="false"></go-toggle>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="编码">
              <el-input v-model="filter.smartKeys" placeholder="配货单号/订单编号/交易号/手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="收货人">
              <el-input v-model="filter.contacts"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员昵称">
              <el-input v-model="filter.memberName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector enum-name="DispatchOrderStatus" multiple
                             v-model="filter.statuses"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="发货时间">
              <go-date-time-picker v-model="filter.lastDeliveryTimeBegin"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.lastDeliveryTimeEnd"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector :multiple="true" v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货仓库">
              <warehouse-selector v-model="filter.warehouseId"></warehouse-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="advanceQueryVisible">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="建议快递">
                <express-selector v-model="filter.suggestExpressId"
                                  :express-name.sync="filter.suggestExpressName"></express-selector>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="建议单号">
                <el-input v-model="filter.suggestExpressNo" placeholder="建议快递单号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发货快递">
                <express-selector v-model="filter.deliveryExpressId"
                                  :express-name.sync="filter.deliveryExpressName"></express-selector>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发货单号">
                <el-input v-model="filter.deliveryExpressNo" placeholder="发货快递单号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="batchRetryNotice">批量重推</el-button>
        <el-button @click="batchCancel">批量取消</el-button>
        <el-button @click="batchRetryPosting">批量重新过账</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange" @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column label="标记" width="100px" fixed>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cod">到</el-tag>
            <el-tag v-if="scope.row.hasExchange">换</el-tag>
            <el-tag v-if="scope.row.merge">合</el-tag>
            <el-tag v-if="scope.row.offlineDelivery">线下</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dispatchOrderCode" label="配货单号" width="150px"
                         fixed></el-table-column>
        <go-enum-column prop="status" label="状态" enum-name="DispatchOrderStatus" width="70px"
                        fixed></go-enum-column>
        <go-enum-column prop="outStatus" label="出库状态" enum-name="OutStatus" width="80px"
                        fixed></go-enum-column>
        <go-enum-column prop="postStatus" label="过账状态" enum-name="PostStatus" width="80px"
                        fixed></go-enum-column>
        <el-table-column prop="storeName" label="店铺" width="100px"></el-table-column>
        <el-table-column prop="warehouseName" label="发货仓库" width="100px"></el-table-column>
        <el-table-column prop="suggestExpressName" label="快递名称" width="70px"></el-table-column>
        <el-table-column prop="suggestExpressNo" label="建议快递单号" width="100px"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <go-date-time-column prop="lastDeliveryTime" label="最后发货时间"></go-date-time-column>
        <el-table-column prop="memberName" label="昵称" width="100px"></el-table-column>
        <el-table-column label="区域">
          <template slot-scope="scope">
            {{scope.row.countryName}}/{{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.districtName}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作" fixed="right" width="195px">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.outStatus!=='NO_OUT'"
                       @click="reposting(scope.row)">过账
            </el-button>
            <go-cancel-button v-permission="101010201" v-if="isBeforeDelivery(scope.row)"
                              @click="cancel(scope.row)"></go-cancel-button>
            <go-wms-button v-if="scope.row.status==='CREATED'||scope.row.status==='NOTICE_FAILED'"
                           @click="noticeWms(scope.row)"></go-wms-button>
            <go-delivery-button v-permission="101010203" v-if="isBeforeDelivery(scope.row)"
                                tooltip="手工发货"
                                @click="manualDelivery(scope.row)"></go-delivery-button>
            <wms-log :dispatchOrderId="scope.row.dispatchOrderId"></wms-log>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <tabs-footer ref="tabsFooter" @updated="scrollToRow">
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane label="配货明细" name="detail">
          <dispatch-order-detail :parent-data="selectedItem"
                                 :current-tab="currentTab"></dispatch-order-detail>
        </el-tab-pane>
        <el-tab-pane label="发货明细" name="delivery">
          <dispatch-order-delivery :parent-data="selectedItem"
                                   :current-tab="currentTab"></dispatch-order-delivery>
        </el-tab-pane>
        <el-tab-pane label="日志" name="log">
          <log-tab module-name="DISPATCH_ORDER" :parent-data="selectedItem" prop="dispatchOrderId"
                   :current-tab="currentTab"></log-tab>
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <batch-processor ref="batchProcessor" @finish="search"></batch-processor>
    <manual-delivery ref="manualDelivery" @ok="search"></manual-delivery>
    <cancel ref="cancel" @ok="search"></cancel>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {Assert, Placeholders} from '@/libs/util';
  import {StoreSelector, WarehouseSelector, ExpressSelector} from '@/modules/selector';
  import {BatchProcessor} from '@/component/ui';
  import {DispatchOrderApi} from './api';
  import {DispatchOrderDelivery, DispatchOrderDetail} from './tabs';
  import {Cancel, ManualDelivery, wmsLog} from './action';
  import {LogTab} from '@/component/log';

  export default {
    mixins: [List, PageList, TableResize],
    components: {
      DispatchOrderDetail,
      DispatchOrderDelivery,
      LogTab,
      StoreSelector,
      BatchProcessor,
      ManualDelivery,
      Cancel,
      wmsLog,
      WarehouseSelector,
      ExpressSelector
    },
    data() {
      return {
        api: DispatchOrderApi,
        pk: 'dispatchOrderId',
        codeProp: 'dispatchOrderCode',
        Placeholders,
        advanceQueryVisible: false,
        currentTab: 'detail',
        currentEditOrder: null,
      };
    },
    watch: {},
    methods: {
      toggleTabFooter() {
        this.$refs.tabsFooter.toggle();
      },
      isBeforeDelivery(dispatchOrder) {
        return !Assert.inArray(dispatchOrder.status, ['DELIVERED', 'CANCELED']);
      },
      buildBatchItem(item) {
        return {
          dispatchOrderId: item.dispatchOrderId,
          dispatchOrderCode: item.dispatchOrderCode,
          version: item.version
        };
      },
      buildDispatchOrderBO(row) {
        return {
          dispatchOrderId: row.dispatchOrderId,
          version: row.version
        };
      },
      batchCancel() {
        this.doBatch('配货单批量取消', item => {
          return DispatchOrderApi.cancel(item);
        }, this.isBeforeDelivery);
      },
      batchRetryNotice() {
        this.doBatch('配货单批量重推', item => {
          return DispatchOrderApi.noticeWms(item);
        }, this.isBeforeDelivery);
      },
      batchRetryPosting() {
        this.doBatch('配货单批量重新过账', item => {
          return DispatchOrderApi.reposting(item);
        }, x => x.status === 'DELIVERED');
      },
      cancel(row, dispatchOrderDetail) {
        this.$refs.cancel.show(row, dispatchOrderDetail);
      },
      noticeWms(row) {
        DispatchOrderApi.noticeWms(this.buildDispatchOrderBO(row)).then(this.search);
      },
      manualDelivery(row) {
        this.$refs.manualDelivery.show(row);
      },
      reposting(row) {
        this.api.reposting(row).then(this.showSuccess);
      }
    }
  };
</script>