<template>
  <el-tooltip :content="tooltip" :open-delay="1000" v-if="!textVisible">
    <el-button :disabled="disabled" :icon="vIcon" :class="color" type="text" @click="handleClick">
      <template v-if="textVisible">{{tooltip}}</template>
    </el-button>
  </el-tooltip>
  <el-button v-else :disabled="disabled" :icon="vIcon" :class="color" type="text"
             @click="handleClick">
    <template v-if="textVisible">{{tooltip}}</template>
  </el-button>
</template>
<script>
  export default {
    name: 'TooltipButton',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      tooltip: {
        type: String,
        required: false
      },
      icon: {
        type: String
      },
      iconVisible: {
        type: Boolean,
        default: false
      },
      textVisible: {
        type: Boolean,
        default: true
      },
      color: {
        type: String,
      }
    },
    computed: {
      vIcon() {
        return this.iconVisible ? `el-icon-oms-${this.icon}` : '';
      }
    },
    methods: {
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>