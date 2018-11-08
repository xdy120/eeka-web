<template>
  <el-container>
    <el-header class="oms-search" height="120">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="交易号">
              <el-input v-model="filter.tradeIds" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="会员">
              <el-input v-model="filter.memberName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态">
              <enum-selector v-model="filter.statuses" multiple
                             enum-name="RefundApplyOrderStatus"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="申请类型">
              <enum-selector v-model="filter.refundApplyOrderType"
                             enum-name="RefundApplyOrderType"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商城状态">
              <enum-selector v-model="filter.mallRefundStatus"
                             enum-name="MallRefundStatus"></enum-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快递单号">
              <el-input v-model="filter.expressNos" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="padding-left: 60px">
            <go-toggle v-model="advanceQueryVisible" on-text="高级查询" off-text="简单查询"
                       :show-text="true"
                       :show-icon="false"></go-toggle>
          </el-col>
        </el-row>
        <template v-if="advanceQueryVisible">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="申请时间">
                <div class="block">
                  <go-date-time-picker v-model="filter.appliedTimeBegin"></go-date-time-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="至">
                <div class="block">
                  <go-date-time-picker v-model="filter.appliedTimeEnd"></go-date-time-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input v-model="filter.contact" placeholder="精确搜索"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="退入商品编码">
                <el-input v-model="filter.inProductCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="制单时间">
                <go-date-time-picker v-model="filter.createdTimeBegin"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="至">
                <go-date-time-picker v-model="filter.createdTimeEnd"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号">
                <el-input v-model="filter.mobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="退入规格编码">
                <el-input v-model="filter.inSkuCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="外部单号">
                <el-input v-model="filter.mallRefundIds" placeholder="支持多个查询，英文逗号隔开"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
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
        <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
        <el-table-column prop="tradeId" label="交易号" width="150px" fixed></el-table-column>
        <go-enum-column prop="mallRefundStatus" enum-name="MallRefundStatus" label="商城状态"
                        width="120px" fixed></go-enum-column>
        <el-table-column prop="expressName" width="120" label="快递名称"></el-table-column>
        <el-table-column prop="expressNo" width="150px" label="快递单号"></el-table-column>
        <go-quantity-column prop="applyQuantity" width="120" label="申请数量"></go-quantity-column>
        <go-money-column prop="applyAmount" width="120" label="申请金额"></go-money-column>
        <go-money-column prop="actualAmount" width="120" label="实际金额"></go-money-column>
        <go-enum-column prop="refundApplyOrderType" enum-name="RefundApplyOrderType" width="100px"
                        label="申请类型"></go-enum-column>
        <go-boolean-column prop="whole" label="整单退" width="80px"></go-boolean-column>
        <el-table-column prop="storeName" width="120" label="店铺名称"></el-table-column>
        <!--<el-table-column prop="payAccount" width="120" label="支付帐号"></el-table-column>-->
        <el-table-column prop="memberName" width="120" label="会员名称"></el-table-column>
        <el-table-column prop="mallRefundId" width="120" label="外部单号"></el-table-column>
        <el-table-column prop="inProductCode" width="120" label="退入商品编码"></el-table-column>
        <el-table-column prop="inProductName" width="120" label="退入商品名称"></el-table-column>
        <el-table-column prop="inSkuCode" width="120" label="退入规格编码"></el-table-column>
        <el-table-column prop="inSkuName" width="120" label="退入规格名称"></el-table-column>
        <go-date-time-column prop="appliedTime" label="申请时间"></go-date-time-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" v-if="!scope.row.memberId" @click="matchRefund(scope.row)" >匹配异常申请</el-button>
            <log-popover module-name="RETURN_APPLY"
                         :bizId="scope.row.refundApplyOrderId"></log-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
  import {RefundApplyApi} from '../api';
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/selector';
  import {LogPopover} from '@/component/log';
  // import AdvanceQuery from './advance.query.vue';

  export default {
    name: 'Apply',
    mixins: [List, PageList, TableResize],
    components: {LogPopover, StoreSelector},
    props: {},
    data() {
      return {
        api: RefundApplyApi,
        pk: 'afterSaleApplyId',
      };
    },
    methods: {
      matchRefund(row){
        RefundApplyApi.matchAbnormal(row.refundApplyOrderId,row).then(()=>{
          this.$message.success('匹配成功');
        });
      }
    },
    created() {
    }
  };
</script>