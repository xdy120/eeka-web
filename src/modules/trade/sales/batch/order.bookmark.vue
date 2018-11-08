<template>
  <el-dialog title="书签编辑" :visible.sync="visible">
    <el-form ref="editForm" :model="domain" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="书签名" prop="">
            <el-input v-model="domain.bookmarkName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {SalesOrderBatchBookmarkApi} from './api';

  export default {
    mixins: [Edit],
    components: {},
    data() {
      return {
        api: SalesOrderBatchBookmarkApi,
        pk: 'bookmarkId',
        rules: {
          bookmarkName: ValidateRules.required
        }
      };
    },
    methods: {
      show(entity) {
        this.domain = entity;
        this.visible = true;
      },
      save() {
        if (this.$refs.editForm) {
          this.$refs.editForm.validate().then(() => {
            if (this.domain.bookmarkId) {
              // 修改
              this.api.modify(this.domain.bookmarkId, this.domain).then(() => {
                this.$message.success('修改成功');
                this.$emit('ok');
                this.close();
              });
            } else {
              // 保存
              this.doSave();
            }
          });
        }
      }
    }
  };
</script>
