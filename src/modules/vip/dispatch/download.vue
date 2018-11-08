<template>
  <el-dialog title="下载订单" :visible.sync="visible" width="450px">
    <el-form :model="domain" :rules="rules" ref="editForm" label-width="110px">
      <el-form-item>
        <el-radio v-model="downloadType" label="pickNo">拣货单号</el-radio>
        <el-radio v-model="downloadType" label="createTime">生成时间</el-radio>
      </el-form-item>
      <el-form-item label="店铺" prop="storeId">
        <store-selector v-model="domain.storeId" mall-type="VIP" :clearable="false"></store-selector>
      </el-form-item>
      <el-form-item v-if="downloadType==='pickNo'" label="拣货单号" prop="pickNos">
        <el-input v-model="domain.pickNos" :placeholder="Placeholders.IN"
                  type="textarea" :rows="5"></el-input>
      </el-form-item>
      <div v-else>
        <el-form-item label="开始时间" prop="createdTimeBegin">
          <go-date-time-picker v-model="domain.createdTimeBegin" type="datetime"
                               value-format="yyyy-MM-dd HH:mm:ss" :clearable="false">
          </go-date-time-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="createdTimeEnd">
          <go-date-time-picker v-model="domain.createdTimeEnd" type="datetime"
                               value-format="yyyy-MM-dd HH:mm:ss" :clearable="false">
          </go-date-time-picker>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit} from '@/libs/mixins';
  import {Placeholders, Util, ValidateRules} from '@/libs/util';
  import {StoreSelector} from '@/modules/selector';
  import {VipDispatchApi} from './api';

  export default {
    components: {StoreSelector},
    mixins: [Edit],
    data() {
      return {
        Placeholders,
        downloadType: 'pickNo',
        rules: {
          storeId: ValidateRules.required,
          pickNos: ValidateRules.required,
          createdTimeBegin: ValidateRules.required,
          createdTimeEnd: ValidateRules.required
        }
      };
    },
    methods: {
      genDefaultDomain() {
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        return {
          createdTimeBegin: Util.dateFormatter(today, 'yyyy-MM-dd HH:mm:ss'),
          createdTimeEnd: Util.dateFormatter(tomorrow, 'yyyy-MM-dd HH:mm:ss'),
        };
      },
      doSave() {
        VipDispatchApi.download(this.domain);
        this.$message.success('已提交下载服务，请稍后查看结果');
        this.confirm();
      }
    }
  };
</script>