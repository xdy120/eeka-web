import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class StockUploadStrategyApi extends RestApi {
  static get baseUrl() {
    return '/base/setting/stock/upload';
  }
}

class StockDispatchStrategyApi extends RestApi {
  static get baseUrl() {
    return '/base/setting/stock/dispatch';
  }

  static getStrategyVirtualWarehouse(storeId) {
    return ajax.get(`${this.baseUrl}/virtualWarehouses/${storeId}`);
  }
  static listExpresses(storeId){
    return ajax.get(`${this.baseUrl}/expresses/${storeId}`);
  }
}

export {StockUploadStrategyApi, StockDispatchStrategyApi};