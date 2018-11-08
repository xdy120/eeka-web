<template>
  <el-dialog title="编辑" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules">
      <el-form-item label="规格编码">
        <el-input v-model="domain.skuCode" readonly></el-input>
      </el-form-item>
      <el-form-item label="购买数量" prop="quantity">
        <el-input-number v-model="domain.quantity" :min="1"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {GiftStrategyApi} from '../api';
  import {ValidateRules} from '@/libs/util';

  export default {
    data() {
      return {
        domain: {},
        strategy: null,
        rule: null,
        visible: false,
        rules: {
          quantity: ValidateRules.requiredNumber,
        }
      };
    },
    methods: {
      show(strategy, rule, sku) {
        this.strategy = strategy;
        this.rule = rule;
        this.domain = sku;
        this.visible = true;
      },
      save() {
        GiftStrategyApi.modifyProduct(this.strategy.giftStrategyId, this.rule.giftStrategyRuleId,
          this.domain).then(() => {
          this.$emit('ok');
          this.visible = false;
        });
      }
    }
  };
</script>