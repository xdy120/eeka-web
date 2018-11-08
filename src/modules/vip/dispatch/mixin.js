const VipDispatchActionMixin = {
  data() {
    return {
      dispatchOrder: {},
      dispatchOrders: [],
      action: Function,
    };
  },
  methods: {
    getDefaultDomain(vipDispatch) {
      return {};
    },
    show(vipDispatch) {
      this.vipDispatch = vipDispatch;
      this.vipDispatchs = [];
      this.domain = this.getDefaultDomain(vipDispatch);
      this.visible = true;
    },
    save() {
      if (this.vipDispatchs.length > 0 && this.$refs.batchProcessor
          && this.doBatch) {
        this.doBatch();
      } else {
        this.domain.vipDispatchId = this.vipDispatch.vipDispatchId;
        this.domain.version = this.vipDispatch.version;
        if (this.$refs.editForm) {
          this.$refs.editForm.validate().then(() => {
            this.doSave();
          });
        } else {
          this.doSave();
        }
      }
    }
  }
};
export {VipDispatchActionMixin};