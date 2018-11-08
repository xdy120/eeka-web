const List = {
  data() {
    return {
      pk: null,
      codeProp: null,
      selectedItem: null,
      selectedItems: [],
      filter: {},
      list: [],
      details: [],
      advanceQueryVisible: false
    };
  },
  computed: {
    selectedId() {
      return this.selectedItem ? this.selectedItem[this.pk] : null;
    }
  },
  methods: {
    reset() {
      this.resetFilter();
    },
    resetFilter() {
      this.filter = {};
    },
    currentRowChange(data) {
      this.selectedItem = data;
    },
    generalSummary(sumColumns, columns, data) {
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (sumColumns.some(x => x === column.property)) {
          const values = data.map(item => Number(item[column.property]));
          const precisions = [];
          let notNumber = true;
          values.forEach(value => {
            if (!isNaN(value)) {
              notNumber = false;
              let decimal = ('' + value).split('.')[1];
              precisions.push(decimal ? decimal.length : 0);
            }
          });
          const precision = Math.max.apply(null, precisions);
          if (!notNumber) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return parseFloat(
                  (prev + curr).toFixed(Math.min(precision, 20)));
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    scrollToRow(data) {
      if (!data) {
        data = this.selectedItem;
      }
      if (data && this.$refs.dataTable) {
        let index = this.list.indexOf(data);
        if (index > 0) {
          let targetTop = this.$refs.dataTable.$el.querySelectorAll(
            '.el-table__body tr')[index].getBoundingClientRect().top;
          let containerTop = this.$refs.dataTable.$el.querySelector(
            '.el-table__body').getBoundingClientRect().top;
          let scrollParent = this.$refs.dataTable.$el.querySelector(
            '.el-table__body-wrapper');
          scrollParent.scrollTop = targetTop - containerTop;
        }
      }
    },
    selectionChange(rows) {
      this.selectedItems = rows;
    },
    showSuccess() {
      this.$message.success('操作成功');
    },
    doSuccess() {
      this.$message.success('操作成功');
      this.search();
    },
    successChange(msg) {
      this.$message.success(msg);
      this.$emit('change');
    },
    showCreator() {
      if (this.$refs.creator) {
        if (this.$refs.creator.stepTitle) {
          this.$refs.creator.stepTitle = '基本信息';
          this.$refs.creator.step = 0;
        }
        this.$refs.creator.show();
      }
    },
    showEditor(entity) {
      if (this.$refs.editor) {
        this.$refs.editor.show(entity);
      } else if (this.$refs.creator) {
        this.$refs.creator.show(entity);
      }
    },
    showDetailEditor(entity) {
      if (this.$refs.detailEditor) {
        this.$refs.detailEditor.show(entity);
      }
    },
    clickSearch() {
      this.search();
    },
    search() {
      if (this.api) {
        return this.doSearch(this.api.list(this.filter));
      }
    },
    doSearch(promise) {
      return promise.then(response => {
        if (response instanceof Array) {
          this.thenSearch(response);
          this.list = response;
          this.focusLast();
        }
      });
    },
    thenSearch(response) {
    },
    focusLast() {
      let table = this.$refs.dataTable;
      if (table) {
        let data = this.list;
        if (data && data.length > 0) {
          let lastData = this.selectedItem;
          if (lastData) {
            table.setCurrentRow(
              data.find(x => x[this.pk] === lastData[this.pk]), true);
          } else {
            table.setCurrentRow(data[0], true);
          }
        }
      }
    },
    audit(row, placeholder) {
      if (!placeholder) {
        placeholder = '';
      }
      let entity = {};
      entity[this.pk] = row[this.pk];
      entity.version = row.version;
      this.$confirm(`${placeholder} 是否审核？`).then(() => {
        this.api.audit(row[this.pk], entity).then(() => {
          this.$message.success('审核成功');
          this.search();
        });
      });
    },
    invalid(row) {
      let entity = {};
      entity[this.pk] = row[this.pk];
      entity.version = row.version;
      this.$confirm('作废后不可恢复,是否作废？').then(() => {
        this.api.invalid(row[this.pk], entity).then(() => {
          this.$message.success('作废成功');
          this.search();
        });
      });
    },
    cancel(row) {
      let entity = {};
      entity[this.pk] = row[this.pk];
      entity.version = row.version;
      this.$prompt('请输入取消原因', '取消单据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S+$/,
        inputErrorMessage: '请输入取消原因'
      }).then(({value}) => {
        entity.reason = value;
        this.api.cancel(row[this.pk], entity).then(() => {
          this.$message.success('取消成功');
          this.search();
        });
      });
    },
    finish(row, placeholder) {
      placeholder = placeholder ? `${placeholder},` : '';
      this.$confirm(`${placeholder}完结后单据不能再进行出入库操作，是否继续完结？`).then(() => {
        let entity = {};
        entity[this.pk] = row[this.pk];
        entity.version = row.version;
        this.api.finish(row[this.pk], entity).then(() => {
          this.$message.success('完结成功');
        }).then(this.search());
      });
    },
    notice(row, placeholder) {
      placeholder = placeholder ? `${placeholder},` : '';
      this.$confirm(`${placeholder}是否是否生成通知单？`).then(() => {
        let entity = {};
        entity[this.pk] = row[this.pk];
        entity.version = row.version;
        this.api.notice(row[this.pk], entity).then(() => {
          this.$message.success('生成通知单成功');
        }).then(this.search());
      });
    },
    review(row, placeholder) {
      placeholder = placeholder ? `${placeholder},` : '';
      this.$confirm(`${placeholder}复核后不可撤销，是否继续复核？？`).then(() => {
        let entity = {};
        entity[this.pk] = row[this.pk];
        entity.version = row.version;
        this.api.review(row[this.pk], entity).then(() => {
          this.$message.success('复核成功');
          this.search();
        });
      });
    },
    remove(entity) {
      this.$confirm('删除后不可恢复，是否删除？').then(() => {
        this.api.remove(entity[this.pk]).then(() => {
          this.search();
        });
      });
    },
    toggleEnable(row) {
      if (!row.enable) {
        this.api.enable(row[this.pk]).then(() => {
          this.$message.success('已启用');
          row.enable = true;
        });
      } else {
        this.api.disable(row[this.pk]).then(() => {
          this.$message.warning('已禁用');
          row.enable = false;
        });
      }
    },
    buildBatchItem(item) {
      let obj = {};
      obj[this.pk] = item[this.pk];
      obj[this.codeProp] = item[this.codeProp];
      if (item.version) {
        obj.version = item.version;
      }
      return obj;
    },
    doBatch(title, promise, filter, builder = this.buildBatchItem,
      displayProp = this.codeProp) {
      if (this.$refs.batchProcessor) {
        this.validateSelectedItems(filter).then(items => {
          let list = items.map(function (item) {
            return builder(item);
          });
          this.$refs.batchProcessor.show(title, displayProp, list,
            item => promise(item));
        });
      }
    },
    validateSelectedItems(validateItem) {
      let items = this.selectedItems;
      let promise = new Promise(function (resolve, reject) {
        if (items.length > 0) {
          if (validateItem) {
            items = items.filter(validateItem);
            if (items.length > 0) {
              resolve(items);
            } else {
              reject('您选择的数据不能进行此操作！');
            }
          } else {
            resolve(items);
          }
        } else {
          reject('请选择数据!!');
        }
      });
      promise.catch(error => {
        this.$message.warning(error);
      });
      return promise;
    },
    exportData(doExport) {
      this.$prompt('请输入导出文件名', '提示', {
        inputPattern: /^((?![\\/:*?"<>|]).)+$/,
        inputErrorMessage: '文件名不能为空或者不含特殊符号'
      }).then(({value}) => {
        doExport(value).then(() => {
          this.$message.success('正在导出，请稍后查看！');
        });
      });
    }
  }
};
export default List;