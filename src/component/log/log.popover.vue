<template>
  <div style="display: inline;overflow: hidden">
    <el-popover ref="logs" v-model="visible" title="日志" width="600" trigger="click"
                placement="left-end">
      <log-page :module-name="moduleName" ref="log" v-model="bizId"></log-page>
    </el-popover>
    <go-log-button @click="show" v-popover:logs></go-log-button>
  </div>
</template>
<script>

  export default {
    name: 'LogPopover',
    props: {
      moduleName: {
        type: String,
        required: true
      },
      bizId: {
        type: String,
        required: false
      },
    },
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      show() {
        this.visible = true;
        this.$refs.log.search();
      },
    }
  };
</script>