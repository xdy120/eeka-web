import ajax from '@/libs/ajax';

const enums = new Map();

export const EnumUtil = {
  enumMapCache: {},
  async loadEnumMap(names) {
    for (let name of names) {
      if (this.enumMapCache[name] === undefined) {
        let res = await this.getEnum(name);
        let map = {};
        for (let item of res) {
          map[item.title] = item;
        }
        this.enumMapCache[name] = map;
      }
    }
  },
  getEnum(name) {
    let promise = enums.get(name);
    if (!promise) {
      promise = ajax.get(`/enum/${name}`);
      enums.set(name, promise);
    }
    return promise;
  },
  getEnumMap(name) {
    return this.enumMapCache[name];
  }
};