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
          <go-money--column prop="purchasePrice" label="采购价" width="80"></go-money--column>
          <go-money--column prop="purchaseReturnPrice" label="采购退货价" width="120">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row) && scope.row.purchaseReturnOrderDetailId">
                {{scope.row.purchaseReturnPrice}}
              </div>
              <div v-else>
                <el-input-number size="small"
                                 v-model="scope.row.purchaseReturnPrice"></el-input-number>
              </div>
            </template>
          </go-money--column>
          <go-quantity-column prop="planQuantity" label="计划退货数量" width="120">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row) && scope.row.purchaseReturnOrderId">
                {{scope.row.planQuantity}}
              </div>
              <div v-else>
                <el-input-number size="small" v-model="scope.row.planQuantity"></el-input-number>
              </div>
            </template>
          </go-quantity-column>
          <go-quantity-column prop="noticeQuantity" label="通知退货数量" width="120"></go-quantity-column>
          <go-quantity-column prop="outQuantity" label="实际退货数量" width="120"></go-quantity-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.purchaseReturnOrderDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.purchaseReturnOrderId"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.purchaseReturnOrderDetailId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="editMode"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
            </template>
          </el-table-column>
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
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {PurchaseReturnOrderDetailApi} from '../api';
  import {ProductSearchPart, SkuSelector} from '@/modules/product/index';

  export default {
    name: 'DetailEditor',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {SkuSelector, ProductSearchPart},
    data() {
      return {
        api: PurchaseReturnOrderDetailApi,
        pk: 'purchaseReturnOrderDetailId',
        orderId: 'purchaseReturnOrderId',
      };
    }
  };
</script>