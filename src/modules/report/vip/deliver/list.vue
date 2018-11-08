<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector multiple v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货日期" prop="deliveryDateBegin">
              <go-date-picker v-model="filter.deliveryDateBegin"></go-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到" prop="deliveryDateEnd">
              <go-date-picker v-model="filter.deliveryDateEnd"></go-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickQuery">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="exportVipDelivery">导出</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="店铺名称" prop="storeName" width="150px"></el-table-column>
        <el-table-column label="商品编码" prop="productCode" width="120px" sortable></el-table-column>
        <el-table-column label="商品名称" prop="productName" width="120px"></el-table-column>
        <el-table-column label="规格编码" prop="skuCode" width="120px" sortable></el-table-column>
        <el-table-column label="规格名称" prop="skuName" width="200px"></el-table-column>
        <go-quantity-column label="发货数量" prop="quantity" width="120px"></go-quantity-column>
      </el-table>
    </el-main>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins/index';
  import {ReportVipDeliverApi} from '@/modules/report/api';
  import {StoreSelector} from '@/modules/selector';
  import {Util,ValidateRules} from '@/libs/util';

  export default {
    mixins: [TableResize, List, PageList],
    components: {
      StoreSelector
    },
    props: {},
    data() {
      return {
        api: ReportVipDeliverApi,
        rules: {
          deliveryDateBegin: ValidateRules.required,
          deliveryDateEnd: ValidateRules.required
        }
      };
    },
    methods: {
      clickQuery(){
        this.$refs.filterForm.validate().then(() => {
          this.search();
        });
      },
      exportVipDelivery() {
        this.$refs.filterForm.validate().then(() => {
          this.exportData(value=>this.api.exportVipDelivery(value, this.filter));
        });
      }
    }
  };
</script>