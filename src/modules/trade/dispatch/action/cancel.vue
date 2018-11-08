<template>
  <el-dialog title="取消配货单" :visible.sync="visible" width="400px">
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
  import {DispatchOrderApi} from '../api';
  import {DispatchOrderActionMixin} from './mixin';

  export default {
    mixins: [Edit, DispatchOrderActionMixin],
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
        DispatchOrderApi.cancel(this.domain).then(() => {
          this.$message.success('操作成功！如果仓库非实时取消，请稍后查看仓库取消结果。');
          this.$emit('ok');
        });
        this.visible = false;
      }
    }
  };
</script>