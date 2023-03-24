import { useMenuStore } from '@/store/menu';
import type { HistoryTag } from '@/model';

export const useSettingStore = defineStore(
  'setting',
  () => {
    const menuStore = useMenuStore();

    const isRecordHistory = ref(true);
    const historyTags = ref<HistoryTag[]>([]);

    const showHistoryTags = computed(() => isRecordHistory.value && historyTags.value.length > 0);

    const addHistoryTag = (uri: string) => {
      const menuItem = menuStore.menuPathMap.get(uri)?.at(-1);
      if (!menuItem) {
        return;
      }

      const historyTag: HistoryTag = { name: menuItem.title, uri: menuItem.uri };
      const idx = historyTags.value.findIndex((item) => item.uri === historyTag.uri);
      idx !== -1 && removeHistoryTag(idx);
      historyTags.value.push(historyTag);

      const overflowNum = historyTags.value.length - 12;
      overflowNum > 0 && historyTags.value.splice(0, overflowNum);
    };
    const removeHistoryTag = (index: number) => historyTags.value.splice(index, 1);
    const removeAllHistoryTag = () => (historyTags.value = []);

    return {
      isRecordHistory,
      historyTags,
      showHistoryTags,
      addHistoryTag,
      removeHistoryTag,
      removeAllHistoryTag,
    };
  },
  { persist: true }
);
