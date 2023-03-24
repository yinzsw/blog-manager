<template>
  <el-drawer v-model="isShow" class="menu-icon-selector" size="36%" :with-header="false" append-to-body>
    <div class="icon-confirm">
      <wp-el-svg-icon :size="80" :draw-path="previewIconDrawPath" />
      <el-button class="finished-btn" title="选择" icon="i-ep-finished" :disabled="isValid" circle @click="finish" />
    </div>
    <el-tabs v-model="currentTab">
      <el-tab-pane label="预设" name="preset">
        <el-scrollbar class="preset-tab" max-height="100%">
          <el-descriptions title="图标信息">
            <el-descriptions-item label="名称">{{ info.name }}</el-descriptions-item>
            <el-descriptions-item label="类型">
              <el-tag>{{ info.category }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="作者">
              <el-link type="primary" :href="info.author.url" target="_blank">{{ info.author.name }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="数量">{{ info.total }}</el-descriptions-item>
            <el-descriptions-item label="版本">{{ info.version }}</el-descriptions-item>
            <el-descriptions-item label="许可">
              <b>{{ info.license.spdx }}</b>
            </el-descriptions-item>
          </el-descriptions>
          <div class="icons">
            <div
              v-for="({ body }, name) in icons.icons"
              :key="name"
              class="icon-item"
              :title="name"
              @click="select(body)"
            >
              <el-icon size="20">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="body" />
              </el-icon>
              <small class="icon-name">{{ name }}</small>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="自定义" name="custom">
        <el-input
          v-model="currentSvg"
          class="icon-textarea"
          type="textarea"
          :maxlength="60000"
          :autosize="{ minRows: 10, maxRows: 20 }"
          placeholder="请输入SVG代码"
          resize="none"
          show-word-limit
        />
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script lang="ts" setup>
import { icons, info } from '@iconify-json/ep';

interface Props {
  show: boolean;
  drawPath?: string;
}

interface Emits {
  (e: 'update:show', isShow: boolean): void;

  (e: 'finish', drawPath: string, svg?: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  drawPath: '',
});
const emits = defineEmits<Emits>();
const isShow = computed({
  get: () => props.show,
  set: (value) => emits('update:show', value),
});

const currentTab = ref<'preset' | 'custom'>('preset');
const currentSvg = ref<string>();
const drawPathRegExp = /d="(?<drawPath>.*?)"/g;
const previewIconDrawPath = computed(() =>
  currentSvg.value
    ? [...currentSvg.value.matchAll(drawPathRegExp)].map((m) => m.groups!.drawPath).join(',')
    : props.drawPath
);
const isValid = computed(() => !previewIconDrawPath.value);
const finish = () => emits('finish', previewIconDrawPath.value, currentSvg.value);
const select = (svgPath: string) => (currentSvg.value = svgPath);
</script>

<style lang="scss" scoped>
$border: 1px solid var(--el-border-color);

.menu-icon-selector {
  .icon-confirm {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;

    .finished-btn {
      position: absolute;
      right: 5%;
      bottom: 0;
    }
  }

  .preset-tab {
    height: calc(100vh - 220px);

    .icons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: $border;
      border-left: $border;
      border-radius: 4px;

      .icon-item {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;
        color: var(--el-text-color-regular);
        height: 90px;
        border-right: $border;
        border-bottom: $border;
        transition: background-color var(--el-transition-duration);
        cursor: pointer;

        &:hover {
          background-color: var(--el-border-color-extra-light);
          color: var(--brand-color-light);
        }

        .icon-name {
          white-space: nowrap;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
