import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class DispatchOrderApi extends RestApi {
  static get baseUrl() {
    return '/trade/dispatch';
  }

  static listBySalesOrderId(salesOrderId) {
    return ajax.get(`/trade/sales/${salesOrderId}/dispatch`);
  }

  static cancel(dispatchOrderBO) {
    return ajax.put(`${this.baseUrl}/${dispatchOrderBO.dispatchOrderId}/cancel`,
      dispatchOrderBO);
  }

  static noticeWms(dispatchOrderBO) {
    return ajax.put(
      `${this.baseUrl}/${dispatchOrderBO.dispatchOrderId}/noticeWms`,
      dispatchOrderBO);
  }

  static listWmsLog(dispatchOrderId) {
    return ajax.get(`${this.baseUrl}/${dispatchOrderId}/listWmsLog`);
  }

  static manualDelivery(manualDeliveryBO) {
    return ajax.put(
      `${this.baseUrl}/${manualDeliveryBO.dispatchOrderId}/manualDelivery`,
      manualDeliveryBO);
  }

  static reposting(entity) {
    return ajax.put(`${this.baseUrl}/${entity.dispatchOrderId}/reposting`);
  }
}

class DispatchOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/trade/dispatch';
  }

  static list(dispatchOrderId) {
    return ajax.get(`${this.baseUrl}/${dispatchOrderId}/detail`);
  }

  static cancel(dispatchOrderBO) {
    return ajax.put(
      `${this.baseUrl}/${dispatchOrderBO.dispatchOrderId}/detail/${dispatchOrderBO.dispatchOrderDetailId}/cancel`,
      dispatchOrderBO);
  }
}

class DispatchOrderDeliveryApi extends RestApi {
  static get baseUrl() {
    return '/trade/dispatch';
  }

  static list(dispatchOrderId) {
    return ajax.get(`${this.baseUrl}/${dispatchOrderId}/delivery`);
  }

  static listBySalesOrderId(salesOrderId) {
    return ajax.get(`/trade/sales/${salesOrderId}/delivery`);
  }
}

export {DispatchOrderApi, DispatchOrderDetailApi, DispatchOrderDeliveryApi};