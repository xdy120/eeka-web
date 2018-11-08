<template>
  <el-dialog title="添加赠品" :visible.sync="visible" width="800px">
    <el-container>
      <el-header height="35px">
        <sku-selector @confirm="selectSkus" text="选择赠品" quantity></sku-selector>
      </el-header>
      <el-main>
        <el-table :data="list" :height="300">
          <el-table-column prop="productCode" label="商品编码" :width="150"></el-table-column>
          <el-table-column prop="productName" label="商品名称" :width="150"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码" :width="150"></el-table-column>
          <el-table-column prop="skuName" label="规格名称" :width="150"></el-table-column>
          <go-quantity-column prop="quantity" label="数量" width="160px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity"
                               @change="quantityChange($event,scope.row)"></el-input-number>
            </template>
          </go-quantity-column>
        </el-table>
        <batch-processor ref="batchProcessor" @finish="ok"></batch-processor>
      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {SkuSelector} from '@/modules/selector';
  import {SalesOrderApi} from '../api';
  import OrderActionMixin from './mixin';
  import {SalesOrderDetail} from '../util';
  import {BatchProcessor} from '@/component/ui';

  export default {
    mixins: [Edit, OrderActionMixin],
    components: {SkuSelector, BatchProcessor},
    data() {
      return {
        list: [],
        rules: {
          holdDate: ValidateRules.required
        }
      };
    },
    methods: {
      show(order) {
        if (Array.isArray(order)) {
          this.orders = order;
        } else {
          this.orders = [];
          this.order = order;
        }
        this.domain = {};
        this.list = [];
        this.visible = true;
      },
      selectSkus(skus) {
        for (let sku of skus) {
          let detail = this.list.find(x => x.skuId === sku.skuId);
          if (detail === undefined) {
            detail = new SalesOrderDetail(sku, true);
            detail.sellingPrice = 0;
            detail.markedPrice = 0;
            this.list.push(detail);
          }
        }
      },
      doSave() {
        if (this.list.length === 0) {
          this.$message.warning('请选择赠品');
          return;
        }
        this.domain.details = this.list;
        SalesOrderApi.addGift(this.domain).then(this.confirm);
      },
      doBatch() {
        if (this.list.length === 0) {
          this.$message.warning('请选择赠品');
          return;
        }
        let gifts = this.list;
        let list = this.orders.map(function (item) {
          return {
            salesOrderId: item.salesOrderId,
            salesOrderCode: item.salesOrderCode,
            version: item.version,
            details: gifts
          };
        });
        this.$refs.batchProcessor.show('订单批量添加赠品', 'salesOrderCode', list,
          item => SalesOrderApi.addGift(item));
      },
      ok() {
        this.$emit('ok');
        this.close();
      }
    }
  };
</script>