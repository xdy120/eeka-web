<template>
  <el-dialog title="编辑" :fullscreen="true" :visible.sync="visible"
             :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="店铺信息"></el-step>
      <el-step title="预售明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <presell-basic ref="editForm" v-model="domain"></presell-basic>
    </div>
    <el-container v-show="stepTitle==='店铺信息'">
      <el-header>
        <store-selector dialog v-model="domain.storeId" :multiple=true
                        @confirm="storeConfirm"></store-selector>
      </el-header>
      <el-main>
        <el-table :data="domain.stores" height="400px">
          <el-table-column prop="storeName" label="店铺名称" width="250px"></el-table-column>
          <el-table-column label="上传比例" width="100px">
            <template slot-scope="scope">
              <el-input size="small" v-model.number="scope.row.rate">
                <template slot="suffix">%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <go-delete-button @click="removeStore(scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-container v-show="stepTitle==='预售明细'">
      <el-header>
        <sku-selector @confirm="selectSkus"></sku-selector>
        <el-button @click="showSkuImport">导入</el-button>
      </el-header>
      <el-main>
        <el-table :data="domain.details" height="400px" show-summary>
          <go-selection-column></go-selection-column>
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <go-quantity-column prop="quantity" label="数量" width="120px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity"></el-input-number>
            </template>
          </go-quantity-column>
          <el-table-column label="平台商品ID" width="120px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.mallProductId"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <go-delete-button @click="removeDetail(scope.$index)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
    <sku-importer ref="skuImport" :must-columns="mustColumns" @finish="readData"
                  templateUrl="/file/template/presell.xlsx/预售计划导入模板"></sku-importer>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import {SkuSelector, StoreSelector} from '@/modules/selector';
  import {MustColumns,SkuColumns, PresellApi} from './api';
  import PresellBasic from './base.vue';
  import {SkuImporter} from '@/modules/product/index';

  export default {
    name: 'PresellCreator',
    mixins: [Steps, Edit],
    components: {SkuSelector, StoreSelector, PresellBasic, SkuImporter},
    data() {
      return {
        pk: 'presellId',
        api: PresellApi,
        stepTitle: '基本信息',
        stores: [],
        relation: SkuColumns,
        mustColumns: MustColumns
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
          case '店铺信息':
            if (!this.domain.stores) {
              this.$message.warning('请选择店铺');
              return;
            } else {
              this.next();
            }
            break;
          case '预售明细':
            if (!this.domain.details) {
              this.$message.warning('请选择预售明细');
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
      doSave() {
        if (this.domain.stores.length <= 0) {
          this.$message.error('预售计划必须要有店铺');
          return;
        }
        if (this.domain.details.length <= 0) {
          this.$message.error('预售计划必须要有明细');
          return;
        }
        PresellApi.add(this.domain).then(r => {
          this.$message.success('新增预售计划成功');
          this.close();
          this.$emit('ok', this.domain);
        });
      },
      storeConfirm(data) {
        if (!this.domain.stores) {
          let stores = [];
          this.$set(this.domain, 'stores', stores);
        }
        data.forEach(row => {
          let store = {};
          store.storeId = row.storeId;
          store.storeName = row.storeName;
          store.rate = 100;
          if (this.domain.stores.findIndex(v => v.storeId === store.storeId) < 0) {
            this.domain.stores.push(store);
          }
        });
      },
      removeStore(row) {
        this.domain.stores.splice(this.domain.stores.findIndex(v => v.storeId === row.storeId), 1);
      },
    },
  }
  ;
</script>
