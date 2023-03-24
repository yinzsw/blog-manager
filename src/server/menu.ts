import { Requests } from './__requests';
import type { MenuData, MenuForm, MenuItem } from '@/model/menu';

export function listMenus() {
  return Requests.get<MenuData[]>({ url: `menu` });
}

export function listAccessibleMenus() {
  return Requests.get<MenuItem[]>({ url: `menu/accessible` });
}

export function updateMenuTitle(menuId: number, title: string) {
  return Requests.patch<boolean>({ url: `/menu/${menuId}/title/${title}` });
}

export function updateMenuIcon(menuId: number, iconPath: string) {
  return Requests.patch<boolean>({ url: `/menu/${menuId}/icon`, data: { iconPath } });
}

export function updateMenuHidden(menuId: number, isHidden: boolean) {
  return Requests.patch<boolean>({ url: `/menu/${menuId}/isHidden/${isHidden}` });
}

export function updateMenuOrder(menuIds: number[]) {
  return Requests.patch<boolean>({ url: `/menu/order/${menuIds.join(',')}` });
}

export function updateMenuRoles(menuId: number, roleIds: number[]) {
  return Requests.patch<boolean>({ url: `/menu/${menuId}/role/${roleIds.join(',')}` });
}

export function saveOrUpdateMenu(menuInfo: MenuForm) {
  return Requests.put<boolean>({ url: `/menu`, data: menuInfo });
}

export function deleteMenus(menuIds: number[]) {
  return Requests.delete<boolean>({ url: `/menu/${menuIds.join(',')}` });
}
