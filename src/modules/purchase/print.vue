<template>
  <div>
    <div class="no-print" style="padding: 10px">
      <el-button @click="print" v-show="dataLoaded">打印</el-button>
    </div>
    <div ref="printWin" class="print-page" style="width: 210mm;margin: 0 auto;padding: 0">
      <div>
        <span style="float: left">{{currentDate()}}</span>
        <span style="float: right">巨益新零售中台</span>
      </div>
      <div style="text-align: center;padding-top: 20px">
        <span style="font-size: 25px;">采购订单</span>
      </div>
      <div style="margin-top: 10px">
        <div style="display: inline-block;width: 65mm">
          <span class="label-text">订单编号:</span>
          <span>{{printData.purchaseOrderCode}}</span>
        </div>
        <div style="display: inline-block;width: 65mm">
          <span class="label-text">供应商名称:</span>
          <span>{{printData.supplierName}}</span>
        </div>
        <div style="display: inline-block;width: 65mm">
          <span class="label-text">订货日期:</span>
          <span>{{printData.purchaseDate}}</span>
        </div>
      </div>

      <div style="margin-top: 10px">
        <div style="display: inline-block;width: 65mm">
          <span class="label-text">采购人:</span>
          <span>{{printData.purchaser}}</span>
        </div>
        <div style="display: inline-block;width: 65mm">
          <span class="label-text">供应商省份:</span>
        </div>
        <div style="display: inline-block;width: 65mm">
          <span class="label-text">支付宝:</span>
        </div>
      </div>
      <div style="margin-top: 10px">
        <div style="display: inline-block;width: 65mm">
          <span class="label-text">付款信息:</span>
        </div>
        <div style="display: inline-block;">
          <span class="label-text">物流费用模式:</span>
          <div class="range"></div>
          包邮
          <div class="range"></div>
          自付
          <div class="range"></div>
          其他
        </div>
      </div>
      <div style="margin-top: 10px">
        <div style="display: inline-block">
          <span class="label-text">备注:</span>
          <span>{{printData.remark}}</span>
        </div>
      </div>
      <table class="printTable">
        <thead>
        <tr>
          <th>商品编码</th>
          <th>商品名称</th>
          <th>规格编码</th>
          <th>规格名称</th>
          <th>数量</th>
          <th>单价</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in printDetails">
          <td style="width: 15%">{{item.productCode}}</td>
          <td style="width: 35%">{{item.productName}}</td>
          <td style="width: 20%">{{item.skuCode}}</td>
          <td style="width: 10%">{{item.skuName}}</td>
          <td style="width: 10%;text-align: right">{{item.quantity}}</td>
          <td style="width: 10%;text-align: right">{{item.actualPrice.toFixed(2)}}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td>合计</td>
          <td></td>
          <td></td>
          <td></td>
          <td style="text-align: right">{{calculationQuantity()}}</td>
          <td style="text-align: right">{{calculationMoney()}}</td>
        </tr>
        </tfoot>
      </table>
      <div style="margin-top: 10px">
        <span class="label-text">运费:</span>
        <span>{{printData.expressFee}}</span>
      </div>
      <div style="margin-top: 10px">
        <span class="label-text">发货要求:</span>
      </div>
      <div style="margin-top: 10px">
        <span class="label-text">其它事项:</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {List, PageList, TableResize} from '@/libs/mixins';
  import {PurchaseOrderApi, PurchaseOrderDetailApi} from './api';

  export default {
    name: 'Purchase',
    mixins: [List, PageList, TableResize],
    data() {
      return {
        api: PurchaseOrderApi,
        pk: 'purchaseOrderId',
        dataLoaded: false,
        printData: [],
        printDetails: []
      };
    },
    created() {
      let purchaseOrderId = this.$route.params.purchaseOrderId;
      let promise = Promise.all([PurchaseOrderApi.get(purchaseOrderId),
        PurchaseOrderDetailApi.listDetailPrint(purchaseOrderId)]);
      promise.then(([order, detail]) => {
        this.printData = order;
        this.printDetails = detail;
        this.$nextTick(function () {
          this.dataLoaded = true;
        });
      });
    },
    methods: {
      print() {
        window.print();
      },
      currentDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
          month = '0' + month;
        }
        if (day < 10) {
          day = '0' + day;
        }
        return year + '年' + month + '月' + day + '日';
      },
      calculationQuantity() {
        let quantity = 0;
        for (let i = 0; i < this.printDetails.length; i++) {
          quantity += this.printDetails[i].quantity;
        }
        return quantity;
      },
      calculationMoney() {
        let actualPrice = 0;
        for (let i = 0; i < this.printDetails.length; i++) {
          actualPrice += this.printDetails[i].actualPrice;
        }
        return actualPrice.toFixed(2);
      },
    }
  };
</script>
<style scoped>
  @media print {
    .print-page {
      margin: 0;
    }
  }

  .range {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 15px;
    border: 1px solid
  }

  .label-text {
    font-weight: bold;
  }

  .printTable {
    margin-top: 10px;
    border-collapse: collapse;
    border-width: 1px;
    width: 100%
  }

  .printTable th, td {
    border: 1px solid black;
    width: 680px;
  }
</style>