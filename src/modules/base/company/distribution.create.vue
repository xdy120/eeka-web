<template>
  <el-dialog title="分配角色" :visible.sync="visible" width="600px" :before-close="dialogCloseConfirm">
    <el-card>
      <el-container>
        <el-main>
          <el-transfer
              filterable
              filter-placeholder="请输入角色名称"
              v-model="selectRoles"
              :props="{
                              key: 'roleId',
                              label: 'roleName'
                            }"
              :titles="['可选', '已选']"
              :data="roles">
          </el-transfer>
        </el-main>
      </el-container>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="distributionRoleSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {RoleApi, RoleUserApi} from '../role/api';

  export default {
    name: 'DistributionRole',
    mixins: [Edit],
    components: {},
    props: {},
    data() {
      return {
        pk: 'roleUserId',
        api: RoleUserApi,
        roles: [],
        selectRoles: [],
        selectOldRoles: [],
        userId: ''
      };
    },
    methods: {
      show(userId) {
        this.userId = userId;
        this.loadRoleInit();
        this.loadRoleUser(userId)
        this.visible = true;
      },
      //加载所有角色
      loadRoleInit() {
        RoleApi.list({page: 1, pageSize: 100}).then(response => {
          this.roles = response.data;
        });
      },
      //加载该用户下的所有角色
      loadRoleUser(userId) {
        this.selectRoles = [],
            RoleUserApi.list(userId).then(response => {
              response.forEach(item => {
                this.selectRoles.push(item.roleId);
              });
            });
      },
      distributionRoleSubmit() {
        let roleUsers = [];
        if (this.selectRoles.length === 0) {
          roleUsers.push({roleId: 0, userId: this.userId});
        } else {
          for (let roleId of this.selectRoles) {
            roleUsers.push({roleId: roleId, userId: this.userId});
          }
        }
        RoleUserApi.batch(roleUsers).then(r => {
          this.$message.success('角色分配成功');
          this.visible = false;
        });
      },
    },
  };
</script>