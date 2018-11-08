<template>
  <div>
    <el-tree ref="tree" :props="defaultProps" lazy :render-content="treeItemRender"
             node-key="productCategoryId" :expand-on-click-node="false"
             :load="loadChildren" :default-expanded-keys="['0']">
    </el-tree>
    <category-editor ref="editor" @ok="ok"></category-editor>
  </div>
</template>
<script>
  import {Tree} from '@/libs/mixins';
  import {CategoryApi} from '../api';
  import CategoryEditor from './category.edit.vue';

  export default {
    components: {CategoryEditor},
    mixins: [Tree],
    data() {
      return {
        pk: 'productCategoryId',
        api: CategoryApi,
        root: [{productCategoryId: '0', productCategoryName: '商品分类'}],
        defaultProps: {
          label: 'productCategoryName',
        }
      };
    },
    methods: {}
  };
</script>
