<template>
  <el-form :model="domain" label-width="100px">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="申请时间">
          <div class="block">
            <go-date-time-picker v-model="filter.appliedTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <go-date-time-picker v-model="filter.appliedTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系人">
          <el-input v-model="filter.contact" placeholder="精确搜索"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="制单时间">
          <go-date-time-picker v-model="filter.createdTimeBegin"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <go-date-time-picker v-model="filter.createdTimeEnd"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="手机号" label-width="100px">
          <el-input v-model="filter.mobile"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="快递单号">
          <el-input v-model="filter.expressNos" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退入商品编码">
          <el-input v-model="filter.inProductCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退入规格编码">
          <el-input v-model="filter.inSkuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="换出商品编码">
          <el-input v-model="filter.outProductCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="换出规格编码">
          <el-input v-model="filter.outSkuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
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
  import {ExpressSelector, VirtualWarehouseSelector} from '@/modules/selector';

  export default {
    name: 'AdvanceQuery',
    components: {VirtualWarehouseSelector, ExpressSelector},
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