# Kosa Tomoro 的个人博客

中文个人博客，记录技术实践、阅读与生活。采用 Astro、TypeScript、原生 CSS 和 Pagefind，构建为静态文件，托管于 GitHub Pages。

正式地址：<https://kosatomoro.github.io/>。仓库：<https://github.com/KosaTomoro/kosatomoro.github.io>。

## 本地启动

需要 Node.js 24 和 npm。已安装 nvm 时：

```sh
nvm install
nvm use
npm ci
npm run dev
```

开发服务器一般在 `http://127.0.0.1:4321`。搜索索引在生产构建后生成；验证搜索、部署内容时使用：

```sh
npm run verify
npm run preview
```

`verify` 包含 Astro 类型检查、生产构建、中文搜索索引生成和构建产物检查。预览服务器端口以终端输出为准。

## 写一篇文章

```sh
npm run new -- my-first-post
```

编辑 `src/content/blog/my-first-post.md`，也可以复制 `templates/post.md`。文件名使用小写英文与短横线；它决定永久链接，改标题不会改链接。文章放在此目录的顶层，不嵌套目录。

```yaml
---
title: "一次值得记录的实践"
description: "这篇文章讲了什么，以及读者会收获什么。"
date: "2026-11-05"
category: 技术
tags: [Go, 分布式系统]
draft: false
---
```

- `date` 必须用引号包住，格式 `YYYY-MM-DD`，按上海时区展示。
- `category` 是 `技术` 或 `生活`；标签自由填写，建议简短。
- `draft: true` 不生成页面，也不进入搜索、订阅、归档和站点地图；确认可发布后改为 `false`。
- `updated: "2026-11-06"` 可选，用来注明实质更新日期。
- 草稿文件仍会随 Git 提交保存在公开仓库，`draft` 不是保密功能。暂不公开的内容请留在仓库外。
- 本地预览正文时也需要临时设置 `draft: false`；提交前自行恢复或正式发布。
- 标题自动形成目录，代码块注明语言即可高亮，页面会提供复制按钮。
- 使用 RSS 摘要订阅，读者点击标题可阅读全文。

### 插入图片

将图片放入 `public/images/posts/文章名/`，使用站点根路径引用：

```markdown
![图片的简短说明](/images/posts/my-first-post/diagram.webp)
```

优先使用适度压缩的 WebP、PNG 或 JPEG。宽图和表格会适配屏幕，代码超宽时局部滚动。

## 个性化配置

`src/config.ts` 集中维护姓名、简介、头像、GitHub 链接和项目清单；`src/styles/global.css` 中的 CSS 变量维护浅色与暗色主题。头像位于 `public/images/avatar.jpg`，来自自己的 GitHub 公开头像。

文章分类与分页配置位于 `src/lib/posts.ts`，默认每页 10 篇。旧文《短链接分库分表技术方案》迁移自 `KosaTomoro/zhihuijie1.github.io`；保留原始发布日期 2025-03-16，将 Liquid 标签页改成标准 Markdown 代码块。旧仓库不受影响。

设计借鉴 Polebug 的简洁阅读体验，本项目独立实现页面与样式，不使用对方文章、头像和互动场景。

## GitHub Pages 部署

首次部署：

1. 在 KosaTomoro 下创建公开仓库 `kosatomoro.github.io`，推送本项目到 `main`。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 在 Actions 页面查看 `Check and deploy blog` 工作流。若初次运行早于 Pages 启用，可在配置完成后重新运行。
4. 成功后访问 `https://kosatomoro.github.io/`，验证首页、文章和搜索。

后续发布：

```sh
npm run verify
git add .
git commit -m "Write a new post"
git push origin main
```

也可以直接在 GitHub 网页编辑 Markdown 并提交。PR 只检查、不发布；合入 `main` 后自动部署。只有全部检查通过才上传并发布构建产物。依赖锁文件必须一同提交。

若启用了分支保护，通过 PR 合并，不要强制推送绕过检查。

### 回滚

找到需要撤回的提交，执行 `git revert <commit-sha>` 并推送 `main`；工作流会重新构建并部署。不要用 `git reset --hard` 或强推改写历史来回滚线上版本。

### 更换域名

修改 `src/config.ts` 的 `url` 与 `astro.config.mjs` 的 `site`，添加 `public/CNAME`，再配置 GitHub Pages 和域名 DNS。当前按个人主页根路径部署，不需要配置仓库子路径。

## 检查项

- `npm run check`：类型与 Astro 模板检查。
- `npm run build`：生成 `dist` 与 Pagefind 中文索引。
- `npm test`：检查内部链接、文章迁移、RSS、站点地图、SEO 和页面输出。
- `npm run test:content`：在临时副本生成 13 篇已发布测试文章和 1 篇草稿，验证分页、分类、排序和草稿排除；不会修改真实文章。

无数据库、运行时 GitHub API 请求、评论服务或访客追踪。项目资料保存在本地配置，不依赖 GitHub 接口实时可用。
