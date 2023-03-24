<template>
  <el-config-provider :locale="zhCn">
    <wp-router-view animation-name="el-zoom-in-top" />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { zhCn } from 'element-plus/es/locale/index';

useDark();
</script>

<style lang="scss" scoped></style>
