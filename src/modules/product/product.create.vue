<template>
  <el-dialog title="新建商品" :visible.sync="visible" :before-close="dialogCloseConfirm"
             :fullscreen="true">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"/>
      <el-step title="自定义属性"/>
      <el-step title="规格信息"/>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <product-basic ref="productBasic" v-model="domain"/>
    </div>
    <div v-show="stepTitle==='自定义属性'">
      <product-attribute v-model="domain.attributesJson"></product-attribute>
    </div>
    <div v-show="stepTitle==='规格信息'">
      <el-button-group style="margin-bottom: 5px">
        <el-button @click="openSkuEditor">新建</el-button>
        <el-button @click="openSkuCreator">自动生成</el-button>
      </el-button-group>
      <el-table :height="300" :data="domain.skus">
        <el-table-column label="规格编码" :width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="规格名称" :width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuName"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="color" label="颜色" :width="120">
          <template slot-scope="scope">
            <data-dict-item-selector :clearable="false" dataDictId="10102" v-model="scope.row.color"
                                     :code.sync="scope.row.colorCode"
                                     @confirm="colorSizeChange(scope.row)"></data-dict-item-selector>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="尺码" :width="120">
          <template slot-scope="scope">
            <data-dict-item-selector :clearable="false" dataDictId="10103" v-model="scope.row.size"
                                     :code.sync="scope.row.sizeCode"
                                     @confirm="colorSizeChange(scope.row)"></data-dict-item-selector>
          </template>
        </el-table-column>
        <el-table-column label="吊牌价" :width="100">
          <template slot-scope="scope">
            <el-input :controls="false" v-model="scope.row.markedPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="销售价" :width="100">
          <template slot-scope="scope">
            <el-input :controls="false" v-model="scope.row.sellingPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="成本价" :width="100">
          <template slot-scope="scope">
            <el-input :controls="false" v-model="scope.row.costPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="采购价" :width="100">
          <template slot-scope="scope">
            <el-input :controls="false" v-model="scope.row.purchasePrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="分销价" :width="100">
          <template slot-scope="scope">
            <el-input :controls="false" v-model="scope.row.distributionPrice"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="100" fixed="right">
          <template slot-scope="scope">
            <go-delete-button @click="domain.skus.splice(scope.$index,1)">
              <i class="el-icon-oms-remove"></i>
            </go-delete-button>
          </template>
        </el-table-column>
      </el-table>
      <sku-editor ref="skuEditor" :product="domain" :value="currentSku" @ok="addSku"></sku-editor>
      <sku-creator ref="skuCreator" :product="domain" @ok="skuCreated"></sku-creator>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import {DataDictItemSelector} from '@/modules/selector';
  import SkuCreator from './sku/sku.creator.vue';
  import SkuEditor from './sku/sku.edit.vue';
  import ProductBasic from './product.basic.vue';
  import ProductAttribute from './product.attribute.vue';
  import {ProductApi} from './api';
  import {Product} from './util';

  export default {
    name: 'ProductEditor',
    mixins: [Steps, Edit],
    components: {ProductBasic, ProductAttribute, DataDictItemSelector, SkuCreator, SkuEditor},
    data() {
      return {
        pk: 'productId',
        api: ProductApi,
        stepTitle: '基本信息',
        currentSku: {},
      };
    },

    methods: {
      show() {
        this.step = 0;
        this.domain = new Product();
        this.visible = true;
      },
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.productBasic.validate().then(() => this.next());
            return;
          case '自定义属性':
            break;
          case '规格信息':
            if (this.domain.skus.length === 0) {
              this.$message.warning('请填写规格信息！');
              return;
            }
            break;
        }
        this.next();
      },
      addSku(sku) {
        this.domain.skus.push(sku);
      },
      openSkuEditor(sku) {
        if (sku) {
          this.currentSku = sku;
        }
        this.$refs.skuEditor.show();
      },
      colorSizeChange(sku) {
        sku.skuCode = `${this.domain.productCode}-${sku.colorCode}-${sku.sizeCode}`;
        sku.skuName = `${sku.color} ${sku.size}`;
      },
      openSkuCreator() {
        this.$refs.skuCreator.show();
      },
      skuCreated(skus) {
        this.domain.skus = skus;
      },
      save() {
        this.$refs.productBasic.validate().then(() => {
          ProductApi.add(this.domain).then(() => {
            this.$emit('ok', this.domain);
            this.visible = false;
          });
        });
      }
    }
  };
</script>