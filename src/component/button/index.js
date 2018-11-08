import TooltipButton from './tooltip.button.vue';
import {Button} from 'element-ui';

const AddButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '新增'}, icon: {default: 'add'}}
};

const ModifyButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '修改'}, icon: {default: 'modify'}}
};

const DeleteButton = {
  extends: TooltipButton,
  props: {
    tooltip: {default: '删除'},
    icon: {default: 'remove'},
    color: {default: 'danger'}
  }
};

const LockButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '锁定'}, icon: {default: 'lock'}}
};

const UnlockButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '解锁'}, icon: {default: 'unlock'}}
};

const AuditButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '审核'}, icon: {default: 'audit'}}
};

const ReviewButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '复核'}, icon: {default: 'review'}}
};

const InvalidButton = {
  extends: TooltipButton,
  props: {
    tooltip: {default: '作废'},
    icon: {default: 'invalid'},
    color: {default: 'danger'}
  }
};

const ConfirmButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '确认'}, icon: {default: 'audit'}}
};

const CancelButton = {
  extends: TooltipButton,
  props: {
    tooltip: {default: '取消'},
    icon: {default: 'cancel'},
    color: {default: 'danger'}
  }
};

const CopyButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '复制'}, icon: {default: 'copy'}}
};

const LogButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '日志'}, icon: {default: 'sub-log'}}
};

const UploadButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '上传'}, icon: {default: 'upload'}}
};

const FinishButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '完结'}, icon: {default: 'finish'}}
};
const BatchButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '批次'}, icon: {default: 'batch'}}
};

const DeliveryButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '发货'}, icon: {default: 'delivery'}}
};

const BindButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '绑定'}, icon: {default: 'bind'}}
};

const BeginButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '开始'}, icon: {default: 'begin'}}
};

const EndButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '结束'}, icon: {default: 'end'}}
};

const PrintButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '打印'}, icon: {default: 'print'}}
};

const WmsButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '推送WMS'}, icon: {default: 'wms'}}
};

const SearchButton = {
  extends: Button,
  props: {icon: {default: 'el-icon-search'}, type: {default: 'success'}}
};

const CleanButton = {
  extends: Button,
  props: {type: {default: 'warning'}, icon: {default: 'el-icon-delete'}}
};

const ExportButton = {
  extends: TooltipButton,
  props: {tooltip: {default: '导出'}, icon: {default: 'export'}}
};
export {
  TooltipButton,
  AddButton,
  ModifyButton,
  DeleteButton,
  FinishButton,
  BatchButton,
  DeliveryButton,
  WmsButton,
  BeginButton,
  EndButton,
  PrintButton,
  LockButton,
  UnlockButton,
  AuditButton,
  ReviewButton,
  InvalidButton,
  CancelButton,
  LogButton,
  UploadButton,
  ConfirmButton,
  CopyButton,
  BindButton,
  SearchButton,
  CleanButton,
  ExportButton
};