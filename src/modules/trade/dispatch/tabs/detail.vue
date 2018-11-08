<template>
  <el-table ref="dataTable" :height="tabsTableHeight" :data="list">
    <go-enum-column prop="status" label="状态" enum-name="DispatchOrderDetailStatus" width="80"/>
    <el-table-column prop="salesOrderCode" label="订单编号" width="150"></el-table-column>
    <el-table-column prop="tradeId" label="交易号" width="150"></el-table-column>
    <el-table-column prop="productCode" label="商品编码" width="150"></el-table-column>
    <el-table-column prop="productName" label="商品名称"></el-table-column>
    <el-table-column prop="skuCode" label="规格编码" width="150"></el-table-column>
    <el-table-column prop="skuName" label="规格名称" width="100"></el-table-column>
    <go-quantity-column prop="noticeQuantity" label="通知数量" width="80"/>
    <go-quantity-column prop="outQuantity" label="出库数量" width="80"/>
    <!--<el-table-column></el-table-column>-->
    <!--<el-table-column label="操作" fixed="right" width="150">-->
    <!--<template slot-scope="scope">-->
    <!--<go-cancel-button v-permission="101010204" v-if="scope.row.status==='WAITING'" @click="cancelDetail(scope.row)"></go-cancel-button>-->
    <!--</template>-->
    <!--</el-table-column>-->
  </el-table>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {DispatchOrderDetailApi} from '../api';

  export default {
    mixins: [TableResize, List, Tabs],
    data() {
      return {
        tab: 'detail',
        api: DispatchOrderDetailApi,
        pk: 'dispatchOrderDetailId'
      };
    },
    methods: {
      buildDispatchOrderDetailBO(detail) {
        return {
          version: this.parentData.version,
          dispatchOrderId: detail.dispatchOrderId,
          dispatchOrderDetailId: detail.dispatchOrderDetailId,
        };
      },
      search() {
        if (this.parentData != null) {
          this.doSearch(DispatchOrderDetailApi.list(this.parentData.dispatchOrderId));
        }
      },
      cancelDetail(detail) {
        DispatchOrderDetailApi.cancelDetail(this.buildDispatchOrderDetailBO(detail)).then(
          this.search);
      }
    }
  };
</script>