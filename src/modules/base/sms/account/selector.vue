<template>
  <el-select v-model="iValue" placeholder="请选择" @change="onSelected">
    <el-option
        v-for="item in options"
        :key="item.smsAccountId"
        :label="item.smsAccountName"
        :value="item.smsAccountId"
    >
    </el-option>
  </el-select>
</template>
<script>

  import api from './api';

  export default {
    name: 'SmsAccountSelector',
    props: {
      value: {
        required: false,
      },
      smsAccountName: {
        required: false,
      },
    },
    data() {
      return {
        iValue: this.value,
        options: [],
      };
    },
    methods: {
      onSelected(selected) {
        this.$emit('input', selected);
        let current = this.options.find(e => e.smsAccountId === selected);
        current && this.$emit('update:smsAccountName', current.smsAccountName);
      }
    },
    created() {
      api.list().then(r => {
        this.options = r;
      });
    },
  };
</script>
