<template>
  <el-dialog title="设置推荐快递" :visible.sync="visible" width="400px">
    <el-form ref="editForm" :model="domain">
      <el-form-item label="快递" prop="expressId">
        <el-select v-model="domain.express" placeholder="请选择" value-key="expressId"
                   @change="selectedItemChange" @clear="clearExpress">
          <el-option
              v-for="item in list"
              :key="item.expressId"
              :label="item.expressName"
              :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号">
        <el-input v-model="domain.expressNo"></el-input>
      </el-form-item>
    </el-form>
    <batch-processor ref="batchProcessor" @finish="ok"></batch-processor>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {StockDispatchStrategyApi} from '@/modules/base/setting';

  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {SalesOrderApi} from '../api';
  import OrderActionMixin from './mixin';
  import {BatchProcessor} from '@/component/ui';
  import {ExpressStrategyApi} from '@/modules/base/setting/express/api';

  export default {
    mixins: [Edit, OrderActionMixin],
    components: {BatchProcessor, ExpressStrategyApi},
    data() {
      return {
        store: null,
        stockStrategy: null,
        list: [],
        expressStrategy: null
      };
    },
    methods: {
      clearExpress() {
        this.domain.express = null;
        this.domain.expressId = null;
        this.domain.expressName = null;
      },
      selectedItemChange(item) {
        if (item && item !== '') {
          this.domain.expressId = item.expressId;
          this.domain.expressName = item.expressName;
        }
      },
      show(order) {
        let storeId;
        this.domain = {
          express: null
        };
        if (Array.isArray(order)) {
          this.orders = order;
          storeId = this.orders[0].storeId;
          if (this.orders.some(x => x.storeId !== storeId)) {
            this.$message.warning('批量设置建议快递时必须是相同店铺的订单');
            return;
          }
        } else {
          this.order = order;
          this.domain.expressId = this.order.suggestExpressId;
          this.domain.expressName = this.order.suggestExpressName;
          this.domain.expressNo = this.order.suggestExpressNo;
          storeId = this.order.storeId;
        }
        this.list = [];
        this.getExpresses(storeId);
      },
      getExpresses(storeId) {
        StockDispatchStrategyApi.listExpresses(storeId).then(expresses => {
          this.list.push(...expresses);
          if (this.domain.expressId) {
            this.domain.express = this.list.find(x => x.expressId === this.domain.expressId);
          }
          this.visible = true;
        });
      },
      doSave() {
        SalesOrderApi.suggestExpress(this.domain).then(this.confirm);
      },
      doBatch() {
        this.$refs.editForm.validate().then(() => {
          let domain = this.domain;
          let list = this.orders.map(function (item) {
            return {
              salesOrderId: item.salesOrderId,
              salesOrderCode: item.salesOrderCode,
              version: item.version,
              expressId: domain.expressId,
              expressName: domain.expressName,
              expressNo: domain.expressNo
            };
          });
          this.$refs.batchProcessor.show('订单批量设置推荐快递', 'salesOrderCode', list,
            item => SalesOrderApi.suggestExpress(item));
        });
      },
      ok() {
        this.$emit('change');
        this.close();
      }
    }
  };
</script>