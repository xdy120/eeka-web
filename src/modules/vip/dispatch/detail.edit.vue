<template>
  <el-dialog title="明细" :visible.sync="visible" :fullscreen="true">
    <el-container>
      <el-header class="oms-search" style="height: 70px">
        <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="商品编码">
                <el-input v-model="filter.productCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规格编码">
                <el-input v-model="filter.skuCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <three-checkbox style="margin-left: 40px;margin-top: 5px" v-model="filter.abnormal">
                异常
              </three-checkbox>
              <three-checkbox style="margin-left: 40px;margin-top: 5px"
                              v-model="filter.vipPriceAbnormal">
                唯品价异常
              </three-checkbox>
            </el-col>
          </el-row>
        </el-form>
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
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <go-abnormal-column label="异常" prop="abnormal" width="100"></go-abnormal-column>
          <go-abnormal-column label="唯品价异常" prop="vipPriceAbnormal"
                              width="100"></go-abnormal-column>
          <el-table-column label="商品编码" prop="productCode" width="150" sortable></el-table-column>
          <el-table-column label="商品名称" prop="productName"></el-table-column>
          <el-table-column label="规格编码" prop="skuCode" width="150" sortable></el-table-column>
          <el-table-column label="规格名称" width="100">
            <template slot-scope="scope">
              {{scope.row.skuName}}
            </template>
          </el-table-column>
          <el-table-column label="唯品规格编码" prop="vipBarcode" width="150"></el-table-column>
          <el-table-column label="PO编号" width="150">
            <template slot-scope="scope">
              <el-input v-if="canEdit(scope.row)" v-model="scope.row.poCode"></el-input>
              <span v-else>{{scope.row.poCode}}</span>
            </template>
          </el-table-column>
          <go-money-column label="唯品价" prop="vipPrice"></go-money-column>
          <go-quantity-column label="通知数量" prop="noticeQuantity">
            <template slot-scope="scope">
              <el-input v-if="canEdit(scope.row)" v-model="scope.row.noticeQuantity"></el-input>
              <span v-else>{{scope.row.noticeQuantity}}</span>
            </template>
          </go-quantity-column>
          <go-quantity-column label="出库数量" prop="outQuantity"></go-quantity-column>
          <go-quantity-column label="差异数">
            <template slot-scope="scope">
              <span>{{scope.row.noticeQuantity-scope.row.outQuantity}}</span>
            </template>
          </go-quantity-column>
          <go-money-column label="唯品金额" prop="vipAmount"></go-money-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.vipDispatchDetailId"
                                @click="editRow(scope.row)"></go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.vipDispatchId"
                                 @click="modify(scope.row)"></go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.vipDispatchDetailId"
                                @click="uneditRow(scope.row)"></go-cancel-button>
              <go-delete-button v-if="editMode && scope.row.vipDispatchDetailId"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
              <go-delete-button v-else-if="editMode"
                                @click="detailList.splice(scope.$index,1)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                       @current-change="search" @size-change="pageSizeChange"/>
      </el-footer>
      <sku-importer ref="skuImport" :must-columns="mustColumns" v-on:finish="readData"
                    templateUrl="/file/template/vip_dispatch.xlsx/唯品拣货单导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {DetailEdit, DetailList, List, PageList} from '@/libs/mixins';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';
  import {Columns, MustColumns, VipDispatchDetailApi} from './api';
  import {Assert} from '@/libs/util';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit],
    components: {SkuSelector, SkuImporter, ProductSearchPart},
    data() {
      return {
        api: VipDispatchDetailApi,
        pk: 'vipDispatchDetailId',
        orderId: 'vipDispatchId',
        columns: Columns,
        relation: Columns,
        mustColumns: MustColumns,
      };
    },
    methods: {
      validateDetail() {
        let isSave = true;
        for (var i = 0; i < this.detailList.length; i++) {
          if (Assert.isBlank(this.detailList[i].poCode)) {
            isSave = false;
          }
        }
        if (!isSave) {
          this.$message.warning('PO编号不能为空');
        }
        return isSave;
      }
    }
  };
</script>
