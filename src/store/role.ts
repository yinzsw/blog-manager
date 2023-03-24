import { listRoles } from '@/server/role';
import type { Role } from '@/model/role';

export const useRoleStore = defineStore(
  'role',
  () => {
    const roles = ref<Role[]>([]);

    const initRoles = async () => {
      await navigator.locks.request(
        'role_init',
        async () => roles.value.length === 0 && (roles.value = await listRoles())
      );
    };
    return { roles, initRoles };
  },
  {
    persist: {
      paths: [],
    },
  }
);
