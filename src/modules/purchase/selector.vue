<template>
  <div>
    <el-popover ref="grid" placement="bottom" width="800" v-model="visible">
      <el-container>
        <el-header height="35px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="采购订单" lable-width="100">
                  <el-input v-model="filter.purchaseOrderCodes" placeholder="支持多个查询，英文逗号隔开"
                            autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商名称" lable-width="60">
                  <el-input v-model="filter.supplierName" placeholder="支持右侧模糊匹配"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="采购员" lable-width="10">
                  <el-input v-model="filter.purchaser" placeholder="支持右侧模糊匹配"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header :height="35">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <el-table-column prop="purchaseOrderCode" label="采购单号" width="140"></el-table-column>
            <go-enum-column prop="status" label="状态" enum-name="PurchaseStatus"
                            min-width="100"></go-enum-column>
            <go-enum-column prop="inStatus" label="入库状态" enum-name="InStatus"
                            min-width="120"></go-enum-column>
            <el-table-column prop="purchaser" label="采购员" min-width="100"></el-table-column>
            <go-date-time-column prop="arrivalDate" label="到货日期" sortable></go-date-time-column>
            <el-table-column prop="supplierName" label="供应商名" min-width="120"
                             sortable></el-table-column>
            <el-table-column prop="supplierCode" label="供应商编码" min-width="120"
                             sortable></el-table-column>
            <el-table-column prop="warehouseName" label="收货仓库" min-width="120"
                             sortable></el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-popover>
    <el-input placeholder="选择采购订单" v-model="text" readonly>
      <el-button slot="prepend" icon="el-icon-circle-close" @click="clean"
                 v-if="selectedItem||selectedItems.length>0"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid></el-button>
    </el-input>
  </div>
</template>
<script>
  import {PurchaseOrderApi} from './api';
  import {List, PageList, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';

  export default {
    name: 'PurchaseSelector',
    mixins: [List, PageList, Selector],
    props: {
      purchaseOrderCode: String,
      dialog: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        pk: 'purchaseOrderId',
        api: PurchaseOrderApi,
        text: this.purchaseOrderCode,
      };
    },
    watch: {
      purchaseOrderCode(val) {
        this.text = val;
      },
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.selectedItems = [];
        }
      },
    },
    methods: {
      customClean() {
        this.text = null;
        this.$emit('update:purchaseOrderCode', null);
        this.$emit('update:supplierId', null);
        this.$emit('update:supplierName', null);
        this.$emit('update:supplierCode', null);
        this.$emit('update:supplierShortName', null);
        this.$emit('update:warehouseId', null);
        this.$emit('update:warehouseName', null);
      },
      customConfirm() {
        if (this.iMultiple) {
          this.$emit('input', this.selectedItems.map(x => x.purchaseOrderId).join());
          this.$emit('update:purchaseOrderCode', this.text);
          this.$emit('update:purchaseOrderCode',
            this.selectedItems.map(x => x.purchaseOrderCode).join());
        } else {
          this.text = this.selectedItem.expressName;
          this.text = this.selectedItem.purchaseOrderCode;
          this.$emit('input', this.selectedItem.purchaseOrderId);
          this.$emit('update:purchaseOrderCode', this.text);
          this.$emit('update:purchaseOrderCode', this.selectedItem.purchaseOrderCode);
          this.$emit('update:supplierId', this.selectedItem.supplierId);
          this.$emit('update:supplierName', this.selectedItem.supplierName);
          this.$emit('update:supplierCode', this.selectedItem.supplierCode);
          this.$emit('update:supplierShortName', this.selectedItem.supplierShortName);
          this.$emit('update:warehouseId', this.selectedItem.warehouseId);
          this.$emit('update:warehouseName', this.selectedItem.warehouseName);
          this.$emit('confirm', this.selectedItem);
        }
      },
    },
    created() {
      for (let key in this.outFilter) {
        this.filter[key] = this.outFilter[key];
      }
      this.oldFilter = this.filter;
    }
  };
</script>