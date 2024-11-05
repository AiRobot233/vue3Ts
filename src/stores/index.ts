// @ts-ignore
import {createStore} from 'vuex';
import createPersistedState from 'vuex-persistedstate';

// 定义 State 类型
interface State {
    menu: any;       // 根据实际数据结构更新类型
    routers: any[];  // 根据实际数据结构更新类型
    roles: any[];    // 根据实际数据结构更新类型
}

const store = createStore<State>({
    state: {
        menu: {},
        routers: [],
        roles: [],
    },
    mutations: {
        setMenuList(state: any, data: any) {
            state.menu = data;
        },
        setRouters(state: any, data: any) {
            state.routers = data;
        },
        setRoles(state: any, data: any) {
            state.roles = data;
        },
    },
    getters: {
        getRouters: (state: any) => () => state.routers,
        getMenuList: (state: any) => state.menu,
        getRoles: (state: any) => state.roles,
    },
    plugins: [
        createPersistedState({
            key: 'admin.store',
        }),
    ],
});

export default store;
