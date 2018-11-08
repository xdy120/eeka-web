<template>
    <span class="avatar" :style="style">
        <img :src="src" v-if="src">
        <el-icon :icon="icon" v-else-if="icon"></el-icon>
        <template v-else><slot></slot></template>
    </span>
</template>
<script>
  export default {
    name: 'avatar',
    props: {
      color: {
        type: String,
        default: '#fff'
      },
      bgColor: {
        type: String,
        default: '#a4a6ac'
      },
      src: {
        type: String
      },
      icon: {
        type: String
      }
    },
    data() {
      return {
        style: {
          backgroundColor: this.bgColor,
          color: this.color
        }
      };
    }
  };
</script>
<style>
  .avatar {
    text-align: center;
    vertical-align: center;
    font-size: 14px;
    overflow: hidden;
    border-radius: 24px;
    line-height: 48px;
    height: 48px;
    width: 48px;
    transform: scale(1);
    display: inline-block;
  }
</style>