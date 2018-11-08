<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <presell-basic ref="editForm" v-model="domain"></presell-basic>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import PresellBasic from './base.vue';
  import {PresellApi} from './api';

  export default {
    name: 'PresellEditor',
    mixins: [Edit],
    components: {PresellBasic},
    data() {
      return {
        api: PresellApi,
        pk: 'presellId',
      };
    },
    methods: {}
  };
</script>