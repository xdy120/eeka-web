<template>
  <div>
    <div style="margin-bottom: 5px" v-if="canEdit">
      <el-button @click="editRule">设置规则</el-button>
    </div>
    <div class="oms-search" :style="heightStyle">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="规则名称">
              <el-input v-model="rule.giftStrategyRuleName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规则类型">
              <enum-show v-model="rule.ruleType" input enum-name="GiftStrategyRuleType"></enum-show>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级">
              <el-input v-model="rule.priorityNo" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="domain.ruleType!=='LUCK_BAG'">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="活动范围">
                <enum-show v-model="rule.setting.productRange" input
                           enum-name="ProductRange"></enum-show>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="赠品类型">
                <enum-show v-model="rule.setting.giftType" input
                           enum-name="GiftStrategyGiftType"></enum-show>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="赠送数量">
                <el-input v-model="rule.setting.giveQuantity" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8" v-if="rule.ruleType==='MONEY'">
              <el-form-item label="最低金额">
                <el-input v-model="rule.setting.minAmount" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-else-if="rule.ruleType==='PRODUCT_QUANTITY'">
              <el-form-item label="最低款数">
                <el-input v-model="rule.setting.minProductQuantity" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-else-if="rule.ruleType==='QUANTITY'">
              <el-form-item label="最低件数">
                <el-input v-model="rule.setting.minQuantity" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="预警手机">
                <el-input v-model="rule.setting.alertMobile" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="rule.setting.doubly">
              <el-form-item label="翻倍规则">
                <enum-show v-model="rule.setting.doublyType" input
                           enum-name="GiftStrategyDoublyType"></enum-show>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="rule.setting.doubly">
            <el-col :span="8">
              <el-form-item label="翻倍额">
                <el-input v-model="rule.setting.doublyNumber" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最大倍数">
                <el-input v-model="rule.setting.maxDoubly" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row v-else>
          <el-col :span="8">
            <el-form-item label="赠送款数">
              <el-input v-model="rule.setting.luckBagGiveProductQuantity" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-checkbox v-model="rule.setting.doubly" disabled v-if="domain.ruleType!=='LUCK_BAG'">
            翻倍
          </el-checkbox>
          <three-checkbox v-model="rule.setting.presell" disabled>预售订单</three-checkbox>
          <three-checkbox v-model="rule.setting.prepay" disabled>预付订单</three-checkbox>
          <el-checkbox v-model="rule.setting.prepayFirst" v-if="rule.setting.prepay" disabled>预付首付
          </el-checkbox>
          <three-checkbox v-model="rule.setting.cod" disabled>到付订单</three-checkbox>
          <el-checkbox v-model="rule.setting.matchSize" disabled>匹配尺码</el-checkbox>
        </el-row>
      </el-form>
      <strategy-rule-basic-editor ref="ruleBasicEditor" @ok="editOk"></strategy-rule-basic-editor>
    </div>
  </div>
</template>

<script>
  import {TableResize, Tabs} from '@/libs/mixins';
  import {Gift} from '@/modules/marketing/gift/mixin';
  import {StrategyRuleBasicEditor} from '../dialog';

  export default {
    mixins: [TableResize, Tabs, Gift],
    components: {StrategyRuleBasicEditor},
    data() {
      return {
        tab: 'rule',
        domain: {},
        rule: {setting: {}}
      };
    },
    computed: {
      heightStyle() {
        return {
          height: `${this.canEdit ? this.tabsMinTableHeight : this.tabsTableHeight}px`
        };
      }
    },
    methods: {
      search() {
        if (this.parentData && this.parentData.rule) {
          this.domain = this.parentData;
          this.rule = this.parentData.rule;
        }
      },
      editRule() {
        this.$refs.ruleBasicEditor.show(this.rule);
      },
      editOk(rule) {
        this.rule = rule;
        this.parentData.rule = rule;
      }
    }
  };
</script>