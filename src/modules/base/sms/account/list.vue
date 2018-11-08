<template>
  <el-container>

    <el-header>
      <el-button @click="openAdd">新增账号</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="smsAccounts" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="账号名称" prop="smsAccountName"></el-table-column>
        <el-table-column label="账号" prop="smsAccount"></el-table-column>
        <el-table-column label="密码" prop="smsPassword"></el-table-column>
        <el-table-column label="产品编码" prop="smsProduct"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="修改时间" prop="modifiedTime"/>
        <el-table-column label="创建时间" prop="createdTime"/>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <go-modify-button type="text" @click="openEdit(scope.$index)"></go-modify-button>
            <go-delete-button type="text" @click="remove(scope.$index)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!--短信帐户-->
    <el-dialog title="短信账号" :visible.sync="smsAccountFormVisible" width="40%" :close="cancel">
      <el-form :model="smsAccountForm" ref="smsAccountForm" label-width="100px">
        <el-form-item label="账户名称" label-width="100px" prop="smsAccountName"
                      :rules="[
                        { required: true, message: '请输入名称', trigger: 'blur,change' },
                        { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur,change' }
                    ]">
          <el-input v-model="smsAccountForm.smsAccountName"/>
        </el-form-item>
        <el-form-item label="账户帐号" label-width="100px" prop="smsAccount"
                      :rules="[
                        { required: true, message: '请输入账号，不能重复', trigger: 'blur,change' },
                        { min: 3, max: 32, message: '长度在 3 到 32 个字符，不能重复', trigger: 'blur,change' }
                    ]">
          <el-input v-model="smsAccountForm.smsAccount"/>
        </el-form-item>
        <el-form-item label="密   码" label-width="100px" prop="smsPassword"
                      :rules="[
                        { required: true, message: '请输入密码', trigger: 'blur,change' },
                        { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur,change' }
                    ]">
          <el-input v-model="smsAccountForm.smsPassword"/>
        </el-form-item>
        <el-form-item label="产品编号" label-width="100px" prop="smsProduct"
                      :rules="[
                        { required: true, message: '请输入产品编号', trigger: 'blur,change' },
                        { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur,change' }
                    ]">
          <el-input v-model="smsAccountForm.smsProduct"/>
        </el-form-item>
        <el-form-item label="备   注" label-width="100px">
          <el-input type="textarea" v-model="smsAccountForm.remark"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </el-container>


</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';
  import api from './api';

  export default {
    name: 'SmsAccount',
    mixins: [TableResize],
    components: {},
    props: {},
    data() {
      return {
        smsAccounts: [],
        smsAccountFormVisible: false,
        smsAccountForm: {},
      };
    },
    methods: {
      openAdd() {
        this.smsAccountForm = {};
        this.smsAccountFormVisible = true;
      },
      openEdit(index) {
        this.smsAccountForm = this.smsAccounts[index];
        this.smsAccountFormVisible = true;
      },
      list() {
        api.list().then(response => {
          this.smsAccounts = response;
        });
      },
      save() {
        this.$refs.smsAccountForm.validate().then(() => {
          if (this.smsAccountForm.smsAccountId) {
            api.modify(this.smsAccountForm.smsAccountId, this.smsAccountForm).then((response) => {
              this.list();
              this.cancel();
            });
          }
          else {
            let params2 = {smsAccount: this.smsAccountForm.smsAccount, page: 1, pageSize: 1};
            api.listPaging(params2).then(
              r => {
                if (r.data.length === 0) {
                  api.add(this.smsAccountForm).then(() => {
                    this.list();
                    this.cancel();
                  });
                } else {
                  this.$message.error('账户账号已存在');
                }
              });

          }
        });
      },
      remove(index) {
        this.deleteConfirm(() => {
          api.remove(this.smsAccounts[index].smsAccountId).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list();
          });
        });
      },
      cancel() {
        this.smsAccountFormVisible = false;
        this.smsAccountForm = {};
      }
    }
  };
</script>