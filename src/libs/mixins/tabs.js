const Tabs = {
  props: {
    parentData: Object,
    currentTab: String,
  },
  data() {
    return {
      tab: null
    };
  },
  watch: {
    parentData() {
      this.statusChange();
    },
    currentTab() {
      this.statusChange();
    }
  },
  methods: {
    statusChange() {
      if (this.currentTab === this.tab) {
        this.search();
      }
    }
  }
};
export default Tabs;