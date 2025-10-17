<template>
  <div class="body-content">
    <div class="login-form">
      <div class="title">
        <div class="logo"></div>
        <div class="title-c">{{ appTitle }}</div>
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
                <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
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
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item
              :wrapper-col="{ offset: 4, span: 16 }"
              name="code"
              :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <div class="code">
              <a-input v-model:value="formState.code" placeholder="请输入验证码" style="width: 75%">
                <template #prefix>
                  <SafetyCertificateOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>

              </a-input>
              <LoginCode
                  backgroundColor="white"
                  textColor="#000"
                  @click="changeCodeMethod"
              />
            </div>
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
            <a-button type="primary" html-type="submit" :loading="btnLoading" size="large" style="width: 100%">登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import { request } from '@/request/request'
import { setDictionary, setSystemSettings, setToken, setUserInfo } from '@/utils/token'
import router from '@/router'
import { onMounted, reactive, ref } from 'vue'
import { addRoutes } from '@/router/modules'
import store from '@/stores'
import LoginCode from '@/components/loginCode/LoginCode.vue'
import { message } from 'ant-design-vue'

const appTitle = ref<string>('')

interface FormState {
  name: string;
  password: string;
  code: string;
}

const formState = reactive<FormState>({
  name: 'root',
  password: '123456',
  code: ''
})

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
    setUserInfo(res.data.user)//登录成功保存user
    request('/admin/routes', 'get').then(async res => {
      await addRoutes(res.data.routes, router)
      store.commit('setRouters', res.data.routes) //vuex保存数据
      store.commit('setRoles', res.data.roles) //vuex保存数据
      await router.push({ path: '/home' })
      message.success('登录成功')
      btnLoading.value = false
    }).catch(() => {
      btnLoading.value = false
    })
    // 获取字典信息保存
    request('/admin/sub', 'post', { 'dictionary': '' }).then(res => {
      setDictionary(res.data) //成功保存字典
    })
  }).catch(() => {
    btnLoading.value = false
  })
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

//二维码
let code = ref<string>('')
const changeCodeMethod = (e: string | object) => {
  if (typeof e === 'string') {
    code.value = e
    formState.code = e
  }
}

//获取站点配置
onMounted(() => {
  request('/admin/setting/web', 'get').then(res => {
    const data = res.data
    const result = data.reduce((acc: any, item: any) => {
      acc[item.setting_key] = item.setting_value
      return acc
    }, {})
    appTitle.value = result.systemName
    setSystemSettings(result)
  })
})
</script>
<style>


.login-form {
  padding-top: 30px;
  background: #fff;
  border-radius: 15px; /* 圆角 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.body-content {
  background-image: url("public/image/login_bj.png");
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    color: black;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .title-c {
      margin-left: 10px;
      font-size: 30px;
    }

    .logo {
      width: 40px;
      height: 40px;
      background-image: url("public/image/logo.png");
      background-size: 100% 100%;
    }
  }

  .form {
    width: 400px;
  }
}

.code {
  display: flex;
}
</style>
