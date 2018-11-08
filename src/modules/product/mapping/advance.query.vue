<template>
  <el-form :model="domain">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="创建时间">
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
        <el-form-item label="品牌">
          <data-dict-item-selector v-model="filter.brandName" data-dict-id="10101"
                                   :code.sync="domain.brandCode"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="更新时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.modifiedTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.modifiedTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="系统商品名称">
          <el-input v-model="filter.productName" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="系统规格名称">
          <el-input v-model="filter.skuName" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="平台规格名称">
          <el-input v-model="filter.mallSkuName" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="平台商品名称">
          <el-input v-model="filter.mallProductName" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>

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
  import {DataDictItemSelector} from '@/modules/selector';

  export default {
    name: 'AdvanceQuery',
    components: {DataDictItemSelector},
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