import {EnumUtil} from '@/component/enum/api';

export default {
  methods: {
    dialogCloseConfirm(done) {
      this.$confirm('确认关闭？').then(() => {
        this.onClosed && this.onClosed();
        done();
      });
    },
    deleteConfirm(callback) {
      this.$confirm('将永久删除数据, 是否继续?', '警告', {
        type: 'warning'
      }).then(callback);
    },
    booleanFormatter(row, column, cellValue) {
      return cellValue ? '是' : '否';
    },
    loadEnum(names) {
      return EnumUtil.loadEnumMap(names);
    },
    enumFormatter(enumName, value) {
      return EnumUtil.getEnumMap(enumName).get(value);
    },
    moneyFormatter(row, col, cellValue) {
      if (cellValue) {
        return cellValue.toFixed(2);
      }
      return '-';
    },
    dateFormatter(date) {
      if (date) {
        return date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate();
      }
      return '';
    }
  }
};