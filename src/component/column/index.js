import {TableColumn} from 'element-ui';
import {Util} from '@/libs/util';

const MoneyColumn = {
  extends: TableColumn,
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'right'},
    width: {default: 60},
    formatter: {
      type: Function,
      default: (r, c, v) => {
        if (typeof(v) === 'number') {
          return v.toFixed(2);
        }
        return v;
      }
    }
  }
};
const QuantityColumn = {
  extends: TableColumn,
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'right'},
    width: {default: 60}
  }
};
const EnableColumn = {
  extends: TableColumn,
  created() {
    this.columnConfig.renderCell = (h, data) => {
      let v = Util.getValueByPath(data.row, data.column.property);
      return h('span', {
        class: v ? 'success' : 'danger',
        domProps: {innerHTML: v ? '已启用' : '已禁用'}
      });
    };
  },
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 60},
    label: {default: '状态'},
    prop: {default: 'enable'}
  }
};

const SupplementColumn = {
  extends: TableColumn,
  created() {
    this.columnConfig.renderCell = (h, data) => {
      let v = Util.getValueByPath(data.row, data.column.property);
      return h('span', {
        class: v ? 'success' : 'danger',
        domProps: {innerHTML: v ? '是' : '否'}
      });
    };
  },
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 60},
    label: {default: '是否启用'},
    prop: {default: 'supplement'}
  }
};

const EnumColumn = {
  extends: TableColumn,
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 70},
    enumName: {
      type: String,
      required: true,
    },
  },
  created() {
    this.columnConfig.renderCell = (h, data) => {
      return h('enum-show', {
        props: {
          enumName: this.enumName,
          value: Util.getValueByPath(data.row, data.column.property)
        },
      });
    };
  },
};

const DateTimeColumn = {
  extends: TableColumn,
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 140},
    formatter: {
      type: Function,
      default: function (r, c, v) {
        if (v instanceof Date) {
          return Util.dateFormatter(v);
        } else if (this.type === 'datetime') {
          return Util.dateFormatter(new Date(v));
        }
        return v;
      }
    }
  }
};

const DateColumn = {
  extends: TableColumn,
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 100},
    formatter: {
      type: Function,
      default: function (r, c, v) {
        if (v instanceof Date) {
          return Util.dateFormatter(v, 'yyyy-MM-dd');
        } else if (this.type === 'date') {
          return Util.dateFormatter(new Date(v), 'yyyy-MM-dd');
        }
        return v;
      }
    }
  },
};

const BooleanColumn = {
  extends: TableColumn,
  created() {
    this.columnConfig.renderCell = (h, data) => {
      let v = Util.getValueByPath(data.row, data.column.property);
      return h('span', {
        class: v ? 'success' : 'danger',
        domProps: {innerHTML: v ? '是' : '否'}
      });
    };
  },
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 50}
  }
};

const LinkColumn = {
  extends: TableColumn,
  created() {
    this.columnConfig.renderCell = (h, data) => {
      return h('a', {
        attrs: {href: '#', class: 'primary'},
        on: {click: () => this.clickHandler(data)},
        domProps: {
          innerHTML: Util.getValueByPath(data.row, data.column.property)
        }
      });
    };
  },
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 150}
  },
  methods: {
    clickHandler(data) {
      this.$emit('click', data.row);
    }
  }
};

const AbnormalColumn = {
  extends: TableColumn,
  created() {
    this.columnConfig.renderCell = (h, data) => {
      let v = Util.getValueByPath(data.row, data.column.property);
      return h('span', {
        class: v ? 'danger' : 'success',
        domProps: {innerHTML: v ? '是' : '否'}
      });
    };
  },
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'center'},
    width: {default: 50}
  }
};

const SelectionColumn = {
  extends: TableColumn,
  props: {
    headerAlign: {default: 'center'},
    align: {default: 'left'},
    width: {default: 35},
    type: {default: 'selection'}
  }
};
export {
  EnableColumn,
  SupplementColumn,
  BooleanColumn,
  QuantityColumn,
  MoneyColumn,
  EnumColumn,
  DateTimeColumn,
  DateColumn,
  LinkColumn,
  AbnormalColumn,
  SelectionColumn
};