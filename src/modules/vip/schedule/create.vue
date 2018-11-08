<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="档期明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <base-edit-part ref="editForm" v-model="domain"></base-edit-part>
    </div>
    <div v-show="stepTitle==='档期明细'">
      <el-row>
        <el-col :span="2">
          <sku-selector @confirm="selectSkus"></sku-selector>
        </el-col>
        <el-col :span="12">
          <el-button @click="showSkuImport">导入</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="domain.details" :height="192">
          <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
          <el-table-column prop="productCode" label="商品编码" sortable></el-table-column>
          <el-table-column prop="productName" label="商品名称" sortable></el-table-column>
          <el-table-column prop="skuCode" label="规格编码" sortable></el-table-column>
          <el-table-column prop="skuName" label="规格名称" sortable></el-table-column>
          <el-table-column label="货值" prop="goodsValue" sortable>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.goodsValue"/>
            </template>
          </el-table-column>
          <el-table-column label="计划数量" prop="planQuantity" sortable>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.planQuantity"/>
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
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
    <sku-importer ref="skuImport" v-on:finish="readData"></sku-importer>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import BaseEditPart from './base.vue';
  import {SkuImporter, SkuSelector} from '@/modules/product/index';
  import {SkuColumns, VipScheduleApi} from './api';

  export default {
    mixins: [Edit, Steps],
    components: {BaseEditPart, SkuSelector, SkuImporter},
    props: {},
    data() {
      return {
        api: VipScheduleApi,
        pk: 'vipScheduleId',
        stepTitle: '基本信息',
        relation: SkuColumns,
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            if (this.$refs.editForm.domain.upload === undefined) {
              this.$refs.editForm.domain.upload = false;
            }
            this.$refs.editForm.validate().then(() => {
              this.next();
            });
            return;
          case '档期明细':
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
