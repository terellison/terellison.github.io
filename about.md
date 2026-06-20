---
title: About
permalink: /about/
layout: page
wide: true
description: Tools & engine software engineer working in game development — Unreal Engine, Xbox, and full-stack .NET.
---

<div class="prose" style="max-width:680px">
  <p>{{ site.author.bio }}</p>
  <p>
    Outside of my day job I tinker across the stack — systems and graphics
    programming in C++, reverse-engineering experiments, the odd game, and
    libraries that scratch a specific itch. I care about clean abstractions,
    reliability, and owning code from the first commit to production.
  </p>
</div>

<section class="section">
  <div class="section-head"><h2>Experience</h2></div>
  <div class="timeline">
    {%- for item in site.data.experience.work -%}
    <div class="timeline-item">
      <div class="timeline-item__period">{{ item.period }}</div>
      <h3 class="timeline-item__role">{{ item.role }}</h3>
      {%- if item.org and item.org != "" -%}<div class="timeline-item__org">{{ item.org }}</div>{%- endif -%}
      {%- if item.detail -%}<p class="timeline-item__detail">{{ item.detail }}</p>{%- endif -%}
      {%- if item.bullets -%}
      <ul class="timeline-item__bullets">
        {%- for b in item.bullets -%}<li>{{ b }}</li>{%- endfor -%}
      </ul>
      {%- endif -%}
    </div>
    {%- endfor -%}
  </div>
</section>

<section class="section">
  <div class="section-head"><h2>Education</h2></div>
  <div class="timeline">
    {%- for item in site.data.experience.education -%}
    <div class="timeline-item">
      <div class="timeline-item__period">{{ item.period }}</div>
      <h3 class="timeline-item__role">{{ item.role }}</h3>
      {%- if item.org and item.org != "" -%}<div class="timeline-item__org">{{ item.org }}</div>{%- endif -%}
      {%- if item.detail -%}<p class="timeline-item__detail">{{ item.detail }}</p>{%- endif -%}
      {%- if item.bullets -%}
      <ul class="timeline-item__bullets">
        {%- for b in item.bullets -%}<li>{{ b }}</li>{%- endfor -%}
      </ul>
      {%- endif -%}
    </div>
    {%- endfor -%}
  </div>
</section>

{%- if site.data.experience.certifications and site.data.experience.certifications.size > 0 -%}
<section class="section">
  <div class="section-head"><h2>Certifications</h2></div>
  <div class="tech-list">
    {%- for cert in site.data.experience.certifications -%}
    <span class="tech-tag">{{ cert.name }}</span>
    {%- endfor -%}
  </div>
</section>
{%- endif -%}

<section class="section">
  <div class="section-head"><h2>Tech Stack</h2></div>
  <div class="skills-grid">
    {%- for group in site.data.skills -%}
    <div class="skill-group">
      <div class="skill-group__label">{{ group.group }}</div>
      <div class="tech-list">
        {%- for item in group.items -%}<span class="tech-tag">{{ item }}</span>{%- endfor -%}
      </div>
    </div>
    {%- endfor -%}
  </div>
</section>

<section class="section">
  <div class="section-head"><h2>Get in touch</h2></div>
  <p class="text-muted" style="max-width:560px">
    I'm always happy to talk shop, collaborate, or hear about interesting work.
    The fastest way to reach me is email or LinkedIn.
  </p>
  <div class="hero__actions" style="margin-top:1.25rem">
    {%- for link in site.data.social -%}
      {%- unless link.name == "RSS" -%}
      <a class="btn btn--ghost" href="{{ link.url }}"
        {% unless link.url contains "mailto" %}target="_blank" rel="noopener"{% endunless %}>
        {% include icon.html name=link.icon %} {{ link.name }}
      </a>
      {%- endunless -%}
    {%- endfor -%}
  </div>
</section>
