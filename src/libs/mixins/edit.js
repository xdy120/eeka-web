const Edit = {
  data() {
    return {
      domain: {},
      continuous: false,
      editMode: false,
      visible: false,
      isRequestSend: false
    };
  },
  methods: {
    genDefaultDomain() {
      return {};
    },
    /**
     * 控制显示
     * @param entity
     */
    show(entity) {
      if (entity) {
        this.api.get(entity[this.pk]).then(data => {
          if (this.thenGet) {
            this.thenGet(data);
          }
          this.domain = data;
          this.editMode = true;
          this.beforeShow();
          this.visible = true;
          this.isRequestSend = false;
        });
      } else {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
        this.domain = this.genDefaultDomain();
        this.editMode = false;
        this.beforeShow();
        this.visible = true;
        this.isRequestSend = false;
      }
    },
    beforeShow() {
    },
    /**
     * 保存表单
     */
    save() {
      if (this.$refs.editForm) {
        this.$refs.editForm.validate().then(() => {
          this.isRequestSend = true;
          this.doSave();
        });
      } else {
        this.isRequestSend = true;
        this.doSave();
      }
    },
    /**
     * 删除明细
     * @param index
     */
    removeDetail(index) {
      if (this.domain.details) {
        if (this.domain.details.findIndex((value, i, arr) => i === index)
          >= 0) {
          this.$message.success(
            `明细: ${this.domain.details[index].skuCode} 删除成功`);
          this.domain.details.splice(
            this.domain.details.findIndex((value, i, arr) => i === index), 1);
        }
      }
    },
    doSave() {
      if (this.beforeDoSave) {
        this.beforeDoSave();
      }
      if (this.domain[this.pk]) {
        this.api.modify(this.domain[this.pk], this.domain).then(
          this.confirm).then(() => {
          this.$message.success('修改成功');
        }, () => {
          this.isRequestSend = false;
        });
      } else {
        if (this.domain.details && this.domain.details.length === 0) {
          this.$message.error('至少要有一行明细');
          return;
        }
        this.api.add(this.domain).then(this.confirm).then(() => {
          this.$message.success('保存成功');
        }, () => {
          this.isRequestSend = false;
        });
      }
    },
    /**
     * 关闭窗体
     */
    close() {
      this.visible = false;
    },
    /**
     * 通知外部刷新数据
     */
    confirm() {
      this.$emit('ok', this.domain);
      if (this.continuous) {
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
        this.domain = this.genDefaultDomain();
      } else {
        this.close();
      }
    },
    /**
     * 选择SKU
     * @param data
     */
    selectSkus(data) {
      if (!this.domain.details) {
        let skus = [];
        this.$set(this.domain, 'details', skus);
      }
      for (let p of data) {
        let o = {};
        o.productCode = p.productCode;
        o.productId = p.productId;
        o.productName = p.productName;
        o.quantity = p.quantity;
        o.skuCode = p.skuCode;
        o.skuId = p.skuId;
        o.skuName = p.skuName;
        o.vipPrice = p.vipPrice;
        if (this.domain.details.findIndex(v => v.skuId === o.skuId) < 0) {
          for (let i in this.relation) {
            o[this.relation[i].prop] = p[this.relation[i].prop];
          }
          this.domain.details.push(o);
        }
      }
    },
    /**
     * 导入sku
     */
    showSkuImport() {
      if (this.$refs.skuImport) {
        this.$refs.skuImport.show(null);
      }
    },
    /**
     * 读取sku数据
     */
    readData(data) {
      let skus = [];
      for (let i of data) {
        skus.push(i[1]);
      }
      skus.forEach(item => {
        if (this.relation) {
          for (let col of this.relation) {
            item[col.prop] = item[col.label];
          }
        }
      });
      if (!this.domain.details) {
        this.$set(this.domain, 'details', skus);
      } else {
        skus.forEach(item => {
          if (this.domain.details.some(v => v.skuId === item.skuId)) {
            this.domain.details.push(item);
          }
        });
      }
    }
  }
};
export default Edit;