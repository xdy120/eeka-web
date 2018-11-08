<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form ref="filter" :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="退货单号">
              <el-input v-model="filter.purchaseReturnOrderCodes"
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
                             enum-name="PurchaseStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库状态">
              <enum-selector v-model="filter.outStatuses" multiple
                             enum-name="OutStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="供应商">
              <supplier-selector v-model="filter.supplierId"
                                 :supplierName.sync="filter.supplierName"></supplier-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退货仓库">
              <warehouse-selector v-model="filter.warehouseId"
                                  :warehouseName.sync="filter.warehouseName"></warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源单号" label-width="100px">
              <el-input v-model="filter.fromCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外部单号" label-width="100px">
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
        <el-button @click="showCreator()">新增</el-button>
        <el-button @click="batchNoticeWms()">推送</el-button>
        <el-button @click="batchCancel()">取消</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight" @current-change="currentRowChange">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="采购退货单号" prop="purchaseReturnOrderCode"
                        width="140"></go-link-column>
        <go-enum-column prop="status" label="状态" enum-name="PurchaseReturnStatus"
                        width="60px"></go-enum-column>
        <go-enum-column prop="outStatus" label="出库状态" enum-name="OutStatus"
                        width="60px"></go-enum-column>
        <el-table-column prop="purchaseOrderCode" label="采购订单编号" width="150"></el-table-column>
        <el-table-column prop="purchaseReturnType" label="退货类型" width="100"></el-table-column>
        <el-table-column prop="fromCode" label="来源单号" width="120"></el-table-column>
        <el-table-column prop="outerCode" label="外部单号" width="100"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="120"></el-table-column>
        <el-table-column prop="warehouseName" label="出库仓库" width="120"></el-table-column>
        <go-date-time-column prop="lastOutTime" label="最后出库时间"></go-date-time-column>
        <el-table-column prop="creator" label="制单人" width="120"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <el-table-column prop="auditor" label="审核人" width="100"></el-table-column>
        <go-date-time-column prop="auditedTime" label="审核时间"></go-date-time-column>
        <el-table-column prop="remark" label="备注" width="100"></el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <go-wms-button v-if="scope.row.status==='AUDITED'||scope.row.status==='FAILED'"
                           @click="noticeWms(scope.row)" :disabled="isDisabled"></go-wms-button>
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <go-cancel-button v-if="scope.row.status!=='CANCELED' && scope.row.outStatus==='NO_OUT'"
                              @click="cancel(scope.row)"></go-cancel-button>
            <go-finish-button
                v-if="scope.row.outStatus === 'PART_OUT' && scope.row.status!=='FINISH'"
                @click="finish(scope.row,'此操作将完结采购退货单并清除该单据库存占用')">完结
            </go-finish-button>
            <log-popover module-name="PURCHASE_RETURN"
                         :bizId="scope.row.purchaseReturnOrderId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <purchase-return-creator ref="creator" @ok="search"></purchase-return-creator>
    <purchase-return-editor ref="editor" @ok="search"></purchase-return-editor>
    <!--采购退货单明细编辑界面-->
    <detail-editor ref="detailEditor" @ok="search"></detail-editor>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {WarehouseSelector} from '@/modules/base/index';
  import {PurchaseSelector, SupplierSelector} from '../index';
  import {PurchaseReturnOrderApi} from '../api';
  import PurchaseReturnCreator from './create.vue';
  import PurchaseReturnEditor from './edit.vue';
  import DetailEditor from './detail.edit.vue';
  import {LogPopover} from '@/component/log';

  export default {
    name: 'PurchaseReturn',
    mixins: [List, PageList, TableResize],
    components: {
      DetailEditor,
      WarehouseSelector,
      PurchaseSelector,
      SupplierSelector,
      LogPopover,
      PurchaseReturnCreator,
      PurchaseReturnEditor
    },
    data() {
      return {
        api: PurchaseReturnOrderApi,
        pk: 'purchaseReturnOrderId',
        isDisabled: false
      };
    },
    methods: {
      batchNoticeWms() {
        this.doBatch('批量通知WMS', item => {
          return this.api.noticeWms(item.purchaseReturnOrderId, item);
        }, this.isBeforeDelivery).then(() => {
          this.clickSearch();
        });
      },
      batchCancel() {
        this.doBatch('批量取消通知单', item => {
          return this.api.cancel(item.purchaseReturnOrderId, item);
        }, this.isBeforeDelivery).then(() => {
          this.clickSearch();
        });
      },
      noticeWms(row) {
        this.isDisabled = true;
        this.api.noticeWms(row.purchaseReturnOrderId, row).then(() => {
          this.isDisabled = false;
          this.search();
        }).catch(() => {
          this.isDisabled = false;
        });
      },
    }
  };
</script>

