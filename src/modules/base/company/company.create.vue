<template>
  <el-dialog title="编辑" :visible.sync="visible" width="450px" :close-on-click-modal="false"
             :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px">
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="domain.companyName"></el-input>
      </el-form-item>
      <el-form-item label="公司编号" prop="companyCode">
        <el-input v-model="domain.companyCode"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="domain.telephone"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="companySubmit('editForm')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {CompanyApi} from './api';

  export default {
    name: 'CompanyCreator',
    mixins: [Edit],
    components: {},
    props: {},
    data() {
      return {
        pk: 'companyId',
        api: CompanyApi,
        rules: {
          companyName: [
            {required: true, max: 15, message: '名称[1-15]不能为空', trigger: 'manual'},
          ],
          companyCode: [
            {required: true, max: 20, message: '编码[1-20]不能为空', trigger: 'manual'},
          ],
          telephone: ValidateRules.telephone,
          mobile: ValidateRules.telephone,
        },
      };
    },
    methods: {
      show(row) {
        if (row.companyId) {
          CompanyApi.get(row.companyId).then(response => {
            this.domain = response;
          });
        } else {
          this.domain = {};
        }
        this.visible = true;
      },
      companySubmit(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            //验证公司编码是否已存在
            CompanyApi.list({companyName: this.domain.companyName}).then(r => {
              if (r.length === 0 || r[0].companyId === this.domain.companyId) {
                CompanyApi.list({companyCode: this.domain.companyCode}).then(r => {
                  if (r.length === 0 || r[0].companyId === this.domain.companyId) {
                    if (this.domain.companyId) {
                      CompanyApi.modify(this.domain.companyId, this.domain).then(r => {
                        this.$message.success('修改公司成功');
                        this.visible = false;
                        this.$emit('ok', this.domain);
                      });
                    } else {
                      CompanyApi.add(this.domain).then(r => {
                        this.$message.success('新增公司成功');
                        this.visible = false;
                        this.$emit('ok', this.domain);
                      });
                    }
                  } else {
                    this.$message.error('公司编码已存在');
                  }
                });
              } else {
                this.$message.error('公司名称已存在');
              }
            });
          }
        });
      },
    },
  };
</script>