# Kosa Tomoro 的个人博客

Kosa Tomoro 的中英文个人博客，记录技术实践、阅读与生活。站点使用 Astro、TypeScript、原生 CSS 和 Pagefind 构建为静态文件，通过 GitHub Actions 发布到 GitHub Pages。

- 正式地址：<https://kosatomoro.github.io/>
- 源码仓库：<https://github.com/KosaTomoro/kosatomoro.github.io>
- 中文位于根路径，英文位于 `/en/`
- 默认使用夜间模式，可在顶部切换主题与语言

## 本地启动

需要 Node.js 24 和 npm。已安装 nvm 时：

```sh
nvm install
nvm use
npm ci
npm run dev
```

开发服务器通常位于 `http://127.0.0.1:4321`。开发模式不会生成 Pagefind 索引；验证搜索和最终构建时使用：

```sh
npm run verify
npm run preview
```

`verify` 会依次执行 Astro 类型检查、生产构建、中英文搜索索引生成、构建产物检查和内容集成测试。

## 写一篇中文文章

```sh
npm run new -- my-first-post
```

编辑 `src/content/blog/my-first-post.md`，也可以复制 `templates/post.md`。文件名使用小写英文和短横线，它既是中英文文章的稳定 ID，也是永久链接的一部分；已发布后不要随标题一起修改。

```yaml
---
title: "一次值得记录的实践"
description: "这篇文章讲了什么，以及读者会收获什么。"
date: "2026-09-10"
category: 技术
tags: [Go, 分布式系统]
draft: false
---
```

- `date` 必须用引号包住，格式为 `YYYY-MM-DD`，按上海时区展示。
- `category` 只能是 `技术` 或 `生活`；标签可以自由填写。
- `updated: "2026-09-10"` 可选，用于注明实质更新日期。
- `draft: true` 不生成页面，也不会进入搜索、订阅、归档、标签或站点地图。
- `draft` 不是保密功能：提交到公开仓库的草稿仍可被看到，未公开内容请留在仓库外。
- Markdown 标题会生成文章目录；代码块注明语言即可获得高亮和复制按钮。

## 添加英文译文

英文译文必须与中文原文使用相同文件名：

```sh
npm run new -- my-first-post --en
```

编辑 `src/content/en/my-first-post.md`：

```yaml
---
title: "A Practice Worth Remembering"
description: "What happened, what changed, and what the reader can take away."
draft: false
---
```

英文译文会继承中文原文的日期、分类和标签。没有同名中文原文时，脚本不会创建译文；中文原文或英文译文仍为草稿时，该英文页面不会发布。文章没有译文时，语言按钮会显示为不可用，避免把读者带到错误页面。

Pagefind 会依据页面的 `lang` 分别生成中文与英文索引，因此英文搜索只返回英文文章，中文搜索只返回中文文章。

## 插入图片

将图片放在 `public/images/posts/<slug>/`，使用站点根路径引用：

```markdown
![图片的简短说明](/images/posts/my-first-post/diagram.webp)
```

优先使用适度压缩的 WebP、PNG 或 JPEG。宽图、表格和代码块只在自身容器内横向滚动，不应让整页产生横向滚动。

## 维护 List100

List100 页面位于 `/list-100/` 和 `/en/list-100/`，数据集中保存在 `src/data/list100.ts`。只添加本人已经确认的目标，不使用示例目标填充空位。每项 ID 必须是 1–100 之间的唯一整数，发布后保持稳定。

```ts
{
  id: 2,
  status: 'todo', // todo | doing | done
  title: { zh: '一件想做的事', en: 'Something I want to do' },
  description: { zh: '可选说明', en: 'Optional note' },
}
```

可选字段 `completed` 使用 `YYYY-MM-DD`，`post` 可填写关联文章的 slug。

## 个性化配置与设计

- `src/config.ts`：姓名、简介、头像、出生年月、工作经历和 GitHub 链接。
- `src/i18n.ts`：中英文界面文案、分类和标签译名。
- `src/styles/global.css`：站点主题、布局和响应式样式。
- `src/styles/article.css`：文章正文与目录样式。
- `public/images/avatar.jpg`：个人头像。

首页采用两栏个人介绍，文章页在宽屏使用左侧固定目录、右侧正文，在移动端将目录折叠到正文上方。文章列表不分页，一次展示全部已发布内容。设计借鉴 Polebug 的简洁导航、留白和阅读氛围，但页面、样式和内容均独立实现。

## 发布到 GitHub Pages

仓库 **Settings → Pages → Build and deployment → Source** 应选择 **GitHub Actions**。推送到 `main` 后，`Check and deploy blog` 工作流会检查、构建并部署；Pull Request 只检查，不发布。

发布前执行：

```sh
npm run verify
git status --short
git add README.md src/content/blog/my-first-post.md src/content/en/my-first-post.md
git diff --cached --check
git commit -m "Publish my first post"
git push origin main
```

请显式暂存本次需要的文件，不要习惯性使用 `git add .`，以免把本地草稿、截图或临时文件一起发布。依赖发生变化时记得提交 `package-lock.json`。

部署完成后检查首页、一个文章深层链接、中文与英文搜索、`/rss.xml`、`/en/rss.xml` 和站点地图。

### 回滚

找到需要撤回的提交，执行 `git revert <commit-sha>` 并推送 `main`；工作流会重新构建和部署。不要使用强制推送或 `git reset --hard` 改写线上历史。

### 更换域名

修改 `src/config.ts` 的 `url` 与 `astro.config.mjs` 的 `site`，添加 `public/CNAME`，再配置 GitHub Pages 和 DNS。当前个人主页仓库部署在域名根路径，不需要 Astro `base`。

## 检查命令

- `npm run check`：Astro 与 TypeScript 检查。
- `npm run build`：生成 `dist` 和 Pagefind 多语言索引。
- `npm test`：检查内部链接、双语路由、hreflang、迁移内容、RSS、站点地图、List100 和搜索文件。
- `npm run test:content`：在临时副本验证排序、相邻文章、翻译回退、搜索语言隔离，以及原文/译文草稿与孤立译文的排除。
- `npm run verify`：执行全部发布前检查。

站点不使用数据库、运行时 GitHub API、分析追踪、评论服务或写作后台。
