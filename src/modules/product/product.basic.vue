<template>
  <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px">
    <el-row :gutter="10">
      <el-col :span="16">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="domain.productName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品简称">
          <el-input v-model="domain.productShortName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="商品编码" prop="productCode">
          <el-input v-model="domain.productCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品条码">
          <el-input v-model="domain.barcode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商品品牌">
          <data-dict-item-selector v-model="domain.brandName" data-dict-id="10101"
                                   :code.sync="domain.brandCode"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="所属公司">
          <company-selector v-model="domain.companyId" :company-name.sync="domain.companyName"/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="供应商">
          <supplier-selector v-model="domain.supplierId"
                             :supplier-name.sync="domain.supplierName"></supplier-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="计量单位">
          <data-dict-item-selector v-model="domain.unit"
                                   data-dict-id="10106"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="年份">
          <data-dict-item-selector v-model="domain.listingYear"
                                   data-dict-id="10104"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="季节">
          <data-dict-item-selector v-model="domain.season"
                                   data-dict-id="10105"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="波段">
          <data-dict-item-selector v-model="domain.waveband"
                                   data-dict-id="10107"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="商品类型">
          <enum-selector enum-name="ProductType" v-model="domain.productType"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上市日期">
          <el-date-picker v-model="domain.listingDate" type="date" value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="保质期">
          <el-input-number v-model="domain.warrantyPeriod"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item>
          <el-checkbox v-model="domain.singleDelivery">单件发货</el-checkbox>
          <el-checkbox v-model="domain.gift">仅赠品</el-checkbox>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {CompanySelector, DataDictItemSelector, SupplierSelector} from '@/modules/selector';

  export default {
    name: 'ProductBasic',
    components: {CompanySelector, DataDictItemSelector, SupplierSelector},
    props: {
      value: Object
    },
    watch: {
      value(val) {
        this.domain = val;
      }
    },
    data() {
      return {
        domain: this.value,
        rules: {
          productCode: ValidateRules.code,
          productName: ValidateRules.name,
          productType: ValidateRules.required
        }
      };
    },
    methods: {
      validate() {
        this.$emit('input', this.domain);
        return this.$refs.editForm.validate();
      }
    }
  };
</script>