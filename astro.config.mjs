import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kosatomoro.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => !/\/(404|not-found|search|ideas\/admin)\/?$/.test(page),
    i18n: { defaultLocale: 'zh', locales: { zh: 'zh-CN', en: 'en' } },
  })],
  markdown: {
    // Syntax colours come from the --astro-code-* tokens in src/styles/global.css,
    // so code blocks follow the light and dark themes like everything else.
    shikiConfig: { theme: 'css-variables', wrap: false },
  },
});
