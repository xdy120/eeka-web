<template>
  <el-form :model="domain" :rules="rules" ref="editForm" label-width="120px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="借调人" prop="loanUser">
          <user-selector :nickname.sync="domain.loanUser"
                         placeholder="请选择借调人"></user-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="品牌" prop="brandName">
          <data-dict-item-selector v-model="domain.brandName" :code.sync="domain.brandCode"
                                   data-dict-id="10101"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="借调类型" prop="loanType">
          <data-dict-item-selector v-model="domain.loanType"
                                   data-dict-id="10705"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="借出仓库" prop="virtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.virtualWarehouseName"
                                      :warehouseId.sync="domain.warehouseId"
                                      :warehouseName.sync="domain.warehouseName"
                                      :clearable="false"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="归还时间" prop="expectReturnDate">
          <el-date-picker v-model="domain.expectReturnDate" type="date"
                          value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="domain.telephone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="domain.address"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否需要归还" prop="needReturn">
          <el-checkbox v-model="domain.needReturn"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {StockLoanOutApi} from './api';
  import {DataDictItemSelector, UserSelector, VirtualWarehouseSelector} from '@/modules/selector';

  export default {
    name: 'EditBasic',
    components: {VirtualWarehouseSelector, DataDictItemSelector, UserSelector},
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        api: StockLoanOutApi,
        pk: 'stockLoanOutId',
        rules: {
          loanUser: ValidateRules.required,
          virtualWarehouseId: ValidateRules.required,
          loanType: ValidateRules.required,
          telephone: ValidateRules.telephone,
          address: [
            {min: 2, max: 50, message: '长度在 2 到 50 个字符'}
          ],
          remark: [
            {min: 2, max: 50, message: '长度在 2 到 50 个字符'}
          ]
        }
      };
    },
    watch: {
      value(val) {
        this.domain = val;
      }
    },
    methods: {
      validate() {
        this.$emit('input', this.domain);
        return this.$refs.editForm.validate();
      },
      resetFields() {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      }
    },

  };
</script>