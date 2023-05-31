<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="120px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #default="{ row }">
              <!-- 修改已有属性的按钮 -->
              <el-button
                @click="updateAttr(row)"
                type="primary"
                size="small"
                icon="Edit"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性 -->
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input
              v-model="attrParams.attrName"
              placeholder="请你输入属性的名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          icon="Plus"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table
          style="margin: 10px 0"
          border
          :data="attrParams.attrValueList"
        >
          <el-table-column
            width="80px"
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <el-input
                :ref="(vc: any) => inputArr[$index] = vc"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                v-model="row.valueName"
                placeholder="请你输入属性值名称"
              ></el-input>
              <div @click="toEdit(row, $index)" v-else>{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ index }">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click="attrParams.attrValueList.splice(index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
          @click="save"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import usecategoryStore from '@/store/modules/category'
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '@/api/product/attr/index'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

const categoryStore = usecategoryStore()
// 定义card组件内容与属性值
const scene = ref<number>(0) // scene=0 显示table,scene=1，展示添加与修改属性结构
// 存储已有的属性和属性值
const attrArr = ref<Attr[]>([])

// 准备一个数组：将来存储对应的组件实例 el-input 实现聚焦
const inputArr = ref<any>([])
// 收集新增的属性的数据
const attrParams = reactive<Attr>({
  attrName: '', // 新增的属性名字
  attrValueList: [], // 新增的属性值数组
  categoryId: '', // 三级分类的 id
  categoryLevel: 3, // 代表三级分类
})

watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类的有才能发请求
    if (!categoryStore.c3Id) return
    getAttr()
  },
)
// 获取已有的属性和属性值方法
const getAttr = async () => {
  // 获取分类的id
  const { c1Id, c2Id, c3Id } = categoryStore
  const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}
// 添加属性按钮的回调
const addAttr = () => {
  // 每一次点击的是时候先将数据清空
  Object.assign(attrParams, {
    attrName: '', // 新增的属性名字
    attrValueList: [], // 新增的属性值数组
    categoryId: categoryStore.c3Id, // 三级分类的 id
    categoryLevel: 3, // 代表三级分类
  })
  // 切换为添加与修改属性结构
  scene.value = 1
}
// table表格修改已有属性按钮回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性值对象赋值给 attrparams对象
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 取消按钮的回调
const cancel = () => {
  scene.value = 0
}
// 添加属性值按钮回调
const addAttrValue = () => {
  // 点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制每一个属性值编辑模式与切换模式的切换
  })
  // 获取最后的 el-input组件
  nextTick(() => {
    inputArr.value.at(-1).focus()
  })
}

// 保存按钮的回调
const save = async () => {
  // 发请求
  const result: any = await reqAddOrUpdateAttr(attrParams)
  // 添加属性 | 修改已有已有属性属性已经成功
  if (result.code === 200) {
    // 切换成功
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    // 获取全部的属性和属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 属性值表单元素失去焦点的回调
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断1
  if (row.valueName.trim() == '') {
    // 删除掉对应元素为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 非法情况判断2
  const repeat = attrParams.attrValueList.find((item) => {
    // 切记把当前失去焦点属性值对象从当前数组扣除判断
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    // 将重复的属性值从数组中删除
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  // 相应的属性值对象 flag 变为 false,展示div
  row.flag = false
}

// 属性值 div 点击事件
const toEdit = (row: AttrValue, $index: number) => {
  // 相应的属性值对象 flag 变为 true,展示 input
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  const result: any = await reqRemoveAttr(attrId)
  // 删除成功
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁的时候，把仓库当中的分类相关的数据清空
onBeforeUnmount(() => {
  // 清空分类仓库的数据
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
