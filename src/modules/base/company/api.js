import RestApi from '@/libs/restapi';
import ajax from '../../../libs/ajax';

export class CompanyApi extends RestApi {
  static get baseUrl() {
    return '/base/company';
  }

  static listCompanyAndDepartments(params) {
    return ajax.get('/base/company/departments', {params: params});
  }

  static listCompanies() {
    return ajax.get('/base/company');
  }
}

export class DepartmentApi extends RestApi {
  static get baseUrl() {
    return '/base/department';
  }

  static getByCompany(id) {
    return ajax.get('/base/department/company/' + id);
  }

  static listByCompany(companyId) {
    return ajax.get('/base/department/listByCompany/' + companyId);
  }

  static listChildren(id) {
    return ajax.get('/base/department/children/' + id);
  }
}

export class UserApi extends RestApi {
  static get baseUrl() {
    return '/base/user';
  }

  static getByDepartment(id) {
    return ajax.get('/base/user/department/' + id);
  }

  static modifyPassword(userId, pwd) {
    return ajax.put(`${this.baseUrl}/${userId}/modifyPwd`, pwd);
  }

  static initPassword(userId) {
    return ajax.put(`${this.baseUrl}/${userId}/initPwd`);
  }

  static validatePassword(userId) {
    return ajax.get(`${this.baseUrl}/${userId}/validatePwd`);
  }
}





