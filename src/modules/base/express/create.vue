<template>
  <el-dialog :title="title" :visible.sync="visible" width="600" :before-close="dialogCloseConfirm">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="110px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="快递名称" prop="expressName">
            <el-input v-model="domain.expressName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="快递编码" prop="expressCode">
            <el-input v-model="domain.expressCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="标准快递" prop="globalExpressId">
            <global-express-selector v-model="domain.globalExpressId"
                                     :globalExpressName.sync="domain.globalExpressName"></global-express-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="快递类型" prop="expressType">
            <enum-selector v-model="domain.expressType" enum-name="ExpressType"></enum-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="到付类型" prop="codType">
            <enum-selector v-model="domain.codType" enum-name="CodType"></enum-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="快递用途" prop="expressUse">
            <enum-selector v-model="domain.expressUse" enum-name="ExpressUse"></enum-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="网点电话" prop="telephone">
            <el-input v-model="domain.telephone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="快递排序" prop="orderId">
            <el-input-number v-model="domain.orderId"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="checkRegion" label-width="70px">
            <el-checkbox v-model="domain.checkRegion">校验范围</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="面单类型" prop="waybillType">
            <enum-selector v-model="domain.waybillType" enum-name="WaybillType"></enum-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="waybill">
          <el-form-item label="订购店铺" prop="setting.storeId">
            <store-selector v-model="domain.setting.storeId" :mallTypes="mallTypes"
                            :store-name.sync="domain.setting.storeName"></store-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="waybill">
        <el-col :span="12">
          <el-form-item label="发件人" prop="setting.senderContact">
            <el-input v-model="domain.setting.senderContact"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="waybill">
        <el-col :span="12">
          <el-form-item label="发件人手机" prop="setting.senderMobile">
            <el-input v-model="domain.setting.senderMobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发件人电话" prop="setting.senderTelephone">
            <el-input v-model="domain.setting.senderTelephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="waybill">
        <el-col :span="12">
          <el-form-item label="发件人区域" prop="setting.districtId">
            <region-selector :countryId.sync="domain.setting.countryId"
                             :provinceId.sync="domain.setting.provinceId"
                             :cityId.sync="domain.setting.cityId"
                             :districtId.sync="domain.setting.districtId"
                             :countryName.sync="domain.setting.countryName"
                             :provinceName.sync="domain.setting.provinceName"
                             :cityName.sync="domain.setting.cityName"
                             :districtName.sync="domain.setting.districtName"></region-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发件人地址" prop="setting.senderAddress">
            <el-input v-model="domain.setting.senderAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="domain.waybillType === 'JD'">
        <el-col :span="12">
          <el-form-item label="快递公司类型" prop="setting.providerType">
            <enum-selector v-model="domain.setting.providerType"
                           enum-name="JdWaybillProviderType"></enum-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发货网点编码" prop="setting.branchCode"
                        v-if="domain.setting.providerType === 'JOIN'">
            <el-input v-model="domain.setting.branchCode"></el-input>
          </el-form-item>
          <el-form-item label="财务结算编码" prop="setting.settlementCode" v-else>
            <el-input v-model="domain.setting.settlementCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="网点地址" prop="address">
        <el-input v-model="domain.address"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="domain.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save()">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Assert, ValidateRules} from '@/libs/util';
  import {Edit} from '@/libs/mixins';
  import {ExpressApi} from './api';
  import {GlobalExpressSelector} from '@/modules/admin/index';
  import {RegionSelector, StoreSelector} from '@/modules/selector';

  export default {
    name: 'ExpressCreator',
    mixins: [Edit],
    components: {
      StoreSelector,
      GlobalExpressSelector,
      RegionSelector
    },
    props: {
      title: {
        type: String,
        default: '新增'
      }
    },
    data() {
      let validatePhone = (rule, value, callback) => {
        if (Assert.isBlank(this.domain.setting.senderMobile) &&
          Assert.isBlank(this.domain.setting.senderTelephone)) {
          callback(new Error('手机和电话至少填一个'));
        } else {
          callback();
        }
      };
      return {
        api: ExpressApi,
        pk: 'expressId',
        standards: [],
        waybill: false,
        mallTypes: [],
        rules: {
          expressName: {required: true, max: 10, message: '快递名称[1-10]不能为空', trigger: 'manual'},
          expressCode: {required: true, max: 10, message: '快递编码[1-10]不能为空', trigger: 'manual'},
          globalExpressId: ValidateRules.required,
          codType: ValidateRules.required,
          expressUse: ValidateRules.required,
          expressType: ValidateRules.required,
          address: ValidateRules.remark,
          remark: ValidateRules.remark,
          waybillType: ValidateRules.required,
          'setting.storeId': ValidateRules.required,
          'setting.providerType': ValidateRules.required,
          'setting.branchCode': ValidateRules.required,
          'setting.settlementCode': ValidateRules.required,
          'setting.senderContact': ValidateRules.required,
          'setting.senderMobile': [ValidateRules.mobile, {validator: validatePhone}],
          'setting.senderTelephone': [ValidateRules.telephone, {validator: validatePhone}],
          'setting.senderAddress': ValidateRules.required,
          'setting.districtId': ValidateRules.required
        },
      };
    },
    watch: {
      'domain.waybillType': function () {
        if (this.domain.waybillType === 'NONE' || this.domain.waybillType === null
          || this.domain.waybillType === undefined) {
          this.waybill = false;
          this.mallTypes = [];
        } else {
          this.waybill = true;
          if (this.domain.waybillType === 'JD') {
            this.mallTypes = ['JD'];
          } else {
            this.mallTypes = ['TMALL', 'TAOBAO', 'TAOBAO_FX', 'TAOBAO_JX'];
          }
        }
      }
    },
    methods: {
      genDefaultDomain() {
        return {setting: {}};
      },
      doSave() {
        let params2 = {expressCode: this.domain.expressCode, page: 1, pageSize: 1};
        this.domain.waybillSetting = JSON.stringify(this.domain.setting);
        ExpressApi.list(params2).then(
          () => {
            if (this.domain.expressId) {
              ExpressApi.modify(
                this.domain.expressId,
                this.domain
              ).then(() => {
                this.visible = false;
                this.$message.success('修改快递成功');
                this.$emit('ok', this.domain);
              });
            } else {
              ExpressApi.add(this.domain).then(() => {
                this.visible = false;
                this.$message.success('新增快递成功');
                this.$emit('ok', this.domain);
              });
            }
          }
        );
      },
    },
  };
</script>