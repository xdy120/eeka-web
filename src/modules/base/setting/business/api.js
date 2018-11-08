import ajax from '@/libs/ajax';

let baseConfig = {
  get(type) {
    return ajax.get('/base/setting?settingType=' + type);
  },
  update(type, setting) {
    return ajax.put('/base/setting?settingType=' + type, setting);
  },
};
export default baseConfig;