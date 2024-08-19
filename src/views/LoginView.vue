<template>
  <div class="body-content">
    <div class="title">
      <h1>测试站点</h1>
    </div>
    <div class="form">
      <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            :wrapper-col="{ offset: 4, span: 16 }"
            name="name"
            :rules="[{ required: true, message: '请输入账号' }]"
        >
          <a-input v-model:value="formState.name" placeholder="请输入账号">
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
            :wrapper-col="{ offset: 4, span: 16 }"
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="请输入密码">
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
            :wrapper-col="{ offset: 4, span: 16 }"
            name="code"
            :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <div class="code">
            <a-input v-model:value="formState.code" placeholder="请输入验证码" style="width: 75%"/>
            <LoginCode
                backgroundColor="white"
                textColor="#000"
                @click="changeCodeMethod"
            />
          </div>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="btnLoading" style="width: 100%">登录</a-button>
        </a-form-item>
      </a-form>
    </div>

  </div>
</template>
<script setup lang="ts">
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';
import {request} from "@/request/request";
import {setLocalStorage, setToken} from "@/utils/token";
import router from "@/router";
import {reactive, ref} from 'vue';
import {addRoutes} from "@/router/modules";
import store from "@/stores";
import LoginCode from "@/components/loginCode/LoginCode.vue";
import {message} from "ant-design-vue";

interface FormState {
  name: string;
  password: string;
  code: string;
}

const formState = reactive<FormState>({
  name: 'root',
  password: '123456',
  code: '',
});

let btnLoading = ref<boolean>(false)
const onFinish = (values: any) => {
  btnLoading.value = true
  //检验验证码
  if (code.value !== formState.code) {
    message.error('验证码错误！')
    btnLoading.value = false
    return
  }
  request('/admin/login', 'post', values).then(res => {
    setToken(res.data.token)//登录成功保存token
    setLocalStorage('admin.userInfo', res.data.user)//登录成功保存user
    request('/admin/routes', 'get').then(async res => {
      await addRoutes(res.data.routes, router)
      store.commit('setRouters', res.data.routes) //vuex保存数据
      await router.push({path: '/home'})
      message.success('登录成功')
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

//二维码
let code = ref<string>('')
const changeCodeMethod = (e: string | object) => {
  if (typeof e === "string") {
    code.value = e
    formState.code = e
  }
}

</script>
<style>
.body-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .form {
    width: 500px;
    height: 450px;
  }
}

.code {
  display: flex;
}
</style>
