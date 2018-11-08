<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <edit-basic ref="editForm" v-model="domain"></edit-basic>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import EditBasic from './loan.in.basic.vue';
  import {StockLoanInApi} from './api';

  export default {
    name: 'InEditor',
    mixins: [Edit],
    components: {EditBasic},
    data() {
      return {
        api: StockLoanInApi,
        pk: 'stockLoanInId'
      };
    },
  };
</script>