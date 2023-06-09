<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <!-- 展示已有的SPU数据 -->
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="80px"
          ></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column
            prop="description"
            show-overflow-tooltip
            label="SPU描述"
          ></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                type="primary"
                icon="Plus"
                size="small"
                title="添加SKU"
              ></el-button>
              <el-button
                type="warning"
                icon="Edit"
                size="small"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="View"
                size="small"
                title="查看SKU列表"
              ></el-button>
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                title="删除SPU"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->, sizes, total,"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加spu|修改spu子组件 -->
      <spu-form
        ref="SpuFormInstance"
        v-show="scene === 1"
        @changeScene="changeScene"
      ></spu-form>
      <!-- 添加spu|修改spu子组件 -->
      <sku-form v-show="scene === 2"></sku-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import usecategoryStore from '@/store/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
} from '@/api/product/spu/type'
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'
const categoryStore = usecategoryStore()

// 展示场景数据
const scene = ref<number>(0) // 0 显示已有的SPU 1 添加或者修改已有的SPU 2 添加SKU的结构
// 分页器默认页码
const pageNo = ref<number>(1)
// 每一页展示几天数据
const pageSize = ref<number>(3)
// 存储已有的SPU总个数
const total = ref<number>(0)
// 存储已有的SPU数据
const records = ref<Records>([])

// 获取子组件实例SpuForm
const SpuFormInstance = ref<any>()

// 监听三级分类Id变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 务必有三级分类ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 此方法执行：可以获取某一个三级分类下全部的已有的Spu
const getHasSpu = async (pager = 1) => {
  // 修改当前的页码
  pageNo.value = pager
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 分页器下拉菜单发送变化的时候触发
const changeSize = () => {
  getHasSpu()
}

// 添加新的SPU按钮的回调
const addSpu = () => {
  // 切换为场景1：添加与修改已有SPU的机构
  scene.value = 1
}

// 子组件SPUForm绑定的自定义事件： 目前是让子组件通知父组件切换场景位0
const changeScene = (num: number) => {
  // 子组件SPUform点击取消变为场景0，展示已有的SPU
  scene.value = num
}
// 修改已有的SPU按钮的回调
const updateSpu = (row: SpuData) => {
  // 切换为场景1：添加与修改已有SPU的结构 -> SpuForm
  scene.value = 1
  // 调用子组件实例的方法获取完整的已有的 SPU 数据
  SpuFormInstance.value.initHasSpuData(row)
}
</script>

<style scoped lang="scss"></style>
