<template>
  <div>
    <el-table ref="detailTable" :height="tabsTableHeight" :data="list" show-summary :summary-method="summary">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="通知">
        <template slot-scope="scope">
          <span v-if="scope.row.noticed">已通知</span>
          <span v-else>未通知</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="商品编码" sortable></el-table-column>
      <el-table-column prop="productName" label="商品名称" sortable></el-table-column>
      <el-table-column prop="skuCode" label="规格编码"></el-table-column>
      <el-table-column prop="skuName" label="规格名称"></el-table-column>
      <go-quantity-column prop="quantity" label="退货数量" width="100"></go-quantity-column>
      <go-quantity-column prop="inQuantity" label="入库数量" width="100"></go-quantity-column>
      <go-money-column prop="refundableAmount" label="应退金额" width="100"></go-money-column>
      <el-table-column prop="returnReasonType" label="退货原因"></el-table-column>

    </el-table>
  </div>
</template>
<script>
  import {DetailEdit, List, TableResize, Tabs} from '@/libs/mixins';
  import {ReturnOrderDetailApi} from './api.js';
  import {SalesOrderSelector} from '@/modules/selector';

  export default {
    name: 'ReturnOrderDetail',
    mixins: [List, TableResize, Tabs, DetailEdit],
    components: {
      SalesOrderSelector
    },
    data() {
      return {
        tab: 'detail',
        pk: 'returnOrderDetailId',
        orderId: 'returnOrderId',
        api: ReturnOrderDetailApi,
        currentRow: {}
      };
    },
    methods: {
      search() {
        if (this.parentData) {
          let filter = {returnOrderId: this.parentData.returnOrderId};
          this.doSearch(ReturnOrderDetailApi.listInDetail(this.parentData.returnOrderId, filter),
            this.$refs.detailTable);
        }
      },
      summary({columns, data}) {
        return this.generalSummary(['quantity','inQuantity','refundableAmount'], columns, data);
      }
    }
  };
</script>