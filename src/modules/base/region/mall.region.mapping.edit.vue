<template>
  <el-dialog :title=title :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="110px">
      <el-form-item label="商城区域名称" prop="mallRegionAlias">
        <el-tooltip class="item" effect="dark" content="名称之间用“>”连接，如：广东>深圳>罗湖"
                    placement="top">
          <el-input v-model="domain.mallRegionAlias" controls-position="right"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="对应区域" prop="districtId">
        <region-selector :countryId.sync="domain.countryId" :provinceId.sync="domain.provinceId"
                         :cityId.sync="domain.cityId" :districtId.sync="domain.districtId"
                         :countryName.sync="domain.countryName"
                         :provinceName.sync="domain.provinceName"
                         :cityName.sync="domain.cityName"
                         :districtName.sync="domain.districtName"></region-selector>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {ValidateRules} from '@/libs/util';
  import {MallRegionMappingApi} from './api';
  import {RegionSelector} from '@/modules/selector';

  export default {
    name: 'MallRegionMappingEditor',
    components: {RegionSelector},
    mixins: [Edit],
    props: {
      title: {
        type: String,
        default: '新增'
      }
    },
    data() {
      return {
        pk: 'mallRegionMappingId',
        api: MallRegionMappingApi,
        rules: {
          mallRegionAlias: ValidateRules.required,
          districtId: ValidateRules.required
        }
      };
    },
    methods: {
      show(id) {
        if (id) {
          MallRegionMappingApi.get(id).then(result => {
            this.domain = Object.assign({}, result);
            this.title = '编辑';
            this.visible = true;
          });
        } else {
          this.title = '新增';
          this.domain = {};
          this.visible = true;
        }
      }
    }
  };
</script>