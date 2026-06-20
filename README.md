# dev.terellison.net

The portfolio and technical blog of **Terry Ellison** — a backend-focused
software developer working primarily in the .NET ecosystem.

Built with [Jekyll](https://jekyllrb.com) and deployed to GitHub Pages. Clean,
minimal design with automatic light/dark theming.

## Highlights

- **Portfolio** — projects, experience, and tech stack, driven by simple YAML.
- **Blog** — Markdown posts with tags, search, code highlighting, and RSS.
- **Easy authoring** — `bundle exec jekyll post "Title"` and start writing.
- **Light / dark** — respects system preference, remembers your choice.

## Quick start

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

## Project structure

```
_data/        projects, experience, skills, social, nav (edit these)
_includes/    head, nav, footer, icons, cards
_layouts/     default, home, page, post, 404
_posts/       blog posts (YYYY-MM-DD-title.md)
_sass/        design system (CSS-variable theming)
assets/       css, js, images, favicons
```

See **[AUTHORING.md](AUTHORING.md)** for the full writing and publishing
workflow.
