import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class VipAdjustApi extends RestApi {
  static get baseUrl() {
    return '/vip/adjust';
  }

  static upload(id) {
    return ajax.put(`${this.baseUrl}/${id}/upload`);
  }

  static end(id) {
    return ajax.put(`${this.baseUrl}/${id}/end`);
  }
}

export class VipAdjustDetailApi extends RestApi {
  static get baseUrl() {
    return '/vip/adjust';
  }
}

export const SkuColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number'
}];