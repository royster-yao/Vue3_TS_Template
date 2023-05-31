<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到我的网站</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              show-password
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
const useStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 获取el-form组件
const loginForms = ref()
// 收集账号与密码的数据
const loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})

let loading = ref(false)

// 登录按钮的回调
const login = async () => {
  // 保证全部表单项校验全部通过再发请求
  await loginForms.value.validate()
  // 点击登录按钮
  // 通知仓库发登录请求
  // 请求成功 => 首页展示数据的地方
  // 请求失败 => 弹出登录失败的信息
  loading.value = true
  try {
    // 保证登录成功
    await useStore.userLogin(loginForm)
    // 编程式导航跳转到展示数据首页
    // 判断登录的时候，路由的路径当中是否有query参数,如果有就往query参数跳转，没有就跳转首页
    const redirect: any = route.query.redirect
    router.push({ path: redirect || '/' })
    // 登录成功的提示信息
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `HI,${getTime()}好!`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    // 登录失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定义检验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  // rule：即为数组的检验规则对象
  // value：即为表单元素文本内容
  // callback:函数：如果符合callback放行通过即为
  // 如果不符合条件callback方法，注入错误提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少六位'))
  }
}

// 表单校验需要的配置对象
const rules = {
  username: [{ trigger: 'change', validator: validatorUserName }],
  password: [{ trigger: 'change', validator: validatorPassword }],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login-form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: #fff;
      font-size: 40px;
    }
    h2 {
      font-size: 20px;
      color: #fff;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
