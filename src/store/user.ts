import { login, refresh } from '@/server';
import { backToLogin } from '@/router';
import type { UserInfo, UserLogin } from '@/model';

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo>({} as UserInfo);

    const userLogin = async (userLogin: UserLogin) => (userInfo.value = await login(userLogin));
    const userLogout = async () => {
      userInfo.value = <UserInfo>{};
      await backToLogin();
    };
    const userTokenRefresh = async () => (userInfo.value.token = await refresh());
    const getBearerToken = (isRefresh: boolean) => {
      const token = userInfo.value?.token;
      return `Bearer ${isRefresh ? token?.refreshToken : token?.accessToken}`;
    };

    return { userInfo, userLogin, userLogout, userTokenRefresh, getBearerToken };
  },
  { persist: true }
);
