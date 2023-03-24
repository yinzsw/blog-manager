import NProgress from 'nprogress';
import App from './App.vue';
import pinia from './store';
import router from './router';
import 'uno.css';
import 'nprogress/nprogress.css';
import 'element-plus/theme-chalk/src/dark/css-vars.scss';
import '@/assets/styles/index.scss';

NProgress.configure({ showSpinner: false });

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');
