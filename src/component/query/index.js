import AdvanceQuery from './advance.query';

const BoolType = {
  MUST: {
    title: 'MUST'
  },
  MUST_NOT: {
    title: 'MUST_NOT'
  },
  SHOULD: {
    title: 'SHOULD'
  },
  FILTER: {
    title: 'FILTER'
  }
};

const Operator = {
  EQUAL: {
    caption: '=',
    title: 'EQUAL'
  },
  NOT_EQUAL: {
    caption: '<>',
    title: 'NOT_EQUAL'
  },
  GREATER_THAN: {
    caption: '>',
    title: 'GREATER_THAN'
  },
  GREATER_THAN_EQUAL: {
    caption: '>=',
    title: 'GREATER_THAN_EQUAL'
  },
  LESS_THAN: {
    caption: '<',
    title: 'LESS_THAN'
  },
  LESS_THAN_EQUAL: {
    caption: '<=',
    title: 'LESS_THAN_EQUAL'
  },
  PRECISE: {
    caption: '等于',
    title: 'PRECISE'
  },
  FUZZY: {
    caption: '包含',
    title: 'FUZZY'
  },
  NOT_FUZZY: {
    caption: '不包含',
    title: 'NOT_FUZZY'
  },
  BEGIN_WITH: {
    caption: '开始以',
    title: 'BEGIN_WITH'
  },
  END_WITH: {
    caption: '结束以',
    title: 'END_WITH'
  },
  NULL: {
    caption: '不存在',
    title: 'NULL'
  },
  NOT_NULL: {
    caption: '存在',
    title: 'NOT_NULL'
  },
  MULTI_EQUAL: {
    caption: '在列表',
    title: 'MULTI_EQUAL'
  },
  NOT_MULTI_EQUAL: {
    caption: '不在列表',
    title: 'NOT_MULTI_EQUAL'
  }
};

const FieldType = {
  text: {
    name: 'TEXT',
    operators: [Operator.PRECISE, Operator.FUZZY, Operator.NOT_FUZZY,
      Operator.BEGIN_WITH, Operator.END_WITH, Operator.NULL, Operator.NOT_NULL]
  },
  long: {
    name: 'LONG',
    operators: [Operator.EQUAL, Operator.NOT_EQUAL, Operator.GREATER_THAN,
      Operator.GREATER_THAN_EQUAL, Operator.LESS_THAN, Operator.LESS_THAN_EQUAL]
  },
  float: {
    name: 'FLOAT',
    operators: [Operator.EQUAL, Operator.NOT_EQUAL, Operator.GREATER_THAN,
      Operator.GREATER_THAN_EQUAL, Operator.LESS_THAN, Operator.LESS_THAN_EQUAL]
  },
  boolean: {
    name: 'BOOLEAN',
    operators: [Operator.EQUAL]
  },
  datetime: {
    name: 'DATETIME',
    operators: [Operator.EQUAL, Operator.NOT_EQUAL, Operator.GREATER_THAN,
      Operator.GREATER_THAN_EQUAL, Operator.LESS_THAN, Operator.LESS_THAN_EQUAL]
  },
  enum: {
    name: 'ENUM',
    operators: [Operator.MULTI_EQUAL]
  },
  store: {
    name: 'STORE',
    operators: [Operator.MULTI_EQUAL]
  }
};

export {
  BoolType, Operator, FieldType, AdvanceQuery
};

