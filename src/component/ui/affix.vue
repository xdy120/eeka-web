<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      top: {
        type: String,
        default: '50%'
      },
      right: {
        type: String,
        default: '0px'
      },
      bottom: String,
      left: String
    },
    data() {
      return {};
    },
    computed: {
      style() {
        let style = {float: 'left', position: 'absolute', zIndex: 100};
        if (this.top) {
          style.top = this.top;
        }
        if (this.right) {
          style.right = this.right;
        }
        if (this.bottom) {
          style.bottom = this.bottom;
        }
        if (this.left) {
          style.left = this.left;
        }
        return style;
      }
    }
  };
</script>