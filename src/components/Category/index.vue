<template>
  <el-card>
    <el-form inline>
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryStore.c1Id"
          @change="handler"
          :disabled="scene == 0 ? false : true"
        >
          <!-- option: label即为显示的文字，value属性即为select下拉菜单手机的数据 -->
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryStore.c2Id"
          @change="handler1"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryStore.c3Id"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import usecategoryStore from '@/store/modules/category'
import { onMounted } from 'vue'
// 接受父组件传递过来的scene
defineProps({
  scene: {
    type: Number,
    required: true,
  },
})

// 分类全局组件挂载完毕，通知仓库发请求获取一级分类的数据
const categoryStore = usecategoryStore()
onMounted(() => {
  getC1()
})

// 通知仓库获取一次分类的方法
const getC1 = () => {
  // 通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}

// 此方法即为一级分类菜单的 change 事件(选中值的时候会触发，保证一级分类 ID 有了)
const handler = () => {
  // 需要将二级、三级分类数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  // 通知仓库获取二级分类数据
  categoryStore.getC2()
}
// 此方法即为二级分类菜单的 change 事件(选中值的时候会触发，保证二级分类 ID 有了)
const handler1 = () => {
  categoryStore.c3Id = ''
  // 通知仓库获取二级分类数据
  categoryStore.getC3()
}
</script>

<style scoped lang="scss"></style>
