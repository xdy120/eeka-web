<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="采购明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <purchase-basic ref="editForm" v-model="domain"></purchase-basic>
    </div>
    <div v-show="stepTitle==='采购明细'">
      <el-container>
        <el-header class="oms-action" height="35px">
          <sku-selector @confirm="selectSkus" :columns="columns"></sku-selector>
          <el-button @click="showSkuImport">导入</el-button>
        </el-header>
        <el-main>
          <el-table :data="domain.details" height="400px" show-summary>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column label="商品编码" sortable>
              <template slot-scope="scope">{{scope.row.productCode}}</template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称"></el-table-column>
            <el-table-column label="规格编码" sortable>
              <template slot-scope="scope">{{scope.row.skuCode}}</template>
            </el-table-column>
            <el-table-column prop="skuName" label="规格名称"></el-table-column>
            <go-quantity-column label="数量" prop="quantity">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.quantity"></el-input-number>
              </template>
            </go-quantity-column>
            <go-money-column label="建议采购价" prop="purchasePrice">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.purchasePrice"
                                 width="120"></el-input-number>
              </template>
            </go-money-column>
            <go-money-column label="实际采购价" prop="actualPrice">
              <template slot-scope="scope">
                <el-input-number size="small" v-model="scope.row.actualPrice"
                                 width="120"></el-input-number>
              </template>
            </go-money-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <go-delete-button @click="removeDetail(scope.$index)"></go-delete-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
    <sku-importer ref="skuImport" :must-columns="mustColumns" v-on:finish="readData"
                  templateUrl="/file/template/purchase_order.xlsx/采购订单导入模板"></sku-importer>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import {MustColumns, PurchaseOrderApi, SkuColumns} from './api';
  import PurchaseBasic from './basic.vue';
  import {SkuSelector} from '@/modules/selector';
  import {SkuImporter} from '@/modules/product';

  export default {
    name: 'PurchaseCreator',
    mixins: [Steps, Edit],
    components: {SkuSelector, PurchaseBasic, SkuImporter},
    data() {
      return {
        pk: 'purchaseOrderId',
        api: PurchaseOrderApi,
        stepTitle: '基本信息',
        columns: SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns,
      };
    },
    methods: {
      genDefaultDomain() {
        return {
          expressFee: 0
        };
      },
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
              this.next();
            });
            return;
          case '采购明细':
            if (!this.domain.details) {
              this.$message.warning('请选择明细');
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
    },
  };
</script>