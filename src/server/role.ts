import { Requests } from './__requests';
import type { Role } from '@/model/role';

export function listRoles(keywords = ' ') {
  return Requests.get<Role[]>({ url: `/role/keywords/${keywords}` });
}
