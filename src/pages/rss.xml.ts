import rss from '@astrojs/rss';
import { site } from '../config';
import { getPosts, postUrl, rssDate } from '../lib/posts';
export async function GET() {
  const posts = await getPosts();
  return rss({
    title: site.title, description: site.description, site: site.url,
    items: posts.map((post) => ({
      title: post.data.title, description: post.data.description,
      pubDate: rssDate(post.data.date), link: postUrl(post), categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
