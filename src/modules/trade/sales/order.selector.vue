<template>
  <div v-if="dialog">
    <el-button type="text" :disabled="isDisabled" @click="showList">{{content}}</el-button>
    <el-dialog title="请选择B2C订单" :visible.sync="visible" :close-on-click-modal="false" width="80%"
               append-to-body>
      <el-container>
        <el-header class="dialog-search" height="90px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="编码" lable-width="100">
                  <el-input v-model="filter.smartKeys" placeholder="订单号/交易号/手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="会员名称" lable-width="60">
                  <el-input v-model="filter['sub.memberName']"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header :height="35">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple" fixed></go-selection-column>
            <el-table-column prop="tradeId" label="交易号" fixed></el-table-column>
            <el-table-column prop="salesOrderCode" label="订单编号" fixed></el-table-column>
            <el-table-column prop="storeName" label="店铺" width="200px"></el-table-column>
            <go-enum-column prop="refundStatus" enum-name="RefundStatus" label="退款状态" width="200px"/>
            <go-enum-column prop="sub.salesOrderType" label="类型" enum-name="SalesOrderType"
                            width="200px"></go-enum-column>
            <go-date-time-column prop="sub.mallPaidTime" label="支付时间" width="200px"></go-date-time-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>

      </el-container>
    </el-dialog>
  </div>
  <div v-else>
    <el-popover ref="grid" placement="bottom" width="700" v-model="visible">
      <el-container>
        <el-header class="dialog-search" height="90px">
          <el-form :model="filter" @keyup.enter.native="clickSearch">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="编码" lable-width="100">
                  <el-input v-model="filter.smartKeys" placeholder="支持多个查询，英文逗号隔开"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="会员名称" lable-width="60">
                  <el-input v-model="filter['sub.memberName']" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" lable-width="60">
                  <el-input v-model="filter.mobile" placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-header :height="35">
          <el-button-group>
            <go-search-button @click="clickSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button @click="confirm">确认</el-button>
        </el-header>
        <el-main>
          <el-table :data="list" :height="300" style="margin-top: 5px"
                    @selection-change="selectionChange" @current-change="currentRowChange"
                    @row-dblclick="confirm">
            <go-selection-column v-if="multiple"></go-selection-column>
            <el-table-column prop="storeName" label="店铺" width="100"></el-table-column>
            <el-table-column prop="salesOrderCode" label="订单编号" width="100" fixed></el-table-column>
            <el-table-column prop="tradeId" label="交易号" width="100" fixed></el-table-column>
            <go-enum-column prop="status" label="状态" enum-name="SalesOrderStatus" width="100"
                            fixed></go-enum-column>
            <go-enum-column prop="dispatchStatus" label="配货状态" enum-name="DispatchStatus"
                            width="80"></go-enum-column>
            <go-enum-column prop="deliveryStatus" label="发货状态" enum-name="DeliveryStatus"
                            width="80"></go-enum-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </el-popover>
    <el-input placeholder="请选择B2C订单" v-model="text" :disabled="disabled" readonly>
      <el-button slot="prepend" icon="el-icon-close" @click="clean" :disabled="disabled"
                 v-if="text"></el-button>
      <el-button slot="append" icon="el-icon-arrow-down" v-popover:grid
                 :disabled="disabled"></el-button>
    </el-input>
  </div>
</template>
<script>
  import {SalesOrderApi} from './api';
  import {List, PageList, Selector} from '@/libs/mixins';
  import {Assert} from '@/libs/util';

  export default {
    name: 'SalesOrderSelector',
    mixins: [List, PageList, Selector],
    props: {
      SalesOrderCode: String,
      content: String,
      dialog: {
        type: Boolean,
        default: false
      },
      isDisabled:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pk: 'salesOrderId',
        api: SalesOrderApi,
        text: this.SalesOrderCode,
      };
    },
    watch: {
      SalesOrderCode(val) {
        this.text = val;
      },
      value(val) {
        if (Assert.isEmpty(val)) {
          this.text = null;
          this.selectedItem = null;
          this.selectedItems = [];
        }
      },
    },
    methods: {},
    created() {
      for (let key in this.outFilter) {
        this.filter[key] = this.outFilter[key];
      }
      this.oldFilter = this.filter;
    }
  };
</script>