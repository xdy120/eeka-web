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
        <el-button-group v-if="editMode">
          <sku-selector v-on:confirm="skuConfirm" :columns="columns"></sku-selector>
          <el-button @click="showSkuImport">导入</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <el-table :data="detailList" height="400px" show-summary>
          <go-selection-column></go-selection-column>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="商品编码" sortable>
            <template slot-scope="scope">{{scope.row.productCode}}</template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column label="规格编码" sortable>
            <template slot-scope="scope">{{scope.row.skuCode}}</template>
          </el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <go-quantity-column label="计划数量" width="120px" prop="planQuantity">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row) && scope.row.stockOutOrderDetailId">
                {{scope.row.planQuantity}}
              </div>
              <div v-else>
                <el-input size="small" v-model="scope.row.planQuantity"></el-input>
              </div>
            </template>
          </go-quantity-column>
          <go-money-column label="价格" width="120px" prop="price">
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row) && scope.row.stockOutOrderDetailId">
                {{scope.row.price}}
              </div>
              <div v-else>
                <el-input size="small" v-model="scope.row.price"></el-input>
              </div>
            </template>
          </go-money-column>
          <go-quantity-column prop="noticeQuantity" label="通知数量" width="120px"
                              v-if="!editMode"></go-quantity-column>
          <go-quantity-column prop="outQuantity" label="出库数量" width="120px"
                              v-if="!editMode"></go-quantity-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.stockOutOrderDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.stockOutOrderDetailId"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.stockOutOrderDetailId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="editMode"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
              <out-batch-popover v-if="entity.inStatus==='PART_OUT' || entity.inStatus==='ALL_OUT'"
                                 v-model="scope.row" orderId="stockOutOrderId"
                                 detailId="stockOutOrderDetailId"></out-batch-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
      <sku-importer ref="skuImport" :must-columns="mustColumns" @finish="readData"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {MustColumns, SkuColumns, StockOutDetailApi} from './api';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';
  import OutBatchPopover from '@/component/batch/out.batch.vue';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {SkuSelector, ProductSearchPart, OutBatchPopover, SkuImporter},
    data() {
      return {
        api: StockOutDetailApi,
        pk: 'stockOutOrderDetailId',
        orderId: 'stockOutOrderId',
        columns: SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns
      };
    },
    methods: {},
  };
</script>