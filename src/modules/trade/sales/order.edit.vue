<template>
  <el-dialog title="订单修改" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <sales-order-basic ref="orderBasic" v-model="domain"></sales-order-basic>
    <div slot="footer" class="dialog-footer">
      <el-button @click="ok">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {SalesOrderApi} from './api';
  import SalesOrderBasic from './order.basic.vue';

  export default {
    name: 'SalesOrderEditor',
    components: {SalesOrderBasic},
    data() {
      return {
        visible: false,
        domain: {},
      };
    },
    methods: {
      show(order) {
        SalesOrderApi.get(order.salesOrderId).then(data => {
          this.domain = data;
          this.visible = true;
        });
      },
      ok() {
        this.$refs.orderBasic.validate().then(() => {
          SalesOrderApi.modify(this.domain.salesOrderId, this.domain).then(() => {
            this.$emit('ok', this.domain);
            this.visible = false;
          });
        });
      }
    }
  };
</script>