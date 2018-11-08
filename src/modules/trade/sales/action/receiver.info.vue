<template>
  <el-dialog title="修改地址" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="收货人" prop="contact">
        <el-input v-model="domain.contact"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="domain.mobile"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="domain.telephone"></el-input>
      </el-form-item>
      <el-form-item label="收货区域" prop="districtId">
        <region-selector :countryId.sync="domain.countryId" :provinceId.sync="domain.provinceId"
                         :cityId.sync="domain.cityId" :districtId.sync="domain.districtId"
                         :countryName.sync="domain.countryName"
                         :provinceName.sync="domain.provinceName"
                         :cityName.sync="domain.cityName"
                         :districtName.sync="domain.districtName"></region-selector>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="domain.address"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Assert, ValidateRules} from '@/libs/util';
  import {RegionSelector} from '@/modules/selector';
  import {SalesOrderApi} from '../api';

  export default {
    mixins: [Edit],
    components: {RegionSelector},
    data() {
      var validatePhone = (rule, value, callback) => {
        if (Assert.isBlank(this.domain.mobile) && Assert.isBlank(this.domain.telephone)) {
          callback(new Error('手机和电话至少填一个'));
        } else {
          callback();
        }
      };
      return {
        rules: {
          contact: ValidateRules.requiredMax,
          mobile: [ValidateRules.mobile, {validator: validatePhone}],
          telephone: [ValidateRules.telephone, {validator: validatePhone}],
          districtId: ValidateRules.required,
          address: ValidateRules.required,
        }
      };
    },
    methods: {
      show(order) {
        SalesOrderApi.decrypt(order.salesOrderId).then(result => {
          this.domain = Object.assign({}, result);
          this.visible = true;
        });
      },
      save() {
        this.$refs.editForm.validate().then(() => {
          this.doSave();
        });
      },
      doSave() {
        SalesOrderApi.modifyReceiverInfo(this.domain).then(this.confirm);
      }
    }
  };
</script>