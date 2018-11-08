<template>
  <el-table ref="dataTable" :height="tabsTableHeight" :data="list">
    <el-table-column prop="productCode" label="商品编码" width="150"></el-table-column>
    <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
    <el-table-column prop="skuCode" label="规格编码" width="150"></el-table-column>
    <el-table-column prop="skuName" label="规格名称" width="100"></el-table-column>
    <go-quantity-column prop="quantity" label="数量"></go-quantity-column>
    <el-table-column prop="expressName" label="快递名称" width="100"></el-table-column>
    <el-table-column prop="expressNo" label="快递编码" width="150"></el-table-column>
    <go-date-time-column prop="deliveryTime" label="发货时间"></go-date-time-column>
    <el-table-column prop="boxNo" label="箱码"></el-table-column>
    <el-table-column prop="outerCode" label="仓库单号"></el-table-column>
  </el-table>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {DispatchOrderDeliveryApi} from '../api';

  export default {
    mixins: [TableResize, List, Tabs],
    data() {
      return {
        tab: 'delivery',
        api: DispatchOrderDeliveryApi,
        pk: 'dispatchOrderDeliveryId'
      };
    },
    methods: {
      search() {
        if (this.parentData != null) {
          this.doSearch(DispatchOrderDeliveryApi.list(this.parentData.dispatchOrderId));
        }
      }
    }
  };
</script>