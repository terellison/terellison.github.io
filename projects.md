---
title: Projects
permalink: /projects/
layout: page
wide: true
description: Things I've built — from .NET backends and libraries to systems experiments and games.
---

<div class="grid grid--2">
  {%- for project in site.data.projects -%}
    {% include project-card.html project=project %}
  {%- endfor -%}
</div>

<p class="text-muted" style="margin-top:2.5rem">
  More on my <a href="https://github.com/{{ site.author.github }}" target="_blank" rel="noopener">GitHub profile</a> →
</p>
