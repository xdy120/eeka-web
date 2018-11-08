<template>
  <el-form :model="domain" :rules="rules" ref="editForm">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="订单号" prop="salesOrderId">
          <sales-order-selector v-model="domain.salesOrderId"
                                :outFilter="SalesFilter"
                                :disabled="disabled"
                                :SalesOrderCode="domain.salesOrderCode"
                                @confirm="saleConfirm">
          </sales-order-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="交易号" prop="tradeId">
          <el-input v-model="domain.tradeId" readonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="店铺" prop="storeId">
          <store-selector v-model="domain.storeId" :storeName.sync="domain.storeName"
                          :disabled="disabled"></store-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="退款类型" prop="refundType">
          <enum-selector v-model="domain.refundType" enum-name="RefundType"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退款方式" prop="refundMethod">
          <data-dict-item-selector v-model="domain.refundMethod"
                                   :dataDictId="10305"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退款原因" prop="returnReasonType">
          <data-dict-item-selector v-model="domain.returnReasonType"
                                   :dataDictId="10304"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="退入户名" prop="payeeName">
          <el-input v-model="domain.payeeName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="退入帐户" prop="payeeNo">
          <el-input v-model="domain.payeeNo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="domain.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-form-item>
        <el-checkbox v-model="domain.cod">货到付款</el-checkbox>
        <el-checkbox v-model="domain.quickRefund">急速退款</el-checkbox>
        <el-checkbox v-model="domain.refunded">是否已退款</el-checkbox>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {
    DataDictItemSelector,
    ExpressSelector,
    MemberSelector,
    SalesOrderSelector,
    StoreSelector
  } from '@/modules/selector';
  import RefundOrderBasic from './edit.basic.vue';
  import {RefundOrderApi} from '../api';

  export default {
    name: 'RefundOrderBasic',
    components: {
      StoreSelector,
      SalesOrderSelector,
      MemberSelector,
      ExpressSelector,
      DataDictItemSelector
    },
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        disabled: false,
        SalesFilter: {
          statuses: 'DELIVERED'
        },
        rules: {
          salesOrderId: ValidateRules.required,
          tradeId: ValidateRules.required,
          storeId: ValidateRules.required,
          refundMethod: ValidateRules.required,
          refundType: ValidateRules.required,
          inWarehouseId: ValidateRules.required,
          expressId: ValidateRules.required,
          expressNo: ValidateRules.required,
          returnReasonType: ValidateRules.required,
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
      },
      saleConfirm(data) {
        this.domain.salesOrderCode = data.salesOrderCode;
        this.domain.tradeId = data.tradeId;
        this.domain.storeId = data.storeId;
        this.domain.storeName = data.storeName;
        this.domain.contact = data.contact;
        this.domain.memberId = data.sub.memberId;
        this.domain.memberName = data.sub.memberName;
        this.domain.cod = data.sub.cod;
        let params = {page: 1, pageSize: 1, salesOrderId: data.salesOrderId};
        RefundOrderApi.list(params).then(r => {
          if (r.total > 0) {
            this.$confirm(`退款单列表中已存在 ${r.total}张单据, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

            }).catch(() => {
              this.domain = {};
              this.$message.info('已取消选择');
            });
          }
        });
      }
    }, created() {
      if (this.domain.salesOrderId) {
        this.disabled = true;
      }
    }
  };
</script>