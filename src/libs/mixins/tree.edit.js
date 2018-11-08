const TreeEdit = {
  data() {
    return {
      domain: {},
      visible: false,
    };
  },
  methods: {
    show(parentId, id) {
      if (id) {
        this.api.get(id).then(data => {
          this.domain = data;
          this.visible = true;
        });
      } else {
        this.domain = {parentId};
        if (this.$refs.editForm) {
          this.$refs.editForm.resetFields();
        }
        this.visible = true;
      }
    },
    save() {
      if (this.$refs.editForm) {
        this.$refs.editForm.validate().then(() => {
          this.doSave();
        });
      } else {
        this.doSave();
      }
    },
    doSave() {
      if (this.domain[this.pk]) {
        this.api.modify(this.domain[this.pk], this.domain).then(() => {
          this.$emit('ok', this.domain);
          this.visible = false;
        });
      } else {
        this.api.add(this.domain).then(() => {
          this.$emit('ok', this.domain);
          this.visible = false;
        });
      }
    }
  }
};
export default TreeEdit;