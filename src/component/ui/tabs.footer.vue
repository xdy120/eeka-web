<template>
  <el-footer :height="tabsHeight" style="padding:5px 0 0 0;overflow: hidden">
    <div style="float: right; position:relative;right:10px;top:5px;z-index: 100">
      <el-button @click="toggle" :icon="icon" type="text"></el-button>
    </div>
    <slot></slot>
  </el-footer>
</template>
<script>
  export default {
    props: {
      // main: String,
      mainHeight: [String, Number],
      tabsVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        tabsHeight: '260px',
        visible: this.tabsVisible,
      };
    },
    computed: {
      icon() {
        // return this.visible ? 'el-icon-arrow-down' : 'el-icon-arrow-up';
        return 'el-icon-close';
      }
    },
    methods: {
      toggle() {
        this.setVisible(!this.visible);
      },
      setVisible(visible) {
        this.visible = visible;
        if (this.visible) {
          this.tabsHeight = '260px';
        }
        else {
          this.tabsHeight = '0px';
        }
        this.$emit('update:tabsVisible', this.visible);
      },
      show() {
        this.setVisible(true);
      },
      hide() {
        this.setVisible(false);
      },
    },
    created() {
      this.$on('show', () => this.setVisible(true));
      this.$on('hide', () => this.setVisible(false));
      this.setVisible(this.visible);
    },
  };
</script>