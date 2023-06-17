<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input
        type="number"
        placeholder="价格（元）"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量（克）">
      <el-input placeholder="重量（克）" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline>
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="图片">
          <template #default="{ row }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">确定</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import {
  AttrList,
  AttrResponseData,
  Attr as attrAttr,
} from '@/api/product/attr/type'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu/'
import {
  SaleAttr,
  SaleAttrResponseData,
  SkuData,
  SpuHasImg,
  SpuImage,
  Attr as skuAttr,
  saleArr as SaleArrType,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
const emit = defineEmits(['changeScene'])

// 平台属性
const attrArr = ref<AttrList>([])
// 销售属性
const saleArr = ref<SaleAttr[]>([])
// 照片墙的数据
const imgArr = ref<SpuImage[]>([])
// 获取table组件实例
const table = ref<any>()
// 收集SKU的参数
const skuParams = reactive<SkuData>({
  // 父组件传递过来的数据
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  // v-model收集
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
})

// 取消按钮的回调
const cancel = () => {
  emit('changeScene', { flag: 0, params: '' })
}
// 当前子组件的方法对外暴漏
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  const res: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  const res1: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  // 获取照片墙的数据
  const res2: SpuHasImg = await reqSpuImageList(spu.id)
  // 平台属性
  attrArr.value = res.data
  // 销售属性
  saleArr.value = res1.data
  imgArr.value = res2.data
}
// 设置默认图片的方法回调
const handler = (row: SpuImage) => {
  // 先全部不勾选
  imgArr.value.forEach((item: SpuImage) => {
    table.value.toggleRowSelection(item, false)
  })
  // 复选框选中,选中的图片才勾选
  table.value.toggleRowSelection(row, true)
  // 收集图片的地址
  skuParams.skuDefaultImg = row.imgUrl as string
}
// 保存按钮的方法
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce(
    (prev: skuAttr[], next: attrAttr) => {
      if (next.attrIdAndValueId) {
        const [attrId, valueId] = next.attrIdAndValueId.split(':')
        prev.push({
          attrId,
          valueId,
        })
      }
      return prev
    },
    [] as skuAttr[],
  )
  // 销售属性的数据
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: SaleArrType[], next: SaleAttr) => {
      if (next.saleIdAndValueId) {
        const [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({
          saleAttrId,
          saleAttrValueId,
        })
      }
      return prev
    },
    [] as SaleArrType[],
  )
  // 发请求
  const result: any = await reqAddSku(skuParams)
  // 成功
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    // 通知父组件切换场景为0
    emit('changeScene', { flag: 0, params: '' })
  } else {
    // 失败
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}
// 对外暴露的方法
defineExpose({ initSkuData })
</script>

<style scoped lang="scss"></style>
