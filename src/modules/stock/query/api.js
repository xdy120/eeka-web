import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';
export class StockApi extends RestApi {

  static get baseUrl() {
    return '/stock';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/query`, filter, paging);
  }

  static exportStock(fileName, params){
    return ajax.get(`${this.baseUrl}/exportStock/${fileName}`, {params});
  }

}

export class OccupancyApi extends RestApi {
  static get baseUrl() {
    return '/stock/occupany';
  }

}