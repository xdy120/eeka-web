<template>
  <el-container>
    <el-card class="box-card" style="height:calc(100% - 12px);padding: 5px">
      <el-tree ref="tree" :props="defaultProps" lazy :render-content="treeItemRender"
               node-key="dataDictId" :expand-on-click-node="false"
               :load="loadChildren" :default-expanded-keys="['0']" @node-click="loadItems">
      </el-tree>
      <data-dict-editor ref="editor" @ok="ok"></data-dict-editor>
    </el-card>
    <el-main style="padding-left: 5px">
      <data-dict-item-list :dataDict="selectedNodeData"/>
    </el-main>
  </el-container>
</template>
<script>
  import {DataDictApi} from './api';
  import {Tree} from '@/libs/mixins';
  import DataDictEditor from './datadict.edit.vue';
  import DataDictItemEditor from './datadict.item.edit.vue';
  import DataDictItemList from './datadict.item.list.vue';

  export default {
    mixins: [Tree],
    components: {DataDictEditor, DataDictItemEditor, DataDictItemList},
    data() {
      return {
        pk: 'dataDictId',
        api: DataDictApi,
        selectedDictId: null,
        root: [{dataDictId: '0', dataDictName: '数据字典', dataDictType: 'GROUP'}],
        defaultProps: {
          label: 'dataDictName',
        }
      };
    },
    computed: {
      selectedNodeData() {
        return this.selectedNode ? this.selectedNode.data : null;
      }
    },
    methods: {
      treeItemRender(h, {node}) {
        return h('div', {class: 'oms-tree-node'}, [
          h('div', {class: 'oms-tree-text'}, [h('i', {
            'class': node.data.dataDictType === 'GROUP' ? 'el-icon-oms-group'
              : 'el-icon-oms-datadict',
            style: 'margin-right: 5px'
          }), h('nobr', node.label)]),
          h('div', {class: 'oms-tree-action'},
            [node.data.dataDictType === 'GROUP' ? h('go-add-button', {
              props: {iconVisible: true, textVisible: false},
              on: {click: () => this.addNode(node)}
            }) : null, node.level > 1 && !node.data.system ? h('go-modify-button', {
              props: {iconVisible: true, textVisible: false},
              on: {click: () => this.modifyNode(node)}
            }) : null, node.level > 1 && !node.data.system ? h('go-delete-button', {
              props: {iconVisible: true, textVisible: false},
              on: {click: () => this.beforeRemove(node)}
            }) : null
            ])]);
      },
      beforeRemove(node) {
        if (node.data.dataDictType === 'GROUP') {
          DataDictApi.get(node.data.dataDictId).then(response => {
            if (response.childrenQuantity > 0) {
              this.$message.error('不能删除，分组下还有内容');
            } else {
              this.removeDicNode(node);
            }
          });
        } else {
          DataDictApi.listItems(node.data.dataDictId).then(response => {
            if (response.length !== 0) {
              this.$message.error('不能删除，字典中还有内容');
            } else {
              this.removeDicNode(node);
            }
          });
        }
      },
      loadItems(data, node) {
        if (data.dataDictType === 'GROUP') {
          this.selectedNode = node;
        } else {
          this.selectedNode = node;
        }
      }
    }
  };
</script>
<style>
  .el-card__body {
    height: 100%
  }


</style>
