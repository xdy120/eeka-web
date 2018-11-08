<template>
  <el-container>
    <el-input v-model="domain.dataDictName" readonly placeholder="选择数据字典">
      <el-button slot="append" icon="el-icon-search"
                 @click="editorVisible=true"></el-button>
    </el-input>
    <el-dialog title="编辑" width="400px" height="600px" :visible.sync="editorVisible"
               :before-close="dialogCloseConfirm" append-to-body>
      <el-tree ref="tree" :props="defaultProps" lazy
               node-key="dataDictId" :render-content="treeItemRender"
               :load="loadChildren" :default-expanded-keys="['0']">
      </el-tree>
      <span slot="footer" class="dialog-footer">
                <el-button @click="doSave">确定</el-button>
            </span>
    </el-dialog>
  </el-container>
</template>
<script>
  import {DataDictApi} from './api';

  export default {
    name: 'DataDictSelector',
    props: {
      value: {
        require: true
      },
      dataDictId: String,
      dataDictName: String,
    },
    data() {
      return {
        editorVisible: false,
        domain: {},
        currentDomain: null,
        defaultProps: {
          children: 'children',
          label: 'dataDictName',
          isLeaf: x => x.dataDictType === 'DICT'
        }
      };
    },
    methods: {
      doSave() {
        let node = this.$refs.tree.getCurrentNode();
        if (node == null || node.dataDictType === 'GROUP') {
          this.$message.error('请选择一个数据字典');
        } else {
          this.domain = node;
          this.$emit('input', node.dataDictId);
          this.$emit('change', node);
          this.$emit('update:dataDictName', node.dataDictName);
          this.editorVisible = false;
        }
      },
      loadDataDict(id) {
        if (id) {
          DataDictApi.get(id).then(data => {
            this.domain = data;
          });
        }
      },
      loadChildren(node, resolve) {
        if (node.level === 0) {
          resolve([{dataDictId: '0', dataDictName: '商品分类', dataDictType: 'GROUP'}]);
        } else {
          DataDictApi.listChildren(node.data.dataDictId).then(children => {
            resolve(children);
          });
        }
      },
      treeItemRender(h, {node}) {
        return h('span', [h('i', {
          'class': node.data.dataDictType === 'GROUP' ? 'el-icon-oms-briefcase'
            : 'el-icon-oms-ios-book',
          style: 'margin-right: 5px'
        }), h('span', node.label)]);
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.loadDataDict(val);
        } else {
          this.domain = {};
        }
      }
    },
    created() {
      this.loadDataDict(this.value);
    }
  };
</script>
