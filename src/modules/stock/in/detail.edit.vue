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
          <go-quantity-column prop="planQuanity" label="计划数量" width="120px">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.stockInOrderDetailId">
                {{scope.row.noticeQuantity}}
              </template>
              <template v-else>
                <el-input size="small" v-model="scope.row.noticeQuantity"></el-input>
              </template>
            </template>
          </go-quantity-column>
          <go-money-column prop="price" label="价格" width="120px">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.stockInOrderDetailId">
                {{scope.row.price}}
              </template>
              <template v-else>
                <el-input size="small" v-model="scope.row.price"></el-input>
              </template>
            </template>
          </go-money-column>
          <go-quantity-column prop="noticeQuantity" label="通知数量" width="120px"
                              v-if="!editMode"></go-quantity-column>
          <go-quantity-column prop="inQuantity" label="入库数量" width="120px"
                              v-if="!editMode"></go-quantity-column>
          <go-quantity-column label="次品入库数量" prop="inSubstandardQuantity"
                              v-if="!editMode"></go-quantity-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.stockInOrderDetailId"
                                @click="editRow(scope.row)">修改
              </go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.stockInOrderId"
                                 @click="modify(scope.row)">确认
              </go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.stockInOrderDetailId"
                                @click="uneditRow(scope.row)">取消
              </go-cancel-button>
              <go-delete-button v-if="editMode"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
              <in-batch-popover v-if="entity.inStatus==='PART_IN' || entity.inStatus==='ALL_IN'"
                                v-model="scope.row" orderId="stockInOrderId"
                                detailId="stockInOrderDetailId"></in-batch-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
      <sku-importer ref="skuImport" :must-columns="mustColumns"
                    v-on:finish="readData"
                    templateUrl="/file/template/stock_in.xlsx/入库单导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {MustColumns, SkuColumns, StockInDetailApi} from './api';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';
  import InBatchPopover from '@/component/batch/in.batch.vue';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {SkuSelector, ProductSearchPart, InBatchPopover, SkuImporter},
    data() {
      return {
        api: StockInDetailApi,
        pk: 'stockInOrderDetailId',
        orderId: 'stockInOrderId',
        columns: SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns
      };
    }
  };
</script>