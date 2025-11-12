<template>
  <div class="body-div">
    <div class="heard">
      <a-button type="primary" @click="reload" :icon="h(ReloadOutlined)" style="margin-right: 10px"/>
      <a-button type="primary" @click="add" v-permission="{ operation: 'create', resource: 'role' }">新增</a-button>
    </div>
    <div class="content-div">
      <a-table :dataSource="dataSource" :columns="columns" rowKey="id" :loading="tableLoading" :expandedRowKeys="[1]"
               :pagination="false" :scroll="{ y: 680 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button :disabled="record.id === 1" @click="edit(record)" type="link" size="small"
                      v-permission="{ operation: 'update', resource: 'role' }">修改
            </a-button>
            <a-button :disabled="record.id === 1" @click="del(record)" type="link" size="small"
                      v-permission="{ operation: 'del', resource: 'role' }">删除
            </a-button>
          </template>
        </template>
      </a-table>
    </div>

    <RoleModal v-if="visible" v-model:visible="visible" :type="modalType" :params="modalParams" @reload="reload"/>
  </div>
</template>
<script setup lang="ts">
import {createVNode, h, ref} from "vue";
import {ExclamationCircleOutlined, ReloadOutlined} from "@ant-design/icons-vue";
import {request} from "@/request/request";
import RoleModal from "@/components/role/RoleModal.vue";
import {message, Modal} from "ant-design-vue";

let dataSource = ref<any>([])
let columns = ref<any>([
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
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
  request('/admin/role', 'get').then(res => {
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
      request('/admin/role/' + record.id, 'delete').then(() => {
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
.body-div {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .heard {
    height: 50px;
    width: 100%;
  }

  .content-div {
    height: calc(100% - 50px);
    width: 100%;
  }
}
</style>