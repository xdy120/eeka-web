<template>
  <el-button type="text" :icon="icon" @click="toggle">
    <template v-if="showText">
      {{ text }}
    </template>
  </el-button>
</template>
<script>
  export default {
    name: 'GoToggle',
    props: {
      onValue: {
        default: true
      },
      offValue: {
        default: false
      },
      onIcon: {
        type: String,
        default: 'el-icon-oms-enable'
      },
      offIcon: {
        type: String,
        default: 'el-icon-oms-disable'
      },
      onText: {
        type: String,
        default: '启用'
      },
      offText: {
        type: String,
        default: '禁用'
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      showText: {
        type: Boolean,
        default: true
      },
      value: {
        require: true
      }
    },
    computed: {
      icon() {
        if (this.showIcon) {
          return !this.isTrue() ? this.onIcon : this.offIcon;
        }
        return null;
      },
      text() {
        return !this.isTrue() ? this.onText : this.offText;
      }
    },
    methods: {
      isTrue() {
        return this.value === this.onValue;
      },
      toggle() {
        let val = this.isTrue() ? this.offValue : this.onValue;
        this.$emit('input', val);
        this.$emit('change', val);
      }
    }
  };
</script>