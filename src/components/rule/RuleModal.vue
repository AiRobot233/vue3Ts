<template>
  <div>
    <a-modal
        v-model:open="visible"
        :title="title"
        @ok="onOk"
        :confirmLoading="confirmLoading"
        :maskClosable="false"
    >
      <a-form ref="formRef" :model="formState" name="basic" :label-col="{ style: { width: '100px' } }"
              :wrapper-col="{ span: 14 }">
        <a-form-item
            name="pid"
            label="上级"
            :rules="[{ required: true, message: '请选择上级', trigger: 'change' }]"
        >
          <a-tree-select
              treeNodeFilterProp="name"
              v-model:value="formState.pid"
              show-search
              placeholder="请选择上级"
              allow-clear
              tree-default-expand-all
              :treeData="treeData"
              :fieldNames="{children:'children', label:'name', key:'id', value: 'id'}"
          />
        </a-form-item>
        <a-form-item name="name" label="名称" :rules="[{ required: true, message: '请输入名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入名称"/>
        </a-form-item>
        <a-form-item name="type" label="类型" :rules="[{ required: true, message: '请选择类型' }]">
          <a-select ref="select" v-model:value="formState.type" placeholder="请选择类型">
            <a-select-option value="page">page</a-select-option>
            <a-select-option value="api">api</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="router" label="路由" :rules="[{ required: true, message: '请输入路由' }]">
          <a-input v-model:value="formState.router" placeholder="请输入路由"/>
        </a-form-item>
        <a-form-item v-if="formState.type === 'api'" name="method" label="路由规则"
                     :rules="[{ required: true, message: '请选择路由规则' }]">
          <a-select ref="select" v-model:value="formState.method" placeholder="请选择路由规则">
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="formState.type === 'api'" name="tag" label="按钮权限"
                     :rules="[{ required: false }]">
          <a-input v-model:value="formState.tag" placeholder="请输入按钮权限"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import type {FormInstance} from 'ant-design-vue';
import {request} from "@/request/request";
import {message} from "ant-design-vue";

let visible = defineModel("visible")
const emit = defineEmits(['reload']);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  type: {
    type: String,
    required: true,
    default: 'add',
  },
  params: {
    type: Object,
    required: false,
  }
});

let treeData = ref([])
const formRef = ref<FormInstance>();
let title = ref<string>('新增')
let confirmLoading = ref<boolean>(false)
let formState = reactive<any>({
  pid: props.params?.pid ? props.params.pid : undefined,
  name: props.params?.name ? props.params.name : '',
  type: props.params?.type ? props.params.type : undefined,
  router: props.params?.router ? props.params.router : '',
  method: props.params?.method ? props.params.method : undefined,
  tag: props.params?.tag ? props.params.tag : '',
});

getData()

function getData() {
  props.params?.id ? title.value = '修改' : title.value = '新增'
  //获取下拉数据
  request('/admin/sub', 'post', {'rule': 'page'}).then(res => {
    treeData.value = res.data
  })
}

const onOk = () => {
  if (formRef.value) {
    formRef.value
        .validateFields()
        .then(values => {
          confirmLoading.value = true
          //判断添加或者修改
          let url = '/admin/rule';
          let method = 'post';
          if (props.params?.id) {
            url = url + '/' + props.params?.id;
            method = 'put'
          }
          request(url, method, values).then(() => {
            message.success('操作成功')
            visible.value = false
            confirmLoading.value = false
            emit('reload')
          }).catch(() => {
            confirmLoading.value = false
          })
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
  } else {
    message.error('系统错误！请刷新后重试！')
  }
};

</script>

<style scoped>

</style>