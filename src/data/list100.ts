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
];
if (lifeList.length > 100 || new Set(lifeList.map(item => item.id)).size !== lifeList.length ||
  lifeList.some(item => !Number.isInteger(item.id) || item.id < 1 || item.id > 100)) {
  throw new Error('List100 IDs must be unique integers from 1 to 100.');
}
