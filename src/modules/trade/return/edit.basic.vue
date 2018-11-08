<template>
  <el-form :model="domain" :rules="rules" ref="editForm">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="订单号" prop="salesOrderId">
          <sales-order-selector v-model="domain.salesOrderId"
                                :outFilter="SalesFilter"
                                :disabled="disabled"
                                :SalesOrderCode="domain.salesOrderCode"
                                @confirm="saleConfirm">
          </sales-order-selector>

        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="交易号" prop="tradeId">
          <el-input v-model="domain.tradeId" readonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="店铺" prop="storeId">
          <store-selector v-model="domain.storeId" :storeName.sync="domain.storeName"
                          :disabled="disabled"></store-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="!domain.isExchange">
      <el-col :span="8">
        <el-form-item label="退货原因" prop="returnReasonType">
          <data-dict-item-selector v-model="domain.returnReasonType"
                                   :dataDictId="10304"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退换类型" prop="returnType">
          <data-dict-item-selector v-model="domain.returnType"
                                   :dataDictId="10301"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退款类型" prop="refundType">
          <enum-selector enum-name="RefundType" v-model="domain.refundType"></enum-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="会员信息" prop="memberId">
          <member-selector v-model="domain.memberId"
                           :memberName.sync="domain.memberName"
                           :disabled="disabled"></member-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退入仓库" prop="inVirtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.inVirtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.inVirtualWarehouseName"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="快递单号" prop="expressNo">
          <el-input v-model="domain.expressNo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10" v-if="domain.isExchange">
      <el-col :span="8">
        <el-form-item label="换出仓库" prop="outVirtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.outVirtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.outVirtualWarehouseName"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人" prop="contact">
          <el-input v-model="domain.contact"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="domain.mobile"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-if="domain.isExchange">
      <el-col :span="8">
        <el-form-item label="收货区域">
          <region-selector :countryId.sync="domain.countryId" :provinceId.sync="domain.provinceId"
                           :cityId.sync="domain.cityId" :districtId.sync="domain.districtId"
                           :countryName.sync="domain.countryName"
                           :provinceName.sync="domain.provinceName" :cityName.sync="domain.cityName"
                           :districtName.sync="domain.districtName"></region-selector>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="domain.address"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="domain.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-form-item label="是否换货" prop="">
          <el-checkbox v-model="domain.isExchange"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {StoreApi} from '@/modules/base';
  import {SalesOrderApi} from '../sales/api.js';
  import {ReturnOrderApi} from '../api';
  import {
    DataDictItemSelector,
    ExpressSelector,
    MemberSelector,
    RegionSelector,
    SalesOrderSelector,
    StoreSelector,
    VirtualWarehouseSelector
  } from '@/modules/selector';

  export default {
    name: 'ReturnOrderBasic',
    components: {
      MemberSelector,
      VirtualWarehouseSelector,
      StoreSelector,
      ExpressSelector,
      SalesOrderSelector,
      DataDictItemSelector,
      RegionSelector
    },
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        SalesFilter: {
          statuses: 'DELIVERED'
        },
        disabled: false,
        rules: {
          salesOrderId: ValidateRules.required,
          tradeId: ValidateRules.required,
          storeId: ValidateRules.required,
          memberId: ValidateRules.required,
          returnType: ValidateRules.required,
          refundType: ValidateRules.required,
          inVirtualWarehouseId: ValidateRules.required,
          returnReasonType: ValidateRules.required,
        }
      };
    },
    watch: {
      ['domain.isExchange'](val) {
        if (val) {
          //增加表单验证规则
          this.$set(this.rules, 'outVirtualWarehouseId', ValidateRules.required);
          this.$set(this.rules, 'contact', ValidateRules.required);
          this.$set(this.rules, 'regionPath', ValidateRules.required);
          this.$set(this.rules, 'mobile', ValidateRules.mobile);
          this.$set(this.rules, 'address', ValidateRules.required);

          delete this.rules.returnReasonType;
          delete this.rules.returnType;
          delete this.rules.refundType;
        }else {

          this.$set(this.rules, 'returnType', ValidateRules.required);
          this.$set(this.rules, 'refundType', ValidateRules.required);
          this.$set(this.rules, 'returnReasonType', ValidateRules.required);

          delete this.rules.outVirtualWarehouseId;
          delete this.rules.contact;
          delete this.rules.regionPath;
          delete this.rules.mobile;
          delete this.rules.address;
        }
      },
      value(val) {
        this.domain = val;
      },
      ['domain.storeId'](val) {
        const _this = this;
        if (val) {
          StoreApi.get(val).then(response => {
            _this.domain.outVirtualWarehouseId = response.setting.defaultWarehouse;
            _this.domain.outVirtualWarehouseName = response.setting.defaultWarehouseName;
          });
        }
      },
      //获得解密后的用户信息
      ['domain.salesOrderId'](val) {
        const _this = this;
        if (val) {
          SalesOrderApi.get(val).then(response => {
            _this.domain.contact = response.contact;
            _this.domain.mobile = response.mobile;
          });
        }
      },
    },
    methods: {
      validate() {
        this.$emit('input', this.domain);
        return this.$refs.editForm.validate();
      },
      ///查找店铺对应默认退回仓库 及换出仓库
      searchStoreSetting() {
        // StoreApi.get(this.domain.storeId).then(response => {
        //     if (response) {
        //         console.log(response);
        //         let settingJson = eval('(' + response.settingJson + ')');
        //         this.$set(this.domain, 'inVirtualWarehouseId', settingJson.defaultReturnWarehouse);
        //         this.$set(this.domain, 'inVirtualWarehouseName', settingJson.defaultReturnWarehouseName);
        //         this.$set(this.domain, 'outVirtualWarehouseId', settingJson.defaultWarehouse);
        //         this.$set(this.domain, 'outVirtualWarehouseName', settingJson.defaultWarehouseName);
        //     } else {
        //         this.$message.warning('没有找到默认退入,换出仓库');
        //     }
        // });
      },
      saleConfirm(data) {
        this.domain.salesOrderCode = data.salesOrderCode;
        this.domain.tradeId = data.tradeId;
        this.domain.storeId = data.storeId;
        this.domain.storeName = data.storeName;
        this.domain.memberId = data.sub.memberId;
        this.domain.memberName = data.sub.memberName;
        this.domain.countryId = data.countryId;
        this.domain.provinceId = data.provinceId;
        this.domain.cityId = data.cityId;
        this.domain.districtId = data.districtId;
        this.domain.countryName = data.countryName;
        this.domain.provinceName = data.provinceName;
        this.domain.cityName = data.cityName;
        this.domain.districtName = data.districtName;
        this.domain.address = data.address;
        let params = {page: 1, pageSize: 1, salesOrderId: data.salesOrderId};
        ReturnOrderApi.list(params).then(r => {
          if (r.total > 0) {
            this.$confirm(`退换货单列表中已存在 ${r.total}张单据, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.searchStoreSetting();
            }).catch(() => {
              this.domain = {};
              this.$message.info('已取消选择');
            });
          }
        });
      },
      resetFields() {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      }
    }, created() {
      if (this.domain.salesOrderId) {
        this.disabled = true;
      }
    }
  };
</script>