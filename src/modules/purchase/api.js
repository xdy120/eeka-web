import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class SupplierApi extends RestApi {
  static get baseUrl() {
    return '/purchase/supplier';
  }

  static resetAudit(id, entity) {
    return ajax.put(this.basePath + id + '/resetAudit', entity);
  }
}

export class PurchaseOrderApi extends RestApi {
  static get baseUrl() {
    return '/purchase/order';
  }
}

export class PurchaseOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/purchase/order';
  }

  static list(id, filter, paging) {
    return RestApi.doList(`${this.baseUrl}/${id}/detail`, filter, paging);
  }

  static listDetailPrint(id) {
    return RestApi.doList(`${this.baseUrl}/${id}/detail/detailPrint`);
  }
}

export class PurchaseNoticeOrderApi extends RestApi {
  static get baseUrl() {
    return '/purchase/notice';
  }

  static invalid(id, entity) {
    return ajax.put(this.basePath + id + '/invalid', entity);
  }

  static noticeWms(id, entity) {
    return ajax.put(`${this.basePath}${id}/noticeWms`, entity);
  }

  static cancel(id, entity) {
    return ajax.put(`${this.basePath}${id}/cancel`, entity);
  }

}

export class PurchaseNoticeOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/purchase/notice';
  }

  static list(id, filter, paging) {
    return RestApi.doList(`${this.baseUrl}/${id}/detail`, filter, paging);
  }
}

export class PurchaseReturnOrderApi extends RestApi {
  static get baseUrl() {
    return '/purchase/return';
  }

  static noticeWms(id, entity) {
    return ajax.put(`${this.basePath}${id}/noticeWms`, entity);
  }

  static cancel(id, entity) {
    return ajax.put(`${this.basePath}${id}/cancel`, entity);
  }

}

export class PurchaseReturnOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/purchase/return';
  }

  static list(id, filter, paging) {
    return RestApi.doList(`${this.baseUrl}/${id}/detail`, filter, paging);
  }
}

export const MustColumns = ['规格编码', '数量', '建议采购价', '实际采购价'];
export const ReturnMustColumns = ['规格编码', '数量', '采购退货价', '建议采购价'];
export const SkuColumns = [{
  label: '数量',
  prop: 'quantity',
  type: 'number'
}, {
  label: '建议采购价',
  prop: 'purchasePrice',
  type: 'number'
}, {
  label: '实际采购价',
  prop: 'actualPrice',
  type: 'number'
}];

export const ReturnSkuColumns = [{
  label: '数量',
  prop: 'planQuantity',
  type: 'number'
}, {
  label: '建议采购价',
  prop: 'purchasePrice',
  type: 'number'
}, {
  label: '采购退货价',
  prop: 'purchaseReturnPrice',
  type: 'number'
}];


