<template>
  <div>
    <a-modal
        v-model:open="visible"
        :title="title"
        @ok="onOk"
        @cancel="cancel"
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
        <a-form-item name="value" label="值" :rules="[{ required: true, message: '请输入值' }]">
          <a-input v-model:value="formState.value" placeholder="请输入值"/>
        </a-form-item>
        <a-form-item name="sort" label="排序" :rules="[{ required: true, message: '请输入排序值' }]">
          <a-input-number id="inputNumber" v-model:value="formState.sort" :min="0" :max="255"
                          placeholder="请输入排序值" style="width: 100%"/>
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

const emit = defineEmits(['cancel']);

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

let treeData = ref<any>([])
const formRef = ref<FormInstance>();
let visible = ref<boolean>(props.visible);
let title = ref<string>('新增')
let confirmLoading = ref<boolean>(false)
let formState = reactive<any>({
  pid: props.params?.pid !== undefined ? props.params.pid : 0,
  name: props.params?.name ? props.params.name : '',
  value: props.params?.value ? props.params.value : '',
  sort: props.params?.sort ? props.params.sort : 0,
});

getData()

function getData() {
  props.params?.id ? title.value = '修改' : title.value = '新增'
  //获取上级下拉数据
  request('/admin/sub', 'post', {'dictionary': ''}).then(res => {
    treeData.value = [{id: 0, name: '顶级', children: res.data}]
  })
}

const onOk = () => {
  if (formRef.value) {
    formRef.value
        .validateFields()
        .then(values => {
          //兼容选择
          values.rule = values.rule.checked ? values.rule.checked.join(',') : values.rule.join(',')

          confirmLoading.value = true
          //判断添加或者修改
          let url = '/admin/dictionary';
          let method = 'post';
          if (props.params?.id) {
            url = url + '/' + props.params?.id;
            method = 'put'
          }
          request(url, method, values).then(() => {
            message.success('操作成功')
            cancel()
            confirmLoading.value = false
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

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>

</style>