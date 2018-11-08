<template>
  <div>
    <el-tree ref="tree" :props="defaultProps" lazy :render-content="treeItemRender"
             node-key="regionId" :expand-on-click-node="false"
             :load="loadChildren" :default-expanded-keys="['0']">
    </el-tree>
    <region-editor ref="editor" @ok="ok"></region-editor>
  </div>
</template>
<script>
  import {Tree} from '@/libs/mixins';
  import {RegionApi} from './api';
  import RegionEditor from './region.edit.vue';

  export default {
    components: {RegionEditor},
    mixins: [Tree],
    data() {
      return {
        pk: 'regionId',
        api: RegionApi,
        root: [{regionId: '0', regionName: '区域'}],
        defaultProps: {
          label: 'regionName',
        }
      };
    },
    methods: {
      treeItemRender(h, {node}) {
        return h('span',
          {
            style: 'flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'
          },
          [
            h('span', {style: 'margin-right: 20px'}, [h('i', {
              'class': 'el-icon-oms-briefcase',
              style: 'margin-right: 5px'
            }), h('span', node.label)]),
            h('span', [node.level <= 4 ? h('go-add-button', {
              props: {iconVisible: true, textVisible: false},
              on: {click: () => this.addNode(node)}
            }) : null, node.level > 1 ? h('go-modify-button', {
              props: {iconVisible: true, textVisible: false},
              on: {click: () => this.modifyNode(node)}
            }) : null, node.level > 1 ? h('go-delete-button', {
              props: {iconVisible: true, textVisible: false},
              on: {click: () => this.removeNode(node)}
            }) : null
            ])]);
      }
    }
  };
</script>
