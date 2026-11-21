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

- Colour: `--bg`, `--surface`, `--soft`, `--code`, `--line`, `--line-strong`, `--text`, `--prose`, `--secondary`, `--muted`, `--accent`, `--gold`, `--on-gold`. Dark is `:root` (gold accent); light overrides sit under `:root[data-theme='light']` (brick-red accent). `--gold` is a fill and always carries `--on-gold` text: selection, `mark`, finished List100 cells, primary buttons.
- Contrast, in both themes: body text 7:1 or better, `--muted` and `--accent` text 4.5:1 or better, `--line-strong` 3:1 or better because form controls use it as their border. `--line` is for dividers only.
- Syntax colours are the `--astro-code-*` variables next to the palette. `astro.config.mjs` selects Shiki's `css-variables` theme, so code carries no inline theme colours; keep each token at 4.5:1 or better on `--code`.
- Type: `--fs-xs` 12, `--fs-sm` 13, `--fs-md` 15, `--fs-base` 16, `--fs-lg` 18, `--fs-xl` 22, `--fs-2xl` 28, `--fs-3xl` for page and article titles, `--fs-display` for the name on the home page. `--label` is the shorthand for small spaced labels, `--meta` for mono dates and counts. Nothing below 12px.
- Fonts: `--serif` for the brand, titles, section and prose headings, large numerals and blockquotes. `--sans` for body text, navigation, labels and buttons. `--mono` for dates, counts, tags, key hints and code. System fonts only, no webfonts. The serif stack ends in a sans CJK font on purpose, so Chinese on Windows never falls back to SimSun.
- Space: `--s-1`…`--s-9` (4, 8, 12, 16, 24, 32, 48, 72, 104). There is no border radius anywhere: corners are square, no pills or circles.
- Width: `--shell` 960px for header, footer and every page, and rows span the whole shell rather than a narrower left-aligned column. `--rail` 132px is the date/year column shared by post rows and the archive. Articles pair a 208px rail with the reading column; an article without headings becomes one centred 720px column.
- Background: `body` layers a top-right glow (`--glow`) and a paper grain (`--grain`, an inline SVG) over `--bg`. Article pages drop the glow because their header is sticky and opaque.
- Motifs: the sunrise mark (`Icon name="sunrise"`, also the favicon and the ornament that closes an article), 5px square marks (list bullets, timeline points, `hr`, the corners of the profile frame), short accent rules (eyebrows, prose `h2`), dotted leaders in the archive, and the List100 cell grid from `ListProgress.astro`. Entrance animations run only under `prefers-reduced-motion: no-preference`.
- Pages cross-fade through `@view-transition`, which is inlined in the head of `Base.astro` rather than kept in `global.css`: read from the external stylesheet, Chrome intermittently skipped the fade on pages with a module script and logged an unhandled rejection. Reduced motion switches the fade's animations off in `global.css`. The theme toggle fades with `document.startViewTransition` and catches the `ready` rejection of a skipped fade.
- Header links carry `data-key`; the script in `Header.astro` maps single keys to them and ignores keys typed in form fields or with modifiers. `/` focuses search. Only the search box shows its key hint (`.k`, hidden on touch).
- Breakpoints: 940px (narrower gutter, header wraps to two rows and stops following the reader on articles), 620px (single column; the article script also hard-codes this value). The widest header is the English one with Ideas enabled; re-measure it before moving the 940px breakpoint.
- `article.css` is imported by `ArticlePage.astro`, `ideas.css` by the two Ideas pages. Keep page-specific CSS out of `global.css` when it has its own file.

## Markup the tests depend on

`tests/artifacts.test.mjs` and `scripts/test-content.mjs` match built HTML with regexes. Restyle freely, but do not rename or reorder these without updating the tests on purpose:

- `nav.primary-nav` may contain only the page links in order, then GitHub last. The brand link stays outside it.
- Home: `aside.about-profile`, the exact `span.experience-job` markup, `p.intro-line`, avatar `src` before `alt`, and the inline theme script in `Base.astro` (the test matches its `'dark'` default).
- Article: `class="article-content has-toc"`, `body.article-page`, `.article-toc` before the element whose class is exactly `article-reading`, one "back to list" link, and equal `h2`/`h3` counts between the Chinese and English pages (do not add headings to article chrome).
- Lists: `class="post-row"` is counted; blog, archive and List100 must not gain `class="page-heading"`.
- List100: `li.life-item[data-status]` with `span.life-number` as its first child, and `span.status-mark` with its attribute order and ✓ / – / × characters. CSS hides those characters and draws a checkbox instead. The tests count `data-status`, so the cell grid marks its cells with classes; they also read the numbered grid as exactly 100 child spans that carry only a status class and a number. The entry counts, a few titles and the first three rows are hard-coded, so update them whenever the list or a status changes.
- Script hooks: `.theme-toggle`, `a.language-switch`, `.prose`, `.article-progress` and the `progress` inside it, `.share-copy`, `.article-toc`, `#search-form`, `#search-input`, `#search-status`, `#search-results`, `[data-*]` attributes and `.ideas-edit` on the Ideas pages.

## Visual QA

- Build, then `npm run preview -- --port <port>` and capture 390, 768 and 1440px in both themes and both locales. Keep screenshots and helper scripts under the ignored `.qa/`.
- Headless Chrome over the DevTools protocol works without extra dependencies: set the viewport with `Emulation.setDeviceMetricsOverride`, set `localStorage.theme` before the page loads to switch theme, and compare `scrollWidth` with `clientWidth` to catch horizontal overflow.
- Stop the preview server and the browser when finished.
- Real content has one post and no code block. To see code, tables, several years of posts or a post without headings, copy the project to a temporary directory outside the repository and add fixture posts there, the way `scripts/test-content.mjs` does. Do not add fixtures under `src/content/`.
- The Ideas link and pages only render with the Supabase variables. For layout checks, build that temporary copy with a placeholder URL on a closed local port and a placeholder `sb_publishable_` key: the pages then show their error state without contacting any service.

## Commits

- Subject in English, imperative, describing the user-visible change (see `git log`).
- Pushing to `main` deploys. Push only when asked, then confirm the Actions run and spot-check the live routes listed in `AGENTS.md`.
