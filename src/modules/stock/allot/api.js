import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class AllotApi extends RestApi {
  static get baseUrl() {
    return '/stock/allot/virtual';
  }

  static exportVirtualAllot(allotId, fileName) {
    return ajax.post(`${this.baseUrl}/${allotId}/export/${fileName}`);
  }

}

class AllotDetailApi extends RestApi {
  static get baseUrl() {
    return '/stock/allot/virtual';
  }
}

export {AllotApi, AllotDetailApi};

export const MustColumns = ['规格编码', '计划数量'];
export const SkuColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number',
  defaultValue: 1
}];