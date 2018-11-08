<template>
  <el-container>
    <el-header class="oms-search" height="140px">
      <el-form ref="filter" :model="filter" @keyup.enter.native="clickSearch" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="创建时间">
              <go-date-time-picker v-model="filter.createdTimeBegin" type="datetime"
                                   value-format="yyyy-MM-dd HH:mm:ss" :clearable="false">
              </go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.createdTimeEnd" type="datetime"
                                   value-format="yyyy-MM-dd HH:mm:ss" :clearable="false">
              </go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库时间">
              <go-date-time-picker v-model="filter.createdTimeBegin" type="datetime"
                                   value-format="yyyy-MM-dd HH:mm:ss" :clearable="false">
              </go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.createdTimeEnd" type="datetime"
                                   value-format="yyyy-MM-dd HH:mm:ss" :clearable="false">
              </go-date-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="采购单状态">
              <enum-selector v-model="filter.status"
                             enum-name="PurchaseStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商编码">
              <el-input v-model="filter.supplierCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称">
              <el-input v-model="filter.supplierName" label-width="120px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库仓库">
              <warehouse-selector v-model="filter.warehouseId"
                                  :warehouseName.sync="filter.warehouseName"></warehouse-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="采购员">
              <user-selector :nickname.sync="filter.purchaser" placeholder="请选择采购员"></user-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同号">
              <el-input v-model="filter.contractNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="采购单号">
              <el-input v-model="filter.purchaseOrderCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
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
      <el-table :data="list" :height="mainHeight" @row-dblclick="toggleTabFooter"
                @current-change="currentRowChange" @selection-change="selectionChange"
                :row-style="rowStyle">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-link-column @click="showDetailEditor" label="采购单号" prop="purchaseOrderCode"
                        width="140"></go-link-column>
        <el-table-column prop="contractNo" label="合同号"></el-table-column>
        <el-table-column prop="purchaser" label="采购员"></el-table-column>
        <go-date-time-column prop="purchaseDate" label="采购日期" min-width="120"></go-date-time-column>
        <el-table-column prop="supplierCode" label="供应商编码" min-width="120"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" min-width="120"></el-table-column>
        <el-table-column prop="warehouseName" label="入库仓库" min-width="100"></el-table-column>
        <el-table-column prop="productCode" label="商品编码" min-width="100"></el-table-column>
        <go-date-time-column prop="productName" label="商品名称"></go-date-time-column>
        <go-date-time-column prop="skuCode" label="规格编码"></go-date-time-column>
        <go-date-time-column prop="skuName" label="规格名称"></go-date-time-column>
        <el-table-column prop="quantity" label="采购数量" min-width="120"></el-table-column>
        <go-date-time-column prop="actualPrice" label="采购价"></go-date-time-column>
        <go-enum-column prop="inStatus" label="采购单入库状态" enum-name="InStatus" width="140"></go-enum-column>
        <go-quantity-column prop="noticeQuantity" label="通知数量"></go-quantity-column>
        <go-quantity-column prop="inQuantity" label="正品入库数量" width="140"></go-quantity-column>
        <go-quantity-column prop="inSubstandardQuantity" label="次品入库数量" width="140"></go-quantity-column>
        <go-quantity-column label="未入数量">
          <template slot-scope="scope">
            <span>{{scope.row.quantity-scope.row.inQuantity-scope.row.inSubstandardQuantity}}</span>
          </template>
        </go-quantity-column>
        <go-date-time-column prop="lastInTime" label="最后入库时间"></go-date-time-column>
        <go-enum-column prop="status" label="采购单状态" enum-name="PurchaseStatus"
                        width="120px"></go-enum-column>
        <el-table-column prop="remark" label="备注" min-width="120"></el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {PurchaseOrderApi} from './api';
  import {UserSelector, WarehouseSelector} from '@/modules/base/index';

  export default {
    name: 'Purchase',
    mixins: [List, PageList, TableResize],
    components: {UserSelector, WarehouseSelector},
    data() {
      return {
        api: PurchaseOrderApi,
        pk: 'purchaseOrderId',
      };
    },
    methods: {}
  };
</script>
