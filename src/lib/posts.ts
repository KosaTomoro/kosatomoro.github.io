import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../config';
import { localPath, type Locale } from '../i18n';

export const categories = [{ name: '技术', slug: 'tech' }, { name: '生活', slug: 'life' }] as const;

export type Post = CollectionEntry<'blog'> & {
  locale: Locale;
  translation?: CollectionEntry<'translations'>;
};
export async function getPosts(locale: Locale = 'zh'): Promise<Post[]> {
  const [posts, translations] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('translations', ({ data }) => !data.draft),
  ]);
  const byId = new Map(translations.map(entry => [entry.id, entry]));
  return posts.flatMap((post): Post[] => {
    const translation = byId.get(post.id);
    if (locale === 'en' && !translation) return [];
    return [{
      ...post, locale, translation,
      data: locale === 'en' && translation
        ? { ...post.data, title: translation.data.title, description: translation.data.description }
        : post.data,
    }];
  }).sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
}
export const postUrl = (post: Post, locale: Locale = post.locale) => localPath(`/blog/${post.id.split('/').map(encodeURIComponent).join('/')}/`, locale);
export const tagUrl = (tag: string, locale: Locale = 'zh') => localPath(`/tags/${encodeURIComponent(tag)}/`, locale);
export const dateLabel = (date: string) => new Intl.DateTimeFormat('zh-CN', {
  timeZone: site.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(`${date}T00:00:00+08:00`)).replaceAll('/', '.');
export const rssDate = (date: string) => new Date(`${date}T00:00:00+08:00`);
