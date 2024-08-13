import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html';


export default defineConfig(({mode}) => {
    let ev = loadEnv(mode, process.cwd());
    return {
        plugins: [
            vue(),
            createHtmlPlugin({
                inject: {
                    data: {
                        title: ev.VITE_APP_TITLE,
                    },
                },
            }),
        ],
        define: {//vue3必须要使用这个获取process
            'process.env': {}
        }
        ,
        base: ev.VITE_APP_ENV === 'development' ? './' : './',
        server: {//配置代理
            host: '0.0.0.0',
            proxy: {
                "/api": {
                    target: ev.VITE_BASIC_URL_KEY,//服务器地址
                    changeOrigin: true,//允许同源策略
                    rewrite: (path) => path.replace(/^\/api/, "")
                },
            },
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))//配置别名，配置后/src可以用@代替使用
            }
        }
    }
})
