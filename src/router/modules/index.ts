import store from "@/stores";
import layout from "@/layout/layout.vue";

interface Route {
    name: string;
    path: string;
    icon: string;
    redirect?: any;
    component?: any;
    children?: Route[];
}

interface APIRoute {
    id: number;
    name: string;
    router: string;
    children?: APIRoute[];
}

interface Router {
    addRoute(route: Route): void;
}

interface Menu {
    key: string;
    icon: string;
    label: string;
    title: string;
    path: string;
    children?: Menu[];
}

class RouteManager {
    private readonly localRoutes: Route[];
    private readonly apiRoutes: APIRoute[];
    private router: Router;

    constructor(localRoutes: Route[], apiRoutes: APIRoute[], router: Router) {
        this.localRoutes = localRoutes;
        this.apiRoutes = apiRoutes;
        this.router = router;
    }

    public syncRoutes() {
        const {matchedRoutes, menus} = this.matchRoutes(this.localRoutes, this.apiRoutes);
        matchedRoutes.forEach(route => this.router.addRoute(route));
        let data: any
        if (menus.length > 0) {
            data = menus[0].children
        }
        //保存菜单到vuex
        store.commit('setMenuList', data) //vuex保存数据
    }

    private matchRoutes(localRoutes: Route[], apiRoutes: APIRoute[]): { matchedRoutes: Route[], menus: Menu[] } {
        const matchedRoutes: Route[] = [];
        const menus: Menu[] = [];
        localRoutes.forEach(localRoute => {
            const matchedAPIRoute = apiRoutes.find(apiRoute => apiRoute.router === localRoute.name);
            if (matchedAPIRoute) {
                const matchedRoute: Route = {...localRoute};
                const menu: Menu = {
                    key: matchedAPIRoute.id.toString(),
                    icon: matchedRoute.icon,//matchedRoute.icon
                    label: matchedAPIRoute.name,
                    title: matchedAPIRoute.name,
                    path: matchedRoute.path,
                };
                if (localRoute.children && matchedAPIRoute.children) {
                    const {
                        matchedRoutes: childRoutes,
                        menus: childMenus
                    } = this.matchRoutes(localRoute.children, matchedAPIRoute.children);
                    matchedRoute.children = childRoutes;
                    menu.children = childMenus;
                }

                // 替换 name
                matchedRoute.name = matchedAPIRoute.name;
                matchedRoutes.push(matchedRoute);
                menus.push(menu);
            }
        });

        return {matchedRoutes, menus};
    }
}

//获取本地路由
export async function addRoutes(data: any, router: any) {
    let routeModuleList: any = []
    const modules: any = import.meta.glob('@/router/modules/**/*.ts', {eager: true});
    Object.keys(modules).forEach((key) => {
        const mod = modules[key].default || {};
        const modList = Array.isArray(mod) ? [...mod] : [mod];
        routeModuleList.push(...modList);
    });
    const routeModuleData = [{
        path: '/',
        name: 'root',
        icon: '',
        component: layout,
        redirect: {name: 'login'},
        children: routeModuleList,
    }]
    const routeManager = new RouteManager(routeModuleData, data, router);
    routeManager.syncRoutes();
}