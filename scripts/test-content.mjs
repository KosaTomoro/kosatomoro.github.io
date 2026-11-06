// Exercise the actual static routes using an isolated copy; never mutate real posts.
import { mkdtempSync, mkdirSync, cpSync, symlinkSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = resolve('.');
const work = mkdtempSync(join(tmpdir(), 'kosa-content-test-'));
const rowCount = (html) => (html.match(/class="post-row"/g) ?? []).length;
try {
  for (const file of ['src', 'public', 'package.json', 'astro.config.mjs', 'tsconfig.json', 'pagefind.yml']) cpSync(join(root, file), join(work, file), { recursive: true });
  symlinkSync(join(root, 'node_modules'), join(work, 'node_modules'), 'dir');
  // Keep these scenarios stable as real articles are added in the future.
  rmSync(join(work, 'src/content/blog'), { recursive: true });
  mkdirSync(join(work, 'src/content/blog'), { recursive: true });
  const post = (id, category, draft = false, date = '2026-02-01') => {
    writeFileSync(join(work, 'src/content/blog', `${id}.md`), `---\ntitle: "${id}"\ndescription: "Integration fixture"\ndate: "${date}"\ncategory: ${category}\ntags: [${draft ? 'draft-only-tag' : 'fixture-tag'}]\ndraft: ${draft}\n---\n\n${id} integration fixture body.\n`);
  };
  post('fixture-baseline', '技术', false, '2025-03-16');
  for (let i = 1; i <= 11; i++) post(`fixture-tech-${i}`, '技术', false, `2026-01-${String(i).padStart(2, '0')}`);
  post('fixture-life', '生活');
  post('draft-never-publish', '技术', true);
  rmSync(join(work, 'src/content/en'), { recursive: true });
  mkdirSync(join(work, 'src/content/en'), { recursive: true });
  const translate = (id, draft = false) => writeFileSync(join(work, 'src/content/en', id + '.md'),
    '---\ntitle: "English ' + id + '"\ndescription: "Translated integration fixture"\ndraft: ' + draft + '\n---\n\nEnglish translated fixture body.\n');
  translate('fixture-baseline');
  translate('fixture-life');
  translate('draft-never-publish'); // A published translation cannot expose a draft source.
  translate('orphan-translation'); // A translation without a source cannot become a page.
  translate('fixture-tech-11', true);
  const build = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: work, encoding: 'utf8', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
  assert.equal(build.status, 0, build.stdout + build.stderr);
  const read = (path) => readFileSync(join(work, 'dist', path), 'utf8');
  const first = read('blog/index.html');
  assert.equal(rowCount(first), 13);
  assert.equal(existsSync(join(work, 'dist/blog/2/index.html')), false);
  assert.doesNotMatch(first, /class="pagination"|rel="next"|rel="prev"/);
  const lifePosition = first.indexOf('href="/blog/fixture-life/"');
  const techPosition = first.indexOf('href="/blog/fixture-tech-11/"');
  assert.ok(lifePosition >= 0 && techPosition > lifePosition, 'Posts should be newest first');
  assert.equal(rowCount(read('blog/category/tech/index.html')), 12);
  assert.equal(existsSync(join(work, 'dist/blog/category/tech/2/index.html')), false);
  assert.equal(rowCount(read('blog/category/life/index.html')), 1);
  assert.equal(existsSync(join(work, 'dist/blog/draft-never-publish')), false);
  assert.equal(existsSync(join(work, 'dist/tags/draft-only-tag')), false);
  for (const path of ['index.html', 'blog/index.html', 'archive/index.html', 'tags/index.html', 'rss.xml', 'sitemap-0.xml']) assert.doesNotMatch(read(path), /draft-never-publish|draft-only-tag/);
  assert.match(read('blog/fixture-tech-11/index.html'), /fixture-life/);
  assert.match(read('blog/fixture-tech-11/index.html'), /fixture-tech-10/);
  assert.equal(rowCount(read('en/blog/index.html')), 2);
  assert.equal(rowCount(read('en/blog/category/tech/index.html')), 1);
  assert.equal(rowCount(read('en/blog/category/life/index.html')), 1);
  for (const id of ['draft-never-publish','orphan-translation','fixture-tech-11']) {
    assert.equal(existsSync(join(work,'dist/en/blog',id)),false);
    for (const path of ['en/blog/index.html','en/archive/index.html','en/tags/index.html','en/rss.xml','sitemap-0.xml']) {
      if (path === 'sitemap-0.xml' && id === 'fixture-tech-11') continue;
      assert.ok(!read(path).includes(id), path + ' leaked ' + id);
    }
  }
  assert.doesNotMatch(read('blog/fixture-tech-11/index.html'), /hreflang="en"/);
  assert.match(read('blog/fixture-tech-11/index.html'), /暂时没有英文版本/);
  assert.match(read('en/blog/fixture-life/index.html'), /fixture-baseline/);
  const index = spawnSync(process.execPath, [join(root,'node_modules/pagefind/lib/runner/bin.cjs'),'--site','dist'], {cwd:work,encoding:'utf8'});
  assert.equal(index.status,0,index.stdout+index.stderr);
  const search = JSON.parse(read('pagefind/pagefind-entry.json'));
  assert.equal(search.languages['zh-cn'].page_count,13);
  assert.equal(search.languages.en.page_count,2);
  console.log('Content integration passed: 13 Chinese and 2 English posts; sorting, neighbors, translation fallback, orphan/draft exclusion, and separate search indexes.');
} finally {
  rmSync(work, { recursive: true, force: true });
}
