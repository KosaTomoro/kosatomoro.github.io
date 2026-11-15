# CLAUDE.md

@AGENTS.md

`AGENTS.md` is the source of truth for scope, content rules, validation and publishing. The notes below are working knowledge that it does not cover. This file is public: never put secrets, tokens, keys, personal contact details or machine-specific absolute paths in it.

## Local setup

- The shell may default to an older Node. Switch to the version in `.nvmrc` (Node 24) before any npm command, e.g. `nvm use`, or prepend the matching `~/.nvm/versions/node/v24.*/bin` to `PATH`.
- `npm run verify` is the single gate (check, build, Pagefind, artifact tests, content tests). Run it after the last edit, not before.
- `gh` may not be installed. The repository is public, so Actions status can be read from `https://api.github.com/repos/KosaTomoro/kosatomoro.github.io/actions/runs?head_sha=<sha>` without credentials.

## Secrets and private data

- Ideas uses `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` from an ignored `.env`. Never print, copy, commit or paste their values; `.env.example` holds names only.
- Without those variables the Ideas link is absent from the navigation and the page shows an unavailable state. That is expected locally.
- Do not read or stage untracked drafts under `src/content/` unless asked. Stage paths explicitly.

## Design system

All tokens live in `:root` in `src/styles/global.css`. Use them instead of raw values.

- Type: `--fs-xs` 12, `--fs-sm` 13, `--fs-md` 14, `--fs-base` 16, `--fs-lg` 18, `--fs-xl` 22, `--fs-2xl` 30, `--fs-display`. Nothing below 12px.
- Space: `--s-1`…`--s-8` (4, 8, 12, 16, 24, 32, 48, 72). Radius: `--r-sm`, `--r-md`, `--r-pill`.
- Width: `--shell` 920px for header, footer and every page; `.page-content` children cap at `--measure` 720px and stay left-aligned. `--rail` 96px is the date/year column shared by post rows and the archive.
- Colour: `--bg`, `--surface`, `--text`, `--prose`, `--secondary`, `--muted`, `--accent`, `--line`, `--soft`, `--code`. Dark is `:root`; light overrides sit under `:root[data-theme='light']`. Keep body text at 7:1 or better and `--muted` text at 4.5:1 or better in both themes.
- Fonts: `--serif` for display headings only (brand, page and article titles, post titles, years). `--sans` for body and UI. `--mono` for code only; dates and numbers use sans with `tabular-nums`. System fonts only, no webfonts.
- Breakpoints: 900px, 760px (header wraps to two rows), 620px (single column; the article script also hard-codes this value).
- `article.css` is imported by `ArticlePage.astro`, `ideas.css` by the two Ideas pages. Keep page-specific CSS out of `global.css` when it has its own file.

## Markup the tests depend on

`tests/artifacts.test.mjs` and `scripts/test-content.mjs` match built HTML with regexes. Restyle freely, but do not rename or reorder these without updating the tests on purpose:

- `nav.primary-nav` may contain only the page links in order, then GitHub last. The brand link stays outside it.
- Home: `aside.about-profile`, the exact `span.experience-job` markup, `p.intro-line`, avatar `src` before `alt`, and the inline theme script in `Base.astro` (the test matches its `'dark'` default).
- Article: `class="article-content has-toc"`, `body.article-page`, `.article-toc` before the body `.article-reading`, one "back to list" link, and equal `h2`/`h3` counts between the Chinese and English pages (do not add headings to article chrome).
- Lists: `class="post-row"` is counted; blog, archive and List100 must not gain `class="page-heading"`.
- List100: `li.life-item[data-status]` and `span.status-mark` with its attribute order and ✓ / – / × characters.
- Script hooks: `.theme-toggle`, `a.language-switch`, `.prose`, `.article-progress`, `#search-form`, `#search-input`, `#search-status`, `#search-results`, `[data-*]` attributes and `.ideas-edit` on the Ideas pages.

## Visual QA

- Build, then `npm run preview -- --port <port>` and capture 390, 768 and 1440px in both themes and both locales. Keep screenshots and helper scripts under the ignored `.qa/`.
- Headless Chrome over the DevTools protocol works without extra dependencies: set the viewport with `Emulation.setDeviceMetricsOverride`, set `localStorage.theme` before reloading to switch theme, and compare `scrollWidth` with `clientWidth` to catch horizontal overflow.
- Stop the preview server and the browser when finished.
- Known gaps in real content: no published post has a code block, so the copy button needs a temporary fixture to exercise; Ideas with data needs the Supabase variables.

## Commits

- Subject in English, imperative, describing the user-visible change (see `git log`).
- Pushing to `main` deploys. Push only when asked, then confirm the Actions run and spot-check the live routes listed in `AGENTS.md`.
