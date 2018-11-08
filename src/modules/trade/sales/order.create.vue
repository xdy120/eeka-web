<template>
  <el-dialog :title="title" :fullscreen="true" :visible.sync="visible"
             :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"/>
      <el-step title="商品明细"/>
      <el-step title="支付信息"/>
      <el-step title="发票信息" v-if="domain.sub.hasInvoice"/>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <sales-order-basic ref="orderBasic" v-model="domain" :editMode="editMode">
      </sales-order-basic>
    </div>
    <div v-if="stepTitle==='商品明细'">
      <sku-selector @confirm="selectSkus" :quantity="true"></sku-selector>
      <el-table ref="skuTable" height="300px" :data="domain.details" style="margin-top: 5px"
                show-summary>
        <el-table-column label="子订单号" width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.mallDetailId"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="商品编码" width="120"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="skuCode" label="规格编码" width="120"></el-table-column>
        <el-table-column prop="skuName" label="规格名称"></el-table-column>
        <go-quantity-column prop="quantity" label="数量" width="90">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity"
                             @change="quantityChange($event,scope.row)"></el-input-number>
          </template>
        </go-quantity-column>
        <go-enum-column prop="productType" label="类型" enum-name="ProductType"></go-enum-column>
        <go-money-column prop="sellingPrice" label="吊牌价" width="80"></go-money-column>
        <go-money-column prop="actualSellingPrice" label="成交价" width="90">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.actualSellingPrice"
                             @change="actualSellingPriceChange($event,scope.row)"></el-input-number>
          </template>
        </go-money-column>
        <go-money-column prop="settlementPrice" label="结算价" width="90">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.settlementPrice"
                             @change="settlementPriceChange($event,scope.row)"></el-input-number>
          </template>
        </go-money-column>
        <go-money-column prop="actualAmount" label="成交金额" width="80"></go-money-column>
        <go-money-column prop="settlementAmount" label="结算金额" width="80"></go-money-column>
        <go-money-column prop="distributionPrice" label="分销价" width="80"></go-money-column>
        <go-money-column prop="distributionAmount" label="分销金额" width="80"></go-money-column>
        <go-money-column prop="discountAmount" label="优惠"></go-money-column>
        <el-table-column label="操作" fixed="right" width="80px">
          <template slot-scope="scope">
            <go-delete-button @click="domain.details.splice(scope.$index,1)"></go-delete-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="stepTitle==='支付信息'">
      <sales-order-payment v-model="domain.payments"></sales-order-payment>
    </div>
    <div v-show="stepTitle==='发票信息'">
      <sales-order-invoice v-model="domain.invoices"></sales-order-invoice>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="prev" :disabled="prevDisabled">{{prevText}}</el-button>
      <el-button @click="nextStep" :disabled="isRequestSend">{{nextText}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {Edit, Steps} from '@/libs/mixins';
  import {SkuSelector} from '@/modules/selector';
  import {SalesOrderApi} from './api';
  import {SalesOrderInvoice, SalesOrderPayment} from './tabs';
  import SalesOrderBasic from './order.basic.vue';
  import {SalesOrder, SalesOrderDetail} from './util';

  export default {
    name: 'SalesOrderCreator',
    mixins: [Steps, Edit],
    components: {SalesOrderBasic, SalesOrderPayment, SalesOrderInvoice, SkuSelector},
    data() {
      return {
        pk: 'salesOrderId',
        api: SalesOrderApi,
        stepTitle: '基本信息',
        domain: new SalesOrder(),
        title: '订单新建',
      };
    },
    watch: {
      'domain.sub.salesOrderType': {
        deep: true,
        handler: function (newVal, oldVal) {
          if (this.editMode && newVal !== oldVal && newVal === 'REISSUE') {
            this.domain.sub.hasInvoice = false;
            this.domain.invoices = [];
            this.domain.details.forEach(x => {
              x.actualSellingPrice = 0;
              x.settlementPrice = 0;
              x.actualAmount = 0;
              x.settlementAmount = 0;
              x.distributionPrice = 0;
              x.distributionAmount = 0;
              x.discountAmount = 0;
            });
            this.domain.payments.forEach(x => {
              x.actualAmount = 0;
            });
          }
        }
      }
    },
    methods: {
      show() {
        this.domain = this.genDefaultDomain();
        this.editMode = false;
        this.visible = true;
        this.isRequestSend = false;
        this.title = '订单新建';
      },
      showCopy(entity, title) {
        if (entity) {
          if (this.$refs.editForm) {
            this.$refs.editForm.resetFields();
          }
          if (this.$refs.skuTable) {
            this.$refs.skuTable.style = 'height:100px';
          }
          this.domain = entity;
          this.editMode = true;
          this.visible = true;
          this.isRequestSend = false;
          this.title = title;
        }
      },
      orderReissue(entity, title) {
        if (entity) {
          if (this.$refs.editForm) {
            this.$refs.editForm.resetFields();
          }
          this.domain = entity;
          this.domain.sub.salesOrderType = 'REISSUE';
          this.editMode = true;
          this.visible = true;
          this.isRequestSend = false;
          this.title = title;
        }
      },
      genDefaultDomain() {
        this.step = 0;
        if (this.$refs.orderBasic) {
          this.$refs.orderBasic.resetFields();
        }
        return new SalesOrder();
      },
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.orderBasic.validate().then(() => {
              this.domain.sub.mallModifiedTime = this.domain.sub.mallCreatedTime;
              this.next();
            });
            return;
          case '商品明细':
            if (this.domain.details.length === 0) {
              this.$message.warning('请选择明细！');
              return;
            }
            for (let detail of this.domain.details) {
              if (!/^\d+$/.test(detail.quantity)) {
                this.$message.warning('数量必须是0或正整数');
                return;
              }
            }
            break;
          case '支付信息':
            if (this.domain.payments && this.domain.payments.length > 0) {
              let total = (this.domain.details.map(x => x.actualAmount).reduce(
                (total, current) => total + current) + this.domain.sub.expressFee).toFixed(2);
              let paid = this.domain.payments.map(x => x.actualAmount).reduce(
                (total, current) => total + current).toFixed(2);

              if (total !== paid) {
                this.$message.warning(`订单金额：${total}与支付金额：${paid}不相等！`);
                return;
              }
              if (this.domain.sub.cod) {
                let codPaymtens = this.domain.payments.filter(x => x.payType === 'COD_PAY');
                if (codPaymtens.length > 0) {
                  this.domain.codAmount = codPaymtens.map(x => x.actualAmount).reduce(
                    (total, current) => total + current);
                }
                if (this.domain.codAmount === 0) {
                  this.$message.warning('到付订单的到付金额不能为0');
                  return;
                }
              }
              this.domain.quantity = 0;
              this.domain.actualAmount = total;
              this.domain.sellingAmount = this.domain.details.map(x => x.sellingAmount).reduce(
                (total, current) => total + current).toFixed(2);
              this.domain.settlementAmount = this.domain.details.map(
                x => x.settlementAmount).reduce((total, current) => total + current).toFixed(2);
              this.domain.discountAmount = this.domain.details.map(x => x.discountAmount).reduce(
                (total, current) => total + current).toFixed(2);
              this.domain.distributionAmount = this.domain.details.map(
                x => x.distributionAmount).reduce((total, current) => total + current).toFixed(2);
              this.domain.sub.weight = this.domain.details.map(
                x => x.weight === undefined ? 0 : x.weight).reduce(
                (total, current) => total + current).toFixed(2);
            } else {
              this.$message.warning('请填写支付信息！');
              return;
            }
            break;
          case '发票信息':
            if (this.domain.invoices.length === 0) {
              this.$message.warning('请填写发票信息！');
              return;
            }
            break;
          default:
            break;
        }
        this.next();
      },
      selectSkus(skus) {
        for (let sku of skus) {
          let detail = this.domain.details.find(x => x.skuId === sku.skuId);
          if (detail === undefined) {
            detail = new SalesOrderDetail(sku, false);
            this.domain.details.push(detail);
          }
        }
      },
      quantityChange(quantity, detail) {
        detail.sellingAmount = quantity * detail.sellingPrice;
        detail.actualAmount = quantity * detail.actualSellingPrice;
        detail.settlementAmount = quantity * detail.settlementPrice;
        detail.distributionAmount = quantity * detail.distributionPrice;
        detail.discountAmount = detail.actualAmount - detail.settlementAmount;
      },
      actualSellingPriceChange(price, detail) {
        detail.settlementPrice = price;
        detail.actualAmount = detail.quantity * price;
        this.settlementPriceChange(detail.settlementPrice, detail);
      },
      settlementPriceChange(price, detail) {
        detail.settlementAmount = detail.quantity * price;
        detail.discountAmount = detail.actualAmount - detail.settlementAmount;
      }
    }
  };
</script>