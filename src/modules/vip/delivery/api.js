import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class VipDeliveryApi extends RestApi {
  static get baseUrl() {
    return '/vip/delivery';
  }

  static delivery(id, entity) {
    return ajax.put(this.basePath + id + '/delivery', entity);
  }

  static queryDispatch(id, entity) {
    return this.doList(`${this.baseUrl}/${id}/query/dispatch`, entity, null);
  }

  static exportDelivery(fileName, filter) {
    return ajax.post(`${this.baseUrl}/exportSku/${fileName}`, filter);
  }

  static cancel(id, entity) {
    return ajax.put(this.basePath + id + '/cancel', entity);
  }

  static manualDelivery(id, bo){
    return ajax.put(`${this.baseUrl}/${id}/manualDelivery`,bo);
  }
}