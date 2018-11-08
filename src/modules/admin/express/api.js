import RestApi from '@/libs/restapi';

class GlobalExpressApi extends RestApi {
  static get baseUrl() {
    return '/admin/globalExpress';
  }
}

export {GlobalExpressApi};