<template>
  <el-dialog title="退款单新建" :visible.sync="visible" :before-close="dialogCloseConfirm"
             :fullscreen="true">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="明细"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <refund-order-basic ref="editForm" v-model="domain"></refund-order-basic>
    </div>
    <div v-show="stepTitle==='明细'">
      <el-table :data="domain.details" :height="190" style="margin-top: 5px" show-summary>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="productCode" label="商品编码" width="100px"></el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="100px"></el-table-column>
        <el-table-column prop="skuCode" label="规格编码" min-width="100px"></el-table-column>
        <el-table-column prop="skuName" label="规格名称" min-width="100px"></el-table-column>
        <go-money-column prop="refundableAmount" label="应退金额" width="100px">
          <template slot-scope="scope">
            {{scope.row.refundableAmount}}
          </template>
        </go-money-column>
        <go-money-column prop="actualAmount" label="实退金额" width="100px">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.actualAmount"></el-input>
          </template>
        </go-money-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <go-delete-button @click="domain.details.splice(scope.$index,1)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: right;margin-top: 10px">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import RefundOrderBasic from './edit.basic.vue';
  import {RefundOrderApi, SalesOrderDetailApi} from '../api';

  export default {
    name: 'RefundCreator',
    mixins: [Steps, Edit],
    components: {RefundOrderBasic},
    props: {},
    data() {
      return {
        pk: 'refundOrderId',
        api: RefundOrderApi,
        stepTitle: '基本信息',

      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
              this.next();
              if (!this.domain.details) {
                SalesOrderDetailApi.list(this.domain.salesOrderId).then(r => {
                  let details = [];
                  r.forEach(row => {
                    let detail = {};
                    for (let key in row) {
                      detail[key] = row[key];
                      detail.actualAmount = row.actualAmount;
                      detail.refundableAmount = row.actualAmount;
                      detail.productQuantity = row.quantity;
                      detail.quantity = 0;
                    }
                    details.push(detail);
                  });
                  this.$set(this.domain, 'details', details);
                });
              }
            });
            return;
          case '明细':
            if (this.domain.details.length === 0) {
              this.$message.warning('请选择明细');
              return;
            }
            break;
          default:
            break;
        }
        this.next();
      },
      doSave() {
        //去除实退金额为0的明细
        RefundOrderApi.add(this.domain).then(r => {
          this.$message.success('新增退款单成功');
          this.close();
          this.$emit('ok', this.domain);
        });
      },
    }
  };
</script>
