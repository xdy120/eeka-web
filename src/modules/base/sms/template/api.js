import ajax from '@/libs/ajax';
import RestApi from '@/libs/restapi';

export default class Api extends RestApi {

  static get baseUrl() {
    return '/base/sms/template';
  }

  static listStore(templateId) {
    return ajax.get(`${this.baseUrl}/${templateId}/store`);
  }

  static addStore(templateId, store) {
    return ajax.post(`${this.baseUrl}/${templateId}/store`, store);
  }

  static removeStore(templateId, smsTemplateStoreId) {
    return ajax.delete(
        `${this.baseUrl}/${templateId}/store/${smsTemplateStoreId}`);
  }

}
