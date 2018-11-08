<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <dispatch-base ref="editForm" v-model="domain"></dispatch-base>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import DispatchBase from './base.vue';
  import {VipDispatchApi} from './api';

  export default {
    name: 'ScheduleEditor',
    mixins: [Edit],
    components: {DispatchBase},
    data() {
      return {
        api: VipDispatchApi,
        pk: 'vipDispatchId',
      };
    },
    methods: {}
  };
</script>