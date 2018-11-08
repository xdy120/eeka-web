import RestApi from '@/libs/restapi';

class WmsAppApi extends RestApi {
  static get baseUrl() {
    return '/admin/wmsapp';
  }
}

export {WmsAppApi};