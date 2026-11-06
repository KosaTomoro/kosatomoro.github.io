export type Locale = 'zh' | 'en';
export const htmlLanguage = (locale: Locale) => locale === 'zh' ? 'zh-CN' : 'en';
export const getLocale = (path: string): Locale => path === '/en' || path.startsWith('/en/') ? 'en' : 'zh';
export const withoutLocale = (path: string) => path.replace(/^\/en(?=\/|$)/, '') || '/';
export const localPath = (path: string, locale: Locale = 'zh') => locale === 'en' ? `/en${path}` : path;
export const otherPath = (path: string) => localPath(withoutLocale(path), getLocale(path) === 'en' ? 'zh' : 'en');
export const articleCount = (count: number, locale: Locale) => locale === 'zh' ? `${count} 篇文章` : `${count} ${count === 1 ? 'essay' : 'essays'}`;
export const categoryName = (category: string, locale: Locale) => locale === 'zh' ? category : ({ '技术': 'Technology', '生活': 'Life' }[category] ?? category);
const tagTranslations: Record<string, string> = { '职业思考': 'Career', '个人成长': 'Personal growth', '分库分表': 'Sharding', '短链接系统': 'URL shortener', '短链系统': 'URL shortener' };
export const tagName = (tag: string, locale: Locale) => locale === 'zh' ? tag : tagTranslations[tag] ?? tag;

const zh = {
  about: '关于', blog: '文章', archive: '归档', tags: '标签', search: '搜索',
  description: '记录技术实践、阅读与生活。在这里，让想法慢慢长成文字。',
  nav: '主导航', skip: '跳到正文', newWindow: '（新窗口）',
  switchLight: '切换到浅色主题', switchDark: '切换到深色主题',
  noTranslation: '这篇内容暂时没有英文版本', footer: '保持好奇，持续记录。',
  aboutEyebrow: '关于我', introLine: '在技术与生活之间，保持好奇。',
  hello: '你好，欢迎来到我的个人博客。',
  introOne: '我会在这里记录技术实践中的发现，整理对工程问题的思考，也写下一些关于阅读和生活的片段。',
  introTwo: '写作对我来说，是把零散想法慢慢整理清楚的过程。希望这些文字能留下走过的路，也能偶尔给读到它的人一点启发。',
  personalLine: '内寻思考，放肆表达。', profile: '个人资料', avatar: 'Kosa Tomoro 的头像',
  born: '出生于', experience: '工作经历', explore: '继续探索', readWriting: '读我的文章', myList: '我的 List100',
  blogEyebrow: '文字与思考', blogIntro: '关于技术的探索，也关于平常日子里的发现。',
  all: '全部', categories: '文章分类', emptyTitle: '这里的故事，还在路上。',
  emptyIntro: '有了新的发现，就写在这里。', otherWriting: '先读读其他文章',
  byYear: '按年份浏览', browseTags: '浏览标签', fullSearch: '全文搜索',
  archiveEyebrow: '按时间整理', archiveIntro: '慢慢记录，留下走过的路。',
  viewSummaries: '查看文章与摘要', noPosts: '还没有发布的文章。',
  tagsEyebrow: '沿着兴趣，读下去', tagsIntro: '用一个关键词，找到相关的文字。',
  noTags: '文章发布后，标签会出现在这里。', allTags: '所有标签', topic: '主题',
  allPosts: '所有文章', updated: '更新于', contents: '本文目录', articleNav: '文章目录',
  thanks: '感谢阅读。', neighbors: '相邻文章', previous: '上一篇', next: '下一篇',
  returnBlog: '返回文章列表', subscribe: '订阅后续文章',
  copy: '复制代码', copyLabel: '复制此代码块', codeScroll: '代码，可横向滚动',
  copied: '已复制 ✓', copiedStatus: '代码已复制到剪贴板',
  manualCopy: '请按 Ctrl / ⌘ + C', manualCopyStatus: '已选中代码，请使用系统复制快捷键',
  searchEyebrow: '寻找一个想法', searchIntro: '输入关键词，搜索文章标题与正文。',
  searchLabel: '搜索文章', searchPlaceholder: '例如：分库分表、ShardingSphere…',
  searchStart: '从一个关键词开始。', searching: '正在寻找相关文字…',
  searchFailure: '搜索暂时无法加载，请稍后重试，也可以先浏览归档。',
  searchDev: '本地开发模式未生成索引，请使用生产预览验证搜索。',
  retry: '重试', readPost: '阅读文章',
  noScript: '全文搜索需要 JavaScript。你也可以通过归档或标签查找文章。',
  listEyebrow: '给未来留一点期待', listIntro: '想做的事，慢慢去做。',
  listIntroTwo: '不急着填满 100 个，也不急着给人生交卷。',
  todo: '想做', doing: '进行中', done: '已完成', filter: '筛选清单',
  future: '其余留给未来', possibilities: '100 个可能',
  listClosing: '剩下的空白，留给还没遇见的自己。',
  noListMatch: '这个状态下暂时没有条目，想到了再慢慢补上。',
  listArticle: '相关记录', notFound: '页面未找到', detour: '一个小小的岔路',
  lost: '这页文字，好像走丢了。', lostIntro: '链接可能已经改变，或这段故事还没有写下。',
  home: '回到首页', viewBlog: '浏览文章',
};
const en: Record<keyof typeof zh, string> = {
  about: 'About', blog: 'Blog', archive: 'Archive', tags: 'Tags', search: 'Search',
  description: 'Notes on software, reading, and everyday life. A place to turn thoughts into words.',
  nav: 'Main navigation', skip: 'Skip to content', newWindow: ' (opens in a new tab)',
  switchLight: 'Switch to light theme', switchDark: 'Switch to dark theme',
  noTranslation: 'This article is not available in English yet', footer: 'Stay curious. Keep writing.',
  aboutEyebrow: 'A LITTLE ABOUT ME', introLine: 'Stay curious. About technology, and about life.',
  hello: 'Hello, and welcome to my little corner of the web.',
  introOne: 'I write about things I discover while building software, the engineering problems I think through, and the small moments that reading and everyday life leave behind.',
  introTwo: 'Writing helps me turn scattered thoughts into something clearer. I hope these pages leave a trace of where I have been—and, occasionally, offer someone else a useful thought.',
  personalLine: 'Think inward. Express freely.', profile: 'Profile', avatar: 'Kosa Tomoro’s avatar',
  born: 'Born', experience: 'Work experience', explore: 'Explore', readWriting: 'Read my writing', myList: 'My List100',
  blogEyebrow: 'WRITING & REFLECTIONS', blogIntro: 'Notes on building things, and on living a little more thoughtfully.',
  all: 'All', categories: 'Article categories', emptyTitle: 'More stories are on their way.',
  emptyIntro: 'New discoveries will find a home here.', otherWriting: 'Read other essays',
  byYear: 'Browse by year', browseTags: 'Browse tags', fullSearch: 'Search articles',
  archiveEyebrow: 'OVER THE YEARS', archiveIntro: 'A small record of thoughts along the way.',
  viewSummaries: 'View essays and summaries', noPosts: 'No essays have been published yet.',
  tagsEyebrow: 'FOLLOW YOUR CURIOSITY', tagsIntro: 'Follow a topic to find related writing.',
  noTags: 'Tags will appear when essays are published.', allTags: 'All tags', topic: 'TOPIC',
  allPosts: 'All essays', updated: 'Updated', contents: 'On this page', articleNav: 'Table of contents',
  thanks: 'Thank you for reading.', neighbors: 'Adjacent essays', previous: 'Previous', next: 'Next',
  returnBlog: 'Back to all essays', subscribe: 'Subscribe via RSS',
  copy: 'Copy code', copyLabel: 'Copy this code block', codeScroll: 'Code; scroll horizontally',
  copied: 'Copied ✓', copiedStatus: 'Code copied to the clipboard',
  manualCopy: 'Press Ctrl / ⌘ + C', manualCopyStatus: 'Code selected. Use your system copy shortcut.',
  searchEyebrow: 'FIND A THOUGHT', searchIntro: 'Search article titles and full text.',
  searchLabel: 'Search articles', searchPlaceholder: 'Try sharding, ShardingSphere, or curiosity…',
  searchStart: 'Start with a keyword.', searching: 'Looking for related writing…',
  searchFailure: 'Search could not load. Please try again, or browse the archive.',
  searchDev: 'The search index is not available in development mode. Use the production preview.',
  retry: 'Try again', readPost: 'Read essay',
  noScript: 'Full-text search requires JavaScript. You can also browse the archive or tags.',
  listEyebrow: 'THINGS TO LOOK FORWARD TO', listIntro: 'Things I would like to do, one at a time.',
  listIntroTwo: 'No rush to fill a hundred lines. No deadline for a life.',
  todo: 'To do', doing: 'In progress', done: 'Done', filter: 'Filter the list',
  future: 'Room for what comes next', possibilities: '100 possibilities',
  listClosing: 'The blank lines are for the person I have yet to become.',
  noListMatch: 'Nothing here yet. There is room for what comes next.',
  listArticle: 'Related writing', notFound: 'Page not found', detour: 'A SMALL DETOUR',
  lost: 'This page seems to have wandered off.', lostIntro: 'The link may have changed, or this story has not been written yet.',
  home: 'Back home', viewBlog: 'Browse essays',
};
export const copy = (locale: Locale) => locale === 'zh' ? zh : en;
export function searchMessage(count: number, query: string, locale: Locale) {
  if (!count) return locale === 'zh' ? `没有找到与「${query}」相关的文章，试试其他关键词。` : `No essays found for “${query}”. Try another keyword.`;
  return locale === 'zh' ? `找到 ${count} 篇文章${count > 30 ? '，显示前 30 篇' : ''}` : `Found ${count} ${count === 1 ? 'essay' : 'essays'}${count > 30 ? ' (showing the first 30)' : ''}.`;
}
