<template>
  <el-card style="height: 80px">
    <el-form inline class="form">
      <el-form-item label="角色搜索">
        <el-input
          placeholder="请你输入职位的关键字"
          v-model="keyword"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin: 10px 0" :data="allRole">
      <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        align="center"
        label="职位名称"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column align="center" label="操作" width="280px">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermission(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 添加职位与更新已有的职位： 对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="roleParams.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          placeholder="请你输入职位的名称"
          v-model="roleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 分配职位: 抽屉组件 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
  MenuData,
} from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage, ElTree, FormInstance } from 'element-plus'
const layoutSettingStore = useLayoutSettingStore()
// 当前页码
const pageNo = ref<number>(1)
// 一页展示几条数据
const pageSize = ref<number>(10)
// 职位的总个数
const total = ref<number>(0)
// 搜索职位的关键字
const keyword = ref<string>('')
// 存储全部已有的职位
const allRole = ref<Records>([])
// 控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 获取form组件实例
const form = ref<FormInstance>()
// 获取tree组件实例
const tree = ref<InstanceType<typeof ElTree>>()
// 控制抽屉显示与隐藏
const drawer = ref<boolean>(false)
// 准备一个数组：数组用于存储勾选的节点的ID(四级)
const selectArr = ref<number[]>([])
// 收集新增岗位的数据
const roleParams = reactive<RoleData>({
  roleName: '',
})
// 存储用户权限的数据
const menuArr = ref<MenuList>([])
// 组件挂载完毕
onMounted(() => {
  getHasRole()
})
// 获取职位的请求
const getHasRole = async (pager = 1) => {
  // 修改当前的页码
  pageNo.value = pager
  const result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
const sizeChange = () => {
  getHasRole()
}
// 搜索按钮的回调
const search = () => {
  // 再次根据关键字发请求
  getHasRole()
  keyword.value = ''
}
const reset = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}
// 添加职位按钮的回调
const addRole = () => {
  dialogVisible.value = true
  // 清空数据
  Object.assign(roleParams, {
    roleName: '',
    id: '',
  })
  nextTick(() => {
    form.value?.clearValidate('roleName')
  })
}
// 更新职位的按钮的回调
const updateRole = async (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(roleParams, row)
  nextTick(() => {
    form.value?.clearValidate('roleName')
  })
}
// 校验函数
const validatorRoleName = (rule: any, value: string, cb: any) => {
  if (value.trim().length >= 2) {
    cb()
  } else {
    cb(new Error('职位名称至少两位'))
  }
}
// 职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}
// 确定按钮的回调
const save = async () => {
  // 表单校验的结构，结果通过才能发请求
  await form.value?.validate()
  // 添加职位 | 更新职位
  const result: any = await reqAddOrUpdateRole(roleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: roleParams.id ? '更新成功' : '添加成功',
    })
    dialogVisible.value = false
    getHasRole(roleParams.id ? pageNo.value : 1)
  }
}
// 分配权限按钮的回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  selectArr.value = []
  // 收集当前要分配权的限职位的数据
  Object.assign(roleParams, row)
  // 根据职位获取权限的数据
  const result: MenuResponseData = await reqAllMenuList(roleParams.id as number)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
// 树形控件
const defaultProps = {
  children: 'children',
  label: 'name',
}
const filterSelectArr = (allData: MenuList, initArr: number[]) => {
  allData.forEach((item: MenuData) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
// 抽屉确定按钮的回调
const handler = async () => {
  // 职位的id
  const roleId: number = roleParams.id as number
  // 选中节点的id
  const arr = tree.value?.getCheckedKeys()
  // 半选的ID
  const arr1 = tree.value?.getHalfCheckedKeys()
  const permissionId = arr?.concat(arr1 as number[])
  // 下发权限
  const result: any = await reqSetPermission(roleId, permissionId as number[])
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配权限成功',
    })
    drawer.value = false
    // 页面刷新
    window.location.reload()
  }
}
// 删除已有的职位
const removeRole = async (roleId: number) => {
  const result: any = await reqRemoveRole(roleId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
