<template>
  <el-icon v-bind="$attrs" class="wp-el-svg-icon">
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path v-for="(d, i) in draws" :key="i" fill="currentColor" :d="d" />
    </svg>
  </el-icon>
</template>

<script lang="ts" setup>
const props = defineProps<{ drawPath: string }>();
const draws = computed(() => props.drawPath.split(','));
</script>

<style lang="scss" scoped></style>
