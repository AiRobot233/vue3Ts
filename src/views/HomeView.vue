<template>
  <div class="home">
    <a-button @click="click">打印路由</a-button>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

const click = () => {
  console.log(router.getRoutes())
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>