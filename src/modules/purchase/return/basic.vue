<template>
  <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px" label-position="left">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="采购订单">
          <purchase-selector v-model="domain.purchaseOrderId" :outFilter="purchaseOrderFilter"
                             :purchaseOrderCode.sync="domain.purchaseOrderCode"
                             :supplierId.sync="domain.supplierId"
                             :supplierName.sync="domain.supplierName"
                             :supplierCode.sync="domain.supplierCode"
                             :supplierShortName.sync="domain.supplierShortName"
                             :warehouseId.sync="domain.warehouseId"
                             :warehouseName.sync="domain.warehouseName"
                             v-on:confirm="purchaseConfirm"></purchase-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="供应商" prop="supplierId">
          <supplier-selector v-model="domain.supplierId" :supplierName.sync="domain.supplierName"
                             :supplierCode.sync="domain.supplierCode"
                             :supplierShortName.sync="domain.supplierShortName"></supplier-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="出库仓库" prop="virtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :warehouseId.sync="domain.warehouseId"
                                      :warehouseName.sync="domain.warehouseName"
                                      :virtualWarehouseName.sync="domain.virtualWarehouseName"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退货类型" prop="purchaseReturnType">
          <data-dict-item-selector v-model="domain.purchaseReturnType"
                                   dataDictId="10501"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="domain.contact"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="domain.telephone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="退货地址" prop="address">
          <el-input v-model="domain.address"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="domain.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {PurchaseSelector, SupplierSelector} from '../index';
  import {
    DataDictItemSelector,
    StoreSelector,
    UserSelector,
    VirtualWarehouseSelector
  } from '@/modules/selector';

  export default {
    name: 'PurchaseReturnBasic',
    components: {
      UserSelector,
      VirtualWarehouseSelector,
      StoreSelector,
      SupplierSelector,
      DataDictItemSelector,
      PurchaseSelector
    },
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        warehouseId: '',
        purchaseOrderFilter: {
          inStatuses: 'PART_IN,ALL_IN',
        },
        rules: {
          purchaseOrderId: ValidateRules.required,
          supplierId: ValidateRules.required,
          virtualWarehouseId: ValidateRules.required,
          purchaseReturnType: ValidateRules.required,
          telephone: ValidateRules.telephone,
          address: ValidateRules.remark,
          remark: ValidateRules.remark
        }
      };
    },
    watch: {
      value(val) {
        this.domain = val;
      }
    },
    methods: {
      validate() {
        this.$emit('input', this.domain);
        return this.$refs.editForm.validate();
      },
      resetFields() {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      }
    },
  };
</script>