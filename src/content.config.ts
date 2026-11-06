import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Date-only strings stay in the author's calendar rather than the build host's timezone.
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式为 YYYY-MM-DD')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, '日期不存在');

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: calendarDate,
    updated: calendarDate.optional(),
    category: z.enum(['技术', '生活']),
    tags: z.array(z.string().trim().min(1)).default([]),
    draft: z.boolean().default(true),
  }),
});

// English translations share their filename with the Chinese source. Metadata
// such as publication date, category and tags always comes from that source.
const translations = defineCollection({
  loader: glob({ base: './src/content/en', pattern: '*.md', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    draft: z.boolean().default(true),
  }),
});

export const collections = { blog, translations };
