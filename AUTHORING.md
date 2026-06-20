# Authoring guide

Everything you need to run the site locally and publish new content.

## Run it locally

```bash
bundle install          # first time only
bundle exec jekyll serve # http://localhost:4000, live-reloads on save
```

## Write a new blog post

Posts live in `_posts/`. The fastest way to create one is the
[`jekyll-compose`](https://github.com/jekyll/jekyll-compose) command, which is
already set up:

```bash
bundle exec jekyll post "Your Post Title"
```

That scaffolds `_posts/YYYY-MM-DD-your-post-title.md` with the right front
matter. Open it and start writing. The front matter looks like this:

```yaml
---
layout: post
title: "Your Post Title"
description: "One-line summary used for SEO, social cards, and post previews."
tags: [dotnet, csharp]   # optional — power the /tags/ page and search
---
```

### Tips

- **Excerpts / "read more":** add `<!--more-->` after your opening paragraph.
  Everything above it becomes the preview shown on the home and blog pages.
- **Drafts:** `bundle exec jekyll draft "Idea"` creates a file in `_drafts/`.
  Preview drafts with `bundle exec jekyll serve --drafts`. Promote it with
  `bundle exec jekyll publish _drafts/idea.md`.
- **Images:** drop them next to the post or in `assets/img/` and reference with
  a normal Markdown image. (`jekyll-postfiles` keeps post-adjacent assets
  working.)
- **Code blocks** are syntax-highlighted automatically and adapt to light/dark.
- The post URL is `/blog/<slugified-title>/`.

## Manage projects, experience, and skills

These are data-driven — no templating required. Edit the YAML files in `_data/`:

| File              | Drives                                              |
| ----------------- | --------------------------------------------------- |
| `projects.yml`    | Cards on `/projects/` (set `featured: true` for home) |
| `experience.yml`  | Work + education timelines on `/about/`             |
| `skills.yml`      | Tech-stack groups on the home and about pages       |
| `social.yml`      | Social/contact links in the nav and footer          |
| `menus.yml`       | Primary navigation links                            |

## Publish

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the
site with Jekyll and deploys it to GitHub Pages.

> **One-time setup:** in the repo settings under **Settings → Pages**, set the
> build source to **GitHub Actions** (not "Deploy from a branch"). The custom
> domain (`dev.terellison.net`) is preserved via the `CNAME` file.
