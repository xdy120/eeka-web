import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class PresellApi extends RestApi {
  static get baseUrl() {
    return '/marketing/presell';
  }

  static end(bo) {
    return ajax.put(`${this.baseUrl}/${bo.presellId}/end`, bo);
  }

  static begin(bo) {
    return ajax.put(`${this.baseUrl}/${bo.presellId}/begin`, bo);
  }

  static retry(presellId, presellStoreId) {
    return ajax.put(`${this.baseUrl}/${presellId}/${presellStoreId}/retry`);
  }

  static exportPresell(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportPresell/${fileName}`, {params});
  }

}

export class PresellDetailApi extends RestApi {
  static get baseUrl() {
    return '/marketing/presell';
  }
}

export class PresellStoreDetailApi extends RestApi {
  static get baseUrl() {
    return '/marketing/presell';
  }

  static listDetail(presellId, storeId, filter, paging) {
    return this.doList(`${this.baseUrl}/${presellId}/${storeId}/detail`, filter,
      paging);
  }
}

export class PresellStoreApi extends RestApi {
  static get baseUrl() {
    return '/marketing/presell';
  }

  static listStores(presellId) {
    return ajax.get(`${this.baseUrl}/${presellId}/store`);
  }

  static modifyStore(presellId, storeId, entity) {
    return ajax.put(`${this.baseUrl}/${presellId}/store/${storeId}`, entity);
  }

  static addStore(presellId, entity) {
    return ajax.post(`${this.baseUrl}/${presellId}/store`, entity);
  }

  static remove(presellId, storeId) {
    return ajax.delete(`${this.baseUrl}/${presellId}/store/${storeId}`);
  }
}

export const MustColumns = ['规格编码', '数量'];
export const SkuColumns = [{
  label: '数量',
  prop: 'quantity',
  type: 'number'
}, {
  label: '平台商品ID',
  prop: 'mallProductId'
}];