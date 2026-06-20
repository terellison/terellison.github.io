---
title: Blog
permalink: /blog/
layout: page
description: Notes on .NET, systems programming, and whatever I'm learning.
---

<div class="search-box">
  {% include icon.html name="search" %}
  <input type="search" id="search-input" placeholder="Search posts…" aria-label="Search posts" autocomplete="off" />
</div>

<ul id="search-results"></ul>

{%- if site.posts.size > 0 -%}
<div class="post-list" id="post-list">
  {%- for post in site.posts -%}
    {% include post-card.html post=post %}
  {%- endfor -%}
</div>
{%- else -%}
<div class="empty-state">
  <p>No posts yet — the first one is on its way.</p>
</div>
{%- endif -%}

<script src="{{ '/assets/js/search.min.js' | relative_url }}"></script>
<script>
  (function () {
    var input = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    var list = document.getElementById('post-list');
    if (!input || typeof SimpleJekyllSearch === 'undefined') return;

    SimpleJekyllSearch({
      searchInput: input,
      resultsContainer: results,
      json: '{{ "/assets/search.json" | relative_url }}',
      searchResultTemplate:
        '<article class="post-row"><time class="post-row__date">{date}</time>' +
        '<div class="post-row__body"><h3 class="post-row__title">' +
        '<a href="{url}">{title}</a></h3>' +
        '<p class="post-row__excerpt">{description}</p></div></article>',
      noResultsText: '<p class="text-muted">No matching posts.</p>'
    });

    // Hide the full list while a query is active.
    input.addEventListener('input', function () {
      if (list) list.style.display = input.value.trim() ? 'none' : '';
    });
  })();
</script>
