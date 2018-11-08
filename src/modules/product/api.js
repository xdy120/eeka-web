import ajax from '@/libs/ajax';
import RestApi from '@/libs/restapi';

class ProductApi extends RestApi {
  static get baseUrl() {
    return '/product';
  }

  static listSkus(id) {
    return ajax.get(`${this.baseUrl}/${id}/sku`);
  }

  static modifySkus(id, sku) {
    return ajax.put(`${this.baseUrl}/${id}/sku`, sku);
  }

  static importProduct(data) {
    return ajax.post(`${this.baseUrl}/import`, data);
  }

  static exportSku(fileName, filter) {
    return ajax.get(`${this.baseUrl}/exportSku/${fileName}`, {params: filter});
  }

  static importPrice(data) {
    return ajax.post(`${this.baseUrl}/priceImport`, data);
  }

  static noticeWms(id) {
    return ajax.put(`${this.baseUrl}/${id}/noticeWms`);
  }
}

class SkuApi extends RestApi {
  static get baseUrl() {
    return '/product/sku';
  }

  static listFull(filter, paging) {
    return this.doList(`${this.baseUrl}/full`, filter, paging);
  }

  static listFullByCode(codes) {
    return this.doList(`${this.baseUrl}/list/codes`, {codes});
  }

  static listCombination(filter, paging) {
    return this.doList(`${this.baseUrl}/combination`, filter, paging);
  }

  static exportCombination(fileName, filter) {
    return ajax.get(`${this.baseUrl}/exportCombination/${fileName}`, {params: filter});
  }

  static addCombination(domain) {
    return ajax.post(`${this.baseUrl}/combination`, domain);
  }

  static modifyCombination(id, domain) {
    return ajax.put(`${this.baseUrl}/combination/${id}`, domain);
  }

  static disableCombination(id) {
    return ajax.put(`${this.baseUrl}/combination/${id}/disable`);
  }

  static enableCombination(id) {
    return ajax.put(`${this.baseUrl}/combination/${id}/enable`);
  }

  static importCombination(list) {
    return ajax.post(`${this.baseUrl}/combination/import`, list);
  }

  static getEnableSkuByCode(skuCode) {
    return ajax.get(`${this.baseUrl}/${skuCode}/enable`);
  }

  static disablePrepackage(id) {
    return ajax.put(`${this.baseUrl}/prepackage/${id}/disable`);
  }

  static enablePrepackage(id) {
    return ajax.put(`${this.baseUrl}/prepackage/${id}/enable`);
  }
}

class CombinationApi extends RestApi {
  static get baseUrl() {
    return '/product/combination';
  }

  static addDetail(id, entity) {
    return ajax.post(`${this.baseUrl}/${id}/detail`, entity);
  }

  static removeDetail(combinationId, combinationDetailId) {
    return ajax.delete(`${this.baseUrl}/${combinationId}/detail/`
      + combinationDetailId);
  }

  static setMainSku(combinationId, entity) {
    return ajax.post(`${this.baseUrl}/${combinationId}/detail/setMainSku`,
      entity);
  }
}

class AttributeApi extends RestApi {
  static get baseUrl() {
    return '/product/attribute';
  }

  static listCustom() {
    return ajax.get(`${this.baseUrl}/custom`);
  }

  static listCoder() {
    return ajax.get(`${this.baseUrl}/coder`);
  }

  static validateAttributeName(attributeName) {
    return ajax.get(`${this.baseUrl}/${attributeName}/validate`);
  }
}

class CategoryApi extends RestApi {
  static get baseUrl() {
    return '/product/category';
  }

  static listChildren(id) {
    return ajax.get(`${this.baseUrl}/${id}/children`);
  }
}

class ProductMallMappingApi extends RestApi {
  static get baseUrl() {
    return '/product/mapping';
  }

  static download(entity) {
    return ajax.post(this.baseUrl + '/download', entity);
  }

  static export(fileName, filter) {
    return ajax.get(`${this.baseUrl}/export/${fileName}`, {params: filter});
  }

  static setDropShipping(mapping) {
    return ajax.put(
      `${this.baseUrl}/setDropShipping/${mapping.productMallMappingId}`);
  }

  static cancelDropShipping(mapping) {
    return ajax.put(
      `${this.baseUrl}/cancelDropShipping/${mapping.productMallMappingId}`);
  }

  static getMallProductUrl(mapping) {
    return ajax.get(
      `${this.baseUrl}/getMallProductUrl/${mapping.productMallMappingId}`);
  }
}

export {
  ProductApi,
  SkuApi,
  CombinationApi,
  AttributeApi,
  CategoryApi,
  ProductMallMappingApi
};

export const MustCombinationColumns = ['套装编码', '套装名称', '规格编码'];

export const MustProductColumns = ['商品名称', '商品编码', '规格名称', '规格编码', '品牌名称',
  '品牌编码'];

export const MustPriceColumns = ['规格编码', '商品编码'];




