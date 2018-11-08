<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="仓库" prop="virtualWarehouseId">
        <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                    :virtual-warehouse-name.sync="domain.virtualWarehouseName"
                                    :warehouse-id.sync="domain.warehouseId"
                                    :warehouse-name.sync="domain.warehouseName"></virtual-warehouse-selector>
      </el-form-item>
      <el-form-item label="配货类型" prop="dispatchType">
        <enum-selector v-model.number="domain.dispatchType"
                       enum-name="WarehouseDispatchType"></enum-selector>
      </el-form-item>
      <el-form-item label="优先级" prop="priorityNo">
        <el-input-number v-model.number="domain.priorityNo" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="快递策略" prop="expressStrategyId">
        <express-strategy-selector v-model="domain.expressStrategyId"
                                   :express-strategy-name.sync="domain.expressStrategyName"></express-strategy-selector>
      </el-form-item>
      <el-form-item label="预包装" prop="prepackageType">
        <enum-selector v-model.number="domain.prepackageType"
                       enum-name="PrepackageType"></enum-selector>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {ExpressStrategySelector, VirtualWarehouseSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    components: {VirtualWarehouseSelector, ExpressStrategySelector},
    data() {
      return {
        domain: {},
        visible: false,
        rules: {
          virtualWarehouseId: ValidateRules.required,
          dispatchType: ValidateRules.required,
          priorityNo: ValidateRules.requiredNumber,
          expressStrategyId: ValidateRules.required,
          prepackageType: ValidateRules.required
        }
      };
    },
    methods: {
      show(warehouse, done) {
        this.done = done;
        this.domain = warehouse ? warehouse : {priorityNo: 1, prepackageType: 'ALL'};
        this.visible = true;
      },
      save() {
        this.$refs.editForm.validate().then(() => {
          if (this.done) {
            this.done(this.domain);
          } else {
            this.$emit('ok', this.domain);
          }
          this.visible = false;
        });
      }
    }
  };
</script>
