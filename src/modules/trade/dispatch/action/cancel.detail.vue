<template>
  <el-dialog title="取消配货单明细" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="取消原因" prop="reason">
        <el-input v-model="domain.reason" type="textarea" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Placeholders, ValidateRules} from '@/libs/util';
  import {DispatchOrderDetailApi} from '../api';

  export default {
    mixins: [Edit],
    data() {
      return {
        dispatchOrder: null,
        dispatchOrderDetail: null,
        Placeholders,
        rules: {
          reason: ValidateRules.requiredMax,
        }
      };
    },
    methods: {
      show(dispatchOrder, dispatchOrderDetail) {
        this.dispatchOrder = dispatchOrder;
        this.dispatchOrderDetail = dispatchOrderDetail;
        this.domain = {};
        this.visible = true;
      },
      save() {
        this.domain.dispatchOrderId = this.dispatchOrder.dispatchOrderId;
        this.domain.dispatchOrderDetailId = this.dispatchOrderDetail.dispatchOrderDetailId;
        this.domain.version = this.dispatchOrder.version;
        this.$refs.editForm.validate().then(() => {
          DispatchOrderDetailApi.cancel(this.domain).then(this.confirm);
        });
      }
    }
  };
</script>