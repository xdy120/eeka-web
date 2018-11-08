import RestApi from '@/libs/restapi';

export default class Api extends RestApi {

  static get baseUrl() {
    return '/base/setting/order_audit_strategy';
  }

}