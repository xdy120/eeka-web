import ElementUI from 'element-ui';

let header = {
  height: {
    default: '40px'
  }
};
let footer = {
  height: {
    default: '35px'
  }
};
let tabs = {
  type: {
    default: 'border-card'
  }
};

let table = {
  stripe: {
    default: true
  },
  border: {
    default: true
  },
  highlightCurrentRow: {
    default: true
  },
  size: {
    default: 'mini'
  }
};

let tableColumn = {
  headerAlign: {
    default: 'center'
  },
  showOverflowTooltip: {
    default: true
  }
};

let pagination = {
  layout: {
    default: 'prev,pager,next,sizes,total',
  },
  pageSizes: {
    type: Array,
    default: () => [20, 50, 100, 500]
  }
};

let tree = {
  highlightCurrent: {
    default: true
  },
  expandOnClickNode: {
    default: false
  }
};

let button = {
  type: {
    default: 'primary'
  }
};

let form = {
  labelPosition: {
    default: 'right'
  },
  labelWidth: {
    default: '80px'
  }
};
let select = {
  collapseTags: {
    default: true
  },
  clearable: {
    default: true
  }
};

let inputNumber = {
  controls: {
    default: false
  }
};
let check = {
  value: {
    default: false
  }
};

Object.assign(ElementUI.Header.props, header);
Object.assign(ElementUI.Footer.props, footer);
Object.assign(ElementUI.Tabs.props, tabs);
Object.assign(ElementUI.Form.props, form);
Object.assign(ElementUI.Pagination.props, pagination);
Object.assign(ElementUI.Table.props, table);
Object.assign(ElementUI.TableColumn.props, tableColumn);
Object.assign(ElementUI.Tree.props, tree);
Object.assign(ElementUI.Button.props, button);
Object.assign(ElementUI.Select.props, select);
Object.assign(ElementUI.InputNumber.props, inputNumber);
Object.assign(ElementUI.Checkbox.props, check);
export default ElementUI;