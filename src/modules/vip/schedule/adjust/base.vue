<template>
  <el-form :model="domain" ref="editForm" label-width="80px" style="margin-top: 16px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="档期" prop="vipScheduleId"
                      :rules="ValidateRules.required">
          <vip-schedule-selector v-model="domain.vipScheduleId"
                                 :vipScheduleCode.sync="domain.vipScheduleCode"></vip-schedule-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调整类型" prop="adjustType"
                      :rules="ValidateRules.required">
          <enum-selector enum-name="VipAdjustType" v-model="domain.adjustType"
                         :clearable="false"></enum-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="调整原因" prop="adjustReason"
                      :rules="ValidateRules.required">
          <data-dict-item-selector v-model="domain.adjustReason"
                                   data-dict-id="10601"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="需要上传" prop="isUpload">
          <el-checkbox v-model="domain.upload"></el-checkbox>
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
  import {DataDictItemSelector, StoreSelector, WarehouseSelector} from '@/modules/base/index';
  import {VipScheduleSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'AdjustBasic',
    components: {DataDictItemSelector, StoreSelector, WarehouseSelector, VipScheduleSelector},
    props: {
      value: Object
    },
    data() {
      return {
        ValidateRules: ValidateRules,
        domain: this.value,
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
