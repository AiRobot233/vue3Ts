import {getToken} from "@/utils/token";

const whiteList = ['/404'] //路由白名单

export function setGuard(router: any) {
    router.beforeEach((to: any, from: any, next: any) => {
        //用户未登录只能访问登录
        if (whiteList.includes(to.path)) {
            next();
        } else {
            const token = getToken()
            if (token === null) {
                if (to.path === '/login') {
                    next();
                } else {
                    next('login');
                }
            } else {
                if (to.path === '/login') {
                    next('home')
                } else {
                    next();
                }
            }
        }
    });
}

