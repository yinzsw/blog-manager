import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useUserStore } from '@/store/user';
import { backToLogin } from '@/router';

export interface CommonResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface RequestParamConfig {
  url: string;
  params?: unknown;
}

export interface RequestBodyConfig {
  url: string;
  params?: unknown;
  data?: unknown;
}

const isRefreshUrl = ({ method = 'GET', url = '/' }: InternalAxiosRequestConfig) =>
  'put' === method.toLowerCase() && ['auth', '/auth'].includes(url.toLowerCase());

/**
 * 请求拦截
 * @param config 配置
 */
const requestConfigCallback = (config: InternalAxiosRequestConfig) => {
  //设置 BearerToken
  const bearerToken = useUserStore().getBearerToken(isRefreshUrl(config));
  config.headers.setAuthorization(bearerToken);
  return config;
};

/**
 * 响应拦截
 * @param error 错误信息
 */
const responseErrorCallback = async (error: AxiosError) => {
  const data = error.response?.data as CommonResponse<unknown>;
  const config = error.config as InternalAxiosRequestConfig;

  switch (data.code) {
    case 31000: {
      ElMessage.error(data.msg);
      await backToLogin();
      throw data;
    }
    case 32000: {
      if (isRefreshUrl(config)) {
        ElMessage.error(data.msg);
        await backToLogin();
        throw data;
      }
      await useUserStore().userTokenRefresh();
      return axiosInstance(config);
    }
    case 40000: {
      ElMessage.error(data.msg);
      throw data;
    }
  }
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});
axiosInstance.interceptors.request.use(requestConfigCallback, (error) => Promise.reject(error));
axiosInstance.interceptors.response.use((response) => response.data.data, responseErrorCallback);

export class Requests {
  static request<T>(cfg: AxiosRequestConfig) {
    return axiosInstance<unknown, T, unknown>(cfg);
  }

  static get<T>(cfg: RequestParamConfig) {
    cfg.url = encodeURI(cfg.url);
    return Requests.request<T>({ method: 'GET', ...cfg });
  }

  static post<T>(cfg: RequestBodyConfig) {
    return Requests.request<T>({ method: 'POST', ...cfg });
  }

  static put<T>(cfg: RequestBodyConfig) {
    return Requests.request<T>({ method: 'PUT', ...cfg });
  }

  static patch<T>(cfg: RequestBodyConfig) {
    return Requests.request<T>({ method: 'PATCH', ...cfg });
  }

  static delete<T>(cfg: RequestParamConfig) {
    return Requests.request<T>({ method: 'DELETE', ...cfg });
  }
}
