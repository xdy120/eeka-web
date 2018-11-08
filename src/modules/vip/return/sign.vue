<template>
  <el-dialog title="签收" :visible.sync="visible" :before-close="dialogCloseConfirm" width="600px">
    <el-form :model="domain" ref="editForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="退货类型" prop="vipReturnType" :rules="ValidateRules.required">
            <data-dict-item-selector v-model="domain.vipReturnType"
                                     dataDictId="10802"></data-dict-item-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收货仓库" prop="virtualWarehouseId" :rules="ValidateRules.required">
            <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                        :virtualWarehouseName.sync="domain.virtualWarehouseName"
                                        :clearable="false"></virtual-warehouse-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="domain.remark"></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="12">
        <el-form-item label="签收状态">
          <el-radio-group v-model="domain.vipSignStatus">
            <el-radio label="NORMAL">正常签收</el-radio>
            <el-radio label="ABNORMAL">异常签收</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="sign">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {VipReturnApi} from './api';
  import {DataDictItemSelector, VirtualWarehouseSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'Sign',
    mixins: [Edit],
    components: {VirtualWarehouseSelector, DataDictItemSelector},
    data() {
      return {
        api: VipReturnApi,
        pk: 'vipReturnId',
        ValidateRules: ValidateRules,
      };
    },
    methods: {
      thenGet(data) {
        data.vipSignStatus = 'NORMAL';
      },
      sign() {
        this.$refs.editForm.validate().then(() => {
          VipReturnApi.sign(this.domain[this.pk], this.domain).then(()=>{
            this.confirm();
            this.$message.success('签收成功');
          });
        });
      }
    }
  };
</script>