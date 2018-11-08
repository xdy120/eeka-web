<template>
  <el-dialog title="线下发货" :visible.sync="visible" :before-close="dialogCloseConfirm" width="1000px">
    <el-form ref="editForm" :model="domain" :rules="rules" label-width="80px">
      <el-container>
        <el-main>
          <el-table :data="list" ref="table" :height="287"
                    @selection-change="handleSelectionChange">
            <go-selection-column></go-selection-column>
            <!--<el-table-column prop="virtualWarehouseName" label="配货仓库" width="120"
                             fixed></el-table-column>-->
            <el-table-column prop="salesOrderCode" label="订单编号" width="120" fixed></el-table-column>
            <el-table-column prop="productCode" label="商品编码" width="120"></el-table-column>
            <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
            <el-table-column prop="skuCode" label="规格编码" width="120"></el-table-column>
            <el-table-column prop="skuName" label="规格名称" width="80"></el-table-column>
            <go-quantity-column prop="quantity" label="数量"></go-quantity-column>
            <!--<el-table-column label="操作" fixed="right" width="80">
                <template slot-scope="scope">
                    <go-delete-button
                            @click="removeDetail(scope.row,scope.$index)"></go-delete-button>
                </template>
            </el-table-column>-->
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">生成配货单</el-button>
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
      var validatePhone = (rule, value, callback) => {
        if (Assert.isBlank(this.domain.mobile) && Assert.isBlank(this.domain.telephone)) {
          callback(new Error('手机和电话至少填一个'));
        } else {
          callback();
        }
      };

      return {
        store: null,
        storeId: null,
        list: [],
        rules: {
          contact: ValidateRules.requiredMax,
          mobile: validatePhone,
          telephone: validatePhone,
          districtId: ValidateRules.required,
          address: {required: true, max: 200, message: '[1-50]不能为空', trigger: 'manual'},
          remark: ValidateRules.remark
        }
      };
    },
    watch: {},
    mounted() {

    },
    methods: {
      show(order) {
        this.order = order;
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
            details: [],
            offlineDelivery: true
          };
          this.loadWaitingDispatch(order);
          this.visible = true;
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
          this.$nextTick(function () {
            this.checked();//每次更新了数据，触发这个函数即可。
          });
        });
      },
      checked() {
        //首先el-table添加ref="table"引用标识
        this.list.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true);
        });
      },
      //获取选中的商品
      handleSelectionChange(val) {
        this.domain.details = val;
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
          SalesOrderApi.offlineDelivery(this.domain).then(this.confirm);
        } else {
          this.$message.warning('请选择需要配货的商品');
        }
      }
    }
  };
</script>