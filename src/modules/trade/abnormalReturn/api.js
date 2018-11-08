import RestApi from '@/libs/restapi';
import ajax from '../../../libs/ajax';

export class ReturnSignApi extends RestApi {
  static get baseUrl() {
    return '/trade/return/sign';
  }

}

export class ReturnOrderApi extends RestApi {
  static get baseUrl() {
    return '/trade/return';
  }

  static review(id, entity) {
    return ajax.put(this.basePath + id + '/review', entity);
  }

  static createNotice(entity) {
    return ajax.post(this.basePath + 'createNotice', entity);
  }

  static addReturnOrder(entity) {
    return ajax.post(this.basePath + 'addReturn', entity);
  }

  //将退入的无头件  自动关联
  static relateSourceOrder(entity) {
    return ajax.post(this.basePath + 'autoRelate', entity);
  }

  static exportData(fileName,params){
    return ajax.get(`${this.baseUrl}/exportReturn/${fileName}/`,{params});
  }

  //保存关联的异常单
  static updateAbnormal(id,versionBo){
    return ajax.post(`${this.baseUrl}/${id}/updateAbnormal`, versionBo);
  }

  //拆分无头件
  static splitUnknownReturnOrder(entity) {
    return ajax.post(this.basePath + 'saveUnknownOrder', entity);
  }

  //添加换出商品
  static addOutDetails(entity) {
    return ajax.post(this.baseUrl + '/out/details/add', entity);
  }
}

export class ReturnOrderDetailApi extends RestApi {
  static get baseUrl() {
    return '/trade/return';
  }

  static listInDetail(id, filter) {
    return RestApi.doList(`${this.baseUrl}/${id}/detail`, filter);
  }
}

export class ReturnOrderOutDetailApi extends RestApi {
  static get baseUrl() {
    return '/trade/return';
  }

  static modifyDetail(id, detailId, entity) {
    return ajax.put(`${this.baseUrl}/${id}/out/detail/` + detailId, entity);
  }

  static listOutDetail(id, filter) {
    return RestApi.doList(`${this.baseUrl}/${id}/out/detail`, filter);
  }
}







