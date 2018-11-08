<template>
  <el-dialog title="明细" :visible.sync="visible" :fullscreen="true">
    <el-container>
      <el-header class="oms-search" style="height: 70px">
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
        <el-table :data="detailList" height="400px" show-summary :summary-method="summary">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="商品编码" sortable>
            <template slot-scope="scope">{{scope.row.productCode}}</template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column label="规格编码" sortable>
            <template slot-scope="scope">{{scope.row.skuCode}}</template>
          </el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <go-quantity-column prop="quantity" label="数量" :summary="true">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.purchaseOrderDetailId">
                {{scope.row.quantity}}
              </template>
              <template v-else>
                <el-input-number size="small" v-model="scope.row.quantity"></el-input-number>
              </template>
            </template>
          </go-quantity-column>
          <go-money-column prop="purchasePrice" label="建议采购价" width="120">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.purchaseOrderDetailId">
                {{scope.row.purchasePrice}}
              </template>
              <template v-else>
                <el-input-number size="small" v-model="scope.row.actualPrice"></el-input-number>
              </template>
            </template>
          </go-money-column>
          <go-money-column prop="actualPrice" label="实际采购价" width="120">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.purchaseOrderDetailId">
                {{scope.row.actualPrice}}
              </template>
              <template v-else>
                <el-input-number size="small" v-model="scope.row.actualPrice"></el-input-number>
              </template>
            </template>
          </go-money-column>
          <go-quantity-column prop="noticeQuantity" label="通知数量"
                              v-if="!editMode" width="80"></go-quantity-column>
          <go-quantity-column prop="inQuantity" label="正品入库数量"
                              v-if="!editMode" width="120"></go-quantity-column>
          <go-quantity-column prop="inSubstandardQuantity" label="次品入库数量"
                              v-if="!editMode" width="120"></go-quantity-column>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.purchaseOrderDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.purchaseOrderId"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.purchaseOrderDetailId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="editMode"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                       @current-change="search" @size-change="pageSizeChange"/>
      </el-footer>
      <sku-importer ref="skuImport" :must-columns="mustColumns" @finish="readData"
                    templateUrl="/file/template/vip_return.xlsx/唯品退货单导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {PurchaseOrderDetailApi, SkuColumns} from './api';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {SkuSelector, ProductSearchPart, SkuImporter},
    data() {
      return {
        api: PurchaseOrderDetailApi,
        pk: 'purchaseOrderDetailId',
        orderId: 'purchaseOrderId',
        columns: SkuColumns,
        mustColumns: SkuColumns
      };
    },
    methods: {
      summary({columns, data}) {
        return this.generalSummary(['quantity'], columns, data);
      }
    }
  };
</script>