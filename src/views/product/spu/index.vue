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
                @click="addSku(row)"
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
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    icon="Delete"
                    size="small"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
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
      <sku-form
        ref="skuFormInstance"
        v-show="scene === 2"
        @changeScene="changeScene"
      ></sku-form>
      <!-- dialog对话框，展示已有的SKU的数据 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #default="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import usecategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'
import { ElMessage } from 'element-plus'
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
// 获取子组件实例SkuForm
const skuFormInstance = ref<any>()

// 存储全部的SKU数据
const skuArr = ref<SkuData[]>([])
const show = ref<boolean>(false)
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
  // 点击添加SPU按钮，调用子组件的方法初始化数据
  SpuFormInstance.value.initAddSpu(categoryStore.c3Id)
}

// 子组件SPUForm绑定的自定义事件： 目前是让子组件通知父组件切换场景位0
const changeScene = (obj: any) => {
  // 子组件SPUform点击取消变为场景0，展示已有的SPU
  scene.value = obj.flag
  // 再次获取全部的已有的SPU
  if (obj.params == 'update') {
    // 更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 添加留在第一页
    getHasSpu()
  }
}
// 修改已有的SPU按钮的回调
const updateSpu = (row: SpuData) => {
  // 切换为场景1：添加与修改已有SPU的结构 -> SpuForm
  scene.value = 1
  // 调用子组件实例的方法获取完整的已有的 SPU 数据
  SpuFormInstance.value.initHasSpuData(row)
}

// 添加SKU按钮的回调
const addSku = (row: SpuData) => {
  // 点击添加SKU按钮切换为场景为2
  scene.value = 2
  // 调用子组件的方法初始化添加SKU的数据
  skuFormInstance.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
// 查看SKU列表的数据
const findSku = async (row: SpuData) => {
  const result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    // 显示对话框
    show.value = true
  }
}
// 删除已有的SPU按钮的回调
const deleteSpu = async (row: SpuData) => {
  const result = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取剩余的SPU的数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
// 路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
