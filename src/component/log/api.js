import {originalAxiosWapper} from '@/libs/ajax';
import config from '@/config/config';

let url = config.logUrl;

export const LogApi = {
  listIndex(index, params) {
    return originalAxiosWapper.post(`${url}${index}/_search`, params);
  }
};