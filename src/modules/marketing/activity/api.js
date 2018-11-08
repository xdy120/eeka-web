import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class ActivityApi extends RestApi {
  static get baseUrl() {
    return '/marketing/activity';
  }

  static end(id, entity) {
    return ajax.put(this.basePath + id + '/end', entity);
  }

  static begin(id, entity) {
    return ajax.put(this.basePath + id + '/begin', entity);
  }

  static occupancy(id, entity) {
    return ajax.put(this.basePath + id + '/occupancy', entity);
  }
}

export class ActivityDetailApi extends RestApi {
  static get baseUrl() {
    return '/marketing/activity';
  }

  static end(id, entity) {
    return ajax.put(this.basePath + id + '/end', entity);
  }

  static begin(id, entity) {
    return ajax.put(this.basePath + id + '/begin', entity);
  }
}

export const MustColumns = ['规格编码', '计划数量','单价'];
export const SkuColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number'
}, {
  label: '单价',
  prop: 'price',
  type: 'number'
}, {
  label: '平台商品ID',
  prop: 'mallProductId'
}];
