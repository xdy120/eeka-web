<template>
  <el-dialog title="商品修改" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <el-tabs type="border-card" value="basic">
      <el-tab-pane name="basic" label="基本信息">
        <product-basic ref="productBasic" v-model="domain"></product-basic>
      </el-tab-pane>
      <el-tab-pane name="attribute" label="自定义信息">
        <product-attribute v-model="domain.attributesJson"></product-attribute>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ProductApi} from './api';
  import ProductBasic from './product.basic.vue';
  import ProductAttribute from './product.attribute.vue';

  export default {
    name: 'ProductEditor',
    mixins: [Edit],
    components: {ProductBasic, ProductAttribute},
    data() {
      return {
        pk: 'productId',
        api: ProductApi
      };
    },
    methods: {
      save() {
        this.$refs.productBasic.validate().then(this.doSave);
      }
    }
  };
</script>