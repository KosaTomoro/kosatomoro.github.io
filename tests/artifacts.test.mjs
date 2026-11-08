import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const read = (path) => readFileSync(join(dist, path), 'utf8');
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
const pages = walk(dist).filter((file) => file.endsWith('.html'));

test('all internal navigation and local assets resolve to built files', () => {
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1].replaceAll('&amp;', '&');
      if (!value.startsWith('/') || value.startsWith('//')) continue;
      const path = decodeURIComponent(new URL(value, 'https://kosatomoro.github.io').pathname);
      const target = join(dist, path);
      assert.ok(existsSync(target), `${file}: missing ${value}`);
      if (statSync(target).isDirectory()) assert.ok(existsSync(join(target, 'index.html')), `${value} is not a page`);
    }
  }
});

test('migration preserves the publication date and two complete highlighted code blocks', () => {
  const html = read('blog/short-link-sharding/index.html');
  assert.match(html, /短链接分库分表技术方案/);
  assert.match(html, /datetime="2025-03-16"/);
  assert.match(html, /2025\.03\.16/);
  assert.equal((html.match(/<pre\b/g) ?? []).length, 2);
  assert.match(html, /application\.yaml/);
  assert.match(html, /shardingsphere-config\.yaml/);
  assert.doesNotMatch(html, /{%|endtab|config-group/);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Missing anchor ${match[1]}`);
});

test('reflection essay is published with its source link and closing line', () => {
  const html = read('blog/what-i-learned-under-pressure/index.html');
  assert.match(html, /工作这段时间，我在高压里想明白的几件事/);
  assert.match(html, /datetime="2026-11-06"/);
  assert.match(html, /href="https:\/\/www\.anthropic\.com\/claude-opus-5-5"/);
  assert.match(html, /内寻思考，放肆表达/);
  assert.match(html, /class="article-content has-toc"/);
  assert.match(html, /<body class="article-page">/);
  assert.ok(html.indexOf('class="article-toc"') < html.indexOf('class="article-reading"'), 'Table of contents should precede the reading column');
  assert.doesNotMatch(html, /class="article-end"|class="post-navigation"|感谢阅读。|订阅后续文章/);
  assert.equal((html.match(/← 返回文章列表/g) ?? []).length, 1);
  assert.match(read('blog/index.html'), /href="\/blog\/what-i-learned-under-pressure\/"/);
  assert.match(read('rss.xml'), /https:\/\/kosatomoro\.github\.io\/blog\/what-i-learned-under-pressure\//);
});

test('site metadata and feeds use the production origin', () => {
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, file.includes(`${dist}/en/`) ? /lang="en"/ : /lang="zh-CN"/);
    assert.match(html, /rel="canonical" href="https:\/\/kosatomoro\.github\.io\//);
    assert.match(html, /property="og:title"/);
    assert.match(html, /name="description"/);
    assert.doesNotMatch(html, /zhihuijie1\.github\.io|localhost:|127\.0\.0\.1:/);
  }
  assert.match(read('rss.xml'), /https:\/\/kosatomoro\.github\.io\/blog\/short-link-sharding\//);
  assert.match(read('rss.xml'), /Sat, 15 Mar 2025 16:00:00 GMT/);
  assert.match(read('sitemap-0.xml'), /https:\/\/kosatomoro\.github\.io\/blog\/short-link-sharding\//);
  assert.match(read('robots.txt'), /https:\/\/kosatomoro\.github\.io\/sitemap-index.xml/);
});

test('home is an about page with the requested minimal navigation', () => {
  const html = read('index.html');
  for (const label of ['关于', '文章', '归档', 'List100', 'GitHub']) assert.match(html, new RegExp(`>${label}(?: |<)`));
  assert.match(html, /你好，欢迎来到我的个人博客/);
  assert.match(html, /src="\/images\/avatar\.jpg"[^>]+alt="Kosa Tomoro 的头像"/);
  assert.match(html, /datetime="2002-12">2002\.12/);
  assert.match(html, /2024\.10 — 2025\.2/);
  assert.match(html, /2025\.6 — 2026\.12/);
  assert.equal((html.match(/AI4SE-Agent/g) ?? []).length, 2);
  assert.doesNotMatch(html, /profile-role|AI4SE · Agent/);
  const profile = html.match(/<aside class="about-profile"[\s\S]*?<\/aside>/)?.[0] ?? '';
  assert.doesNotMatch(profile, /github\.com/i);
  assert.match(profile, /<span class="experience-job"><strong>ByteDance<\/strong> <span>\(AI4SE-Agent\)<\/span><\/span>/);
  assert.match(html, /<p class="intro-line">内寻思考，放肆表达。<\/p>/);
  assert.doesNotMatch(html, /在技术与生活之间，保持好奇。|class="personal-line"|class="signature"|— Kosa/);
  assert.doesNotMatch(html, /class="about-links"/);
  assert.match(html, /theme : 'dark'/);
  assert.doesNotMatch(html, /\/projects\/|fku-raft-kv|fku-balancer|把想法写成代码/);
  assert.ok(!existsSync(join(dist, 'projects/index.html')));
});

test('empty categories have a helpful state and search has an index', () => {
  for (const category of ['tech', 'life']) {
    const html = read(`blog/category/${category}/index.html`);
    if (html.includes('class="post-row"')) assert.doesNotMatch(html, /这里的故事，还在路上/);
    else assert.match(html, /这里的故事，还在路上/);
  }
  assert.ok(existsSync(join(dist, 'pagefind/pagefind.js')));
  assert.ok(existsSync(join(dist, 'pagefind/pagefind-entry.json')));
  assert.match(read('search/index.html'), /role="search"/);
  assert.match(read('404.html'), /页面未找到/);
});

test('bilingual pages, alternates, RSS and search indexes are complete', () => {
  for (const slug of ['short-link-sharding', 'what-i-learned-under-pressure']) {
    const zh = read(`blog/${slug}/index.html`);
    const en = read(`en/blog/${slug}/index.html`);
    assert.match(zh, new RegExp(`hreflang="en" href="https://kosatomoro.github.io/en/blog/${slug}/"`));
    assert.match(en, new RegExp(`hreflang="zh-CN" href="https://kosatomoro.github.io/blog/${slug}/"`));
    assert.match(en, /data-pagefind-body/);
    assert.equal((en.match(/<h[23]\b/g) ?? []).length, (zh.match(/<h[23]\b/g) ?? []).length);
    assert.match(read('en/rss.xml'), new RegExp(`https://kosatomoro.github.io/en/blog/${slug}/`));
  }
  const english = read('en/blog/what-i-learned-under-pressure/index.html');
  assert.match(english, /Build a public body of work/);
  assert.match(english, /Think inward. Express freely./);
  assert.match(english, /datetime="2026-11-06"/);
  assert.doesNotMatch(english, /class="article-end"|class="post-navigation"|Thank you for reading.|Subscribe via RSS/);
  assert.equal((english.match(/← Back to all essays/g) ?? []).length, 1);
  const codeBlocks = path => [...readFileSync(path,'utf8').matchAll(/\x60\x60\x60yaml\n([\s\S]*?)\x60\x60\x60/g)].map(match => match[1]);
  assert.deepEqual(codeBlocks('src/content/en/short-link-sharding.md'), codeBlocks('src/content/blog/short-link-sharding.md'));
  assert.equal((read('en/blog/short-link-sharding/index.html').match(/<pre\b/g) ?? []).length,2);
  const index = JSON.parse(read('pagefind/pagefind-entry.json'));
  assert.equal(index.languages['zh-cn'].page_count, 2);
  assert.equal(index.languages.en.page_count, 2);
  assert.match(read('sitemap-0.xml'), /hreflang="en"/);
  assert.match(read('sitemap-0.xml'), /hreflang="zh-CN"/);
  for (const file of pages) {
    const html = readFileSync(file,'utf8');
    for (const [,href] of html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)) {
      const path = decodeURIComponent(new URL(href).pathname);
      const target = join(dist,path);
      assert.ok(existsSync(target), `Missing alternate ${href}`);
    }
  }
});

test('List100 publishes all confirmed entries in both languages', () => {
  for(const prefix of ['', 'en/']) {
    const html = read(`${prefix}list-100/index.html`);
    assert.equal((html.match(/class="life-item"/g) ?? []).length,9);
    assert.match(html,/data-status="done"/);
    assert.equal((html.match(/data-status="todo"/g) ?? []).length,8);
    assert.match(html, prefix ? /Release an app of my own/ : /发布一款自己的 App/);
    assert.match(html, prefix ? /Travel to Spain/ : /去西班牙旅行/);
    assert.match(html, prefix ? /fosters so much creativity/ : /拥有如此丰富的创造力/);
    assert.doesNotMatch(html,/示例条目|Illustrative entry|用 AI 做出一个|Build an AI product/);
    assert.doesNotMatch(html,/Chip Huyen|灵感来自|Inspired by/);
    assert.doesNotMatch(html,/class="page-heading"|class="list-closing"|给未来留一点期待|THINGS TO LOOK FORWARD TO|剩下的空白|The blank lines/);
    assert.match(read(`${prefix}index.html`),new RegExp(`href="/${prefix}list-100/"`));
  }
});

test('primary listing pages open directly on their controls or content', () => {
  for (const prefix of ['', 'en/']) {
    const blog = read(`${prefix}blog/index.html`);
    const archive = read(`${prefix}archive/index.html`);
    assert.doesNotMatch(blog, /class="page-heading"|文字与思考|WRITING &amp; REFLECTIONS|关于技术的探索|Notes on building things/);
    assert.doesNotMatch(archive, /class="page-heading"|按时间整理|OVER THE YEARS|慢慢记录，留下走过的路|A small record of thoughts/);
  }
});
