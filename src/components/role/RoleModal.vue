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
        <a-form-item name="name" label="名称" :rules="[{ required: true, message: '请输入名称' }]">
          <a-input v-model:value="formState.name" placeholder="请输入名称"/>
        </a-form-item>
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

        <a-form-item
            name="rule"
            label="规则"
            :rules="[{ required: true, message: '请选择规则', trigger: 'change' }]"
        >
          <a-tree
              v-model:checkedKeys="formState.rule"
              :checkable="true"
              :treeData="ruleData"
              :fieldNames="{children:'children', title:'name', key:'id'}"
              :checkStrictly="true"
          />
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

let treeData = ref([])
let ruleData = ref([])
const formRef = ref<FormInstance>();
let visible = ref<boolean>(props.visible);
let title = ref<string>('新增')
let confirmLoading = ref<boolean>(false)
let formState = reactive<any>({
  name: props.params?.name ? props.params.name : '',
  pid: props.params?.pid ? props.params.pid : undefined,
  rule: props.params?.rule ? props.params.rule.split(",") : undefined,
});

getData()

function getData() {
  props.params?.id ? title.value = '修改' : title.value = '新增'
  //获取上级下拉数据
  request('/admin/sub', 'post', {'role': ''}).then(res => {
    treeData.value = res.data
  })
  //获取规则下拉数据
  request('/admin/sub', 'post', {'rule': ''}).then(res => {
    ruleData.value = res.data
  })

  formState.rule = formState.rule.map(function (item: string) {
    return parseInt(item, 10); // 使用基数10进行解析
  });
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
          let url = '/admin/role';
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