<template>
  <el-form :model="domain" :rules="rules" ref="editForm">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="出库仓库" prop="virtualWarehouseId">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :virtualWarehouseName.sync="domain.virtualWarehouseName"
                                      :warehouseName.sync="domain.warehouseName"
                                      :warehouseId.sync="domain.warehouseId"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出库类型" prop="stockOutOrderType">
          <data-dict-item-selector v-model="domain.stockOutOrderType"
                                   :dataDictId="10701"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="来源单号" prop="fromCode">
          <el-input v-model="domain.fromCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="domain.telephone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="domain.mobile"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="domain.contact"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="收货区域" prop="districtId">
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
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="domain.remark"></el-input>
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script>
  import {ValidateRules} from '@/libs/util';
  import {StockOutApi} from './api';
  import {DataDictItemSelector, RegionSelector, VirtualWarehouseSelector} from '@/modules/selector';

  export default {
    name: 'EditBasic',
    components: {VirtualWarehouseSelector, DataDictItemSelector, RegionSelector},
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        api: StockOutApi,
        pk: 'stockOutOrderId',
        rules: {
          virtualWarehouseId: ValidateRules.required,
          stockOutOrderType: ValidateRules.required,
          fromCode: [
            {min: 2, max: 20, message: '长度在 2 到 20 个字符'}
          ],
          telephone: ValidateRules.telephone,
          mobile: ValidateRules.mobile,
          remark: ValidateRules.remark
        }
      };
    },
    watch: {
      value(val) {
        this.domain = val;
      }
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
      }
    },
  };
</script>