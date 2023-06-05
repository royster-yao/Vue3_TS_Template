<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select>
        <el-option label="华为"></el-option>
        <el-option label="oppo"></el-option>
        <el-option label="vivo"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入SPU描述"></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="fileList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
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
      <el-table border style="margin: 10px 0">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="销售属性名" width="120px"></el-table-column>
        <el-table-column label="销售属性值"></el-table-column>
        <el-table-column label="操作" width="100px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
const emit = defineEmits(['changeScene'])
// 点击取消按钮：通知父组件切换场景位1，展示已有的SPU数据
const cancel = () => {
  emit('changeScene', 0)
}
</script>

<style scoped lang="scss"></style>
