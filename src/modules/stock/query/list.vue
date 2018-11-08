<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form ref="queryForm" :model="filter" @keyup.enter.native="customSearch" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="虚拟仓" prop="virtualWarehouseIds">
              <virtual-warehouse-selector multiple
                                          v-model="filter.virtualWarehouseIds"></virtual-warehouse-selector>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品编码" prop="productCodes">
              <el-input v-model="filter.productCodes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规格编码" prop="skuCodes">
              <el-input v-model="filter.skuCodes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="filter.productName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action">
      <el-row>
        <el-col :span="20">
          <el-button-group>
            <go-search-button @click="customSearch">搜索</go-search-button>
            <go-clean-button @click="reset">清空</go-clean-button>
          </el-button-group>
          <el-button-group>
            <el-button @click="exportStock">导出</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="4" align="right">
          <three-checkbox v-model="filter.hasStock">有库存</three-checkbox>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="实体仓名称" prop="warehouseName" width="120px"></el-table-column>
        <el-table-column label="虚拟仓名称" prop="virtualWarehouseName" width="120px"></el-table-column>
        <el-table-column label="商品编码" prop="productCode" width="120px" sortable></el-table-column>
        <el-table-column label="商品名称" prop="productName" width="120px"></el-table-column>
        <el-table-column label="规格编码" prop="skuCode" width="120px" sortable></el-table-column>
        <el-table-column label="规格名称" prop="skuName" width="120px"></el-table-column>
        <go-quantity-column label="库存数" prop="quantity" width="80px"></go-quantity-column>
        <go-link-column label="订单占用" prop="salesOrderLockQuantity" width="80px"
                        @click="showSalesOrderOccupancy"></go-link-column>
        <go-quantity-column label="配货占用" prop="dispatchOrderLockQuantity"
                            width="80px"></go-quantity-column>
        <go-link-column label="换货占用" prop="returnOrderLockQuantity" width="80px"
                        @click="showReturnOrderOccupancy"></go-link-column>
        <go-quantity-column label="唯品占用" prop="vipLockQuantity" width="80px"></go-quantity-column>
        <go-quantity-column label="其他占用" prop="otherLockQuantity" width="80px"></go-quantity-column>
        <go-quantity-column label="可销数" prop="saleable" width="80px"></go-quantity-column>
        <go-quantity-column label="可用数" prop="available" width="80px"></go-quantity-column>
        <go-quantity-column label="在途数" prop="transitQuantity" width="80px"/>
        <el-table-column/>
      </el-table>
    </el-main>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <occupancy-popover ref="occupancy"></occupancy-popover>
    <sales-order-stock-occupancy-detail ref="salesOrderOccupancyDetail"></sales-order-stock-occupancy-detail>
    <return-order-stock-occupancy-detail @change="customSearch" ref="returnOrderOccupancyDetail"></return-order-stock-occupancy-detail>
  </el-container>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {Assert} from '@/libs/util';
  import {SkuSelector, VirtualWarehouseSelector, WarehouseSelector} from '@/modules/selector';
  import OccupancyPopover from './occupancy.vue';
  import {StockApi} from './api';
  import SalesOrderStockOccupancyDetail from './sales.order.stock.occupancy.detail.vue';
  import ReturnOrderStockOccupancyDetail from './return.order.stock.occupancy.detail.vue';

  export default {
    name: 'StockQuery',
    mixins: [TableResize, List, PageList],
    components: {
      SalesOrderStockOccupancyDetail,
      ReturnOrderStockOccupancyDetail,
      OccupancyPopover,
      WarehouseSelector, VirtualWarehouseSelector, SkuSelector
    },
    data() {
      const queryValidator = {
        trigger: 'manual',
        validator: (rule, value, callback) => {
          if (Assert.isBlank(this.filter.virtualWarehouseIds)
            && Assert.isBlank(this.filter.productCodes)
            && Assert.isBlank(this.filter.skuCodes)
            && Assert.isBlank(this.filter.productName)) {
            callback(new Error('至少输入一个条件'));
          } else {
            callback();
          }
        }
      };
      return {
        api: StockApi,
        rules: {
          virtualWarehouseIds: queryValidator,
          productCodes: queryValidator,
          skuCodes: queryValidator,
          productName: queryValidator
        }
      };
    },
    methods: {
      customSearch() {
        this.$refs.queryForm.validate().then(() => {
          this.paging.page = 1;
          this.search();
        });
      },
      showSalesOrderOccupancy(row) {
        if (row.salesOrderLockQuantity > 0) {
          this.$refs.salesOrderOccupancyDetail.showOccupancyDetail(row);
        }
      },
      showReturnOrderOccupancy(row){
        if (row.returnOrderLockQuantity > 0) {
          this.$refs.returnOrderOccupancyDetail.showOccupancyDetail(row);
        }
      },
      exportStock() {
        this.$refs.queryForm.validate().then(() => {
          this.exportData(value => this.api.exportStock(value, this.filter));
        });
      }
    }
  };
</script>