import RestApi from '@/libs/restapi';
import ajax from '../../../libs/ajax';

export class RoleApi extends RestApi {
  static get baseUrl() {
    return '/base/role';
  }
}

export class PrivilegeApi extends RestApi {
  static get baseUrl() {
    return '/base/privilege';
  }

  static saveRolePrivilege(roleId, privileges) {
    return ajax.post(`${this.baseUrl}/${roleId}/save`, privileges);
  }

  static listRolePrivilege(roleId, type) {
    return ajax.get(`${this.baseUrl}/${roleId}/${type}`);
  }
}

export let RoleUserApi = {
  list(userId) {
    return ajax.get('/base/roleUser/user/' + userId);
  },
  batch(list) {
    return ajax.post('/base/roleUser/batch', list);
  }
};

