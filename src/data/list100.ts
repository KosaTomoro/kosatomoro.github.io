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
    description: {
      zh: '从这里开始，留下思考与生活的记录。',
      en: 'A place to leave a record of thoughts and everyday life.',
    },
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
    title: { zh: '去西班牙旅行', en: 'Travel to Spain' },
  },
  {
    id: 7, status: 'todo',
    title: { zh: '去意大利旅行', en: 'Travel to Italy' },
  },
  {
    id: 8, status: 'todo',
    title: { zh: '去日本旅行', en: 'Travel to Japan' },
  },
  {
    id: 9, status: 'todo',
    title: { zh: '去美国看看，调研美国为什么拥有如此丰富的创造力', en: 'Visit the United States and explore why it fosters so much creativity' },
  },
];
if (lifeList.length > 100 || new Set(lifeList.map(item => item.id)).size !== lifeList.length ||
  lifeList.some(item => !Number.isInteger(item.id) || item.id < 1 || item.id > 100)) {
  throw new Error('List100 IDs must be unique integers from 1 to 100.');
}
