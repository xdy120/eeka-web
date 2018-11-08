import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class StockApi extends RestApi {
  static get baseUrl() {
    return '/stock';
  }

  static listSkuStockInfo(stockDispatchStrategyId, skuId) {
    return ajax.get(`${this.baseUrl}/${stockDispatchStrategyId}/sku/${skuId}`);
  }
}

export {StockApi};