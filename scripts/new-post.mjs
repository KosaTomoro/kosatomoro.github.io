import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const slug = process.argv[2];
const english = process.argv.includes('--en');
if (!slug || !/^[a-z][a-z0-9-]*$/.test(slug) || ['category', 'page'].includes(slug)) {
  console.error('用法：npm run new -- my-first-post [--en]（小写字母开头，仅使用字母、数字和短横线）');
  process.exit(1);
}
const directory = english ? 'en' : 'blog';
const target = new URL(`../src/content/${directory}/${slug}.md`, import.meta.url);
if (english) {
  try { await readFile(new URL(`../src/content/blog/${slug}.md`, import.meta.url)); }
  catch { console.error('请先创建同名中文原文，再创建英文译文。'); process.exit(1); }
}
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const template = (await readFile(new URL(english ? '../templates/translation.md' : '../templates/post.md', import.meta.url), 'utf8')).replace(/date: "[^"]+"/, `date: "${today}"`);
await mkdir(new URL(`../src/content/${directory}/`, import.meta.url), { recursive: true });
try {
  await writeFile(target, template, { flag: 'wx' });
  console.log(`已创建草稿：${fileURLToPath(target)}\n完成后将 draft 改为 false，再构建预览并提交。`);
} catch (error) {
  if (error.code === 'EEXIST') { console.error('同名文章已经存在，未覆盖。'); process.exit(1); }
  throw error;
}
