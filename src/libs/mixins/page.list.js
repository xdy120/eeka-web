const PageList = {
  data() {
    return {
      paging: {page: 1, pageSize: 20},
      selectedItems: [],
      total: 0,
    };
  },
  methods: {
    reset() {
      this.paging.page = 1;
      this.resetFilter();
    },
    pageSizeChange(pageSize) {
      this.paging.pageSize = pageSize;
      if (this.paging.page !== 1) {
        this.paging.page = 1;
      } else {
        this.search();
      }
    },
    search() {
      if (this.api) {
        return this.doSearch(this.api.list(this.filter, this.paging));
      }
    },
    doSearch(promise) {
      return promise.then(response => {
        if (response && response.data) {
          if (this.paging.page === 1) {
            this.total = response.total;
          }
          this.thenSearch(response.data);
          this.list = response.data;
          this.focusLast();
        } else {
          this.list = [];
          this.total = 0;
        }
      });
    },
    clickSearch(){
      this.paging.page=1;
      this.search();
    }
  }
};
export default PageList;