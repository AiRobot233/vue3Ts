import {getToken, getUserInfo} from '@/utils/token'

const whiteList = ['/404'] //路由白名单

export function setGuard(router: any) {
    router.beforeEach((to: any, from: any, next: any) => {
        const token = getToken()
        // 白名单直接放行
        if (whiteList.includes(to.path)) {
            return next()
        }
        // 未登录状态
        if (!token) {
            if (to.path === '/login') {
                return next()
            } else {
                return next('/login')
            }
        }
        // 已登录状态访问登录页，跳到首页
        if (to.path === '/login') {
            return next('/business/home')
        }
        // 判断是否首次登录，需要跳转修改密码
        const user = getUserInfo()
        if (user?.first_login === 1 && to.path !== '/password') {
            return next('/password')
        }
        if (user?.first_login === 2 && to.path === '/password') {
            return next('/business/home')
        }
        // 默认放行
        return next()
    })
}


