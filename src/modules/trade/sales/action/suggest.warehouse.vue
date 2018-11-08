<template>
  <el-dialog title="设置推荐仓库" :visible.sync="visible" width="400px">
    <el-form ref="editForm" :model="domain" :rules="rules">
      <el-form-item label="仓库" prop="warehouseId">
        <el-select v-model="domain.warehouse" placeholder="请选择" value-key="virtualWarehouseId"
                   @change="selectedItemChange">
          <el-option
              v-for="item in list"
              :key="item.virtualWarehouseId"
              :label="item.virtualWarehouseName"
              :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <batch-processor ref="batchProcessor" @finish="ok"></batch-processor>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {StoreApi} from '@/modules/base';
  import {StockDispatchStrategyApi} from '@/modules/base/setting';

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
        store: null,
        stockStrategy: null,
        list: [],
        rules: {
          virtualWarehouseId: ValidateRules.required
        }
      };
    },
    methods: {
      selectedItemChange(item) {
        this.domain.warehouseId = item.warehouseId;
        this.domain.warehouseName = item.warehouseName;
        this.domain.virtualWarehouseId = item.virtualWarehouseId;
        this.domain.virtualWarehouseName = item.virtualWarehouseName;
      },
      show(order) {
        let storeId;
        if (Array.isArray(order)) {
          this.orders = order;
          storeId = this.orders[0].storeId;
          if (this.orders.some(x => x.storeId !== storeId)) {
            this.$message.warning('批量设置建议仓库时必须是相同店铺的订单');
            return;
          }
        } else {
          this.order = order;
          storeId = this.order.storeId;
        }
        this.domain = {};
        this.list = [];
        this.visible = true;
        StoreApi.get(storeId).then(store => {
          this.store = store;
          StockDispatchStrategyApi.get(store.setting.stockStrategy).then(setting => {
            this.stockStrategy = JSON.parse(setting.settingJson);
            this.stockStrategy.warehouses.forEach(warehouse => {
              this.list.push(warehouse);
            });
          });
        });
      },
      doSave() {
        SalesOrderApi.suggestWarehouse(this.domain).then(this.confirm);
      },
      doBatch() {
        this.$refs.editForm.validate().then(() => {
          let domain = this.domain;
          let list = this.orders.map(function (item) {
            return {
              salesOrderId: item.salesOrderId,
              salesOrderCode: item.salesOrderCode,
              version: item.version,
              warehouseId: domain.warehouseId,
              warehouseName: domain.warehouseName,
              virtualWarehouseId: domain.virtualWarehouseId,
              virtualWarehouseName: domain.virtualWarehouseName
            };
          });
          this.$refs.batchProcessor.show('订单批量设置推荐仓库', 'salesOrderCode', list,
            item => SalesOrderApi.suggestWarehouse(item));
        });
      },
      ok() {
        this.$emit('change');
        this.close();
      }
    }
  };
</script>
