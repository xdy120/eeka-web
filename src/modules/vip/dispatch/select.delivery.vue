<template>
  <el-dialog title="选择出仓单" :visible.sync="visible" :before-close="dialogCloseConfirm" width="400px">
    <el-form :model="domain" ref="editForm" label-width="100px" label-position="left">
      <el-form-item label="出仓单" prop="vipDeliveryId" :rules="ValidateRules.required">
        <vip-delivery-selector v-model="domain.vipDeliveryId"
                               :vip-delivery-code.sync="domain.vipDeliveryCode"
                               :vip-dispatch="vipDispatch"></vip-delivery-selector>
      </el-form-item>
    </el-form>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="bing()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {VipDispatchApi} from './api';
  import {VipDeliverySelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'SelectDelivery',
    components: {VipDeliverySelector},
    data() {
      return {
        domain: {},
        visible: false,
        vipDispatch: null,
        ValidateRules: ValidateRules
      };
    },
    methods: {
      show(vipDispatch) {
        this.domain = {};
        this.vipDispatch = vipDispatch;
        this.visible = true;
      },
      bing() {
        this.$refs.editForm.validate().then(() => {
          this.domain.version = this.vipDispatch.version;
          VipDispatchApi.bindDelivery(this.vipDispatch.vipDispatchId, this.domain).then(() => {
            this.$emit('ok', this.domain);
            this.visible = false;
          });
        });
      }
    },
    onClosed() {
      this.domain = {};
    }
  };
</script>