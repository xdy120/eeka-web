<template>
  <el-form :model="domain" :rules="rules" ref="editForm">
    <el-form-item label="借出单号" prop="stockLoanOutCode">
      <loan-out-selector v-model="domain.stockLoanOutCode"
                         :stockLoanOutCode.sync="domain.stockLoanOutCode"
                         @confirm="lanOutChange"></loan-out-selector>
    </el-form-item>
    <el-form-item label="借调人" prop="loanUser">
      <user-selector :nickname.sync="domain.loanUser"
                     placeholder="请选择借调人"></user-selector>
    </el-form-item>
    <el-form-item label="还入仓库" prop="virtualWarehouseId">
      <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                  :virtualWarehouseName.sync="domain.virtualWarehouseName"
                                  :warehouseId.sync="domain.warehouseId"
                                  :warehouseName.sync="domain.warehouseName"
                                  :clearable="false"></virtual-warehouse-selector>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" v-model="domain.remark"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {StockLoanInApi} from './api';
  import {DataDictItemSelector, UserSelector, VirtualWarehouseSelector} from '@/modules/selector';
  import LoanOutSelector from './loan.out.selector';

  export default {
    name: 'EditBasic',
    components: {VirtualWarehouseSelector, DataDictItemSelector, UserSelector, LoanOutSelector},
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        api: StockLoanInApi,
        pk: 'loanInId',
        rules: {
          virtualWarehouseId: ValidateRules.required,
          loanUser: ValidateRules.required,
          stockLoanOutCode: ValidateRules.required,
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
      lanOutChange(loanOut) {
        this.domain.virtualWarehouseId = loanOut.virtualWarehouseId;
        this.domain.virtualWarehouseName = loanOut.virtualWarehouseName;
        this.domain.warehouseId = loanOut.warehouseId;
        this.domain.warehouseName = loanOut.warehouseName;
        this.domain.loanUser = loanOut.loanUser;
      },
      validate() {
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