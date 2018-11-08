<template>
  <el-dialog title="规格编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="600px"
             append-to-body>
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="规格编码" prop="skuCode">
            <el-input v-model="domain.skuCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格名称" prop="skuName">
            <el-input v-model="domain.skuName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="条码">
            <el-input v-model="domain.barcode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="颜色">
            <data-dict-item-selector dataDictId="10102" v-model="domain.color"
                                     :code.sync="domain.colorCode"></data-dict-item-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="尺码">
            <data-dict-item-selector dataDictId="10103" v-model="domain.size"
                                     :code.sync="domain.sizeCode"></data-dict-item-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物流保价">
            <el-input-number v-model="domain.logisticsInsurance"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="唯品价">
            <el-input-number v-model="domain.vipPrice"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="吊牌价">
            <el-input-number v-model="domain.markedPrice"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="销售价">
            <el-input-number v-model="domain.sellingPrice"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成本价">
            <el-input-number v-model="domain.costPrice"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="采购价">
            <el-input-number v-model="domain.purchasePrice"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分销价">
            <el-input-number v-model="domain.distributionPrice"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="体积">
            <el-input-number v-model="domain.volume"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重量">
            <el-input-number v-model="domain.weight"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="箱规">
            <el-input-number v-model="domain.quantityOfBox"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item>
            <el-checkbox v-model="domain.prepackage">预包装</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="text-align: right">
        <el-button @click="ok">确定</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
  import {DataDictItemSelector} from '@/modules/selector';
  import {SkuApi} from '../api';
  import {ValidateRules} from '@/libs/util';
  import {ProductSku} from '../util';

  export default {
    name: 'ProductSkuEditor',
    components: {DataDictItemSelector},
    props: {
      product: Object,
      remote: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        visible: false,
        domain: {},
        rules: {
          skuCode: ValidateRules.requiredMax,
          skuName: ValidateRules.requiredMax
        }
      };
    },
    methods: {
      show(skuId) {
        if (skuId) {
          SkuApi.get(skuId).then(data => {
            this.domain = data;
          });
        } else {
          this.domain = new ProductSku();
        }
        this.visible = true;
      },
      ok() {
        this.$refs.editForm.validate().then(() => {
          this.domain.productId = this.product.productId;
          this.domain.productCode = this.product.productCode;
          this.domain.productName = this.product.productName;
          if (this.remote) {
            if (this.domain.skuId) {
              SkuApi.modify(this.domain.skuId, this.domain).then(() =>
                this.$emit('ok', this.domain)
              );
            } else {
              SkuApi.add(this.domain).then(() =>
                this.$emit('ok', this.domain)
              );
            }
          } else {
            this.$emit('ok', this.domain);
          }
          this.visible = false;
        });
      }
    }
  };
</script>