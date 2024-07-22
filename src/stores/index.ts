// @ts-ignore
import {createStore} from 'vuex'
import createPersistedState from "vuex-persistedstate";
import {h} from "vue";
import {PieChartOutlined} from "@ant-design/icons-vue";

const options = {
    state: {
        menu: {},
        routers: [],
    },
    mutations: {
        setMenuList(state: any, data: any) {
            state.menu = data
        },
        setRouters(state: any, data: any) {
            state.routers = data
        },
    },
    getters: {
        getRouters: (state: any) => () => {
            return state.routers
        },
        getMenuList(state: any) {
            return state.menu
        },
    },
    /* vuex数据持久化配置 */
    plugins: [
        createPersistedState({
            // 存储的 key 的key值
            key: "store",
        })
    ]
}
const store = createStore(options)
export default store

