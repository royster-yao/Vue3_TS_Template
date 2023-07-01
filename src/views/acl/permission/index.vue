<template>
  <el-table
    :data="permissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button
          @click="addPermission(row)"
          type="primary"
          size="small"
          :disabled="row.level == 4 ? true : false"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          @click="updatePermission(row)"
          type="primary"
          size="small"
          :disabled="row.level == 1 ? true : false"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`你确定要删除${row.name}吗？`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              size="small"
              :disabled="row.level == 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框：添加或者更新已有的菜单结构 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
    width="30%"
  >
    <!-- 表单组件：收集新增已有的菜单的数据 -->
    <el-form inline>
      <el-form-item label="名称">
        <el-input
          placeholder="请你输入菜单的名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input
          placeholder="请你输入权限值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
// 引入获取菜单的API
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
import {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

// 存储菜单的数据
const permissionArr = ref<PermissionList>([])
// 控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 携带的参数
const menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

// 组件挂载完毕
onMounted(() => {
  getHasPermission()
})
// 获取菜单数据的方法
const getHasPermission = async () => {
  const result: PermissionResponseData = await reqAllPermission()
  if (result.code == 200) {
    permissionArr.value = result.data
  }
}
// 添加按钮的回调
const addPermission = (row: Permission) => {
  // 清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  // 收集新增菜单的level数值
  menuData.level = row.level + 1
  // 给谁新增子菜单
  menuData.pid = row.id
}
// 编辑已有的菜单
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  // 点击修改按钮： 收集已有的菜单的数据
  Object.assign(menuData, row)
}
// 确定按钮的回调
const save = async () => {
  const result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    // 再次获取数据
    getHasPermission()
  }
}
// 删除按钮的回调
const removeMenu = async (id: number) => {
  const result = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasPermission()
  }
}
</script>

<style scoped lang="scss"></style>
