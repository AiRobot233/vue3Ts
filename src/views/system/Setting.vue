<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" tab-position="left" animated>
      <a-tab-pane key="1" tab="站点配置">
        <a-form
            :model="formState"
            name="basic"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 6 }"
            autocomplete="off"
            @finish="webOnFinish"
        >
          <a-form-item
              label="站点名称"
              name="systemName"
              :rules="[{ required: false }]"
          >
            <a-input v-model:value="formState.systemName"/>
          </a-form-item>

          <a-form-item
              label="备案编号"
              name="recordNumber"
              :rules="[{ required: false }]"
          >
            <a-input v-model:value="formState.recordNumber"/>
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 2 }">
            <a-button type="primary" html-type="submit" :loading="webLoading">提交</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {request} from '@/request/request'
import {message} from 'ant-design-vue'
import {setSystemSettings} from '@/utils/token'

const activeKey = ref('1')
let webLoading = ref(false)

const formState: any = reactive({
  systemName: '',
  recordNumber: ''
})

onMounted(() => {
  request('/admin/setting', 'get').then((res) => {
    const data = res.data
    data.forEach((item: any) => {
      if (item.setting_key === 'systemName') {
        formState.systemName = item.setting_value
      }
      if (item.setting_key === 'recordNumber') {
        formState.recordNumber = item.setting_value
      }
    })
  })
})

//站点配置提交
const webOnFinish = (values: any) => {
  webLoading.value = true
  //接口提交
  const items = Object.entries(values).map(([key, value]) => ({
    setting_key: key,
    setting_value: value,
    setting_type: 1
  }))
  request('/admin/setting/save', 'post', items).then(() => {
    //保存缓存
    setSystemSettings(formState)
    message.success('保存成功！')
    webLoading.value = false
  }).catch(() => {
    webLoading.value = false
  })
}

</script>

<style scoped>

</style>