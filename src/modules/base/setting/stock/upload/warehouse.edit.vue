<template>
  <el-dialog title="编辑" width="400px" :visible.sync="visible">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="仓库" prop="virtualWarehouseId">
        <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                    :virtual-warehouse-name.sync="domain.virtualWarehouseName"></virtual-warehouse-selector>
      </el-form-item>
      <el-form-item label="上传比例" prop="ratio">
        <el-input v-model.number="domain.ratio" :min="1" :max="500">
          <template slot="suffix">%</template>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {VirtualWarehouseSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    components: {VirtualWarehouseSelector},
    data() {
      return {
        domain: {},
        visible: false,
        rules: {
          virtualWarehouseId: ValidateRules.required,
          ratio: ValidateRules.requiredNumber
        }
      };
    },
    methods: {
      show(warehouse, done) {
        this.done = done;
        this.domain = warehouse;
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
