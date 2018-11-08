<template>
  <div>
    <el-table ref="detailTable" :height="tabsTableHeight" :data="list">
      <el-table-column prop="productCode" label="商品编码" width="150"/>
      <el-table-column prop="productName" label="商品名称" width="150"/>
      <el-table-column prop="skuCode" label="规格编码" width="150"/>
      <el-table-column prop="skuName" label="规格名称" width="100"/>
      <go-quantity-column prop="quantity" label="数量"/>
      <el-table-column prop="expressName" label="快递名称" width="150"/>
      <el-table-column prop="expressNo" label="快递单号" width="150"/>
      <go-date-time-column prop="deliveryTime" label="发货时间"/>
      <el-table-column prop="boxNo" label="箱码" width="150"/>
      <el-table-column prop="outerCode" label="仓库发货单号" width="150"/>
      <el-table-column/>
    </el-table>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {DispatchOrderDeliveryApi} from '@/modules/trade/dispatch';

  export default {
    mixins: [TableResize, List, Tabs],
    data() {
      return {
        tab: 'delivery',
        pk: 'dispatchOrderDeliveryId'
      };
    },
    methods: {
      search() {
        if (this.parentData != null) {
          this.doSearch(DispatchOrderDeliveryApi.listBySalesOrderId(this.parentData.salesOrderId),
            this.$refs.detailTable);
        }
      }
    }
  };
</script>