<template>
  <el-select v-model="selectedItem" :placeholder="placeholder" :style="style">
    <el-option v-for="item in list" :key="item.wmsAppId" :label="item.wmsAppName"
               :value="item.wmsAppId"></el-option>
  </el-select>
</template>
<script>
  import {WmsAppApi} from './api.js';

  export default {
    name: 'WmsAppSelector',
    props: {
      value: String,
      placeholder: {
        type: String,
      },
      clearable: {
        type: Boolean,
        default: false,
      },
      block: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        selectedItem: null,
        list: {},
      };
    },
    computed: {
      style() {
        return {display: this.block ? 'block' : 'inline-block'};
      }
    },
    watch: {
      selectedItem(val) {
        this.$emit('input', val);
      },
      value: function (val) {
        this.selectedItem = val;
      },
    },
    methods: {
      search() {
        WmsAppApi.list().then(data => this.list = data);
      }
    },
    created() {
      this.selectedItem = this.value;
      this.search();
    }
  };
</script>
