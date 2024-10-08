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
        <a-form-item name="name" label="名称" :rules="[{ required: true, message: '请输入名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入名称"/>
        </a-form-item>
        <a-form-item name="phone" label="电话" :rules="[{ required: false }]">
          <a-input v-model:value="formState.phone" placeholder="请输入电话"/>
        </a-form-item>
        <a-form-item name="unit_id" label="所属单位" :rules="[{ required: true, message: '请选择所属单位' }]">
          <a-tree-select
              treeNodeFilterProp="name"
              v-model:value="formState.unit_id"
              show-search
              placeholder="请选择所属单位"
              allow-clear
              :fieldNames="{children:'children', label:'name', key:'id', value: 'id'}"
              :tree-data="unitData"
          />
        </a-form-item>
        <a-form-item name="role_id" label="角色组" :rules="[{ required: true, message: '请选择角色组' }]">
          <a-tree-select
              treeNodeFilterProp="name"
              v-model:value="formState.role_id"
              show-search
              placeholder="请选择角色组"
              allow-clear
              :fieldNames="{children:'children', label:'name', key:'id', value: 'id'}"
              :tree-data="roleData"
          />
        </a-form-item>
        <a-form-item name="status" label="状态" :rules="[{ required: true, message: '请选择状态' }]">
          <a-radio-group v-model:value="formState.status">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="2">禁用</a-radio>
          </a-radio-group>
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

let roleData = ref<any>([])
let unitData = ref<any>([])
const formRef = ref<FormInstance>();
let title = ref<string>('新增')
let confirmLoading = ref<boolean>(false)
let formState = reactive<any>({
  name: props.params?.name ? props.params.name : '',
  phone: props.params?.phone ? props.params.phone : '',
  role_id: props.params?.role_id ? props.params.role_id : undefined,
  unit_id: props.params?.unit_id ? props.params.unit_id : undefined,
  status: props.params?.status ? props.params.status : 1,
});

getData()

function getData() {
  props.params?.id ? title.value = '修改' : title.value = '新增'
  //获取下拉数据
  request('/admin/sub', 'post', {'role': ''}).then(res => {
    roleData.value = res.data
  })
  //获取单位树
  request('/admin/sub', 'post', {'unit': ''}).then(res => {
    unitData.value = processTreeData(res.data)
  })
}

const onOk = () => {
  if (formRef.value) {
    formRef.value
        .validateFields()
        .then(values => {
          confirmLoading.value = true
          //判断添加或者修改
          let url = '/admin/user';
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

// 处理数据，根据 is_unit 设置 disabled 属性
const processTreeData = (data: any[]): any[] => {
  return data.map(item => ({
    ...item,
    disabled: item.is_unit !== 1, // 根据 is_unit 属性设置禁用状态
    children: item.children ? processTreeData(item.children) : []
  }));
};

</script>

<style scoped>

</style>