# Repository instructions

This repository is Kosa Tomoro's bilingual public blog at `https://kosatomoro.github.io/`. It is a static Astro site deployed by GitHub Actions. Preserve the quiet, personal-book-page direction: charcoal by default, warm off-white in light mode, muted green accents, restrained rules, generous whitespace, and reading-first typography. Do not copy Polebug assets, source, text, or its interactive house.

## Working agreement

- Use Node.js 24 from `.nvmrc` and npm. Keep `package-lock.json` committed.
- Work in this repository only. Never modify or delete `KosaTomoro/zhihuijie1.github.io`; it is only the source of the migrated short-link article.
- Keep the site static. Add client JavaScript only for necessary interactions. Do not add a server, database, analytics, comments, authentication, or CMS unless explicitly requested.
- Treat content under `src/content/` as potentially public. `draft: true` excludes content from builds but does not make a committed file private.
- Do not invent biography, employment, goals, achievements, projects, testimonials, metrics, or translations not grounded in user-provided content.
- Keep profile facts and site identity in `src/config.ts`, locale/UI text in `src/i18n.ts`, article schema in `src/content.config.ts`, and confirmed List100 entries in `src/data/list100.ts`.
- Preserve accessibility: semantic headings, keyboard navigation, visible focus, useful alternative text, reduced-motion behavior, and usable 390px layouts. Code and tables may scroll locally; the document must never scroll horizontally.

## Content and localization

- Chinese is the default locale at root paths. English uses the `/en/` prefix. Every public page needs appropriate `lang`, canonical, hreflang, Open Graph locale, and locale-specific RSS metadata.
- Keep Chinese UI copy idiomatic and English UI copy natural. Do not mix languages merely to mirror sentence structure. Established proper names and design labels such as List100 may remain unchanged.
- Create Chinese posts with `npm run new -- lowercase-slug`. Store them as top-level `src/content/blog/<slug>.md` files.
- Create translations with `npm run new -- lowercase-slug --en`. Store them as `src/content/en/<slug>.md`; the matching Chinese source must exist.
- The filename is the stable post ID and permanent URL. Do not rename a published source or translation without a redirect strategy.
- Chinese frontmatter requires `title`, `description`, quoted `date` in `YYYY-MM-DD`, `category` (`技术` or `生活`), `tags`, and `draft`; `updated` is optional.
- English frontmatter contains translated `title`, `description`, and `draft`. Date, category, tags, and updated date are inherited from the matching Chinese source.
- Keep dates as calendar strings rendered in `Asia/Shanghai`; do not convert them to JavaScript timestamps.
- A draft source, draft translation, or orphan translation must stay out of routes, lists, search, RSS, and sitemap. Articles lacking a translation must not expose a misleading language-switch link.
- Put post images in `public/images/posts/<slug>/`, prefer compressed WebP/JPEG/PNG, and use helpful locale-appropriate alt text with root-relative URLs.
- Do not restore Jekyll/Liquid syntax. The migrated short-link article must retain date 2025-03-16 and identical complete YAML blocks in both locales.

## List100

- Add only goals explicitly confirmed by the user; never use examples or invented ambitions to fill the page.
- IDs must be unique integers from 1 to 100 and remain stable after publication.
- Every item needs natural Chinese and English titles. Optional descriptions must also have both locales.
- Valid statuses are `todo`, `doing`, and `done`. Use `YYYY-MM-DD` for `completed`; `post` refers to a stable article slug.

## Code and design conventions

- Prefer Astro components, strict TypeScript, and native CSS. Do not add a UI framework or utility CSS package for small changes.
- Reuse `Base.astro`, `Header.astro`, shared page components, post helpers, locale helpers, and CSS variables rather than duplicating metadata, navigation, dates, colors, or spacing.
- Public internal page URLs have trailing slashes except file endpoints such as `/rss.xml` and `/robots.txt`.
- Production metadata must use `https://kosatomoro.github.io`. This user-site repository deploys at the domain root; do not add an Astro `base` path.
- Pagefind runs after Astro. It must index only published article detail pages and keep Chinese and English indexes separate through correct HTML `lang` attributes.
- Desktop articles use a left sticky table of contents and right reading column. Mobile articles use a compact collapsible table of contents above the body.
- The site defaults to dark mode; explicit theme choice persists locally. The locale switch uses the equivalent localized route and preserves search queries.
- External links opened in new tabs need `rel="noopener noreferrer"` and accessible new-window context where useful.
- Do not commit `dist/`, `.astro/`, `node_modules/`, `.qa/`, local environment files, credentials, tokens, browser artifacts, or unrequested local drafts.

## Required validation

Run `npm run verify` before committing or publishing. It must complete all of the following:

1. Astro/TypeScript diagnostics with zero errors.
2. Static production build and separate Pagefind indexes for Chinese and English.
3. Artifact tests for internal links, bilingual routes, hreflang, translated content, RSS, sitemap, List100, and search files.
4. Isolated content tests for unpaginated lists, sorting, adjacent posts, translation fallback, orphan/draft exclusion, and locale-isolated search.

For layout or interaction changes, inspect the production preview at 390px, 768px, and 1440px. Verify both locales, theme persistence, navigation, search, table-of-contents anchors, language switching, and code copying where relevant. Store temporary screenshots only under ignored `.qa/`.

## Publishing

- `main` is production. Pull requests run checks without deployment; pushes to `main` run checks and deploy GitHub Pages.
- Repository Pages source must remain GitHub Actions.
- Never bypass a failing check. Fix the cause and rerun `npm run verify` locally.
- Stage intended paths explicitly and inspect `git diff --cached`; do not use `git add .` when local drafts or QA artifacts may exist.
- After deployment, verify root, both locale roots, a direct article in each locale, search, locale RSS feeds, sitemap, and the Actions result.
- Roll back with `git revert <commit>` and push `main`. Never rewrite public history with force-push or `git reset --hard`.
