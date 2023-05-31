<template>
  <el-card class="box-card">
    <!-- 卡片顶部的添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <!-- 表格组件：用于展示已有品牌数据 -->
    <el-table :data="trademarkArr" style="margin: 10px 0" border>
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column label="品牌LOGO">
        <template #default="{ row }">
          <img style="width: 100px; height: 100px" :src="row.logoUrl" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.tmName}?`"
            width="250px"
            icon="Delete"
            @confirm="removeTrademark(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      pager-count="5"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasTrandemark"
      @size-change="sizeChage"
    />
  </el-card>
  <!-- 对话框组件：在添加品牌与修改已有品牌业务的时候 -->
  <!-- v-model：控制对话框显示与隐藏 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label-width="100px" label="品牌名称" prop="tmName">
        <el-input
          placeholder="请您输入品牌的名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label-width="100px" label="品牌LOGO" prop="logoUrl">
        <!-- upload组件属性:
              action: 图片上传路径，记得加上 /api
        -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽 -->
    <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark/index'
import type {
  Records,
  TrademarkResponseData,
  Trademark,
} from '@/api/product/trademark/type'
import { ElMessage, UploadProps } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 当前展示数据的条数
let limit = ref<number>(3)
// 存储已有品牌数据的总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 控制对话框显示与隐藏
const dialogFormVisible = ref<boolean>(false)
// 定义一个新增品牌数据
const trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})

// 获取已有品牌的接口,封装为一个函数
const getHasTrandemark = async (pager = 1) => {
  // 当前页码
  pageNo.value = pager
  let result: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
// 组件挂在完毕发一次请求，获取第一页、一页三个已有品牌的数据
onMounted(() => {
  getHasTrandemark()
})

// 分页器当前页码发生变化的时候会触发
// 对于当前页码发生变化自定义时间，组件pagination父组件回传了数据(当前的页码)
// const changePageNo = () => {
//   // 当前页码发生变化的时候再次发请求获取对应的已有品牌的数据
//   getHasTrandemark()
// }

// 当下拉菜单发生变化的时候触发
// 这个自定义事件，分页器组件会将下拉菜单选中的数据返回
const sizeChage = () => {
  // 当前每一页的数据发生变化的时候，当前的页码归一
  getHasTrandemark()
}

// 添加品牌按钮回调
const addTrademark = () => {
  // 对话框显示
  dialogFormVisible.value = true
  // 收集的数据清空
  trademarkParams.logoUrl = ''
  trademarkParams.tmName = ''
  trademarkParams.id = 0
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })

  // 第一张写法： ts?
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
}

// 修改已有品牌按钮的回调
const updateTrademark = (row: Trademark) => {
  // 清空校验规则错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}
// 对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  // 在你发请求之前要对于整个表单进行校验
  // 调用这个方法进行全部的表单项的校验，如果全部校验提供，在执行后面的语句
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加品牌成功
  if (result.code == 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 再次发请求获取已有的全部的数据
    getHasTrandemark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    dialogFormVisible.value = false
  }
}
// 上传图标组件 -> 上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在图片上传成功之前触发，上传文件之前可以约束文件的类型与大小
  // 上传的文件格式 png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小应小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件格式不正确，文件必须是png、jpg、gif',
    })
    return false
  }
}
// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response, // 当前这次上传图片post请求服务器返回的数据
) => {
  // 收集上传图片的地址，添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  // 图片上传成功清楚掉对于图片校验的结构
  formRef.value.clearValidate('logoUrl')
}

// 获取el-form组件实例
const formRef = ref()

//品牌校验自定义规则方法
const validatorTmName = (rule: any, value: string, callback: any) => {
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称位数大于等于两位'))
  }
}
// 品牌logo图片的自定义规则方法
const validatorLogoUrl = (rule: any, value: string, callback: any) => {
  // 如果图片上传
  if (value) {
    callback()
  } else {
    callback(new Error('LOGO图片必须上传'))
  }
}

// 表单规则校验对象
const rules = {
  tmName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

// 气泡确认框确定按钮的回调
const removeTrademark = async (id: number) => {
  // 点击确定按钮，删除该品牌的请求
  const result: any = await reqDeleteTrademark(id)
  if (result.code === 200) {
    // 删除成功的提示信息
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 再次获取已有的品牌数据
    getHasTrandemark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
