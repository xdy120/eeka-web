import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class VipReturnNoticeApi extends RestApi {

  static get baseUrl() {
    return '/vip/return/notice';
  }

  static cancel(vipReturnNoticeCancelBO) {
    return ajax.put(
      `${this.baseUrl}/${vipReturnNoticeCancelBO.vipReturnNoticeId}/cancel`,
      vipReturnNoticeCancelBO);
  }

  static noticeWms(vipReturnNotice) {
    return ajax.put(
      `${this.baseUrl}/${vipReturnNotice.vipReturnNoticeId}/noticeWms`);
  }

  static recalculateAmount(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/recalculateAmount`, entity);
  }

  static reposting(entity) {
    return ajax.put(`${this.baseUrl}/${entity.vipReturnNoticeId}/reposting`);
  }

  static exportData(fileName,params){
    return ajax.get(`${this.baseUrl}/exportVipReturnNotice/${fileName}`,{params});
  }
}

export class VipReturnNoticeDetailApi extends RestApi {

  static get baseUrl() {
    return '/vip/return/notice';
  }

}
