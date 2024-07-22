import './assets/main.css'

import {createApp} from 'vue'

import App from '@/App.vue'
import router from '@/router'
import axios from 'axios'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)

app.use(router)
app.use(Antd)

app.config.globalProperties.$http = axios

app.mount('#app')