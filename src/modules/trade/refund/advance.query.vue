<template>
  <el-form :model="domain">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="制单时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.createdTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.createdTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="制单人" label-width="100px">
          <el-input v-model="filter.creator" placeholder=""></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="审核时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.auditedTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.auditedTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审核人" label-width="100px">
          <el-input v-model="filter.auditor" placeholder=""></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="复核时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.reviewTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.reviewTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="复核人" label-width="100px">
          <el-input v-model="filter.reviewer" placeholder=""></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="收款人">
          <el-input v-model="filter.payeeName" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收款帐号">
          <el-input v-model="filter.payeeNo" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退款原因">
          <el-input v-model="filter.returnReasonType" placeholder=""></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-form-item label="货到付款">
          <three-checkbox v-model="filter.cod"></three-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="快速退款">
          <three-checkbox v-model="filter.quickRefund"></three-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="已退款">
          <three-checkbox v-model="filter.refunded"></three-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="规格编码">
          <el-input v-model="filter.skuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="规格名称">
          <el-input v-model="filter.skuName" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品编码">
          <el-input v-model="filter.productCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品名称">
          <el-input v-model="filter.productName" placeholder="支持右侧模糊匹配"></el-input>
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
    name: 'AdvanceQuery',
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