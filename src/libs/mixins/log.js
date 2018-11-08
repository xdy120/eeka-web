const Log = {
  data() {
    return {
      logIndex: null,
      logApi: null,
      logs: [],
      levelOptions: [{
        value: 'INFO',
        label: '正常信息'
      }, {
        value: 'DEBUG',
        label: '调试信息'
      }, {
        value: 'ERROR',
        label: '严重错误'
      }, {
        value: 'WARN',
        label: '一般警告'
      }],
      filter: {},
      pager: {
        total: 0,
        pageSize: 20,
        page: 1
      },
      params: {
        from: 0,
        size: 20,
        sort: [{'@timestamp': {order: 'desc'}}]
      }
    };
  },
  methods: {
    formatMessage(row) {
      return row._source.message ? row._source.message.substr(0, 200) : null;
    },
    showMessage(row) {
      const h = this.$createElement;
      this.$msgbox({
        title: `日志：${row._source.logger ? row._source.logger : ''}`,
        customClass: 'oms-log-message-box',
        message: h('el-input',
          {
            props: {
              type: 'textarea',
              value: `${row._source.message} ${row._source.stacks
                ? row._source.stacks : ''}`
            },
            attrs: {
              rows: 30
            }
          })
      });
    },
    handleSizeChange(size) {
      this.pager.pageSize = size;
      this.search();
    },
    buildFilter(query) {
    },
    buildQuery() {
      let query = [];
      if (this.filter.beginTime || this.filter.endTime) {
        let range = {format: 'epoch_millis'};
        if (this.filter.beginTime) {
          range.gte = this.filter.beginTime.getTime();
        }
        if (this.filter.endTime) {
          range.lt = this.filter.endTime.getTime();
        }
        query.push({range: {'@timestamp': range}});
      }
      this.buildFilter(query);
      if (this.filter.level) {
        query.push({match: {'level': this.filter.level}});
      }
      if (this.filter.message) {
        query.push({match_phrase: {'message': this.filter.message}});
      }
      return {bool: {must: query}};
    },
    search() {
      if (this.pager.pageSize * this.pager.page > 10000) {
        this.$message.warning('返回数据范围超过10000行，请使用查询条件缩小数据范围');
        return;
      }
      this.params.from = (this.pager.page - 1) * this.pager.pageSize;
      this.params.query = this.buildQuery();
      this.params.size = this.pager.pageSize;
      this.logApi.listIndex(this.logIndex, this.params).then(response => {
        this.logs = response.hits.hits;
        this.pager.total = response.hits.total;
      });
    },
    clickSearch() {
      this.pager.page = 1;
      this.search();
    },
    reset() {
      this.filter = {};
    },
    exportData(doExport) {
      this.$prompt('请输入导出文件名', '提示', {
        inputPattern: /^((?![\\/\:\*\?\"\<\>\|]).)+$/,
        inputErrorMessage: '文件名不能为空或者不含特殊符号'
      }).then(({value}) => {
        doExport(value).then(() => {
          this.$message.success('正在导出，请稍后查看！');
        });
      });
    }
  }
};
export default Log;