<template>
  <div class="wp-el-input-tag">
    <el-input
      v-if="isFocusInput"
      ref="inputRef"
      v-model.lazy.trim="textValue"
      :size="size"
      @keyup.enter="closeInput"
      @blur="closeInput"
    />
    <el-button v-else :size="size" @click="showInput">{{ text }}</el-button>
  </div>
</template>

<script lang="ts" setup>
import type { InputInstance } from 'element-plus';

interface Props {
  size?: 'default' | 'small' | 'large';
  text: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  text: '',
});
const emits = defineEmits(['update:text']);
const inputRef = ref<InputInstance>();
const textValue = ref(props.text);
const isFocusInput = ref(false);
const closeInput = () => {
  emits('update:text', textValue.value);
  isFocusInput.value = false;
};
const showInput = () => {
  isFocusInput.value = true;
  nextTick(() => inputRef.value!.input!.focus());
};
</script>

<style lang="scss" scoped></style>
