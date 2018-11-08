const Tree = {
  data() {
    return {
      selectedNode: null,
      root: [],
    };
  },
  methods: {
    showNodeCreator(parentId, id) {
      if (this.$refs.creator) {
        this.$refs.creator.show(parentId, id);
      } else {
        this.showNodeEditor(parentId, id);
      }
    },
    showNodeEditor(parentId, id) {
      if (this.$refs.editor) {
        this.$refs.editor.show(parentId, id);
      }
    },
    addNode(node) {
      this.selectedNode = node;
      this.showNodeCreator(node.data[this.pk]);
    },
    modifyNode(node) {
      this.selectedNode = node;
      this.showNodeEditor(node.data.parentId, node.data[this.pk]);
    },
    removeNode(node) {
      this.selectedNode = node;
      this.api.listChildren(node.data[this.pk]).then(response => {
        if (response.length == 0) {
          this.$confirm('删除后不可恢复，是否删除？').then(() => {
            this.api.remove(node.data[this.pk]).then(() => {
              this.reloadChildren(node.parent);
            });
          });
        } else {
          this.$confirm('存在子分类，不能进行删除操作');
        }
      });
    },
    removeDicNode(node) {
      this.selectedNode = node;
      if (node.data.childrenQuantity == 0) {
        this.$confirm('删除后不可恢复，是否删除？').then(() => {
          this.api.remove(node.data[this.pk]).then(() => {
            this.reloadChildren(node.parent);
          });
        });
      } else {
        this.$confirm('存在子分类，不能进行删除操作');
      }
    },
    selectedNodeChange(data, node) {
      this.selectedNode = node;
    },
    reloadChildren(node) {
      if (this.api && this.$refs.tree) {
        this.api.listChildren(node.data[this.pk]).then(children => {
          this.$refs.tree.updateKeyChildren(node.data[this.pk], children);
        });
      }
    },
    loadChildren(node, resolve) {
      if (node.level === 0) {
        resolve(this.root);
      } else {
        this.api.listChildren(node.data[this.pk]).then(children => {
          resolve(children);
        });
      }
    },
    treeItemRender(h, {node}) {
      return h('span',
        {
          style: 'flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 16px; padding-right: 8px;'
        },
        [
          h('span', {style: 'margin-right: 20px'}, [h('i', {
            'class': 'el-icon-oms-briefcase',
            style: 'margin-right: 5px'
          }), h('span', node.label)]),
          h('span', [node.level <= 3 ? h('go-add-button', {
            props: {iconVisible: true, textVisible: false},
            on: {click: () => this.addNode(node)}
          }) : null, node.level > 1 ? h('go-modify-button', {
            props: {iconVisible: true, textVisible: false},
            on: {click: () => this.modifyNode(node)}
          }) : null, node.level > 1 ? h('go-delete-button', {
            props: {iconVisible: true, textVisible: false},
            on: {click: () => this.removeNode(node)}
          }) : null
          ])
        ]
      );
    },
    ok(data) {
      if (data[this.pk]) {
        console.log('load parent', data, this.selectedNode)
        this.reloadChildren(this.selectedNode.parent);
      } else {
        this.reloadChildren(this.selectedNode);
        console.log('load self', data, this.selectedNode)
      }
    }
  }
};
export default Tree;