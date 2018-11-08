<template>
  <el-card class="box-card" style="width:100%">
    <template slot="header">
      <el-button @click="get">还原</el-button>
      <el-button @click="save">保存</el-button>
    </template>
    <el-form ref="editForm" :model="setting" :rules="rules" label-width="0px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="可销库存低于" label-width="100px">
            <el-input v-model.number="setting.onlyToShopMin" ref="stockWarinning"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="时上传至店铺" label-width="100px">
            <store-selector multiple v-model="setting.onlyToShop"
                            :store-name.sync="setting.onlyToShopName"></store-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        出库类单据计算方式：
        <el-radio-group v-model="setting.deliveryAllocationType">
          <el-radio label="SOLD_OUT">可销数</el-radio>
          <el-radio label="AVAILABLE_BINS">可用数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        虚拟调拨计算方式：
        <el-radio-group v-model="setting.virtualAllocationType">
          <el-radio label="SOLD_OUT">可销数</el-radio>
          <el-radio label="AVAILABLE_BINS">可用数</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        库存确认方式：
        <el-radio-group v-model="setting.stockConfirmMethod">
          <el-radio label="ORDER">根据单据处理</el-radio>
          <el-radio label="INTERFACE">根据异动处理</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';
  import api from './api';
  import {StoreSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'InventorySetting',
    mixins: [TableResize],
    components: {StoreSelector},
    props: {},
    data() {
      return {
        setting: {},
        rules: {
          onlyToShopMin: ValidateRules.number
        }
      };
    },
    methods: {
      get: function () {
        api.get('INVENTORY_CONFIG').then(response => {
          this.setting = JSON.parse(response.settingJson);
        });
      },
      save: function () {
        this.$refs.editForm.validate().then(() => {
          api.update('INVENTORY_CONFIG', this.setting).then(() => {
            this.$message.success('保存成功');
          });
        });
      },
    },
    created() {
      this.get();
    },
  };
</script>
