<template>
  <el-dialog title="编辑赠送规则" :visible.sync="visible" width="800px" :before-close="dialogCloseConfirm"
             append-to-body>
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本规则"/>
      <el-step title="赠品"/>
      <el-step :title="productStepTitle" v-if="!luckBag && domain.setting.productRange!=='ALL'"/>
    </el-steps>
    <div v-show="stepTitle==='基本规则'">
      <el-form ref="editForm" :model="domain" :rules="rules" label-width="110px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="规则名称" prop="giftStrategyRuleName">
              <el-input v-model="domain.giftStrategyRuleName"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="规则类型" prop="ruleType">
              <enum-selector :filter-method="ruleTypeFilter" v-model="domain.ruleType"
                             enum-name="GiftStrategyRuleType"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="优先级" prop="priorityNo">
              <el-input v-model.number="domain.priorityNo" :readonly="luckBag"/>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="!luckBag">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="活动范围" prop="setting.productRange">
                <enum-selector v-model="domain.setting.productRange" enum-name="ProductRange"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赠品类型" prop="setting.giftType">
                <enum-selector v-model="domain.setting.giftType" enum-name="GiftStrategyGiftType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12" v-if="domain.setting.giftType === 'GOODS'">
              <el-form-item label="赠送数量" prop="setting.giveQuantity">
                <el-input v-model.number="domain.setting.giveQuantity"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="domain.setting.giftType === 'GOODS'">
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
    </div>
    <div v-show="stepTitle===productStepTitle">
      <el-button @click="addSku" style="margin-bottom: 5px">新增</el-button>
      <el-button style="margin-bottom: 5px" @click="showImportSku">导入</el-button>
      <el-table :data="domain.skus" :height="300">
        <el-table-column prop="productCode" label="商品编码"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="skuCode" label="规格编码"></el-table-column>
        <el-table-column prop="skuName" label="规格名称"></el-table-column>
        <go-boolean-column prop="combination" label="套装"></go-boolean-column>
        <el-table-column label="购买数量" width="100"
                         v-if="this.domain.setting.productRange === 'INCLUDE'">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="60px">
          <template slot-scope="scope">
            <go-delete-button @click="domain.skus.splice(scope.$index,1)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="stepTitle==='赠品'">
      <el-row :gutter="10" v-if="domain.setting.giftType==='EXPRESS'">
        <el-col :span="12">
          <el-form-item label="赠送快递" required>
            <express-selector v-model="domain.setting.expressId"
                              :express-name.sync="domain.setting.expressName"></express-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-else>
        <div>
          <el-button style="margin-bottom: 5px" @click="addGift">新增</el-button>
          <el-button style="margin-bottom: 5px" @click="showImportGift">导入</el-button>
        </div>
        <el-table :data="domain.gifts" :height="300" v-if="luckBag">
          <el-table-column prop="luckyCode" label="福袋编码" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.luckyCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="商品编码" width="100"></el-table-column>
          <el-table-column prop="productName" label="商品名称" width="100"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码" width="100"></el-table-column>
          <el-table-column prop="skuName" label="规格名称" width="100"></el-table-column>
          <go-boolean-column prop="combination" label="套装" width="60"></go-boolean-column>
          <el-table-column label="赠送数量" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="计划数量" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.planQuantity" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" fixed="right">
            <template slot-scope="scope">
              <go-delete-button @click="domain.gifts.splice(scope.$index,1)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="domain.gifts" :height="300" v-else>
          <el-table-column prop="productCode" label="商品编码" width="100"></el-table-column>
          <el-table-column prop="productName" label="商品名称" width="100"></el-table-column>
          <el-table-column prop="skuCode" label="规格编码" width="100"></el-table-column>
          <el-table-column prop="skuName" label="规格名称" width="100"></el-table-column>
          <go-boolean-column prop="combination" label="套装" width="60"></go-boolean-column>
          <el-table-column label="赠品总数量" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.planQuantity" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="每次赠送数量" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="预警数量" width="100">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.alertQuantity" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" fixed="right">
            <template slot-scope="scope">
              <go-delete-button @click="domain.gifts.splice(scope.$index,1)"></go-delete-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <sku-selector ref="skuSelector" :display="false"></sku-selector>
    <sku-importer ref="skuImporter" :must-columns="mustColumns"
                  :templateUrl="templateUrl"></sku-importer>
    <div slot="footer" class="dialog-footer">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {ExpressSelector, SkuSelector} from '@/modules/selector';
  import {Steps} from '@/libs/mixins';
  import {Assert, ValidateRules} from '@/libs/util';
  import {MustStrategyBlessingColumns, MustStrategyProductColumns} from '../api';
  import {
    StrategyGift,
    StrategyProduct,
    StrategyRule,
    StrategyRuleContent,
    StrategyRuleLuckBagContent
  } from '../util';
  import {SkuImporter} from '@/modules/product';

  export default {
    components: {ExpressSelector, SkuSelector, SkuImporter},
    mixins: [Steps],
    props: {
      strategyType: {
        type: String
      }
    },
    watch: {
      strategyType(val) {
        this.iStrategyType = val;
      }
    },
    data() {
      return {
        iStrategyType: this.strategyType,
        domain: this.createDomain(),
        stepTitle: '基本规则',
        visible: false,
        ruleContent: new StrategyRuleContent(),
        ruleLuckBagContent: new StrategyRuleLuckBagContent(),
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
        },
        templateUrl: '',
        mustColumns: MustStrategyProductColumns,
      };
    },
    computed: {
      productStepTitle() {
        return this.domain.setting.productRange === 'INCLUDE' ? '包含商品' : '排除商品';
      },
      ruleTypeFilter() {
        return this.iStrategyType === 'GROUP' ? function (map) {
          let value = {};
          for (let key of Object.keys(map)) {
            if (key !== 'LUCK_BAG') {
              value[key] = map[key];
            }
          }
          return value;
        } : null;
      },
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
      createDomain() {
        let rule = new StrategyRule();
        rule.setting = this.luckBag ? new StrategyRuleLuckBagContent() : new StrategyRuleContent();
        return rule;
      },
      show(rule, cb) {
        this.cb = cb;
        this.step = 0;
        if (rule) {
          this.domain = rule;
        } else {
          this.domain = this.createDomain();
        }
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      confirm() {
        if (this.luckBag) {
          this.domain.priorityNo = 9999;
        }
        this.domain.ruleSetting = JSON.stringify(this.domain.setting);
        if (this.cb) {
          this.cb(this.domain);
        }
        this.$emit('ok', this.domain);
        this.close();
      },
      nextStep() {
        switch (this.stepTitle) {
          case '基本规则':
            this.$refs.editForm.validate().then(() => this.next(this.confirm));
            return;
          case '包含商品':
          case '排除商品':
            if (this.domain.skus.length === 0) {
              this.$message.warning('请填写活动商品信息');
              return;
            }
            let skuCheckFlag = true;
            this.domain.skus.forEach(sku => {
              if (Assert.isEmpty(sku.quantity)) {
                this.$message.error('请填写 {' + sku.skuName + ',' + sku.skuCode
                  + '} 的购买数量');
                skuCheckFlag = false;
              }
            });
            if (!skuCheckFlag) {
              return;
            }
            break;
          case '赠品':
            if (this.domain.setting.giftType === 'EXPRESS') {
              if (Assert.isEmpty(this.domain.setting.expressId)) {
                this.$message.warning('请选择');
                return;
              }
            }
            else {
              if (this.domain.gifts.length === 0) {
                this.$message.warning('请填写赠品信息');
                return;
              }
              let giftCheckFalg = true;
              this.domain.gifts.forEach(gift => {
                if (Assert.isEmpty(gift.alertQuantity)) {
                  this.$message.error('请填写 {' + gift.skuName + ',' + gift.skuCode
                    + '} 的预警数量');
                  giftCheckFalg = false;
                }
                if (Assert.isEmpty(gift.planQuantity)) {
                  this.$message.error('请填写 {' + gift.skuName + ',' + gift.skuCode
                    + '} 的计划数量');
                  giftCheckFalg = false;
                }
                if (Assert.isEmpty(gift.quantity)) {
                  this.$message.error('请填写 {' + gift.skuName + ',:' + gift.skuCode
                    + '} 的赠送数量');
                  giftCheckFalg = false;
                }
              });
              if (!giftCheckFalg) {
                return;
              }
            }
            break;
        }
        this.next(this.confirm);
      },
      addSku() {
        this.$refs.skuSelector.showDialog({
          onSelected: skus => {
            skus.forEach(sku => {
              this.domain.skus.push(new StrategyProduct(sku));
            });
          }
        });
      },
      addGift() {
        this.$refs.skuSelector.showDialog({
          onSelected: skus => {
            skus.forEach(sku => {
              this.domain.gifts.push(new StrategyGift(sku));
            });
          }
        });
      },
      showImportSku() {
        this.template('strategy_product.xlsx/赠品策略-商品导入模板');
        this.mustColumns = MustStrategyProductColumns;
        this.$refs.skuImporter.show(skus => {
          return new Promise(resolve => {
            for (let sku of skus) {
              let product = new StrategyProduct(sku);
              product.planQuantity = Number.parseInt(sku['计划数量']);
              product.quantity = Number.parseInt(sku['赠送数量']);
              product.alertQuantity = Number.parseInt(sku['预警数量']);
              this.domain.skus.push(product);
            }
            resolve();
          });
        });
      },
      showImportGift() {
        if (this.luckBag) {
          this.template('strategy_blessing.xlsx/赠品策略-福袋导入模板');
          this.mustColumns = MustStrategyBlessingColumns;
        } else {
          this.template('strategy_product.xlsx/赠品策略-商品导入模板');
          this.mustColumns = MustStrategyProductColumns;
        }
        this.$refs.skuImporter.show(skus => {
          return new Promise(resolve => {
            for (let sku of skus) {
              let gift = new StrategyGift(sku);
              gift.planQuantity = Number.parseInt(sku['计划数量']);
              gift.quantity = Number.parseInt(sku['赠送数量']);
              gift.luckyCode = sku['福袋编码'];
              gift.alertQuantity = sku['预警数量'];
              this.domain.gifts.push(gift);
            }
            resolve();
          });
        });
      },
      template(url) {
        this.templateUrl = '';
        this.templateUrl = '/file/template/' + url;
      }
    }
  };
</script>