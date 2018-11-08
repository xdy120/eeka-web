<template>
  <div>
    <el-table ref="detailTable" :height="tabsTableHeight" :data="list">
      <el-table-column label="标记" width="200" fixed>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gift">赠</el-tag>
          <el-tag v-if="scope.row.needReturnGoods">换</el-tag>
          <el-tag v-if="scope.row.oos">缺</el-tag>
          <el-tag v-if="scope.row.separate">拆</el-tag>
          <tooltip-icon v-if="scope.row.manualAdd" icon="oms-person-add"
                        tooltip="手工添加"></tooltip-icon>
          <el-tag v-if="scope.row.combinationDetail">子</el-tag>
          <el-tag v-if="scope.row.prepackage">预包装</el-tag>
          <el-tag v-if="scope.row.dropShipping">代</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="productCode" label="商品编码" width="150"></el-table-column>
      <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
      <el-table-column prop="skuCode" label="规格编码" width="150"></el-table-column>
      <el-table-column prop="skuName" label="规格名称" width="150"></el-table-column>
      <go-quantity-column prop="quantity" label="数量"/>
      <go-abnormal-column prop="productAbnormal" label="异常商品" width="80"></go-abnormal-column>
      <go-enum-column prop="status" label="状态" enum-name="SalesOrderDetailStatus" width="80"/>
      <go-enum-column prop="salesOrderDetailRefundStatus" label="退款状态" width="80"
                      enum-name="SalesOrderDetailRefundStatus"/>
      <el-table-column prop="mallPresellDeliveryRequiring" label="平台预售要求"
                       width="150"></el-table-column>
      <go-enum-column prop="productType" label="类型" enum-name="ProductType" width="80"/>
      <go-money-column prop="settlementPrice" label="结算价" width="80"/>
      <go-money-column prop="settlementAmount" label="结算金额" width="80"/>
      <go-money-column prop="discountAmount" label="优惠金额" width="80"/>
      <go-money-column prop="actualSellingPrice" label="成交价"/>
      <go-money-column prop="actualAmount" label="成交金额" width="80"/>
      <go-money-column prop="sellingPrice" label="销售价"/>
      <go-money-column prop="sellingAmount" label="销售金额" width="80"/>
      <go-money-column prop="distributionPrice" label="分销价"/>
      <go-money-column prop="costPrice" label="成本价"/>
      <el-table-column prop="mallDetailId" label="子订单号" width="150"></el-table-column>
      <el-table-column prop="mallProductId" label="平台商品ID" width="150"></el-table-column>
      <el-table-column prop="mallProductOutCode" label="商城商品编码" width="150"></el-table-column>
      <el-table-column prop="mallProductName" label="商城商品名称" width="150"></el-table-column>
      <el-table-column prop="mallSkuId" label="平台规格ID" width="150"></el-table-column>
      <el-table-column prop="mallSkuOutCode" label="商城规格编码" width="150"></el-table-column>
      <el-table-column prop="mallSkuName" label="商城规格名称" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" width="250px">
        <template slot-scope="scope">
          <go-invalid-button v-if="isShowInvalidButton(scope.row)"
                             @click="invalid(scope.row)"></go-invalid-button>
          <el-button type="text" v-if="scope.row.productAbnormal" @click="matchProduct(scope.row)">
            匹配异常商品
          </el-button>
          <el-button type="text"
                     v-if="isShowReplaceButton(scope.row)"
                     @click="replaceDetail(scope.row)">替换
          </el-button>
          <el-button type="text" v-if="canSplit(scope.row)"
                     @click="splitDetails(scope.row)">拆分
          </el-button>
          <el-button type="text" v-if="isShowRefundButton(scope.row)"
                     @click="applyRefund(scope.row)">申请退款
          </el-button>
          <el-button type="text" v-if="scope.row.salesOrderDetailRefundStatus==='APPLY'"
                     @click="refund(scope.row)">确认退款
          </el-button>
          <el-button type="text" v-if="scope.row.salesOrderDetailRefundStatus==='APPLY'"
                     @click="cancelRefund(scope.row)">取消退款
          </el-button>
          <el-button type="text" v-if="isShowDropShippingButton(scope.row)"
                     @click="manualDropShipping(scope.row)">手工代发
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <sku-selector :display="false" multiple ref="skuSelector"></sku-selector>
    <detail-split ref="detailSplit" @ok="splitSuccess"></detail-split>
  </div>
</template>
<script>
  import {List, TableResize, Tabs} from '@/libs/mixins';
  import {SkuSelector} from '@/modules/selector';
  import {SalesOrderDetailApi} from '../api';
  import {SalesOrderDetail} from '../util';
  import {StoreApi} from '@/modules/base/store/api';
  import {DetailSplit} from '../action';

  export default {
    name: 'SalesOrderDetail',
    mixins: [TableResize, List, Tabs],
    components: {SkuSelector, StoreApi, DetailSplit},
    computed: {},
    data() {
      return {
        tab: 'detail',
        pk: 'salesOrderDetailId',
        store: {}
      };
    },
    methods: {
      buildSalesOrderDetailAO(detail) {
        return {
          version: this.parentData.version,
          salesOrderId: detail.salesOrderId,
          salesOrderDetailId: detail.salesOrderDetailId,
        };
      },
      search() {
        if (this.parentData != null) {
          this.doSearch(SalesOrderDetailApi.list(this.parentData.salesOrderId),
            this.$refs.detailTable);
        }
      },
      applyRefund(detail) {
        this.$confirm('确认要申请退款？').then(() => {
          SalesOrderDetailApi.applyRefund(this.buildSalesOrderDetailAO(detail)).then(
            () => this.successChange('申请退款成功'));
        });
      },
      refund(detail) {
        this.$confirm('确认退款后无法发货？').then(() => {
          SalesOrderDetailApi.refund(this.buildSalesOrderDetailAO(detail)).then(
            () => this.successChange('确认退款成功'));
        });
      },
      cancelRefund(detail) {
        this.$confirm('确认取消退款吗？').then(() => {
          SalesOrderDetailApi.cancelRefund(this.buildSalesOrderDetailAO(detail)).then(
            () => this.successChange('取消退款成功'));
        });
      },
      invalid(detail) {
        this.$confirm('确认要作废商品吗？').then(() => {
          SalesOrderDetailApi.invalid(this.buildSalesOrderDetailAO(detail)).then(
            () => this.successChange('作废成功'));
        });
      },
      replaceDetail(detail) {
        //找出店铺的信息
        if (this.store && this.parentData.storeId === this.store.storeId) {
          this.replace(detail);
        } else if (this.parentData.storeId) {
          StoreApi.get(this.parentData.storeId).then(response => {
            this.store = response;
            this.replace(detail);
          });
        } else {
          this.$message.warning('该单异常,无店铺信息,请核实后操作!');
        }
      },
      replace(detail) {
        //判断是否换同款
        if (!this.store) {
          this.$message.warning('该单异常,无店铺信息,请核实后操作!');
          return;
        }
        let exchangeDifferentSpu = this.store.setting.exchangeDifferentSpu;
        let productId = null;

        if (!(exchangeDifferentSpu && exchangeDifferentSpu === true)) {
          productId = detail.productId;
        }
        this.$refs.skuSelector.showDialog({
          productId: productId,
          multiple: false,
          onSelected: sku => {
            this.$confirm(`确认要将【${detail.skuCode}】替换为【${sku.skuCode}】吗？`).then(() => {
              let replaceAO = this.buildSalesOrderDetailAO(detail);
              sku.quantity = detail.quantity;
              replaceAO.targetDetail = new SalesOrderDetail(sku);
              SalesOrderDetailApi.replace(replaceAO).then(() => this.successChange('替换成功'));
            });
          }
        });
      },
      isShowRefundButton(detail) {
        return detail.salesOrderDetailRefundStatus === 'NONE'
          && detail.gift !== true && !detail.needReturnGoods && detail.status === 'WAITING'
          && !detail.productAbnormal;
      },
      isShowInvalidButton(detail) {
        return (detail.gift || detail.manualAdd) && detail.salesOrderDetailRefundStatus === 'NONE'
          && detail.status === 'WAITING';
      },
      matchProduct(detail) {
        SalesOrderDetailApi.matchProduct(this.buildSalesOrderDetailAO(detail)).then(
          () => this.successChange('正在匹配异常商品，请稍后查看！'));
      },
      isShowDropShippingButton(detail) {
        return !detail.productAbnormal && detail.status === 'WAITING';
      },
      manualDropShipping(detail) {
        this.$confirm('设置代发后明细状态改为已发货，是否确认？').then(() => {
          SalesOrderDetailApi.manualDropShipping(this.buildSalesOrderDetailAO(detail)).then(
            () => this.successChange('设置代发成功'));
        });
      },
      isShowReplaceButton(detail) {
        return detail.status === 'WAITING' && detail.salesOrderDetailRefundStatus === 'NONE'
          && !detail.productAbnormal;
      },
      canSplit(detail) {
        return this.isShowReplaceButton(detail) && detail.quantity > 1 && !detail.gift;
      },
      splitDetails(detail) {
        //找出店铺的信息
        if (this.store && this.parentData.storeId === this.store.storeId) {
          this.$refs.detailSplit.show(this.store.setting, detail, this.parentData.version);
        } else if (this.parentData.storeId) {
          StoreApi.get(this.parentData.storeId).then(response => {
            this.store = response;
            this.$refs.detailSplit.show(this.store.setting, detail, this.parentData.version);
          });
        } else {
          this.$message.warning('该单异常,无店铺信息,请核实后操作!');
        }
      },
      splitSuccess() {
        this.successChange('明细拆分成功');
        this.search();
      }
    }
  };
</script>