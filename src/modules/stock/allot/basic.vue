<template>
  <el-form :model="domain" :rules="rules" ref="editForm">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="调入仓库" prop="inVirtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.inVirtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.inVirtualWarehouseName"
                                      :warehouseId.sync="domain.warehouseId"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调出仓库" prop="outVirtualWarehouseId"
                      v-show="domain.inVirtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.outVirtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.outVirtualWarehouseName"
                                      :matchWarehouseId.sync="domain.warehouseId"></virtual-warehouse-selector>
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
  import {ValidateRules} from '@/libs/util';
  import {VirtualWarehouseSelector} from '@/modules/selector';

  export default {
    name: 'AllotEditBasic',
    components: {VirtualWarehouseSelector},
    props: {
      value: Object
    },
    data() {
      let validateOutVirtualWarehouse = (rule, value, callback) => {
        if (value === this.domain.inVirtualWarehouseId) {
          callback(new Error('不能等于调入仓'));
        } else {
          callback();
        }
      };
      return {
        domain: this.value,
        warehouseId: '',
        rules: {
          outVirtualWarehouseId: [
            ValidateRules.required,
            {validator: validateOutVirtualWarehouse, trigger: 'change'}
          ],
          inVirtualWarehouseId: ValidateRules.required,
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