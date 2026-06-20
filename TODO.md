# TODO

## Self-host the pinned-repos fetch (replace third-party proxy)

The homepage "Featured Projects" section is upgraded at runtime by
`assets/js/pinned-projects.js`, which currently reads pinned repositories from
a **third-party** JSON proxy (`gh-pinned-repos.egoist.dev`, configured in
`_config.yml` under `pinned_repos.endpoint`). It's free and cached, but it
depends on someone else's uptime — if that service disappears, the homepage
silently falls back to the static `featured: true` projects in
`_data/projects.yml`.

**Plan:** stand up a tiny serverless proxy (Cloudflare Worker or Netlify
Function) that calls GitHub's GraphQL `pinnedItems` API with a free,
read-only token stored as a secret, returns JSON with permissive CORS, and
caches at the edge. Then just point `pinned_repos.endpoint` at it — no
client-side changes needed.

- GitHub GraphQL API + token: free (5,000 points/hour; a pinned query ~1).
- Token must stay server-side (never in browser JS).
- Response shape just needs: name, description, repo URL, primary language,
  stars (see `normalize()` in `assets/js/pinned-projects.js`).
