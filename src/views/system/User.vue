<template>
  <div class="body-div">
    <div class="heard">
      <a-button type="primary" @click="add">新增</a-button>
      <a-button type="primary" @click="reload" :icon="h(ReloadOutlined)" style="margin-left: 10px"/>

      <div class="search">
        <a-tree-select
            v-model:value="search.role_id"
            show-search
            placeholder="请选择角色组搜索"
            allow-clear
            :fieldNames="{children:'children', label:'name', key:'id', value: 'id'}"
            :tree-data="roleData"
            @change="searchEvent"
            style="width: 180px"
        />
        <a-input-search v-model:value="search.keyword" style="width:250px;margin-left: 10px" placeholder="名称/电话搜索"
                        enter-button @search="searchEvent"/>
      </div>
    </div>
    <div class="content-div">
      <a-table
          :columns="columns"
          row-key="id"
          :data-source="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button :disabled="record.id === 1" @click="edit(record)" type="link" size="small">修改</a-button>
            <a-button :disabled="record.id === 1" @click="del(record)" type="link" size="small">删除</a-button>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag color="success" v-if="record.status === 1">正常</a-tag>
            <a-tag color="error" v-else>禁用</a-tag>
          </template>
        </template>
      </a-table>
    </div>

    <UserModal v-if="visible" :visible="visible" :type="modalType" :params="modalParams" @cancel="cancel"/>
  </div>
</template>
<script setup lang="ts">
import {computed, createVNode, h, ref} from "vue";
import {ExclamationCircleOutlined, ReloadOutlined} from "@ant-design/icons-vue";
import {request} from "@/request/request";
import {PaginationService} from "@/utils/pagination";
import UserModal from "@/components/user/UserModal.vue";
import {message, Modal} from "ant-design-vue";

const columns = ref([
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
  },
  {
    title: '所属角色',
    dataIndex: ['role', 'name'],
    key: 'role',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: {customRender: 'status'},
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'},
    align: 'center',
  },
])

let roleData = ref([])
let search = ref({role_id: undefined, keyword: ''})

getData()

function getData() {
  request('/admin/sub', 'post', {'role': ''}).then(res => {
    roleData.value = res.data
  })
}

const queryData = (params: any) => {
  return request('/admin/user', 'get', {params})
}

let visible = ref<boolean>(false)
let modalType = ref<string>('add')
let modalParams = ref<any>({})

const add = () => {
  modalType.value = 'add'
  modalParams.value = {}
  visible.value = true
}

const edit = (record: any) => {
  modalType.value = 'edit'
  modalParams.value = record
  visible.value = true
}

const del = (record: any) => {
  Modal.confirm({
    title: '确认删除该条信息吗？',
    icon: createVNode(ExclamationCircleOutlined),
    onOk() {
      request('/admin/user/' + record.id, 'delete').then(() => {
        message.success('删除成功')
        reload()
      })
    },
  });
}

//关闭弹窗
const cancel = () => {
  visible.value = false
  reload()
}

const reload = () => {
  paginationService.run({pageSize: 10, page: 1, ...search.value})
}

//分页
const paginationService = new PaginationService(queryData)
const dataSource = computed(() => {
  return paginationService.getDataSource()
})
const pagination = computed(() => {
  return paginationService.getPagination()
})
const loading = paginationService.loading

const handleTableChange: any['onChange'] = (
    pag: { pageSize: number; current: number },
    filters: any,
    sorter: any,
) => {
  paginationService.run({
    pageSize: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
  });
};

//搜索
const searchEvent = () => {
  paginationService.run({pageSize: 10, page: 1, ...search.value})
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
    display: flex;
  }

  .content-div {
    height: calc(100% - 50px);
    width: 100%;
  }
}

.search {
  margin-left: auto;
}
</style>