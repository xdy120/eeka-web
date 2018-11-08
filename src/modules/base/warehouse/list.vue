<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form :model="filter" @keyup.enter.native="clickSearch" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="实体仓编码">
              <el-input v-model="filter.warehouseCodes" placeholder="支持多个查询，英文逗号隔开"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实体仓名称">
              <el-input v-model="filter.warehouseName" placeholder="支持右侧模糊匹配"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实体仓类型">
              <enum-selector v-model="filter.warehouseType"
                             enum-name="WarehouseType"></enum-selector>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-header class="oms-action" height="35px">
      <el-button-group>
        <go-search-button @click="clickSearch">搜索</go-search-button>
        <go-clean-button @click="reset">清空</go-clean-button>
      </el-button-group>
      <el-button @click="showCreator">新增</el-button>
    </el-header>
    <el-main v-resize="mainHeight">
      <el-container>
        <el-aside width="800px">
          <el-table :data="list" row-key="id" :height="mainHeight"
                    @current-change="selectedChanged">
            <el-table-column prop="warehouseCode" label="实体仓编码" sortable
                             width="120px"></el-table-column>
            <el-table-column prop="warehouseName" label="实体仓名称"></el-table-column>
            <go-enum-column prop="warehouseType" enum-name="WarehouseType" label="实体仓类型"
                            width="80px"></go-enum-column>
            <go-enable-column></go-enable-column>
            <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <go-add-button tooltip="新增虚拟仓" @click="showVirDialog(scope.row)"></go-add-button>
                <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
                <el-button type="text" @click="region(scope.row)">范围</el-button>
                <go-toggle :value="scope.row.enable" @change="toggleEnable(scope.row)"></go-toggle>
              </template>
            </el-table-column>
          </el-table>

        </el-aside>
        <el-main style="margin-left:10px">
          <el-table :data="virtualList" :height="mainHeight">
            <el-table-column prop="virtualWarehouseCode" label="虚拟仓编码" width="120px"
                             sortable></el-table-column>
            <el-table-column prop="virtualWarehouseName" label="虚拟仓名称"></el-table-column>
            <go-enum-column prop="virtualWarehouseType" label="虚拟仓类型"
                            enum-name="VirtualWarehouseType" width="80px"></go-enum-column>
            <go-enable-column></go-enable-column>
            <el-table-column label="操作" width="80px" fixed="right">
              <template slot-scope="scope">
                <go-modify-button @click="showVirDialog(scope.row)"></go-modify-button>
                <go-toggle :value="scope.row.enable" @change="toggleVirtual(scope.row)"></go-toggle>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-main>
    <el-footer height="35px">
      <el-pagination :current-page.sync="paging.page" :page-size="paging.pageSize" :total="total"
                     @current-change="search" @size-change="pageSizeChange"></el-pagination>
    </el-footer>
    <warehouse-creator ref="creator" @ok="search"></warehouse-creator>
    <virtual-warehouse-creator ref="virtual" @ok="searchVirtual"></virtual-warehouse-creator>
    <region ref="region"></region>
  </el-container>
</template>

<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {DataDictItemSelector} from '@/modules/selector';
  import {VirtualWarehouseApi, WarehouseApi} from './api';
  import WarehouseCreator from './warehouse.creater.vue';
  import VirtualWarehouseCreator from './virtual.warehouse.create.vue';
  import Region from './region.vue';

  export default {
    name: 'warehouse',
    mixins: [TableResize, List, PageList],
    components: {
      Region,
      DataDictItemSelector,
      WarehouseCreator,
      VirtualWarehouseCreator
    },
    props: {},
    data() {
      return {
        api: WarehouseApi,
        pk: 'warehouseId',
        virtualList: [],
        virtualFilter: {},
      };
    },
    created() {
      this.search();
    },
    methods: {
      showVirDialog(row) {
        VirtualWarehouseApi.list({warehouseId: row.warehouseId}).then(data => {
          this.virtualList = data;
          this.$refs.virtual.show(row, this.virtualList);
        });
      },
      searchVirtual() {
        VirtualWarehouseApi.list(this.virtualFilter).then(data => {
          this.virtualList = data;
        });
      },
      selectedChanged(row) {
        if (row) {
          this.virtualFilter.warehouseId = row.warehouseId;
          this.form = row;
          this.searchVirtual();
        } else {
          this.virtualList=[];
        }
      },
      region(row) {
        if (this.$refs.region) {
          this.$refs.region.show(row);
        }
      },
      toggleVirtual(row) {
        if (!row.enable) {
          VirtualWarehouseApi.enable(row.virtualWarehouseId).then(() => {
            this.$message.success('启用成功');
            row.enable = true;
          });
        } else {
          VirtualWarehouseApi.disable(row.virtualWarehouseId).then(() => {
            this.$message.success('禁用成功');
            row.enable = false;
          });
        }
      }
    },
  };
</script>