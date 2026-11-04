import { getCollection } from 'astro:content';
import { site } from '../config';

export const PAGE_SIZE = 10;
export const categories = [{ name: '技术', slug: 'tech' }, { name: '生活', slug: 'life' }] as const;

export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
}

export type Post = Awaited<ReturnType<typeof getPosts>>[number];
export const postUrl = (post: Post) => `/blog/${post.id.split('/').map(encodeURIComponent).join('/')}/`;
export const tagUrl = (tag: string) => `/tags/${encodeURIComponent(tag)}/`;
export const pageUrl = (base: string, page: number) => page === 1 ? base : `${base}${page}/`;
export const dateLabel = (date: string) => new Intl.DateTimeFormat('zh-CN', {
  timeZone: site.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(`${date}T00:00:00+08:00`)).replaceAll('/', '.');
export const rssDate = (date: string) => new Date(`${date}T00:00:00+08:00`);

export function pageEntries(posts: Post[]) {
  const count = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  return Array.from({ length: count }, (_, i) => ({
    page: i === 0 ? undefined : String(i + 1),
    posts: posts.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE),
    current: i + 1,
    total: count,
  }));
}
