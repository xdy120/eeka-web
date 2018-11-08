<template>
  <el-dialog title="分配供应商权限" :visible.sync="visible" width="600px"
             :before-close="dialogCloseConfirm">
    <div style="height:500px; margin:0">
      <el-transfer
          v-model="select"
          :props="{
                              key: 'supplierId',
                              label: 'supplierName'
                            }"
          :titles="['可选', '已选']"
          :data="suppliers">
      </el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="supplierPrivilegeSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {PrivilegeApi} from './api';
  import {SupplierApi} from '@/modules/purchase/index';

  export default {
    name: 'supplierPrivilege',
    components: {},
    props: {},
    data() {
      return {
        suppliers: [],
        select: [],
        visible: false,
        currentId: '',
        filter: {}
      };
    },
    methods: {
      show(id) {
        this.currentId = id;
        //加载所有店铺信息
        SupplierApi.list(this.filter, {page: 1, pageSize: 20}).then(response => {
          this.suppliers = response.data;
          PrivilegeApi.list({roleId: this.currentId, privilegeType: 'SUPPLIER'}).then(response => {
            response.forEach(item => {
              this.select.push(item.itemId);
            });
          });
        });
        this.visible = true;
      },
      supplierPrivilegeSubmit() {
        let supplierPrivileges = [];
        if (this.select.length === 0) {
          supplierPrivileges.push({roleId: this.currentId, itemId: 0, privilegeType: 'SUPPLIER'});
        } else {
          for (let supplierId of this.select) {
            supplierPrivileges.push(
              {roleId: this.currentId, itemId: supplierId, privilegeType: 'SUPPLIER'});
          }
        }
        PrivilegeApi.saveRolePrivilege(this.currentId, supplierPrivileges).then(response => {
          this.$message.success('供应商权限分配成功');
          this.visible = false;
        });
      },
    }
  };
</script>