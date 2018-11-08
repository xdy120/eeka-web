<template>
  <el-container>
    <el-main>
      <el-table ref="dataTable" :data="list" :height="tabsTableHeight"
                @current-change="currentRowChange">
        <el-table-column label="标记" :width="80" fixed>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cod">到</el-tag>
            <el-tag v-if="scope.row.hasExchange">换</el-tag>
            <el-tag v-if="scope.row.combination">合</el-tag>
            <el-tag v-if="scope.row.offlineDelivery">线下</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dispatchOrderCode" label="配货单号" :width="120" fixed/>
        <go-enum-column prop="status" label="状态" enum-name="DispatchOrderStatus" width="50" fixed/>
        <go-enum-column prop="outStatus" label="出库状态" enum-name="OutStatus" fixed/>
        <el-table-column prop="warehouseName" label="发货仓库" width="100"/>
        <el-table-column prop="suggestExpressName" label="建议快递名称" width="100"/>
        <el-table-column prop="suggestExpressNo" label="建议快递单号"/>
        <go-date-time-column prop="lastDeliveryTime" label="最后发货时间"/>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <go-cancel-button v-if="scope.row.status!=='DELIVERED' && scope.row.status!=='CANCELED'"
                              tooltip="取消" @click="cancel(scope.row)"/>
            <wms-log :dispatchOrderId="scope.row.dispatchOrderId"></wms-log>
          </template>
        </el-table-column>
      </el-table>
      <cancel ref="cancel"/>
    </el-main>
    <el-aside width="500px" style="padding-left: 5px">
      <el-table :data="details" :height="tabsTableHeight">
        <el-table-column prop="salesOrderCode" label="订单编号" width="150"></el-table-column>
        <el-table-column prop="tradeId" label="交易号" width="150"></el-table-column>
        <el-table-column prop="productCode" label="商品编码" width="150"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="skuCode" label="规格编码" width="150"></el-table-column>
        <el-table-column prop="skuName" label="规格名称" width="100"></el-table-column>
        <go-quantity-column prop="outQuantity" label="出库数量" width="80"/>
        <!--<el-table-column label="操作" fixed="right" :width="60">-->
        <!--<template slot-scope="scope">-->
        <!--<go-cancel-button tooltip="取消" @click="cancelDetail(scope.row)"></go-cancel-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </el-aside>
  </el-container>
</template>
<script>


  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {DispatchOrderApi, DispatchOrderDetailApi} from '@/modules/trade/dispatch';
  import {Cancel, wmsLog} from '@/modules/trade/dispatch/action';

  export default {
    name: 'SalesOrderDispatch',
    mixins: [TableResize, List, Tabs],
    components: {Cancel, wmsLog},
    data() {
      return {
        tab: 'dispatch',
        details: [],
      };
    },
    watch: {
      selectedItem(val) {
        if (val) {
          DispatchOrderDetailApi.list(val.dispatchOrderId).then(data => this.details = data);
        } else {
          this.details = [];
        }
      }
    },
    methods: {
      search() {
        if (this.parentData !== null) {
          DispatchOrderApi.listBySalesOrderId(this.parentData.salesOrderId).then(
            data => this.list = data);
        } else {
          this.list = [];
        }
      },
      cancel(dispatchOrder) {
        this.$refs.cancel.show(dispatchOrder);
      },
      cancelDetail(dispatchOrderDetail) {
        this.$refs.cancel.show(this.selectedItem, dispatchOrderDetail);
      },
    }
  };
</script>