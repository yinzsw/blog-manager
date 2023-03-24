import { Requests } from './__requests';
import type { Token, UserInfo, UserLogin } from '@/model';

export function login(userLogin: UserLogin) {
  return Requests.post<UserInfo>({ url: 'auth', data: userLogin });
}

export function refresh() {
  return Requests.put<Token>({ url: 'auth' });
}
