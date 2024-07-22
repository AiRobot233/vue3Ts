<template>
  <div>
    <a-result status="404" title="404" sub-title="对不起，您访问的页面不存在！">
      <template #extra>
        <a-button type="primary" @click="home">返回首页</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

const home = () => {
  router.push({path: '/home'})
}
</script>

<style scoped>

</style>