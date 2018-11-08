<template>
  <el-dialog title="明细" :visible.sync="visible" :fullscreen="true">
    <el-container>
      <el-header class="oms-search">
        <product-search-part v-model="filter"></product-search-part>
      </el-header>
      <el-header class="oms-action">
        <el-button-group>
          <go-search-button @click="clickSearch">搜索</go-search-button>
          <go-clean-button @click="reset">清空</go-clean-button>
        </el-button-group>
      </el-header>
      <el-main>
        <el-table :data="detailList" height="400px" show-summary>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="商品编码" sortable>
            <template slot-scope="scope">{{scope.row.productCode}}</template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column label="规格编码" sortable>
            <template slot-scope="scope">{{scope.row.skuCode}}</template>
          </el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <go-quantity-column prop="noticeQuantity" label="通知数量" width="80"></go-quantity-column>
          <go-quantity-column prop="inQuantity" label="正品入库数量" width="120"></go-quantity-column>
          <go-quantity-column prop="inSubstandardQuantity" label="次品入库数量"
                              width="120"></go-quantity-column>
        </el-table>
      </el-main>
      <el-footer :height="32" style="padding: 0">
        <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
    </el-container>
  </el-dialog>
</template>
<script>
  import {PurchaseNoticeOrderDetailApi} from '../api';
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {ProductSearchPart} from '@/modules/product/index';

  export default {
    name: 'DetailEditor',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {ProductSearchPart},
    data() {
      return {
        api: PurchaseNoticeOrderDetailApi,
        pk: 'purchaseNoticeOrderDetailId',
        orderId: 'purchaseNoticeOrderId',
      };
    }
  };
</script>