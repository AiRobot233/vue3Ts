<template>
  <div class="body-div">
    <div class="heard">
      <a-button type="primary" @click="reload" :icon="h(ReloadOutlined)" style="margin-right: 10px"/>
      <a-button type="primary" @click="add" v-permission="{ operation: 'create', resource: 'system/rule' }">新增</a-button>
    </div>
    <div class="content-div">
      <a-table :dataSource="dataSource" :columns="columns" rowKey="id" :loading="tableLoading" :pagination="false"
               :scroll="{ y: 680 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button @click="addChildren(record)" v-if="record.type === 'page'" type="link" size="small"
                      v-permission="{ operation: 'create', resource: 'system/rule' }">
              创建子规则
            </a-button>
            <a-button :disabled="record.id === 1" @click="edit(record)" type="link" size="small"
                      v-permission="{ operation: 'update', resource: 'system/rule' }">
              修改
            </a-button>
            <a-button :disabled="record.id === 1" @click="del(record)" type="link" size="small"
                      v-permission="{ operation: 'del', resource: 'system/rule' }">
              删除
            </a-button>
          </template>
        </template>
      </a-table>
    </div>

    <RuleModal v-if="visible" v-model:visible="visible" :type="modalType" :params="modalParams" @reload="reload"/>
  </div>
</template>
<script setup lang="ts">
import {createVNode, h, ref} from "vue";
import {request} from "@/request/request";
import {ExclamationCircleOutlined, ReloadOutlined} from "@ant-design/icons-vue";
import RuleModal from "@/components/rule/RuleModal.vue";
import {message, Modal} from "ant-design-vue";

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
    width: 200,
    align: 'center',
  },
  {
    title: '路由',
    dataIndex: 'router',
    key: 'router',
    align: 'center',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: 400,
  },
])
let tableLoading = ref<boolean>(false)
let visible = ref<boolean>(false)
let modalType = ref<string>('add')
let modalParams = ref<any>({})

getData()

function getData() {
  tableLoading.value = true
  request('/admin/rule', 'get').then(res => {
    dataSource.value = res.data
    tableLoading.value = false
  })
}

//新增弹窗
const add = () => {
  modalType.value = 'add'
  modalParams.value = {}
  visible.value = true
}

//创建子级
const addChildren = (record: any) => {
  modalType.value = 'add'
  modalParams.value = {}
  modalParams.value.pid = record.id
  visible.value = true
}

//修改弹窗
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
      request('/admin/rule/' + record.id, 'delete').then(() => {
        message.success('删除成功')
        reload()
      })
    },
  });
}

//刷新表格
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