import {Assert} from '@/libs/util';

class SalesOrder {
  constructor() {
    let now = new Date();
    this.tradeId = `${now.getFullYear()}${now.getMonth()}${now.getDay()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;
    this.forceSplit = false;
    this.manual = false;
    this.hold = false;
    this.oos = false;
    this.urgent = false;
    this.codAmount = 0;
    this.actualAmount = 0;
    this.quantity = 0;
    this.sellingAmount = 0;
    this.settlementAmount = 0;
    this.discountAmount = 0;
    this.distributionAmount = 0;
    this.status = 'CREATED';
    this.deliveryStatus = 'NONE';
    this.dispatchStatus = 'NONE';
    this.payStatus = 'PAID';
    this.refundStatus = 'NONE';
    this.mallSalesOrderStatus = 'WAIT_SELLER_SEND_GOODS';
    this.sub = {
      salesOrderType: 'SALES',
      createType: 'MANUAL',
      presellType: 'NONE',
      sourceType: 'PC',
      codFee: 0,
      expressFee: 0,
      newMember: false,
      blacklist: false,
      prepay: false,
      cod: false,
      expressCod: false,
      hasInvoice: false,
      thirdDelivery: false,
      currencyCode: 'RMB',
    };
    this.details = [];
    this.payments = [];
  }
}

class SalesOrderDetail {
  constructor(sku, isGift = false) {
    this.productId = sku.productId;
    this.productCode = sku.productCode;
    this.productName = sku.productName;
    this.skuId = sku.skuId;
    this.skuCode = sku.skuCode;
    this.skuName = sku.skuName;
    this.quantity = sku.quantity;
    this.costPrice = sku.costPrice;
    this.markedPrice = sku.markedPrice;
    this.distributionPrice = sku.distributionPrice;
    this.sellingPrice = isGift ? 0 : sku.sellingPrice;
    this.settlementPrice = 0;
    this.actualSellingPrice = 0;
    this.discountAmount = 0;
    this.productType = sku.product.productType;
    this.combination = sku.combination;
    this.prepackage = sku.prepackage;
    this.lockStock = sku.lockStock;
    this.sellingAmount = sku.quantity * sku.sellingPrice;
    this.settlementAmount = 0;
    this.actualAmount = 0;
    this.distributionAmount = sku.quantity * sku.distributionPrice;
    this.combinationDetail = false;
    this.gift = isGift;
    this.manualAdd = true;
    this.oos = false;
    this.separate = false;
    this.refund = false;
    this.needReturnGoods = false;
    this.salesOrderDetailRefundStatus = 'NONE';
    this.weight = sku.weight;
    this.mallSalesOrderDetailStatus = 'WAIT_SELLER_SEND_GOODS';
    this.salesOrderDetailType = 'NORMAL';
    this.status = 'WAITING';
    this.refundStatus = 'NONE';
    this.weight = sku.weight ? sku.weight : 0;
    this.productAbnormal = false;
  }
}

const SalesOrderUtil = {
  isBeforeAudit(row) {
    return Assert.inArray(row.status, ['CREATED', 'AUDITED_ABNORMAL'])
      && !row.productAbnormal;
  },
  isBeforeDispatch(row) {
    return Assert.inArray(row.status,
      ['CREATED', 'AUDITED_ABNORMAL', 'AUDITED', 'DISPATCHED_ABNORMAL'])
      && !row.productAbnormal;
  },
  isBeforeAllDispatch(row) {
    return !Assert.inArray(row.status, ['INVALID']) && !Assert.inArray(
      row.dispatchStatus, ['ALL']) && !row.productAbnormal;
  },
  isBeforeDelivery(row) {
    return !Assert.inArray(row.status, ['INVALID']) && Assert.inArray(
      row.dispatchStatus, ['NONE']) && !row.productAbnormal;
  },
  isBeforeAllDelivery(row) {
    return !Assert.inArray(row.status, ['INVALID']) && !Assert.inArray(
      row.deliveryStatus, ['ALL']) && !row.productAbnormal;
  },
  canAutoDispatch(row) {
    return !Assert.inArray(row.status, ['INVALID', 'AUDITED_ABNORMAL'])
      && !Assert.inArray(row.dispatchStatus, ['ALL']) && !row.productAbnormal
      && !row.prerefund;
  },
  canManualDispatch(row) {
    return this.isBeforeAllDispatch(row) && !row.prerefund;
  },
  canReset(row) {
    return Assert.inArray(row.status,
      ['CREATED', 'AUDITED', 'DISPATCHED_ABNORMAL']) && !row.productAbnormal;
  },
  buildSalesOrderBO(salesOrder) {
    return {
      salesOrderId: salesOrder.salesOrderId,
      version: salesOrder.version
    };
  },
  isUrgentAndBeforeAllDispatch(row) {
    return Assert.isTrue(row.urgent) && !Assert.inArray(row.status, ['INVALID'])
      && !Assert.inArray(row.dispatchStatus, ['ALL']) && !row.productAbnormal;
  },
  isHoldAndBeforeAllDispatch(row) {
    return Assert.isTrue(row.hold) && !Assert.inArray(row.status, ['INVALID'])
      && !Assert.inArray(row.dispatchStatus, ['ALL']) && !row.productAbnormal;
  },
  isManualAndBeforeAllDispatch(row) {
    return Assert.isTrue(row.manual) && !Assert.inArray(row.status, ['INVALID'])
      && !Assert.inArray(row.dispatchStatus, ['ALL']) && !row.productAbnormal;
  }
};
export {SalesOrder, SalesOrderDetail, SalesOrderUtil};