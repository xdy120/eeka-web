<template>
  <el-dialog title="密码修改" :visible.sync="visible" :before-close="dialogCloseConfirm"
             :close-on-press-escape="escBtn" :show-close="closeBtn"
             :close-on-click-modal="modalClose">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="提示" v-if="force">
        <span style="color:red">当前密码与默认密码相同，修改后才能继续操作</span>
      </el-form-item>
      <el-form-item label="原密码" prop="pwd">
        <el-input type="password" v-model="domain.pwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="domain.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input type="password" v-model="domain.confirmPwd"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="modifyPwd">确认修改</el-button>
  </el-dialog>
</template>

<script>
  import {ValidateRules} from '@/libs/util';
  import {UserApi} from './api';
  import {Edit} from '@/libs/mixins';

  export default {
    name: 'PasswordEditor',
    mixins: [Edit],
    data() {
      let validatePwd = (rule, value, callback) => {
        if (this.domain.newPwd !== this.domain.confirmPwd) {
          callback(new Error('新密码与确认密码不一致！'));
        } else {
          callback();
        }
      };
      return {
        domain: {},
        api: UserApi,
        rules: {
          pwd: ValidateRules.requiredMax,
          newPwd: [ValidateRules.password, {validator: validatePwd}],
          confirmPwd: [ValidateRules.password, {validator: validatePwd}]
        },
        escBtn: true,
        closeBtn: true,
        modalClose: true,
        force: false
      };
    },
    methods: {
      show(isForce) {
        if (isForce) {
          this.escBtn = false;
          this.closeBtn = false;
          this.modalClose = false;
          this.force = true;
        }
        this.domain = {};
        this.editMode = true;
        this.visible = true;
      },
      modifyPwd() {
        this.$refs.editForm.validate().then(() => {
          UserApi.modifyPassword(this.$store.getters.user.userId, this.domain).then(() => {
            this.$message.success('密码修改成功！');
            this.visible = false;
          });
        });
      }
    }
  };
</script>
