<template>
  <div id="menu-view">
    <el-space class="table-control">
      <el-button type="primary" icon="i-ep-circle-plus" @click="openEditForm()">新增</el-button>
      <el-button type="success" icon="i-ep-sort" @click="openDragSort()">排序</el-button>
      <el-input v-model.trim="searchKeywords" prefix-icon="i-ep-search" placeholder="请输入菜单名或标题" clearable />
    </el-space>
    <el-auto-resizer v-slot="{ height, width }" style="height: calc(100% - 32px)">
      <el-table-v2 :columns="columns" :data="data" expand-column-key="name" :width="width" :height="height" />
    </el-auto-resizer>
    <menu-edit-form
      v-model:form="formData"
      v-model:show="isShowEditForm"
      :parents="menuDatum"
      :parents-disabled="parentsDisabled"
      @confirm="confirmForm"
    />
    <menu-drag-sort v-model:items="menuDatum" v-model:show="isShowDragSort" @confirm="confirmSort" />
    <menu-icon-selector v-model:show="isShowIconSelector" :draw-path="willChangeIconMenu?.iconPath" @finish="finish" />
  </div>
</template>

<script lang="tsx" setup>
import {
  deleteMenus,
  listMenus,
  saveOrUpdateMenu,
  updateMenuHidden,
  updateMenuIcon,
  updateMenuOrder,
  updateMenuRoles,
  updateMenuTitle,
} from '@/server';
import { useMenuStore, useRoleStore } from '@/store';
import { type MenuData, type MenuForm, type Role } from '@/model';
import MenuIconSelector from '@/views/menu/components/MenuIconSelector.vue';
import MenuEditForm from '@/views/menu/components/MenuEditForm.vue';
import MenuDragSort from '@/views/menu/components/MenuDragSort.vue';
import type { AnyColumns } from 'element-plus/es/components/table-v2/src/types';
import type { Column } from 'element-plus';

// Table Data
const { loadAccessibleMenus } = useMenuStore();
const { roles } = storeToRefs(useRoleStore());
const menuDatum = ref<MenuData[]>([]);
const searchKeywords = ref('');
const data = computed(() => {
  const keywords = searchKeywords.value.toLowerCase();
  if (keywords.length === 0) {
    return menuDatum.value;
  }
  const isMatchMenu = ({ name, title }: MenuData) =>
    name.toLowerCase().includes(keywords) || title.toLowerCase().includes(keywords);
  return menuDatum.value.filter(
    (menu) => isMatchMenu(menu) || (menu.children !== null && menu.children.some((element) => isMatchMenu(element)))
  );
});
const loadMenuDatum = async () => {
  const [menus] = await Promise.all([listMenus(), loadAccessibleMenus()]);
  menuDatum.value = menus;
};
const removeMenus = async (ids: number[]) => {
  await deleteMenus(ids);
  await loadMenuDatum();
};
await loadMenuDatum();

// Menu Form
const isShowEditForm = ref(false);
const formData = ref<MenuForm>({ name: '', title: '', roleIds: [], iconPath: '' });
const parentsDisabled = ref(false);
const openEditForm = (data?: MenuData) => {
  formData.value = {
    id: data?.id,
    name: data?.name ?? '',
    title: data?.title ?? '',
    parentId: data?.parentId,
    roleIds: data?.roles?.map((role) => role.id) ?? [],
    isHidden: data?.isHidden,
    iconPath: data?.iconPath ?? 'M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64z',
  };
  parentsDisabled.value = !!data?.children;
  isShowEditForm.value = true;
};
const confirmForm = async (data: MenuForm) => {
  await saveOrUpdateMenu(data);
  await loadMenuDatum();
  isShowEditForm.value = false;
};

// Menu Sort
const isShowDragSort = ref(false);
const openDragSort = () => (isShowDragSort.value = true);
const confirmSort = async (sortIds: number[]) => {
  await updateMenuOrder(sortIds);
  await loadMenuDatum();
  isShowDragSort.value = false;
};

// Icon Menu
const isShowIconSelector = ref(false);
const willChangeIconMenu = ref<MenuData | null>(null);
const openIconSelector = (menuData: MenuData) => {
  willChangeIconMenu.value = menuData;
  isShowIconSelector.value = true;
};
const finish = async (drawPath: string) => {
  const menu = willChangeIconMenu.value;
  if (menu === null || drawPath === '') {
    return ElMessage.error('图标更新失败');
  }
  if (menu.iconPath !== drawPath) {
    menu.iconPath = drawPath;
    await updateMenuIcon(menu.id, drawPath);
    await loadMenuDatum();
  }
  isShowIconSelector.value = false;
};

// Table Column
const menuNameColumn: Column<string> = {
  key: 'name',
  title: '菜单名称',
  width: 160,
  minWidth: 120,
  cellRenderer: ({ rowData }) => <el-tag disable-transitions>{(rowData as MenuData).name.toUpperCase()}</el-tag>,
};
const menuTitleColumn: Column<string> = {
  key: 'title',
  title: '菜单标题',
  width: 160,
  minWidth: 110,
  cellRenderer: ({ rowData }) => {
    const row = rowData as MenuData;
    const onUpdate = async (title: string) => {
      if (row.title !== title) {
        row.title = title;
        await updateMenuTitle(row.id, title);
        await loadMenuDatum();
      }
    };
    return <wp-el-input-tag text={row.title} size="small" onUpdate:text={onUpdate} />;
  },
};
const menuIconColumn: Column<string> = {
  key: 'icon',
  title: '菜单图标',
  width: 120,
  minWidth: 100,
  align: 'center',
  cellRenderer: ({ rowData }) => {
    const row = rowData as MenuData;
    return <wp-el-svg-icon draw-path={row.iconPath} onClick={() => openIconSelector(row)} />;
  },
};
const menuHiddenColumn: Column<boolean> = {
  key: 'hidden',
  title: '是否隐藏',
  width: 150,
  minWidth: 100,
  cellRenderer: ({ rowData }) => {
    const row = rowData as MenuData;
    const onUpdate = async (isHidden: boolean) => {
      row.isHidden = isHidden;
      await updateMenuHidden(row.id, isHidden);
      await loadMenuDatum();
    };
    return <el-switch model-value={row.isHidden} onUpdate:modelValue={onUpdate} />;
  },
};
const menuRoleColumn: Column<Role[]> = {
  key: 'role',
  title: '角色列表',
  width: 230,
  minWidth: 200,
  cellRenderer: ({ rowData }) => {
    const row = rowData as MenuData;
    const roleIds = row.roles.map((role) => role.id);
    const onUpdate = async (newRolesIds: number[]) => {
      if (newRolesIds.length === 0) {
        return ElMessage.error('至少有一名角色');
      }
      row.roles = roles.value.filter((role) => newRolesIds.includes(role.id));
      await updateMenuRoles(row.id, newRolesIds);
      await loadMenuDatum();
    };
    return <content-role-select selected={roleIds} onUpdate:selected={onUpdate} />;
  },
};
const menuTimeColumn: Column<string> = {
  key: 'time',
  width: 230,
  minWidth: 200,
  headerCellRenderer: () => (
    <>
      <i-ep-timer class="mr-3" />
      <span>创建时间</span>
    </>
  ),
  cellRenderer: ({ rowData }) => {
    const row = rowData as MenuData;
    return <i>{useDateFormat(row.createTime, 'YYYY-MM-DD HH:mm:ss').value}</i>;
  },
};
const menuOperationColumn: Column = {
  key: 'operation',
  width: 200,
  headerCellRenderer: () => (
    <>
      <i-ep-operation class="mr-3" />
      <span>操作</span>
    </>
  ),
  cellRenderer: ({ rowData }) => {
    const row = rowData as MenuData;
    return (
      <el-button-group>
        <el-button type="primary" icon="i-ep-edit" plain onClick={() => openEditForm(row)} />
        <el-popconfirm title={`你确定要删除 [${row.title}] 吗?`} width="230" onConfirm={() => removeMenus([row.id])}>
          {{
            reference: () => <el-button type="danger" icon="i-ep-delete" plain />,
          }}
        </el-popconfirm>
      </el-button-group>
    );
  },
};
const columns: AnyColumns = [
  menuNameColumn,
  menuTitleColumn,
  menuIconColumn,
  menuHiddenColumn,
  menuRoleColumn,
  menuTimeColumn,
  menuOperationColumn,
];
</script>

<style lang="scss" scoped></style>
