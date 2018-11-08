<template>
  <el-dialog :title="title" :visible.sync="visible" :width="width">
    <el-form :model="domain" :rules="rules" label-width="80px" v-if="warehouseType===1">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item label="仓库编号:">{{warehouseId}}

          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="仓库名称:">{{warehouseName}}

          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-form ref="editForm" :model="domain" :rules="rules" label-width="80px"
             v-if="warehouseType===2 || warehouseType===3">
      <el-container>
        <el-main>
          <el-table ref="ratioTable" :data="list" :height="200" :highlight-current-row="true"
                    @current-change="handleCurrentChange">
            <el-table-column type="index" label="编号" :width="80"></el-table-column>
            <el-table-column prop="warehouseName" :label="lableNo" :width="150"></el-table-column>
            <el-table-column prop="warehouseName" :label="lableName" :width="150"></el-table-column>
            <el-table-column prop="quantity" label="可销库存" :width="150"></el-table-column>
            <el-table-column prop="ratio" label="动销比" :width="150"></el-table-column>
          </el-table>
        </el-main>
        <!-- <el-aside width="300px" style="padding-left: 5px" class="oms-search">
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
                 <el-form-item label="区域" prop="regionPath">
                     <region-selector :city.sync="domain.cityId" :province.sync="domain.provinceId" :path.sync="domain.regionPath"
                                      :country.sync="domain.countryId" :county.sync="domain.countyId"></region-selector>
                 </el-form-item>
                 <el-form-item label="地址" prop="address">
                     <el-input v-model="domain.address" type="textarea" :rows="3"></el-input>
                 </el-form-item>
             </el-card>
         </el-aside>-->
      </el-container>
    </el-form>
    <tabs-footer>
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane label="商品信息" name="detail">
          <el-table :data="detailList" height="400px">
            <el-table-column prop="productCode" label="商品编码" width="100"></el-table-column>
            <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
            <el-table-column prop="skuCode" label="规格编码" width="100"></el-table-column>
            <el-table-column prop="skuName" label="规格名称" width="150"></el-table-column>
            <go-quantity-column prop="quantity" label="可销库存" width="100"/>
            <go-quantity-column prop="ratio" label="动销比"
                                v-if="warehouseType===2 || warehouseType===3"/>
          </el-table>
          <!--<sales-order-deatil-ratio :parent-data="selectedItem" :current-tab="currentTab" @change="search"/>-->
        </el-tab-pane>
      </el-tabs>
    </tabs-footer>
    <!--<div slot="footer" class="dialog-footer">
        <el-button @click="save">生成配货单</el-button>
    </div>-->
  </el-dialog>
</template>
<script>
  import {Edit, TableResize} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {RegionSelector, SkuSelector} from '@/modules/selector';
  import {RatioQueryApi, SalesOrderApi} from '../api';
  import OrderActionMixin from './mixin';
  import {BatchProcessor} from '@/component/ui';

  export default {
    mixins: [Edit, OrderActionMixin, TableResize],
    components: {SkuSelector, BatchProcessor, RegionSelector},

    data() {
      var validatePhone = (rule, value, callback) => {
        if (Assert.isBlank(this.domain.mobile) && Assert.isBlank(this.domain.telephone)) {
          callback(new Error('手机和电话至少填一个'));
        } else {
          callback();
        }
      };
      return {
        title: null,
        lableNo: null,
        lableName: null,
        warehouseId: null,
        warehouseName: null,
        width: null,
        warehouseType: null,
        currentTab: 'detail',
        list: [],
        detailList: [],
        details: [],
        currentRow: null,
        rules: {
          contact: ValidateRules.requiredMax,
          mobile: validatePhone,
          telephone: validatePhone,
          regionPath: ValidateRules.required,
          address: {required: true, max: 200, message: '[1-50]不能为空', trigger: 'manual'},
          virtualWarehouseId: ValidateRules.required,
          expressId: ValidateRules.required
        }
      };
    },
    methods: {
      show(order, warehouseType) {
        if (warehouseType === 1) {
          this.title = '成衣总仓可销库存';
          this.width = '660px';
        } else if (warehouseType === 2) {
          this.width = '726px';
          this.title = '区域分仓可销库存与动销比';
          this.lableNo = '区域编码';
          this.lableName = '区域名称';
        } else if (warehouseType === 3) {
          this.width = '726px';
          this.title = '门店可销库存与动销比';
          this.lableNo = '门店编码';
          this.lableName = '门店名称';
        }
        this.order = order;
        this.warehouseType = warehouseType;
        this.domain = {
          contact: null,
          mobile: null,
          telephone: null,
          countryId: order.countryId,
          provinceId: order.provinceId,
          cityId: order.cityId,
          countyId: order.countyId,
          regionPath: order.regionPath,
          address: order.address,
          version: order.version,
          details: [],
          virtualWarehouseId: null,
          virtualWarehouseName: null,
          expressId: '16247483186873344',
          expressName: '顺丰'
        };
        this.list = [];
        this.detailList = [];
        this.currentRow = null;
        RatioQueryApi.ratioQuery(this.order.salesOrderId, this.warehouseType).then(response => {
          this.list = response.stockRatios;
          if (this.list != null && this.list.length > 0) {
            this.warehouseId = this.list[0].warehouseId;
            this.warehouseName = this.list[0].warehouseName;
            this.detailList = this.list[0].stockRatios;
          }
          if (response != null && response.salesOrderDetails.length > 0) {
            this.domain.details = response.salesOrderDetails;
            this.domain.contact = response.salesOrder.contact;
            this.domain.mobile = response.salesOrder.mobile;
            this.domain.telephone = response.salesOrder.telephone;
          }
          this.visible = true;
        });
      },
      doSave() {
        if (this.currentRow != null && this.currentRow.length === 0) {
          this.$message.warning('请选择门店');
          return;
        }
        if (this.domain.details.length > 0) {
          this.domain.details.forEach(detail => {
            detail.virtualWarehouseId = this.domain.virtualWarehouseId;
            detail.virtualWarehouseName = this.domain.virtualWarehouseName;
          });
          SalesOrderApi.manualDispatch(this.domain).then(this.confirm);
        }
      }, handleCurrentChange(row) {
        this.currentRow = row;
        this.domain.virtualWarehouseId = row.virtualWarehouseId;
        this.domain.virtualWarehouseName = row.virtualWarehouseName;
        this.detailList = row.stockRatios;
      }
    }
  };
</script>