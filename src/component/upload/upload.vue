<template>
  <div>
    <el-upload
        class="upload-demo"
        action="http://127.0.0.1:8181/api/base/upload/excelFile"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="loadData"
        :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传1个.xlsx类型文件，且不超过10mb</div>
    </el-upload>
  </div>
</template>
<script>
  export default {
    name: 'UploadFile',
    data() {
      return {
        fileList: []
      };
    },
    methods: {
      handleRemove(file, fileList) {
      },
      handlePreview(file) {
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      loadData(response, file, fileList) {
      }
    }
  };
</script>