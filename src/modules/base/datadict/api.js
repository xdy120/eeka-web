import ajax from '../../../libs/ajax';
import RestApi from '../../../libs/restapi';

import config from '@/config/config';

if (config.mock) {
  //import('./api.mock');
}

class DataDictApi extends RestApi {
  static get baseUrl() {
    return '/base/datadict';
  }

  static listChildren(id) {
    return ajax.get(`${this.baseUrl}/${id}/children`);
  }

  static listItems(id) {
    return ajax.get(`${this.baseUrl}/${id}/item`);
  }
}

class DataDictItemApi extends RestApi {
  static get baseUrl() {
    return '/base/datadict/item';
  }
}

export {DataDictApi, DataDictItemApi};