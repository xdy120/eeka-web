<template>
  <el-card class="box-card" style="width:100%">
    <template slot="header">
      <el-button @click="get">还原</el-button>
      <el-button @click="save">保存</el-button>
    </template>
    <el-form label-width="0px">
      <el-form-item>
        <el-checkbox v-model="setting.autoGenPurchaseNotice">采购订单审核时自动生成采购通知单</el-checkbox>
      </el-form-item>
      <!--<el-form-item>-->
        <!--<el-checkbox v-model="setting.requireOriginOrder">采购退货必须关联原采购订单</el-checkbox>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-checkbox v-model="setting.vipScheduleCheckInventory">唯品档期检查库存</el-checkbox>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-checkbox v-model="setting.vipPriceAbnormalIntercept">唯品价异常时拦截操作</el-checkbox>
      </el-form-item>
      <el-form-item>
        生成唯品退货通知单时使用：
        <el-radio-group v-model="setting.vipReturnNoticeOrderNum">
          <el-radio label="RETURN_NUMBER">退货数量</el-radio>
          <el-radio label="SCAN_NUMBER">扫描数量</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-form-item>
          B2B退货单生成B2B退货通知单时取：
          <el-radio-group v-model="setting.priceMaintenanceGranularity">
            <el-radio label="RETURN_NUMBER">B2B退货单的退货数量</el-radio>
            <el-radio label="SCAN_NUMBER">B2B退货单的签收数量作为B2B退货通知单的通知数量</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        线下发货物流接口：
        <wms-app-selector :block="false" v-model="setting.offlineDeliveryAppId"></wms-app-selector>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';
  import api from './api';
  import {WmsAppSelector} from '@/modules/selector';

  export default {
    name: 'IoBillSetting',
    mixins: [TableResize],
    components: {WmsAppSelector},
    data() {
      return {
        setting: {}
      };
    },
    methods: {
      get: function () {
        api.get('RECEIPTS_IN_OUT_CONFIG').then(response => {
          this.setting = JSON.parse(response.settingJson);
        });
      },
      save: function () {
        api.update('RECEIPTS_IN_OUT_CONFIG', JSON.stringify(this.setting)).then(() => {
          this.$message.success('保存成功');
        });
      },
    },
    created() {
      this.get();
    },
  };
</script>
