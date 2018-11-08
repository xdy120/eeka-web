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
        <sku-selector v-on:confirm="skuConfirm" :columns="columns" v-if="editMode"></sku-selector>
        <el-button @click="showSkuImport" v-if="editMode">导入</el-button>
      </el-header>
      <el-main>
        <el-table :data="detailList" height="400px" show-summary>
          <go-selection-column></go-selection-column>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <go-quantity-column prop="planQuantity" label="计划数量" width="120px">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.stockVirtualAllotDetailId">
                {{scope.row.planQuantity}}
              </template>
              <template v-else>
                <el-input-number size="small" v-model="scope.row.planQuantity"></el-input-number>
              </template>
            </template>
          </go-quantity-column>
          <go-quantity-column prop="quantity" label="实调数量" width="120px"></go-quantity-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.stockVirtualAllotDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row) &&  scope.row.stockVirtualAllotId"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.stockVirtualAllotDetailId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="editMode"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
      <sku-importer ref="skuImport" v-on:finish="readData"
                    templateUrl="/file/template/stock_allot.xlsx/虚拟调拨导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {AllotDetailApi, SkuColumns} from './api';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {SkuSelector, ProductSearchPart, SkuImporter},
    data() {
      return {
        api: AllotDetailApi,
        pk: 'stockVirtualAllotDetailId',
        orderId: 'stockVirtualAllotId',
        columns: SkuColumns,
        relation: SkuColumns,
      };
    },
  };
</script>