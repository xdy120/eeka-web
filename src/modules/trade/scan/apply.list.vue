<template>
  <div>
    <el-dialog title="选择售后申请" :visible.sync="visable" width="50%" append-to-body>
      <el-table :data="parentData" :height="500" @selection-change="selectItems">
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <go-enum-column prop="status" enum-name="ApplyStatus" label="状态"></go-enum-column>
        <go-enum-column prop="refundApplyOrderType" enum-name="RefundApplyOrderType" width="120"
                        label="申请类型"></go-enum-column>
        <el-table-column prop="tradeId" width="120" label="交易号"></el-table-column>
        <el-table-column prop="storeName" width="120" label="店铺名称"></el-table-column>
        <el-table-column prop="paidAccount" width="120" label="支付帐号"></el-table-column>
        <el-table-column prop="outerCode" width="120" label="外部单号"></el-table-column>
        <go-quantity-column prop="applyQuantity" width="120" label="申请数量"></go-quantity-column>
        <go-money-column prop="applyAmount" width="120" label="申请金额"></go-money-column>
        <go-money-column prop="actualAmount" width="120" label="实际金额"></go-money-column>
        <el-table-column prop="productCode" width="120" label="商品编码"></el-table-column>
        <el-table-column prop="productName" width="120" label="商品名称"></el-table-column>
        <el-table-column prop="skuCode" width="120" label="规格编码"></el-table-column>
        <el-table-column prop="skuName" width="120" label="规格名称"></el-table-column>
        <el-table-column prop="contact" width="120" label="联系人"></el-table-column>
        <el-table-column prop="mobile" width="120" label="手机"></el-table-column>
        <el-table-column prop="address" width="120" label="地址"></el-table-column>
        <go-date-time-column prop="appliedTime" label="申请时间"></go-date-time-column>
        <go-date-time-column prop="createdTime" label="创建时间"></go-date-time-column>
        <go-date-time-column prop="modifiedTime" label="更新时间"></go-date-time-column>
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
    name: 'ApplyList',
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
        this.parentData = parentData.data;
        this.visable = true;
      },
      confirm() {
        //交易号可能不一样，店铺 ，收货信息不一样不能一起选择 todo
        this.$emit('confirm', this.selectedItems);
        this.visable = false;
      },
      selectItems(selection) {
        this.selectedItems = selection;
      },
    },
  };

</script>