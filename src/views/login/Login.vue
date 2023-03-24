<template>
  <div id="login-view">
    <div class="login-card">
      <div class="login-title">管理员登录</div>
      <el-form ref="formRef" :model="form" :rules="rules" status-icon class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model.lazy.trim="form.username"
            prefix-icon="i-ep-user"
            placeholder="用户名"
            @keyup.enter="login"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model.lazy.trim="form.password"
            prefix-icon="i-ep-lock"
            placeholder="密码"
            show-password
            @keyup.enter="login"
          />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store';
import { routeNames } from '@/router';
import type { UserLogin } from '@/model';
import type { FormInstance, FormRules } from 'element-plus';

const form = reactive<UserLogin>({ username: 'yinzsw', password: '1234567' });
const rules: FormRules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
};
const formRef = $ref<FormInstance>();
const userStore = useUserStore();
const router = useRouter();

const login = () => {
  formRef!.validate(async (isValid) => {
    if (isValid) {
      await userStore.userLogin(form);
      await router.push({ name: routeNames.layout });
    }
  });
};
</script>

<style lang="scss" scoped>
#login-view {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: url('http://file.yinzsw.top/avatar/6019e.55efef5901c13b31aeb3c93b4d92b382.jpg') no-repeat;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(12px);
  }

  .login-card {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 360px;
    padding: 170px 60px 180px;
    opacity: 0.97;
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-lighter);
    transition: all 0.5s;

    .login-title {
      color: var(--el-text-color-primary);
      font-weight: bold;
      font-size: 1.6rem;
      line-height: 1.5em;
    }

    .login-form {
      margin-top: 2em;
    }

    button {
      margin-top: 1rem;
      width: 100%;
    }
  }
}
</style>
