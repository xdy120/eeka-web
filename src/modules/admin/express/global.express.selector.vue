<template>
  <el-select v-model="selected" @change="change">
    <el-option v-for="item in list" :key="item.globalExpressId" :label="item.globalExpressName"
               :value="item.globalExpressId">
    </el-option>
  </el-select>
</template>
<script>
  import {GlobalExpressApi} from './api.js';

  export default {
    name: 'GlobalExpressSelector',
    props: {
      value: String,
      placeholder: {
        type: String,
      }
    },
    data() {
      return {
        selected: this.value,
        list: [],
      };
    },
    watch: {
      value: function (val) {
        this.selected = val;
      }
    },
    methods: {
      search() {
        GlobalExpressApi.list().then(r => {
          this.list = r;
        });
      },
      change(selected) {
        let item = this.list.find(v => v.globalExpressId === selected);
        this.$emit('input', selected);
        this.$emit('update:globalExpressName', item.globalExpressName);
      },
    },
    created() {
      this.search();
    }
  };
</script>
