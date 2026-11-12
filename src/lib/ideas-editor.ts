import { getLocale, ideasCopy } from '../i18n';
import { connectIdeas, ideaColumns, ideaRow, publishedIdeas, type Idea } from './ideas-client';

export function initializeIdeasEditor(root: HTMLElement) {
  const connection = connectIdeas(root, true);
  if (!connection) return;
  const client = connection;

  const locale = getLocale(location.pathname);
  const t = ideasCopy(locale);
  const form = root.querySelector<HTMLFormElement>('form')!;
  const input = root.querySelector<HTMLTextAreaElement>('textarea')!;
  const authStatus = root.querySelector<HTMLElement>('[data-auth-status]')!;
  const feedback = root.querySelector<HTMLElement>('[data-feedback]')!;
  const panel = root.querySelector<HTMLElement>('[data-owner-panel]')!;
  const login = root.querySelector<HTMLButtonElement>('[data-login]')!;
  const logout = root.querySelector<HTMLButtonElement>('[data-logout]')!;
  const save = root.querySelector<HTMLButtonElement>('[data-save]')!;
  const publish = root.querySelector<HTMLButtonElement>('[data-publish]')!;
  const newIdea = root.querySelector<HTMLButtonElement>('[data-new]')!;
  const draftsList = root.querySelector<HTMLUListElement>('[data-drafts]')!;
  const feed = root.querySelector<HTMLUListElement>('[data-feed]')!;
  const emptyDrafts = root.querySelector<HTMLElement>('[data-empty-drafts]')!;
  const emptyFeed = root.querySelector<HTMLElement>('[data-empty-feed]')!;
  const recentLimit = 10;
  let drafts: Idea[] = [];
  let recent: Idea[] = [];
  let editing: Idea | undefined;
  let newId: string | undefined;
  let saving = false;
  let signedOut = false;

  function syncControls() {
    save.disabled = publish.disabled = saving || !input.value.trim();
    input.readOnly = saving;
    newIdea.hidden = !editing;
    newIdea.disabled = saving;
  }

  function edit(idea?: Idea) {
    if (saving) return;
    editing = idea;
    newId = undefined;
    input.value = idea?.body ?? '';
    feedback.textContent = idea ? t.editing : '';
    syncControls();
    input.focus();
  }

  function render() {
    emptyDrafts.hidden = drafts.length > 0;
    emptyFeed.hidden = recent.length > 0;
    draftsList.replaceChildren(...drafts.map(idea => {
      const row = ideaRow(idea, locale);
      const button = document.createElement('button');
      button.className = 'ideas-edit';
      button.type = 'button';
      button.textContent = t.edit;
      button.addEventListener('click', () => edit(idea));
      row.append(button);
      return row;
    }));
    feed.replaceChildren(...recent.map(idea => ideaRow(idea, locale)));
    syncControls();
  }

  async function load() {
    try {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (!data.session) {
        login.hidden = false;
        authStatus.textContent = location.search.includes('error=') ? t.loginError : t.loginPrompt;
        return;
      }

      logout.hidden = false;
      const owner = await client.rpc('is_ideas_owner');
      if (owner.error) throw owner.error;
      if (owner.data !== true) {
        authStatus.textContent = t.forbidden;
        return;
      }

      const [privateResult, publicResult] = await Promise.all([
        client.from('ideas').select(ideaColumns).is('published_at', null)
          .order('updated_at', { ascending: false }),
        publishedIdeas(client).limit(recentLimit),
      ]);
      if (privateResult.error || publicResult.error) throw privateResult.error ?? publicResult.error;
      if (signedOut) return;
      drafts = privateResult.data ?? [];
      recent = publicResult.data ?? [];
      render();
      authStatus.textContent = '';
      panel.hidden = false;
    } catch {
      if (!signedOut) authStatus.textContent = t.loadError;
    }
  }

  login.addEventListener('click', async () => {
    login.disabled = true;
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: location.origin + location.pathname },
      });
      if (error) throw error;
    } catch {
      login.disabled = false;
      authStatus.textContent = t.loginError;
    }
  });

  logout.addEventListener('click', async () => {
    logout.disabled = true;
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) throw error;
    } catch {
      logout.disabled = false;
      authStatus.textContent = t.logoutError;
    }
  });

  client.auth.onAuthStateChange(event => {
    if (event !== 'SIGNED_OUT') return;
    signedOut = true;
    panel.hidden = true;
    input.value = '';
    drafts = [];
    recent = [];
    editing = undefined;
    newId = undefined;
    render();
    logout.hidden = true;
    login.hidden = false;
    login.disabled = false;
    authStatus.textContent = t.loginPrompt;
  });

  input.addEventListener('input', () => {
    feedback.textContent = '';
    syncControls();
  });
  newIdea.addEventListener('click', () => edit());

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const body = input.value.trim();
    if (!body || saving || panel.hidden) return;
    const makePublic = event.submitter === publish;
    saving = true;
    syncControls();
    feedback.textContent = t.loading;
    try {
      const id = editing?.id ?? (newId ??= crypto.randomUUID());
      const { data, error } = await client.rpc('write_idea', {
        p_id: id,
        p_body: body,
        p_publish: makePublic,
        p_revision: editing?.revision ?? null,
      });
      if (signedOut) return;
      if (error || !data) {
        feedback.textContent = error?.code === '40001' ? t.conflict : t.writeError;
        return;
      }

      drafts = drafts.filter(idea => idea.id !== id);
      newId = undefined;
      if (makePublic) {
        recent = [data, ...recent.filter(idea => idea.id !== id)].slice(0, recentLimit);
        editing = undefined;
        input.value = '';
      } else {
        editing = data;
        drafts.unshift(data);
      }
      feedback.textContent = makePublic ? t.sent : t.saved;
      render();
    } catch {
      if (!signedOut) feedback.textContent = t.writeError;
    } finally {
      saving = false;
      syncControls();
    }
  });

  void load();
}
