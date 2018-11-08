<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <activity-basic ref="editForm" v-model="domain"></activity-basic>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import ActivityBasic from './base.vue';
  import {ActivityApi} from './api';

  export default {
    name: 'ActivityEditor',
    mixins: [Edit],
    components: {ActivityBasic},
    data() {
      return {
        api: ActivityApi,
        pk: 'activityId',
      };
    }
  };
</script>