import { createClient } from '@supabase/supabase-js';
import { site } from '../config';
import { htmlLanguage, type Locale } from '../i18n';

export type Idea = {
  id: string;
  body: string;
  revision: number;
  updated_at: string;
  published_at: string | null;
};

type IdeasDatabase = {
  public: {
    Tables: {
      ideas: { Row: Idea; Insert: never; Update: never; Relationships: [] };
    };
    Views: Record<never, never>;
    Functions: {
      is_ideas_owner: { Args: Record<never, never>; Returns: boolean };
      delete_published_idea: { Args: { p_id: string }; Returns: undefined };
      write_idea: {
        Args: { p_id: string; p_body: string; p_publish: boolean; p_revision: number | null };
        Returns: Idea;
      };
    };
  };
};

export function connectIdeas(root: HTMLElement, author = false) {
  const { url, key } = root.dataset;
  if (!url || !key) return null;
  return createClient<IdeasDatabase>(url, key, {
    auth: {
      flowType: 'pkce',
      ...(author ? {} : { storageKey: 'ideas-public' }),
      persistSession: author,
      detectSessionInUrl: author,
      autoRefreshToken: author,
    },
  });
}

export async function signInToIdeas(client: NonNullable<ReturnType<typeof connectIdeas>>, redirectTo: string) {
  const { error } = await client.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } });
  if (error) throw error;
}

export const ideaColumns = 'id,body,revision,updated_at,published_at';

export function publishedIdeas(client: NonNullable<ReturnType<typeof connectIdeas>>) {
  return client.from('ideas').select(ideaColumns)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .order('id', { ascending: false });
}

export function ideaRow(idea: Idea, locale: Locale) {
  const row = document.createElement('li');
  const date = document.createElement('time');
  date.dateTime = idea.published_at ?? idea.updated_at;
  date.textContent = new Intl.DateTimeFormat(htmlLanguage(locale), {
    dateStyle: 'medium', timeZone: site.timezone,
  }).format(new Date(date.dateTime));
  const body = document.createElement('p');
  body.textContent = idea.body;
  body.dir = 'auto';
  row.append(date, body);
  return row;
}
