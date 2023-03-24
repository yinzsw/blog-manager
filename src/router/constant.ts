export const symbolPrefix = 'route';
export const forRouteSymbol = (key: string) => Symbol.for(`${symbolPrefix}.${key}`);

const layout = forRouteSymbol('layout');
const login = forRouteSymbol('login');
const notFound = forRouteSymbol('404');
const home = forRouteSymbol('home');
const menu = forRouteSymbol('menu');

export const routeNames = { layout, login, notFound, home, menu };
