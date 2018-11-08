<template>
  <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px" label-position="left">
    <el-row :gutter="10">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="活动名称" prop="presellName">
            <el-input v-model="domain.presellName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发货日期" prop="deliveryDate">
            <go-date-picker v-model="domain.deliveryDate"></go-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="12">
        <el-form-item label="开始时间" prop="beginTime">
          <go-date-time-picker v-model="domain.beginTime"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" prop="endTime">
          <go-date-time-picker v-model="domain.endTime"></go-date-time-picker>
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
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="动态预售">
          <el-checkbox v-model="domain.dynamic"></el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'PresellBasic',
    components: {},
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
          presellName: [
            ValidateRules.required,
            {required: true, message: '预售活动名称不能为空'},
            {min: 3, max: 50, message: '长度在 3 到 50 个字符'},
          ],
          storeId: ValidateRules.required,
          beginTime: [
            ValidateRules.required,
          ],
          endTime: [
            ValidateRules.required,
            {validator: validateEndTime, trigger: 'change'}
          ],
          deliveryDate: ValidateRules.required,
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