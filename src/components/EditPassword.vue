<template>
  <div>
    <a-modal
        v-model:open="visible"
        title="修改密码"
        ok-text="确认"
        cancel-text="取消"
        @ok="onOk"
        @cancel="onCancel"
        :confirmLoading="confirmLoading"
    >
      <a-form ref="formRef"
              :model="formState"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 16 }"
      >
        <a-form-item
            name="old_password"
            label="旧密码"
            :rules="[{ required: true, message: '请输入旧密码' }]"
        >
          <a-input-password v-model:value="formState.old_password" placeholder="请输入旧密码"/>
        </a-form-item>

        <a-form-item
            name="password"
            label="新密码"
            :rules="[{ required: true, validator:passValidate}]"
        >
          <a-input-password v-model:value="formState.password" placeholder="请输入新密码"/>
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {message} from "ant-design-vue";
import {request} from "@/request/request";
import type {Rule} from "ant-design-vue/es/form";

let confirmLoading = ref<boolean>(false)

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  }
});

const emit = defineEmits(['cancel']);

interface Values {
  old_password: string;
  password: string;
}

const formRef = ref();
const visible = ref<boolean>(props.visible);
const formState = reactive<Values>({
  old_password: '',
  password: '',
});

const onOk = () => {
  formRef.value
      .validateFields()
      .then((values: any) => {
        confirmLoading.value = true
        request('/admin/change/pwd', 'put', values).then(res => {
          confirmLoading.value = false
          message.success('修改成功')
          onCancel()
        }).catch(() => {
          confirmLoading.value = false
        })
      })
      .catch((info: any) => {
        console.log(info)
      });
};

const onCancel = () => {
  emit('cancel')
}

//新密码校验
const passValidate = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('请输入新密码');
  }
  if (value === formState.old_password) {
    return Promise.reject('新密码不能和旧密码相同');
  }
  return Promise.resolve();
};
</script>

<style scoped>

</style>