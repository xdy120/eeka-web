import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class ExpressApi extends RestApi {
  static get baseUrl() {
    return '/base/express';
  }
}

export class ExpressRegionApi extends RestApi {
  static get baseUrl() {
    return '/base/express/region';
  }

  static saveExpressRegion(expressId, expressRegions) {
    return ajax.post(`${this.baseUrl}/${expressId}/save`, expressRegions);
  }

  static listSimple(filter, paging) {
    return this.doList(`${this.baseUrl}/simple`, filter, paging);
  }
}

export class ExpressWmsMappingApi extends RestApi {
  static get baseUrl() {
    return '/base/express/wms/mapping';
  }
}