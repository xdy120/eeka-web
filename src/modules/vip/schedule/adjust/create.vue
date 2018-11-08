<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="调整明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <adjust-basic ref="editForm" v-model="domain"></adjust-basic>
    </div>
    <div v-show="stepTitle==='调整明细'">
      <el-row>
        <el-col :span="2">
          <sku-selector @confirm="selectSkus"></sku-selector>
        </el-col>
        <el-col :span="12">
          <el-button @click="showSkuImport">导入</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="domain.details" :height="350" style="margin-top: 5px" show-summary>
          <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
          <go-selection-column></go-selection-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="planQuantity" label="计划数量">
            <template slot-scope="scope">
              <el-input-number size="small" v-model="scope.row.planQuantity"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="50" fixed="right">
            <template slot-scope="scope">
              <go-delete-button @click="removeDetail(scope.$index)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
            <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
            <el-button @click="nextStep">{{nextText}}</el-button>
        </span>
    <sku-importer ref="skuImport" v-on:finish="readData"></sku-importer>
  </el-dialog>
</template>

<script>
  import {Edit, Steps} from '@/libs/mixins/index';
  import AdjustBasic from './base.vue';
  import {SkuColumns, VipAdjustApi} from './api';
  import {SkuImporter, SkuSelector} from '@/modules/product/index';

  export default {
    name: 'AdjustCreator',
    mixins: [Edit, Steps],
    components: {AdjustBasic, SkuImporter, SkuSelector},
    props: {},
    data() {
      return {
        api: VipAdjustApi,
        pk: 'vipAdjustId',
        stepTitle: '基本信息',
        relation: SkuColumns,
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
          case '调整明细':
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
