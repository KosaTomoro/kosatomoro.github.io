import type { Locale } from '../i18n';
export type LifeStatus = 'todo' | 'doing' | 'done';
export interface LifeItem {
  id: number;
  status: LifeStatus;
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  completed?: string;
  post?: string;
}
// Only confirmed personal goals belong here. Keep IDs stable when sorting or editing.
export const lifeList: LifeItem[] = [
  {
    id: 1, status: 'done',
    title: { zh: '拥有自己的个人博客', en: 'Build a personal blog of my own' },
  },
  {
    id: 2, status: 'todo',
    title: { zh: '发布一款自己的 App', en: 'Release an app of my own' },
  },
  {
    id: 3, status: 'todo',
    title: { zh: '创造一个强大且非常了解自己的 AI', en: 'Build a powerful AI that knows me deeply' },
  },
  {
    id: 4, status: 'todo',
    title: { zh: '英语口语和听力达到可以与外国人正常交流的水平', en: 'Speak and understand English well enough to communicate comfortably with people from other countries' },
  },
  {
    id: 5, status: 'todo',
    title: { zh: '创造自己的课程并分享出来', en: 'Create and share a course of my own' },
  },
  {
    id: 6, status: 'todo',
    title: { zh: '去欧洲旅行', en: 'Travel to Europe' },
  },
  {
    id: 7, status: 'todo',
    title: { zh: '去北美旅行', en: 'Travel to North America' },
  },
  {
    id: 8, status: 'todo',
    title: { zh: '去日本旅行', en: 'Travel to Japan' },
  },
  {
    id: 9, status: 'todo',
    title: { zh: '居住在其他国家/地区', en: 'Live in another country/region' },
  },
  {
    id: 10, status: 'todo',
    title: { zh: '走完西班牙朝圣之路', en: 'Walk the Camino de Santiago in Spain' },
  },
  {
    id: 11, status: 'todo',
    title: { zh: '阅读1000本书', en: 'Read 1000 books' },
  },
  {
    id: 12, status: 'todo',
    title: { zh: '创办公司', en: 'Start a company' },
  },
  {
    id: 13, status: 'todo',
    title: { zh: '编写一首音乐', en: 'Compose a piece of music' },
  },
  {
    id: 14, status: 'done',
    title: { zh: '找到人生伴侣', en: 'Find the love of my life' },
  },
  {
    id: 15, status: 'todo',
    title: { zh: '出版自己写的书', en: 'Publish a book of my own' },
  },
  {
    id: 16, status: 'todo',
    title: { zh: '跟我爱人求婚并结婚', en: 'Propose to my partner and get married' },
  },
];
if (lifeList.length > 100 || new Set(lifeList.map(item => item.id)).size !== lifeList.length ||
  lifeList.some(item => !Number.isInteger(item.id) || item.id < 1 || item.id > 100)) {
  throw new Error('List100 IDs must be unique integers from 1 to 100.');
}
// Display order: finished first, then in progress, then not started, each group in ID order.
// The page and the cell grid number entries by their position here, so the numbering always
// runs 1, 2, 3… and changing a status moves an entry without touching any ID.
const statusRank: Record<LifeStatus, number> = { done: 0, doing: 1, todo: 2 };
export const orderedLifeList: LifeItem[] = [...lifeList].sort(
  (a, b) => statusRank[a.status] - statusRank[b.status] || a.id - b.id,
);
