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
          <el-table-column type="index" width="50" label="序号" fixed></el-table-column>
          <el-table-column label="商品编码" sortable>
            <template slot-scope="scope">{{scope.row.productCode}}</template>
          </el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column label="规格编码" sortable>
            <template slot-scope="scope">{{scope.row.skuCode}}</template>
          </el-table-column>
          <el-table-column prop="skuName" label="规格名称" fixed></el-table-column>
          <go-quantity-column prop="planQuantity" label="计划数量" width="80">
            <template slot-scope="scope">
              <template v-if="!canEdit(scope.row)&&scope.row.stockLoanOutDetailId">
                {{scope.row.planQuantity}}
              </template>
              <template v-else>
                <el-input size="small" v-model="scope.row.planQuantity"></el-input>
              </template>
            </template>
          </go-quantity-column>
          <el-table-column prop="noticeQuantity" label="通知数量" width="80"></el-table-column>
          <el-table-column prop="outQuantity" label="出库数量" width="80"></el-table-column>
          <el-table-column prop="returnQuantity" label="归还数量" width="80"></el-table-column>
          <el-table-column prop="surplusQuantity" label="剩余数量" width="80"></el-table-column>
          <el-table-column prop="verificationUser" label="核销人" width="120px"></el-table-column>
          <el-table-column prop="verificationReason" label="核销原因" width="120px"></el-table-column>
          <go-date-time-column label="出库时间" prop="outTime"></go-date-time-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <go-modify-button v-if="editMode && scope.row.stockLoanOutDetailId"
                                @click="editRow(scope.row)">
              </go-modify-button>
              <go-confirm-button v-if="canEdit(scope.row)  && scope.row.stockLoanOutId"
                                 @click="modify(scope.row)">
              </go-confirm-button>
              <go-cancel-button v-if="canEdit(scope.row) && scope.row.stockLoanOutDetailId"
                                @click="uneditRow(scope.row)">
              </go-cancel-button>
              <go-delete-button v-if="editMode"
                                @click="remove(scope.$index,scope.row)"></go-delete-button>
              <go-tooltip-button
                  v-if="scope.row.status!=='CANCEL'&&entity.needReturn&&scope.row.surplusQuantity>0"
                  @click="verification(scope.row)"
                  tooltip="核销">
              </go-tooltip-button>
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
                    templateUrl="/file/template/stock_loan_out.xlsx/借出单导入模板"></sku-importer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="inserted" @click="add()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {DetailEdit, DetailList, List, PageList, TableResize} from '@/libs/mixins/index';
  import {
    LoanOutMustColumns,
    LoanOutSkuColumns,
    StockLoanOutApi,
    StockLoanOutDetailApi
  } from './api';
  import {ProductSearchPart, SkuImporter, SkuSelector} from '@/modules/product/index';
  import InBatchPopover from '@/component/batch/in.batch.vue';
  import TooltipButton from '@/component/ui/tooltip.icon';

  export default {
    name: 'DetailEdit',
    mixins: [List, PageList, DetailList, DetailEdit, TableResize],
    components: {
      TooltipButton, SkuSelector, ProductSearchPart, InBatchPopover, SkuImporter
    },
    data() {
      return {
        api: StockLoanOutDetailApi,
        pk: 'stockLoanOutDetailId',
        orderId: 'stockLoanOutId',
        columns: LoanOutSkuColumns,
        relation: LoanOutSkuColumns,
        mustColumns: LoanOutMustColumns
      };
    },
    methods: {
      verification(row) {
        this.$prompt('请输入核销原因', '提示', {
          inputPattern: /\S+/,
          inputErrorMessage: '核销原因不能为空'
        }).then(({value}) => {
          StockLoanOutApi.verification(this.entity.stockLoanOutId, {
            version: this.entity.version,
            stockLoanOutDetailId: row.stockLoanOutDetailId,
            verificationReason: value,
          }).then(this.search);
        });
      },
    }
  };
</script>