<template>
  <!--角色界面-->
  <el-dialog title="编辑" :visible.sync="visible" width="450px" :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="domain.roleName"></el-input>
      </el-form-item>
      <el-form-item label="备注" rop="remark">
        <el-input v-model="domain.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="roleSubmit('editForm')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {RoleApi} from './api';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'RoleCreator',
    mixins: [Edit],
    components: {},
    props: {},
    data() {
      return {
        pk: 'roleId',
        api: RoleApi,
        rules: {
          roleName: ValidateRules.requiredMax,
          remark: ValidateRules.remark
        },
      };
    },
    methods: {
      roleSubmit(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            let params = {roleName: this.domain.roleName, page: 1, pageSize: 1};
            RoleApi.list(params).then(r => {
              console.log(r, this.domain.roleId);
              if (r.data.length === 0 || r.data[0].roleId === this.domain.roleId) {
                if (this.domain.roleId) {
                  RoleApi.modify(this.domain.roleId, this.domain).then(r => {
                    this.visible = false;
                    this.$message.success('修改角色成功');
                    this.$emit('ok', this.domain);
                  });
                } else {
                  RoleApi.add(this.domain).then(r => {
                    this.visible = false;
                    this.$message.success('新增角色成功');
                    this.$emit('ok', this.domain);
                  });
                }
              } else {
                this.$message.error('角色名称已存在');
              }
            });
          }
        });
      },
    },
  };
</script>
