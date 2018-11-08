<template>
  <div>
    <div style="margin-bottom: 5px" v-if="isInvalid">
      <el-button @click="showEditor()">新增</el-button>
    </div>
    <el-table ref="tablePayment" :data="list" :height="tabsTableHeight">
      <go-enum-column prop="payType" label="类型" enum-name="PayType" :width="150"></go-enum-column>
      <go-money-column prop="actualAmount" label="支付金额" :width="100"></go-money-column>
      <go-date-time-column prop="paidTime" label="支付时间" :width="200"></go-date-time-column>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="isInvalid">
          <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
          <go-delete-button @click="remove(scope.row,scope.$index)"></go-delete-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="支付信息" :visible.sync="visible" width="450px" append-to-body>
      <el-form :model="domain" :rules="rules" ref="editForm">
        <el-form-item label="支付类型" prop="payType">
          <enum-selector v-model="domain.payType" enum-name="PayType"></enum-selector>
        </el-form-item>
        <el-form-item label="支付时间" prop="paidTime">
          <go-date-time-picker v-model="domain.paidTime"></go-date-time-picker>
        </el-form-item>
        <el-form-item label="金额" prop="actualAmount">
          <el-input-number v-model.number="domain.actualAmount"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="save">确定</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {SalesOrderPaymentApi} from '../api';
  import {Assert, ValidateRules} from '@/libs/util';
  import {SalesOrderUtil} from '@/modules/trade/sales/util';

  export default {
    name: 'SalesOrderPayment',
    mixins: [TableResize, Tabs, List],
    props: {
      value: Array,
      remote: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        tab: 'payment',
        pk: 'salesOrderPaymentId',
        visible: false,
        edit: false,
        domain: {},
        list: this.value ? this.value : [],
        rules: {
          payType: ValidateRules.required,
          actualAmount: ValidateRules.required,
          paidTime: ValidateRules.required,
        }
      };
    },
    computed: {
      isInvalid() {
        if (!this.parentData) {
          return true;
        }
        return SalesOrderUtil.isBeforeAudit(this.parentData);
      }
    },
    watch: {
      value(val) {
        this.list = val;
      }
    },
    methods: {
      search() {
        if (this.parentData !== null) {
          this.doSearch(SalesOrderPaymentApi.list(this.parentData.salesOrderId),
            this.$refs.tablePayment);
        }
      },
      showEditor(data) {
        if (data) {
          this.edit = true;
          this.domain = data;
        } else {
          this.edit = false;
          this.domain = {};
          if (this.$refs.editForm) {
            this.$refs.editForm.resetFields();
          }
        }
        this.visible = true;
      },
      save() {
        this.$refs.editForm.validate().then(() => {
          if (this.remote) {
            if (Assert.isEmpty(this.parentData)) {
              this.$message.error('请选择订单');
              return;
            }
            this.domain.salesOrderId = this.parentData.salesOrderId;
            if (this.edit) {
              SalesOrderPaymentApi.modify(this.domain.salesOrderId, this.domain.salesOrderPaymentId,
                this.domain).then(() => {
                this.successChange('修改支付信息成功');
                this.visible = false;
              });
            } else {
              SalesOrderPaymentApi.add(this.domain.salesOrderId, this.domain).then(() => {
                this.successChange('添加支付信息成功');
                this.visible = false;
              });
            }
          } else {
            if (!this.edit) {
              let payment = {};
              Object.assign(payment, this.domain);
              this.list.push(payment);
            }
            this.$emit('input', this.list);
            this.visible = false;
          }
        });
      },
      remove(data, index) {
        if (this.remote) {
          SalesOrderPaymentApi.remove(data.salesOrderId, data.salesOrderPaymentId).then(() => {
            this.successChange('删除支付信息成功');
          });
        } else {
          this.list.splice(index, 1);
        }
      }
    }
  };
</script>