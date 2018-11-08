<template>
  <div>
    <el-table ref="detailTable" :height="tabsTableHeight" :data="list" show-summary
              :summary-method="summary" @current-change="getCurrentRow">
      <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
      <el-table-column label="通知">
        <template slot-scope="scope">
          <span v-if="scope.row.noticed">已通知</span>
          <span v-else>未通知</span>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="商品编码" min-width="120" sortable></el-table-column>
      <el-table-column prop="productName" label="商品名称" min-width="120" sortable></el-table-column>
      <el-table-column prop="skuCode" label="规格编码" min-width="120"></el-table-column>
      <el-table-column prop="skuName" label="规格名称" min-width="120"></el-table-column>
      <go-enum-column prop="productType" enum-name="ProductType" label="商品类型"
                      min-width="80"></go-enum-column>
      <el-table-column prop="applyQuantity" label="申请数量" min-width="120"></el-table-column>
      <go-quantity-column prop="quantity" label="退货数量" width="100"></go-quantity-column>
      <go-quantity-column prop="inQuantity" label="入库数量" width="100"></go-quantity-column>
      <go-money-column prop="refundableAmount" label="应退金额" width="100">
        <template slot-scope="scope">
          <div v-if="!canEdit(scope.row)">
            {{scope.row.refundableAmount}}
          </div>
          <div v-else>
            <el-input size="small" v-model="scope.row.refundableAmount"></el-input>
          </div>
        </template>
      </go-money-column>
      <el-table-column prop="returnReasonType" label="退货原因"></el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <go-modify-button v-if="showModify()" @click="editRow(scope.row)"></go-modify-button>
          <go-confirm-button v-if="canEdit(scope.row)"
                             @click="modifyDetail(scope.row)"></go-confirm-button>
          <go-cancel-button v-if="canEdit(scope.row)"
                            @click="uneditRow(scope.row)"></go-cancel-button>
          <sku-selector @confirm="selectOutSkus" v-if="isShowAdd()"
                        :columns="columns"
                        :quantity=true
                        :multiple=false
                        type="text" text="添加换出">
          </sku-selector>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {DetailEdit, List, TableResize, Tabs} from '@/libs/mixins';
  import {ReturnOrderApi, ReturnOrderDetailApi,ReturnOrderOutDetailApi} from './api.js';
  import {SalesOrderSelector, SkuSelector,} from '@/modules/selector';

  export default {
    name: 'ReturnOrderDetail',
    mixins: [List, TableResize, Tabs, DetailEdit],
    components: {
      SalesOrderSelector, SkuSelector
    },
    data() {
      return {
        tab: 'detail',
        pk: 'returnOrderDetailId',
        orderId: 'returnOrderId',
        api: ReturnOrderDetailApi,
        currentRow: {},
        columns: [{
          prop: 'refundableAmount',
          label: '应付金额',
          type: 'number'
        }]
      };
    },
    methods: {
      search() {
        if (this.parentData) {
          let filter = {returnOrderId: this.parentData.returnOrderId};
          this.doSearch(ReturnOrderDetailApi.listInDetail(this.parentData.returnOrderId, filter),
            this.$refs.detailTable);
        }
      },
      //将 原单关联上 退入的商品
      saleConfirm(order) {
        let param = {};
        let returnOrder = this.parentData;
        returnOrder.tradeId = order.tradeId;
        returnOrder.salesOrderId = order.salesOrderId;
        returnOrder.salesOrderCode = order.salesOrderCode;
        returnOrder.memberId = order.sub.memberId;
        returnOrder.status = 'AUDITED';
        returnOrder.storeId = order.storeId;
        returnOrder.storeName = order.storeName;
        param.version = this.parentData.version;
        param.domain = returnOrder;
        ReturnOrderApi.relateSourceOrder(param).then(response => {
          this.$message.success('关联原单成功');
        });
      },
      relate(row) {
        return !row.salesOrderId;
      },
      isShowAdd() {
        return this.parentData.status === 'AUDITED' || this.parentData.status === 'CREATED';
      },
      getCurrentRow(current) {
        this.currentRow = current;
      },
      selectOutSkus(outSku) {
        let filter = {returnOrderId: this.parentData.returnOrderId};
        filter.skuCode = outSku.skuCode;
        ReturnOrderOutDetailApi.listOutDetail(this.parentData.returnOrderId, filter).then(res=>{
          let oldQuantity = res.length !==0 ? res[0].quantity : 0;
          let totalQuantity = oldQuantity + outSku.quantity;
          if (totalQuantity > this.currentRow.quantity) {
            this.$confirm('换出数量大于退货数量，是否确认添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.confirmOutSku(outSku);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          }else {
            this.confirmOutSku(outSku);
          }
        });
      },
      confirmOutSku(outSku){
        outSku.productType = outSku.product.productType;
        outSku.returnOrderId = this.parentData.returnOrderId;
        if (outSku.refundableAmount !== 0) {
          outSku.actualAmount = outSku.refundableAmount;
        } else {
          outSku.actualAmount = this.currentRow.refundableAmount;
        }
        outSku.returnOrderDetailId = this.currentRow.returnOrderDetailId;
        this.parentData.outDetails = outSku;
        ReturnOrderApi.addOutDetails(this.parentData).then(() => {
          this.$message.success('添加换出商品成功');
          this.$emit('change');
        });
      },
      showModify() {
        return this.parentData.status === 'CREATED' || this.parentData.status === 'AUDITED';
      },
      //修改明细的金额
      modifyDetail(row) {
        this.parentData.details = this.list;
        let versionBo = {};
        versionBo.version = this.parentData.version;
        versionBo.domain = this.parentData;
        ReturnOrderApi.modifyAmount(versionBo).then(response => {
          this.parentData.version = response;
          this.$message.success('提交成功');
          this.$delete(row, '_back_data');
          this.$emit('change');
        });
      },
      summary({columns, data}) {
        return this.generalSummary(['applyQuantity','quantity','inQuantity','refundableAmount'], columns, data);
      }
    }
  };
</script>