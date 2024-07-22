<template>
  <div class="body-content">
    <div class="form">
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            label="用户名"
            name="name"
            :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="formState.name" placeholder="请输入用户名"/>
        </a-form-item>

        <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="请输入密码"/>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 14, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="btnLoading">确认</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import {request} from "@/request/request";
import {setLocalStorage, setToken} from "@/utils/token";
import router from "@/router";
import {reactive, ref} from 'vue';
import {addRoutes} from "@/router/modules";
import store from "@/stores";

interface FormState {
  name: string;
  password: string;
}

const formState = reactive<FormState>({
  name: 'root',
  password: 'Aa#112233',
});

let btnLoading = ref<boolean>(false)
const onFinish = (values: any) => {
  btnLoading.value = true
  request('/admin/login', 'post', values).then(res => {
    setToken(res.data.token)//登录成功保存token
    setLocalStorage('userInfo', res.data.user)//登录成功保存user
    request('/admin/routes', 'get').then(async res => {
      await addRoutes(res.data.routes, router)
      store.commit('setRouters', res.data.routes) //vuex保存数据
      await router.push({path: '/home'})
      btnLoading.value = false
    }).catch(() => {
      btnLoading.value = false
    })
  }).catch(() => {
    btnLoading.value = false
  })
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

</script>
<style>
.body-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    width: 500px;
    height: 450px;
  }
}
</style>
