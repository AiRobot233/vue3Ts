<template>
  <div class="body-content">
    <a-layout style="width: 100%;height: 100%">
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="logo" title="测试站点">
          测试站点
        </div>
        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" theme="dark">
          <template v-for="item in items">
            <a-menu-item :key="item.key" v-if="!item.children" @click="click(item)">
              <Icon :icon="item?.icon"></Icon>
              <span>{{ item.title }}</span>
            </a-menu-item>
            <a-sub-menu v-else :key="item.key + 1">
              <template #title>
                <Icon :icon="item?.icon"></Icon>
                <span>{{ item.title }}</span>
              </template>
              <a-menu-item v-for="child in item.children" :key="child.key" @click="click(child)">
                <Icon :icon="child?.icon"></Icon>
                <span>{{ child.title }}</span>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="layout-header">
          <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)"/>
          <div class="userTitle">
            <a-dropdown>
              <div style="cursor: pointer">
                <a-avatar :size="35">
                  <template #icon>
                    <UserOutlined/>
                  </template>
                </a-avatar>
                <span class="user-name">{{ userInfo.name }}</span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a @click="editPassword">修改密码</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="loginOut">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content
            :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px',overflowY: 'auto' }"
        >
          <router-view/>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <EditPassword v-if="editPasswordVisible" :visible="editPasswordVisible" @cancel="cancel"/>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import store from "@/stores";
import router from "@/router";
import {useRoute} from "vue-router";
import {findNodeByPath, Icon} from "@/utils/menu";
import {clearLocalStorage, getLocalStorage} from "@/utils/token";
import EditPassword from "@/components/EditPassword.vue";
import {Modal} from "ant-design-vue";


let items = ref<any>([])
let selectedKeys = ref<any[]>([]);
let openKeys = ref<string[]>([]);
const collapsed = ref<boolean>(false);
let editPasswordVisible = ref<boolean>(false)
let userInfo = ref<any>()

getData()

function getData() {
  //获取用户的缓存数据
  userInfo.value = getLocalStorage('userInfo')

  //获取vuex菜单数据
  const menuList = store.getters.getMenuList
  if (menuList !== undefined) {
    items.value = menuList
    //获取默认选中以及打开菜单数据
    const route = useRoute();
    const result = findNodeByPath(menuList, route.path)
    if (result !== null) {
      selectedKeys.value = [result?.key]
      result?.parKey == null ? openKeys.value = [] : openKeys.value = [result?.parKey + 1]
    }
  }
}

const click = (item: any) => {
  router.push({path: item.path})
}

//修改密码
const editPassword = () => {
  editPasswordVisible.value = true
}

const cancel = () => {
  editPasswordVisible.value = false
}

//退出登录
const loginOut = () => {
  Modal.confirm({
    title: '确认退出系统吗？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      clearLocalStorage()
      router.push({path: '/login'})
    },
  });
}
</script>
<style scoped>
.userTitle {
  margin-right: 40px;
}

.layout-header {
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.body-content {
  width: 100%;
  height: 100%;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  margin: 16px;
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.user-name {
  margin-left: 5px;
}
</style>
