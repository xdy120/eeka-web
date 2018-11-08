<template>
  <el-dialog title="编辑" :visible.sync="visible" width="450px" :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px">
      <el-form-item label="所属公司" prop="companyId">
        <el-input v-model="domain.companyName" readonly></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="parentId" v-if="isParentSeen">
        <el-input v-model="domain.parentName" readonly></el-input>
      </el-form-item>
      <el-form-item label="部门编号" prop="departmentCode">
        <el-input v-model="domain.departmentCode"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="departmentName">
        <el-input v-model="domain.departmentName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="departmentSubmit('editForm')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {DepartmentApi} from './api';

  export default {
    name: 'DepartmentCreator',
    mixins: [Edit],
    data() {
      return {
        pk: 'departmentId',
        api: DepartmentApi,
        isParentSeen: true,
        rules: {
          companyId: ValidateRules.required,
          parentId: ValidateRules.required,
          departmentCode: [
            {required: true, max: 10, message: '编码[1-10]不能为空', trigger: 'manual'},
          ],
          departmentName: [
            {required: true, max: 10, message: '名称[1-10]不能为空', trigger: 'manual'},
          ]
        },
      };
    },
    methods: {
      show(row) {
        if (row.departmentId) {
          DepartmentApi.get(row.departmentId).then(response => {
            this.domain = response;
            if (response.parentId === '0') {
              this.isParentSeen = false;
            } else {
              this.domain.parentName = row.departmentName;
              this.isParentSeen = true;
            }
          });
        } else if (row.companyId) {
          this.domain = {};
          this.domain.companyId = row.companyId;
          this.domain.companyName = row.companyName;
        }
        this.visible = true;
      },
      add(row) {
        if (row.departmentId) {
          DepartmentApi.get(row.departmentId).then(response => {
            this.domain = {};
            this.domain.companyId = response.companyId;
            this.domain.companyName = response.companyName;
            this.domain.parentId = response.departmentId;
            this.domain.parentName = response.departmentName;
            this.isParentSeen = true;
          });
        } else if (row.companyId) {
          this.domain = {};
          this.domain.companyId = row.companyId;
          this.domain.companyName = row.companyName;
          this.isParentSeen = false;
        }
        this.visible = true;
      },
      departmentSubmit(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            DepartmentApi.list({
              companyName: this.domain.companyName,
              parentName: this.domain.parentName,
              departmentName: this.domain.departmentName
            }).then(r => {
              if (r.length === 0 || r[0].departmentId === this.domain.departmentId) {
                DepartmentApi.list({
                  companyName: this.domain.companyName,
                  parentName: this.domain.parentName,
                  departmentCode: this.domain.departmentCode
                }).then(r => {
                  if (r.length === 0 || r[0].departmentId === this.domain.departmentId) {
                    if (this.domain.departmentId) {
                      DepartmentApi.modify(this.domain.departmentId, this.domain).then(r => {
                        this.$message.success('修改部门成功');
                        this.visible = false;
                        this.$emit('ok', this.domain);
                      });
                    } else {
                      DepartmentApi.add(this.domain).then(response => {
                        this.$message.success('新增部门成功');
                        this.visible = false;
                        this.$emit('ok', this.domain);
                      });
                    }

                  } else {
                    this.$message.error('部门编码已存在');
                  }
                });
              } else {
                this.$message.error('部门名称已存在');
              }
            });
          }
        });
      },
    },
  };
</script>