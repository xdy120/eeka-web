<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <purchase-basic ref="editForm" v-model="domain"></purchase-basic>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import PurchaseBasic from './basic.vue';
  import {PurchaseOrderApi} from './api';

  export default {
    name: 'PurchaseEditor',
    mixins: [Edit],
    components: {PurchaseBasic},
    data() {
      return {
        pk: 'purchaseOrderId',
        api: PurchaseOrderApi,
      };
    },
    methods: {}
  };
</script>