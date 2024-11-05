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
              :treeData="treeData"
              :fieldNames="{children:'children', label:'name', key:'id', value: 'id'}"
          />
        </a-form-item>
        <a-form-item name="name" label="名称" :rules="[{ required: true, message: '请输入名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入名称"/>
        </a-form-item>
        <a-form-item name="type" label="类型" :rules="[{ required: false}]">
          <a-select v-model:value="formState.type" :options="options" placeholder="请输入类型" allow-clear/>
        </a-form-item>
        <a-form-item name="is_unit" label="是否是单位" :rules="[{ required: true, message: '请选择是否是单位' }]">
          <a-radio-group v-model:value="formState.is_unit" name="radioGroup">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="2">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
            v-if="formState.is_unit === 1"
            name="check_org"
            label="管辖单位"
            :rules="[{ required: true, message: '请选择管辖单位', trigger: 'change' }]"
        >
          <a-tree-select
              treeNodeFilterProp="name"
              v-model:value="formState.check_org"
              show-search
              placeholder="请选择管辖单位"
              allow-clear
              :treeData="treeData"
              :fieldNames="{children:'children', label:'name', key:'id', value: 'id'}"
          />
        </a-form-item>
        <a-form-item name="sort" label="排序" :rules="[{ required: true, message: '请输入排序值' }]">
          <a-input-number v-model:value="formState.sort"/>
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

let treeData = ref<any>([])
const formRef = ref<FormInstance>();
let title = ref<string>('新增')
let confirmLoading = ref<boolean>(false)
let formState = reactive<any>({
  pid: props.params?.pid !== undefined ? props.params.pid : 0,
  name: props.params?.name ? props.params.name : '',
  type: props.params?.type ? props.params.type : undefined,
  is_unit: props.params?.is_unit ? props.params.is_unit : 1,
  sort: props.params?.sort ? props.params.sort : 0,
  check_org: props.params?.check_org ? props.params.check_org : 0,
});
let options = ref<any>([])

getData()

function getData() {
  props.params?.id ? title.value = '修改' : title.value = '新增'
  //获取上级下拉数据
  request('/admin/sub', 'post', {'unit': ''}).then(res => {
    treeData.value = [{id: 0, value: '顶级', children: res.data}]
  })
  //获取字典数据
  request('/admin/sub', 'post', {'dictionary': '单位类型'}).then(res => {
    options.value = res.data
  })
}

const onOk = () => {
  if (formRef.value) {
    formRef.value
        .validateFields()
        .then(values => {
          //兼容选择
          confirmLoading.value = true
          //判断添加或者修改
          let url = '/admin/unit';
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