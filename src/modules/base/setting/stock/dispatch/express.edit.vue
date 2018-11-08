<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="快递" prop="expressId">
        <express-selector v-model="domain.expressId"
                          :express-name.sync="domain.expressName"></express-selector>
      </el-form-item>
      <el-form-item label="优先级" prop="priorityNo">
        <el-input-number v-model.number="domain.priorityNo" :min="1"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {ExpressSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    components: {ExpressSelector},
    data() {
      return {
        domain: {},
        visible: false,
        rules: {
          expressId: ValidateRules.required,
          priorityNo: ValidateRules.requiredNumber
        }
      };
    },
    methods: {
      show(warehouse, done) {
        this.done = done;
        this.domain = warehouse;
        this.visible = true;
      },
      save() {
        this.$refs.editForm.validate().then(() => {
          if (this.done) {
            this.done(this.domain);
          } else {
            this.$emit('ok', this.domain);
          }
          this.visible = false;
        });
      }
    }
  };
</script>
