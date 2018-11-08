<template>
  <el-container>
    <el-header class="oms-search" height="70">
      <el-form ref="filter" :model="filter" @keyup.enter.native="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="单据编号">
              <el-input v-model="filter.purchaseOrderCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商">
              <supplier-selector v-model="filter.supplierId"
                                 :supplierName.sync="filter.supplierName"></supplier-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="PurchaseStatus"></enum-selector>
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
            <el-form-item label="采购员">
              <user-selector :nickname.sync="filter.purchaser" :isDefaultValue="false"
                             placeholder="请选择采购员"></user-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同号">
              <el-input v-model="filter.contractNos" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源单号">
              <el-input v-model="filter.fromCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCode"></el-input>
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
      <el-table :data="list" :height="mainHeight"
                @current-change="currentRowChange" @selection-change="selectionChange">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="采购单号" prop="purchaseOrderCode"
                        width="140"></go-link-column>
        <go-enum-column prop="status" label="状态" enum-name="PurchaseStatus"
                        min-width="60"></go-enum-column>
        <go-enum-column prop="inStatus" label="入库状态" enum-name="InStatus"
                        width="70"></go-enum-column>
        <go-enum-column prop="noticeOrderStatus" label="通知单状态" enum-name="PurchaseOrderNoticeStatus"
                        width="80"></go-enum-column>
        <el-table-column prop="contractNo" label="合同号" min-width="120"></el-table-column>
        <el-table-column prop="fromCode" label="来源单号" min-width="120"></el-table-column>
        <el-table-column prop="purchaser" label="采购员" min-width="120"></el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="100"></el-table-column>
        <el-table-column prop="warehouseName" label="收货仓库" min-width="100"></el-table-column>
        <go-date-time-column prop="purchaseDate" label="采购日期"></go-date-time-column>
        <go-date-time-column prop="arrivalDate" label="到货日期"></go-date-time-column>
        <go-date-time-column prop="lastInTime" label="最后入库时间"></go-date-time-column>
        <el-table-column prop="creator" label="制单人" min-width="120"></el-table-column>
        <go-date-time-column prop="createdTime" label="制单时间"></go-date-time-column>
        <el-table-column prop="auditor" label="审核人" min-width="120"></el-table-column>
        <go-date-time-column prop="auditedTime" label="审核时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
        <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <go-modify-button v-if="scope.row.status==='CREATED'"
                              @click="showEditor(scope.row)"></go-modify-button>
            <go-invalid-button v-if="scope.row.status==='CREATED'"
                               @click="invalid(scope.row)"></go-invalid-button>
            <go-audit-button v-if="scope.row.status==='CREATED'"
                             @click="audit(scope.row)"></go-audit-button>
            <el-button type="text"
                       v-if="scope.row.status==='AUDITED'&&scope.row.noticeOrderStatus !== 'ALL_NOTICE'"
                       @click="createNotice(scope.row)">生成通知单
            </el-button>
            <go-finish-button v-if="scope.row.inStatus === 'PART_IN' && scope.row.status!=='FINISH'"
                              @click="finish(scope.row,'此操作将完结采购订单并清除该采购订单所剩余的在途数')"></go-finish-button>
            <go-print-button @click="print(scope.row)"></go-print-button>
            <log-popover module-name="PURCHASE_ORDER"
                         :bizId="scope.row.purchaseOrderId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <!--采购订单主信息编辑界面-->
    <purchase-creator ref="creator" @ok="search"></purchase-creator>
    <!--采购订单编辑界面-->
    <purchase-editor ref="editor" @ok="search"></purchase-editor>
    <!--采购订单明细编辑界面-->
    <detail-edit ref="detailEditor" @ok="search"></detail-edit>
    <!--采购订单新增通知单编辑界面-->
    <notice-creator ref="noticeCreator" @ok="search"></notice-creator>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {SupplierSelector} from './index';
  import {UserSelector, WarehouseSelector} from '@/modules/base/index';
  import PurchaseCreator from './create.vue';
  import DetailEdit from './detail.edit.vue';
  import {PurchaseOrderApi} from './api';
  import {SkuSelector} from '@/modules/product/index';
  import {LogPopover} from '@/component/log';
  import PurchaseEditor from './edit.vue';
  import AdvanceQuery from './advance.query.vue';
  import noticeCreator from './create.notice.vue';

  export default {
    name: 'Purchase',
    mixins: [List, PageList, TableResize],
    components: {
      PurchaseCreator,
      PurchaseEditor,
      DetailEdit,
      AdvanceQuery,
      UserSelector,
      SupplierSelector,
      WarehouseSelector,
      SkuSelector,
      LogPopover,
      noticeCreator
    },
    data() {
      return {
        api: PurchaseOrderApi,
        pk: 'purchaseOrderId'
      };
    },
    methods: {
      audit(row) {
        this.$confirm('此操作将审核采购订单，后续不能修改, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form = {};
          this.form.purchaseOrderId = row.purchaseOrderId;
          this.form.warehouseId = row.warehouseId;
          this.form.warehouseName = row.warehouseName;
          this.form.arrivalDate = row.arrivalDate;
          this.form.version = row.version;
          this.form.status = row.status;
          PurchaseOrderApi.audit(this.form.purchaseOrderId, this.form).then(() => {
            this.$message.success('采购订单审核成功');
            this.clickSearch();
          });
        });
      },
      createNotice(row) {
        this.$refs.noticeCreator.show(row);
      },
      print(row) {
        let {href} = this.$router.resolve(`/purchase/print/${row.purchaseOrderId}`);
        window.open(href, '_target');
      }
    }
  };
</script>