<template>
  <el-form :model="domain">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="拆包时间">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.unpackedTimeBegin"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="至">
          <div class="block">
            <span class="demonstration"></span>
            <go-date-time-picker v-model="filter.unpackedTimeEnd"></go-date-time-picker>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="拆包人" label-width="100px">
          <el-input v-model="filter.packer"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
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
          <el-input v-model="filter.creator"></el-input>
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
          <el-input v-model="filter.auditor"></el-input>
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
          <el-input v-model="filter.reviewer"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="会员呢称" label-width="100px">
          <el-input v-model="filter.unpacker" placeholder="支持右侧模糊匹配"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="手机号" label-width="100px">
          <el-input v-model="filter.mobile" placeholder="精确搜索"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="外部单号" label-width="100px">
          <el-input v-model="filter.outerCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="分销单号" label-width="100px">
          <el-input v-model="filter.distributionTradeIds" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退入仓库">
          <virtual-warehouse-selector
              v-model="filter.inVirtualWarehouseId"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="换出仓库">
          <virtual-warehouse-selector
              v-model="filter.outVirtualWarehouseId"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="退入商品编码" label-width="100px">
          <el-input v-model="filter.productCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退入规格编码" label-width="100px">
          <el-input v-model="filter.skuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="换出商品编码" label-width="100px">
          <el-input v-model="filter.outProductCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="换出规格编码" label-width="100px">
          <el-input v-model="filter.outSkuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="换货单">
          <three-checkbox v-model="filter.exchange"></three-checkbox>
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