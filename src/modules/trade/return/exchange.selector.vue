<template>
  <el-popover :placement="position" width="400" trigger="click" @show="search()" v-model="visible">
    <el-table :data="skuList" @row-dblclick="confirm">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column property="productCode" label="商品编码"></el-table-column>
      <el-table-column property="productName" label="商品名称"></el-table-column>
      <el-table-column property="skuCode" label="规格编码"></el-table-column>
      <el-table-column property="skuName" label="规格名称"></el-table-column>
    </el-table>
    <el-button type="text" slot="reference">换</el-button>
  </el-popover>

</template>

<script>
  import {List, Selector} from '@/libs/mixins';
  import {ProductApi} from '@/modules/product/api';

  export default {
    name: 'ExchangeSelector',
    mixins: [List, Selector],
    props: {
      productId: Number,
      quantity: Number,
      index: Number,
      position: {
        type: String,
        default: 'bottom'
      }

    },
    data() {
      return {
        api: ProductApi,
        skuList: [],
      };
    },
    methods: {
      search() {
        const _this = this;
        _this.visible = true;
        ProductApi.listSkus(this.productId).then(response => {
          if (response) {
            response.forEach(x => {
              if (x.product) {
                x.productType = x.product.productType;
              }
            });
            _this.skuList = response;
          }
        });
      },
      confirm(inputValue) {
        if (inputValue) {
          inputValue.index = this.index;
          inputValue.quantity = this.quantity;
          inputValue.actualAmount = 0.00;
          this.$emit('update:outDetail', inputValue);
          this.visible = false;
        }
      }
    },

  };
</script>

<style scoped>

</style>