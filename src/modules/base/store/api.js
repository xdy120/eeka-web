import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class StoreApi extends RestApi {
  static get baseUrl() {
    return '/base/store';
  }

  static getAuthConfig(storeId) {
    return ajax.get(`${this.baseUrl}/auth/url/${storeId}`);
  }

  static accessToken(storeId, code) {
    return ajax.post(`${this.baseUrl}/auth/token/access/${storeId}/${code}`);
  }

  static refreshToken(storeId) {
    return ajax.post(`${this.baseUrl}/auth/token/refresh/${storeId}`);
  }

  static getStoreReturnAddress(store) {
    return ajax.post(`${this.baseUrl}/returnAddress`, store);
  }

  static listEffective() {
    return ajax.get(`${this.baseUrl}/effective`);
  }

  static getMy() {
    return ajax.get(`${this.baseUrl}/my`);
  }

}

class StoreDownloadConfigApi extends RestApi {
  static get baseUrl() {
    return '/base/store/download/config';
  }

  static enableSupplement(id, entity) {
    return ajax.put(this.basePath + id + '/enableSupplement', entity);
  }

  static disableSupplement(id, entity) {
    return ajax.put(this.basePath + id + '/disableSupplement', entity);
  }
}

export {StoreApi, StoreDownloadConfigApi};