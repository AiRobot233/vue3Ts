import '@/assets/main.css'

import {createApp} from 'vue'

import App from '@/App.vue'
import router from '@/router'
import axios from 'axios'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import permissionDirective from '@/directives/permission'; // 导入指令

const app = createApp(App)
// 注册自定义指令
app.directive('permission', permissionDirective);
app.use(router)
app.use(Antd)

app.config.globalProperties.$http = axios

app.mount('#app')
