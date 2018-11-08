<template>
  <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="采购日期" prop="purchaseDate">
          <go-date-picker
              v-model="domain.purchaseDate"
              type="date">
            value-format="yyyy-MM-dd">
          </go-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="到货日期" prop="arrivalDate">
          <go-date-picker
              v-model="domain.arrivalDate"
              type="date"
              value-format="yyyy-MM-dd">
          </go-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="供应商" prop="supplierId">
          <supplier-selector v-model="domain.supplierId" :supplierName.sync="domain.supplierName"
                             :supplierShortName.sync="domain.supplierShortName"
                             :supplierCode.sync="domain.supplierCode"
                             :placeholder="domain.supplierName"></supplier-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入库仓库" prop="virtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :virtual-warehouse-name.sync="domain.virtualWarehouseName"
                                      :warehouse-id.sync="domain.warehouseId"
                                      :warehouse-name.sync="domain.warehouseName">
          </virtual-warehouse-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="采购员" prop="purchaser">
          <user-selector :nickname.sync="domain.purchaser"></user-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同号" prop="contractNo">
          <el-input v-model="domain.contractNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="快递费" prop="expressFee">
          <el-input-number v-model="domain.expressFee" :min="0"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="domain.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {SupplierSelector} from './index';
  import {
    DataDictItemSelector,
    StoreSelector,
    UserSelector,
    VirtualWarehouseSelector
  } from '@/modules/selector';

  export default {
    name: 'PurchaseBasic',
    components: {
      UserSelector,
      VirtualWarehouseSelector,
      StoreSelector,
      SupplierSelector,
      DataDictItemSelector,
    },
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        rules: {
          purchaseDate: ValidateRules.required,
          arrivalDate: ValidateRules.required,
          virtualWarehouseId: ValidateRules.required,
          supplierId: ValidateRules.required,
          purchaser: ValidateRules.required,
          contractNo: [
            {min: 3, max: 20, message: '长度在 3 到 20 个字符'}
          ],
          remark: [
            {min: 0, max: 256, message: '长度在 0 到 256 个字符'}
          ],
        },
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
    }
  };
</script>