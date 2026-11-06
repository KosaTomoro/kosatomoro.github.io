import rss from '@astrojs/rss';
import { site } from '../config';
import { getPosts, postUrl, rssDate } from './posts';
import { copy, htmlLanguage, tagName, type Locale } from '../i18n';
export async function makeFeed(locale: Locale) {
  const posts = await getPosts(locale);
  const t = copy(locale);
  return rss({
    title: `${site.name} · ${t.blog}`, description: t.description, site: site.url,
    items: posts.map(post => ({
      title: post.data.title, description: post.data.description,
      pubDate: rssDate(post.data.date), link: postUrl(post),
      categories: post.data.tags.map(tag=>tagName(tag,locale)),
    })),
    customData: `<language>${htmlLanguage(locale)}</language>`,
  });
}
