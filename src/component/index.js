import {EnumSelector, EnumShow, EnumUtil} from './enum';
import {LogApi, LogPage} from './log';
import {
  AddButton,
  AuditButton,
  BatchButton,
  BeginButton,
  BindButton,
  CancelButton,
  CleanButton,
  ConfirmButton,
  CopyButton,
  DeleteButton,
  DeliveryButton,
  EndButton,
  FinishButton,
  InvalidButton,
  LockButton,
  LogButton,
  ModifyButton,
  PrintButton,
  ReviewButton,
  SearchButton,
  TooltipButton,
  UnlockButton,
  UploadButton,
  WmsButton,
  ExportButton
} from './button';
import {
  AbnormalColumn,
  BooleanColumn,
  DateColumn,
  DateTimeColumn,
  EnableColumn,
  EnumColumn,
  LinkColumn,
  MoneyColumn,
  QuantityColumn,
  SelectionColumn,
  SupplementColumn
} from './column';
import {GoDatePicker, GoDateTimePicker} from './datetime';
import {
  Affix,
  Avatar,
  BatchProcessor,
  GoDropDownItem,
  GoTree,
  Print,
  SuToggle,
  TabsFooter,
  ThreeCheckBox,
  Toggle,
  TooltipIcon
} from './ui';
import Barcode from './barcode/barcode';
import AdvanceQuery from './query/advance.query';
export {EnumUtil, LogApi, Barcode, BatchProcessor, Print,AdvanceQuery};

export default {
  install(Vue) {
    Vue.component('EnumSelector', EnumSelector);
    Vue.component('EnumShow', EnumShow);
    Vue.component('GoToggle', Toggle);
    Vue.component('SuToggle', SuToggle);
    Vue.component('GoTooltipButton', TooltipButton);
    Vue.component('GoAddButton', AddButton);
    Vue.component('GoModifyButton', ModifyButton);
    Vue.component('GoDeleteButton', DeleteButton);
    Vue.component('GoLockButton', LockButton);
    Vue.component('GoUnlockButton', UnlockButton);
    Vue.component('GoAuditButton', AuditButton);
    Vue.component('GoReviewButton', ReviewButton);
    Vue.component('GoInvalidButton', InvalidButton);
    Vue.component('GoCancelButton', CancelButton);
    Vue.component('GoLogButton', LogButton);
    Vue.component('GoUploadButton', UploadButton);
    Vue.component('GoConfirmButton', ConfirmButton);
    Vue.component('GoCopyButton', CopyButton);
    Vue.component('GoFinishButton', FinishButton);
    Vue.component('GoBatchButton', BatchButton);
    Vue.component('GoDeliveryButton', DeliveryButton);
    Vue.component('GoBindButton', BindButton);
    Vue.component('GoWmsButton', WmsButton);
    Vue.component('GoBeginButton', BeginButton);
    Vue.component('GoEndButton', EndButton);
    Vue.component('GoPrintButton', PrintButton);
    Vue.component('GoSearchButton', SearchButton);
    Vue.component('GoCleanButton', CleanButton);
    Vue.component('GoExportButton', ExportButton);

    Vue.component('GoEnableColumn', EnableColumn);
    Vue.component('GoSupplementColumn', SupplementColumn);
    Vue.component('GoBooleanColumn', BooleanColumn);
    Vue.component('GoAbnormalColumn', AbnormalColumn);
    Vue.component('GoMoneyColumn', MoneyColumn);
    Vue.component('GoQuantityColumn', QuantityColumn);
    Vue.component('GoEnumColumn', EnumColumn);
    Vue.component('GoDateColumn', DateColumn);
    Vue.component('GoDateTimeColumn', DateTimeColumn);
    Vue.component('GoLinkColumn', LinkColumn);
    Vue.component('GoSelectionColumn', SelectionColumn);

    Vue.component('GoDateTimePicker', GoDateTimePicker);
    Vue.component('GoDatePicker', GoDatePicker);

    Vue.component('LogPage', LogPage);
    Vue.component('ThreeCheckbox', ThreeCheckBox);
    Vue.component('TabsFooter', TabsFooter);
    Vue.component('Affix', Affix);
    Vue.component('Avatar', Avatar);
    Vue.component('TooltipIcon', TooltipIcon);
    Vue.component('GoTree', GoTree);
    Vue.component('GoDropDownItem', GoDropDownItem);
  }
};