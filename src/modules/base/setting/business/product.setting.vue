<template>
  <el-card class="box-card" style="width:100%">
    <template slot="header">
      <el-button @click="get">还原</el-button>
      <el-button @click="save">保存</el-button>
    </template>
    <el-form label-width="0px">
      <el-form-item>
        <el-checkbox v-model="setting.autoPushWms">自动推送WMS</el-checkbox>
      </el-form-item>
      <el-form-item label="主图关联店铺" label-width="100px" label-position="left">
        <store-selector v-model="setting.productPicOriginShop"></store-selector>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';
  import api from './api';
  import {StoreSelector} from '@/modules/selector';

  export default {
    name: 'ProductSetting',
    mixins: [TableResize],
    components: {StoreSelector},
    data() {
      return {
        setting: {}
      };
    },
    methods: {
      get: function () {
        api.get('PRODUCT_CONFIG').then(response => {
          this.setting = JSON.parse(response.settingJson);
        });
      },
      save: function () {
        api.update('PRODUCT_CONFIG', JSON.stringify(this.setting)).then(response => {
          this.$message.success('保存成功');
        });
      },
    },
    created() {
      this.get();
    },
  };
</script>
