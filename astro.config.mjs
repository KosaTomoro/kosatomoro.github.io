import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kosatomoro.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => !/\/(404|not-found|search)\/?$/.test(page),
    i18n: { defaultLocale: 'zh', locales: { zh: 'zh-CN', en: 'en' } },
  })],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
