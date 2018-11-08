import ajax from '@/libs/ajax';
import RestApi from '@/libs/restapi';

class MallAppApi extends RestApi {
  static get baseUrl() {
    return '/admin/mallapp';
  }

  static listByMallType(mallType) {
    return ajax.get(`${this.baseUrl}/${mallType}`);
  }
}

export {MallAppApi};