<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <return-order-basic ref="editForm" v-model="domain"></return-order-basic>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import ReturnOrderBasic from './edit.basic.vue';
  import {ReturnOrderApi} from '../api';

  export default {
    name: 'ReturnOrderEditor',
    mixins: [Edit],
    components: {ReturnOrderBasic},
    data() {
      return {
        api: ReturnOrderApi,
        pk: 'returnOrderId',
      };
    }
  };
</script>