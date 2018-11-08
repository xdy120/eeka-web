<template>
  <el-dialog title="退换货单新建" :visible.sync="visible" :before-close="dialogCloseConfirm">
    <el-steps ref="dataSteps" :active="step" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="退入明细"></el-step>
      <el-step title="换出明细" v-if="domain.isExchange"></el-step>
    </el-steps>
    <div v-show="stepTitle==='基本信息'">
      <return-order-basic ref="editForm" v-model="domain"></return-order-basic>
    </div>
    <div v-show="stepTitle==='退入明细'">
      <el-table :data="domain.inDetails" height="400px" @selection-change="handleSelectionChange"
                show-summary>
        <go-selection-column></go-selection-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="productCode" label="商品编码"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="skuCode" label="规格编码"></el-table-column>
        <el-table-column prop="skuName" label="规格名称"></el-table-column>
        <go-quantity-column prop="quantity" label="退货数量" width="90px">
          <template slot-scope="scope">
            <el-input-number :min="1" :max="scope.row.quantity" v-model="scope.row.quantity"
                             @change="calcAmount(scope.row)"></el-input-number>
          </template>
        </go-quantity-column>
        <el-table-column prop="refundableAmount" label="应退金额">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.refundableAmount"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" fix="right">
          <template slot-scope="scope">
            <exchange-selector :outDetail.sync="outDetail"
                               :product-id="scope.row.productId"
                               :quantity="scope.row.quantity"
                               :index="scope.$index"
                               v-if="domain.isExchange">
            </exchange-selector>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="stepTitle==='换出明细'">
      <sku-selector @confirm="selectOutSkus"></sku-selector>
      <el-table :data="domain.outDetails" height="400px" show-summary>
        <el-table-column type="index" width="50" label="序号" sortable></el-table-column>
        <el-table-column prop="productCode" label="商品编码"></el-table-column>
        <el-table-column prop="productName" label="商品名称"></el-table-column>
        <el-table-column prop="skuCode" label="规格编码"></el-table-column>
        <el-table-column prop="skuName" label="规格名称"></el-table-column>
        <el-table-column prop="skuName" label="可销数量"></el-table-column>
        <el-table-column prop="quantity" label="换货数量">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.quantity"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" label="换货金额">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.actualAmount"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <go-delete-button @click="domain.outDetails.splice(scope.$index,1)"></go-delete-button>
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
  import ReturnOrderBasic from './edit.basic.vue';
  import {ReturnOrderApi, SalesOrderDetailApi} from '../api';
  import {SkuSelector} from '@/modules/selector';
  import ExchangeSelector from '@/modules/trade/return/exchange.selector';

  export default {
    name: 'ReturnCreator',
    mixins: [Steps, Edit],
    components: {
      SkuSelector, ReturnOrderBasic, ExchangeSelector
    },
    props: {},
    data() {
      return {
        pk: 'returnOrderId',
        api: ReturnOrderApi,
        stepTitle: '基本信息',
        outDetail: null,
        clickFlag: true
      };
    },
    methods: {
      nextStep() {
        switch (this.stepTitle) {
          case '基本信息':
            this.$refs.editForm.validate().then(() => {
              if (!this.domain.details) {
                const _this = this;
                SalesOrderDetailApi.listDelivered(this.domain.salesOrderId).then(response => {
                  response.forEach(detail => {
                    detail.single = detail.actualAmount / detail.quantity;
                    detail.refundableAmount = detail.actualAmount;
                  });
                  _this.domain.inDetails = response;
                  this.next();
                });
              } else {
                this.next();
              }
            });
            return;
          case '退入明细':
            this.next();
            break;
          default:
            this.next();
            break;
        }
      },
      //获取退入的商品
      handleSelectionChange(val) {
        this.domain.details = val;
      },
      removeDetail(index) {
        let item = this.domain.outDetails[index];
        this.$message.success(`明细: ${item.skuCode} 删除成功`);
        this.$delete(this.domain.outDetails, index);
      },
      doSave() {
        if (!this.clickFlag){
          this.$message.warning('不可连续保存!');
          return;
        }
        this.clickFlag = false;
        ReturnOrderApi.add(this.domain).then(r => {
          this.clickFlag = true;
          this.$message.success('新增退换货单成功');
          this.close();
          this.$emit('ok', this.domain);
        }).catch(()=>{
          this.clickFlag = true;
        });
      },
      convertSku(sku) {
        let detail = {
          productId: sku.productId,
          productCode: sku.productCode,
          productName: sku.productName,
          productType: sku.product.productType,
          skuId: sku.skuId,
          skuCode: sku.skuCode,
          skuName: sku.skuName,
          quantity: 1,
          actualAmount: sku.sellingPrice
        };
        return detail;
      },
      selectOutSkus(skus) {
        if (!this.domain.outDetails) {
          this.$set(this.domain, 'outDetails', []);
        }
        for (let sku of skus) {
          let detail = this.domain.outDetails.find(x => x.skuId === sku.skuId);
          if (!detail) {
            detail = this.convertSku(sku);
            this.domain.outDetails.push(detail);
          } else {
            detail.actualAmount += detail.actualAmount / detail.quantity;
            detail.quantity += detail.quantity;
          }
        }
      },
      calcAmount(row) {
        row.refundableAmount = row.single * row.quantity;
      }
    },
    watch: {
      outDetail(val) {
        if (this.domain.outDetails) {
          let old = this.domain.outDetails.find((value) => {
            return value.index === val.index;
          });
          if (old) {
            for (let i = 0; i < this.domain.outDetails.length; i++) {
              if (this.domain.outDetails[i].index === val.index) {
                this.domain.outDetails[i] = val;
              }
            }
          } else {
            this.domain.outDetails.push(val);
          }
        } else {
          this.domain.outDetails = [];
          this.domain.outDetails.push(val);
        }
      }
    }
  };
</script>
