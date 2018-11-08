import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class ExpressStrategyApi extends RestApi {
  static get baseUrl() {
    return '/base/setting/express';
  }

  static getMy() {
    return ajax.get(`${this.baseUrl}/my`);
  }

  static getListById(expressStrategyId) {
    return ajax.get(`${this.baseUrl}/${expressStrategyId}/list`);
  }
}

export {ExpressStrategyApi};