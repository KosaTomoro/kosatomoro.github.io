import { getCollection } from 'astro:content';
import { site } from '../config';

export const categories = [{ name: '技术', slug: 'tech' }, { name: '生活', slug: 'life' }] as const;

export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
}

export type Post = Awaited<ReturnType<typeof getPosts>>[number];
export const postUrl = (post: Post) => `/blog/${post.id.split('/').map(encodeURIComponent).join('/')}/`;
export const tagUrl = (tag: string) => `/tags/${encodeURIComponent(tag)}/`;
export const dateLabel = (date: string) => new Intl.DateTimeFormat('zh-CN', {
  timeZone: site.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(`${date}T00:00:00+08:00`)).replaceAll('/', '.');
export const rssDate = (date: string) => new Date(`${date}T00:00:00+08:00`);
