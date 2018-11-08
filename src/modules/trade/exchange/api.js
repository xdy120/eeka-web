import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class ExchangeApi extends RestApi {
  static get baseUrl() {
    return '/trade/exchange';
  }

  /*同意换货*/
  static agree(exchangeId) {
    return ajax.get(this.basePath + exchangeId + '/agree');
  }

  /*拒绝换货*/
  static refuse(exchangeId, reasonCode) {
    return ajax.get(this.basePath + exchangeId + '/' + reasonCode + '/refuse');
  }
  static matchExchange(exchangeId,entity){
    return ajax.post(`${this.basePath}${exchangeId}/matchExchange`,entity);
  }

  static deleteExchangeOccupancy(exchangeApplyId){
    return ajax.get(`${this.basePath}${exchangeApplyId}/deleteOccupancy`);
  }

}