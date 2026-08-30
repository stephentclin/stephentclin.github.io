# Stephen Lin React Portfolio

A React + Vite portfolio for GitHub Pages. It showcases full-stack engineering, industrial AI, automation, experience, study background, case studies, and skills.

## Edit content

- `src/data/profile.js`
- `src/data/projects.js`
- `src/data/experience.js`
- `src/data/education.js`
- `src/data/caseStudies.js`

Replace placeholder GitHub and email links before publishing.

## Add blog posts with Markdown

Create a new Markdown file under:

```text
src/content/blog/
```

Use this format:

```md
---
title: "My post title"
date: "2026-08-31"
slug: "my-post-title"
excerpt: "One short sentence that appears on the blog list."
tags: "React, AI, Study"
---

# My post title

Write your post here with Markdown.
```

The Blog page automatically lists every `.md` file in `src/content/blog`.

Supported article formatting includes headings, links, images, tables, task lists, blockquotes, ordered and unordered lists, inline code, and fenced code blocks.

Images can use files from `public/images`:

```md
![Alt text](/images/my-image.png)
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy free with GitHub Pages

1. Create a public repository, for example `your-username.github.io`.
2. Put these files at the repository root.
3. Push to the `main` branch.
4. In GitHub, go to `Settings` -> `Pages`.
5. Under `Build and deployment`, choose `GitHub Actions`.
6. The included workflow builds the React app and deploys `dist`.
