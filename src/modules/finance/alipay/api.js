import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class AlipayRecordApi extends RestApi {
  static get baseUrl() {
    return '/finance/alipay/record';
  }

  static download(entity) {
    return ajax.post(this.baseUrl + '/download', entity);
  }
}