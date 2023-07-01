<template>
  <el-card style="height: 80px">
    <el-form inline class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
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
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button
      type="danger"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <!-- 表格展示用户的信息 -->
    <el-table
      style="margin: 10px 0"
      border
      :data="userArr"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="用户名字"
        align="center"
        prop="username"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="用户名称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="用户角色"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="创建时间"
        align="center"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="更新时间"
        align="center"
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.username}?`"
            width="260px"
            @confirm="deleteUser(row.id)"
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
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout=" prev, pager, next, jumper,->, sizes, total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <!-- 抽屉结构:完成添加新的用户账号|更新已有的用户信息 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="userParams.username"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            v-model="userParams.name"
            placeholder="请输入用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            v-model="userParams.password"
            placeholder="请输入用户密码"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构：进行职位分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input disabled v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <!-- 显示职位的复选框 -->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedRolesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
// 默认页码
const pageNo = ref<number>(1)
// 一页展示几条数据
const pageSize = ref<number>(5)
// 用户信息的总条数
const total = ref<number>(0)
// 存储全部用户的数组
const userArr = ref<Records>([])
// 定义响应式数据控制抽屉的显示与隐藏
const drawer = ref<boolean>(false)
// 控制分配角色抽屉的显示与隐藏
const drawer1 = ref<boolean>(false)
// 获取form组件实例
const formRef = ref<FormInstance>()
// 存储全部职位的数据
const allRole = ref<AllRole>([])
//当前用户已有的职位
const userRole = ref<AllRole>([])
// 收集顶部复选框全选的数据
const checkAll = ref<boolean>(false)
// 控制顶部全部复选框不确定的样式
const isIndeterminate = ref<boolean>(true)
// 存储批量删除的用户id
const selectIdArr = ref<User[]>([])
// 收集用户输入的关键字
const keyword = ref<string>('')
// 收集用户信息的响应式数据
const userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  const result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
onMounted(() => {
  getHasUser()
})
// 分页器下来菜单的自定义事件的回调
const handler = () => {
  getHasUser()
}
// 添加用户按钮的回调
const addUser = () => {
  // 显示抽屉
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上次的错误提示信息
  nextTick(() => {
    formRef.value?.clearValidate('username')
    formRef.value?.clearValidate('name')
    formRef.value?.clearValidate('password')
  })
}
// 更新已有的用户
const updateUser = (row: User) => {
  drawer.value = true
  // 存储收集已有的账号信息
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value?.clearValidate('username')
    formRef.value?.clearValidate('name')
    formRef.value?.clearValidate('password')
  })
}
// 保存按钮的回调: 添加或者更新
const save = async () => {
  // 点击保存按钮的时候，必须所以整个表单都检验通过
  await formRef.value?.validate()
  const result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    // 添加或更新成功
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  drawer.value = false
}
// 检验用户名字的回调函数
const validatorUsername = (rule: any, value: string, cb: any) => {
  // 用户的名字|昵称至少五位
  if (value.trim().length >= 5) {
    cb()
  } else {
    cb(new Error('用户的名字至少五位'))
  }
}
// 检验用户名字的回调函数
const validatorName = (rule: any, value: string, cb: any) => {
  // 用户的名字|昵称至少五位
  if (value.trim().length >= 5) {
    cb()
  } else {
    cb(new Error('用户的昵称至少五位'))
  }
}
const validatorPassword = (rule: any, value: string, cb: any) => {
  // 用户的名字|昵称至少五位
  if (value.trim().length >= 6) {
    cb()
  } else {
    cb(new Error('用户的密码至少六位'))
  }
}
// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
// 分配角色按钮的回调
const setRole = async (row: User) => {
  // 存储已有的用户
  Object.assign(userParams, row)
  // 获取全部职位的数据与当前已有的职位的数据
  const result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 存储全部的职位
    allRole.value = result.data.allRolesList
    // 存储用户当前已有的职位
    userRole.value = result.data.assignRoles
    // 分配角色抽屉出来
    drawer1.value = true
  }
}
// 顶部全选框的change事件
const handleCheckAllChange = (val: boolean) => {
  // val: true 全选 false 未全选
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
// 底部复选框的change事件
const handleCheckedRolesChange = (val: string[]) => {
  // 顶部复选框的勾选数据
  checkAll.value = val.length == allRole.value.length
  // 不确定的样式
  isIndeterminate.value = val.length !== allRole.value.length
}
// 确定按钮的回调(分配职位)
const confirmClick = async () => {
  // 收集参数
  const data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 分配用户职位
  const result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配职位成功',
    })
    drawer1.value = false
    // 更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}
// 删除某一个用户
const deleteUser = async (userId: number) => {
  const result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
// table复选框勾选的时候触发的事件
const selectChange = (val: any) => {
  selectIdArr.value = val
}
// 批量删除按钮的回调
const deleteSelectUser = async () => {
  // 整理批量删除的参数
  const idList: number[] = selectIdArr.value.map((item) => {
    return item.id as number
  })
  // 批量删除的请求
  const result: any = await reqSelectUser(idList)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '批量删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
// 搜索按钮的回调
const search = () => {
  // 根据关键字获取相应的用户的数据
  getHasUser()
  // 清空关键字
  keyword.value = ''
}
// 重置按钮的回调
const reset = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
