import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import inspect from 'vite-plugin-inspect';
import unoCss from 'unocss/vite';
import icons from 'unplugin-icons/vite';
import autoImport from 'unplugin-auto-import/vite';
import components from 'unplugin-vue-components/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

const resourceRootPath = path.resolve(__dirname, 'src');
export default defineConfig({
  resolve: { alias: { '@': resourceRootPath } },
  plugins: [
    vue({ reactivityTransform: true }),
    vueJsx(),
    legacy({ targets: ['defaults', 'not IE 11'] }),
    inspect(),
    unoCss(),
    autoImport({
      include: [/\.[jt]sx?$/, /\.vue$/],
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
      vueTemplate: true,
      dts: path.resolve(resourceRootPath, 'typings', 'auto-imports.d.ts'),
    }),
    components({
      resolvers: [ElementPlusResolver(), IconsResolver({ enabledCollections: ['ep'] })],
      dts: path.resolve(resourceRootPath, 'typings', 'components.d.ts'),
    }),
    icons({ autoInstall: true }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
