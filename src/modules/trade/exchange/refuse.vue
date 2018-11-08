<template>
  <el-dialog title="拒绝换货" :visible.sync="visible" :before-close="dialogCloseConfirm"
             style="width: 800px;margin: auto">
    <data-dict-item-selector :code.sync="reasonCode"
                             :dataDictId="10307">
    </data-dict-item-selector>
    <div style="text-align: right;margin-top: 10px">
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {Edit, List} from '@/libs/mixins';
  import {DataDictItemSelector} from '@/modules/selector';
  import {ExchangeApi} from './api.js';

  export default {
    name: 'agree',
    mixins: [Edit, List],
    components: {
      DataDictItemSelector,
    },
    data() {
      return {
        api: ExchangeApi,
        exchangeId: null,
        reasonCode: null
      };
    },
    methods: {
      show(exchangeId) {
        this.exchangeId = exchangeId;
        this.visible = true;
      },
      save() {
        const _this = this;
        ExchangeApi.refuse(this.exchangeId, this.reasonCode).then(response => {
          _this.visible = false;
          this.$message.success('拒绝成功');
        });
      },
    }
  };
</script>