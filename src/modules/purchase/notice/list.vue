<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form ref="filter" :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="通知单号">
              <el-input v-model="filter.purchaseNoticeOrderCodes"
                        placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购订单">
              <el-input v-model="filter.purchaseOrderCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="PurchaseNoticeStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库状态">
              <enum-selector v-model="filter.inStatuses" multiple
                             enum-name="InStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="入库仓库">
              <warehouse-selector v-model="filter.warehouseId"
                                  :warehouseName.sync="filter.warehouseName"></warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批次号">
              <el-input v-model="filter.batchNos" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外部单号">
              <el-input v-model="filter.outerCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header>
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="batchNoticeWms()">推送</el-button>
        <el-button @click="batchCancel()">取消</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange"
                @selection-change="selectionChange">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="采购通知单号" prop="purchaseNoticeOrderCode"
                        width="160"></go-link-column>
        <el-table-column label="采购单号" prop="purchaseOrderCode" width="160"></el-table-column>
        <go-enum-column prop="status" label="状态" enum-name="PurchaseNoticeStatus"
                        min-width="100"></go-enum-column>
        <go-enum-column prop="inStatus" label="入库状态" enum-name="InStatus"
                        width="120"></go-enum-column>
        <el-table-column prop="warehouseName" label="入货仓库" min-width="120"></el-table-column>
        <el-table-column prop="outerCode" label="WMS单号" min-width="120"></el-table-column>
        <el-table-column prop="batchNo" label="批次号" min-width="120"></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
        <go-date-time-column prop="lastInTime" label="最后入库时间"></go-date-time-column>
        <el-table-column prop="creator" label="制单人" min-width="120"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <go-wms-button v-if="scope.row.status==='CREATED'||scope.row.status==='FAILED'"
                           @click="noticeWms(scope.row)" :disabled="isDisabled"></go-wms-button>
            <go-cancel-button v-if="scope.row.status!=='CANCEL'&&scope.row.inStatus==='NO_IN'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <log-popover module-name="PURCHASE_NOTICE"
                         :bizId="scope.row.purchaseNoticeOrderId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <notice-creator ref="creator" @ok="search"></notice-creator>
    <!--采购通知单明细查看界面-->
    <detail-editor ref="detailEditor" @ok="search"></detail-editor>
    <batch-processor class="no-print" ref="batchProcessor" @finish="search"></batch-processor>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import NoticeCreator from './create.vue';
  import {WarehouseSelector} from '@/modules/base/index';
  import {PurchaseSelector, SupplierSelector} from '../index';
  import {PurchaseNoticeOrderApi} from '../api';
  import DetailEditor from './detail.edit.vue';
  import {LogPopover} from '@/component/log';
  import {Barcode, BatchProcessor, Print} from '@/component';

  export default {
    name: 'PurchaseNotice',
    mixins: [List, PageList, TableResize],
    components: {
      NoticeCreator,
      WarehouseSelector,
      PurchaseSelector,
      SupplierSelector,
      DetailEditor,
      LogPopover,
      Barcode,
      BatchProcessor,
      Print
    },
    data() {
      return {
        api: PurchaseNoticeOrderApi,
        pk: 'purchaseNoticeOrderId',
        codeProp: 'purchaseNoticeOrderCode',
        isDisabled: false
      };
    },
    methods: {
      batchNoticeWms() {
        this.doBatch('批量通知WMS', item => {
          return this.api.noticeWms(item.purchaseNoticeOrderId, item);
        }, this.isBeforeDelivery).then(() => {
          this.clickSearch();
        });
      },
      batchCancel() {
        this.doBatch('批量取消通知单', item => {
          return this.api.cancel(item.purchaseNoticeOrderId, item);
        }, this.isBeforeDelivery).then(() => {
          this.clickSearch();
        });
      },
      noticeWms(row) {
        this.isDisabled = true;
        this.api.noticeWms(row.purchaseNoticeOrderId, row).then(() => {
          this.isDisabled = false;
          this.clickSearch();
        }).catch(() => {
          this.isDisabled = false;
        });
      },
    }
  };
</script>

