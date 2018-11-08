import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class SalesOrderApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales';
  }

  // static getSourceOrder(expressNo){
  //     return ajax.get(this.baseUrl+'/'+expressNo+'/sourceOrder');
  // }

  static listAdvance(filter, paging) {
    filter.set('page', paging.page);
    filter.set('pageSize', paging.pageSize);
    return ajax.get(`${this.baseUrl}/advance`, {params: filter});
  }

  static getDetailInfo(id) {
    return ajax.get(`${this.baseUrl}/${id}/detailInfo`);
  }

  static getSourceOrderByKeyWord(dispatchNo) {
    return ajax.get(this.baseUrl + '/' + dispatchNo
      + '/sourceOrderByDispatchNo');
  }

  static download(downloadBO) {
    return ajax.post(`${this.baseUrl}/download`, downloadBO);
  }

  static audit(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/audit`,
      salesOrderBO);
  }

  static invalid(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/invalid`,
      salesOrderBO);
  }

  static hold(holdBO) {
    return ajax.put(`${this.baseUrl}/${holdBO.salesOrderId}/hold`, holdBO);
  }

  static cancelHold(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/cancelHold`,
      salesOrderBO);
  }

  static manual(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/manual`,
      salesOrderBO);
  }

  static cancelManual(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/cancelManual`,
      salesOrderBO);
  }

  static urgent(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/urgent`,
      salesOrderBO);
  }

  static cancelUrgent(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/cancelUrgent`,
      salesOrderBO);
  }

  static reset(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/reset`,
      salesOrderBO);
  }

  static matchProduct(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/matchProduct`,
      salesOrderBO);
  }

  static replaceDetail(replaceDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${replaceDetailBO.salesOrderId}/replaceDetail`,
      replaceDetailBO);
  }

  static addGift(addGiftBO) {
    return ajax.post(`${this.baseUrl}/${addGiftBO.salesOrderId}/addGift`,
      addGiftBO);
  }

  static replaceGift(replaceGiftBO) {
    return ajax.put(`${this.baseUrl}/${replaceGiftBO.salesOrderId}/replaceGift`,
      replaceGiftBO);
  }

  static removeGift(removeGiftBO) {
    return ajax.put(`${this.baseUrl}/${removeGiftBO.salesOrderId}/removeGift`,
      removeGiftBO);
  }

  static suggestExpress(suggestExpressBO) {
    return ajax.put(
      `${this.baseUrl}/${suggestExpressBO.salesOrderId}/suggestExpress`,
      suggestExpressBO);
  }

  static suggestWarehouse(suggestWarehouseBO) {
    return ajax.put(
      `${this.baseUrl}/${suggestWarehouseBO.salesOrderId}/suggestWarehouse`,
      suggestWarehouseBO);
  }

  static listWaitingDispatch(md5) {
    return ajax.get(`${this.baseUrl}/listWaitingDispatch/${md5}`);
  }

  static manualDispatch(manualDispatchBO) {
    return ajax.post(
      `${this.baseUrl}/${manualDispatchBO.salesOrderId}/manualDispatch`,
      manualDispatchBO);
  }

  static offlineDelivery(offlineDeliveryBO) {
    return ajax.post(
      `${this.baseUrl}/${offlineDeliveryBO.salesOrderId}/offlineDelivery`,
      offlineDeliveryBO);
  }

  static checkDispatchStock(manualDispatchBO) {
    return ajax.post(`${this.baseUrl}/checkDispatchStock`, manualDispatchBO);
  }

  static importSalesOrder(data) {
    return ajax.post(`${this.baseUrl}/import`, data);
  }

  static listDetail(params) {
    return this.doList(`${this.baseUrl}/detail`, params, null);
  }

  static exportFile(filter) {
    return this.doList(`${this.baseUrl}/export`, filter);
  }

  static decrypt(salesOrderId) {
    return ajax.get(`${this.baseUrl}/${salesOrderId}/decrypt`);
  }

  static copySalesOrder(salesOrderId) {
    return ajax.get(`${this.baseUrl}/copySalesOrder/${salesOrderId}`);
  }

  static stockOccupancyDetail(filter, paging) {
    return this.doList(`${this.baseUrl}/occupancyDetailQuery`, filter, paging);
  }

  static autoDispatch(salesOrderBO) {
    return ajax.put(`${this.baseUrl}/${salesOrderBO.salesOrderId}/autoDispatch`,
      salesOrderBO);
  }

  static modifyReceiverInfo(salesOrderBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderBO.salesOrderId}/modifyReceiverInfo`,
      salesOrderBO);
  }

  static modifyRemark(salesOrderBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderBO.salesOrderId}/modifyRemark`,
      salesOrderBO);
  }

  static manualMallDelivery(salesOrderBo) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderBo.salesOrderId}/manualMallDelivery`,
      salesOrderBo);
  }

  static cancelPrerefund(salesOrderBo) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderBo.salesOrderId}/cancelPrerefund`,
      salesOrderBo);
  }
}

class SalesOrderSubApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales/sub';
  }
}

class SalesOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales';
  }

  static list(salesOrderId) {
    return ajax.get(`${this.baseUrl}/${salesOrderId}/detail`);
  }

  static listDelivered(salesOrderId) {
    return ajax.get(`${this.baseUrl}/${salesOrderId}/detail/delivered`);
  }

  static invalid(salesOrderDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/invalid`,
      salesOrderDetailBO);
  }

  static applyRefund(salesOrderDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/applyRefund`,
      salesOrderDetailBO);
  }

  static refund(salesOrderDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/refund`,
      salesOrderDetailBO);
  }

  static cancelRefund(salesOrderDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/cancelRefund`,
      salesOrderDetailBO);
  }

  static replace(salesOrderDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/replace`,
      salesOrderDetailBO);
  }

  static matchProduct(salesOrderDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/matchProduct`,
      salesOrderDetailBO);
  }

  static manualDropShipping(salesOrderDetailBO) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/manualDropShipping`,
      salesOrderDetailBO);
  }

  static split(salesOrderDetailBO) {
    return ajax.post(
      `${this.baseUrl}/${salesOrderDetailBO.salesOrderId}/detail/${salesOrderDetailBO.salesOrderDetailId}/split`,
      salesOrderDetailBO);
  }
}

class SalesOrderPaymentApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales';
  }

  static list(salesOrderId) {
    return ajax.get(`${this.baseUrl}/${salesOrderId}/payment`);
  }

  static add(salesOrderId, payment) {
    return ajax.post(`${this.baseUrl}/${salesOrderId}/payment`, payment);
  }

  static modify(salesOrderId, salesOrderPaymentId, payment) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderId}/payment/${salesOrderPaymentId}`,
      payment);
  }

  static remove(salesOrderId, salesOrderPaymentId) {
    return ajax.delete(
      `${this.baseUrl}/${salesOrderId}/payment/${salesOrderPaymentId}`);
  }
}

class SalesOrderInvoiceApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales';
  }

  static list(salesOrderId) {
    return ajax.get(`${this.baseUrl}/${salesOrderId}/invoice`);
  }

  static add(salesOrderId, invoice) {
    return ajax.post(`${this.baseUrl}/${salesOrderId}/invoice`, invoice);
  }

  static modify(salesOrderId, salesOrderInvoiceId, invoice) {
    return ajax.put(
      `${this.baseUrl}/${salesOrderId}/invoice/${salesOrderInvoiceId}`,
      invoice);
  }

  static remove(salesOrderId, salesOrderInvoiceId) {
    return ajax.delete(
      `${this.baseUrl}/${salesOrderId}/invoice/${salesOrderInvoiceId}`);
  }
}

class SalesOrderMarketingApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales';
  }

  static list(salesOrderId) {
    return ajax.get(`${this.baseUrl}/${salesOrderId}/marketing`);
  }
}

class SalesOrderDiscountApi extends RestApi {
  static get baseUrl() {
    return '/trade/sales';
  }

  static list(salesOrderId) {
    return ajax.get(`${this.baseUrl}/${salesOrderId}/discount`);
  }
}

class RatioQueryApi {

  static ratioQuery(salesOrderId, type) {
    return ajax.get(`/stock/ratioQuery/${type}/${salesOrderId}`);
  }
}

export {
  SalesOrderApi,
  SalesOrderSubApi,
  SalesOrderDetailApi,
  SalesOrderPaymentApi,
  SalesOrderInvoiceApi,
  SalesOrderDiscountApi,
  SalesOrderMarketingApi,
  RatioQueryApi
};

export const MustColumns = ['交易号', '会员昵称', '收货人', '电话', '手机', '省',
  '市', '区', '地址', '下单时间', '支付时间', '规格编码', '数量', '成交价', '结算金额'];

