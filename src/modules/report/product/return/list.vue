<template>
  <el-container>
    <el-header class="oms-search" height="70px">
      <el-form ref="filterForm" :model="filter" @keyup.enter.native="clickSearch" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input v-model="filter.productCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码">
              <el-input v-model="filter.skuCodes" :placeholder="Placeholders.IN"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退货时间">
              <go-date-time-picker v-model="filter.unpackedTimeBegin"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.unpackedTimeEnd"></go-date-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector multiple v-model="filter.storeIds"></store-selector>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-row>
        <el-col :span="20">
          <el-button-group>
            <go-search-button @click="clickQuery">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
            <el-button @click="showExport">导出</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"/>
        <el-table-column label="退货时间" property="unpackedTime" width="150px"/>
        <el-table-column label="商品编码" prop="productCode" width="120px" sortable/>
        <el-table-column label="商品名称" prop="productName" width="120px"/>
        <el-table-column label="规格编码" prop="skuCode" width="120px" sortable/>
        <el-table-column label="规格名称" prop="skuName" width="120px"/>
        <go-quantity-column label="退货量" prop="quantity" width="120px"/>
        <go-money-column label="退款金额" prop="refundAmount" width="100px"/>
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
  import {ReportProductReturnApi} from '@/modules/report/api';
  import {Placeholders} from '@/libs/util';
  import {StoreSelector} from '@/modules/selector';

  export default {
    mixins: [TableResize, List, PageList],
    components: {StoreSelector},
    props: {},
    data() {
      return {
        api: ReportProductReturnApi,
        rules: {},
        Placeholders
      };
    },
    methods: {
      clickQuery() {
        if (!this.filter.unpackedTimeBegin && !this.filter.unpackedTimeEnd) {
          this.$message.warning('退货时间不能为空');
          return;
        }
        this.clickSearch();
      },
      showExport() {
        if (!this.filter.unpackedTimeBegin && !this.filter.unpackedTimeEnd) {
          this.$message.warning('退货时间不能为空');
          return;
        }
        this.exportData(value => this.api.exportReturn(value, this.filter));
      },
    }
  };
</script>