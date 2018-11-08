<template>
  <el-dialog title="手工配货" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <el-form ref="editForm" :model="domain" :rules="rules" label-width="80px">
      <el-container>
        <el-header>
          <el-button @click="addAllDetail">添加全部</el-button>
        </el-header>
        <el-header height="250px">
          <el-container>
            <el-main>
              <el-table :data="list" ref="sourceDetailTable" height="250px"
                        @current-change="currentSourceDetailChange" @row-dblclick="addCurrentRow">
                <el-table-column prop="salesOrderCode" label="订单编号" width="150px"
                                 fixed></el-table-column>
                <el-table-column prop="productCode" label="商品编码" width="120px"></el-table-column>
                <el-table-column prop="productName" label="商品名称" width="150px"></el-table-column>
                <el-table-column prop="skuCode" label="规格编码"></el-table-column>
                <el-table-column prop="skuName" label="规格名称" width="80px"></el-table-column>
                <go-quantity-column prop="quantity" label="数量"></go-quantity-column>
                <el-table-column label="操作" fixed="right" width="80px">
                  <template slot-scope="scope">
                    <go-add-button @click="addDetail(scope.row,scope.$index)"></go-add-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-aside width="350px" style="padding-left: 5px">
              <el-table ref="stockTable" :data="stockList" :height="250"
                        @row-dblclick="addDetailByWarehouse">
                <el-table-column prop="virtualWarehouseName" label="仓库"></el-table-column>
                <go-quantity-column prop="quantity" label="库存数"></go-quantity-column>
                <go-quantity-column prop="salesQuantity" label="可销数"></go-quantity-column>
                <go-quantity-column prop="usableQuantity" label="可用数"></go-quantity-column>
              </el-table>
            </el-aside>
          </el-container>
        </el-header>
        <el-header style="padding-top: 10px;padding-bottom: 10px;" height="60px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="发货仓库" prop="virtualWarehouseId">
                <el-select v-model="selectedWarehouse" value-key="virtualWarehouseId"
                           :clearable="false">
                  <el-option
                      v-for="item in warehouseList"
                      :key="item.virtualWarehouseId"
                      :label="item.virtualWarehouseName"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发货快递" prop="expressId">
                <el-select v-model="selectedExpress" value-key="expressId" :clearable="false">
                  <el-option
                      v-for="item in expressList"
                      :key="item.expressId"
                      :label="item.expressName"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button @click="autoSelectExpress">自动匹配快递</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-container>
            <el-main>
              <el-table :data="domain.details" ref="targetDetailTable" :height="287">
                <el-table-column prop="virtualWarehouseName" label="配货仓库" width="120"
                                 fixed></el-table-column>
                <el-table-column prop="salesOrderCode" label="订单编号" width="120"
                                 fixed></el-table-column>
                <el-table-column prop="productCode" label="商品编码" width="120"></el-table-column>
                <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
                <el-table-column prop="skuCode" label="规格编码" width="120"></el-table-column>
                <el-table-column prop="skuName" label="规格名称" width="80"></el-table-column>
                <go-quantity-column prop="quantity" label="数量"></go-quantity-column>
                <el-table-column label="操作" fixed="right" width="80">
                  <template slot-scope="scope">
                    <go-delete-button
                        @click="removeDetail(scope.row,scope.$index)"></go-delete-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-aside width="350px" style="padding-left: 5px" class="oms-search">
              <el-card>
                <el-form-item label="收货人" prop="contact">
                  <el-input v-model="domain.contact"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="domain.mobile"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="telephone">
                  <el-input v-model="domain.telephone"></el-input>
                </el-form-item>
                <el-form-item label="区域" prop="districtId">
                  <region-selector :countryId.sync="domain.countryId"
                                   :provinceId.sync="domain.provinceId" :cityId.sync="domain.cityId"
                                   :districtId.sync="domain.districtId"
                                   :countryName.sync="domain.countryName"
                                   :provinceName.sync="domain.provinceName"
                                   :cityName.sync="domain.cityName"
                                   :districtName.sync="domain.districtName"></region-selector>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                  <el-input v-model="domain.address" type="textarea" :rows="2"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="domain.remark" type="textarea" :rows="2"></el-input>
                </el-form-item>
              </el-card>
            </el-aside>
          </el-container>
        </el-main>
      </el-container>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="checkStock">检查库存</el-button>
      <el-button @click="save" :disabled="isRequestSend">生成配货单</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Assert, ValidateRules} from '@/libs/util';
  import {StoreApi} from '@/modules/base';
  import {StockApi} from '@/modules/stock';
  import {StockDispatchStrategyApi} from '@/modules/base/setting';
  import {RegionSelector} from '@/modules/selector';
  import OrderActionMixin from './mixin';
  import {SalesOrderApi} from '../api';
  import {ExpressStrategyApi} from '@/modules/base/setting/express/api';

  export default {
    mixins: [Edit, OrderActionMixin],
    components: {RegionSelector, ExpressStrategyApi},
    data() {
      let validatePhone = (rule, value, callback) => {
        if (Assert.isBlank(this.domain.mobile) && Assert.isBlank(this.domain.telephone)) {
          callback(new Error('手机和电话至少填一个'));
        } else {
          callback();
        }
      };

      return {
        store: null,
        storeId: null,
        stockStrategy: null,
        list: [],
        stockList: [],
        warehouseList: [],
        expressList: [],
        selectedWarehouse: null,
        selectedExpress: null,
        currentSourceDetail: null,
        rules: {
          contact: ValidateRules.requiredMax,
          mobile: validatePhone,
          telephone: validatePhone,
          districtId: ValidateRules.required,
          address: {required: true, max: 200, message: '[1-50]不能为空', trigger: 'manual'},
          virtualWarehouseId: ValidateRules.required,
          expressId: ValidateRules.required,
          remark: ValidateRules.remark
        }
      };
    },
    watch: {
      currentSourceDetail(val) {
        if (val) {
          StockApi.listSkuStockInfo(this.store.setting.stockStrategy, val.skuId).then(
            data => this.stockList = data);
        } else {
          this.stockList = [];
        }
      },
      stockStrategy(strategy) {
        this.warehouseList = strategy.warehouses;
      },
      selectedWarehouse(warehouse) {
        if (warehouse) {
          ExpressStrategyApi.get(warehouse.expressStrategyId).then(data => {
            this.expressStrategy = JSON.parse(data.settingJson);
            this.expressList = [...this.expressStrategy.expresses];
          });
          this.domain.virtualWarehouseId = warehouse.virtualWarehouseId;
          this.domain.virtualWarehouseName = warehouse.virtualWarehouseName;
        } else {
          this.expressList = [];
        }
      },
      selectedExpress(express) {
        if (express) {
          this.domain.expressId = express.expressId;
          this.domain.expressName = express.expressName;
        } else {
          this.domain.expressId = null;
          this.domain.expressName = null;
        }
      }
    },
    methods: {
      show(order) {
        this.order = order;
        this.list = [];
        this.isRequestSend = false;
        this.stockList = [];
        this.selectedWarehouse = null;
        this.selectedExpress = null;
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
        SalesOrderApi.decrypt(this.order.salesOrderId).then(response => {
          this.domain = {
            countryId: response.countryId,
            provinceId: response.provinceId,
            cityId: response.cityId,
            districtId: response.districtId,
            countryName: response.countryName,
            provinceName: response.provinceName,
            cityName: response.cityName,
            districtName: response.districtName,
            address: response.address,
            version: response.version,
            contact: response.contact,
            mobile: response.mobile,
            telephone: response.telephone,
            virtualWarehouseId: null,
            virtualWarehouseName: null,
            expressId: null,
            expressName: null,
            details: []
          };
          if (this.storeId === order.storeId) {
            this.setSuggestInfo(order);
            this.loadWaitingDispatch(order);
            this.visible = true;
          } else {
            this.storeId = order.storeId;
            this.expressList = [];
            this.warehouseList = [];
            StoreApi.get(order.storeId).then(store => {
              this.store = store;
              const loadStockStrategy = StockDispatchStrategyApi.get(
                store.setting.stockStrategy).then(setting => {
                this.stockStrategy = JSON.parse(setting.settingJson);
              });
              const listDetail = this.loadWaitingDispatch(order);
              Promise.all([loadStockStrategy, listDetail]).then(() => {
                this.setSuggestInfo(order);
                this.visible = true;
              });
            });
          }
        });
      },
      loadWaitingDispatch(order) {
        return SalesOrderApi.listWaitingDispatch(order.mergeFlag).then(orders => {
          let list = [];
          orders.forEach(o => {
            o.details.forEach(d => {
              d.salesOrderCode = o.salesOrderCode;
              d.tradeId = o.tradeId;
              d.paidTime = o.sub.mallPaidTime;
            });
            list.push(...o.details);
          });
          this.list = list;
        });
      },
      setSuggestInfo(order) {
        if (!Assert.isEmpty(order.suggestVirtualWarehouseId)) {
          let warehouse = this.stockStrategy.warehouses.find(
            x => x.virtualWarehouseId === order.suggestVirtualWarehouseId);
          if (warehouse) {
            this.selectedWarehouse = warehouse;
          }
        }
        if (!this.selectedWarehouse) {
          this.selectedWarehouse = this.stockStrategy.warehouses[0];
        }
        if (!Assert.isEmpty(this.selectedWarehouse) && !Assert.isEmpty(order.suggestExpressId)) {
          this.selectedExpress = this.expressList.find(
            x => x.expressId === order.suggestExpressId);
        }
      },
      autoSelectExpress() {
        if (this.expressList && this.expressList.length > 0) {
          if (!Assert.isEmpty(this.order.suggestExpressId)) {
            this.selectedExpress = this.expressList.find(
              x => x.expressId === this.order.suggestExpressId);
          } else {
            this.selectedExpress = this.expressList[0];
          }
        }
      },
      currentSourceDetailChange(row) {
        this.currentSourceDetail = row;
      },
      addAllDetail() {
        for (let item of this.list) {
          item.virtualWarehouseId = this.selectedWarehouse.virtualWarehouseId;
          item.virtualWarehouseName = this.selectedWarehouse.virtualWarehouseName;
        }
        this.domain.details.push(...this.list);
        this.list = [];
      },
      addDetailByWarehouse(warehouse) {
        this.addDetail(this.currentSourceDetail, this.list.indexOf(this.currentSourceDetail),
          warehouse);
      },
      addCurrentRow(row) {
        let index = this.list.indexOf(row);
        this.addDetail(row, index);
      },
      addDetail(row, index, warehouse) {
        if (index < 0) {
          return;
        }
        if (!warehouse) {
          warehouse = this.selectedWarehouse;
        }
        row.virtualWarehouseId = warehouse.virtualWarehouseId;
        row.virtualWarehouseName = warehouse.virtualWarehouseName;
        this.domain.details.push(row);
        this.list.splice(index, 1);
      },
      removeDetail(row, index) {
        this.list.push(row);
        this.domain.details.splice(index, 1);
      },
      checkStock() {
        if (this.domain.details.length > 0) {
          SalesOrderApi.checkDispatchStock(this.domain).then(data => {
            if (data.length > 0) {
              let oos = [];
              for (let item of data) {
                let detail = this.domain.details.find(
                  x => x.salesOrderDetailId === item.salesOrderDetailId);
                let index = this.domain.details.indexOf(detail);
                oos.push(detail);
                this.list.push(detail);
                this.domain.details.splice(index, 1);
              }
              let msg = oos.map(x => `${x.skuCode}在${x.virtualWarehouseName}库存不足`).join('<br/>');
              this.$message.warning({
                duration: 2000,
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: msg
              });
            } else {
              this.$message.success('库存充足');
            }
          });
        }
      },
      save() {
        this.domain.salesOrderId = this.order.salesOrderId;
        this.domain.version = this.order.version;
        this.$refs.editForm.validate().then(() => {
          //配货单校验
          const salesOrderId = this.order.salesOrderId;
          let hasSourceOrder = false;
          for (let detail of this.domain.details) {
            if (detail.salesOrderId === salesOrderId) {
              hasSourceOrder = true;
              break;
            }
          }
          if (!hasSourceOrder) {
            this.$message.warning('配货单内必须包含主单 ' + this.order.salesOrderCode + ' 的明细');
            return;
          }
          this.doSave();
        });
      },
      doSave() {
        if (this.domain.details.length > 0) {
          this.isRequestSend = true;
          SalesOrderApi.checkDispatchStock(this.domain).then(data => {
            if (data.length > 0) {
              let oos = [];
              for (let item of data) {
                let detail = this.domain.details.find(
                  x => x.salesOrderDetailId === item.salesOrderDetailId);
                let index = this.domain.details.indexOf(detail);
                oos.push(detail);
                this.list.push(detail);
                this.domain.details.splice(index, 1);
              }
              let msg = oos.map(x => `${x.skuCode}在${x.virtualWarehouseName}库存不足`).join('<br/>');
              this.$message.warning({
                duration: 2000,
                dangerouslyUseHTMLString: true,
                message: msg
              });
              this.isRequestSend = false;
            } else {
              SalesOrderApi.manualDispatch(this.domain).then(this.confirm).catch(() => {
                this.isRequestSend = false;
              });
            }
          }).catch(() => {
            this.isRequestSend = false;
          });
        } else {
          this.$message.warning('请选择需要配货的商品');
        }
      }
    },
  };
</script>