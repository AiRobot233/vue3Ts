//设置token
export function setToken(value: string) {
    setLocalStorage('admin.token', value)
}

//获取token
export function getToken() {
    return getLocalStorage('admin.token')
}

//删除token
export function removeToken() {
    removeLocalStorage('admin.token');
}

//获取指定LocalStorage数据
export function getLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

//设置指定LocalStorage数据
export function setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
}

//清空指定LocalStorage数据
export function removeLocalStorage(key: string) {
    localStorage.removeItem(key);
}

//清空LocalStorage
export function clearLocalStorage() {
    removeLocalStorage('admin.token')
    removeLocalStorage('admin.userInfo')
    removeLocalStorage('admin.store')
}