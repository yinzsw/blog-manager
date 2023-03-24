import { listAccessibleMenus } from '@/server';
import { getLayoutChildRoute } from '@/router';
import type { MenuItem } from '@/model';

export const useMenuStore = defineStore(
  'menu',
  () => {
    const route = useRoute();

    const accessibleMenus = ref<MenuItem[]>([]);
    const isCollapse = ref(false);

    const menuPathMap = computed<Map<string /*uri*/, MenuItem[]>>(() => {
      const menuItemsMap = new Map<string, MenuItem[]>();
      for (const menu of accessibleMenus.value) {
        menu.subMenus === null
          ? menuItemsMap.set(menu.uri, [menu])
          : menu.subMenus.forEach((item) => menuItemsMap.set(item.uri, [menu, item]));
      }
      return menuItemsMap;
    });
    const currentRoutePath = computed(() => route.path);
    const breadcrumbs = computed<MenuItem[]>(() => menuPathMap.value.get(currentRoutePath.value) ?? ([] as MenuItem[]));

    const loadAccessibleMenus = async () => {
      const menuItems = await listAccessibleMenus();
      const addMenuItemUri = (item: MenuItem): MenuItem => {
        item.uri = getLayoutChildRoute(item.name)?.path ?? '/404';
        return item;
      };

      accessibleMenus.value = menuItems.map((item) => {
        if (item.subMenus === null) {
          return addMenuItemUri(item);
        }
        item.subMenus.forEach((item) => addMenuItemUri(item));
        return item;
      });
    };

    return {
      accessibleMenus,
      isCollapse,
      menuPathMap,
      currentRoutePath,
      breadcrumbs,
      loadAccessibleMenus,
    };
  },
  {
    persist: {
      paths: ['isCollapse'],
    },
  }
);
