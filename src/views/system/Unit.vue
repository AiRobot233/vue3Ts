<template>
  <div class="body-div">
    <div class="heard">
      <a-button type="primary" @click="add">新增</a-button>
      <a-button type="primary" @click="reload" :icon="h(ReloadOutlined)" style="margin-left: 10px" :pagination="false"/>
    </div>
    <div class="content-div">
      <a-table :dataSource="dataSource" :columns="columns" rowKey="id" :loading="tableLoading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button @click="addChildren(record)" type="link" size="small">创建子单位</a-button>
            <a-button @click="edit(record)" type="link" size="small">修改</a-button>
            <a-button :disabled="record.children !== null" @click="del(record)" type="link" size="small">
              删除
            </a-button>
          </template>
        </template>
      </a-table>
    </div>

    <UnitModal v-if="visible" v-model:visible="visible" :type="modalType" :params="modalParams" @reload="reload"/>
  </div>
</template>
<script setup lang="ts">
import {createVNode, h, ref} from "vue";
import {ExclamationCircleOutlined, ReloadOutlined} from "@ant-design/icons-vue";
import {request} from "@/request/request";
import {message, Modal} from "ant-design-vue";
import DictionaryModal from "@/components/dictionary/DictionaryModal.vue";
import UnitModal from "@/components/unit/UnitModal.vue";

let dataSource = ref<any>([])
let columns = ref<any>([
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  {
    title: '排序值',
    dataIndex: 'sort',
    key: 'sort',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
  },
])
let tableLoading = ref<boolean>(false)
let visible = ref<boolean>(false)
let modalType = ref<string>('add')
let modalParams = ref<any>({})

getData()

function getData() {
  tableLoading.value = true
  request('/admin/unit', 'get').then(res => {
    dataSource.value = res.data
    tableLoading.value = false
  })
}

//新增
const add = () => {
  modalType.value = 'add'
  modalParams.value = {}
  visible.value = true
}

const addChildren = (record: any) => {
  modalType.value = 'add'
  modalParams.value = {}
  modalParams.value.pid = record.id
  visible.value = true
}

//编辑
const edit = (record: any) => {
  modalType.value = 'edit'
  modalParams.value = record
  visible.value = true
}

//删除
const del = (record: any) => {
  Modal.confirm({
    title: '确认删除该条信息吗？',
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      request('/admin/unit/' + record.id, 'delete').then(() => {
        message.success('删除成功')
        reload()
      })
    },
  });
}

//刷新
const reload = () => {
  getData()
}


</script>

<style scoped>

</style>