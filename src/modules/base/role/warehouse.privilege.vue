<template>
  <el-dialog title="分配仓库权限" :visible.sync="visible" :close-on-click-modal="false" width="600px"
             :before-close="dialogCloseConfirm">

    <div style="text-align: center">
      <el-transfer style="text-align: left; display: inline-block;" v-model="select"
                   :props="transferProps" :titles="titles" filterable
                   :data="warehouses"></el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="submit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {PrivilegeApi} from './api';
  import {VirtualWarehouseApi} from '../warehouse/api';

  export default {
    name: 'WarehousePrivilege',
    components: {},
    props: {},
    data() {
      return {
        warehouses: [],
        select: [],
        visible: false,
        currentId: '',
        titles: ['未授权仓库', '已授权仓库'],
        transferProps: {
          key: 'virtualWarehouseId',
          label: 'virtualWarehouseName'
        }
      };
    },
    methods: {
      show(id) {
        this.select = [];
        this.currentId = id;
        //加载仓库信息
        VirtualWarehouseApi.listEffective().then(response => {
          this.warehouses = response;
          PrivilegeApi.list({roleId: this.currentId, privilegeType: 'WAREHOUSE'}).then(response => {
            response.forEach(item => {
              this.select.push(item.itemId);
            });
          });
        });
        this.visible = true;
      },
      submit() {
        let warehousePrivileges = [];
        if (this.select.length === 0) {
          warehousePrivileges.push({roleId: this.currentId, itemId: 0, privilegeType: 'WAREHOUSE'});
        } else {
          for (let warehouseId of this.select) {
            warehousePrivileges.push({
              roleId: this.currentId,
              itemId: warehouseId,
              privilegeType: 'WAREHOUSE'
            });
          }
        }
        PrivilegeApi.saveRolePrivilege(this.currentId, warehousePrivileges).then(response => {
          this.$message.success('仓库权限分配成功');
          this.visible = false;
        });
      },
    }
  };
</script>