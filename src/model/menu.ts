import type { Role } from '@/model/role';

export interface MenuData {
  /**
   * 创建时间
   */
  createTime: Date;
  /**
   * svg绘制路径
   */
  iconPath: string;
  /**
   * id
   */
  id: number;
  /**
   * 父菜单id
   */
  parentId: number | null;
  /**
   * 是否隐藏
   */
  isHidden: boolean;
  /**
   * 菜单名
   */
  name: string;
  /**
   * 角色列表
   */
  roles: Role[];
  /**
   * 菜单标题
   */
  title: string;
  /**
   * 子菜单列表
   */
  children: MenuData[];

  checked?: boolean;
}

export interface MenuItem {
  /**
   * id
   */
  id: number;
  /**
   * 菜单名
   */
  name: string;
  /**
   * 菜单名en
   */
  title: string;
  /**
   * 资源标识
   */
  uri: string;
  /**
   * svg绘制路径
   */
  iconPath: string;
  /**
   * 子菜单列表
   */
  subMenus: MenuItem[] | null;
}

export interface HistoryTag {
  name?: string;
  uri: string;
}

export interface DropMenuItem {
  icon: string;
  text: string;
}

export interface MenuForm {
  id?: number;
  name: string;
  title: string;
  parentId?: number | null;
  roleIds: number[];
  isHidden?: boolean;
  iconPath: string;
}
