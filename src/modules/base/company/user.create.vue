<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="所属部门" prop="departmentId">
            <el-input v-model="domain.departmentName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录帐户" label-width="100px" prop="loginName">
            <el-input v-model="domain.loginName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="员工姓名" label-width="100px" prop="userName">
            <el-input v-model="domain.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户呢称" label-width="100px" prop="nickname">
            <el-input v-model="domain.nickname"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="手机" label-width="100px" prop="mobile">
            <el-input v-model="domain.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" label-width="100px" prop="telephone">
            <el-input v-model="domain.telephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {UserApi} from './api';

  export default {
    name: 'UserCreator',
    mixins: [Edit],
    components: {},
    data() {
      return {
        pk: 'userId',
        api: UserApi,
        rules: {
          loginName: [
            {required: true, min: 6, max: 20, message: '登陆名[6-20]不能为空', trigger: 'manual'},
          ],
          userName: [
            {required: true, min: 2, max: 10, message: '姓名名[2-10]不能为空', trigger: 'manual'},
          ],
          nickname: [
            {required: true, min: 2, max: 10, message: '呢称[2-10]不能为空', trigger: 'manual'},
          ],
          mobile: ValidateRules.mobile,
          telephone: ValidateRules.telephone,
        },
      };
    },
    methods: {
      show(row) {
        if (row.userId) {
          UserApi.get(row.userId).then(data => {
            this.domain = data;
            this.visible = true;
          });
        } else {
          this.domain = {departmentId: row.departmentId, departmentName: row.departmentName};
          this.visible = true;
        }
      }
    }
  };
</script>