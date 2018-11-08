<template>
  <el-container>
    <el-input v-model="dictDomain.productCategoryName" placeholder="选择商品分类">
      <el-button slot="append" icon="el-icon-search"
                 @click="editorVisible=true"></el-button>
    </el-input>

  </el-container>
</template>
<script>
  import {CategoryApi} from '../api';

  export default {
    name: 'CategorySelector',
    props: {
      value: {
        require: true
      }
    },
    data() {
      return {
        editorVisible: false,
        dictDomain: {},
        defaultProps: {
          children: 'children',
          label: 'productCategoryName',
          isLeaf: 'leaf',
        }
      };
    },
    methods: {
      doSave() {
        let node = this.$refs.tree.getCurrentNode();
        if (node == null || node.level === 0) {
          this.$message.error('请选择分类一个商品分类');
        } else {
          this.dictDomain = node;
          this.$emit('input', node.productCategoryId);
          this.$emit('change', node);
          this.editorVisible = false;
        }
      },
      loadChildren(node, resolve) {
        if (node.level === 0) {
          resolve([{productCategoryId: '0', productCategoryName: '商品分类'}]);
        } else {
          CategoryApi.listChildren(node.data.productCategoryId).then(children => {
            resolve(children);
          });
        }
      }
    },
    watch: {
      value(val) {
        if (val) {
          CategoryApi.get(val).then(data => this.dictDomain = data);
        } else {
          this.dictDomain = {};
        }
      }
    }
  };
</script>
