<template>
  <el-dialog title="替换商品" :visible.sync="visible" width="600px">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card header="被替换商品">
            <el-form-item label="商品编码" prop="sourceDetail.skuId">
              <el-input v-model="domain.sourceDetail.productCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="domain.sourceDetail.productName" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格编码">
              <el-input v-model="domain.sourceDetail.skuCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格名称">
              <el-input v-model="domain.sourceDetail.skuName" readonly></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input-number v-model="domain.sourceDetail.quantity"></el-input-number>
            </el-form-item>
            <sku-selector :multiple="false" @confirm="selectSource"></sku-selector>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card header="替换后商品">
            <el-form-item label="商品编码" prop="targetDetail.skuId">
              <el-input v-model="domain.targetDetail.productCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="domain.targetDetail.productName" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格编码">
              <el-input v-model="domain.targetDetail.skuCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="规格名称">
              <el-input v-model="domain.targetDetail.skuName" readonly></el-input>
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
        domain: {
          sourceDetail: {},
          targetDetail: {}
        },
        rules: {
          'sourceDetail.skuId': ValidateRules.required,
          'targetDetail.skuId': ValidateRules.required
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
          sourceDetail: {},
          targetDetail: {}
        };
        this.visible = true;
      },
      selectSource(sku) {
        this.domain.sourceDetail = new SalesOrderDetail(sku, true);
      },
      selectTarget(sku) {
        this.domain.targetDetail = new SalesOrderDetail(sku, true);
      },
      doSave() {
        SalesOrderApi.replaceDetail(this.domain).then(this.confirm);
      },
      doBatch() {
        this.$refs.editForm.validate().then(() => {
          let domain = this.domain;
          let list = this.orders.map(function (item) {
            return {
              salesOrderId: item.salesOrderId,
              salesOrderCode: item.salesOrderCode,
              version: item.version,
              sourceDetail: domain.sourceDetail,
              targetDetail: domain.targetDetail
            };
          });
          this.$refs.batchProcessor.show('订单批量替换赠品', 'salesOrderCode', list,
            item => SalesOrderApi.replaceDetail(item));
        });
      },
      ok() {
        this.$emit('ok');
        this.close();
      }
    }
  };
</script>