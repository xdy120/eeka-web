<template>
  <el-upload ref="uploader" action="#" :multiple="iDisabled" :limit="1" :accept="accept"
             :on-change="handleChange" :http-request="ignore" :disabled="disabled"
             :show-file-list="false">
    <el-button @click="clearFile">选择文件</el-button>
    <div slot="tip" class="el-upload__tip">
      只能上传xls、xsls、cvs文件，且不超过5MB<a v-if="templateUrl!==undefined" :href="template"
                                   target="_blank" style="float: right">下载模板</a>
    </div>
  </el-upload>
</template>
<script>
  import XLSX from 'xlsx';
  import {messageApi} from './api';
  import config from '@/config/config';

  var SheetJSFT = '.xlsx,.xls,.cvs';
  export default {
    components: {messageApi, config},
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      templateUrl: String,
    },
    data() {
      return {
        api: messageApi,
        accept: SheetJSFT,
        iDisabled: this.disable,
        baseUrl: config.url
      };
    },
    watch: {
      disabled(val) {
        this.iDisabled = val;
      }
    },
    computed: {
      template() {
        // return `${this.baseUrl}${encodeURI(this.templateUrl)}`;
        return `${this.baseUrl}${this.templateUrl}`;
      }
    },
    methods: {
      clearFile() {
        this.$refs.uploader.clearFiles();
      },
      ignore() {
      },
      change(list) {
        this.$emit('change', list);
      },
      handleChange(evt) {
        let file = evt.raw;
        var reader = new FileReader();
        let component = this;
        reader.onload = function (e) {
          var binary = '';
          var bytes = new Uint8Array(e.target.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var wb = XLSX.read(binary, {type: 'binary'});
          var wsname = wb.SheetNames[0];
          var ws = wb.Sheets[wsname];
          let data =
            XLSX.utils.sheet_to_json(ws, {header: 1, range: {s: {c: 0, r: 0}, e: {c: 100, r: 0}}});
          let data2 = XLSX.utils.sheet_to_json(ws);
          data.splice(1, data.length);
          data2.forEach(detail => {
            data.push(detail);
          });
          if (data.length > 0) {
            component.change(data);
          } else {
            component.$message.warning('文件错误或没有数据！');
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };
</script>