/*
 * Featured Projects — progressive enhancement.
 *
 * The homepage ships with a static set of "featured" project cards rendered
 * by Jekyll (the no-JS fallback). This script upgrades that grid at runtime
 * to mirror the repositories currently pinned on the GitHub profile.
 *
 * Why a proxy: GitHub doesn't expose pinned repositories through its
 * CORS-enabled REST API (they're GraphQL-only, which needs a token), and the
 * profile HTML can't be fetched cross-origin from the browser. So we read a
 * small public JSON proxy. Results are cached in localStorage with a TTL, and
 * a stale cache is reused if the network/proxy fails — keeping the page fast
 * and resilient to traffic spikes or proxy downtime. If everything fails, the
 * server-rendered fallback cards are left untouched.
 */
(function () {
  "use strict";

  var grid = document.getElementById("featured-projects");
  if (!grid) return;

  var user = grid.getAttribute("data-github-user");
  var endpointTpl = grid.getAttribute("data-pinned-endpoint");
  var ttlMinutes = parseInt(grid.getAttribute("data-pinned-ttl"), 10);
  if (!user || !endpointTpl) return; // disabled via config

  var ttlMs = (isNaN(ttlMinutes) ? 360 : ttlMinutes) * 60 * 1000;
  var endpoint = endpointTpl.replace("{user}", encodeURIComponent(user));
  var cacheKey = "pinned-repos:" + user;

  // ---- Inline icons (mirror _includes/icon.html) -----------
  var ICONS = {
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.9 6.1 21l1.2-6.5L2.5 9.9l6.6-.9 2.9-6Z"/></svg>',
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>',
    external:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
  };

  // ---- localStorage cache helpers --------------------------
  function readCache() {
    try {
      var raw = localStorage.getItem(cacheKey);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) return null;
      return parsed; // { ts, items }
    } catch (e) {
      return null;
    }
  }

  function writeCache(items) {
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ ts: Date.now(), items: items })
      );
    } catch (e) {
      /* quota / privacy mode — non-fatal */
    }
  }

  // ---- Normalize proxy payload to our card model -----------
  function normalize(raw) {
    var list = Array.isArray(raw) ? raw : raw && raw.repos;
    if (!Array.isArray(list)) return [];
    return list
      .map(function (r) {
        var stars = parseInt(r.stars, 10) || 0;
        var owner = r.owner || user;
        var repoName = r.repo || r.name || "";
        var item = {
          name: repoName,
          description: r.description || "",
          repo:
            r.link ||
            r.url ||
            "https://github.com/" + owner + "/" + repoName,
          tech: r.language ? [r.language] : []
        };
        if (stars > 0) item.stars = stars;
        var demo = r.website || r.homepage || r.homepageUrl;
        if (demo) item.demo = demo;
        return item;
      })
      .filter(function (i) {
        return i.name;
      });
  }

  // ---- Build a single card (DOM API, no innerHTML for data) -
  function iconSpan(className, name) {
    var span = document.createElement("span");
    span.className = className;
    span.innerHTML = ICONS[name]; // constant, safe
    return span;
  }

  function buildCard(p) {
    var article = document.createElement("article");
    article.className = "card card--link project-card";

    var top = document.createElement("div");
    top.className = "project-card__top";
    top.appendChild(iconSpan("project-card__icon", "code"));

    var links = document.createElement("span");
    links.className = "project-card__links";

    if (p.stars) {
      var star = document.createElement("span");
      star.className = "project-card__star";
      star.title = p.stars + " stars on GitHub";
      star.innerHTML = ICONS.star;
      star.appendChild(document.createTextNode(String(p.stars)));
      links.appendChild(star);
    }

    if (p.repo) {
      var gh = document.createElement("a");
      gh.href = p.repo;
      gh.target = "_blank";
      gh.rel = "noopener";
      gh.setAttribute("aria-label", p.name + " on GitHub");
      gh.innerHTML = ICONS.github;
      links.appendChild(gh);
    }

    if (p.demo) {
      var demo = document.createElement("a");
      demo.href = p.demo;
      demo.target = "_blank";
      demo.rel = "noopener";
      demo.setAttribute("aria-label", p.name + " live demo");
      demo.innerHTML = ICONS.external;
      links.appendChild(demo);
    }

    top.appendChild(links);
    article.appendChild(top);

    var title = document.createElement("h3");
    title.className = "project-card__title";
    title.textContent = p.name;
    article.appendChild(title);

    var desc = document.createElement("p");
    desc.className = "project-card__desc";
    desc.textContent = p.description;
    article.appendChild(desc);

    if (p.tech && p.tech.length) {
      var techList = document.createElement("div");
      techList.className = "tech-list";
      p.tech.forEach(function (t) {
        var tag = document.createElement("span");
        tag.className = "tech-tag";
        tag.textContent = t;
        techList.appendChild(tag);
      });
      article.appendChild(techList);
    }

    return article;
  }

  function render(items) {
    if (!items || !items.length) return;
    var frag = document.createDocumentFragment();
    items.forEach(function (p) {
      frag.appendChild(buildCard(p));
    });
    grid.innerHTML = "";
    grid.appendChild(frag);
  }

  // ---- Orchestrate: cache-first, then revalidate -----------
  var cache = readCache();
  if (cache && cache.items.length) render(cache.items);

  var isFresh = cache && Date.now() - cache.ts < ttlMs;
  if (isFresh) return; // nothing to do; static/cached cards stand

  fetch(endpoint, { headers: { Accept: "application/json" } })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      var items = normalize(data);
      if (!items.length) throw new Error("no pinned repositories");
      writeCache(items);
      render(items);
    })
    .catch(function () {
      // Network/proxy failed. A stale cache (if any) is already on screen;
      // otherwise the server-rendered fallback cards remain. Either way the
      // page stays usable.
    });
})();
