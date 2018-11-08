<template>
  <el-form :model="domain" :rules="rules" ref="editForm">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="domain.activityName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="活动店铺" prop="storeId">
          <store-selector v-model="domain.storeId"
                          :storeName.sync="domain.storeName"></store-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
              v-model="domain.beginTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
              v-model="domain.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="占用仓库" prop="virtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.virtualWarehouseName"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="活动类型" prop="activityType">
          <data-dict-item-selector v-model="domain.activityType"
                                   dataDictId="10401"></data-dict-item-selector>
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
    <el-row>
      <el-form-item>
        <el-checkbox v-model="domain.useLockQuantity">按锁定上传</el-checkbox>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {
    DataDictItemSelector,
    StoreSelector,
    VirtualWarehouseSelector
  } from '@/modules/base/index';

  export default {
    name: 'ActivityBasic',
    components: {VirtualWarehouseSelector, StoreSelector, DataDictItemSelector},
    props: {
      value: Object
    },
    data() {
      let validateEndTime = (rule, value, callback) => {
        if (value < this.domain.beginTime) {
          callback(new Error('不能小于开始时间'));
        } else {
          callback();
        }
      };
      return {
        domain: this.value,
        rules: {
          activityName: [
            ValidateRules.required,
            {min: 0, max: 20, message: '长度在 2 到 20 个字符'}
          ],
          storeId: ValidateRules.required,
          endTime: [
            ValidateRules.required,
            {validator: validateEndTime, trigger: 'change'}
          ],
          virtualWarehouseId: ValidateRules.required,
          endDate: ValidateRules.required,
          activityType: ValidateRules.required,
          beginTime: ValidateRules.required,
          remark: [
            {min: 0, max: 20, message: '长度在 0 到 20 个字符'}
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