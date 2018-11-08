<template>
  <div>
    <el-dialog title="选择B2C订单" :visible.sync="visable" width="50%" append-to-body>
      <el-table :data="parentData" :height="500" @selection-change="selectItems">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="salesOrderCode" label="订单编号" width="150" fixed></el-table-column>
        <el-table-column prop="tradeId" label="交易号" width="150" fixed></el-table-column>
        <go-enum-column prop="status" label="状态" enum-name="SalesOrderStatus" width="60"
                        fixed></go-enum-column>
        <el-table-column prop="storeName" label="店铺" width="100"></el-table-column>
        <go-date-time-column prop="sub.mallPaidTime" label="支付时间"></go-date-time-column>
        <el-table-column prop="contact" label="收货人" width="100"></el-table-column>
        <el-table-column prop="regionPath" label="区域" width="150"></el-table-column>
        <el-table-column prop="address" label="地址" width="150"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import {TableResize} from '@/libs/mixins';

  export default {
    name: 'SaleList',
    mixins: [TableResize],
    props: {},
    data() {
      return {
        parentData: [],
        visable: false,
        selectedItems: [],
      };
    },
    methods: {
      show(parentData) {
        this.parentData = parentData;
        this.visable = true;
      },
      confirm() {
        //店铺 ,收货信息不一样不能一起选择 todo
        this.$emit('confirm', this.selectedItems);
        this.visable = false;
      },
      selectItems(selection) {
        this.selectedItems = selection;
      },
    },
  };

</script>