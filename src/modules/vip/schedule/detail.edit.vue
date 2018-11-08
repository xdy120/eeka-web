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
          <sku-selector @confirm="skuConfirm" :columns="columns"></sku-selector>
          <el-button @click="showSkuImport" style="position: relative;left: 5px;border-radius: 5px">
            导入
          </el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <el-table :data="detailList" height="400px" show-summary>
          <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
          <el-table-column prop="productCode" label="商品编码" sortable></el-table-column>
          <el-table-column prop="productName" label="商品名称" sortable></el-table-column>
          <el-table-column prop="skuCode" label="规格编码" sortable></el-table-column>
          <el-table-column prop="skuName" label="规格名称" sortable></el-table-column>
          <el-table-column prop="goodsValue" label="货值" sortable>
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row) && scope.row.vipScheduleDetailId">
                {{scope.row.goodsValue}}
              </div>
              <div v-else>
                <el-input-number size="small" v-model="scope.row.goodsValue"></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="planQuantity" label="计划数量" sortable>
            <template slot-scope="scope">
              <div v-if="!canEdit(scope.row) && scope.row.vipScheduleDetailId">
                {{scope.row.planQuantity}}
              </div>
              <div v-else>
                <el-input-number size="small" v-model="scope.row.planQuantity"></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="lockQuantity" label="锁定数量" v-if="!editMode"
                           sortable></el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.vipScheduleDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.vipScheduleId"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.vipScheduleDetailId"
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
      <sku-importer ref="skuImport" v-on:finish="readData"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';
  import {SkuColumns, VipScheduleDetailApi} from './api';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {SkuSelector, ProductSearchPart, SkuImporter},
    data() {
      return {
        api: VipScheduleDetailApi,
        pk: 'vipScheduleDetailId',
        orderId: 'vipScheduleId',
        columns: SkuColumns,
        relation: SkuColumns,
      };
    }
  };
</script>
