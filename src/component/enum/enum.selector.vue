<template>
  <el-select v-model="selected" :disabled="disabled" :placeholder="placeholder"
             style="display: block" :clearable="clearable" :multiple="multiple" @change="change"
             value-key="title" :readonly="readonly" collapse-tags>
    <el-option v-for="value in list" :key="value.title" :label="value.caption"
               :value="value"></el-option>
  </el-select>
</template>
<script>
  import {EnumUtil} from './api.js';
  import {Assert} from '@/libs/util';

  export default {
    name: 'EnumSelector',
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      enumName: String,
      value: String,
      placeholder: {
        type: String,
      },
      clearable: {
        type: Boolean,
        default: true,
      },
      readonly: {
        type: Boolean,
        default: false
      },
      useValue: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selected: this.multiple ? [] : null,
        list: [],
      };
    },
    watch: {
      value() {
        this.parseValue();
      },
      list() {
        this.parseValue();
      }
    },
    methods: {
      parseValue() {
        this.selected = null;
        if (!Assert.isEmpty(this.value)) {
          if (this.multiple) {
            let words = this.value.split(',');
            this.selected = [];
            for (let w of words) {
              if (this.list[w]) {
                this.selected.push(this.list[w]);
              }
            }
          } else {
            this.selected = this.list[this.value];
          }
        } else {
          this.selected = this.multiple ? [] : null;
        }
      },
      change(selected) {
        if (this.multiple) {
          let v;
          if (this.useValue) {
            v = selected.map(x => x.value).join();
          } else {
            v = selected.map(x => x.title).join();
          }
          this.$emit('input', v);
        } else {
          if (this.useValue) {
            this.$emit('input', selected.value);
          } else {
            this.$emit('input', selected.title);
          }
        }
        this.$emit('change', selected);
      }
    },
    created() {
      EnumUtil.loadEnumMap([this.enumName]).then(() => {
        let map = EnumUtil.getEnumMap(this.enumName);
        let newMap = {};
        if (this.useValue) {
          for (let key of Object.keys(map)) {
            newMap[map[key].value] = map[key];
          }
          map = newMap;
        }
        this.list = map;
      });
    }
  };
</script>
