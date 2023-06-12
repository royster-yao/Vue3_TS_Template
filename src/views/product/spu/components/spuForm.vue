<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTrademark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请你输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <!-- 
        v-model:file-list 展示默认图片
        action: 上传图片的接口地址
        list-type: 文件列表类型
      -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select>
        <el-option label="华为"></el-option>
        <el-option label="oppo"></el-option>
        <el-option label="vivo"></el-option>
      </el-select>
      <el-button style="margin-left: 10px" type="primary" icon="Plus">
        添加销售属性
      </el-button>
      <!-- 展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名"
          prop="saleAttrName"
          width="120px"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template #default="{ row }">
            <el-tag
              style="margin: 0 5px"
              v-for="item in row.spuSaleAttrValueList"
              :key="item.id"
              class="mx-1"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-button type="primary" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #default="{ $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu'
import {
  AllTradeMark,
  HasSaleAttrResponseData,
  SaleAttr,
  SaleAttrResponseData,
  SpuData,
  SpuHasImg,
  SpuImage,
  Trademark,
  HasSaleAttr,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const emit = defineEmits(['changeScene'])
// 点击取消按钮：通知父组件切换场景位1，展示已有的SPU数据
const cancel = () => {
  emit('changeScene', 0)
}

// 存储已有的SPU这些数据
const AllTrademark = ref<Trademark[]>()
// 商品的图片
const imgList = ref<SpuImage[]>([])
// 已有的SPU销售属性
const saleAttr = ref<SaleAttr[]>([])
// 全部的销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
// 控制对话框二点显示与隐藏效果
const dialogVisible = ref<boolean>(false)
// 存储已有的SPU对象
// 存储预览图片的URL地址
const dialogImageUrl = ref<string>('')
const SpuParams = ref<SpuData>({
  category3Id: '', //三级分类的ID
  spuName: '', // SPU 名字
  description: '', // SPU 描述
  tmId: '', // 品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})

const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象,将来在模板中展示
  SpuParams.value = spu
  // spu 即为父组件传递过来的已有的SPU对象（不完整）
  // 获取全部的品牌是数据
  const res: AllTradeMark = await reqAllTradeMark()
  // 获取某一个品牌旗下的售卖商品的图片
  const res1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取已有的SPU销售的数据
  const res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取整个项目全部SPU的销售属性
  const res3: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储全部品牌的数据
  AllTrademark.value = res.data
  // spu全部的商品图片
  imgList.value = res1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存储已有的SPU销售属性
  saleAttr.value = res2.data
  // 存储全部的销售属性
  allSaleAttr.value = res3.data
}

// 照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  // 对话框弹出来
  dialogVisible.value = true
}
// 照片墙删除文件的钩子
const handleRemove = () => {
  console.log(123)
}
// 照片墙上传成功之前的钩子，可以约束文件的大小与类型
const handleUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件必须小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件务必是png|jpg|gif',
    })
    return false
  }
}
defineExpose({ initHasSpuData })
</script>

<style scoped lang="scss"></style>
