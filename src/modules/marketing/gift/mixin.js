const Gift = {
  props: {
    local: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    canEdit() {
      return this.domain && this.domain.enable === false;
    }
  },
};
export {Gift};