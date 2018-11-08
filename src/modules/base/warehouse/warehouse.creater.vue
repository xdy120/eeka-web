<template>
  <el-dialog title="实体仓" :visible.sync="visible" width="600" :before-close="dialogCloseConfirm">
    <el-form :model="domain" label-width="100px" :rules="rules" ref="editForm">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="实体仓编码" prop="warehouseCode">
            <el-input v-model="domain.warehouseCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实体仓名称" prop="warehouseName">
            <el-input v-model="domain.warehouseName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="外部编码">
            <el-input v-model="domain.outerCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="货主编码">
            <el-input v-model="domain.ownerCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="仓库类型" prop="warehouseType">
            <enum-selector v-model="domain.warehouseType" enum-name="WarehouseType"></enum-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面单策略" prop="waybillStrategy">
            <enum-selector v-model="domain.waybillStrategy"
                           enum-name="WaybillStrategy"></enum-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="品牌">
            <data-dict-item-selector v-model="domain.brandNames" :code.sync="domain.brandCodes"
                                     data-dict-id="10101" multiple></data-dict-item-selector>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物流接口">
            <wms-app-selector v-model="domain.wmsAppId"></wms-app-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="domain.mobile"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="domain.telephone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="联系人">
            <el-input v-model="domain.contact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域">
            <region-selector :countryId.sync="domain.countryId" :provinceId.sync="domain.provinceId"
                             :cityId.sync="domain.cityId" :districtId.sync="domain.districtId"
                             :countryName.sync="domain.countryName"
                             :provinceName.sync="domain.provinceName"
                             :cityName.sync="domain.cityName"
                             :districtName.sync="domain.districtName"></region-selector>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="地址">
            <el-input v-model="domain.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item>
            <el-checkbox v-model="domain.matchRegion"></el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="submit('editForm')">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {WarehouseApi} from './api';
  import {DataDictItemSelector, RegionSelector, WmsAppSelector} from '@/modules/selector';

  export default {
    mixins: [Edit],
    components: {DataDictItemSelector, RegionSelector, WmsAppSelector},
    data() {
      return {
        pk: 'warehouseId',
        api: WarehouseApi,
        rules: {
          warehouseCode: ValidateRules.requiredMax,
          warehouseName: ValidateRules.requiredMax,
          waybillStrategy: ValidateRules.required,
          warehouseType: ValidateRules.required,
          mobile: ValidateRules.mobile,
          telephone: ValidateRules.telephone
        }
      };
    },
    methods: {
      submit(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.domain.warehouseId) {
              WarehouseApi.modify(this.domain.warehouseId, this.domain).then(() => {
                this.$message.success('修改仓库成功');
                this.visible = false;
                this.$emit('ok', this.domain);
              });
            } else {
              this.domain.virtualWarehouses = [
                {
                  virtualWarehouseCode: `${this.domain.warehouseCode}-SHARE`,
                  virtualWarehouseName: `${this.domain.warehouseName}-共享`,
                  virtualWarehouseType: 'SHARE'
                }];
              WarehouseApi.add(this.domain).then(() => {
                this.$message.success('新增仓库成功');
                this.visible = false;
                this.$emit('ok', this.domain);
              });
            }
          }
        });
      }
    }
  };
</script>