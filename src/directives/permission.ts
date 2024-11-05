import store from "@/stores";

export default {
    mounted(el: any, binding: any) {
        const operation = binding.value.operation;
        const resource = binding.value.resource;

        const permissionStore = store.getters.getRoles;

        // 获取当前路由对应的权限
        const currentRoutePermissions = permissionStore.find(
            (perm: any) => perm.router === resource
        );

        // 如果当前路由没有权限配置，移除按钮
        if (!currentRoutePermissions) {
            el.parentNode && el.parentNode.removeChild(el);
            return;
        }

        // 判断是否拥有该操作权限
        if (!currentRoutePermissions.operation.includes(operation)) {
            el.parentNode && el.parentNode.removeChild(el);
        }
    },
};
