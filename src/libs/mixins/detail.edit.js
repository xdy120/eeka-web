const DetailEdit = {
  data() {
    return {
      entity: {},//实体
      visible: false,//是否显示
      inserted: false,//是否已插入过数据 控制是否要清空列表数据
    };
  },
  computed: {
    editMode() {
      return this.entity.status === 'CREATED';
    }
  },
  methods: {
    show(entity) {
      this.resetPaging();
      this.entity = entity;
      this.filter = {[this.orderId]: entity[this.orderId]};
      this.search();
      this.visible = true;
    },
    canEdit(row) {
      return row['_back_data'];
    },
    reset() {
      this.filter = {[this.orderId]: this.entity[this.orderId]};
    },
    editRow(row) {
      let back_data = {};
      Object.assign(back_data, row);
      this.$set(row, '_back_data', back_data);
    },
    uneditRow(row) {
      if (row._back_data) {
        let back_data = row._back_data;
        this.$delete(row, '_back_data');
        Object.assign(row, back_data);
      }
    },
    refresh() {
      this.inserted = false;
      this.entity.version++;
    },
    modify(row) {
      let entity = {};
      entity[this.orderId] = this.entity[this.orderId];
      entity.version = this.entity.version;
      entity.status = this.entity.status;
      entity.details = [row];
      this.api.modifyDetail(entity[this.orderId], entity).then(() => {
        this.$message.success('提交成功');
        this.$delete(row, '_back_data');
        this.refresh();
      });
    },
    validateDetail() {
      return true;
    },
    add() {
      if (this.validateDetail()) {
        let entity = {};
        entity[this.orderId] = this.entity[this.orderId];
        entity.version = this.entity.version;
        entity.status = this.entity.status;
        if (this.detailList.length > 0) {
          entity.details = this.detailList;
          this.api.addDetail(entity[this.orderId], entity).then(r => {
            this.$message.success('提交成功');
            this.refresh();
            this.search();
          });
        } else {
          this.$message.error('至少要有一行明细');
        }
      }
    },
    skuConfirm(data) {
      if (!this.inserted) {
        this.detailList = [];
        this.inserted = true;
      }
      data.forEach(detail => {
        if (this.detailList.findIndex(v => v.skuId === detail.skuId) < 0) {
          detail[this.orderId] = this.entity[this.orderId];
          this.detailList.push(detail);
        }
      });
    },
    remove(index, row) {
      this.$confirm('确认要删除明细吗？').then(() => {
        if (row[this.pk]) {
          let entity = {};
          entity[this.orderId] = this.entity[this.orderId];
          entity.version = this.entity.version;
          entity.status = this.entity.status;
          entity.details = [row];
          this.api.removeDetail(entity[this.orderId], entity).then(r => {
            this.$message.success('删除成功');
            this.detailList.splice(index, 1);
            this.refresh();
          });
        } else {
          this.detailList.splice(index, 1);
        }
      }).catch(() => this.$message.info('取消删除'));
    },
    showSkuImport() {
      if (this.$refs.skuImport) {
        this.$refs.skuImport.show(null);
      }
    },
    readData(skuMap) {
      if (!this.inserted) {
        this.detailList = [];
        this.inserted = true;
      }
      for (let value of skuMap.values()) {
        if (!this.detailList.some(v => v.skuId === value.skuId)) {
          let item = {
            productId: value.productId,
            productCode: value.productCode,
            productName: value.productName,
            skuId: value.skuId,
            skuCode: value.skuCode,
            skuName: value.skuCode,
            combination: value.combination
          };
          if (this.relation) {
            for (let p of this.relation) {
              item[p.prop] = value[p.label];
              item[this.orderId] = this.entity[this.orderId];
            }
          }
          this.detailList.push(item);
        }
      }
    },
  }
};
export default DetailEdit;