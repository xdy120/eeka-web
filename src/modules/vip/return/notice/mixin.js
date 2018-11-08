const VipReturnNoticeActionMixin = {
  data() {
    return {
      vipReturnNotice: {},
      vipReturnNotices: [],
      action: Function,
    };
  },
  methods: {
    getDefaultDomain(vipReturnNotice) {
      return {};
    },
    show(vipReturnNotice) {
      this.vipReturnNotice = vipReturnNotice;
      this.vipReturnNotices = [];
      this.domain = this.getDefaultDomain(vipReturnNotice);
      this.visible = true;
    },
    save() {
      if (this.vipReturnNotices.length > 0 && this.$refs.batchProcessor
          && this.doBatch) {
        this.doBatch();
      } else {
        this.domain.vipReturnNoticeId = this.vipReturnNotice.vipReturnNoticeId;
        this.domain.version = this.vipReturnNotice.version;
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
export {VipReturnNoticeActionMixin};