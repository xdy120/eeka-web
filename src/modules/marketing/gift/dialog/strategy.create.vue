<template>
  <el-dialog title="新增策略" :visible.sync="visible" width="800px" :before-close="dialogCloseConfirm">
    <el-form ref="editForm" :model="domain" :rules="rules">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本设置" name="1">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="策略名称" prop="giftStrategyName">
                <el-input v-model="domain.giftStrategyName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺" prop="storeIds">
                <store-selector v-model="domain.storeIds" multiple
                                @confirm="addStore"></store-selector>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="优先级" prop="priorityNo">
                <el-input v-model.number="domain.priorityNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="匹配时间" prop="timeType">
                <enum-selector v-model="domain.timeType" enum-name="TimeType"></enum-selector>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="开始时间" prop="beginTime">
                <go-date-time-picker v-model="domain.beginTime"></go-date-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="endTime">
                <go-date-time-picker v-model="domain.endTime"></go-date-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col>
              <el-form-item label="备注">
                <el-input v-model="domain.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="赠送规则" name="2">
          <template v-if="domain.giftStrategyType==='GROUP'">
            <div style="margin-bottom: 5px">
              <el-button @click="addRule">新增</el-button>
            </div>
            <el-table :data="strategyRules" :height="200">
              <el-table-column prop="giftStrategyRuleName" label="规则名称"></el-table-column>
              <go-enum-column prop="ruleType" enum-name="GiftStrategyRuleType"
                              label="规则类型"></go-enum-column>
              <go-quantity-column prop="priorityNo" label="优先级" width="80"></go-quantity-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <go-modify-button @click="editRule(scope.row)"></go-modify-button>
                  <go-copy-button @click="copyRule(scope.row)"></go-copy-button>
                  <go-delete-button
                      @click="strategyRules.splice(scope.$index,1)"></go-delete-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else>
            <el-form v-if="domain.rule">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="规则名称">
                    <el-input v-model="domain.rule.giftStrategyRuleName" readonly/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="规则类型">
                    <enum-show input v-model="domain.rule.ruleType"
                               enum-name="GiftStrategyRuleType"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="优先级">
                    <el-input v-model.number="domain.rule.priorityNo" :min="1" readonly/>
                  </el-form-item>
                </el-col>
              </el-row>
              <template v-if="domain.rule.setting!=='LUCK_BAG'">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="活动范围">
                      <enum-show input v-model="domain.rule.setting.productRange"
                                 enum-name="ProductRange"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="赠品类型">
                      <enum-show input v-model="domain.rule.setting.giftType"
                                 enum-name="GiftStrategyGiftType"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="赠送数量">
                      <el-input v-model.number="domain.rule.setting.giveQuantity" readonly/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="预警手机">
                      <el-input v-model="domain.rule.setting.alertMobile" readonly/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12" v-if="domain.rule.ruleType==='MONEY'">
                    <el-form-item label="最低金额">
                      <el-input v-model.number="domain.rule.setting.minAmount" readonly/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-else-if="domain.rule.ruleType==='PRODUCT_QUANTITY'">
                    <el-form-item label="最低款数">
                      <el-input v-model.number="domain.rule.setting.minProductQuantity"
                                readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-else-if="domain.rule.ruleType==='QUANTITY'">
                    <el-form-item label="最低件数">
                      <el-input v-model.number="domain.rule.setting.minQuantity"
                                readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" v-if="domain.rule.setting.doubly">
                    <el-form-item label="翻倍规则">
                      <enum-selector v-model="domain.rule.setting.doublyType"
                                     enum-name="GiftStrategyDoublyType"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <template v-if="domain.rule.setting.doubly">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <el-form-item label="翻倍额">
                        <el-input readonly v-model.number="domain.rule.setting.doublyNumber"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="最大倍数">
                        <el-input readonly v-model.number="domain.rule.setting.maxDoubly"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </template>
              <el-row :gutter="10" v-else>
                <el-col :span="12">
                  <el-form-item label="赠送款数">
                    <el-input readonly
                              v-model.number="domain.rule.setting.luckBagGiveProductQuantity"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-checkbox disabled v-model="domain.rule.setting.doubly"
                             v-if="domain.rule.setting.ruleType!=='LUCK_BAG'">翻倍
                  <tooltip-icon icon="question" tooltip="多买多送，用于买二送一，买四送二此类活动"/>
                </el-checkbox>
                <three-checkbox disabled v-model="domain.rule.setting.presell">预售订单
                  <tooltip-icon icon="question" tooltip="针对参加系统预售活动的订单赠送"/>
                </three-checkbox>
                <three-checkbox disabled v-model="domain.rule.setting.prepay">预付订单
                  <tooltip-icon icon="question" tooltip="针对参加了预付定金的订单赠送"/>
                </three-checkbox>
                <el-checkbox disabled v-model="domain.rule.setting.prepayFirst"
                             v-if="domain.rule.setting.prepay">预付首付
                  <tooltip-icon icon="question" tooltip="选中时在首付款赠送，未选时在尾款时赠送"/>
                </el-checkbox>
                <three-checkbox disabled v-model="domain.rule.setting.cod">到付订单
                  <tooltip-icon icon="question" tooltip="针对货到付款的订单赠送"/>
                </three-checkbox>
                <el-checkbox disabled v-model="domain.rule.setting.matchSize">匹配尺码
                  <tooltip-icon icon="question" tooltip="服装赠品赠送时优先匹配购买的服装尺码"/>
                </el-checkbox>
              </el-row>
            </el-form>
          </template>
        </el-collapse-item>
      </el-collapse>
      <strategy-rule-editor ref="ruleEditor"
                            :strategy-type="domain.giftStrategyType"></strategy-rule-editor>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button style="float: left" v-if="domain.giftStrategyType==='NORMAL'" @click="setRule">
        设置规则
      </el-button>
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<style>
  .el-collapse-item__content {
    padding-bottom: 5px;
  }
</style>
<script>
  import {Edit} from '@/libs/mixins';
  import {Assert, ValidateRules} from '@/libs/util';
  import {StoreSelector} from '@/modules/selector';
  import {GiftStrategyApi} from '../api';
  import {Rule} from '../view';
  import StrategyRuleEditor from './strategy.rule.edit';
  import {Strategy} from '../util';

  export default {
    mixins: [Edit],
    components: {StoreSelector, StrategyRuleEditor, Rule},
    data() {
      let validateStore = (rule, value, callback) => {
        if (Assert.isEmpty(this.domain.stores) || this.domain.stores.length === 0) {
          callback(new Error('不能为空'));
        } else {
          callback();
        }
      };

      return {
        pk: 'giftStrategyId',
        api: GiftStrategyApi,
        activeNames: ['1', '2'],
        strategyRules: [],
        rules: {
          giftStrategyName: ValidateRules.requiredMax,
          storeIds: {required: true, validator: validateStore},
          priorityNo: ValidateRules.requiredNumber,
          timeType: ValidateRules.required,
          beginTime: ValidateRules.required,
          endTime: ValidateRules.required
        }
      };
    },
    methods: {
      show(strategyType) {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
        this.domain = new Strategy(strategyType);
        this.visible = true;
      },
      addStore(stores) {
        this.domain.stores = [];
        if (!Assert.isEmpty(stores)) {
          stores.forEach(row => {
            let store = {};
            store.storeId = row.storeId;
            store.storeName = row.storeName;
            this.domain.stores.push(store);
          });
        }
      },
      addRule() {
        this.$refs.ruleEditor.show(null, rule => this.strategyRules.push(rule));
      },
      editRule(rule) {
        this.$refs.ruleEditor.show(rule, () => {
          if (!this.activeNames.some(x => x === '2')) {
            this.activeNames.push('2');
          }
        });
      },
      copyRule(rule) {
        this.$prompt('请输入规则名称', '提示', {
          inputValue: rule.giftStrategyRuleName,
          inputPattern: /\S+/,
          inputErrorMessage: '规则名称不能为空'
        }).then(({value}) => {
          let newRule = Object.assign({}, rule);
          newRule.giftStrategyRuleName = value;
          this.strategyRules.push(newRule);
        });
      },
      setRule() {
        this.$refs.ruleEditor.show(this.domain.rule, rule => {
          this.$set(this.domain, 'rule', rule);
        });
      },
      doSave() {
        if (this.domain.giftStrategyType === 'NORMAL') {
          if (Assert.isEmpty(this.domain.rule)) {
            this.$message.warning('请设置赠送规则');
            return;
          }
          this.domain.rules = [this.domain.rule];
          GiftStrategyApi.add(this.domain).then(this.confirm);
        } else {
          if (this.strategyRules.length === 0) {
            this.$message.warning('请设置赠送规则');
            return;
          }
          this.domain.rules = this.strategyRules;
          GiftStrategyApi.add(this.domain).then(this.confirm);
        }
      }
    }
  };
</script>
