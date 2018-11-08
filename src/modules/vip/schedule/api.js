import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class VipScheduleApi extends RestApi {
  static get baseUrl() {
    return '/vip/schedule';
  }

  static upload(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/upload`, entity);
  }

  static end(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/end`, entity);
  }
}

export class VipScheduleDetailApi extends RestApi {
  static get baseUrl() {
    return '/vip/schedule';
  }
}

export const SkuColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number',
  defaultValue: 1
}, {
  label: '货值',
  prop: 'goodsValue',
  type: 'number',
}];
