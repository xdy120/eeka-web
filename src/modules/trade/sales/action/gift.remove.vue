<template>
  <el-dialog title="作废赠品" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-checkbox v-model="matchQuantity">匹配数量</el-checkbox>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-card header="原始赠品">
            <el-form-item label="商品编码" prop="gift.skuId">
              <el-input v-model="domain.gift.productCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="domain.gift.productName" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格编码">
              <el-input v-model="domain.gift.skuCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格名称">
              <el-input v-model="domain.gift.skuName" readonly></el-input>
            </el-form-item>
            <el-form-item label="数量" v-if="matchQuantity">
              <el-input-number v-model="domain.gift.quantity"></el-input-number>
            </el-form-item>
            <sku-selector :multiple="false" @confirm="selectSource"></sku-selector>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <batch-processor ref="batchProcessor" @finish="confirm"></batch-processor>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Assert, ValidateRules} from '@/libs/util';
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
        matchQuantity: false,
        domain: {
          gift: {},
        },
        rules: {
          'gift.skuId': ValidateRules.required,
          'targetGift.skuId': ValidateRules.required
        }
      };
    },
    methods: {
      show(order) {
        if (Array.isArray(order)) {
          this.orders = order;
        } else {
          this.order = order;
        }
        this.domain = {
          gift: {},
        };
        this.visible = true;
      },
      selectSource(sku) {
        this.domain.gift = new SalesOrderDetail(sku, true);
      },
      selectTarget(sku) {
        this.domain.targetGift = new SalesOrderDetail(sku, true);
      },
      doSave() {
        if (this.matchQuantity) {
          let quantity = this.domain.gift.quantity;
          if (Assert.isEmpty(quantity) || quantity <= 0) {
            this.$message.warning('请输入匹配数量');
            return;
          }
        } else {
          this.domain.gift.quantity = null;
        }
        SalesOrderApi.removeGift(this.domain).then(this.confirm);
      },
      doBatch() {
        if (!this.domain.gift.skuId) {
          this.$message.warning('请选择赠品');
          return;
        }
        let removeGift = this.domain.gift;
        let list = this.orders.map(function (item) {
          return {
            detail: removeGift,
            salesOrderId: item.salesOrderId,
            salesOrderCode: item.salesOrderCode,
            version: item.version,
          };
        });
        this.$refs.batchProcessor.show('订单批量作废赠品', 'salesOrderCode', list,
            item => SalesOrderApi.removeGift(item));
      },
    }
  };
</script>