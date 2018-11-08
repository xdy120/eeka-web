<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="400px">
    <div>
      <el-form :model="domain" :rules="storeRules" ref="editForm" label-width="110px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="开始时间" :disabled="domain.storeId!==undefined" prop="beginTime">
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
            <el-form-item label="延迟分钟" prop="delayMinutes">
              <el-input v-model="domain.delayMinutes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="间隔秒数" prop="intervalSeconds">
              <el-input v-model="domain.intervalSeconds"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {StoreApi} from './api';
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
    name: 'StoreDownLoadEdit',
    mixins: [Edit, Steps],
    data() {
      return {
        pk: 'storeId',
        api: StoreApi,
        setting: {},
        storeRules: {
          beginTime: ValidateRules.code,
          delayMinutes: ValidateRules.name,
          intervalSeconds: ValidateRules.required
        },
        settingRules: {
          beginTime: ValidateRules.required,
          delayMinutes: ValidateRules.required,
          intervalSeconds: ValidateRules.required,
        }
      };
    },
    methods: {
      save() {
        this.$refs.settingForm.validate().then(() => {
          this.domain.settingJson = JSON.stringify(this.setting);
          this.doSave();
        });
      }
    }
  };
</script>