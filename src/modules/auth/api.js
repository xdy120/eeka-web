import ajax from '@/libs/ajax';

const AuthApi = {
  login(domain) {
    return ajax.post('/auth/login', domain);
  },
  logout() {
    return ajax.post('/auth/logout');
  }
};

const OrganizationApi = {
  getByDomain(domain) {
    return ajax.get(`/admin/organization/domain/${domain}`);
  }
};

export {AuthApi, OrganizationApi};