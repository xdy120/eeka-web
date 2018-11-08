<template>
  <div>
    <div style="margin-bottom: 5px" v-if="isInvalid">
      <el-button @click="showEditor()">新增</el-button>
    </div>
    <el-table ref="invoiceTable" :data="list" :height="tabsMinTableHeight"
              :parent-data="this.parentData">
      <el-table-column prop="invoiceTitle" label="发票抬头"></el-table-column>
      <el-table-column prop="invoiceContent" label="发票内容"></el-table-column>
      <go-money-column prop="actualAmount" label="金额"></go-money-column>
      <el-table-column prop="taxpayerId" label="纳税人识别号"></el-table-column>
      <el-table-column prop="gmfAddress" label="买方地址"></el-table-column>
      <el-table-column prop="gmfMobile" label="买方电话"></el-table-column>
      <el-table-column prop="gmfBankName" label="买方银行"></el-table-column>
      <el-table-column prop="gmfBankNo" label="买方账号"></el-table-column>
      <go-enum-column prop="invoiceType" label="类型" enum-name="InvoiceType"></go-enum-column>
      <el-table-column label="操作" :width="150">
        <template slot-scope="scope" v-if="isInvalid">
          <go-modify-button @click="showEditor(scope.row)"></go-modify-button>
          <go-delete-button @click="remove(scope.row,scope.$index)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="发票信息" :visible.sync="visible" width="450px" append-to-body>
      <el-form :model="domain" :rules="rules" ref="editForm" label-width="110px">
        <el-form-item label="抬头" prop="invoiceTitle">
          <el-input v-model="domain.invoiceTitle"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="invoiceContent">
          <el-input v-model="domain.invoiceContent"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="actualAmount">
          <el-input-number v-model="domain.actualAmount"></el-input-number>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoiceType">
          <enum-selector v-model="domain.invoiceType" enum-name="InvoiceType"></enum-selector>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxpayerId">
          <el-input v-model="domain.taxpayerId"></el-input>
        </el-form-item>
        <div v-if="domain.invoiceType==='VALUE_ADD'">
          <el-form-item label="买方地址">
            <el-input v-model="domain.gmfAddress"></el-input>
          </el-form-item>
          <el-form-item label="买方电话">
            <el-input v-model="domain.gmfMobile"></el-input>
          </el-form-item>
          <el-form-item label="买方银行名称">
            <el-input v-model="domain.gmfBankName"></el-input>
          </el-form-item>
          <el-form-item label="买方银行账号">
            <el-input v-model="domain.gmfBankNo"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="save">确定</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {SalesOrderInvoiceApi} from '../api';
  import {Assert, ValidateRules} from '@/libs/util';
  import {SalesOrderUtil} from '@/modules/trade/sales/util';

  export default {
    name: 'SalesOrderInvoice',
    mixins: [TableResize, List, Tabs],
    props: {
      value: Array,
      remote: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        tab: 'invoice',
        pk: 'salesOrderInvoiceId',
        visible: false,
        edit: false,
        domain: {},
        list: this.value ? this.value : [],
        rules: {
          invoiceTitle: ValidateRules.requiredMax,
          invoiceContent: ValidateRules.required,
          taxpayerId: ValidateRules.requiredMax,
          invoiceType: ValidateRules.required,
          actualAmount: ValidateRules.required,
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
          this.doSearch(SalesOrderInvoiceApi.list(this.parentData.salesOrderId),
            this.$refs.invoiceTable);
        }
      },
      showEditor(data) {
        if (data) {
          this.edit = true;
          this.domain = data;
        } else {
          this.edit = false;
          this.domain = {};
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
            if (this.edit) {
              SalesOrderInvoiceApi.modify(this.parentData.salesOrderId, this.domain.salesOrderInvoiceId,
                this.domain).then(() => {
                this.successChange('修改发票成功');
                this.visible = false;
              });
            } else {
              SalesOrderInvoiceApi.add(this.parentData.salesOrderId, this.domain).then(() => {
                this.successChange('添加发票成功');
                this.visible = false;
              });
            }
          } else {
            if (!this.edit) {
              this.list.push(this.domain);
            }
            this.$emit('input', this.list);
            this.visible = false;
          }
        });
      },
      remove(data, index) {
        if (this.remote) {
          SalesOrderInvoiceApi.remove(this.parentData.salesOrderId, data.salesOrderInvoiceId).then(
            () => {
              this.successChange('删除发票成功');
            });
        } else {
          this.list.splice(index, 1);
        }
      },
    }
  };
</script>