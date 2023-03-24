<template>
  <el-select v-model="roleIds" multiple filterable collapse-tags collapse-tags-tooltip placeholder="请输入角色名关键词">
    <el-option v-for="role in roles" :key="role.id" :value="role.id" :label="role.roleLabel">
      <span>{{ role.roleLabel }}</span>
      <small>({{ role.roleName }})</small>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { useRoleStore } from '@/store';

const props = defineProps<{ selected: number[] }>();
const emits = defineEmits<{ (e: 'update:selected', selectedItem: number[]): void }>();

const roleIds = computed({
  get: () => props.selected,
  set: (value) => emits('update:selected', value),
});
const roleStore = useRoleStore();
roleStore.initRoles();
const { roles } = toRefs(roleStore);
</script>

<style lang="scss" scoped></style>
