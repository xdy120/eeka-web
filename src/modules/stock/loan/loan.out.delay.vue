<template>
  <el-dialog title="延期" :visible.sync="visible" width="400px">
    <el-form :model="domain" ref="editForm">
      <el-form-item label="归还时间" prop="reason">
        <el-date-picker v-model="domain.expectReturnDate" type="date"
                        value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins/index';
  import {Placeholders} from '@/libs/util';
  import {StockLoanOutApi} from './api';

  export default {
    mixins: [Edit],
    components: {
      LoanOutApi: StockLoanOutApi
    },
    data() {
      return {
        api: StockLoanOutApi,
        pk: 'stockLoanOutId',
        Placeholders
      };
    },
    methods: {
      doSave() {
        this.api.modify(this.domain.stockLoanOutId, this.domain).then(this.confirm);
      }
    }
  };
</script>