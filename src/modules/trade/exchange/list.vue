<template>
  <el-container>
    <el-header class="oms-search" height="65px">
      <el-form :model="filter" label-width="110px" @keyup.enter.native="clickSearch">

        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="换货单编号">
              <el-input v-model="filter.exchangeApplyOrderCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交易号">
              <el-input v-model="filter.tradeId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="退回快递号">
              <el-input v-model="filter.inExpressNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="退入规格编号">
              <el-input v-model="filter.inSkuCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="换出规格编号">
              <el-input v-model="filter.outSkuCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台换货状态">
              <enum-selector v-model="filter.mallExchangeStatus"
                             enum-name="MallExchangeStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台换货单号">
              <el-input v-model="filter.mallExchangeId"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-enum-column prop="status" enum-name="ExchangeApplyOrderStatus" label="状态"
                        width="100px"></go-enum-column>
        <!--平台的-->
        <el-table-column prop="mallExchangeId" width="120" label="平台换货单号"></el-table-column>
        <go-enum-column prop="mallExchangeStatus" enum-name="MallExchangeStatus" label="平台换货状态"
                        width="100px"></go-enum-column>
        <el-table-column prop="exchangeApplyOrderId" width="150px" label="换货单号"></el-table-column>
        <el-table-column prop="exchangeApplyOrderCode" width="150px"
                         label="换货单编码"></el-table-column>
        <el-table-column prop="tradeId" width="150px" label="交易号"></el-table-column>
        <go-quantity-column prop="quantity" width="70" label="数量"></go-quantity-column>
        <go-date-time-column prop="createdTime" width="100" label="创建时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" width="100" label="更新时间"></go-date-time-column>

        <!--退入的-->
        <el-table-column prop="inExpressNo" width="120" label="退入快递单号"></el-table-column>
        <el-table-column prop="inExpressName" width="120" label="退入快递名称"></el-table-column>
        <el-table-column prop="inProductName" width="120" label="退入商品名称"></el-table-column>
        <el-table-column prop="inProductCode" width="120" label="退入商品编码"></el-table-column>
        <el-table-column prop="inSkuName" width="145" label="退入商品规格名称"></el-table-column>
        <el-table-column prop="inSkuCode" width="145" label="退入商品规格编码"></el-table-column>
        <!--换出的-->
        <el-table-column prop="outMallSkuId" width="120" label="换出平台规格id"></el-table-column>
        <el-table-column prop="outExpressNo" width="120" label="换出快递单号"></el-table-column>
        <el-table-column prop="outExpressName" width="120" label="换出快递名称"></el-table-column>
        <el-table-column prop="outProductName" width="120" label="换出商品名称"></el-table-column>
        <el-table-column prop="outProductCode" width="120" label="换出商品编码"></el-table-column>
        <el-table-column prop="outSkuName" width="145" label="换出商品规格名称"></el-table-column>
        <el-table-column prop="outSkuCode" width="145" label="换出商品规格编码"></el-table-column>

        <!--地区-->
        <el-table-column width="100" label="区域路径">
          <template slot-scope="scope">
            {{scope.row.countryName}}/{{scope.row.provinceName}}/{{scope.row.cityName}}/{{scope.row.districtName}}
          </template>
        </el-table-column>
        <el-table-column prop="address" width="70" label="地址"></el-table-column>

        <el-table-column label="操作" width="90" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" v-if="showMatchExchange(scope.row)" @click="matchExchange(scope.row)" >匹配异常申请</el-button>
            <!--<go-audit-button v-if="scope.row.status === 'CREATED'" tooltip="同意" @click="agree(scope.row)"></go-audit-button>-->
            <!--<go-invalid-button v-if="scope.row.status === 'CREATED'" tooltip="拒绝" @click="refuse(scope.row)"></go-invalid-button>-->
          </template>
        </el-table-column>


      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <refuse-creator ref="refuse" @ok="search"></refuse-creator>
  </el-container>


</template>

<script>
  import {ExchangeApi} from './api.js';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {ExpressSelector, StoreSelector, VirtualWarehouseSelector} from '@/modules/selector';
  import {LogPopover, LogTab} from '@/component/log';
  import RefuseCreator from './refuse';

  export default {
    mixins: [List, PageList, TableResize],
    components: {
      LogPopover, StoreSelector, RefuseCreator,
      VirtualWarehouseSelector,
      ExpressSelector,
      LogTab
    },
    data() {
      return {
        api: ExchangeApi,
        pk: 'mallExchangeOrderId',
      };
    },
    methods: {
      agree(row) {
        ExchangeApi.agree(row.exchangeApplyOrderId).then(response => {
          this.$message.success('同意换货');
        });
      },
      refuse(row) {
        this.$refs.refuse.show(row.exchangeApplyOrderId);
      },
      showMatchExchange(row){
        if ((!row.outProductId && !row.outSkuId) || !row.tradeId){
          return true;
        }
      },
      matchExchange(row){
        ExchangeApi.matchExchange(row.exchangeApplyOrderId,row).then(responst=>{
          this.$message.success('匹配成功');
        });
      }
    }

  };
</script>
