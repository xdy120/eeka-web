<template>
  <el-dialog title="替换赠品" :visible.sync="visible" width="600px">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-checkbox v-model="matchQuantity">匹配数量</el-checkbox>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card header="原始赠品">
            <el-form-item label="商品编码" prop="sourceGift.skuId">
              <el-input v-model="domain.sourceGift.productCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="domain.sourceGift.productName" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格编码">
              <el-input v-model="domain.sourceGift.skuCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格名称">
              <el-input v-model="domain.sourceGift.skuName" readonly></el-input>
            </el-form-item>
            <el-form-item label="数量" v-if="matchQuantity">
              <el-input-number v-model="domain.sourceGift.quantity"></el-input-number>
            </el-form-item>
            <sku-selector :multiple="false" @confirm="selectSource"></sku-selector>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card header="替换赠品">
            <el-form-item label="商品编码" prop="targetGift.skuId">
              <el-input v-model="domain.targetGift.productCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="domain.targetGift.productName" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格编码">
              <el-input v-model="domain.targetGift.skuCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格名称">
              <el-input v-model="domain.targetGift.skuName" readonly></el-input>
            </el-form-item>
            <el-form-item label="数量" v-if="matchQuantity">
              <el-input-number v-model="domain.targetGift.quantity"></el-input-number>
            </el-form-item>
            <sku-selector :multiple="false" @confirm="selectTarget"></sku-selector>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <batch-processor ref="batchProcessor" @finish="ok"></batch-processor>
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
          sourceGift: {},
          targetGift: {}
        },
        rules: {
          'sourceGift.skuId': ValidateRules.required,
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
          sourceGift: {},
          targetGift: {}
        };
        this.visible = true;
      },
      selectSource(sku) {
        this.domain.sourceGift = new SalesOrderDetail(sku, true);
      },
      selectTarget(sku) {
        this.domain.targetGift = new SalesOrderDetail(sku, true);
      },
      doSave() {
        if (this.matchQuantity) {
          let sourceQuantity = this.domain.sourceGift.quantity;
          let targetQuantity = this.domain.targetGift.quantity;
          if (Assert.isEmpty(sourceQuantity) || sourceQuantity <= 0
            || Assert.isEmpty(targetQuantity) || targetQuantity <= 0) {
            this.$message.warning('请输入匹配数量');
            return;
          }
        } else {
          this.domain.targetGift.quantity = null;
          this.domain.sourceGift.quantity = null;
        }
        SalesOrderApi.replaceGift(this.domain).then(this.confirm);
      },
      doBatch() {
        this.$refs.editForm.validate().then(() => {
          if (this.matchQuantity) {
            let sourceQuantity = this.domain.sourceDetail.quantity;
            let targetQuantity = this.domain.targetDetail.quantity;
            if (Assert.isEmpty(sourceQuantity) || sourceQuantity <= 0
              || Assert.isEmpty(targetQuantity) || targetQuantity <= 0) {
              this.$message.warning('请输入匹配数量');
              return;
            }
          } else {
            this.domain.targetDetail.quantity = null;
            this.domain.sourceDetail.quantity = null;
          }
          let domain = this.domain;
          let list = this.orders.map(function (item) {
            return {
              salesOrderId: item.salesOrderId,
              salesOrderCode: item.salesOrderCode,
              version: item.version,
              sourceDetail: domain.sourceGift,
              targetDetail: domain.targetGift
            };
          });
          this.$refs.batchProcessor.show('订单批量替换赠品', 'salesOrderCode', list,
            item => SalesOrderApi.replaceGift(item));
        });
      },
      ok() {
        this.$emit('ok');
        this.close();
      }
    }
  };
</script>