<template>
  <el-dialog title="取消唯品退货通知单" :visible.sync="visible" width="400px">
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
  import {VipReturnNoticeApi} from './api';
  import {VipReturnNoticeActionMixin} from './mixin';

  export default {
    mixins: [Edit, VipReturnNoticeActionMixin],
    data() {
      return {
        Placeholders,
        rules: {
          reason: ValidateRules.requiredMax,
        }
      };
    },
    methods: {
      doSave() {
        VipReturnNoticeApi.cancel(this.domain).then(this.confirm);
      }
    }
  };
</script>