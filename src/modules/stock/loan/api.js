import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class StockLoanOutApi extends RestApi {
  static get baseUrl() {
    return '/stock/loanOut';
  }

  static noticeWms(entity) {
    return ajax.put(`${this.baseUrl}/${entity.stockLoanOutId}/noticeWms`);
  }

  static cancel(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/cancel`, entity);
  }

  static verification(id, bo) {
    return ajax.put(`${this.baseUrl}/${id}/verification`, bo);
  }
}

class StockLoanOutDetailApi extends RestApi {
  static get baseUrl() {
    return '/stock/loanOut';
  }

  static get(id) {
    return ajax.get(`${this.baseUrl}/${id}/detail/` + id);
  }

}

class StockLoanInApi extends RestApi {
  static get baseUrl() {
    return '/stock/loanIn';
  }

  static noticeWms(entity) {
    return ajax.put(`${this.baseUrl}/${entity.stockLoanInId}/noticeWms`);
  }

  static cancel(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/cancel/`, entity);
  }
}

export {StockLoanOutApi, StockLoanInApi, StockLoanOutDetailApi};
export const LoanInMustColumns = ['规格编码', '通知数量'];
export const LoanOutMustColumns = ['规格编码', '计划数量'];
export const LoanOutSkuColumns = [{
  label: '计划数量',
  prop: 'planQuantity',
  type: 'number',
  defaultValue: 1
}];

export const LoanInSkuColumns = [{
  label: '通知数量',
  prop: 'noticeQuantity',
  type: 'number',
  defaultValue: 1
}];