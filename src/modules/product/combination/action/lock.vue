<template>
  <el-dialog title="锁定库存" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm" inline>
      <el-form-item label="仓库" prop="virtualWarehouseId">
        <virtual-warehouse-selector
            v-model="domain.virtualWarehouseId"></virtual-warehouse-selector>
      </el-form-item>
      <el-form-item label="锁定数量" prop="quantity">
        <el-input-number v-model="domain.quantity" min="1"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Placeholders, ValidateRules} from '@/libs/util';
  import {VirtualWarehouseSelector} from '@/modules/selector';

  export default {
    components: {VirtualWarehouseSelector},
    mixins: [Edit],
    data() {
      return {
        Placeholders,
        rules: {
          virtualWarehouseId: ValidateRules.required,
          quantity: ValidateRules.required
        }
      };
    },
    methods: {
      doSave() {
        // SkuApi.lockCombination(this.domain).then(this.confirm);
      }
    }
  };
</script>