import RestApi from '@/libs/restapi';

export class PurchaseOrderApi extends RestApi {
  static get baseUrl() {
    return '/purchase/order';
  }
}



