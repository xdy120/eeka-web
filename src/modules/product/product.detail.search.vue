<template>
  <el-form :model="value">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-form-item label="商品编码">
          <el-input v-model="value.productCodes" :placeholder="Placeholders.IN"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="规格编码">
          <el-input v-model="value.skuCodes" :placeholder="Placeholders.IN"></el-input>
        </el-form-item>
      </el-col>
      <slot name="firstRow"></slot>
    </el-row>
    <slot></slot>
  </el-form>
</template>
<script>
  import {Placeholders} from '@/libs/util';

  export default {
    name: 'ProductSearchPart',
    props: {
      value: Object
    },
    data() {
      return {
        Placeholders
      };
    }
  };
</script>