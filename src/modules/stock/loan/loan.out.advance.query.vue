<template>
  <el-form :model="domain">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="制单时间">
          <span class="demonstration"></span>
          <go-date-time-picker v-model="filter.createdTimeBegin"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <span class="demonstration"></span>
          <go-date-time-picker v-model="filter.createdTimeEnd"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="制单人" label-width="100px">
          <el-input v-model="filter.creator" :placeholder="Placeholders.LIKE"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="审核时间">
          <span class="demonstration"></span>
          <go-date-time-picker v-model="filter.auditedTimeBegin"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <span class="demonstration"></span>
          <go-date-time-picker v-model="filter.auditedTimeEnd"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审核人" label-width="100px">
          <el-input v-model="filter.auditor" :placeholder="Placeholders.LIKE"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="更新时间">
          <span class="demonstration"></span>
          <go-date-picker v-model="filter.modifiedTimeBegin"></go-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <span class="demonstration"></span>
          <go-date-picker v-model="filter.modifiedTimeEnd"></go-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="最后入库时间">
          <span class="demonstration"></span>
          <go-date-time-picker v-model="filter.lastInTimeBegin"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <span class="demonstration"></span>
          <go-date-time-picker v-model="filter.lastInTimeEnd"></go-date-time-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="规格名称">
          <el-input v-model="filter.skuName" :placeholder="Placeholders.LIKE"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品编码">
          <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品名称">
          <el-input v-model="filter.productName" :placeholder="Placeholders.LIKE"></el-input>
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
  import {Placeholders} from '@/libs/util';

  export default {
    name: 'AdvanceQuery',
    props: {
      filter: Object
    },
    data() {
      return {
        domain: this.filter,
        Placeholders
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