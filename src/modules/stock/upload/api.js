import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class StockUploadApi extends RestApi {
  static get baseUrl() {
    return '/stock/upload';
  }

  static storeUpload(id) {
    return ajax.post(`${this.baseUrl}/${id}`);
  }

  static allUpload() {
    return ajax.post(`${this.baseUrl}`);
  }

  static increment(list) {
    return ajax.post(`${this.baseUrl}/increment`, list);
  }

  static cover(list) {
    return ajax.post(`${this.baseUrl}/cover`, list);
  }

  static fixedCover(list){
    return ajax.post(`${this.baseUrl}/fixCover`, list);
  }

  static exportLogs(fileName, filter){
    return ajax.get(`${this.baseUrl}/stockUploadLogs/${fileName}`, {params: filter});
  }
}

export {StockUploadApi};

export const MustColumns = ['规格编码', '数量'];