<template>

  <el-tabs type="border-card">

    <el-tab-pane label="订单配置">
      <order-setting></order-setting>
    </el-tab-pane>

    <el-tab-pane label="退换货单配置">
      <return-setting></return-setting>
    </el-tab-pane>

    <el-tab-pane label="库存配置">
      <inventory-setting></inventory-setting>
    </el-tab-pane>
    <el-tab-pane label="商品配置">
      <product-setting></product-setting>
    </el-tab-pane>

    <el-tab-pane label="出入库单据配置">
      <io-bill-setting></io-bill-setting>
    </el-tab-pane>
  </el-tabs>


</template>

<script>
  import TableResize from '@/libs/mixins/table.resize';

  import OrderSetting from './order_setting.vue';
  import ReturnSetting from './return_setting.vue';
  import InventorySetting from './inventory_setting';
  import ProductSetting from './product_setting';
  import IoBillSetting from './io_bill_setting';

  export default {
    name: 'business',
    mixins: [TableResize],
    components: {OrderSetting, ReturnSetting, InventorySetting, ProductSetting, IoBillSetting},
    props: {},
    data() {
      return {}
    },
    methods: {},
  };
</script>
