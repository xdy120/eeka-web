<template>
  <el-container>
    <el-main>
      <el-container>
        <el-card style="height: calc(100% - 5px);;overflow: auto"
                 body-style="height: calc(100% - 20px);padding:5px;">
          <el-tree :data="treeData" :props="defaultProps" lazy node-key="nodeKey"
                   :default-expanded-keys="['0']" ref="tree"
                   @node-click="loadUser" :load="loadDepartmentChildren"
                   :render-content="treeItemRender"></el-tree>
        </el-card>
        <el-main>
          <el-card style="height: calc(100% - 5px);margin-left: 5px"
                   body-style="height: calc(100% - 20px);padding:10px">
            <el-container>
              <el-header class="oms-search" height="35px">
                <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-form-item label="员工姓名">
                        <el-input v-model="filter.userName" placeholder="支持右侧模糊匹配"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="登录名">
                        <el-input v-model="filter.loginName" placeholder="支持右侧模糊匹配"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="电话">
                        <el-input v-model="filter.telephone" placeholder="支持右侧模糊匹配"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="手机">
                        <el-input v-model="filter.mobile" placeholder="支持右侧模糊匹配"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-header>
              <el-header style="height: 41px">
                <el-row class="warp">
                  <el-col :span="24" class="button-main">
                    <section class="table-container">
                      <el-button-group>
                        <go-search-button @click="clickSearch">搜索</go-search-button>
                        <go-clean-button @click="reset">清空</go-clean-button>
                      </el-button-group>
                      <el-button @click="showUser()">新增用户</el-button>
                    </section>
                  </el-col>
                </el-row>
              </el-header>
              <el-main v-resize="mainHeight">
                <el-table :data="list" :height="mainHeight">
                  <el-table-column type="index" label="序号" width="60"></el-table-column>
                  <el-table-column prop="loginName" label="登录名"></el-table-column>
                  <el-table-column prop="userName" label="姓名"></el-table-column>
                  <el-table-column prop="nickname" label="昵称"></el-table-column>
                  <el-table-column prop="telephone" label="电话" width="150"></el-table-column>
                  <el-table-column prop="mobile" label="手机" width="150"></el-table-column>
                  <el-table-column prop="departmentName" label="部门名称" width="150"></el-table-column>
                  <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
                  <go-enable-column></go-enable-column>
                  <el-table-column label="操作" width="250px" fixed="right">
                    <template slot-scope="scope">
                      <go-tooltip-button tooltip="分配角色"
                                         @click="distributionRoleDialog(scope.row.userId)"></go-tooltip-button>
                      <go-modify-button @click="showUser(scope.row)"></go-modify-button>
                      <go-toggle :value="scope.row.enable"
                                 @change="toggleEnable(scope.row)"></go-toggle>
                      <go-delete-button @click="removeUser(scope.row)"></go-delete-button>
                      <go-tooltip-button tooltip="初始化密码" color="danger"
                                         @click="initPassword(scope.row)"></go-tooltip-button>
                      <log-popover module-name="BASE_USER" :bizId="scope.row.userId"></log-popover>
                    </template>
                  </el-table-column>
                </el-table>
              </el-main>
              <el-footer height>
                <el-pagination :total="total" :page-size="paging.pageSize"
                               :current-page.sync="paging.page" @current-change="search"
                               @size-change="pageSizeChange"></el-pagination>
              </el-footer>
            </el-container>
          </el-card>
        </el-main>
      </el-container>
    </el-main>
    <!--公司界面-->
    <company-creator ref="company" @ok="ok"></company-creator>
    <!--部门界面-->
    <department-creator ref="department" @ok="ok"></department-creator>
    <!--用户界面-->
    <user-creator ref="creator" @ok="loadUser(currentDepartment)"></user-creator>
    <!--角色授权-->
    <distribution-role ref="role"></distribution-role>
  </el-container>
</template>

<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {CompanyApi, DepartmentApi, UserApi} from './api';
  import {LogPopover} from '@/component/log';
  import {Assert} from '@/libs/util';
  import UserCreator from './user.create.vue';
  import DepartmentCreator from './department.create.vue';
  import CompanyCreator from './company.create.vue';
  import DistributionRole from './distribution.create.vue';

  export default {
    mixins: [TableResize, List, PageList],
    components: {LogPopover, UserCreator, DepartmentCreator, CompanyCreator, DistributionRole},
    props: {},
    data() {
      return {
        api: UserApi,
        pk: 'userId',
        defaultProps: {
          children: 'children',
        },
        treeData: [{companyName: '组织结构', nodeKey: 0}],
        currentDepartment: {},//当前选中部门
      };
    },
    created() {
      this.search();
    },
    methods: {
      showCompanyDialog(row) {
        this.$refs.company.show(row);
      },
      showUser(row) {
        if (row) {
          this.$refs.creator.show(row);
        } else {
          if (Assert.isEmpty(this.currentDepartment)) {
            this.$message.error('请先选择部门');
            return null;
          } else {
            this.$refs.creator.show(this.currentDepartment);
          }
        }
      },
      showDepartmentDialog(row) {
        this.$refs.department.show(row);
      },
      showAddDepartmentDialog(row) {
        this.$refs.department.add(row);
      },
      add(data) {
        if (data.companyName === '组织结构') {
          this.showCompanyDialog(data);
        } else {
          this.showAddDepartmentDialog(data);
        }
      },
      edit(data) {
        if (data.companyCode) {
          this.showCompanyDialog(data);
        } else {
          this.showDepartmentDialog(data);
        }
      },
      remove(data) {
        if (data.companyCode) {
          DepartmentApi.getByCompany(data.companyId).then(response => {
            if (response > 0) {
              this.$message.error('不能删除，还有部门信息');
              return null;
            } else {
              this.companyDelete(data);
            }
          });
        } else {
          DepartmentApi.get(data.departmentId).then(response => {
            if (response.childrenQuantity > 0) {
              this.$message.error('不能删除，还有部门信息');
              return null;
            } else {
              UserApi.getByDepartment(data.departmentId).then(response => {
                if (response > 0) {
                  this.$message.error('不能删除，还有用户信息');
                  return null;
                } else {
                  this.departmentDelete(data);
                }
              });
            }
          });
        }
      },
      removeUser(data) {
        this.$confirm('删除后不可恢复，是否删除？').then(() => {
          UserApi.remove(data.userId).then(this.search);
        });
      },
      loadDepartmentChildren(node, resolve) {
        if (node.level === 0) {
          //加载根节点
          resolve(this.treeData);
        } else if (node.level === 1) {
          //展示公司
          CompanyApi.listCompanies().then(response => {
            response.forEach(x => x.nodeKey = x.companyId);
            resolve(response);
          });
        } else if (node.level === 2) {
          //展示第一级机构
          DepartmentApi.listByCompany(node.data.companyId).then(response => {
            response.forEach(x => x.nodeKey = x.departmentId);
            resolve(response);
          });
        } else {
          //展示机构下的子机构
          DepartmentApi.listChildren(node.data.departmentId).then(response => {
            response.forEach(x => x.nodeKey = x.departmentId);
            resolve(response);
          });
        }
      },
      treeItemRender(h, {node, data}) {
        return h('div', {class: 'oms-tree-node'}, [
          h('div', {class: 'oms-tree-text'}, [h('i', {
            'class': node.level < 3 ? 'el-icon-oms-company'
              : 'el-icon-oms-deptment',
            style: 'margin-right: 5px'
          }), h('nobr', node.level < 3 ? data.companyName : data.departmentName)]),
          h('div', {class: 'oms-tree-action'},
            [node.level < 100 ?
              h('go-add-button', {
                props: {iconVisible: true, textVisible: false},
                on: {click: () => this.add(data)}
              }) : null, node.level > 1 ?
              h('go-modify-button', {
                props: {iconVisible: true, textVisible: false},
                on: {click: () => this.edit(data)}
              }) : null, node.level > 1 ?
              h('go-delete-button', {
                props: {iconVisible: true, textVisible: false},
                on: {click: () => this.remove(data)}
              }) : null])
        ]);
      },
      departmentDelete(data) {
        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DepartmentApi.remove(data.departmentId).then(r => {
            this.$message.success('删除部门成功');
            this.ok(data);
          });
        });
      },
      companyDelete(data) {
        this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CompanyApi.remove(data.companyId).then(response => {
            if (response !== null) {
              this.$message.success('删除公司成功');
              data = {};
              this.ok(data);
            }
          });
        });
      },
      enable(row) {
        if (!row.enable) {
          UserApi.enable(row.userId).then(() => {
            this.$message.success('启用成功');

          });
        } else {
          UserApi.disable(row.userId).then(() => {
            this.$message.success('禁用成功');
          });
        }
      },
      loadUser(data) {
        if (data.departmentId) {
          this.filter.departmentId = data.departmentId;
          this.currentDepartment = data;
        } else {
          this.filter.departmentId = null;
          this.currentDepartment = null;
        }
        UserApi.list(this.filter, this.paging).then(response => {
          this.list = response.data;
          this.total = response.total;
        });
      },
      distributionRoleDialog(userId) {
        this.$refs.role.show(userId);
      },
      reloadDepartmentsChildren(key, response) {
        this.$refs.tree.updateKeyChildren(key, response);
      },
      ok(data) {
        if (data.parentId) {
          if (data.parentId === '0') {
            //公司下第一个机构
            DepartmentApi.listByCompany(data.companyId).then(response => {
              response.forEach(x => x.nodeKey = x.departmentId);
              this.reloadDepartmentsChildren(data.companyId, response);
            });
          } else {
            //机构下的子机构
            DepartmentApi.listChildren(data.parentId).then(response => {
              response.forEach(x => x.nodeKey = x.departmentId);
              this.reloadDepartmentsChildren(data.parentId, response);
            });
          }
        } else if (data.companyId) {
          //公司下第一个机构
          DepartmentApi.listByCompany(data.companyId).then(response => {
            response.forEach(x => x.nodeKey = x.departmentId);
            this.reloadDepartmentsChildren(data.companyId, response);
          });
        } else {
          //根节点下的公司
          CompanyApi.listCompanies().then(response => {
            response.forEach(x => x.nodeKey = x.companyId);
            this.reloadDepartmentsChildren(0, response);
          });
        }

      },
      initPassword(data) {
        this.$confirm('请确定是否初始化密码？').then(() => {
          UserApi.initPassword(data.userId).then(() => {
            this.$message.success('初始化密码成功！');
            this.search();
          });
        });
      }
    },
  };
</script>
<style>
  .oms-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-tree {
    overflow-x: auto;
    height: 100%
  }

  .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block !important;
  }
</style>