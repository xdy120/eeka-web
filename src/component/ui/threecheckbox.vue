<template>
  <el-checkbox :indeterminate="indeterminate" @change="change" v-model="iValue"
               :disabled="disabled">
    <slot/>
  </el-checkbox>
</template>
<script>

  export default {
    name: 'ThreeCheckbox',
    props: {
      value: {
        required: true,
      },
      disabled: {
        required: false,
      }
    },
    data: function () {
      return {
        intValue: this.value === undefined ? 0 : (this.value ? 2 : 1),
        iValue: this.value,
        indeterminate: this.value === undefined ? true : false,
      };
    },
    watch: {
      value(val) {
        this.setStatus(val);
      },
    },
    methods: {
      setStatus(val) {
        if (val === undefined) {
          this.iValue = undefined;
          this.indeterminate = true;
        }
        else {
          this.iValue = val;
          this.indeterminate = false;
        }
      },
      change(val) {
        switch (++this.intValue % 3) {
          case 0:
            this.setStatus(undefined);
            this.$emit('input', undefined);
            break;
          case 1:
            this.setStatus(true);
            this.$emit('input', true);
            break;
          case 2:
            this.setStatus(false);
            this.$emit('input', false);
            break;
        }
      }
    },
  };
</script>
