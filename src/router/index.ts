import {createRouter, createWebHistory} from 'vue-router'
import {getToken} from "@/utils/token";
import {setGuard} from "@/router/routingGuard";
import store from "@/stores";
import {addRoutes} from "@/router/modules";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/404',
            name: '404',
            component: () => import('@/components/404.vue')
        },
        {
            path: '/password',
            name: 'password',
            component: () => import('@/components/FirstEditPassword.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            component: () => import('@/components/Loading.vue')
        }
    ]
})

router.isReady().then(() => {
    const token = getToken()
    if (token !== null) {
        //获取vuex中的路由
        const routes = store.getters.getRouters()
        if (routes.length > 0) {
            addRoutes(routes, router).then(r => {
                router.replace(router.currentRoute.value.fullPath)
            })
        }
    }
})

setGuard(router)

export default router
