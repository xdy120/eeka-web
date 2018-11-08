<template>
  <el-dialog title="下载订单" :visible.sync="visible" width="400px">
    <el-form :model="domain" :rules="rules" ref="editForm">
      <el-form-item label="店铺" prop="storeId">
        <store-selector v-model="domain.storeId"></store-selector>
      </el-form-item>
      <el-form-item label="交易号" prop="tradeId">
        <el-input v-model="domain.tradeId" @change="tradeIdChange" :placeholder="Placeholders.IN"
                  type="textarea" :rows="3"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save" :disabled="isRequestSend">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Placeholders, Util, ValidateRules} from '@/libs/util';
  import {StoreSelector} from '@/modules/selector';
  import {SalesOrderApi} from '../api';

  export default {
    components: {StoreSelector},
    mixins: [Edit],
    data() {
      return {
        Placeholders,
        tradeIds: null,
        rules: {
          storeId: ValidateRules.required,
          tradeId: ValidateRules.required
        }
      };
    },
    methods: {
      tradeIdChange(val) {
        this.domain.tradeIds = Util.toArray(val);
      },
      doSave() {
        SalesOrderApi.download(this.domain).then(() => {
          this.$message.success('已提交下载服务，请稍后查看结果');
          this.confirm();
        }, () => {
          this.isRequestSend = false;
        });
      }
    }
  };
</script>