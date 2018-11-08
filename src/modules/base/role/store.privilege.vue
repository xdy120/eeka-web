<template>
  <el-dialog title="分配店铺权限" :visible.sync="visible" width="600px"
             :before-close="dialogCloseConfirm">
    <div style="text-align: center">
      <el-transfer style="text-align: left; display: inline-block;" v-model="select" :props="props"
                   :titles="titles" filterable :data="stores"></el-transfer>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="storePrivilegeSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {PrivilegeApi} from './api';
  import {MenuOperationApi} from '@/modules/admin/';
  import {StoreApi} from '../store/api';

  export default {
    name: 'storePrivilege',
    components: {},
    props: {},
    data() {
      return {
        stores: [],
        select: [],
        visible: false,
        currentId: '',
        titles: ['未授权店铺', '已授权店铺'],
        props: {
          key: 'storeId',
          label: 'storeName'
        }
      };
    },
    methods: {
      show(id) {
        this.select = [];
        this.currentId = id;
        StoreApi.listEffective().then(response => {
          this.stores = response;
          PrivilegeApi.list({roleId: this.currentId, privilegeType: 'STORE'}).then(response => {
            response.forEach(item => {
              this.select.push(item.itemId);
            });
          });
        });
        this.visible = true;
      },
      storePrivilegeSubmit() {
        let storePrivileges = [];
        if (this.select.length === 0) {
          storePrivileges.push({roleId: this.currentId, itemId: 0, privilegeType: 'STORE'});
        } else {
          for (let storeId of this.select) {
            storePrivileges.push({roleId: this.currentId, itemId: storeId, privilegeType: 'STORE'});
          }
        }
        PrivilegeApi.saveRolePrivilege(this.currentId, storePrivileges).then(() => {
          this.$message.success('店铺权限分配成功');
          this.visible = false;
        });
      },
    }
  };
</script>