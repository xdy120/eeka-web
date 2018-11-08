<template>
  <el-dialog title="编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <allot-edit-basic ref="editForm" v-model="domain"></allot-edit-basic>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="save()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import AllotEditBasic from './basic.vue';
  import {AllotApi} from './api';

  export default {
    name: 'AllotEditor',
    mixins: [Edit],
    components: {AllotEditBasic},
    data() {
      return {
        api: AllotApi,
        pk: 'stockVirtualAllotId',
      };
    },
    methods: {
      doSave() {
        if (this.domain.outVirtualWarehouseName !== this.domain.inVirtualWarehouseName) {
          AllotApi.modify(this.domain.stockVirtualAllotId, this.domain).then(r => {
            this.$message.success('修改成功');
            this.close();
            this.$emit('ok', this.domain);
          });
        } else {
          this.$message.error('调入仓不能与调出仓一致');
        }
      }
    }
  };
</script>