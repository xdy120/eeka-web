<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" ref="domain" label-width="100px">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="供应商编码" prop="supplierCode">
            <el-input v-model="domain.supplierCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商全称" prop="supplierName">
            <el-input v-model="domain.supplierName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="供应商简称" prop="supplierShortName">
            <el-input v-model="domain.supplierShortName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="domain.companyName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="开户帐号名称" prop="bankAccountName">
            <el-input v-model="domain.bankAccountName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户帐号" prop="bankAccountNo">
            <el-input v-model="domain.bankAccountNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="开户行" prop="bank">
            <el-input v-model="domain.bank"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算方式" prop="supplierSettlementType">
            <enum-selector v-model="domain.supplierSettlementType"
                           enum-name="SupplierSettlementType"></enum-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="domain.telephone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="domain.mobile"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="domain.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="domain.contact"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input v-model="domain.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="domain.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="submit('domain')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {SupplierApi} from '../api';
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'SupplierEditor',
    mixins: [Edit],
    components: {},
    data() {
      return {
        pk: 'supplierId',
        api: SupplierApi,
        rules: {
          supplierCode: [
            ValidateRules.required,
            {min: 2, max: 10, message: '长度在 2 到 10 个字符'}
          ],
          supplierName: [
            ValidateRules.required,
            {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
          ],
          supplierShortName: [
            ValidateRules.required,
            {min: 2, max: 10, message: '长度在 2 到 10 个字符'}
          ],
          supplierSettlementType: ValidateRules.required,
          companyName: [
            {min: 5, max: 20, message: '长度在 5 到 20 个字符'}
          ],
          telephone: ValidateRules.telephone,
          email: ValidateRules.email,
          bankAccountName: [
            {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
          ],
          bankAccountNo: [
            {min: 5, max: 20, message: '长度在 5 到 20 个字符'}
          ],
          bank: [
            {min: 5, max: 20, message: '长度在 5 到 20 个字符'}
          ],
          contact: [
            {min: 1, max: 5, message: '长度在 1 到 5 个字符'}
          ],
          remark: [
            {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
          ],
        }
      };
    },
    methods: {
      submit(domain) {
        this.$refs[domain].validate((valid) => {
          if (valid) {
            if (this.domain.supplierId) {
              SupplierApi.modify(this.domain.supplierId, this.domain).then(r => {
                this.$message.success('供应商修改成功');
              });
            } else {
              SupplierApi.add(this.domain).then(r => {
                this.$message.success('供应商新增成功');
              });
            }
            this.visible = false;
            this.$emit('search');
          } else {
            return false;
          }
        });
      },
    }
  };
</script>