<template>
  <el-scrollbar max-height="100vh">
    <el-menu :default-active="currentRoutePath" :collapse="isCollapse" router>
      <template v-for="menuItem in accessibleMenus" :key="menuItem.id">
        <el-menu-item v-if="menuItem.subMenus === null" :index="menuItem.uri">
          <wp-el-svg-icon :draw-path="menuItem.iconPath" />
          <template #title>{{ menuItem.title }}</template>
        </el-menu-item>

        <el-sub-menu v-else :index="menuItem.id + ''">
          <template #title>
            <wp-el-svg-icon :draw-path="menuItem.iconPath" />
            <span>{{ menuItem.title }}</span>
          </template>

          <el-menu-item-group>
            <el-menu-item v-for="subMenuItem in menuItem.subMenus" :key="subMenuItem.id" :index="subMenuItem.uri">
              <wp-el-svg-icon :draw-path="subMenuItem.iconPath" />
              <template #title>{{ subMenuItem.title }}</template>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { useMenuStore } from '@/store';

const menuStore = useMenuStore();
const { isCollapse, currentRoutePath, accessibleMenus } = storeToRefs(menuStore);
</script>

<style lang="scss" scoped>
.el-menu {
  min-height: 100vh;

  &:not(.el-menu--collapse) {
    width: 220px;
  }
}
</style>
