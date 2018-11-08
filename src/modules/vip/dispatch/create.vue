<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="拣货明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <base-edit-part ref="editForm" v-model="domain"></base-edit-part>
    </div>
    <el-container v-show="stepTitle==='拣货明细'">
      <el-header>
        <sku-selector @confirm="selectSkus" :columns="columns"></sku-selector>
        <el-button @click="showSkuImport">导入</el-button>
      </el-header>
      <el-main>
        <el-table :data="domain.details" height="400px" show-summary>
          <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
          <el-table-column label="商品编码" prop="productCode"></el-table-column>
          <el-table-column label="商品名称" prop="productName"></el-table-column>
          <el-table-column label="规格编码" prop="skuCode"></el-table-column>
          <el-table-column label="规格名称" prop="skuName"></el-table-column>
          <el-table-column label="PO编号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.poCode"></el-input>
            </template>
          </el-table-column>
          <go-money-column label="唯品价" prop="vipPrice">
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.vipPrice"></el-input-number>
            </template>
          </go-money-column>
          <go-quantity-column label="通知数量" prop="noticeQuantity">
            <template slot-scope="scope">
              <el-input-number v-model.number="scope.row.noticeQuantity"></el-input-number>
            </template>
          </go-quantity-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <go-delete-button type="text" @click="removeDetail(scope.$index)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
    <sku-importer ref="skuImport" :must-columns="mustColumns" v-on:finish="readData"
                  templateUrl="/file/template/vip_dispatch.xlsx/唯品拣货单导入模板"></sku-importer>
  </el-dialog>
</template>

<script>
  import {Edit, Steps} from '@/libs/mixins';
  import BaseEditPart from './base.vue';
  import {MustColumns, SkuColumns, VipDispatchApi} from './api';
  import {SkuImporter, SkuSelector} from '@/modules/product/index';
  import {Assert} from '@/libs/util';

  export default {
    name: 'DispatchCreator',
    mixins: [Edit, Steps],
    components: {BaseEditPart, SkuSelector, SkuImporter},
    props: {},
    data() {
      return {
        api: VipDispatchApi,
        pk: 'vipDispatchId',
        stepTitle: '基本信息',
        columns: SkuColumns,
        relation: SkuColumns,
        mustColumns: MustColumns
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
              if (!this.domain.useLockQuantity) {
                this.domain.useLockQuantity = false;
              }
              this.next();
            });
            return;
          case '拣货明细':
            if (!this.domain.details) {
              this.$message.warning('请选择明细');
              return;
            } else {
              this.beginNext();
            }
            break;
          default:
            this.beginNext();
            break;
        }
      },
      beginNext() {
        let isSave = true;
        for (var i = 0; i < this.domain.details.length; i++) {
          if (Assert.isBlank(this.domain.details[i].poCode)) {
            isSave = false;
          }
        }
        if (isSave) {
          this.next();
        } else {
          this.$message.warning('PO编号不能为空');
        }
      },
      replenishment(vipDispatch){
        this.domain = vipDispatch;
        this.editMode = true;
        this.visible = true;
        this.isRequestSend = false;
      }
    },
  };
</script>
