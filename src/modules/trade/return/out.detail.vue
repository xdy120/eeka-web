<template>
  <div>
    <el-table ref="outDetailTable" :data="list" :height="tabsTableHeight" show-summary
              :summary-method="summary">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="productCode" label="商品编码" min-width="120"></el-table-column>
      <el-table-column prop="productName" label="商品名称" min-width="120"></el-table-column>
      <go-enum-column prop="productType" enum-name="ProductType" label="商品类型"
                      min-width="80"></go-enum-column>
      <el-table-column prop="skuCode" label="规格编码" min-width="120"></el-table-column>
      <el-table-column prop="skuName" label="规格名称" min-width="120" sortable></el-table-column>
      <go-quantity-column prop="quantity" label="换出数量" width="100"></go-quantity-column>
      <go-money-column prop="actualAmount" label="应付金额" width="100">
        <template slot-scope="scope">
          <div v-if="!canEdit(scope.row)">
            {{scope.row.actualAmount}}
          </div>
          <div v-else>
            <el-input size="small" v-model="scope.row.actualAmount"></el-input>
          </div>
        </template>
      </go-money-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <go-modify-button v-if="showModify()" @click="editRow(scope.row)"></go-modify-button>
          <go-confirm-button v-if="canEdit(scope.row)" @click="modifyDetail(scope.row)"></go-confirm-button>
          <go-cancel-button v-if="canEdit(scope.row)" @click="uneditRow(scope.row)"></go-cancel-button>
          <el-button v-if="showModify()" type="text" @click="replaceDetail(scope.row)">替换</el-button>
        </template>
      </el-table-column>
    </el-table>
    <sku-selector :display="false" multiple ref="skuSelector"></sku-selector>
  </div>
</template>
<script>
  import {DetailEdit, List, TableResize, Tabs} from '@/libs/mixins';
  import {ReturnOrderOutDetailApi,ReturnOrderApi} from './api.js';
  import ExchangeSelector from '@/modules/trade/return/exchange.selector';
  import {SkuSelector} from '@/modules/selector';
  import {StoreApi} from '@/modules/base/index.js';
  export default {
    name: 'ReturnOrderOutDetail',
    mixins: [List, TableResize, Tabs, DetailEdit],
    components: {
      ExchangeSelector,SkuSelector,StoreApi
    },
    data() {
      return {
        tab: 'outDetail',
        pk: 'returnOrderOutDetailId',
        editing: [],
        store: {}
      };
    },
    methods: {
      search() {
        if (this.parentData) {
          let filter = {returnOrderId: this.parentData.returnOrderId};
          this.doSearch(
              ReturnOrderOutDetailApi.listOutDetail(this.parentData.returnOrderId, filter),
              this.$refs.outDetailTable);
        }
      },
      modify(index) {
        let item = {};
        item.returnOrderOutDetailId = this.list[index].returnOrderOutDetailId;
        item.returnOrderId = this.list[index].returnOrderId;
        item.skuId = this.list[index].skuId;
        item.skuCode = this.list[index].skuCode;
        item.skuName = this.list[index].skuName;
        item.productId = this.list[index].productId;
        item.productName = this.list[index].productName;
        item.productCode = this.list[index].productCode;
        item.actualAmount = this.list[index].actualAmount;
        item.quantity = this.list[index].quantity;
        ReturnOrderOutDetailApi.modifyDetail(item.returnOrderId, item.returnOrderOutDetailId,
            item).then(r => {
          this.$message.success(`明细${this.list[index].skuCode}修改成功`);
          this.$set(this.list, index, r);
          this.$set(this.editing, index, undefined);
        });
      },
      removeDetail(index) {
        let item = this.list[index];
        ReturnOrderOutDetailApi.remove(item.returnOrderOutDetailId).then(r => {
          this.$message.success(`明细: ${item.skuCode} 删除成功`);
          this.$delete(this.list, index);
        });
      },
      replaceDetail(detail) {
        //找出店铺的信息
        if (this.store && this.parentData.storeId === this.store.storeId) {
          this.replace(detail);
        }else if (this.parentData.storeId) {
          StoreApi.get(this.parentData.storeId).then(response=>{
            this.store = response;
            this.replace(detail);
          });
        }else {
          this.$message.warning('该单异常,无店铺信息,请核实后操作!');
        }
      },
      replace(detail){
        //此处判断店铺是否是同款 , 如果是给 productId, 否则反之
        if (!this.store){
          this.$message.warning('该单异常,无店铺信息,请核实后操作!');
          return;
        }
        let exchangeDifferentSpu = this.store.setting.exchangeDifferentSpu;
        let productId = null;

        if (!(exchangeDifferentSpu && exchangeDifferentSpu === true)){
          productId = detail.productId;
        }
        this.$refs.skuSelector.showDialog({
          productId: productId,
          multiple: false,
          onSelected: sku => {
            this.$confirm(`确认要将【${detail.skuCode}】替换为【${sku.skuCode}】吗？`).then(() => {
              detail.skuId = sku.skuId;
              detail.skuName = sku.skuName;
              detail.skuCode = sku.skuCode;
              ReturnOrderOutDetailApi.modifyDetail(detail.returnOrderId, detail.returnOrderOutDetailId,
                detail).then(r => {
                this.$message.success(`明细:${sku.skuCode}修改成功`);
              });
            });
          }
        });
      },
      showModify(){
        return this.parentData.status === 'CREATED' || this.parentData.status === 'AUDITED';
      },
      //修改明细的金额
      modifyDetail(row){
        this.parentData.outDetails = this.list;
        let versionBo = {};
        versionBo.version = this.parentData.version;
        versionBo.domain = this.parentData;
        ReturnOrderApi.modifyAmount(versionBo).then(response=>{
          this.parentData.version = response;
          this.$message.success('提交成功');
          this.$delete(row, '_back_data');
        });
      },
      summary({columns, data}) {
        return this.generalSummary(['quantity','actualAmount'], columns, data);
      }
    }
  };
</script>