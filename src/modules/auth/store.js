import router from '@/router';
import {
  CHANGE_DOMAIN,
  LOAD_MODULE,
  LOAD_ORGAN,
  USER_LOGIN,
  USER_LOGOUT
} from '@/libs/mutation.types';

const store = {
  state: {
    loginName: null,
    user: null,
    token: null,
    domain: null,
    domains: []
  },
  mutations: {
    [USER_LOGIN]: (state, res) => {
      state.loginName = res.user.loginName;
      state.user = res.user;
      state.token = res.token;
    },
    [USER_LOGOUT]: state => {
      state.user = null;
      state.token = null;
    },
    [LOAD_ORGAN]: (state, organ) => {
      if (!state.domains.some(x => x.organizationId === organ.organizationId)) {
        state.domains.push(organ);
      }
    },
    [CHANGE_DOMAIN]: (state, domain) => {
      state.domain = domain;
    }
  },
  actions: {
    [USER_LOGIN]: (context, res) => {
      context.commit(USER_LOGIN, res);
      context.dispatch(LOAD_MODULE);
    },
    [USER_LOGOUT]: context => {
      context.commit(USER_LOGOUT);
      router.push('/login');
    },
    [LOAD_ORGAN]: (context, organ) => {
      context.commit(LOAD_ORGAN, organ);
      context.commit(CHANGE_DOMAIN, organ.domain);
      router.push('/login');
    }
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    domains: state => state.domains,
    domain: state => state.domain,
    loginName: state => state.loginName
  }
};
export default store;
