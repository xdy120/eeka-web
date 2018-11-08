<template>
  <el-dialog :fullscreen="true" :visible="visible" :show-close="false"
             custom-class="print-dialog">
    <el-container>
      <el-header class="no-print">
        <el-button @click="doPrint">打印</el-button>
        <el-button @click="visible=false">取消</el-button>
      </el-header>
      <el-main>
        <slot :data="scopeData"></slot>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script>
  export default {
    name: 'print',
    data() {
      return {
        visible: false,
        scopeData: {}
      };
    },
    methods: {
      show(data) {
        this.scopeData = data;
        this.visible = true;
      },
      doPrint() {
        window.print();
        this.visible = false;
      }
    }
  };
</script>
<style>
  .print-dialog {
    border-radius: 0;
    box-shadow: none;
    margin: 0;
  }

  .print-dialog .el-dialog__header {
    padding: 0;
  }
</style>