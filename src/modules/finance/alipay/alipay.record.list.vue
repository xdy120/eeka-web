<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="账务类型">
              <enum-selector enum-name="AlipayRecordType" v-model="filter.type"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <go-date-time-picker v-model="filter.alipayCreatedTimeBegin"></go-date-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="到">
              <go-date-time-picker v-model="filter.alipayCreatedTimeEnd"></go-date-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="download()">手工下载</el-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight">
        <el-table-column prop="storeName" label="店铺名称"/>
        <el-table-column prop="tradeId" label="交易号"/>
        <el-table-column prop="alipayOrderNo" label="账单单号"/>
        <go-money-column prop="outAmount" label="支出金额"/>
        <go-money-column prop="inAmount" label="收入金额"/>
        <el-table-column prop="memo" label="备注"/>
        <el-table-column prop="optUserId" label="对方账号"/>
        <el-table-column prop="merchantOrderNo" label="商户订单号"/>
        <go-date-time-column prop="alipayCreatedTime" label="平台创建时间"/>
        <el-table-column prop="selfUserId" label="商家账号"/>
        <go-enum-column enum-name="AlipayRecordType" prop="type" label="账务类型"/>
        <el-table-column prop="businessType" label="子业务类型"/>
        <el-table-column prop="businessTypeDesc" label="子业务类型描述"/>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <download ref="downloader"></download>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/selector';
  import {AlipayRecordApi} from './api';
  import Download from './alipay.record.download';

  export default {
    mixins: [List, TableResize, PageList],
    components: {StoreSelector, Download},
    data() {
      return {
        pk: 'alipayRecordId',
        api: AlipayRecordApi
      };
    },
    methods: {
      download() {
        this.$refs.downloader.show();
      }
    }
  };
</script>
