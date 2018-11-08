import RestApi from '@/libs/restapi';
import ajax from '../../../libs/ajax';

export class ReturnSignApi extends RestApi {
  static get baseUrl() {
    return '/trade/return/sign';
  }

  static getReturnSignByExpressNo(expressNo){
    return ajax.get(`${this.baseUrl}/${expressNo}/express`);
  }

  static exportData(fileName,params){
    return ajax.get(`${this.baseUrl}/exportSign/${fileName}/`,{params});
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

  static getSourceOrderByKeyWord(keyWord) {
    return ajax.get(this.baseUrl + '/' + keyWord
      + '/sourceOrder');
  }

  //将退入的无头件 手动关联原订单
  static relateSourceOrder(entity) {
    return ajax.post(this.basePath + 'updateSourceOrder', entity);
  }

  //拆分无头件
  static splitUnknownReturnOrder(entity) {
    return ajax.post(this.basePath + 'saveUnknownOrder', entity);
  }

  //添加换出商品
  static addOutDetails(entity) {
    return ajax.post(this.baseUrl + '/out/details/add', entity);
  }

  //修改退入和换出的金额
  static modifyAmount(versionBo){
    return ajax.post(`${this.baseUrl}/modifyAmount`,versionBo);
  }

  static stockOccupancyDetail(filter, paging){
    return this.doList(`${this.baseUrl}/occupancyDetailQuery`, filter, paging);
  }

  //复核之前的check
  static checkReview(entity){
    return ajax.post(`${this.baseUrl}/checkReview`, entity);
  }

  static reposting(entity){
    return ajax.put(this.basePath + entity.returnOrderId + '/reposting');
  }

  static exportData(fileName,params){
    return ajax.get(`${this.baseUrl}/exportReturn/${fileName}/`,{params});
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
    return ajax.post(`${this.baseUrl}/${id}/out/detail/${detailId}/replace`, entity);
  }

  static listOutDetail(id, filter) {
    return RestApi.doList(`${this.baseUrl}/${id}/out/detail`, filter);
  }
}







