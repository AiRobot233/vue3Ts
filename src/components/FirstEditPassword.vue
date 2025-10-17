<template>
  <div>
    <a-modal
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      v-model:open="visible"
      title="首次登录修改密码"
      :footer="null"
      :confirmLoading="confirmLoading"
    >
      <a-form ref="formRef"
              :model="formState"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 16 }"
      >
        <a-form-item
          name="password"
          label="新密码"
          :rules="[{ required: true, message: '请输入新密码'}]"
        >
          <a-input-password v-model:value="formState.password" placeholder="请输入新密码" />
        </a-form-item>
      </a-form>

      <div class="btn">
        <a-button type="primary" @click="onOk">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { request } from '@/request/request'
import { getUserInfo,setUserInfo } from '@/utils/token'
import router from '@/router'

let confirmLoading = ref<boolean>(false)

interface Values {
  password: string;
}

const formRef = ref()
let visible = ref<boolean>(true)

const formState = reactive<Values>({
  password: ''
})

const onOk = () => {
  formRef.value
    .validateFields()
    .then((values: any) => {
      confirmLoading.value = true
      request('/admin/first/pwd', 'put', values).then(async () => {
        confirmLoading.value = false
        const user = getUserInfo() //获取用户信息
        user.first_login = 2
        setUserInfo(user) //保存user缓存
        await router.push({ path: '/home' })
        message.success('修改成功')
      }).catch(() => {
        confirmLoading.value = false
      })
    })
    .catch((info: any) => {
      console.log(info)
    })
}


</script>

<style scoped>
.btn{
  width: 100%;
  display: flex;
  justify-content: right;
}
</style>