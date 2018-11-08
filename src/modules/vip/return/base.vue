<template>
  <el-form :model="domain" ref="editForm" label-width="100px" label-position="left">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="店铺" prop="storeId"
                      :rules="ValidateRules.required">
          <store-selector v-model="domain.storeId" :store-name.sync="domain.storeName"
                          mall-type="VIP" :clearable="false" @confirm="storeChange"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="唯品仓库" prop="vipWarehouseCode" :rules="ValidateRules.required">
          <data-dict-item-selector v-model="domain.vipWarehouseName"
                                   :code.sync="domain.vipWarehouseCode"
                                   data-dict-id="10804"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="退入仓库" prop="virtualWarehouseId"
                      :rules="ValidateRules.required">
          <virtual-warehouse-selector v-model="domain.virtualWarehouseId"
                                      :virtual-warehouse-name.sync="domain.virtualWarehouseName"
                                      :clearable="false"></virtual-warehouse-selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退货类型" prop="vipReturnType"
                      :rules="ValidateRules.required">
          <data-dict-item-selector v-model="domain.vipReturnType"
                                   dataDictId="10802"></data-dict-item-selector>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="退供单号" prop="outerCode"
                      :rules="ValidateRules.required">
          <el-input v-model="domain.outerCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退货时间" prop="returnTime" :rules="ValidateRules.required">
          <el-date-picker
              v-model="domain.returnTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="domain.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import {DataDictItemSelector, StoreSelector, VirtualWarehouseSelector} from '@/modules/base';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'ReturnBase',
    components: {
      VirtualWarehouseSelector,
      StoreSelector, DataDictItemSelector
    },
    props: {
      value: Object
    },
    data() {
      return {
        domain: this.value,
        ValidateRules: ValidateRules,
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
      },
      onClosed() {
        this.domain = this.value;
      },
      storeChange(store){
        let setting = JSON.parse(store.settingJson);
        this.domain.virtualWarehouseId = setting.defaultReturnWarehouse;
        this.domain.virtualWarehouseName = setting.defaultReturnWarehouseName;
      }
    }
  };
</script>
