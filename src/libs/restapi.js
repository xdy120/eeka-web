import ajax from '@/libs/ajax';

export default class RestApi {

  static get baseUrl() {
    return '';
  }

  static get basePath() {
    return this.baseUrl + '/';
  }

  static list(filter, paging) {
    return this.doList(this.baseUrl, filter, paging);
  }

  // 查单分页明细
  static listDetailPage(id, filter, paging) {
    return this.doList(`${this.baseUrl}/${id}/detail`, filter, paging);
  }

  // 查单明细
  static listDetail(id, filter) {
    return this.doList(`${this.baseUrl}/${id}/detail`, filter);
  }

  static doList(url, filter, paging) {
    let params = filter;
    if (paging) {
      params = Object.assign(filter, paging);
    }
    return ajax.get(url, {params});
  }

  static add(entity) {
    return ajax.post(this.baseUrl, entity);
  }

  static addDetail(id, entity) {
    return ajax.post(`${this.baseUrl}/${id}/detail/` + id, entity);
  }

  static modifyDetail(id, entity) {
    return ajax.put(`${this.baseUrl}/${id}/detail/` + id, entity);
  }

  static removeDetail(id, entity) {
    return ajax.patch(`${this.baseUrl}/${id}/detail/` + id, entity);
  }

  static addBatch(list) {
    return ajax.post(`${this.baseUrl}/batch`, list);
  }

  static get(id) {
    return ajax.get(this.basePath + id);
  }

  static modify(id, entity) {
    return ajax.put(this.basePath + id, entity);
  }

  static modifyBatch(list) {
    return ajax.put(`${this.baseUrl}/batch`, list);
  }

  static copy(id) {
    return ajax.post(this.basePath + id + '/copy');
  }

  static remove(id) {
    return ajax.delete(this.basePath + id);
  }

  static audit(id, entity) {
    return ajax.put(this.basePath + id + '/audit', entity);
  }

  static invalid(id, entity) {
    return ajax.put(this.basePath + id + '/invalid', entity);
  }

  static finish(id, entity) {
    return ajax.put(this.basePath + id + '/finish', entity);
  }

  static enable(id) {
    return ajax.put(this.basePath + id + '/enable');
  }

  static notice(id, entity) {
    return ajax.put(this.basePath + id + '/notice', entity);
  }

  static disable(id) {
    return ajax.put(this.basePath + id + '/disable');
  }

}
