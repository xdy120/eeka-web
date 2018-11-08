import RestApi from '@/libs/restapi';

export class OutBatchApi extends RestApi {
  static get baseUrl() {
    return '/stock/out/detail';
  }
}

export class InBatchApi extends RestApi {
  static get baseUrl() {
    return '/stock/in/detail';
  }
}





