<template>
  <el-input v-if="input" v-model="text" readonly></el-input>
  <span v-else>{{text}}</span>
</template>
<script>
  import {EnumUtil} from './api.js';

  export default {
    name: 'EnumShow',
    props: {
      value: {
        required: true
      },
      enumName: {
        required: true
      },
      input: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        text: '',
      };
    },
    watch: {
      value(val) {
        this.loadPromise.then(r => {
          this.setText(r, val);
        });
      }
    },
    methods: {
      setText(enumItems, item) {
        this.text = '';
        for (let i of enumItems) {
          if (i.title === item) {
            this.text = i.caption;
          }
        }
      },
    },
    created() {
      this.loadPromise = EnumUtil.getEnum(this.enumName);
      this.loadPromise.then(r => {
        this.setText(r, this.value);
      });
    }
  };
</script>
