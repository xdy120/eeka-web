<template>
  <el-form :model="domain">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="会员昵称">
          <el-input v-model="domain['sub.memberName']"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品编码">
          <el-input v-model="domain.productCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="规格编码">
          <el-input v-model="domain.skuCode"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="配货状态">
          <enum-selector enum-name="DispatchStatus" v-model="domain.dispatchStatus"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发货状态">
          <enum-selector enum-name="DeliveryStatus" v-model="domain.deliveryStatus"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退款状态">
          <enum-selector enum-name="RefundStatus" v-model="domain.refundStatus"></enum-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="支付状态">
          <enum-selector enum-name="SalesOrderPayStatus" v-model="domain.payStatus"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单类型">
          <enum-selector enum-name="SalesOrderType"
                         v-model="domain['sub.salesOrderType']"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="预售类型">
          <enum-selector enum-name="PresellType"
                         v-model="domain['sub.presellType']"></enum-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="制单人">
          <el-input v-model="domain.creator"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建类型">
          <enum-selector enum-name="SalesOrderCreateType"
                         v-model="domain['sub.createType']"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="快递单号">
          <el-input v-model="domain.lastExpressNo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="审核人">
          <el-input v-model="domain.auditor"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审核时间">
          <go-date-time-picker v-model="domain.auditedTimeBegin"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <go-date-time-picker v-model="domain.auditedTimeEnd"></go-date-time-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="赠品策略">
          <el-input v-model="domain.giftStrategyCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="留单日期">
          <go-date-picker v-model="domain.holdDateBegin"></go-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <go-date-picker v-model="domain.holdDateEnd"></go-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" style="text-align: right">
        <el-button-group>
          <go-search-button @click="clickSearch">搜索</go-search-button>
          <go-clean-button @click="reset">清空</go-clean-button>
        </el-button-group>
        <el-button type="info" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>

  export default {
    name: 'SalesOrderAdvanceQuery',
    props: {
      filter: Object
    },
    data() {
      return {
        domain: this.filter
      };
    },
    watch: {
      filter(val) {
        this.domain = val;
      }
    },
    methods: {
      reset() {
        this.$emit('reset');
      },
      search() {
        this.$emit('search', this.domain);
      },
      cancel() {
        this.$emit('cancel');
      }
    }
  };
</script>