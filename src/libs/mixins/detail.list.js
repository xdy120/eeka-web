const DetailList = {
  data() {
    return {
      detailList: [],
    };
  },
  methods: {
    resetPaging() {
      this.paging.page = 1;
    },
    clickSearch() {
      this.paging.page = 1;
      this.search();
    },
    search() {
      if (this.api) {
        return this.doSearch(
          this.api.listDetailPage(this.filter[this.orderId], this.filter,
            this.paging));
      }
    },
    doSearch(promise) {
      return promise.then(response => {
        if (response.data) {
          if (this.paging.page === 1) {
            this.total = response.total;
          }
          this.inserted = false;
          this.thenSearch(response.data);
          this.detailList = response.data;
          this.focusLast();
        } else {
          this.detailList = [];
          this.total = 0;
        }
      });
    }
  }
};
export default DetailList;