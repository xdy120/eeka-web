import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export default class Api extends RestApi {

  static get baseUrl() {
    return '/admin/region';
  }

  static listAll() {
    return ajax.get(`${this.baseUrl}/all`);
  }

  static listSimple() {
    return ajax.get(`${this.baseUrl}/simple`);
  }
}