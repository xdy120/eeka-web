import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class VipDispatchApi extends RestApi {
  static get baseUrl() {
    return '/vip/dispatch';
  }

  /**
   * 绑定出仓单
   */
  static bindDelivery(id, entity) {
    return ajax.put(this.basePath + id + '/bindDelivery', entity);
  }

  /**
   * 匹配异常商品
   */
  static match(id) {
    return ajax.put(this.basePath + id + '/match');
  }

  static noticeWms(entity) {
    return ajax.put(`${this.baseUrl}/${entity.vipDispatchId}/noticeWms`);
  }

  static cancel(vipDispatchCancelBO) {
    return ajax.put(
      `${this.baseUrl}/${vipDispatchCancelBO.vipDispatchId}/cancel`,
      vipDispatchCancelBO);
  }

  static exportDispatch(fileName, filter) {
    return ajax.post(`${this.baseUrl}/exportSku/${fileName}`, filter);
  }

  static download(downloadBO) {
    return ajax.post(`${this.baseUrl}/download`, downloadBO);
  }

  static recalculateAmount(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/recalculateAmount`, entity);
  }

  static reposting(entity) {
    return ajax.put(`${this.baseUrl}/${entity.vipDispatchId}/reposting`);
  }

  static replenishment(id) {
    return ajax.get(`${this.baseUrl}/${id}/replenishment`);
  }
}

export class VipDispatchDetailApi extends RestApi {
  static get baseUrl() {
    return '/vip/dispatch';
  }
}

export const MustColumns = ['规格编码', 'PO编号', '通知数量'];
export const SkuColumns = [{
  label: 'PO编号',
  prop: 'poCode',
  type: 'String',
}, {
  label: '通知数量',
  prop: 'noticeQuantity',
  type: 'number',
  defaultValue: 1
}, {
  label: '唯品价',
  prop: 'vipPrice',
}];

export const Columns = [{
  label: '通知数量',
  prop: 'noticeQuantity',
  type: 'number',
  defaultValue: 1
}, {
  label: 'PO编号',
  prop: 'poCode',
  type: 'String'
}];
