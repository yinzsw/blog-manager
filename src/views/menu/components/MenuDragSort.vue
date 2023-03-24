<template>
  <el-dialog v-model="isShow" class="menu-drag-sort" title="菜单排序" width="30%" align-center append-to-body>
    <draggable v-model="data" transition="200">
      <template #item="{ item }">
        <div class="sort-item">
          <div class="item-info">
            <i-ep-grid class="mr-3" />
            <span>{{ item.name }}</span>
            <small>({{ item.title }})</small>
          </div>
          <el-popover v-if="item.children && item.children.length >= 2" width="auto" placement="right" trigger="click">
            <template #reference><i-ep-more /></template>
            <draggable v-model="item.children" transition="200">
              <template #item="{ item: children }">
                <div class="sort-item">
                  <div class="item-info">
                    <i-ep-grid class="mr-3" />
                    <span>{{ children.name }}</span>
                    <small>({{ children.title }})</small>
                  </div>
                </div>
              </template>
            </draggable>
          </el-popover>
        </div>
      </template>
    </draggable>
    <template #footer>
      <el-button @click="isShow = false">关闭</el-button>
      <el-button type="primary" @click="onClick">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// @ts-ignore
import Draggable from 'vue3-draggable';
import { type MenuData } from '@/model';

interface Props {
  show: boolean;
  items: MenuData[];
}

interface Emits {
  (e: 'confirm', form: number[]): void;

  (e: 'update:items', data: MenuData[]): void;

  (e: 'update:show', isShow: boolean): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const isShow = computed({
  get: () => props.show,
  set: (value) => emits('update:show', value),
});
const data = computed({
  get: () => props.items,
  set: (value) => emits('update:items', value),
});
const sortIds = computed(() => data.value.flatMap((item) => item.children ?? item).map((item) => item.id));
const onClick = () => emits('confirm', sortIds.value);
</script>

<style lang="scss" scoped>
.sort-item {
  display: flex;
  justify-content: space-between;
  font-size: 1.6rem;
  line-height: 1.6em;
  padding: 5px 10px;
  margin-bottom: 2px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;

  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  .item-info {
    display: flex;
    align-items: center;
  }
}
</style>
