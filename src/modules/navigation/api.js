import ajax from '@/libs/ajax';

import RestApi from '@/libs/restapi';

class NavigationApi extends RestApi {
  static get baseUrl() {
    return '/auth';
  }

  static listModule(userId) {
    return ajax.get(`${this.baseUrl}/${userId}/module`);
  }

  static listMenu(userId, moduleId) {
    return ajax.get(`${this.baseUrl}/${userId}/module/${moduleId}/menu`);
  }

  static listMenuItem(userId, menuId) {
    return ajax.get(`${this.baseUrl}/${userId}/menu/${menuId}/menuItem`);
  }

  static listOperator(userId, menuItemId) {
    return ajax.get(
      `${this.baseUrl}/${userId}/menuItem/${menuItemId}/operator`);
  }
}

export {NavigationApi};