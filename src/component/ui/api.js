import RestApi from '@/libs/restapi';

class messageApi extends RestApi {
  static get baseUrl() {
    return '/message';
  }
}

export {messageApi};