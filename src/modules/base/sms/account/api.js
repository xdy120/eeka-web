import ajax from '@/libs/ajax';
import RestApi from '@/libs/restapi';

export default class Api extends RestApi {

  static get baseUrl() {
    return '/base/sms/account';
  }

  static listPaging(filter, paging) {
    return this.doList(`${this.baseUrl}/paging`, filter, paging);
  }

  static countBySmsAccount(smsAccount) {
    return ajax.get(`${this.baseUrl}/${smsAccount}/account`);
  }
}