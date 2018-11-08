import ajax from '@/libs/ajax';
import RestApi from '@/libs/restapi';

class RegionApi extends RestApi {
  static get baseUrl() {
    return '/admin/region';
  }

  static listChildren(id) {
    return ajax.get(`${this.baseUrl}/${id}/children`);
  }
}

class MallRegionMappingApi extends RestApi {
  static get baseUrl() {
    return '/admin/mallRegionMapping';
  }
}

export {
  RegionApi, MallRegionMappingApi
};