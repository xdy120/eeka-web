<template>
  <el-dialog :title="title" :visible.sync="visible" width="600" align="center">
    <el-table :data="list" :height="200" style="margin: 0">
      <el-table-column prop="status" label="退换货单状态" width="120px">
        <template slot-scope="scope" v-if="scope.row.returnOrderStatus">
          <enum-show :value="scope.row.returnOrderStatus" enum-name="ReturnOrderStatus"/>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="换货申请单状态" width="120px">
        <template slot-scope="scope" v-if="scope.row.mallExchangeStatus">
          <enum-show :value="scope.row.mallExchangeStatus" enum-name="MallExchangeStatus"/>
        </template>
      </el-table-column>

      <el-table-column prop="code" label="单据编号"></el-table-column>
      <go-date-time-column prop="createdTime" label="创建时间" type="datetime"
                           width="150px"></go-date-time-column>
      <go-quantity-column prop="quantity" label="锁定库存数量(占用数)" width="130px"/>
      <el-table-column label="操作" width="70px">
        <template slot-scope="scope">
          <el-button v-if="scope.row.mallExchangeStatus" type="text" @click="deleteOccupancy(scope.row)">释放</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                   @current-change="search" @size-change="pageSizeChange"></el-pagination>
  </el-dialog>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {ReturnOrderApi} from '@/modules/trade/return/api';
  import {ExchangeApi} from '@/modules/trade/exchange/api';

  export default {
    name: 'returnOrderStockOccupancyDetail',
    mixins: [List, PageList, TableResize],
    components: {
      ReturnOrderApi,
      ExchangeApi
    },
    data() {
      return {
        api: ReturnOrderApi,
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
        this.title = '库存锁定单据预览(锁定总数量' + row.returnOrderLockQuantity + ')';
        ReturnOrderApi.stockOccupancyDetail(this.filter, this.paging).then(response => {
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
          ReturnOrderApi.stockOccupancyDetail(this.filter, this.paging).then(response => {
            if (response != null && response.data.length > 0) {
              this.total = response.total;
              this.list = response.data;
              this.visible = true;
            }
          });
        }
      },
      deleteOccupancy(row){
        this.$confirm('确认删除该库存占用?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          ExchangeApi.deleteExchangeOccupancy(row.orderId).then(()=>{
            this.$message.success('删除占用成功');
            this.visible = false;
            this.$emit('change');
          });
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  };
</script>