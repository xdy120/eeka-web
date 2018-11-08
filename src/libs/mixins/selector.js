export default {
  props: {
    value: {
      required: false,
    },
    outFilter: {
      type: Object,
      required: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    useDefault :{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      iMultiple: this.multiple,
      oldFilter: {},
    };
  },
  watch: {
    multiple(val) {
      this.iMultiple = val;
    }
  },
  methods: {
    reset() {
      this.filter = {};
      if (this.outFilter) {
        for (let key in this.outFilter) {
          this.filter[key] = this.outFilter[key];
        }
      }
    },
    showList() {
      this.selectedItem = null;
      this.selectedItems = [];
      this.visible = true;
    },
    clean() {
      this.selectedItem = null;
      this.selectedItems = [];
      this.$emit('input', null);
      if (this.customClean) {
        this.customClean();
      }
      this.$emit('confirm', null);
    },

    confirm(row) {
      let inputValue = null;
      let confirmValue = null;
      if (this.iMultiple) {
        if (this.selectedItems.length === 0) {
          this.$message.warning('请选择数据');
          return;
        }
        inputValue = this.selectedItems.map(x => x[this.pk]).join();
        confirmValue = this.selectedItems;
      } else {
        if (!(row instanceof MouseEvent)) {
          this.selectedItem = row;
        } else if (this.list.length === 1) {
          this.selectedItem = this.list[0];
        }
        if (this.selectedItem === null) {
          this.$message.warning('请选择数据');
          return;
        }
        inputValue = this.selectedItem[this.pk];
        confirmValue = this.selectedItem;
      }
      this.$emit('input', inputValue);
      if (this.customConfirm) {
        this.customConfirm(inputValue);
      }
      this.$emit('confirm', confirmValue);
      this.visible = false;
    }
  }
};