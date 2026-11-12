// Imported only by Astro frontmatter. Only a verified publishable key is rendered.
const rawUrl = import.meta.env.PUBLIC_SUPABASE_URL?.trim();
const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

function readConfig() {
  if (!rawUrl || !key || !/^sb_publishable_[\w-]+$/.test(key)) return null;
  try {
    const url = new URL(rawUrl);
    const local = url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname);
    if ((!local && url.protocol !== 'https:') || url.username || url.password || url.search ||
        url.hash || url.pathname !== '/') return null;
    return { url: url.origin, key };
  } catch {
    return null;
  }
}

export const ideasConfig = readConfig();
