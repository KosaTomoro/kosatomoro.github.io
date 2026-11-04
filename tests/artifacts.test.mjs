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

test('site metadata and feeds use the production origin', () => {
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /lang="zh-CN"/);
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
  for (const label of ['About', 'Blog', 'Archive', 'GitHub']) assert.match(html, new RegExp(`>${label}(?: |<)`));
  assert.match(html, /Hi, I'm Kosa Tomoro\./);
  assert.match(html, /这里是我的个人博客/);
  assert.match(html, /src="\/images\/avatar\.jpg"[^>]+alt="Kosa Tomoro 的头像"/);
  assert.match(html, /Born<\/dt><dd>2002\.12/);
  assert.match(html, /2024\.10 — 2025\.2/);
  assert.match(html, /2025\.6 — 2026\.12/);
  assert.equal((html.match(/AI4SE-Agent/g) ?? []).length, 2);
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
