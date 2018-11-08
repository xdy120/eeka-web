<template>
  <el-dialog title="编辑" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" label-width="110px">
      <el-form-item label="福袋编码" v-if="rule && rule.ruleType==='LUCK_BAG'">
        <el-input v-model="domain.luckyCode"></el-input>
      </el-form-item>
      <el-form-item label="规格编码">
        <el-input v-model="domain.skuCode" readonly></el-input>
      </el-form-item>
      <el-form-item label="赠品总数量" prop="planQuantity">
        <el-input-number v-model="domain.planQuantity" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="每次赠送数量" prop="quantity">
        <el-input-number v-model="domain.quantity" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="预警数量" prop="alertQuantity">
        <el-input-number v-model="domain.alertQuantity" :min="1"></el-input-number>
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
          planQuantity: ValidateRules.requiredNumber,
          quantity: ValidateRules.requiredNumber,
          alertQuantity: ValidateRules.requiredNumber
        }
      };
    },
    methods: {
      show(strategy, rule, gift) {
        this.strategy = strategy;
        this.rule = rule;
        this.domain = gift;
        this.visible = true;
      },
      save() {
        GiftStrategyApi.modifyGift(this.strategy.giftStrategyId, this.rule.giftStrategyRuleId,
          this.domain).then(() => {
          this.$emit('ok');
          this.visible = false;
        });
      },
    }
  };
</script>