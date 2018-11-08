<template>
  <el-dialog title="虚拟仓" :visible.sync="visible" :before-close="dialogCloseConfirm" width="500px">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="100px"
             label-position="left">
      <el-form-item label="仓库编码" prop="virtualWarehouseCode">
        <el-input v-model="domain.virtualWarehouseCode"></el-input>
      </el-form-item>
      <el-form-item label="仓库名称" prop="virtualWarehouseName">
        <el-input v-model="domain.virtualWarehouseName"></el-input>
      </el-form-item>
      <el-form-item label="仓库类型" prop="virtualWarehouseType" v-show="!editMode">
        <enum-selector v-model="domain.virtualWarehouseType"
                       enum-name="VirtualWarehouseType"></enum-selector>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="submitVirtual()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {VirtualWarehouseApi} from './api';

  export default {
    name: 'VirtualWarehouseCreator',
    mixins: [Edit],
    data() {
      return {
        pk: 'virtualWarehouseId',
        api: VirtualWarehouseApi,
        rules: {
          virtualWarehouseCode: ValidateRules.requiredMax,
          virtualWarehouseName: ValidateRules.requiredMax,
          virtualWarehouseType: ValidateRules.required,
        },
      };
    },
    methods: {
      show(row) {
        if (row.virtualWarehouseId) {
          this.domain = row;
        } else {
          this.domain.warehouseId = row.warehouseId;
          this.domain.warehouseName = row.warehouseName;
          this.domain.virtualWarehouseType = 'EXCLUSIVE';
        }
        this.visible = true;
      },
      submitVirtual() {
        this.$refs.editForm.validate().then(() => {
          if (this.domain.virtualWarehouseId) {
            VirtualWarehouseApi.modify(this.domain.virtualWarehouseId, this.domain).then(() => {
              this.$message.success('修改成功');
              this.visible = false;
              this.$emit('ok', this.domain);
              this.close();
            });
          } else {
            VirtualWarehouseApi.add(this.domain).then(() => {
              this.$message.success('新增成功');
              this.visible = false;
              this.$emit('ok', this.domain);
              this.close();
            });
          }
        });
      },
      onClosed() {
        this.close();
      },
      close() {
        this.domain.virtualWarehouseId = null;
        this.domain.virtualWarehouseCode = null;
        this.domain.virtualWarehouseName = null;
      }
    },
  };
</script>