<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <adjust-base ref="editForm" v-model="domain"></adjust-base>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins/index';
  import AdjustBase from './base.vue';
  import {VipAdjustApi} from './api';

  export default {
    name: 'AdjustEditor',
    mixins: [Edit],
    components: {AdjustBase},
    data() {
      return {
        api: VipAdjustApi,
        pk: 'vipAdjustId',
      };
    },
    methods: {}
  };
</script>