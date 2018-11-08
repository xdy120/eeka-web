<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <refund-order-basic ref="editForm" v-model="domain"></refund-order-basic>
    <span slot="footer" class="dialog-footer">
             <el-button @click="save()">保存</el-button>
       </span>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {RefundOrderApi} from './api';
  import RefundOrderBasic from './edit.basic.vue';

  export default {
    name: 'RefundEdit',
    mixins: [Edit],
    components: {RefundOrderBasic},
    data() {
      return {
        api: RefundOrderApi,
        pk: 'refundOrderId',
      };
    },
    methods: {},
  };
</script>