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
          <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
          <el-table-column prop="productCode" label="商品编码" sortable></el-table-column>
          <el-table-column prop="productName" label="商品名称" sortable></el-table-column>
          <el-table-column prop="skuCode" label="规格编码" sortable></el-table-column>
          <el-table-column prop="skuName" label="规格名称" sortable></el-table-column>
          <el-table-column prop="quantity" label="数量" sortable>
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row) && scope.row.presellDetailId">
                {{scope.row.quantity}}
              </template>
              <template v-else>
                <el-input size="small" v-model="scope.row.quantity"></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.presellDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.presellId" type="text"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.presellDetailId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="canDelete"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer :height="32" style="padding: 0">
        <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                       @current-change="search" @size-change="pageSizeChange"></el-pagination>
      </el-footer>
      <sku-importer ref="skuImport" :must-columns="mustColumns" v-on:finish="readData"
                    templateUrl="/file/template/presell.xlsx/预售计划导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {MustColumns, PresellDetailApi, SkuColumns} from './api';
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {SkuSelector, ProductSearchPart, SkuImporter},
    data() {
      return {
        api: PresellDetailApi,
        pk: 'presellDetailId',
        orderId: 'presellId',
        columns: SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns
      };
    },
    computed: {
      canDelete() {
        return this.entity.status === 'CREATED';
      },
      editMode() {
        return this.entity.status === 'CREATED' || this.entity.status === 'AUDITED' || this.entity.status === 'BEGIN';
      }
    }
  };
</script>