<template>
  <div :style="{height:tabsTableHeight+'px'}">
    <el-form :model="domain" class="oms-search">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="店铺">
            <el-input v-model="domain.storeName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交易号">
            <el-input v-model="domain.tradeId" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号">
            <el-input v-model="domain.salesOrderCode" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退换单号">
            <el-input v-model="domain.returnOrderCode" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="退款类型">
            <enum-selector v-model="domain.refundType" enum-name="RefundType"></enum-selector>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退款方式">
            <el-input v-model="domain.refundMethod" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="应退金额">
            <el-input v-model="domain.refundableAmount" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实退金额">
            <el-input v-model="domain.actualAmount" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="退款原因">
            <el-input v-model="domain.returnReasonType" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收款人">
            <el-input v-model="domain.payeeName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款帐号">
            <el-input v-model="domain.payeeNo" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="domain.remark" type="textarea" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import {TableResize, Tabs} from '@/libs/mixins';
  import {DataDictItemSelector, StoreSelector} from '@/modules/base/index';

  export default {
    name: 'RefundOrderBasic',
    mixins: [TableResize, Tabs],
    components: {StoreSelector, DataDictItemSelector},
    props: {
      parentData: {
        required: true
      }
    },
    data() {
      return {
        tab: 'basic',
        domain: this.parentData ? this.parentData : {}
      };
    },
    watch: {
      parentData(val) {
        this.domain = val ? val : {};
      }
    }
  };
</script>