<template>
  <router-view v-slot="{ Component }" class="wp-router-view">
    <template v-if="Component">
      <span ref="compNameRef" :data-component-name="Component.type.__name" />
      <transition :name="animationName" mode="out-in" appear>
        <keep-alive :include="keepAliveComponents">
          <suspense @pending="pending" @resolve="resolve" @fallback="fallback">
            <component :is="Component" />
            <template #fallback>
              <div id="fallback">
                <slot name="loading" />
              </div>
            </template>
          </suspense>
        </keep-alive>
      </transition>
    </template>
  </router-view>
</template>

<script lang="ts" setup>
interface Props {
  include?: string[];
  animationName?: string;
}

interface Emits {
  (e: 'pending'): void;
  (e: 'resolve'): void;
  (e: 'fallback'): void;
}

const props = withDefaults(defineProps<Props>(), {
  include: () => [],
  animationName: '',
});
const emits = defineEmits<Emits>();

const route = useRoute();
const compNameRef = $ref<HTMLSpanElement>();
const keepAliveComponents = $ref<string[]>(props.include);
if (keepAliveComponents.length === 0) {
  watch(
    () => route.path,
    () => {
      const componentName = compNameRef?.dataset.componentName as string;
      route.meta?.keepAlive && !keepAliveComponents.includes(componentName) && keepAliveComponents.push(componentName);
    },
    { flush: 'post' }
  );
}

const pending = () => emits('pending');
const resolve = () => emits('resolve');
const fallback = () => emits('fallback');
</script>

<style lang="scss" scoped></style>
