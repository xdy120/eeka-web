<template>
  <el-container>
    <el-header class="oms-search" height="35px">
      <el-form @submit.native.prevent="clickSearch">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="店铺">
              <store-selector @confirm="storeChange"></store-selector>
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
    <el-main v-resize="mainHeight">
      <el-table ref="dataTable" :data="list" :height="mainHeight"
                @current-change="currentRowChange">
        <el-table-column prop="stockDispatchStrategyName" label="策略名称"/>
        <el-table-column prop="mallWarehouse" label="商城区域仓" width="100"></el-table-column>
        <el-table-column prop="defaultExpressName" label="默认快递" width="100"></el-table-column>
        <el-table-column prop="defaultCodExpressName" label="默认到付快递" width="100"></el-table-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="修改时间"></go-date-time-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <go-add-button @click="addWarehouse(scope.row)" tooltip="新增配货仓库"></go-add-button>
            <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
            <go-delete-button @click="remove(scope.row)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
      <dispatch-editor ref="editor" @ok="search"></dispatch-editor>
    </el-main>
    <el-footer height="300" style="padding-top: 5px">
      <el-container>
        <el-main>
          <el-table :data="warehouses" :height="290" @current-change="currentWarehouseChange">
            <el-table-column prop="virtualWarehouseName" label="仓库名称"/>
            <go-enum-column label="配货类型" prop="dispatchType"
                            enum-name="WarehouseDispatchType"></go-enum-column>
            <go-quantity-column prop="priorityNo" label="优先级" width="80"></go-quantity-column>
            <el-table-column prop="expressStrategyName" label="快递策略"/>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <!-- <go-add-button @click="addExpress(scope.row)"></go-add-button>-->
                <go-modify-button
                    @click="modifyWarehouse(scope.row,scope.$index)"></go-modify-button>
                <go-delete-button @click="removeWarehouse(scope.$index)"></go-delete-button>
              </template>
            </el-table-column>
          </el-table>
          <dispatch-warehouse-editor ref="warehouseEditor"></dispatch-warehouse-editor>
        </el-main>
        <el-aside width="600px" style="padding-left: 5px">
          <el-table :data="expresses" :height="290">
            <el-table-column prop="expressName" label="快递名称"/>
            <go-quantity-column prop="priorityNo" label="优先级" width="80"></go-quantity-column>
            <!--<el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <go-modify-button @click="modifyExpress(scope.row)"></go-modify-button>
                    <go-delete-button @click="removeExpress(scope.$index)"></go-delete-button>
                </template>
            </el-table-column>-->
          </el-table>
          <dispatch-express-editor ref="expressEditor"></dispatch-express-editor>
        </el-aside>
      </el-container>

    </el-footer>
  </el-container>
</template>
<script>
  import {List, TableResize} from '@/libs/mixins';
  import {StockDispatchStrategyApi} from '../api';
  import {StoreSelector} from '@/modules/selector';
  import DispatchEditor from './edit';
  import DispatchWarehouseEditor from './warehouse.edit';
  import DispatchExpressEditor from './express.edit';
  import StockDispatchStrategySelector from '@/modules/base/setting/stock/dispatch/selector';
  import {ExpressStrategyApi} from '@/modules/base/setting/express/api';

  export default {
    mixins: [TableResize, List],
    components: {
      StockDispatchStrategySelector,
      DispatchEditor,
      DispatchWarehouseEditor,
      DispatchExpressEditor,
      StoreSelector,
      ExpressStrategyApi
    },
    created() {
      this.search();
    },
    data() {
      return {
        pk: 'stockDispatchStrategyId',
        api: StockDispatchStrategyApi,
        warehouses: [],
        expresses: [],
        selectedWarehouse: null,
        selectedExpress: null
      };
    },
    watch: {
      selectedItem(val) {
        this.warehouses = val ? val.setting.warehouses : [];
      }
    },
    methods: {
      storeChange(store) {
        if (store && store.settingJson) {
          let setting = JSON.parse(store.settingJson);
          this.filter.stockDispatchStrategyId = setting.stockStrategy ? setting.stockStrategy
            : null;
        }

      },
      currentWarehouseChange(warehouse) {
        if (warehouse && warehouse.expressStrategyId) {
          ExpressStrategyApi.get(warehouse.expressStrategyId).then(data => {
            if (data) {
              this.rule = JSON.parse(data.settingJson);
              this.expresses = this.rule.expresses;
            } else {
              this.expresses = [];
            }
          });
        } else {
          this.expresses = [];
        }
        this.selectedWarehouse = warehouse;
      },
      thenSearch(response) {
        if (response.length > 0) {
          response.forEach(x => {
            x.setting = JSON.parse(x.settingJson);
          });
        }
      },
      addWarehouse(us) {
        this.$refs.warehouseEditor.show(null, w => {
          us.setting.warehouses.push(w);
          this.modifySetting(us);
        });
      },
      modifyWarehouse(warehouse, index) {
        this.$refs.warehouseEditor.show(warehouse, w => {
          this.warehouses[index] = w;
          this.modifySetting(this.selectedItem);
        });
      },
      removeWarehouse(index) {
        this.$confirm('是否确认删除？').then(() => {
          this.warehouses.splice(index, 1);
          this.modifySetting(this.selectedItem);
        });
      },
      modifySetting(strategy) {
        strategy.settingJson = JSON.stringify(strategy.setting);
        StockDispatchStrategyApi.modify(strategy.stockDispatchStrategyId, strategy).then(() => {
          this.showSuccess();
          this.currentWarehouseChange(this.selectedWarehouse);
        });
      }
    }
  };
</script>
