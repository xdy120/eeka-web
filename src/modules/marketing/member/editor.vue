<template>
  <el-dialog title="会员" :visible.sync="visible">
    <el-form ref="editForm" :model="domain" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="昵称" prop="memberName">
            <el-input v-model="domain.memberName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <enum-selector enum-name="SexType" v-model="domain.sex"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <enum-selector enum-name="MemberStatus" v-model="domain.status"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="支付账号">
            <el-input v-model="domain.paymentAccount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="店铺" prop="storeId">
            <store-selector v-model="domain.storeId" :storeName.sync="domain.storeName"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮编">
            <el-input v-model="domain.zipcode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="联系人">
            <el-input v-model="domain.contact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="domain.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="domain.telephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="区域">
            <region-selector :countryId.sync="domain.countryId" :provinceId.sync="domain.provinceId"
                             :cityId.sync="domain.cityId" :districtId.sync="domain.districtId"
                             :countryName.sync="domain.countryName"
                             :provinceName.sync="domain.provinceName"
                             :cityName.sync="domain.cityName"
                             :districtName.sync="domain.districtName"></region-selector>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="地址">
            <el-input v-model="domain.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-checkbox v-model="domain.urgent">加急发货</el-checkbox>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
            <el-button @click="save">确定</el-button>
        </span>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {RegionSelector, StoreSelector} from '@/modules/selector';
  import {ValidateRules} from '@/libs/util';
  import {MemberApi} from './api';

  export default {
    mixins: [Edit],
    components: {
      StoreSelector,
      RegionSelector
    },
    data() {
      return {
        api: MemberApi,
        pk: 'memberId',
        rules: {
          memberName: ValidateRules.requiredMax,
          sex: ValidateRules.required,
          status: ValidateRules.required,
          storeId: ValidateRules.required,
          mobile: ValidateRules.mobile,
          telephone: ValidateRules.telephone
        }
      };
    },
    methods: {
      save() {
        if (this.domain.urgent == null) {
          this.domain.urgent = 0;
        }
        if (this.$refs.editForm) {
          this.$refs.editForm.validate().then(() => {
            this.doSave();
          });
        } else {
          this.doSave();
        }
      }
    }
  };
</script>
