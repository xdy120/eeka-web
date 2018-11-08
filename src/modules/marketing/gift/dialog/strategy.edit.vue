<template>
  <el-dialog title="新增策略" :visible.sync="visible" width="600px" :before-close="dialogCloseConfirm">
    <el-form ref="editForm" :model="domain" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="策略编码">
            <el-input v-model="domain.giftStrategyCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="策略名称" prop="giftStrategyName">
            <el-input v-model="domain.giftStrategyName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="排序号" prop="priorityNo">
            <el-input v-model.number="domain.priorityNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="匹配时间" prop="timeType">
            <enum-selector v-model="domain.timeType" enum-name="TimeType"></enum-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
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
        <el-col>
          <el-form-item label="备注">
            <el-input v-model="domain.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {GiftStrategyApi} from '../api';

  export default {
    mixins: [Edit],
    data() {
      return {
        pk: 'giftStrategyId',
        api: GiftStrategyApi,
        rules: {
          giftStrategyName: ValidateRules.requiredMax,
          priorityNo: ValidateRules.requiredNumber,
          timeType: ValidateRules.required,
          beginTime: ValidateRules.required,
          endTime: ValidateRules.required
        }
      };
    },
    methods: {
      doSave() {
        GiftStrategyApi.modify(this.domain.giftStrategyId, this.domain).then(this.confirm);
      }
    }
  };
</script>
