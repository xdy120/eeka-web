<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <schedule-base ref="editForm" v-model="domain"></schedule-base>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import ScheduleBase from './base.vue';
  import {VipScheduleApi} from './api';

  export default {
    name: 'ScheduleEditor',
    mixins: [Edit],
    components: {ScheduleBase},
    data() {
      return {
        api: VipScheduleApi,
        pk: 'vipScheduleId',
      };
    },
    methods: {}
  };
</script>