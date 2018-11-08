<template>
  <el-dialog title="分配菜单操作权限" :visible.sync="visible" width="600px"
             :before-close="dialogCloseConfirm">
    <el-card>
      <div class="tree" style="height:500px;">
        <el-tree ref="menuTree" @node-contextmenu="checkedChildren" check-strictly :data="data"
                 show-checkbox node-key="itemId" :default-expanded-keys="['0']"
                 :props="defaultProps"></el-tree>
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="submit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {PrivilegeApi} from './api';
  import {MenuOperationApi} from '@/modules/admin';

  export default {
    name: 'MenuPrivilege',
    components: {},
    props: {},
    data() {
      return {
        data: [],
        select: [],
        visible: false,
        currentId: '',
        selectedNode: [],
        defaultProps: {
          children: 'children',
          label: 'itemName'
        }
      };
    },
    methods: {
      checkedChildren(e, data) {
        let nodes = this.$refs.menuTree.getCheckedNodes();
        let node = nodes.find(node=>{
          return node.itemId === data.itemId;
        });
        if (node){
          this.selectChildren(e,node,false);
        } else {
          this.selectChildren(e,data,true);
        }
      },
      selectChildren(e, data,bool){
        this.$refs.menuTree.setChecked(data, bool);
        if (data.children) {
          data.children.forEach(child => this.selectChildren(e, child,bool));
        }
      },
      show(id) {
        this.select = [];
        this.currentId = id;
        if (this.data.length === 0) {
          MenuOperationApi.listAll().then(data => {
            this.data = data;
            this.visible = true;
            this.listRolePrivilege();
          });
        } else {
          this.visible = true;
          this.listRolePrivilege();
        }
      },
      listRolePrivilege() {
        PrivilegeApi.listRolePrivilege(this.currentId, 'MODULE,MENU,MENU_ITEM,OPERATOR').then(
            response => {
              response.forEach(item => {
                this.select.push(item.itemId);
              });
              this.$refs.menuTree.setCheckedKeys(this.select);
            });
      },
      submit() {
        let selects = this.$refs.menuTree.getCheckedNodes();
        if (selects == null || selects.length === 0) {
          this.$message.warning('请选择要授权的菜单');
          return;
        }
        let privileges = [];
        selects.forEach(item => {
          let privilege = {
            itemId: item.itemId,
            itemName: item.itemName,
            roleId: this.currentId,
            privilegeType: item.itemType
          };
          privileges.push(privilege);
        });
        PrivilegeApi.saveRolePrivilege(this.currentId, privileges).then(() => {
          this.$message.success('基础权限分配成功');
          this.visible = false;
        });
      },
    }
  };
</script>