<template>

  <el-card class="box-card" style="width:100%">
    <template slot="header">
      <el-button @click="get">还原</el-button>
      <el-button @click="save">保存</el-button>
    </template>
    <el-form label-width="0px">
      <el-form-item>
        <el-checkbox v-model="setting.jdOrgBalanceMoney">自动下载的京东换货订单的【结算金额】取原销售订单的结算金额</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="setting.alertExistReturnOrder">退货扫描时，如果订单已经存在【退换货单】，则系统进行提示
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="setting.useAfterSalesAmount">
          优先使用售后申请金额：退货扫描时，如果扫入商品有退款申请，则使用退款申请的金额作为【实退金额】，否则使用订单中的商品结算金额作为【实退金额】
        </el-checkbox>
      </el-form-item>
      <!--<el-form-item>-->
      <!--<el-checkbox v-model="setting.onlyChangeSameParagraph">只允许换同款商品</el-checkbox>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-checkbox v-model="setting.autoAudit">自动审核复核退换货单生成的【换货订单】</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="setting.alertExistChangeOrder">
          复核退换货单生成换货订单时，如果订单已存在【换货订单】类型的订单，则系统进行提示
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="setting.alertExistRefundSlip">复核退换货单或手工新增生成【退款单】时，如果订单已存在退款单，则系统进行提示
        </el-checkbox>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';
  import api from './api';

  export default {
    name: 'ReturnSetting',
    mixins: [TableResize],
    components: {},
    props: {},
    data() {
      return {
        setting: {}
      };
    },
    methods: {
      get: function () {
        api.get('RETURN_ORDER_CONFIG').then(response => {
          this.setting = JSON.parse(response.settingJson);
        });
      },
      save: function () {
        api.update('RETURN_ORDER_CONFIG', JSON.stringify(this.setting)).then(() => {
          this.$message.success('保存成功');
        });
      },
    },
    created() {
      this.get();
    },
  };
</script>
