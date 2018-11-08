<template>
  <el-select v-model="selectedItem" :placeholder="placeholder" style="display: block">
    <el-option v-for="item in list" :key="item.mallAppId" :label="item.mallAppName"
               :value="item.mallAppId"></el-option>
  </el-select>
</template>
<script>
  import {MallAppApi} from './api.js';

  export default {
    name: 'MallAppSelector',
    props: {
      value: String,
      placeholder: {
        type: String,
      },
      clearable: {
        type: Boolean,
        default: false,
      },
      mallType: {
        required: true
      }
    },
    data() {
      return {
        selectedItem: this.value,
        list: {}
      };
    },
    watch: {
      value(val) {
        this.selectedItem = val;
      },
      mallType() {
        this.search();
      },
      selectedItem(val) {
        this.$emit('input', val);
      }
    },
    methods: {
      search() {
        if (this.mallType) {
          MallAppApi.listByMallType(this.mallType).then(data => this.list = data);
        }
      }
    },
    created() {
      this.selectedItem = this.value;
      this.search();
    }
  };
</script>
