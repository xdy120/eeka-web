<template>
  <el-dialog title="店铺编辑" :visible.sync="visible" :before-close="dialogCloseConfirm" width="600px">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"/>
      <el-step title="店铺设置"/>
      <el-step title="淘系设置" v-if="Ali"/>
      <el-step title="京东设置" v-if="JD"/>
      <el-step title="唯品设置" v-if="VIP"/>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <el-form :model="domain" :rules="storeRules" ref="editForm" label-width="110px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="编码" prop="storeCode">
              <el-input v-model="domain.storeCode" :disabled="domain.storeId!==undefined"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="storeName">
              <el-input v-model="domain.storeName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="卖家昵称" prop="nickname">
              <el-input v-model="domain.nickname"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司" prop="company">
              <company-selector v-model="domain.companyId" :company-name.sync="domain.companyName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="手机号码">
              <el-input v-model="domain.mobile"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码">
              <el-input v-model="domain.telephone"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="商城类型" prop="mallType">
              <enum-selector v-model="domain.mallType" enum-name="MallType"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商城应用">
              <mall-app-selector v-model="domain.mallAppId"
                                 :mall-type="domain.mallType"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="授权码">
              <el-input v-model="domain.accessToken"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="令牌码">
              <el-input v-model="domain.refreshToken"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="domain.remark" type="textarea" :rows="2"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-show="stepTitle==='店铺设置'">
      <el-form :model="setting" :rules="settingRules" ref="settingForm" label-width="110px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="默认发货仓库" prop="defaultWarehouse">
              <virtual-warehouse-selector v-model="setting.defaultWarehouse"
                                          :virtual-warehouse-name.sync="setting.defaultWarehouseName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认退货仓库" prop="defaultReturnWarehouse">
              <virtual-warehouse-selector v-model="setting.defaultReturnWarehouse"
                                          :virtual-warehouse-name.sync="setting.defaultReturnWarehouseName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="审单策略" prop="auditStrategy">
              <order-audit-strategy-selector v-model="setting.auditStrategy"
                                             :order-strategy-name.sync="setting.auditStrategyName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存策略" prop="stockStrategy">
              <stock-dispatch-setting-selector v-model="setting.stockStrategy"
                                               :stock-dispatch-strategy-name.sync="setting.stockStrategyName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="配货模式" prop="dispatchMode">
              <enum-selector enum-name="DispatchMode" v-model="setting.dispatchMode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="铺货规则" prop="productMappingType">
              <enum-selector enum-name="ProductMappingRule"
                             v-model="setting.productMappingType"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="默认支付方式" prop="defaultPayType">
              <enum-selector v-model="setting.defaultPayType" enum-name="PayType"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认币种" prop="defaultCurrencyCode">
              <data-dict-item-selector v-model="setting.defaultCurrencyCode"
                                       dataDictId="10201"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="最大合单量">
              <el-input v-model="setting.maxMerge"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--<el-form-item label="超时发货预警">-->
            <!--<el-input placeholder="请输入内容" v-model="setting.deliveryTimeoutWarning">-->
            <!--<template slot="append">小时</template>-->
            <!--</el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="配货延迟分钟">
              <el-select v-model="setting.delayMinutes">
                <el-option :value="0">不等待</el-option>
                <el-option :value="30">30分钟</el-option>
                <el-option :value="45">45分钟</el-option>
                <el-option :value="60">1小时</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-checkbox v-model="setting.presellPriority">预售有货先发</el-checkbox>
            <el-checkbox v-model="setting.autoProductMapping">自动下载铺货</el-checkbox>
            <el-checkbox v-model="setting.autoReviewExchangeOrder">自动复核换货单</el-checkbox>
            <el-checkbox v-model="setting.exchangeDifferentSpu">允许换不同款</el-checkbox>
            <el-checkbox v-model="setting.enablePrepayOrder">启用预付款订单</el-checkbox>
            <el-checkbox v-model="setting.onlyGiftShipping">赠品允许单独发货</el-checkbox>
            <!--<el-checkbox v-model="setting.pushToWarehouse">订单推送仓库</el-checkbox>-->
            <!--<el-checkbox v-model="setting.autoInvoic">自动开电子发票</el-checkbox>-->
            <!--<el-checkbox v-model="setting.logisticsPremium">物流保价</el-checkbox>-->
          </el-col>

        </el-row>
      </el-form>
    </div>
    <div v-show="stepTitle==='淘系设置'">
      <el-form label-width="110px">
        <el-row :gutter="10">
          <el-form-item label="退货地址">
            <return-address-selector v-model="setting.taobaoReturnAddressId"
                                     :addr.sync="setting.taobaoReturnAddress"
                                     :flag=stepTitle
                                     :store=domain
                                     placeholder="请选择">
            </return-address-selector>
          </el-form-item>
        </el-row>
        <el-row :gutter="10">
          <el-form-item label="退货留言">
            <el-input placeholder="请输入内容" v-model="setting.taobaoReturnMemo">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="10">
          <el-checkbox v-model="setting.taobaoOrderCloudPush">订单云推</el-checkbox>
          <el-checkbox v-model="setting.taobaoProductCloudPush">商品云推</el-checkbox>
          <el-checkbox v-model="setting.taobaoEnableAG">启用AG</el-checkbox>
          <el-checkbox v-model="setting.taobaoAutoAuditRefund">自动审核仅退款申请</el-checkbox>
          <el-checkbox v-model="setting.taobaoAutoAgreeRefund">自动同意退货退款申请</el-checkbox>
          <el-checkbox v-model="setting.taobaoAutoAuditExchange">自动同意换货申请</el-checkbox>
          <el-checkbox v-model="setting.taobaoExchangeBeforeOccupancy">换货提前占用</el-checkbox>
          <el-checkbox v-model="setting.taobaoAutoGiftChecking">识别平台赠品</el-checkbox>
        </el-row>
      </el-form>
    </div>
    <div v-show="stepTitle==='京东设置'">
      <el-form label-width="110px" :model="setting" :rules="jdRules" ref="jdForm">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="商家编码" prop="vendorCode">
              <el-input v-model="setting.vendorCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="vendorName">
              <el-input v-model="setting.vendorName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="京东模式">
              <enum-selector enum-name="JingdongMode" v-model="setting.jingdongMode"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-show="stepTitle==='唯品设置'">
      <el-form label-width="110px">
        <el-row :gutter="10">
          <el-col :span=12>
            <el-form-item label="供应商编号">
              <el-input v-model="setting.vipVendorId"/>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label="常态合作编码">
              <el-input v-model="setting.vipCooperationNo"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {StoreApi} from './api';
  import {Assert, ValidateRules} from '@/libs/util';
  import {Edit, Steps} from '@/libs/mixins';
  import {
    CompanySelector,
    DataDictItemSelector,
    MallAppSelector,
    OrderAuditStrategySelector,
    ReturnAddressSelector,
    StockDispatchSettingSelector,
    VirtualWarehouseSelector
  } from '@/modules/selector';

  const ALI_TYPE = ['TAOBAO', 'TMALL', 'TMALL_HK', 'TAOBAO_FX', 'TAOBAO_JX'];
  const JD_TYPE = ['JD'];
  const VIP_TYPE = ['VIP'];
  export default {
    components: {
      VirtualWarehouseSelector,
      CompanySelector,
      DataDictItemSelector,
      MallAppSelector,
      StockDispatchSettingSelector,
      OrderAuditStrategySelector,
      ReturnAddressSelector
    },
    name: 'StoreEdit',
    mixins: [Edit, Steps],
    data() {
      return {
        pk: 'storeId',
        api: StoreApi,
        setting: {},
        stepTitle: '基本信息',
        storeRules: {
          storeCode: ValidateRules.code,
          storeName: ValidateRules.name,
          nickname: ValidateRules.requiredMax,
          mallType: ValidateRules.required
        },
        settingRules: {
          defaultWarehouse: ValidateRules.required,
          defaultReturnWarehouse: ValidateRules.required,
          auditStrategy: ValidateRules.required,
          stockStrategy: ValidateRules.required,
          dispatchMode: ValidateRules.required,
          productMappingType: ValidateRules.required,
          defaultPayType: ValidateRules.required,
        },
        jdRules: {
          vendorCode: ValidateRules.required,
          vendorName: ValidateRules.required
        }
      };
    },
    computed: {
      Ali() {
        return Assert.inArray(this.domain.mallType, ALI_TYPE);
      },
      JD() {
        return Assert.inArray(this.domain.mallType, JD_TYPE);
      },
      VIP() {
        return Assert.inArray(this.domain.mallType, VIP_TYPE);
      }
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => this.next());
            return;
          case '店铺设置':
            this.$refs.settingForm.validate().then(() => this.next());
            return;
          case '京东设置':
            this.$refs.jdForm.validate().then(() => this.next());
            return;
          default:
            this.next();
            break;
        }
      },
      show(store) {
        this.step = 0;
        if (store) {
          StoreApi.get(store.storeId).then(data => {
            this.domain = data;
            this.setting = data.setting;
            this.visible = true;
          });
        } else {
          this.domain = {};
          this.setting = {
            delayMinutes: 30,
          };
          if (this.$refs.editForm) {
            this.$refs.editForm.resetFields();
          }
          this.visible = true;
        }
      },
      save() {
        this.$refs.settingForm.validate().then(() => {
          this.domain.settingJson = JSON.stringify(this.setting);
          this.doSave();
        });
      }
    }
  };
</script>