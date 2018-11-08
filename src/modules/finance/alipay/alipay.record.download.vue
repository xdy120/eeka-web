<template>
  <el-dialog title="支付宝账单下载" :visible.sync="visible" :before-close="dialogCloseConfirm" width="450px">
    <el-form :model="domain" label-width="100px" :rules="rules" ref="editForm">
      <el-form-item label="店铺" prop="storeId">
        <store-selector v-model="domain.storeId"></store-selector>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <go-date-time-picker v-model="domain.beginTime"></go-date-time-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <go-date-time-picker v-model="domain.endTime"></go-date-time-picker>
      </el-form-item>
      <el-form-item style="color: red">
        注意：时间跨度必须只有一天
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="download">下载</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {Edit} from '@/libs/mixins';
  import {StoreSelector} from '@/modules/selector';
  import {AlipayRecordApi} from './api';
  import {ValidateRules} from '@/libs/util';

  export default {
    name: 'Download',
    mixins: [Edit],
    components: {StoreSelector},
    data() {
      return {
        api: AlipayRecordApi,
        rules: {
          storeId: ValidateRules.required,
          beginTime: ValidateRules.required,
          endTime: ValidateRules.required
        }
      };
    },
    methods: {
      download() {
        this.$refs.editForm.validate().then(() => {
          this.api.download(this.domain).then(this.confirm);
        });
      }
    }
  };
</script>
