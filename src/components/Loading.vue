<template>
  <div class="loading">
    <a-spin tip="加载中..." size="large"/>
  </div>
</template>
<script setup lang="ts">

</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 使容器高度为视口高度 */
}
</style>