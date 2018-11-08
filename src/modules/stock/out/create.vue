<template>
  <el-dialog title="出库单创建" :visible.sync="visible" :before-close="dialogCloseConfirm"
             width="1000px">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="出库明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <edit-basic ref="editForm" v-model="domain"></edit-basic>
    </div>
    <el-container v-show="stepTitle==='出库明细'">
      <el-header class="oms-action" height="35px">
        <sku-selector @confirm="selectSkus" :columns="columns"></sku-selector>
        <el-button @click="showSkuImport">导入</el-button>
      </el-header>
      <el-mian>
        <el-table :height="300" :data="domain.details" style="margin-top: 5px" show-summary>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <go-quantity-column prop="planQuantity" label="计划数量" width="90px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.planQuantity"></el-input-number>
            </template>
          </go-quantity-column>
          <go-money-column prop="price" label="价格" width="90px" sortable>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.price"></el-input-number>
            </template>
          </go-money-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <go-delete-button @click="domain.details.splice(scope.$index,1)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-mian>
    </el-container>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
    <sku-importer ref="skuImport" :must-cloumns="mustColumns" v-on:finish="readData"
                  templateUrl="/file/template/stock_out.xlsx/出库单导入模板"></sku-importer>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import EditBasic from './basic.vue';
  import {MustColumns, SkuColumns, StockOutApi} from './api';
  import {SkuSelector} from '@/modules/selector';
  import {SkuImporter} from '@/modules/product/index';

  export default {
    name: 'OutCreator',
    mixins: [Steps, Edit],
    components: {
      SkuSelector, EditBasic, SkuImporter
    },
    props: {},
    data() {
      return {
        api: StockOutApi,
        pk: 'stockOutOrderId',
        stepTitle: '基本信息',
        columns: SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns,
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
              this.next();
            });
            return;
          case '出库明细':
            if (!this.domain.details) {
              this.$message.warning('请选择出库明细');
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
