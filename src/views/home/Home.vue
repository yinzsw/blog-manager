<template>
  <draggable v-model="items">
    <template #item="{ item }">
      <div>
        {{ item.title }}
      </div>
    </template>
  </draggable>
</template>

<script setup>
import Draggable from 'vue3-draggable';

const items = ref([
  {
    id: 1,
    title: 'hello',
  },
  {
    id: 2,
    title: 'hello2',
  },
]);
</script>
<style scoped></style>
