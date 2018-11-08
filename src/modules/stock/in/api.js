import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class StockInApi extends RestApi {
  static get baseUrl() {
    return '/stock/in';
  }

  static noticeWms(entity) {
    return ajax.put(`${this.baseUrl}/${entity.stockInOrderId}/noticeWms`,entity);
  }

  static cancel(id, entity) {
    return ajax.put(`${this.basePath}${id}/cancel`, entity);
  }
}

class StockInDetailApi extends RestApi {
  static get baseUrl() {
    return '/stock/in';
  }

}

export {StockInApi, StockInDetailApi};
export const MustColumns = ['规格编码', '通知数量', '价格'];
export const SkuColumns = [{
  label: '通知数量',
  prop: 'noticeQuantity',
  type: 'number',
  defaultValue: 1,
}, {
  label: '价格',
  prop: 'price',
  type: 'number'
}];