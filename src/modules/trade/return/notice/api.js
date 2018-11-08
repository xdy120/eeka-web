import RestApi from '@/libs/restapi';
import ajax from '../../../../libs/ajax';

export class ReturnNoticeOrderApi extends RestApi {
  static get baseUrl() {
    return '/trade/return/notice';
  }

  static cancel(id,entity) {
    return ajax.put(`${this.basePath}${id}/cancel`,entity);
  }

  static noticeWms(id,entity) {
    return ajax.put(`${this.basePath}${id}/noticeWms`,entity);
  }

  static exportData(fileName,params){
    return ajax.get(`${this.baseUrl}/exportNoticeOrder/${fileName}/`,{params});
  }

  static reposting(entity){
    return ajax.put(this.basePath + entity.returnNoticeOrderId + '/reposting');
  }

}

export class ReturnNoticeOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/trade/return/notice';
  }
}