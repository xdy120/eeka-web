<template>
  <el-container :style="{height:tabsTableHeight+'px'}">
    <el-aside width="200px" :style="{lineHeight: tabsTableHeight+'px'}">
      <img :src="imageUrl(domain)"
           style="height: auto;width: 200px;display: inline-block;vertical-align: middle;"/>
    </el-aside>
    <el-main style="padding: 0px 5px 0px 10px" class="oms-search">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="商品编码">
              <el-input :value="domain.productCode" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商品条码">
              <el-input :value="domain.barcode" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="简称">
              <el-input :value="domain.productShortName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品牌编码">
              <el-input :value="domain.brandCode" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="品牌名称">
              <el-input :value="domain.brandName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属公司">
              <el-input :value="domain.companyName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-input :value="domain.supplierName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年份">
              <el-input :value="domain.listingYear" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="季节">
              <el-input :value="domain.season" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="波段">
              <el-input :value="domain.waveband" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品类">
              <el-input v-model="domain.productCategoryName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
  import {TableResize, Tabs} from '@/libs/mixins';

  export default {
    name: 'ProductBasic',
    mixins: [TableResize, Tabs],
    data() {
      return {
        tab: 'basic',
        domain: {}
      };
    },
    methods: {
      search() {
        this.domain = this.parentData ? this.parentData : {};
      },
      imageUrl(product) {
        if (product && product.hasOwnProperty('imageUrl')) {
          return product.imageUrl;
        }
        return require('@/assets/images/bg.png');
      },
    }
  };
</script>