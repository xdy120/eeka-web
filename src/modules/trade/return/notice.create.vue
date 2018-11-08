<template>
  <el-dialog title="生成通知单规则" :visible.sync="visible" :before-close="dialogCloseConfirm"
             width="500px">
    <el-form :model="domain" ref="notice" :rules="rules" label-width="100px">
      <el-row>
        <el-form-item label="扫描员" prop="nickname">
          <user-selector :is-default-value="false"
                         v-model="domain.userId"
                         :nickname.sync="domain.nickname"></user-selector>
        </el-form-item>
        <el-form-item label="退入仓库" prop="virtualWarehouseId">
          <virtual-warehouse-selector :default-first="false"
                                      v-model="domain.virtualWarehouseId">
          </virtual-warehouse-selector>
        </el-form-item>
        <el-form-item label="拆包开始时间" prop="beginTime">
          <go-date-time-picker v-model="domain.beginTime"></go-date-time-picker>
        </el-form-item>
        <el-form-item label="拆包结束时间" prop="endTime">
          <go-date-time-picker v-model="domain.endTime"></go-date-time-picker>
        </el-form-item>
        <el-form-item label="合并单量">
          <el-tooltip :content="'每'+domain.quantity+'个退换货单生成一个退换货通知单'">
            <el-input-number v-model="domain.quantity" :min="1" label="生成单量"></el-input-number>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="箱码">
          <el-input v-model.trim="domain.boxNos" :placeholder="Placeholders.IN"></el-input>
        </el-form-item>
        <el-form-item label="规格编码">
          <el-input v-model.trim="domain.skuCodes" :placeholder="Placeholders.IN"></el-input>
        </el-form-item>
        <el-form-item label="品牌编码" prop="domain.brandCodes">
          <data-dict-item-selector :default-first="false"
                                   :code.sync="domain.brandCodes"
                                   :dataDictId="10101"></data-dict-item-selector>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="domain.remark"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="notice">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {UserSelector, VirtualWarehouseSelector,DataDictItemSelector} from '@/modules/selector';
  import {ReturnOrderApi} from '../api';
  import {Edit} from '@/libs/mixins';
  import {ValidateRules,Placeholders } from '@/libs/util';

  export default {
    name: 'NoticeCreator',
    mixins: [Edit],
    components: {
      VirtualWarehouseSelector, UserSelector,DataDictItemSelector
    },
    data() {
      return {
        pk: 'returnOrderId',
        api: ReturnOrderApi,
        clickFlag: true,
        rules: {
          nickname: ValidateRules.required,
          virtualWarehouseId: ValidateRules.required,
        },
        Placeholders
      };
    },
    methods: {
      genDefaultDomain() {
        return {
          quantity: 100
        };
      },
      notice() {
        if (!this.clickFlag){
          this.$message.warning('不可连续生成!');
          return;
        }
        this.clickFlag = false;
        this.visible = false;
        this.$refs.notice.validate().then(() => {
          this.api.createNotice(this.domain).then(() => {
            this.$message.success('生成成功！');
            this.clickFlag=true;
          }).catch(()=>{
            this.clickFlag=true;
          });
        });
      }
    }
  };

</script>