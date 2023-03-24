import { type RouteRecordName, type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import { forRouteSymbol, routeNames } from './constant';

const routes = [
  {
    path: '/',
    name: routeNames.layout,
    meta: { keepAlive: true, requireAuth: true },
    redirect: '/home',
    component: () => import('@/views/__layout/Layout.vue'),
    children: [
      {
        path: '/home',
        name: routeNames.home,
        meta: { keepAlive: true, requireAuth: true },
        component: () => import('@/views/home/Home.vue'),
      },
      {
        path: '/menu',
        name: routeNames.menu,
        meta: { keepAlive: true, requireAuth: true },
        component: () => import('@/views/menu/Menu.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: routeNames.login,
    meta: { keepAlive: true },
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: routeNames.notFound,
    meta: { keepAlive: true },
    component: () => import('@/views/status/404.vue'),
  },
];

const layoutChildRouteMap = routes
  .filter((item) => item.name === routeNames.layout)
  .flatMap((item) => item.children)
  .reduce(
    (pre, cur) => pre.set(cur?.name as symbol, cur as RouteRecordRaw),
    new Map<RouteRecordName, RouteRecordRaw>()
  );
const getLayoutChildRoute = (key: string) => layoutChildRouteMap.get(forRouteSymbol(key));
const router = createRouter({ routes, history: createWebHistory() });
const backToLogin = () => router.push({ name: routeNames.login });

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});
export { getLayoutChildRoute, router, backToLogin };
