import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

class WarehouseApi extends RestApi {
  static get baseUrl() {
    return '/base/warehouse';
  }

  static listEffective() {
    return ajax.get(`${this.baseUrl}/effective`);
  }
}

class VirtualWarehouseApi extends RestApi {
  static get baseUrl() {
    return '/base/warehouse/virtual';
  }

  static getMy() {
    return ajax.get(`${this.baseUrl}/my`);
  }

  static listEffective() {
    return ajax.get(`${this.baseUrl}/effective`);
  }
}

class WarehouseRegionApi extends RestApi {
  static get baseUrl() {
    return '/base/warehouse/region';
  }

  static saveWarehouseRegion(warehouseId, warehouseRegions) {
    return ajax.post(`${this.baseUrl}/${warehouseId}/save`, warehouseRegions);
  }

  static listSimple(filter, paging) {
    return this.doList(`${this.baseUrl}/simple`, filter, paging);
  }
}

export {WarehouseApi, VirtualWarehouseApi, WarehouseRegionApi};

