<template>
  <el-form :model="domain" :rules="rules" ref="editForm">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="交易号" prop="tradeId">
          <el-input v-model="domain.tradeId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="订单类型" prop="sub.salesOrderType">
          <enum-selector enum-name="SalesOrderType"
                         v-model="domain.sub.salesOrderType"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="会员" prop="sub.memberId">
          <member-selector v-model="domain.sub.memberId" :member-name.sync="domain.sub.memberName"
                           @confirm="onSelectMember"></member-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="店铺" prop="storeId">
          <store-selector v-model="domain.storeId"
                          :store-name.sync="domain.storeName"></store-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建议仓库" prop="suggestVirtualWarehouseId">
          <dispatch-warehouse-selector v-model="domain.suggestVirtualWarehouseId"
                                       :virtual-warehouse-name="domain.suggestVirtualWarehouseName"
                                       :store-id="domain.storeId" @change="selectWarehouse">
          </dispatch-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="建议快递">
          <express-selector v-model="domain.suggestExpressId"
                            :express-name.sync="domain.suggestExpressName"
                            express-use="PRE_SALE,ANY"
                            :cod-type="domain.cod?'COD,ONLY_COD':'NO_COD,COD'"></express-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="支付状态" prop="payStatus">
          <enum-selector enum-name="SalesOrderPayStatus" v-model="domain.payStatus"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="退款状态" prop="refundStatus">
          <enum-selector enum-name="RefundStatus" v-model="domain.refundStatus"></enum-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="平台状态" prop="mallSalesOrderStatus">
          <enum-selector enum-name="MallSalesOrderStatus"
                         v-model="domain.mallSalesOrderStatus"></enum-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="下单时间" prop="sub.mallCreatedTime">
          <go-date-time-picker v-model="domain.sub.mallCreatedTime"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="支付时间" prop="sub.mallPaidTime">
          <go-date-time-picker v-model="domain.sub.mallPaidTime"></go-date-time-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="留单日期" prop="holdDate">
          <go-date-picker v-model="domain.holdDate" :disabled="!domain.hold"></go-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="币种" prop="sub.currencyCode">
          <data-dict-item-selector v-model="domain.sub.currencyCode"
                                   dataDictId="10201"></data-dict-item-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="快递费用" prop="sub.expressFee">
          <el-input-number v-model="domain.sub.expressFee"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="邮编" prop="sub.zipcode">
          <el-input v-model="domain.sub.zipcode"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
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
      <el-col :span="8">
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="domain.telephone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="收货区域" prop="districtId">
          <region-selector :countryId.sync="domain.countryId" :provinceId.sync="domain.provinceId"
                           :cityId.sync="domain.cityId" :districtId.sync="domain.districtId"
                           :countryName.sync="domain.countryName"
                           :provinceName.sync="domain.provinceName"
                           :cityName.sync="domain.cityName"
                           :districtName.sync="domain.districtName"></region-selector>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="domain.address"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="补发原因" prop="reissueReason"
                      v-if="domain.sub.salesOrderType === 'REISSUE'">
          <data-dict-item-selector v-model="domain.reissueReason"
                                   dataDictId="10202"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="买家备注">
          <el-input v-model="domain.sub.buyerMemo" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="卖家备注">
          <el-input v-model="domain.sub.sellerMemo" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-checkbox v-model="domain.urgent">加急</el-checkbox>
        <el-checkbox v-model="domain.hold">留单</el-checkbox>
        <el-checkbox v-model="domain.sub.newMember">新会员</el-checkbox>
        <el-checkbox v-model="domain.sub.blacklist">黑名单</el-checkbox>
        <el-checkbox v-model="domain.sub.prepay">预付</el-checkbox>
        <el-checkbox v-model="domain.sub.cod">到付</el-checkbox>
        <el-checkbox v-model="domain.sub.hasInvoice">发票</el-checkbox>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import {Assert, ValidateRules} from '@/libs/util';
  import {MemberApi} from '@/modules/marketing/member/api';
  import {
    DataDictItemSelector,
    DispatchWarehouseSelector,
    ExpressSelector,
    MemberSelector,
    RegionSelector,
    SkuSelector,
    StoreSelector
  } from '@/modules/selector';

  export default {
    name: 'SalesOrderBasic',
    components: {
      DataDictItemSelector,
      ExpressSelector,
      DispatchWarehouseSelector,
      SkuSelector,
      StoreSelector,
      MemberSelector,
      RegionSelector
    },
    props: {
      value: Object,
      editMode: false
    },
    watch: {
      value(val) {
        this.domain = val;
      },
      'domain.hold'(val) {
        if (val && val === true) {
          this.rules.holdDate = ValidateRules.required;
        } else {
          this.rules.holdDate = null;
        }
      }
    },
    data() {
      let validatePhone = (rule, value, callback) => {
        if (Assert.isBlank(this.domain.mobile) && Assert.isBlank(this.domain.telephone)) {
          callback(new Error('手机和电话至少填一个'));
        } else {
          callback();
        }
      };
      return {
        domain: this.value,
        rules: {
          tradeId: ValidateRules.requiredMax,
          storeId: ValidateRules.required,
          payStatus: ValidateRules.required,
          refundStatus: ValidateRules.required,
          suggestVirtualWarehouseId: ValidateRules.required,
          contact: ValidateRules.requiredMax,
          mobile: [ValidateRules.mobile, {validator: validatePhone}],
          telephone: [ValidateRules.telephone, {validator: validatePhone}],
          districtId: ValidateRules.required,
          address: ValidateRules.required,
          mallSalesOrderStatus: ValidateRules.required,
          holdDate: null,
          'sub.memberId': ValidateRules.required,
          'sub.salesOrderType': ValidateRules.required,
          'sub.mallCreatedTime': ValidateRules.required,
          'sub.mallPaidTime': ValidateRules.required,
          'sub.currencyCode': ValidateRules.required,
          'sub.expressFee': ValidateRules.requiredNumber,
          reissueReason: ValidateRules.required
        },
      };
    },
    methods: {
      validate() {
        this.$emit('input', this.domain);
        return this.$refs.editForm.validate();
      },
      resetFields() {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
      },
      onSelectMember(item) {
        if (item) {
          MemberApi.get(item.memberId).then(member => {
            this.domain.memberId = member.memberId;
            this.domain.sub.memberName = member.memberName;
            this.$set(this.domain, 'contact', member.contact);
            this.$set(this.domain, 'mobile', member.mobile);
            this.$set(this.domain, 'telephone', member.telephone);
            this.$set(this.domain, 'address', member.address);
            this.$set(this.domain, 'countryId', member.countryId);
            this.$set(this.domain, 'countryName', member.countryName);
            this.$set(this.domain, 'provinceId', member.provinceId);
            this.$set(this.domain, 'provinceName', member.provinceName);
            this.$set(this.domain, 'cityId', member.cityId);
            this.$set(this.domain, 'cityName', member.cityName);
            this.$set(this.domain, 'districtId', member.districtId);
            this.$set(this.domain, 'districtName', member.districtName);
            this.$set(this.domain, 'storeId', member.storeId);
            this.$set(this.domain, 'storeName', member.storeName);
          });
        } else {
          this.domain.memberId = null;
          this.domain.sub.memberName = null;
          this.domain.contact = null;
          this.domain.mobile = null;
          this.domain.telephone = null;
          this.domain.address = null;
          this.domain.countryId = null;
          this.domain.countryName = null;
          this.domain.provinceId = null;
          this.domain.provinceName = null;
          this.domain.cityId = null;
          this.domain.cityName = null;
          this.domain.districtId = null;
          this.domain.districtName = null;
          this.domain.storeId = null;
          this.domain.storeName = null;
        }
      },
      selectWarehouse(item) {
        if (item) {
          this.domain.suggestVirtualWarehouseName = item.virtualWarehouseName;
          this.domain.suggestWarehouseId = item.warehouseId;
          this.domain.suggestWarehouseName = item.warehouseName;
        } else {
          this.domain.suggestVirtualWarehouseName = null;
          this.domain.suggestWarehouseId = null;
          this.domain.suggestWarehouseName = null;
        }
      }
    }
  };
</script>