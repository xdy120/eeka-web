const DispatchOrderActionMixin = {
  data() {
    return {
      dispatchOrder: {},
      dispatchOrders: [],
      action: Function,
    };
  },
  methods: {
    getDefaultDomain(dispatchOrder) {
      return {};
    },
    show(dispatchOrder) {
      this.dispatchOrder = dispatchOrder;
      this.dispatchOrders = [];
      this.domain = this.getDefaultDomain(dispatchOrder);
      this.visible = true;
    },
    save() {
      if (this.dispatchOrders.length > 0 && this.$refs.batchProcessor
          && this.doBatch) {
        this.doBatch();
      } else {
        this.domain.dispatchOrderId = this.dispatchOrder.dispatchOrderId;
        this.domain.version = this.dispatchOrder.version;
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
export {DispatchOrderActionMixin};