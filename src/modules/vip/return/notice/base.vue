<template>
  <el-form :model="domain" ref="editForm" label-width="100px" label-position="left">
    <el-row :gutter="10">

      <el-col :span="12">
        <el-form-item label="唯品拣货单号" prop="pickingCode"
                      :rules="ValidateRules.required">
          <el-input v-model="domain.pickingCode"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="唯品店铺" prop="storeId"
                      :rules="ValidateRules.required">
          <store-selector v-model="domain.storeId" :storeName.sync="domain.storeName"
                          mall-type="VIP" :clearable="false"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出库仓库" prop="virtualWarehouseId"
                      :rules="ValidateRules.required">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.virtualWarehouseName"
                                      :warehouseId.sync="domain.warehouseId"
                                      :warehouseName.sync="domain.warehouseName"
                                      :clearable="false"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="domain.remark"></el-input>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script>
  import {StoreSelector, VirtualWarehouseSelector} from '@/modules/base';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'DispatchBase',
    components: {StoreSelector, VirtualWarehouseSelector},
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        ValidateRules: ValidateRules,
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
