<template>

  <el-card class="box-card" style="width:100%">
    <template slot="header">
      <el-button @click="get">还原</el-button>
      <el-button @click="save">保存</el-button>
    </template>
    <el-form label-width="0px">
      <el-form-item>
        <el-checkbox v-model="setting.manualPrepareFirst">手工配货抢占库存</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="setting.autoPrepareOnSplit">订单拆分后自动配货</el-checkbox>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-checkbox v-model="setting.continuePrepareOnMdFail">电子面单获取失败继续生成配货单</el-checkbox>-->
      <!--</el-form-item>-->
      <el-form-item>
        卖家留言更新方式：
        <el-radio-group v-model="setting.salesMessageDeleteRule">
          <el-radio label="REPLACE">替换</el-radio>
          <el-radio label="APPEND">追加</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        停止更新卖家留言时间：
        <el-radio-group v-model="setting.stopUpdateSalesMessageTime">
          <el-radio label="CREATED">订单生成后</el-radio>
          <el-radio label="PREPARED">订单配货后</el-radio>
          <el-radio label="DELIVERED">订单发货后</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        订单合单规则：
        <el-radio-group v-model="setting.orderMergeRule">
          <el-radio label="NONE">不合并</el-radio>
          <el-radio label="SAME_STORE">同店铺合并</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';
  import api from './api';
  import {StoreSelector} from '@/modules/selector';

  export default {
    name: 'OrderSetting',
    mixins: [TableResize],
    components: {StoreSelector},
    props: {},
    data() {
      return {
        setting: {}
      };
    },
    methods: {
      get: function () {
        api.get('SALES_ORDER_CONFIG').then(response => {
          this.setting = JSON.parse(response.settingJson);
        });
      },
      save: function () {
        api.update('SALES_ORDER_CONFIG', JSON.stringify(this.setting)).then(() => {
          this.$message.success('保存成功');
        });
      },
    },
    created() {
      this.get();
    }
  };
</script>
