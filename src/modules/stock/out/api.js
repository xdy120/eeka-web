import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class StockOutApi extends RestApi {
  static get baseUrl() {
    return '/stock/out';
  }

  static noticeWms(entity) {
    return ajax.put(`${this.baseUrl}/${entity.stockOutOrderId}/noticeWms`,entity);
  }

  static cancel(id, entity) {
    return ajax.put(`${this.basePath}${id}/cancel`, entity);
  }

  static exportData(fileName,params){
    return ajax.get(`${this.basePath}exportStockOut/${fileName}`,{params});
  }
}

class StockOutDetailApi extends RestApi {
  static get baseUrl() {
    return '/stock/out';
  }

}

export {StockOutApi, StockOutDetailApi};
export const MustColumns = ['规格编码', '计划数量', '价格'];
export const SkuColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number',
  defaultValue: 1
}, {
  label: '价格',
  prop: 'price',
  type: 'number'
}];
