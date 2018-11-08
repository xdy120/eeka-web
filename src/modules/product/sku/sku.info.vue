<template>
  <div width="600px">
    <el-form :model="domain" label-width="110px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              唯品价
              <el-button type="text" v-if="!edit.vipPrice"
                         @click="editAttr('vipPrice')">修改</el-button>
              <el-button type="text" @click="cancelEdit('vipPrice')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.vipPrice"
                             :disabled="!edit.vipPrice"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              吊牌价
              <el-button type="text" v-if="!edit.markedPrice"
                         @click="editAttr('markedPrice')">修改</el-button>
              <el-button type="text" @click="cancelEdit('markedPrice')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.markedPrice"
                             :disabled="!edit.markedPrice"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              销售价
              <el-button type="text" v-if="!edit.sellingPrice"
                         @click="editAttr('sellingPrice')">修改</el-button>
              <el-button type="text" @click="cancelEdit('sellingPrice')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.sellingPrice"
                             :disabled="!edit.sellingPrice"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              成本价
              <el-button type="text" v-if="!edit.costPrice"
                             @click="editAttr('costPrice')">修改</el-button>
              <el-button type="text" @click="cancelEdit('costPrice')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.costPrice"
                             :disabled="!edit.costPrice"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              采购价
              <el-button type="text" v-if="!edit.purchasePrice"
                             @click="editAttr('purchasePrice')">修改</el-button>
              <el-button type="text" @click="cancelEdit('purchasePrice')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.purchasePrice"
                             :disabled="!edit.purchasePrice"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              分销价
              <el-button type="text" v-if="!edit.distributionPrice"
                             @click="editAttr('distributionPrice')">修改</el-button>
              <el-button type="text" @click="cancelEdit('distributionPrice')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.distributionPrice"
                             :disabled="!edit.distributionPrice"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              物流保价
              <el-button type="text" v-if="!edit.logisticsInsurance"
                              @click="editAttr('logisticsInsurance')">修改</el-button>
              <el-button type="text" @click="cancelEdit('logisticsInsurance')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.logisticsInsurance"
                             :disabled="!edit.logisticsInsurance"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              箱规
              <el-button type="text" v-if="!edit.quantityOfBox"
                            @click="editAttr('quantityOfBox')">修改</el-button>
              <el-button type="text" @click="cancelEdit('quantityOfBox')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.quantityOfBox"
                             :disabled="!edit.quantityOfBox"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              重量
              <el-button type="text" v-if="!edit.weight"
                            @click="editAttr('weight')">修改</el-button>
              <el-button type="text" @click="cancelEdit('weight')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.weight"
                             :disabled="!edit.weight"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              体积
              <el-button type="text" v-if="!edit.volume"
                            @click="editAttr('volume')">修改</el-button>
              <el-button type="text" @click="cancelEdit('volume')" v-else>取消</el-button>
            </span>
            <el-input-number v-model="domain.volume"
                             :disabled="!edit.volume"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item>
            <three-checkbox v-model="domain.prepackage">预包装</three-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>

  export default {
    name: 'SkuInfoEditor',
    props: {
      info: Object,
    },
    data() {
      return {
        domain: this.info ? this.info : {},
        edit: {
          vipPrice: false,
          markedPrice: false,
          sellingPrice: false,
          costPrice: false,
          purchasePrice: false,
          distributionPrice: false,
          logisticsInsurance: false,
          quantityOfBox: false,
          weight: false,
          volume: false
        }
      };
    },
    methods: {
      getModifyInfo() {
        return this.domain;
      },
      editAttr(attrName) {
        if (attrName === 'vipPrice') {
          this.edit.vipPrice = true;
          this.domain.vipPrice = 0;
        } else if (attrName === 'markedPrice') {
          this.edit.markedPrice = true;
          this.domain.markedPrice = 0;
        } else if (attrName === 'sellingPrice') {
          this.edit.sellingPrice = true;
          this.domain.sellingPrice = 0;
        } else if (attrName === 'costPrice') {
          this.edit.costPrice = true;
          this.domain.costPrice = 0;
        } else if (attrName === 'purchasePrice') {
          this.edit.purchasePrice = true;
          this.domain.purchasePrice = 0;
        } else if (attrName === 'distributionPrice') {
          this.edit.distributionPrice = true;
          this.domain.distributionPrice = 0;
        } else if (attrName === 'logisticsInsurance') {
          this.edit.logisticsInsurance = true;
          this.domain.logisticsInsurance = 0;
        } else if (attrName === 'quantityOfBox') {
          this.edit.quantityOfBox = true;
          this.domain.quantityOfBox = 0;
        } else if (attrName === 'weight') {
          this.edit.weight = true;
          this.domain.weight = 0;
        } else if (attrName === 'volume') {
          this.edit.volume = true;
          this.domain.volume = 0;
        }
      },
      cancelEdit(attrName) {
        if (attrName === 'vipPrice') {
          this.edit.vipPrice = false;
          this.domain.vipPrice = undefined;
        } else if (attrName === 'markedPrice') {
          this.edit.markedPrice = false;
          this.domain.markedPrice = undefined;
        } else if (attrName === 'sellingPrice') {
          this.edit.sellingPrice = false;
          this.domain.sellingPrice = undefined;
        } else if (attrName === 'costPrice') {
          this.edit.costPrice = false;
          this.domain.costPrice = undefined;
        } else if (attrName === 'purchasePrice') {
          this.edit.purchasePrice = false;
          this.domain.purchasePrice = undefined;
        } else if (attrName === 'distributionPrice') {
          this.edit.distributionPrice = false;
          this.domain.distributionPrice = undefined;
        } else if (attrName === 'logisticsInsurance') {
          this.edit.logisticsInsurance = false;
          this.domain.logisticsInsurance = undefined;
        } else if (attrName === 'quantityOfBox') {
          this.edit.quantityOfBox = false;
          this.domain.quantityOfBox = undefined;
        } else if (attrName === 'weight') {
          this.edit.weight = false;
          this.domain.weight = undefined;
        } else if (attrName === 'volume') {
          this.edit.volume = false;
          this.domain.volume = undefined;
        }
      }
    }
  };
</script>