<template>
  <el-dialog title="留单" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm" inline>
      <el-form-item label="留单日期" prop="holdDate">
        <go-date-picker v-model="domain.holdDate"></go-date-picker>
      </el-form-item>
    </el-form>
    <batch-processor ref="batchProcessor" @finish="ok"></batch-processor>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {SalesOrderApi} from '../api';
  import OrderActionMixin from './mixin';
  import {BatchProcessor} from '@/component/ui';

  export default {
    mixins: [Edit, OrderActionMixin],
    components: {BatchProcessor},
    data() {
      return {
        rules: {
          holdDate: ValidateRules.required
        }
      };
    },
    methods: {
      show(order) {
        if (Array.isArray(order)) {
          this.orders = order;
        } else {
          this.orders = [];
          this.order = order;
        }
        this.domain = {};
        this.visible = true;
      },
      doSave() {
        let hold = new Date(this.domain.holdDate);
        let today = new Date();
        if(hold <= today){
          this.$message.warning('留单日期必须大于当前日期');
          return;
        }
        SalesOrderApi.hold(this.domain, this.domain.holdDate).then(this.confirm);
      },
      doBatch() {
        this.$refs.editForm.validate().then(() => {
          let domain = this.domain;
          let list = this.orders.map(function (item) {
            return {
              salesOrderId: item.salesOrderId,
              salesOrderCode: item.salesOrderCode,
              version: item.version,
              holdDate: domain.holdDate
            };
          });
          this.$refs.batchProcessor.show('订单批量留单', 'salesOrderCode', list,
            item => SalesOrderApi.hold(item));
        });
      },
      ok() {
        this.$emit('ok');
        this.close();
      }
    }
  };
</script>