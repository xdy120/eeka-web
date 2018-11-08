<template>
  <el-dialog title="规格属性" :visible.sync="visible" :before-close="dialogCloseConfirm" width="600px"
             append-to-body>
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基础信息"></el-step>
      <el-step title="选择属性"></el-step>
      <el-step v-for="item in selectedAttributes" :key="item.attributeId"
               :title="item.attributeName"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基础信息'" class="step-content">
      <sku-info-editor :info="info"></sku-info-editor>
    </div>
    <div v-show="stepTitle==='选择属性'" class="step-content">
      <el-table ref="gridAttributes" @selection-change="selectAttributesChange" :data="attributes"
                height="200">
        <go-selection-column></go-selection-column>
        <el-table-column prop="attributeName" label="属性名称"></el-table-column>
      </el-table>
    </div>
    <div v-show="stepTitle===item.attributeName" v-for="item in selectedAttributes"
         :key="item.attributeId" class="step-content">
      <el-table @selection-change="selectDictChange($event,item)" :data="item.items" height="200">
        <go-selection-column></go-selection-column>
        <el-table-column prop="dataDictItemCode" label="编码"></el-table-column>
        <el-table-column prop="dataDictItemName" label="名称"></el-table-column>
      </el-table>
    </div>
    <div style="text-align: right">
      <el-button :disabled="prevDisabled" @click="prev">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>
<style scoped>
  .step-content {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
<script>
  import {Assert} from '@/libs/util';
  import {Steps} from '@/libs/mixins';
  import {AttributeApi} from '../api';
  import {DataDictApi} from '@/modules/base/datadict';
  import SkuInfoEditor from './sku.info.vue';
  import {ProductSku, ProductSkuInfo} from '../util';

  export default {
    components: {SkuInfoEditor},
    mixins: [Steps],
    props: {
      product: {
        required: true
      }
    },
    data() {
      return {
        props: {
          key: 'dataDictItemCode',
          label: 'dataDictItemName'
        },
        visible: false,
        stepTitle: '基础信息',
        attributes: [],
        selectedAttributes: [],
        info: new ProductSkuInfo()
      };
    },
    mounted() {
      AttributeApi.listCoder().then(data => {
        this.attributes = data;
      });
    },
    methods: {
      selectDictChange(selection, attribute) {
        attribute.selectedItems = selection;
      },
      selectAttributesChange(selection) {
        this.selectedAttributes = selection;
      },
      buildSku(attribute, sourceSku) {
        let sku = new ProductSku(this.product, attribute);
        if (sourceSku) {
          sku.color = sourceSku.color;
          sku.colorCode = sourceSku.colorCode;
          sku.size = sourceSku.size;
          sku.sizeCode = sourceSku.sizeCode;
          sku.skuCode = `${sourceSku.skuCode}-${attribute.dataDictItemCode}`;
          sku.skuName = `${sourceSku.skuName} ${attribute.dataDictItemName}`;
        }
        if (attribute.dataDictId === '10102') {
          sku.color = attribute.dataDictItemName;
          sku.colorCode = attribute.dataDictItemCode;
        }
        if (attribute.dataDictId === '10103') {
          sku.size = attribute.dataDictItemName;
          sku.sizeCode = attribute.dataDictItemCode;
        }
        return sku;
      },
      createSkus() {
        let skus = [];
        for (let attr of this.selectedAttributes) {
          if (Assert.isEmpty(attr.selectedItems)) {
            this.$message.warning(`请选择${attr.attributeName}`);
            return [];
          }
          if (attr.selectedItems.length > 0) {
            if (skus.length > 0) {
              let temp = [];
              for (let sku of skus) {
                for (let item of attr.selectedItems) {
                  temp.push(this.buildSku(item, sku));
                }
              }
              skus = temp;
            }
            else {
              for (let item of attr.selectedItems) {
                skus.push(this.buildSku(item));
              }
            }
            this.saveInfo(skus);
          }
        }
        return skus;
      },
      show() {
        this.step = 0;
        this.visible = true;
      },
      nextStep() {
        switch (this.stepTitle) {
          case '选择属性':
            if (this.selectedAttributes.length === 0) {
              this.$message.warning('请选择属性');
              return;
            }
            const promises = this.selectedAttributes.map(
                item => DataDictApi.listItems(item.dataDictId).then(data => item.items = data));
            Promise.all(promises).then(this.next);
            return;
          default:
            break;
        }
        this.next();
      },
      save() {
        let skus = this.createSkus();
        if (skus.length > 0) {
          this.$emit('ok', skus);
          this.visible = false;
        }
      },
      saveInfo(skus) {
        skus[0].costPrice = this.info.costPrice;
        skus[0].markedPrice = this.info.markedPrice;
        skus[0].sellingPrice = this.info.sellingPrice;
        skus[0].purchasePrice = this.info.purchasePrice;
        skus[0].distributionPrice = this.info.distributionPrice;
        skus[0].logisticsInsurance = this.info.logisticsInsurance;
        skus[0].quantityOfBox = this.info.quantityOfBox;
        skus[0].weight = this.info.weight;
        skus[0].volume = this.info.volume;
      }
    }
  };
</script>