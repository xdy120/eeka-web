<template>
  <el-dialog title="编辑赠送规则" :visible.sync="visible" width="800px"
             :before-close="dialogCloseConfirm">
    <el-form ref="editForm" :model="domain" :rules="rules" label-width="110px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="规则名称" prop="giftStrategyRuleName">
            <el-input v-model="domain.giftStrategyRuleName"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规则类型" prop="ruleType">
            <enum-show input :value="domain.ruleType" enum-name="GiftStrategyRuleType"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优先级" prop="priorityNo">
            <el-input-number v-model="domain.priorityNo" :readonly="luckBag" :min="luckBag?9999:1"
                             :max="luckBag?9999:9998"/>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="!luckBag">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="活动范围" prop="setting.productRange">
              <enum-show input v-model="domain.setting.productRange" enum-name="ProductRange"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠品类型" prop="setting.giftType">
              <enum-show input v-model="domain.setting.giftType" enum-name="GiftStrategyGiftType"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="赠送数量" prop="setting.giveQuantity">
              <el-input v-model.number="domain.setting.giveQuantity"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预警手机" prop="setting.alertMobile">
              <el-input v-model="domain.setting.alertMobile"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12" v-if="domain.ruleType==='MONEY'">
            <el-form-item label="最低金额" prop="setting.minAmount">
              <el-input v-model.number="domain.setting.minAmount"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else-if="domain.ruleType==='PRODUCT_QUANTITY'">
            <el-form-item label="最低款数" prop="setting.minProductQuantity">
              <el-input v-model.number="domain.setting.minProductQuantity"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else-if="domain.ruleType==='QUANTITY'">
            <el-form-item label="最低件数" prop="setting.minQuantity">
              <el-input v-model.number="domain.setting.minQuantity"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="domain.setting.doubly">
            <el-form-item prop="setting.doublyType">
              <template slot="label">
                翻倍规则
                <tooltip-icon icon="question" tooltip="款数翻倍时送的种类翻倍，件数翻倍时同款的数量翻倍"/>
              </template>
              <enum-selector v-model="domain.setting.doublyType"
                             enum-name="GiftStrategyDoublyType"/>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="domain.setting.doubly">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item prop="setting.doublyNumber">
                <template slot="label">
                  翻倍额
                  <tooltip-icon slot="suffix" icon="question" :tooltip="doublyTooltip"/>
                </template>
                <el-input min="1" v-model.number="domain.setting.doublyNumber"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最大倍数" prop="setting.maxDoubly">
                <el-input min="1" v-model.number="domain.setting.maxDoubly"/>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row :gutter="10" v-if="domain.setting.giftType==='EXPRESS'">
          <el-col :span="12">
            <el-form-item label="赠送快递" prop="setting.maxDoubly">
              <el-form-item label="赠送快递" required>
                <express-selector v-model="domain.setting.expressId"
                                  :express-name.sync="domain.setting.expressName"></express-selector>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row :gutter="10" v-else>
        <el-col :span="12">
          <el-form-item label="赠送款数" prop="setting.luckBagGiveProductQuantity">
            <el-input v-model.number="domain.setting.luckBagGiveProductQuantity"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-checkbox v-model="domain.setting.doubly" v-if="!luckBag">翻倍
          <tooltip-icon icon="question" tooltip="多买多送，用于买二送一，买四送二此类活动"/>
        </el-checkbox>
        <three-checkbox v-model="domain.setting.presell">预售订单
          <tooltip-icon icon="question" tooltip="针对参加系统预售活动的订单赠送"/>
        </three-checkbox>
        <three-checkbox v-model="domain.setting.prepay">预付订单
          <tooltip-icon icon="question" tooltip="针对参加了预付定金的订单赠送"/>
        </three-checkbox>
        <el-checkbox v-model="domain.setting.prepayFirst" v-if="domain.setting.prepay">预付首付
          <tooltip-icon icon="question" tooltip="选中时在首付款赠送，未选时在尾款时赠送"/>
        </el-checkbox>
        <three-checkbox v-model="domain.setting.cod">到付订单
          <tooltip-icon icon="question" tooltip="针对货到付款的订单赠送"/>
        </three-checkbox>
        <el-checkbox v-model="domain.setting.matchSize">匹配尺码
          <tooltip-icon icon="question" tooltip="服装赠品赠送时优先匹配购买的服装尺码"/>
        </el-checkbox>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {Assert, ValidateRules} from '@/libs/util';
  import {ExpressSelector} from '@/modules/selector';
  import {GiftStrategyApi} from '@/modules/marketing/gift/api';

  export default {
    components: {ExpressSelector},
    data() {
      return {
        domain: {setting: {}},
        visible: false,
        rules: {
          'giftStrategyRuleName': ValidateRules.requiredMax,
          'ruleType': ValidateRules.required,
          'priorityNo': ValidateRules.requiredNumber,
          'setting.productRange': ValidateRules.required,
          'setting.giftType': ValidateRules.required,
          'setting.giveQuantity': ValidateRules.requiredNumber,
          'setting.alertMobile': ValidateRules.mobile,
          'setting.doublyType': ValidateRules.required,
          'setting.doublyNumber': ValidateRules.requiredNumber,
          'setting.maxDoubly': ValidateRules.requiredNumber,
          'setting.minAmount': ValidateRules.requiredNumber,
          'setting.maxAmount': ValidateRules.number,
          'setting.minProductQuantity': ValidateRules.requiredNumber,
          'setting.maxProductQuantity': ValidateRules.number,
          'setting.minQuantity': ValidateRules.requiredNumber,
          'setting.maxQuantity': ValidateRules.number,
          'setting.expressId': ValidateRules.required,
          'setting.luckBagGiveProductQuantity': ValidateRules.requiredNumber,
        }
      };
    },
    computed: {
      luckBag() {
        return this.domain && this.domain.ruleType === 'LUCK_BAG';
      },
      doublyTooltip() {
        if (this.domain) {
          let tip = '购买超过';
          switch (this.domain.ruleType) {
            case 'MONEY':
              tip += `${this.domain.setting.minAmount}元时，每多买${this.domain.setting.doublyNumber}元，`;
              break;
            case 'PRODUCT_QUANTITY':
              tip += `${this.domain.setting.minProductQuantity}款时，每多买${this.domain.setting.doublyNumber}款，`;
              break;
            case 'QUANTITY':
              tip += `${this.domain.setting.minQuantity}件时，每多买${this.domain.setting.doublyNumber}件，`;
              break;
            case 'LUCK_BAG':
              tip = '';
              break;
          }
          if (tip !== '') {
            tip += `加送一倍赠品，最多${this.domain.maxDoubly}倍`;
          }
          return tip;
        }
        return null;
      },
    },
    methods: {
      show(rule) {
        GiftStrategyApi.getRule(rule.giftStrategyId, rule.giftStrategyRuleId).then(data => {
          data.setting = JSON.parse(data.ruleSetting);
          this.domain = data;
          this.visible = true;
        });
      },
      close() {
        this.visible = false;
      },
      confirm() {
        this.$refs.editForm.validate().then(() => {
          this.domain.ruleSetting = JSON.stringify(this.domain.setting);
          GiftStrategyApi.modifyRule(this.domain.giftStrategyId, this.domain).then(() => {
            this.$emit('ok', this.domain);
            this.close();
          });
        });
      },
    }
  };
</script>