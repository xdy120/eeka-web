import Affix from './affix.vue';
import TabsFooter from './tabs.footer.vue';
import ThreeCheckBox from './threecheckbox.vue';
import TooltipIcon from './tooltip.icon.vue';
import BatchProcessor from './batch.processor';
import Toggle from './toggle.vue';
import SuToggle from './su.toggle.vue';
import ExcelImport from './excel.import.vue';
import ExcelImporter from './excel.importer.vue';
import Print from './print.vue';
import Avatar from './avatar.vue';
import {DropdownItem, Tree} from 'element-ui';

const GoTree = {
  extends: Tree,
  methods: {
    getAllCheckedNodes() {
      const checkedNodes = [];
      const traverse = function (node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes;
        childNodes.forEach((child) => {
          if (child.checked || child.indeterminate) {
            checkedNodes.push(child.data);
          }
          traverse(child);
        });
      };
      traverse(this.store);
      return checkedNodes;
    },
    expandNode(data) {
      let node = this.store.getNode(data);
      node.expand(null, this.store.autoExpandParent);
    }
  }
};

const GoDropDownItem = {
  extends: DropdownItem,
  methods: {
    handleClick(e) {
      this.$emit('click', e);
    }
  }
};

export {
  GoTree,
  GoDropDownItem,
  Affix,
  TabsFooter,
  ThreeCheckBox,
  TooltipIcon,
  BatchProcessor,
  Toggle,
  SuToggle,
  ExcelImport,
  ExcelImporter,
  Print,
  Avatar
};