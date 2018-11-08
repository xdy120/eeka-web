const Assert = {
  isEmpty(val) {
    return val === undefined || val === null || (Array.isArray(val)
      && val.length === 0);
  },
  isBlank(val) {
    return this.isEmpty(val) || val.trim() === '';
  },
  inArray(item, targetArr, match) {
    for (let i of targetArr) {
      if (typeof(match) === 'function') {
        if (match(i, item)) {
          return true;
        }
      }
      else if (i === item) {
        return true;
      }
    }
    return false;
  },
  isTrue(val) {
    return val === true;
  }
};

const Util = {
  getNumberProp(obj, prop) {
    if (obj && obj[prop]) {
      return Number.parseInt(obj[prop]);
    }
    return 0;
  },
  getStringProp(obj, prop) {
    if (obj && obj[prop]) {
      return obj[prop];
    }
    return null;
  },
  map2object(strMap) {
    let obj = {};
    for (let [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  },
  object2map(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  },
  toArray(value) {
    return value ? value.match(/\w+/gi) : [];
  },
  setTitle(title) {
    window.document.title = title;
  },
  createExportFileName(name) {
    let now = new Date();
    return `${name}${this.dateFormatter(now, 'yyyyMMddHHmmss')}`;
  },
  getValueByPath(object, prop) {
    prop = prop || '';
    const paths = prop.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i++) {
      const path = paths[i];
      if (!current) {
        break;
      }

      if (i === j - 1) {
        result = current[path];
        break;
      }
      current = current[path];
    }
    return result;
  },
  dateFormatter(date, format) {
    if (!format) {
      format = 'yyyy-MM-dd HH:mm:ss';
    }
    let args = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),  //quarter
      'S': date.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let i in args) {
      let n = args[i];
      if (new RegExp('(' + i + ')').test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? n : ('00' + n).substr(('' + n).length));
      }
    }
    return format;
  },
  validateFileName(value) {
    var pattern = new RegExp('[#$^&*()=|,\\[\\]./?~！@#￥……&*——|【】？]');
    if (pattern.test(value.value)) {
      return true;
    }
    return false;
  },
};

let Placeholders = {
  IN: '多个请用英文逗号隔开',
  LIKE: '右侧模糊匹配',
};
let ValidateRules = {
  required: {required: true, message: '不能为空', trigger: 'manual'},
  requiredMax: {
    required: true,
    max: 50,
    message: '[1-50]不能为空',
    trigger: 'manual'
  },
  name: {required: true, max: 50, message: '名称[1-50]不能为空', trigger: 'manual'},
  code: {required: true, max: 50, message: '编码[1-50]不能为空', trigger: 'manual'},
  remark: {max: 200, message: '备注不能超过200个字', trigger: 'manual'},
  number: {type: 'number', message: '必须为数字', trigger: 'manual'},
  url: {type: 'url', message: '不符合网址格式', trigger: 'manual'},
  email: {type: 'email', message: '不符合邮箱格式', trigger: 'manual'},
  password: {
    required: true,
    type: 'string',
    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
    message: '密码必须是8到16位数字与字母组合',
    trigger: 'manual'
  },
  mobile: {
    type: 'string',
    pattern: /^((?![\\/\:\*\?\"\<\>\|]).)*$/,
    message: '手机号不得包含特殊字符',
    trigger: 'manual'  },
  telephone: {
    type: 'string',
    pattern: /^((?![\\/\:\*\?\"\<\>\|]).)*$/,
    message: '手机号不得包含特殊字符',
    trigger: 'manual'
  },
  quantity: {
    type: 'number',
    pattern: /^[1-9]\d*|0$/,
    message: '数量必须是0或正整数',
    trigger: 'manual'
  },
  fileName: {
    required: true,
    type: 'string',
    pattern: /^((?![\\/\:\*\?\"\<\>\|]).)*$/,
    message: '文件名不得包含特殊字符',
    trigger: 'manual'
  }
};
ValidateRules.requiredNumber = [ValidateRules.required, ValidateRules.number];
ValidateRules.requiredEmail = [ValidateRules.required, ValidateRules.email];
ValidateRules.requiredMobile = [ValidateRules.required, ValidateRules.mobile];
ValidateRules.requiredTelephone = [ValidateRules.required,
  ValidateRules.telephone];
ValidateRules.requiredFileName = [ValidateRules.required,
  ValidateRules.fileName];
ValidateRules.requiredUrl = [ValidateRules.required, ValidateRules.url];

export {Util, Assert, Placeholders, ValidateRules};