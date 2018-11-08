const OrderActionMixin = {
  data() {
    return {
      order: {},
      orders: [],
      action: Function,
    };
  },
  methods: {
    show(order) {
      this.order = order;
      this.orders = [];
      this.domain = {};
      this.visible = true;
    },
    save() {
      if (this.orders.length > 0 && this.$refs.batchProcessor && this.doBatch) {
        this.doBatch();
      } else {
        this.domain.salesOrderId = this.order.salesOrderId;
        this.domain.version = this.order.version;
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
export default OrderActionMixin;