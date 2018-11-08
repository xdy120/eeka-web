<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="filter.roleName" placeholder="角色名称"
                    @keyup.enter.native="clickSearch"></el-input>
        </el-col>
      </el-row>
    </el-header>
    <el-header class="oms-action">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="showCreator()">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-table :data="list" :height="mainHeight">
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="200"></el-table-column>
        <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <go-delete-button @click="remove(scope.row)"></go-delete-button>
            <log-popover module-name="BASE_ROLE" :bizId="scope.row.roleId"></log-popover>
            <el-button type="text" @click="menuPrivilege(scope.row.roleId)">菜单权限</el-button>
            <el-button type="text" @click="storePrivilege(scope.row.roleId)">店铺权限</el-button>
            <el-button type="text" @click="warehousePrivilege(scope.row.roleId)">仓库权限</el-button>
            <!--<el-button type="text" @click="supplierPrivilege(scope.row.roleId)">供应商</el-button>-->
            <!--<el-button type="text" @click="distributorPrivilege(scope.row.roleId)">分销商</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer :height="32" style="padding: 0">
      <el-pagination :total="total" :page-size="paging.pageSize" :current-page.sync="paging.page"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <!--角色新增 修改-->
    <role-creator ref="creator" @ok="search"></role-creator>
    <!--基础权限界面-->
    <menu-privilege ref="menu" @ok="search"></menu-privilege>
    <!--店铺权限界面-->
    <store-privilege ref="store" @ok="search"></store-privilege>
    <!--仓库权限界面-->
    <warehouse-privilege ref="warehouse" @ok="search"></warehouse-privilege>
    <!--分销商权限界面-->
    <!--<distributor-privilege ref="distributor" @ok="search"></distributor-privilege>-->
    <!--供应商权限-->
    <!--<supplier-privilege ref="supplier"></supplier-privilege>-->
  </el-container>
</template>

<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {RoleApi} from './api';
  import {LogPopover} from '@/component/log';
  import RoleCreator from './create.vue';
  import MenuPrivilege from './menu.privilege.vue';
  import StorePrivilege from './store.privilege.vue';
  import WarehousePrivilege from './warehouse.privilege.vue';
  import DistributorPrivilege from './distributor.privilege.vue';
  import SupplierPrivilege from './supplier.privilege.vue';

  export default {
    name: 'Role',
    mixins: [TableResize, List, PageList],
    components: {
      WarehousePrivilege, DistributorPrivilege, SupplierPrivilege,
      MenuPrivilege, StorePrivilege,
      LogPopover, RoleCreator
    },
    props: {},
    data() {
      return {
        api: RoleApi,
        pk: 'roleId',
      };
    },
    created() {
      this.search();
    },
    methods: {
      menuPrivilege(id) {
        if (this.$refs.menu) {
          this.$refs.menu.show(id);
        }
      },
      storePrivilege(id) {
        if (this.$refs.store) {
          this.$refs.store.show(id);
        }
      },
      warehousePrivilege(id) {
        if (this.$refs.warehouse) {
          this.$refs.warehouse.show(id);
        }
      },
      supplierPrivilege(id) {
        if (this.$refs.supplier) {
          this.$refs.supplier.show(id);
        }
      },
      distributorPrivilege(id) {
        if (this.$refs.distributor) {
          this.$refs.distributor.show(id);
        }
      },
    },
  };
</script>