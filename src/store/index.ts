import persistedState from 'pinia-plugin-persistedstate';

export * from './user';
export * from './menu';
export * from './role';

export default createPinia().use(persistedState);
