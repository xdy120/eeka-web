import RestApi from '@/libs/restapi';
import ajax from '../../../libs/ajax';

export class RefundOrderApi extends RestApi {
  static get baseUrl() {
    return '/trade/refund';
  }

  static review(id, entity) {
    return ajax.put(this.basePath + id + '/review', entity);
  }
}

export class RefundOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/trade/refund';
  }
}





