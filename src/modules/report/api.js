import ajax from '@/libs/ajax';
import RestApi from '@/libs/restapi';

export class ReportProductReturnApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/productReturnQuery`, filter, paging);
  }

  static exportReturn(fileName, params) {
    return ajax.get(`${this.baseUrl}/${fileName}/exportReturn`, {params});
  }

}

export class ReportProductSalesApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/productSalesQuery`, filter, paging);
  }

  static exportSales(fileName, params) {
    return ajax.get(`${this.baseUrl}/${fileName}/exportSales`,{params});
  }
}

export class ReportSalesOrderDeliveryApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesDeliverQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportDeliverStatistics/${fileName}/`,{params});
  }

}

export class ReportSalesOrderSellStatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/orderDetailStatisticsQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportOrderDetailStatistics/${fileName}/`,{params});
  }

}

export class ReportSalesOrderMonthtatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesOrderDateStatisticsQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportOrderDateStatistics/${fileName}/`,{params});
  }

}

export class ReportSalesOrderSalesStatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesStatisticsQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportSalesStatistics/${fileName}/`,{params});
  }

}

export class ReportSalesOrderOosApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesOrderOosQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportSalesOrderOosStatistics/${fileName}/`, {params});
  }

}

export class ReportSalesOrderReturnApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesReturnQuery`, filter, paging);
  }

}

export class ReportSalesOrderApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesQuery`, filter, paging);
  }

  static exportSales(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportSalesOrder/${fileName}/`, {params});
  }

}

export class ReportSalesOrderDetailApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesDetailQuery`, filter, paging);
  }

  static exportSalesDetail(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportSalesOrderDetail/${fileName}/`,{params});
  }
}

export class ReportVipDeliverApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/vipDeliverQuery`, filter, paging);
  }

  static exportVipDelivery(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportVipDelivery/${fileName}/`, {params});
  }

}

export class ReportVipReturnApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/vipReturnQuery`, filter, paging);
  }

  static exportVipReturn(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportVipReturn/${fileName}/`, {params});
  }
}

export class ReportVipSalesApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/vipSalesQuery`, filter, paging);
  }

  static exportVipSales(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportVipSales/${fileName}/`, {params});
  }
}

export class ReportVipSalesStatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/vipSalesStatisticsReportQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportVipSalesStatistics/${fileName}/`,{params});
  }

}

export class ReportVipSalesMonthStatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/vipSalesOrderDateStatisticsQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportVipOrderDateStatistics/${fileName}/`,{params});
  }

}


export class ReportReturnDetailApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/returnDetailQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportReturnDetail/${fileName}/`,{params});
  }

}


export class ReportSalesDetailApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/salesDeliveryDetailQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportSalesDeliveryDetail/${fileName}/`,{params});
  }

}


export class ReportVipReturnDetailApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/vipReturnDetailQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportVipReturnDetail/${fileName}/`,{params});
  }

}


export class ReportVipSalesDetailApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/vipSalesDeliveryDetailQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportVipSalesDeliveryDetail/${fileName}/`,{params});
  }

}

export class ReportB2CSellAndReturnStatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/B2CSellAndReturnStatisticsQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportB2CSellAndReturnStatistics/${fileName}/`,{params});
  }

}

export class ReportB2CSellStatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/B2CSellStatisticsQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportB2CSellStatistics/${fileName}/`,{params});
  }

}

export class ReportB2BSellStatisticsApi extends RestApi {

  static get baseUrl() {
    return '/report';
  }

  static list(filter, paging) {
    return this.doList(`${this.baseUrl}/B2BSellStatisticsQuery`, filter, paging);
  }

  static exportData(fileName, params) {
    return ajax.get(`${this.baseUrl}/exportB2BSellStatistics/${fileName}/`,{params});
  }

}