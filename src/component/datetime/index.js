import {DatePicker} from 'element-ui';

const GoDateTimePicker = {
  extends: DatePicker,
  props: {
    type: {
      default: 'datetime'
    },
    valueFormat: {
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    pickerOptions: {
      default: function () {
        return {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              let date = new Date();
              date.setHours(0, 0, 0);
              picker.$emit('pick', date);
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 86400000);
              date.setHours(0, 0, 0);
              picker.$emit('pick', date);
            }
          }, {
            text: '7天前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 604800000);
              date.setHours(0, 0, 0);
              picker.$emit('pick', date);
            }
          }, {
            text: '30天前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 2592000000);
              date.setHours(0, 0, 0);
              picker.$emit('pick', date);
            }
          }]
        };
      }
    },
    defaultValue: () => new Date()
  }
};

const GoDatePicker = {
  extends: DatePicker,
  props: {
    type: {
      default: 'date'
    },
    valueFormat: {
      default: 'yyyy-MM-dd'
    },
    defaultValue: () => new Date()
  }
};
export {GoDateTimePicker, GoDatePicker};