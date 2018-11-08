<template>
  <el-dialog :title="title" :visible.sync="visible" width="600" align="center">
    <el-table :data="list" :height="200" style="margin: 0">
      <el-table-column prop="status" label="订单状态" width="150px">
        <template slot-scope="scope">
          <enum-show :value="scope.row.status" enum-name="SalesOrderStatus"/>
        </template>
      </el-table-column>
      <el-table-column prop="salesOrderCode" label="单据编号"></el-table-column>
      <go-date-time-column prop="createdTime" label="创建时间" type="datetime"
                           width="150px"></go-date-time-column>
      <!--<el-table-column prop="skuCode" label="商品条码(SKU)" type="datetime"></el-table-column>-->
      <go-quantity-column prop="quantity" label="锁定库存数量(占用数)" width="150px"/>
    </el-table>
    <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                   @current-change="search" @size-change="pageSizeChange"></el-pagination>
  </el-dialog>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {SalesOrderApi} from '@/modules/trade/sales/api';

  export default {
    name: 'salesOrderStockOccupancyDetail',
    mixins: [List, PageList, TableResize],
    components: {
      SalesOrderApi
    },
    data() {
      return {
        api: SalesOrderApi,
        title: null,
        filter: {},
        list: [],
        visible: false,
        total: 0,
        domain: {}
      };
    },
    methods: {
      showOccupancyDetail(row) {
        this.paging = {page: 1, pageSize: 20};
        this.filter.skuCode = row.skuCode;
        this.filter.virtualWarehouseId = row.virtualWarehouseId;
        this.title = '库存锁定单据预览(锁定总数量' + row.salesOrderLockQuantity + ')';
        SalesOrderApi.stockOccupancyDetail(this.filter, this.paging).then(response => {
          if (response != null && response.data.length > 0) {
            this.total = response.total;
            this.list = response.data;
            this.visible = true;
          }
        });
      },
      search() {
        if (this.api) {
          this.advanceQueryVisible = false;
          SalesOrderApi.stockOccupancyDetail(this.filter, this.paging).then(response => {
            if (response != null && response.data.length > 0) {
              this.total = response.total;
              this.list = response.data;
              this.visible = true;
            }
          });
        }
      }
    },
  };
</script>