<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <purchase-return-basic ref="editForm" v-model="domain"></purchase-return-basic>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import PurchaseReturnBasic from './basic.vue';
  import {PurchaseReturnOrderApi} from '../api';

  export default {
    name: 'PurchaseReturnEditor',
    mixins: [Edit],
    components: {PurchaseReturnBasic},
    data() {
      return {
        pk: 'purchaseReturnOrderId',
        api: PurchaseReturnOrderApi,
      };
    },
    methods: {}
  };
</script>