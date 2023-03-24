<template>
  <el-space class="navbar">
    <el-space size="large" class="left-operation">
      <el-button type="primary" :icon="isCollapse ? 'i-ep-expand' : 'i-ep-fold'" @click="toggleCollapse()" />
      <el-breadcrumb>
        <el-breadcrumb-item v-for="breadcrumb of breadcrumbs" :key="breadcrumb.id">
          {{ breadcrumb.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-space>

    <el-space class="right-operation">
      <el-dropdown>
        <el-avatar :size="28" :src="userInfo.avatar" alt="avatar" icon="i-ep-avatar" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="i-ep-user" @click="router.push('/')">个人中心</el-dropdown-item>
            <el-dropdown-item icon="i-ep-switch-button" @click="userLogout()">退出登录</el-dropdown-item>
            <el-dropdown-item :icon="historyDropMenuItem.icon" divided @click="toggleRecord()"
              >{{ historyDropMenuItem.text }}
            </el-dropdown-item>
            <el-dropdown-item :icon="darkDropMenuItem.icon" @click="toggleDark()"
              >{{ darkDropMenuItem.text }}
            </el-dropdown-item>
            <el-dropdown-item v-if="isSupported" :icon="fullscreenDropMenuItem.icon" @click="toggleFullscreen()"
              >{{ fullscreenDropMenuItem.text }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-space>
  </el-space>

  <el-space v-if="showHistoryTags" class="history-tag">
    <el-space class="history-tags">
      <el-tag
        v-for="(tag, idx) in historyTags"
        :key="tag.uri"
        closable
        hit
        @click="router.push(tag.uri)"
        @close="removeHistoryTag(idx)"
        >{{ tag.name }}
      </el-tag>
    </el-space>
    <el-badge :value="historyTags.length" type="info">
      <el-button type="danger" size="small" icon="i-ep-delete" circle @click="removeAllHistoryTag" />
    </el-badge>
  </el-space>
</template>

<script lang="ts" setup>
import { useMenuStore, useUserStore } from '@/store';
import { useSettingStore } from '@/store/setting';
import { routeNames } from '@/router';
import type { DropMenuItem } from '@/model';

const route = useRoute();
const router = useRouter();

const menuStore = useMenuStore();
const { isCollapse, breadcrumbs } = storeToRefs(menuStore);
const toggleCollapse = useToggle(isCollapse);

const userStore = useUserStore();
const { userLogout } = userStore;
const { userInfo } = storeToRefs(userStore);

const settingStore = useSettingStore();
const { addHistoryTag, removeHistoryTag, removeAllHistoryTag } = settingStore;
const { isRecordHistory, historyTags, showHistoryTags } = storeToRefs(settingStore);
const toggleRecord = useToggle(isRecordHistory);
const historyDropMenuItem = computed<DropMenuItem>(() =>
  isRecordHistory.value ? { icon: 'i-ep-close', text: '关闭记录' } : { icon: 'i-ep-clock', text: '显示记录' }
);
watch(
  () => route.path,
  (path) => route.matched[0].name === routeNames.layout && addHistoryTag(path),
  { immediate: true }
);

const isDark = useDark();
const toggleDark = useToggle(isDark);
const darkDropMenuItem = computed<DropMenuItem>(() =>
  isDark.value ? { icon: 'i-ep-sunny', text: '白天模式' } : { icon: 'i-ep-moon', text: '黑暗模式' }
);

const { isSupported, isFullscreen, toggle: toggleFullscreen } = useFullscreen();
const fullscreenDropMenuItem = computed<DropMenuItem>(() =>
  isFullscreen.value ? { icon: 'i-ep-circle-close', text: '退出全屏' } : { icon: 'i-ep-full-screen', text: '全屏模式' }
);
</script>

<style lang="scss" scoped>
.navbar {
  height: 55px;
  width: 100%;
  justify-content: space-between;
}

.history-tag {
  height: 40px;
  width: 100%;
  max-width: 100%;
  border-top: 1px solid var(--el-border-color);
  justify-content: space-between;

  .el-tag {
    cursor: pointer;
  }
}
</style>
