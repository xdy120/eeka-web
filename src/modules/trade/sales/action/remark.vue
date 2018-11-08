<template>
  <el-dialog title="电商备注" :visible.sync="visible" width="600px">
    <div>
      <el-input v-model="remark" type="textarea"></el-input>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {Edit} from '@/libs/mixins';
  import {SalesOrderApi} from '../api';

  export default {
    mixins: [Edit],
    data() {
      return {
        remark: null,
        update: {},
        visible: false
      };
    },
    methods: {
      show(entity) {
        this.domain = entity;
        this.remark = entity.remark;
        this.visible = true;
      },
      doSave() {
        this.update.salesOrderId = this.domain.salesOrderId;
        this.update.version = this.domain.version;
        this.update.remark = this.remark;
        SalesOrderApi.modifyRemark(this.update).then(() => {
          this.domain.remark = this.remark;
          this.confirm();
        });
      }
    }
  };
</script>