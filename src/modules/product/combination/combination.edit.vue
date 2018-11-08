<template>
  <el-dialog title="编辑组合商品" :visible.sync="visible"
             :width="domain.skuId===undefined?'800px':'400px'">
    <el-container v-if="domain.skuId===undefined">
      <el-header class="oms-search" height="105px">
        <el-form :model="domain" :rules="rules" ref="editForm">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="套装编码" prop="skuCode">
                <el-input v-model="domain.skuCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="套装名称" prop="skuName">
                <el-input v-model="domain.skuName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="销售价" prop="sellingPrice">
                <el-input-number v-model="domain.sellingPrice"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="重量" prop="weight">
                <el-input-number v-model="domain.weight"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-checkbox v-model="domain.giftBox">礼盒</el-checkbox>
              <el-checkbox v-model="domain.prepackage">预包装</el-checkbox>
              <!--<el-checkbox v-model="domain.lockStock">锁定库存</el-checkbox>-->
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-header height="35px">
        <sku-selector @confirm="selectSkus" quantity></sku-selector>
      </el-header>
      <el-main>
        <el-table :data="domain.details" :height="250">
          <el-table-column prop="productCode" label="商品编码"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码"></el-table-column>
          <el-table-column prop="skuName" label="规格名称"></el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="主商品" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.mainSku"
                           @change="setMainSku(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <go-delete-button @click="domain.details.splice(scope.$index,1)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-form v-else :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="套装编码" prop="skuCode">
        <el-input v-model="domain.skuCode"></el-input>
      </el-form-item>
      <el-form-item label="套装名称" prop="skuName">
        <el-input v-model="domain.skuName"></el-input>
      </el-form-item>
      <el-form-item label="销售价" prop="sellingPrice">
        <el-input-number v-model="domain.sellingPrice"></el-input-number>
      </el-form-item>
      <el-form-item label="重量" prop="weight">
        <el-input-number v-model="domain.weight"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="domain.giftBox">礼盒</el-checkbox>
        <el-checkbox v-model="domain.prepackage">预包装</el-checkbox>
        <!--<el-checkbox v-model="domain.lockStock">锁定库存</el-checkbox>-->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {SkuSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';
  import {SkuApi} from '../api';
  import ThreeCheckbox from '@/component/ui/threecheckbox.vue';

  class Combination {
    constructor() {
      this.details = [];
      this.costPrice = 0;
      this.markedPrice = 0;
      this.purchasePrice = 0;
      this.distributionPrice = 0;
      this.sellingPrice = 0;
      this.logisticsInsurance = 0;
      this.quantityOfBox = 0;
      this.combination = true;
      this.giftBox = false;
      this.lockStock = false;
      this.prepackage = false;
    }
  }

  class CombinationDetail {
    constructor(sku) {
      this.productId = sku.productId;
      this.productCode = sku.productCode;
      this.productName = sku.productName;
      this.skuId = sku.skuId;
      this.skuCode = sku.skuCode;
      this.skuName = sku.skuName;
      this.quantity = sku.quantity;
    }
  }

  export default {
    components: {
      ThreeCheckbox,
      SkuSelector
    },
    mixins: [Edit],
    data() {
      return {
        pk: 'skuId',
        api: SkuApi,
        domain: new Combination(),
        rules: {
          skuCode: ValidateRules.requiredMax,
          skuName: {required: true, max: 100, message: '[1-100]不能为空', trigger: 'manual'},
          sellingPrice: ValidateRules.number
        }
      };
    },
    methods: {
      genDefaultDomain() {
        return new Combination();
      },
      setMainSku(row) {
        if (row.mainSku) {
          for (let item of this.domain.details) {
            if (item !== row) {
              item.mainSku = false;
            }
          }
        }
      },
      selectSkus(skus) {
        for (let sku of skus) {
          this.domain.details.push(new CombinationDetail(sku));
        }
      },
      save() {

        this.$refs.editForm.validate().then(() => {
          if (this.domain.skuId) {
            SkuApi.modifyCombination(this.domain.skuId, this.domain).then(() => {
              this.$emit('ok', this.domain);
              this.visible = false;
            });
          } else {
            SkuApi.addCombination(this.domain).then(() => {
              this.$emit('ok', this.domain);
              this.visible = false;
            });
          }
        });
      }
    }
  };
</script>