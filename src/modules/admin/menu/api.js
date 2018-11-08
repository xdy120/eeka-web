import ajax from '@/libs/ajax';
import RestApi from '@/libs/restapi';

class MenuOperationApi extends RestApi {
  static get baseUrl() {
    return '/admin/menuOperation';
  }

  static listAll() {
    return ajax.get(`${this.baseUrl}/all`);
  }
}

export {MenuOperationApi};