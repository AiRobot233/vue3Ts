<template>
  <a-config-provider :locale="zhCN">
      <RouterView/>
  </a-config-provider>
</template>

<script setup lang="ts">
import {RouterView} from 'vue-router'
import zhCN from "ant-design-vue/es/locale/zh_CN";

import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

</script>

<style scoped>

</style>
