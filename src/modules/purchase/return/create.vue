<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="退货明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <purchase-return-basic ref="editForm" v-model="domain"></purchase-return-basic>
    </div>
    <div v-show="stepTitle==='退货明细'">
      <el-container>
        <el-header class="oms-action" height="35px">
          <sku-selector @confirm="selectSkus" :columns="columns"></sku-selector>
          <el-button @click="showSkuImport">导入</el-button>
        </el-header>
        <el-main>
          <el-row>
            <el-table :data="domain.details" height="400" show-summary>
              <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
              <el-table-column prop="productName" label="商品名称"></el-table-column>
              <el-table-column prop="productCode" label="商品编码"></el-table-column>
              <el-table-column prop="skuName" label="规格名称"></el-table-column>
              <el-table-column prop="skuCode" label="规格编码"></el-table-column>
              <el-table-column prop="purchasePrice" label="采购价"></el-table-column>
              <el-table-column prop="purchaseReturnPrice" label="采购退货价">
                <template slot-scope="scope">
                  <el-input-number size="small"
                                   v-model="scope.row.purchaseReturnPrice"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="planQuantity" label="计划退货数量">
                <template slot-scope="scope">
                  <el-input-number size="small" v-model="scope.row.planQuantity"
                                   :min="1"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-tooltip content="删除" placement="bottom">
                    <go-delete-button @click="removeDetail(scope.$index)"></go-delete-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-main>
        <el-footer :height="32" style="padding: 0">
          <el-pagination :total="total" :page-size="paging.pageSize"
                         :current-page.sync="paging.page" @current-change="search"
                         @size-change="pageSizeChange"></el-pagination>
        </el-footer>
      </el-container>
    </div>
    <sku-importer ref="skuImport" :must-columns="mustColumns" v-on:finish="readData"
                  templateUrl="/file/template/purchase_return_order.xlsx/采购退货导入模板"></sku-importer>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {PurchaseReturnOrderApi, ReturnMustColumns, ReturnSkuColumns} from '../api';
  import {SkuSelector} from '@/modules/selector';
  import {SkuImporter} from '@/modules/product';
  import {DataDictItemSelector} from '@/modules/base/datadict';
  import {Edit, List, PageList, Steps, TableResize} from '@/libs/mixins';
  import PurchaseReturnBasic from './basic.vue';

  export default {
    name: 'PurchaseReturnCreator',
    mixins: [Steps, Edit, List, PageList, TableResize],
    components: {
      PurchaseReturnBasic, DataDictItemSelector, SkuSelector, SkuImporter
    },
    data() {
      return {
        pk: 'purchaseReturnOrderId',
        api: PurchaseReturnOrderApi,
        stepTitle: '基本信息',
        columns: ReturnSkuColumns,
        relation: ReturnSkuColumns,
        mustColumns: ReturnMustColumns
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(this.next);
            return;
          case '退货明细':
            if (!this.domain.details) {
              this.$message.warning('请选择明细');
              return;
            } else if (this.domain.details.some(x => x.planQuantity === 0)) {
              this.$message.warning('采购退货数量不能为0');
              return;
            } else {
              this.next();
            }
            break;
          default:
            this.next();
            break;
        }
      },
    }
  };
</script>