<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="400px">
    <el-form :model="domain" :rules="storeRules" ref="editForm" label-width="120px">
      <el-form-item label="开始时间" prop="beginTime">
        <go-date-time-picker v-model="domain.beginTime"></go-date-time-picker>
      </el-form-item>
      <el-form-item label="延迟分钟" prop="delayMinutes">
        <el-input-number v-model="domain.delayMinutes" :min="1" :max="99999"></el-input-number>
      </el-form-item>
      <el-form-item label="时间段（秒）" prop="intervalSeconds">
        <el-input-number v-model="domain.intervalSeconds" :min="1" :max="99999"></el-input-number>
      </el-form-item>
      <el-collapse>
        <el-collapse-item title="高级" name="1">
          <el-form-item label="触发类型" prop="jobTriggerType">
            <enum-selector enum-name="JobTriggerType"
                           v-model="domain.jobTriggerType"></enum-selector>
          </el-form-item>
          <el-form-item label="任务间隔（秒）" prop="jobInterval" v-if="domain.jobTriggerType==='SIMPLE'">
            <el-input-number v-model="domain.jobInterval" :min="1" :max="99999"></el-input-number>
          </el-form-item>
          <el-form-item label="表达式" prop="jobCron" v-else>
            <el-input v-model="domain.jobCron"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {StoreDownloadConfigApi} from './api';
  import {ValidateRules} from '@/libs/util';
  import {Edit, Steps} from '@/libs/mixins';
  import {
    CompanySelector,
    DataDictItemSelector,
    MallAppSelector,
    OrderAuditStrategySelector,
    StockDispatchSettingSelector,
    VirtualWarehouseSelector
  } from '@/modules/selector';

  export default {
    components: {
      VirtualWarehouseSelector,
      CompanySelector,
      DataDictItemSelector,
      MallAppSelector,
      StockDispatchSettingSelector,
      OrderAuditStrategySelector
    },
    name: 'StoreEdit',
    mixins: [Edit, Steps],
    data() {
      return {
        pk: 'storeDownloadConfigId',
        api: StoreDownloadConfigApi,
        setting: {},
        storeRules: {
          beginTime: ValidateRules.required,
          delayMinutes: ValidateRules.number,
          intervalSeconds: ValidateRules.number,
          jobTriggerType: ValidateRules.required,
          jobInterval: ValidateRules.number,
          jobCron: ValidateRules.required,
        }
      };
    },
    methods: {
      save: function () {
        this.doSave();
      }
    }
  };
</script>