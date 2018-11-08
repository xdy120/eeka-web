import config from '@/config/config';
import axios from 'axios';
import {Message} from 'element-ui';
import store from '@/store';
import router from '@/router';

const axiosWapper = axios.create({
  baseURL: config.url,
  timeout: config.timeout,
});

axiosWapper.interceptors.request.use(config => {
  config.headers['Authorization'] = store.getters.token;
  config.headers['X-OMS-ORGAN'] = store.getters.domain;
  return config;
}, err => {
  Message.error(`请求失败：${err}`);
  return Promise.reject(err);
});

axiosWapper.interceptors.response.use(
  res => {
    let data = res.data;
    return Promise.resolve(data);
  },
  err => {
    let msg = err;
    if (err.response) {
      switch (err.response.status) {
        case 400:
          let data = err.response.data;
          Message.error(`请求失败！错误码：${data.errorCode}，${data.errorMessage}`);
          msg = data.errorMessage;
          break;
        case 401:
          Message.error('登录已过期，请重新登录');
          router.push('/login');
          break;
        default:
          Message.error(`请求失败！${err}`);
          break;
      }
    } else {
      Message.error(`请求失败！${err}`);
    }
    return Promise.reject(msg);
  }
);

const ajax = {
  request(config) {
    return axiosWapper.request(config);
  },
  get(url, config) {
    return axiosWapper.get(url, config);
  },
  delete(url, config) {
    return axiosWapper.delete(url, config);
  },
  head(url, config) {
    return axiosWapper.head(url, config);
  },
  post(url, data, config) {
    return axiosWapper.post(url, data, config);
  },
  put(url, data, config) {
    return axiosWapper.put(url, data, config);
  },
  patch(url, data, config) {
    return axiosWapper.patch(url, data, config);
  }
};

ajax.toURLSearchParams = function (obj) {
  let param = new URLSearchParams();
  for (let key of Object.keys(obj)) {
    param.append(key, obj[key]);
  }
  return param;
};

const originalAxiosWapper = axios.create({
  baseURL: config.url,
  timeout: config.timeout,
});

originalAxiosWapper.interceptors.request.use(config => {
  return config;
}, err => {
  Message.error(`请求失败：${err}`);
  return Promise.reject(err);
});

originalAxiosWapper.interceptors.response.use(
  res => {
    let data = res.data;
    return Promise.resolve(data);
  },
  err => {
    if (err.response && err.response.status === 400) {
      let data = err.response.data;
      Message.error(`请求失败！错误码：${data.errorCode}，${data.errorMessage}`);
      return Promise.reject(
        `错误码：${data.errorCode}，错误信息：${data.errorMessage}`);
    } else {
      Message.error(`请求失败！${err}`);
      return Promise.reject(err);
    }

  }
);

const quartzAxiosWapper = axios.create({
  baseURL: config.quartzUrl,
  timeout: config.timeout,
});

quartzAxiosWapper.interceptors.request.use(config => {
  config.headers['Authorization'] = store.getters.token;
  config.headers['X-OMS-ORGAN'] = store.getters.domain;
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
}, err => {
  Message.error(`请求失败：${err}`);
  return Promise.reject(err);
});

quartzAxiosWapper.interceptors.response.use(
  res => {
    let data = res.data;
    return Promise.resolve(data);
  },
  err => {
    let msg = err;
    if (err.response) {
      switch (err.response.status) {
        case 400:
          let data = err.response.data;
          Message.error(`请求失败！错误码：${data.errorCode}，${data.errorMessage}`);
          msg = data.errorMessage;
          break;
        case 401:
          Message.error('登录已过期，请重新登录');
          router.push('/login');
          break;
        default:
          Message.error(`请求失败！${err}`);
          break;
      }
    } else {
      Message.error(`请求失败！${err}`);
    }
    return Promise.reject(msg);
  }
);

export {originalAxiosWapper, quartzAxiosWapper};
export default ajax;
