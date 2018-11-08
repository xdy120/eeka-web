<template>
  <el-tooltip :content="tooltip" :open-delay="1000">
    <i :class="vIcon" :style="style"></i>
  </el-tooltip>
</template>
<script>
  export default {
    name: 'TooltipButton',
    props: {
      tooltip: {
        type: String,
        required: true
      },
      icon: {
        type: String
      },
      color: String
    },
    computed: {
      vIcon() {
        return `el-icon-oms-${this.icon}`;
      },
      style() {
        return {
          color: this.color
        };
      }
    }
  };
</script>