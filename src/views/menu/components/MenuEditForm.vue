<template>
  <el-dialog v-model="isShow" class="menu-edit-form" :title="title" width="auto" align-center append-to-body>
    <el-form v-model="menuForm">
      <el-form-item label="菜单名称">
        <el-input v-model="menuForm.name" clearable />
      </el-form-item>
      <el-form-item label="菜单标题">
        <el-input v-model="menuForm.title" clearable />
      </el-form-item>
      <el-form-item label="菜单父项">
        <el-select
          v-model="menuForm.parentId"
          placeholder="请选择菜单父项"
          :disabled="parentsDisabled"
          filterable
          clearable
        >
          <el-option v-for="menu in parents" :key="menu.id" :value="menu.id" :label="menu.name">
            <span>{{ menu.name }}</span>
            <small>({{ menu.title }})</small>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="访问角色">
        <content-role-select v-model:selected="menuForm.roleIds" />
      </el-form-item>
      <el-form-item label="菜单图标">
        <wp-el-svg-icon :draw-path="menuForm.iconPath" @click="isShowIconSelector = true" />
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-switch v-model="menuForm.isHidden" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">关闭</el-button>
      <el-button type="primary" @click="onClick">确定</el-button>
    </template>
  </el-dialog>
  <menu-icon-selector v-model:show="isShowIconSelector" :draw-path="menuForm.iconPath" @finish="onFinish" />
</template>

<script lang="ts" setup>
import MenuIconSelector from '@/views/menu/components/MenuIconSelector.vue';
import { type MenuData, type MenuForm } from '@/model';

interface Props {
  form: MenuForm;
  show: boolean;
  parents: MenuData[];
  parentsDisabled?: boolean;
}
interface Emits {
  (e: 'confirm', form: MenuForm): void;
  (e: 'update:form', form: MenuForm): void;
  (e: 'update:show', isShow: boolean): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const isShow = computed({
  get: () => props.show,
  set: (value) => emits('update:show', value),
});
const menuForm = computed({
  get: () => props.form,
  set: (value) => emits('update:form', value),
});
const title = computed((): string => (props?.form?.id ? '编辑菜单' : '新增菜单'));

const isShowIconSelector = ref(false);
const onClick = () => emits('confirm', menuForm.value);
const onFinish = (drawPath: string) => {
  menuForm.value.iconPath = drawPath;
  isShowIconSelector.value = false;
};
</script>

<style lang="scss" scoped></style>
