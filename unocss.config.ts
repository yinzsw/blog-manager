import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetAttributify(), presetIcons(), presetUno()],
  variants: [
    {
      match: (matcher) => {
        if (matcher.startsWith('i-')) {
          return { matcher, selector: (input) => (input.startsWith('.') ? `${input.slice(1)},${input}` : input) };
        }
      },
    },
  ],
});
