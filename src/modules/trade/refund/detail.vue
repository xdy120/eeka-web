<template>
  <div>
    <el-table ref="detailTable" :height="tabsTableHeight" :data="list" show-summary :summary-method="summary">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="productCode" label="商品编码"></el-table-column>
      <el-table-column prop="productName" label="商品名称"></el-table-column>
      <el-table-column prop="skuCode" label="规格编码"></el-table-column>
      <el-table-column prop="skuName" label="规格名称"></el-table-column>
      <go-quantity-column prop="quantity" label="退货数量" width="100"></go-quantity-column>
      <go-money-column prop="refundableAmount" label="应退金额" width="100"></go-money-column>
      <go-money-column prop="actualAmount" label="实退金额" width="100">
        <template slot-scope="scope">
          <div v-if="!canEdit(scope.row)">
            {{scope.row.actualAmount}}
          </div>
          <div v-else>
            <el-input size="small" v-model="scope.row.actualAmount"></el-input>
          </div>
        </template>
      </go-money-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="scope">
          <div v-if="parentData.status==='CREATED'">
            <go-modify-button v-if="editMode && scope.row.refundOrderDetailId"
                              @click="editRow(scope.row)"></go-modify-button>
            <go-confirm-button v-if="canEdit(scope.row)  && scope.row.refundOrderId" type="text"
                               @click="modify(scope.row)"></go-confirm-button>
            <go-cancel-button type="text" v-if="canEdit(scope.row) && scope.row.refundOrderDetailId"
                              @click="uneditRow(scope.row)"></go-cancel-button>
            <go-delete-button type="text" v-if="editMode"
                              @click="remove(scope.$index)"></go-delete-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {DetailEdit, List, TableResize, Tabs} from '@/libs/mixins';
  import {RefundOrderDetailApi} from './api.js';

  export default {
    name: 'RefundOrderDetail',
    mixins: [List, DetailEdit, TableResize, Tabs],
    data() {
      return {
        tab: 'detail',
        api: RefundOrderDetailApi,
        pk: 'refundOrderDetailId',
        orderId: 'refundOrderId',
      };
    },
    methods: {
      search() {
        if (this.parentData != null) {
          this.doSearch(RefundOrderDetailApi.listDetail(this.parentData.refundOrderId),
            this.$refs.detailTable);
        }
      },
      summary({columns, data}) {
        return this.generalSummary(['quantity','refundableAmount','actualAmount'], columns, data);
      }
    }
  };
</script>