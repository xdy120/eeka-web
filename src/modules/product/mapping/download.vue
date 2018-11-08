<template>
  <el-dialog title="铺货下载" :visible.sync="visible" :before-close="dialogCloseConfirm" width="450px">
    <el-form :model="domain" label-width="100px" :rules="rules" ref="editForm">
      <el-form-item label="店铺" prop="storeId">
        <store-selector v-model="domain.storeId"></store-selector>
      </el-form-item>
      <el-form-item label="商品状态">
        <enum-selector v-model="domain.mallProductStatus"
                       enum-name="MallProductStatus"></enum-selector>
      </el-form-item>
      <el-form-item label="商城商品ID" v-show="!isAllDown">
        <el-input type="textarea" :rows="2" v-model="domain.mallProductId"></el-input>
      </el-form-item>
      <el-form-item label="商家商品编码" v-show="!isAllDown">
        <el-input type="textarea" :rows="2" v-model="domain.mallProductOutCode"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" v-show="isAllDown">
        <go-date-time-picker v-model="domain.beginTime"></go-date-time-picker>
      </el-form-item>
      <el-form-item label="结束时间" v-show="isAllDown">
        <go-date-time-picker v-model="domain.endTime"></go-date-time-picker>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-checkbox v-model="domain.autoUpload">自动上传</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="domain.autoListing">自动上架</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="domain.autoDelisting">自动下架</el-checkbox>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-checkbox v-model="domain.isCover">覆盖</el-checkbox>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="domain.uploadStockAfterDownload">下载后上传库存</el-checkbox>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="download">下载</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {Edit} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/selector';
  import {ProductMallMappingApi} from '../api';
  import {ValidateRules} from '@/libs/util';

  export default {
    mixins: [Edit],
    components: {StoreSelector},
    data() {
      return {
        isAllDown: true,
        rules: {
          storeId: ValidateRules.required
        }
      };
    },
    methods: {
      show(all) {
        this.isAllDown = all;
        this.domain = {};
        this.visible = true;
      },
      download() {
        this.$refs.editForm.validate().then(() => {
          ProductMallMappingApi.download(this.domain).then(this.confirm);
        });
      }
    }
  };
</script>
