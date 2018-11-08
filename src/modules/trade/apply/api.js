import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class RefundApplyApi extends RestApi {
  static get baseUrl() {
    return '/trade/refund/apply';
  }

  static review(id, entity) {
    return ajax.put(this.basePath + id + '/review', entity);
  }

  static matchAbnormal(refundId,entity){
    return ajax.post(`${this.basePath}${refundId}/matchRefund`,entity);
  }
}






