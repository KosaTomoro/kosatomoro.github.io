# Repository instructions

This repository is Kosa Tomoro's public personal blog at `https://kosatomoro.github.io/`. It is a static Astro site deployed by GitHub Actions. Preserve the quiet, typography-led visual direction: warm off-white and charcoal surfaces, muted green accents, generous whitespace, and a reading-first single column. Do not copy Polebug assets, source, text, or its interactive house.

## Working agreement

- Use Node.js 24 from `.nvmrc` and npm. Keep `package-lock.json` committed.
- Work in the existing repository. Do not modify or delete `KosaTomoro/zhihuijie1.github.io`; it is only the source of the one migrated article.
- Keep the site static. Add client JavaScript only for interactions that need it. Do not add a server, database, analytics, comments, authentication, or a CMS unless the user explicitly requests it.
- Treat everything in `src/content/blog/` as potentially public. `draft: true` excludes a post from the build but does not make its source private in a public repository.
- Keep user-facing copy in Chinese unless a small English label is part of the established design. Do not invent biography, employment history, achievements, projects, testimonials, or metrics.
- Keep site identity, social links, avatar path, and user-supplied profile facts in `src/config.ts`. Keep article schema and allowed categories in `src/content.config.ts`.
- Preserve accessibility: semantic heading order, keyboard navigation, visible focus, text alternatives, reduced-motion behavior, and usable 390px layouts. Code and tables may scroll inside their own containers; the document must not scroll horizontally.

## Content conventions

- Create posts with `npm run new -- lowercase-slug` or copy `templates/post.md`.
- Store posts as top-level `src/content/blog/<slug>.md` files. The filename is the permanent URL; do not rename a published post without adding a redirect strategy.
- Required frontmatter: `title`, `description`, quoted `date` in `YYYY-MM-DD`, `category` (`技术` or `生活`), `tags`, and `draft`. `updated` is optional and uses the same date format.
- Keep dates as calendar strings. The site renders them in `Asia/Shanghai`; do not convert frontmatter dates to JavaScript timestamps.
- Set `draft: false` only for content the user intends to publish. Drafts must stay out of routes, home, archive, tags, search, RSS, and sitemap.
- Put post images in `public/images/posts/<slug>/`, prefer compressed WebP/JPEG/PNG, and write useful Chinese alt text. Reference them with root-relative URLs.
- Do not restore Jekyll/Liquid syntax. The migrated short-link post must retain the 2025-03-16 date and its two complete YAML blocks.

## Code and design conventions

- Prefer Astro components, strict TypeScript, and native CSS. Avoid adding a UI framework or utility CSS package for small changes.
- Use the shared `Base.astro`, `Header.astro`, post helpers, and CSS variables rather than duplicating metadata, navigation, dates, colors, or spacing.
- All public internal URLs use trailing slashes except file endpoints such as `/rss.xml` and `/robots.txt`.
- Production metadata must use `https://kosatomoro.github.io`. The special user-site repository deploys at the domain root, so do not add an Astro `base` path.
- Search is generated after Astro by Pagefind. Restrict its index to published article detail pages and keep `lang="zh-CN"` for Chinese segmentation.
- External links that open new tabs need `rel="noopener noreferrer"` and accessible new-window context where useful.
- Do not commit `dist/`, `.astro/`, `node_modules/`, `.qa/`, local environment files, credentials, tokens, or browser artifacts.

## Required validation

Run `npm run verify` before committing or publishing. It must complete all of the following:

1. Astro/TypeScript diagnostics with zero errors.
2. Production static build and Pagefind Chinese index generation.
3. Built-artifact tests for internal links, migrated content, metadata, RSS, sitemap, and search files.
4. Isolated content integration tests for unpaginated lists, sorting, category pages, adjacent posts, and draft exclusion.

For layout or interaction changes, also inspect the production preview at 390px, 768px, and 1440px. Verify light/dark persistence, navigation, search, table-of-contents anchors, and code copying when relevant. Store temporary screenshots only under ignored `.qa/`.

## Publishing

- `main` is the production branch. Pull requests run checks without deploying; updates to `main` run checks and deploy GitHub Pages.
- The repository Settings → Pages source must be `GitHub Actions`.
- Never bypass a failing check. Fix the cause and rerun `npm run verify` locally.
- Roll back a published change with `git revert <commit>`, then push `main`. Do not rewrite public history with force-push or `git reset --hard`.
- After deployment, verify the root URL, a direct article URL, `/search/`, `/rss.xml`, and the Actions result.
