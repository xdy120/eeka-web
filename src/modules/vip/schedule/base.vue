<template>
  <el-form :model="domain" ref="editForm" label-width="80px" style="margin-top: 16px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="档期名称" prop="vipScheduleName"
                      :rules="ValidateRules.name">
          <el-input v-model="domain.vipScheduleName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="仓库" prop="virtualWarehouseName"
                      :rules="ValidateRules.required">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.virtualWarehouseName"
                                      :clearable="false"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="店铺" prop="storeName"
                      :rules="ValidateRules.required">
          <store-selector v-model="domain.storeId" :store-name.sync="domain.storeName"
                          mall-type="VIP" :clearable="false"></store-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否上传" prop="upload">
          <el-checkbox v-model="domain.upload"></el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
              v-model="domain.beginTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:ss:mm"
              :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
              v-model="domain.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:ss:mm"
              :clearable="false"
          >
          </el-date-picker>
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
    name: 'ScheduleBase',
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
