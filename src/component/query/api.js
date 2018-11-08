import RestApi from '@/libs/restapi';
import ajax from '@/libs/ajax';

export class AdvanceQueryApi extends RestApi {
  static get baseUrl() {
    return '/advance/query';
  }

  static saveConfig(component, configName, arr) {
    return ajax.post(`${this.baseUrl}/condition/${component}/${configName}`,
      arr);
  }

  static getConfigList(component) {
    return ajax.get(`${this.baseUrl}/condition/${component}`);
  }

  static getConfig(component, configName) {
    return ajax.get(`${this.baseUrl}/condition/${component}/${configName}`);
  }

  static deleteConfig(component, configName) {
    return ajax.delete(`${this.baseUrl}/condition/${component}/${configName}`);
  }
}





