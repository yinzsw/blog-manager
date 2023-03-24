<template>
  <el-container id="layout-view">
    <el-aside width="auto">
      <view-aside />
    </el-aside>
    <el-container>
      <el-header height="auto">
        <view-header />
      </el-header>
      <el-main>
        <wp-router-view animation-name="el-fade-in" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import ViewAside from '@/views/__layout/components/ViewAside.vue';
import ViewHeader from '@/views/__layout/components/ViewHeader.vue';
import { useMenuStore } from '@/store';

useMenuStore().loadAccessibleMenus();
</script>

<style lang="scss" scoped>
#layout-view {
  height: 100vh;

  .el-header {
    box-shadow: var(--el-box-shadow-lighter);
  }

  .el-main :deep(.wp-router-view) {
    height: 100%;
  }
}
</style>
