<template>
  <div>
    <h1>404</h1>
    <el-button @click="goHome">首页</el-button>
    <el-button @click="backPage">上一页</el-button>
  </div>
</template>

<script>
  export default {
    name: 'Error404',
    methods: {
      backPage() {
        this.$router.go(-1);
      },
      goHome() {
        this.$router.push('/');
      }
    }
  };
</script>
