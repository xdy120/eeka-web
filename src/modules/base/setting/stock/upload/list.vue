<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form @submit.native.prevent="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector v-model="filter.storeId"></store-selector>
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
      <el-button @click="showEditor()">新增</el-button>
    </el-header>
    <el-container>
      <el-main v-resize="mainHeight">
        <el-table ref="dataTable" :data="list" :height="mainHeight"
                  @current-change="currentRowChange">
          <el-table-column prop="stockUploadStrategyName" label="策略名称" width="150"/>
          <el-table-column prop="mallWarehouse" label="商城区域仓" width="100"></el-table-column>
          <el-table-column prop="storeName" label="店铺名称" width="150"></el-table-column>
          <el-table-column prop="setting.brandNames" label="品牌"></el-table-column>
          <el-table-column label="自动上传" width="100" align="center">
            <template slot-scope="scope">
              <span class="success" v-if="scope.row.autoUpload">已启用</span>
              <span class="danger" v-else>已禁用</span>
              <go-toggle :value="scope.row.autoUpload"
                         @change="toggleAutoUpload(scope.row)"></go-toggle>
            </template>
          </el-table-column>
          <el-table-column label="手工上传" width="100" align="center">
            <template slot-scope="scope">
              <span class="success" v-if="scope.row.manualUpload">已启用</span>
              <span class="danger" v-else>已禁用</span>
              <go-toggle :value="scope.row.manualUpload"
                         @change="toggleManualUpload(scope.row)"></go-toggle>
            </template>
          </el-table-column>
          <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
          <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <go-add-button @click="addWarehouse(scope.row)" tooltip="新增上传仓库"></go-add-button>
              <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
              <go-delete-button @click="remove(scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
        <upload-editor ref="editor" @ok="search"></upload-editor>
      </el-main>
      <el-aside width="400px" style="padding-left: 5px">
        <el-table :data="warehouses" :height="mainHeight">
          <el-table-column prop="virtualWarehouseName" label="仓库名称"/>
          <go-quantity-column label="上传比例" width="80">
            <template slot-scope="scope">
              {{scope.row.ratio}}%
            </template>
          </go-quantity-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <go-modify-button @click="modifyWarehouseRatio(scope.row)"></go-modify-button>
              <go-delete-button @click="removeWarehouse(scope.row)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
        <upload-warehouse-editor ref="warehouseEditor"></upload-warehouse-editor>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script>
  import {List, TableResize} from '@/libs/mixins';
  import {StockUploadStrategyApi} from '../api';
  import {StoreSelector} from '@/modules/selector';
  import UploadEditor from './edit';
  import UploadWarehouseEditor from './warehouse.edit';

  export default {
    mixins: [TableResize, List],
    components: {UploadEditor, UploadWarehouseEditor, StoreSelector},
    data() {
      return {
        pk: 'stockUploadStrategyId',
        api: StockUploadStrategyApi,
        warehouses: [],

      };
    },
    watch: {
      selectedItem(val) {
        this.warehouses = val ? val.setting.warehouses : [];
      }
    },
    created() {
      this.search();
    },
    methods: {
      thenSearch(response) {
        if (response.length > 0) {
          response.forEach(x => {
            x.setting = JSON.parse(x.settingJson);
          });
        }
      },
      addWarehouse(us) {
        this.$refs.warehouseEditor.show({}, w => {
          us.setting.warehouses.push(w);
          this.modifySetting(us);
        });
      },
      modifyWarehouseRatio(warehouse, index) {
        this.$refs.warehouseEditor.show(warehouse, w => {
          this.selectedItem.setting.warehouses[index] = w;
          this.modifySetting(this.selectedItem);
        });
      },
      removeWarehouse(index) {
        this.$confirm('删除后不可恢复，是否删除？').then(() => {
          this.warehouses.splice(index, 1);
          this.selectedItem.setting.warehouses = this.warehouses;
          this.modifySetting(this.selectedItem);
        });
      },
      toggleAutoUpload(us) {
        us.autoUpload = !us.autoUpload;
        StockUploadStrategyApi.modify(us.stockUploadStrategyId, us).then(this.search);
      },
      toggleManualUpload(us) {
        us.manualUpload = !us.manualUpload;
        StockUploadStrategyApi.modify(us.stockUploadStrategyId, us).then(this.search);
      },
      modifySetting(us) {
        us.settingJson = JSON.stringify(us.setting);
        StockUploadStrategyApi.modify(us.stockUploadStrategyId, us).then(this.showSuccess);
      }
    }
  };
</script>
