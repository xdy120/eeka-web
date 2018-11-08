import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class VipReturnApi extends RestApi {

  static get baseUrl() {
    return '/vip/return';
  }

  static sign(id, entity) {
    return ajax.put(this.basePath + id + '/sign', entity);
  }

  static scan(id, entity) {
    return ajax.put(this.basePath + id + '/scan', entity);
  }

  static exportReturn(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportSku/${fileName}`, {params});
  }

  /**
   * 匹配异常商品
   */
  static match(id) {
    return ajax.put(this.basePath + id + '/match');
  }

  static recalculateAmount(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/recalculateAmount`, entity);
  }

  static download(downloadBO) {
    return ajax.post(`${this.baseUrl}/download`, downloadBO);
  }
}

export class VipReturnDetailApi extends RestApi {

  static get baseUrl() {
    return '/vip/return';
  }

  static listDetail(id, filter) {
    return this.doList(`${this.baseUrl}/${id}/detail/details`, filter);
  }
}

export const MustColumns = ['规格编码', '退货数量', 'PO编号', '唯品会箱码'];
export const SkuColumns = [{
  label: '退货数量',
  prop: 'returnQuantity',
  type: 'number',
  defaultValue: 1
}, {
  label: 'PO编号',
  prop: 'poCode',
  type: 'String',
}, {
  label: '唯品会箱码',
  prop: 'boxNumber',
  type: 'number',
}];