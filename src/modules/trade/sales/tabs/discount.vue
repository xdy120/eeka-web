<template>
  <el-table ref="discountTable" :data="list" :height="tabsTableHeight">
    <el-table-column prop="discountName" label="优惠名称" :width="200"/>
    <go-enum-column prop="discountType" label="类型" enum-name="DiscountType" :width="100"/>
    <go-money-column prop="discountAmount" label="优惠金额" :width="100"/>
    <el-table-column prop="memberCardNo" label="会员卡" :width="100"/>
    <go-date-time-column prop="mallPaidTime" label="平台支付时间"/>
    <el-table-column/>
  </el-table>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {SalesOrderDiscountApi} from '../api';

  export default {
    name: 'SalesOrderDiscount',
    mixins: [TableResize, List, Tabs],
    data() {
      return {
        tab: 'discount',
        pk: 'salesOrderDiscountId'
      };
    },
    methods: {
      search() {
        if (this.parentData !== null) {
          this.doSearch(SalesOrderDiscountApi.list(this.parentData.salesOrderId),
              this.$refs.discountTable);
        }
      }
    }
  };
</script>