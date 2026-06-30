# ECB Stylez — Shopify Theme: Complete Build Spec

A custom Shopify **Online Store 2.0** Liquid theme (silver & black, mobile-first, no paid apps). Below is the full structure and verbatim contents, followed by the two modifications to apply in the clone.

## 0. Stack & conventions (for the rebuilding AI)

- **Type:** Shopify OS 2.0 theme (JSON templates + sections + section groups).
- **No build step.** Plain CSS (`assets/base.css`) + vanilla JS (`assets/theme.js`). No `package.json`, no Node, no SCSS.
- **Fonts:** Inter via Google Fonts (loaded in `layout/theme.liquid`). No font files in repo.
- **Images:** None bundled. All imagery comes from Shopify CDN (theme settings `image_picker`) or `placeholder_svg_tag` fallbacks.
- **Color/font tokens:** injected as CSS custom properties in `layout/theme.liquid` `<style>` from `settings.*`; consumed by `assets/base.css`.
- **Content:** all merchant content lives in `templates/*.json` and section/block settings — nothing hardcoded.

---

## 1. Full directory tree (fully expanded)

```
/
├── README.md
├── assets/
│   ├── base.css
│   └── theme.js
├── config/
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/
│   └── theme.liquid
├── locales/
│   └── en.default.json
├── sections/
│   ├── about.liquid
│   ├── collection-grid.liquid
│   ├── contact-form.liquid
│   ├── footer-group.json
│   ├── footer.liquid
│   ├── gallery-slider.liquid
│   ├── gallery-teaser.liquid
│   ├── header-group.json
│   ├── header.liquid
│   ├── hero.liquid
│   ├── list-collections.liquid
│   ├── main-404.liquid
│   ├── main-cart.liquid
│   ├── main-product.liquid
│   ├── main-search.liquid
│   ├── page.liquid
│   ├── policies.liquid
│   ├── service-menu.liquid
│   ├── services-preview.liquid
│   └── social-proof.liquid
├── snippets/
│   ├── before-after.liquid
│   ├── price.liquid
│   ├── product-card.liquid
│   ├── product-row.liquid
│   └── service-row.liquid
└── templates/
    ├── 404.json
    ├── cart.json
    ├── collection.json
    ├── collection.services.json
    ├── index.json
    ├── list-collections.json
    ├── page.about.json
    ├── page.contact.json
    ├── page.gallery.json
    ├── page.json
    ├── page.policies.json
    ├── page.services.json
    ├── product.json
    └── search.json
```

**Asset folder structure:** `assets/` contains exactly two files — `base.css` and `theme.js`. There are **no** image, font, or icon files committed. The only icon assets in the codebase are *inline SVGs* (cart icon in `header.liquid`, butterfly data-URI in `base.css`, carousel arrows generated in `theme.js`) and `placeholder_svg_tag` fallbacks. Referenced external assets: Google Fonts (Inter), Shopify CDN images via `image_url`, and a Google Maps `<iframe>` stored in settings.

---

## 2. Layout

### `layout/theme.liquid`
```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="{{ settings.color_background }}">
    <link rel="canonical" href="{{ canonical_url }}">

    {%- if settings.logo -%}
      <link rel="icon" type="image/png" href="{{ settings.logo | image_url: width: 64 }}">
    {%- endif -%}

    <title>
      {{ page_title }}{% if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif %}{% if current_page != 1 %} &ndash; Page {{ current_page }}{% endif %}{% unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless %}
    </title>

    {%- if page_description -%}
      <meta name="description" content="{{ page_description | escape }}">
    {%- endif -%}

    {% comment %} Typography: Inter (loaded from Google Fonts) {% endcomment %}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap">

    {% comment %} Design tokens {% endcomment %}
    <style>
      :root {
        --color-bg: {{ settings.color_background }};
        --color-surface: {{ settings.color_surface }};
        --color-text: {{ settings.color_text }};
        --color-muted: {{ settings.color_muted }};
        --color-silver: {{ settings.color_silver }};
        --color-border: {{ settings.color_border }};
        --color-button-text: {{ settings.color_button_text }};
        --font-heading: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
        --font-body: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
        --font-heading-weight: 600;
        --page-width: 1200px;
      }
    </style>

    {{ content_for_header }}

    {{ 'base.css' | asset_url | stylesheet_tag }}
    <script src="{{ 'theme.js' | asset_url }}" defer="defer"></script>
  </head>

  <body class="template-{{ template.name }}">
    <a class="skip-to-content" href="#MainContent">{{ 'general.skip_to_content' | t }}</a>

    {% sections 'header-group' %}

    <main id="MainContent" role="main">
      {{ content_for_layout }}
    </main>

    {% sections 'footer-group' %}
  </body>
</html>
```

---

## 3. Assets

### `assets/base.css`
```css
/* ==========================================================================
   ECB Stylez — base styles
   Silver & black, mobile-first. Color/font tokens injected in theme.liquid.
   ========================================================================== */

/* Signature butterfly accent, reused as a CSS mask so it inherits color */
:root {
  --butterfly: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cg id='w' fill='%23cfcfd6' stroke='%231c1c22' stroke-width='1.2' stroke-linejoin='round'%3E%3Cpath d='M32 30C34 20 44 11 52 13 60 15 60 27 51 31 44 34 37 32 32 33Z'/%3E%3Cpath d='M32 34C38 35 47 38 49 45 51 52 45 56 39 54 34 52 32 44 32 39Z'/%3E%3C/g%3E%3Cuse href='%23w' transform='translate(64,0) scale(-1,1)'/%3E%3Cellipse cx='32' cy='33' rx='2.4' ry='12' fill='%231c1c22'/%3E%3Cg stroke='%23cfcfd6' stroke-width='1.5' fill='none' stroke-linecap='round'%3E%3Cpath d='M32 23C30 17 27 13 25 11'/%3E%3Cpath d='M32 23C34 17 37 13 39 11'/%3E%3C/g%3E%3Ccircle cx='25' cy='11' r='1.4' fill='%23cfcfd6'/%3E%3Ccircle cx='39' cy='11' r='1.4' fill='%23cfcfd6'/%3E%3Ccircle cx='46' cy='21' r='1.6' fill='%239a9aa3'/%3E%3Ccircle cx='18' cy='21' r='1.6' fill='%239a9aa3'/%3E%3C/svg%3E");
}

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

img, svg, iframe { display: block; max-width: 100%; }
img { height: auto; }

a { color: inherit; text-decoration: none; }
a:hover { color: var(--color-silver); }

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: var(--font-heading-weight);
  line-height: 1.15;
  margin: 0 0 .5em;
  letter-spacing: .01em;
}

h1 { font-size: clamp(2rem, 6vw, 3.5rem); }
h2 { font-size: clamp(1.6rem, 4vw, 2.4rem); }
h3 { font-size: clamp(1.2rem, 3vw, 1.5rem); }

p { margin: 0 0 1rem; }

.skip-to-content {
  position: absolute;
  left: -9999px;
}
.skip-to-content:focus {
  left: 1rem; top: 1rem;
  z-index: 1000;
  background: var(--color-silver);
  color: var(--color-button-text);
  padding: .5rem 1rem;
  border-radius: 4px;
}

/* Layout ------------------------------------------------------------------ */
.page-width {
  max-width: var(--page-width);
  margin-inline: auto;
  padding-inline: 1.25rem;
}

.section {
  padding-block: clamp(2.5rem, 7vw, 5rem);
}

.section__head {
  text-align: center;
  max-width: 640px;
  margin-inline: auto;
  margin-bottom: 2.5rem;
}
.section__head p { color: var(--color-muted); }

.eyebrow {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: .25em;
  font-size: .75rem;
  color: var(--color-silver);
  margin-bottom: .75rem;
}

/* Buttons ----------------------------------------------------------------- */
.btn {
  position: relative;
  display: inline-block;
  font-family: var(--font-heading);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: .85rem;
  padding: .85rem 1.75rem;
  border-radius: 2px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform .15s ease, background .2s ease, color .2s ease;
}
.btn:hover { transform: translateY(-1px); }
/* Signature butterfly pinned to the top-right corner, hanging off the edge */
.btn::after {
  content: "";
  position: absolute;
  top: -9px;
  right: -9px;
  width: 22px;
  height: 22px;
  background: var(--butterfly) no-repeat center / contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .55));
  transition: transform .2s ease;
  pointer-events: none;
}
.btn:hover::after { transform: rotate(-10deg) scale(1.08); }

.btn--primary {
  background: linear-gradient(135deg, #f4f4f6 0%, var(--color-silver) 55%, #8d8d92 100%);
  color: var(--color-button-text);
}
.btn--primary:hover { color: var(--color-button-text); filter: brightness(1.05); }

.btn--ghost {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}
.btn--ghost:hover { border-color: var(--color-silver); color: var(--color-text); }

.btn--small { padding: .55rem 1.1rem; font-size: .75rem; }

/* Header ------------------------------------------------------------------ */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 64px;
}
.header__logo img { width: auto; }
.header__logo-text {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.header__nav { display: none; }
.header__actions { display: flex; align-items: center; gap: .75rem; }
/* Book button hidden on mobile; the mobile menu keeps a Book link. Shown ≥990px. */
.header__book { display: none; }

.nav-list {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0; padding: 0;
}
.nav-list a {
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: .8rem;
}

.cart-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: var(--color-text);
}
.icon-cart { width: 24px; height: 24px; display: block; }
.cart-count {
  position: absolute;
  top: -7px;
  right: -9px;
  min-width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-silver);
  color: var(--color-button-text);
  border-radius: 999px;
  font-size: .62rem;
  font-weight: 600;
  padding: 0 .25rem;
}

.menu-toggle {
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: .25rem;
}
.menu-toggle span { width: 24px; height: 2px; background: var(--color-text); transition: .2s; }

.mobile-nav {
  display: none;
  border-top: 1px solid var(--color-border);
}
.mobile-nav.is-open { display: block; }
.mobile-nav ul { list-style: none; margin: 0; padding: .5rem 0; }
.mobile-nav a {
  display: block;
  padding: .85rem 1.25rem;
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: .85rem;
  border-bottom: 1px solid var(--color-border);
}

/* Hero -------------------------------------------------------------------- */
.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  text-align: center;
  overflow: hidden;
}
.hero__bg { position: absolute; inset: 0; }
.hero__bg img { width: 100%; height: 100%; object-fit: cover; }
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(10,10,10,.55), rgba(10,10,10,.85));
}
.hero__content { position: relative; z-index: 2; max-width: 720px; margin-inline: auto; }
.hero__content h1 { text-shadow: 0 2px 20px rgba(0,0,0,.5); }
.hero__content p { color: var(--color-text); font-size: 1.1rem; }
.hero__actions { display: flex; gap: .75rem; justify-content: center; flex-wrap: nowrap; margin-top: 1.5rem; }
.hero__actions .btn { flex: 1 1 0; min-width: 0; padding-left: .6rem; padding-right: .6rem; text-align: center; }
@media (min-width: 600px) {
  .hero__actions { flex-wrap: wrap; }
  .hero__actions .btn { flex: 0 1 auto; padding-left: 1.75rem; padding-right: 1.75rem; }
}

/* Card grids -------------------------------------------------------------- */
.grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1fr;
}
.grid--2 { grid-template-columns: 1fr; }
.grid--3 { grid-template-columns: 1fr; }
.grid--4 { grid-template-columns: repeat(2, 1fr); }

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color .2s ease, transform .2s ease;
}
.card:hover { border-color: var(--color-silver); transform: translateY(-2px); }
.card__media { aspect-ratio: 4 / 3; overflow: hidden; }
.card__media img { width: 100%; height: 100%; object-fit: cover; }
.card__body { padding: 1rem 1.1rem 1.25rem; }
.card__body h3 { margin-bottom: .35rem; }
.card__body p { color: var(--color-muted); font-size: .9rem; margin-bottom: .75rem; }

/* Product card ------------------------------------------------------------ */
.product-card__price { font-weight: 600; color: var(--color-silver); }
.product-card__title { font-size: 1rem; margin-bottom: .25rem; }

/* Collection filter ------------------------------------------------------- */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  justify-content: center;
  margin-bottom: 2rem;
}
.filter-bar a {
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: .45rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
}
.filter-bar a.is-active,
.filter-bar a:hover { border-color: var(--color-silver); color: var(--color-text); }

/* Service menu ------------------------------------------------------------ */
.service-category { margin-bottom: 2.5rem; }
.service-category > h3 {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: .5rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-silver);
  text-transform: uppercase;
  letter-spacing: .12em;
}
.service-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--color-border);
}
.service-row__media { flex: 0 0 auto; }
.service-row__media img,
.service-row__media svg {
  width: 64px;
  height: 64px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  display: block;
}
a.service-row__name { color: var(--color-text); }
a.service-row__name:hover { color: var(--color-silver); }
.service-row__info { flex: 1 1 auto; min-width: 0; }
.service-row__name { font-family: var(--font-heading); font-weight: 600; }
.service-row__meta { color: var(--color-muted); font-size: .85rem; margin-top: .15rem; }
.service-row__notes { color: var(--color-muted); font-size: .8rem; font-style: italic; margin-top: .35rem; }
.service-row__end {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .5rem;
}
.service-row__price { font-weight: 600; color: var(--color-silver); white-space: nowrap; }

/* Gallery slider ---------------------------------------------------------- */
.gallery-group { margin-bottom: 3rem; }
.gallery-group__title {
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--color-silver);
  margin-bottom: 1rem;
}
.slider {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem;
}
.slider::-webkit-scrollbar { height: 6px; }
.slider::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 999px; }
.slider__item {
  flex: 0 0 85%;
  scroll-snap-align: start;
}
.ba-figure { margin: 0; }
.ba-figure__caption {
  margin-top: .6rem;
  color: var(--color-muted);
  font-size: .85rem;
  text-align: center;
}
.ba {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  user-select: none;
  touch-action: pan-y;
}
.ba__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ba__img svg { width: 100%; height: 100%; }
/* Reveal the "before" image from the left up to the handle position */
.ba__before { clip-path: inset(0 calc(100% - var(--pos, 50%)) 0 0); }
.ba__tag {
  position: absolute;
  top: .5rem;
  z-index: 3;
  background: rgba(10, 10, 10, .7);
  color: var(--color-silver);
  font-size: .65rem;
  text-transform: uppercase;
  letter-spacing: .1em;
  padding: .2rem .5rem;
  border-radius: 3px;
  pointer-events: none;
}
.ba__tag--before { left: .5rem; }
.ba__tag--after { right: .5rem; }
.ba__divider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pos, 50%);
  width: 2px;
  background: var(--color-silver);
  transform: translateX(-1px);
  z-index: 3;
  pointer-events: none;
}
/* The drag handle IS a butterfly shape (no circle) */
.ba__handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: var(--butterfly) no-repeat center / contain;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, .7));
}
.ba__range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;
  z-index: 4;
}
.ba__range:focus-visible + .ba__tag,
.ba:focus-within .ba__divider { box-shadow: 0 0 0 2px var(--color-silver); }

/* Slider carousel navigation (injected by theme.js) */
.slider-nav {
  display: flex;
  justify-content: flex-end;
  gap: .5rem;
  margin-top: .75rem;
}
.slider-nav button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color .2s ease;
}
.slider-nav button:hover { border-color: var(--color-silver); }
.slider-nav button[disabled] { opacity: .35; cursor: default; }

/* About ------------------------------------------------------------------- */
.about {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  align-items: center;
}
.about__media img { border-radius: 6px; width: 100%; object-fit: cover; }

/* Policies (accordion) ---------------------------------------------------- */
.policy {
  border-bottom: 1px solid var(--color-border);
}
.policy summary {
  cursor: pointer;
  list-style: none;
  padding: 1.1rem 0;
  font-family: var(--font-heading);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: .04em;
}
.policy summary::-webkit-details-marker { display: none; }
.policy summary::after { content: "+"; color: var(--color-silver); font-size: 1.5rem; line-height: 1; }
.policy[open] summary::after { content: "–"; }
.policy__content { padding-bottom: 1.25rem; color: var(--color-muted); }

/* Contact ----------------------------------------------------------------- */
.contact {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: 1fr;
}
.field { margin-bottom: 1.1rem; }
.field label {
  display: block;
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--color-muted);
  margin-bottom: .4rem;
}
.field input,
.field textarea {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  padding: .75rem .9rem;
  font: inherit;
}
.field input:focus,
.field textarea:focus { outline: none; border-color: var(--color-silver); }
.contact__info p { margin-bottom: .5rem; }
.contact__info a { color: var(--color-silver); }
.form-success {
  background: var(--color-surface);
  border: 1px solid var(--color-silver);
  border-radius: 4px;
  padding: .9rem 1rem;
  margin-bottom: 1rem;
}
.map-embed { position: relative; width: 100%; aspect-ratio: 1 / 1; }
.map-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; border-radius: 6px; }

/* Booking / deposit on product page */
.deposit-tag {
  display: inline-block;
  margin-left: .4rem;
  font-size: .7rem;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--color-button-text);
  background: var(--color-silver);
  border-radius: 999px;
  padding: .1rem .5rem;
  vertical-align: middle;
}
.booking-note {
  color: var(--color-muted);
  font-size: .9rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-silver);
  border-radius: 4px;
  padding: .75rem .9rem;
  margin: 0 0 1.1rem;
}
.booking-note--small { font-size: .8rem; margin-top: 1rem; border-left-width: 2px; }

/* Social proof ------------------------------------------------------------ */
.reviews { display: grid; gap: 1.25rem; grid-template-columns: 1fr; }
.review {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1.5rem;
}
.review__stars { color: var(--color-silver); letter-spacing: .15em; margin-bottom: .5rem; }
.review__author { color: var(--color-muted); font-size: .85rem; margin-top: .75rem; }
.social-cta { text-align: center; margin-top: 2rem; }

/* Footer ------------------------------------------------------------------ */
.footer {
  border-top: 1px solid var(--color-border);
  padding-block: 3rem 2rem;
  background: var(--color-surface);
}
.footer__grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}
.footer h4 {
  text-transform: uppercase;
  letter-spacing: .12em;
  font-size: .8rem;
  color: var(--color-silver);
  margin-bottom: 1rem;
}
.footer ul { list-style: none; margin: 0; padding: 0; }
.footer li { margin-bottom: .5rem; }
.footer a { color: var(--color-muted); font-size: .9rem; }
.footer a:hover { color: var(--color-text); }
.footer__hours { color: var(--color-muted); font-size: .9rem; white-space: pre-line; }
.footer__bottom {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
  color: var(--color-muted);
  font-size: .8rem;
}
.footer__social { display: flex; gap: 1rem; }

/* Cart -------------------------------------------------------------------- */
.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
}
.cart-item img { border-radius: 4px; }
.cart__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Responsive -------------------------------------------------------------- */
@media (min-width: 750px) {
  .grid--2 { grid-template-columns: repeat(2, 1fr); }
  .grid--3 { grid-template-columns: repeat(3, 1fr); }
  .reviews { grid-template-columns: repeat(3, 1fr); }
  .slider__item { flex-basis: 48%; }
  .about { grid-template-columns: 1fr 1fr; }
  .contact { grid-template-columns: 1fr 1fr; }
  .footer__grid { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 990px) {
  .header__nav { display: block; }
  .header__book { display: inline-block; }
  .menu-toggle { display: none; }
  .grid--4 { grid-template-columns: repeat(4, 1fr); }
  .slider__item { flex-basis: 32%; }
}
```

### `assets/theme.js`
```js
/* ECB Stylez — lightweight theme interactions (no dependencies) */
(function () {
  'use strict';

  // Mobile nav toggle
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-menu-toggle]');
    if (toggle) {
      var nav = document.getElementById('MobileNav');
      if (nav) {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }
  });

  // Smooth-scroll for in-page anchors (e.g. "Select" -> contact form)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Before/after comparison sliders
  function initCompare(ba) {
    var range = ba.querySelector('[data-ba-range]');
    if (!range) return;
    var update = function () { ba.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', update);
    update();
  }

  // Carousel arrows for horizontal scroll sliders
  function initSlider(slider) {
    if (slider.dataset.navReady) return;
    if (slider.scrollWidth <= slider.clientWidth + 4) return;
    slider.dataset.navReady = 'true';

    var nav = document.createElement('div');
    nav.className = 'slider-nav';
    var prev = document.createElement('button');
    var next = document.createElement('button');
    prev.type = next.type = 'button';
    prev.innerHTML = '‹';
    next.innerHTML = '›';
    prev.setAttribute('aria-label', 'Previous');
    next.setAttribute('aria-label', 'Next');
    nav.appendChild(prev);
    nav.appendChild(next);
    slider.parentNode.insertBefore(nav, slider.nextSibling);

    var step = function () { return Math.max(slider.clientWidth * 0.8, 240); };
    prev.addEventListener('click', function () { slider.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { slider.scrollBy({ left: step(), behavior: 'smooth' }); });

    var sync = function () {
      prev.disabled = slider.scrollLeft <= 2;
      next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 2;
    };
    slider.addEventListener('scroll', sync, { passive: true });
    sync();
  }

  // Product variant selection: keep variant id, price and availability in sync
  function initProductForm(form) {
    var dataEl = form.querySelector('[data-variants]');
    var selects = form.querySelectorAll('[data-option-selector]');
    if (!dataEl || selects.length === 0) return; // single-variant: server value is correct

    var variants;
    try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var idInput = form.querySelector('[data-variant-id]');
    var priceEl = form.parentNode.querySelector('[data-price]');
    var btn = form.querySelector('[data-add-button]');

    function update() {
      var chosen = Array.prototype.map.call(selects, function (s) { return s.value; });
      var match = null;
      for (var i = 0; i < variants.length; i++) {
        var v = variants[i];
        if (v.options.length === chosen.length && v.options.every(function (o, idx) { return o === chosen[idx]; })) {
          match = v;
          break;
        }
      }
      if (match) {
        if (idInput) idInput.value = match.id;
        if (priceEl) priceEl.textContent = match.price;
        if (btn) {
          btn.disabled = !match.available;
          btn.textContent = match.available ? btn.dataset.addText : btn.dataset.soldText;
        }
      } else if (btn) {
        btn.disabled = true;
        btn.textContent = btn.dataset.soldText;
      }
    }

    Array.prototype.forEach.call(selects, function (s) { s.addEventListener('change', update); });
    update();
  }

  function init() {
    document.querySelectorAll('[data-ba]').forEach(initCompare);
    document.querySelectorAll('.slider').forEach(initSlider);
    document.querySelectorAll('[data-variants]').forEach(function (el) {
      var form = el.closest('form');
      if (form) initProductForm(form);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Re-init in Shopify theme editor when sections re-render
  document.addEventListener('shopify:section:load', init);
})();
```

---

## 4. Config

### `config/settings_schema.json`
```json
[
  {
    "name": "theme_info",
    "theme_name": "ECB Stylez",
    "theme_version": "1.0.0",
    "theme_author": "Custom",
    "theme_documentation_url": "https://shopify.dev",
    "theme_support_url": "https://shopify.dev"
  },
  {
    "name": "Brand",
    "settings": [
      { "type": "image_picker", "id": "logo", "label": "Logo image" },
      { "type": "range", "id": "logo_width", "min": 80, "max": 320, "step": 10, "unit": "px", "label": "Logo width", "default": 160 },
      { "type": "text", "id": "business_name", "label": "Business name", "default": "ECB Stylez" },
      { "type": "text", "id": "tagline", "label": "Tagline", "default": "Premium braids & installs" }
    ]
  },
  {
    "name": "Colors",
    "settings": [
      { "type": "header", "content": "Silver & black palette" },
      { "type": "color", "id": "color_background", "label": "Background", "default": "#0a0a0a" },
      { "type": "color", "id": "color_surface", "label": "Surface / cards", "default": "#141414" },
      { "type": "color", "id": "color_text", "label": "Text", "default": "#f2f2f2" },
      { "type": "color", "id": "color_muted", "label": "Muted text", "default": "#a8a8a8" },
      { "type": "color", "id": "color_silver", "label": "Silver accent", "default": "#c8c8cc" },
      { "type": "color", "id": "color_border", "label": "Borders / hairlines", "default": "#2a2a2a" },
      { "type": "color", "id": "color_button_text", "label": "Button text", "default": "#0a0a0a" }
    ]
  },
  {
    "name": "Typography",
    "settings": [
      { "type": "paragraph", "content": "Typography uses the Inter font family, loaded in the theme. No setting needed." }
    ]
  },
  {
    "name": "Contact & Social",
    "settings": [
      { "type": "text", "id": "phone", "label": "Phone number" },
      { "type": "text", "id": "email", "label": "Email address" },
      { "type": "url", "id": "instagram_url", "label": "Instagram URL", "default": "https://www.instagram.com/theecbstylez/" },
      { "type": "url", "id": "facebook_url", "label": "Facebook URL" },
      { "type": "url", "id": "booking_url", "label": "Default booking URL", "info": "Fallback link used by service \"Select\" buttons and main Book CTA when no specific link is set." }
    ]
  },
  {
    "name": "Location & Hours",
    "settings": [
      { "type": "text", "id": "location_text", "label": "Location text", "default": "Delaware State University x New Castle" },
      { "type": "textarea", "id": "business_hours", "label": "Business hours", "info": "One line per day, e.g. \"Mon–Sat: 9am–10pm\".", "default": "Mon–Sat: 9am–10pm\nSun: Closed" },
      { "type": "html", "id": "map_embed", "label": "Google Map embed", "info": "Paste the <iframe> embed code from Google Maps > Share > Embed a map." }
    ]
  }
]
```
> *Note: condensed onto single lines for readability; original uses multi-line objects. Field IDs, types, defaults, and order are exact.*

### `config/settings_data.json`
```json
{
  "current": {
    "logo_width": 160,
    "business_name": "ECB Stylez",
    "tagline": "Premium braids & installs",
    "color_background": "#000000",
    "color_surface": "#141414",
    "color_text": "#f2f2f2",
    "color_muted": "#a8a8a8",
    "color_silver": "#c8c8cc",
    "color_border": "#2a2a2a",
    "color_button_text": "#0a0a0a",
    "font_heading": "assistant_n4",
    "font_body": "assistant_n4",
    "instagram_url": "https://www.instagram.com/theecbstylez/",
    "location_text": "Delaware State University x New Castle",
    "business_hours": "Mon–Sat: 9am–10pm\nSun: Closed",
    "map_embed": "<iframe src=\"https://www.google.com/maps/embed?pb=...\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>",
    "content_for_index": [],
    "blocks": {
      "9278379683843197553": {
        "type": "shopify://apps/appointo/blocks/app-embed/8e9086b8-9c22-4cd3-b1d1-0967727a5d97",
        "disabled": false,
        "settings": {}
      },
      "3886181796285292942": {
        "type": "shopify://apps/cowlendar-booking/blocks/app-embed/6d8b8f6a-9b3c-42b8-b2e6-a758c38d45bf",
        "disabled": true,
        "settings": {}
      }
    }
  },
  "presets": { "Default": {} }
}
```
> *The `map_embed` value is truncated above only for readability; in the real file it contains the full Google Maps iframe URL. This file is auto-generated by the Shopify editor — header comment block omitted here.*

---

## 5. Section groups (JSON)

### `sections/header-group.json`
```json
{
  "type": "header",
  "name": "Header group",
  "sections": {
    "header": {
      "type": "header",
      "blocks": {
        "home":     { "type": "link", "settings": { "label": "Home", "url": "/" } },
        "shop":     { "type": "link", "settings": { "label": "Shop", "url": "/collections/all" } },
        "services": { "type": "link", "settings": { "label": "Services", "url": "/collections/services" } },
        "gallery":  { "type": "link", "settings": { "label": "Gallery", "url": "/pages/gallery" } },
        "about":    { "type": "link", "settings": { "label": "About", "url": "/pages/about" } },
        "contact":  { "type": "link", "settings": { "label": "Contact", "url": "/pages/contact" } }
      },
      "block_order": ["home", "shop", "services", "gallery", "about", "contact"],
      "settings": {
        "show_book_button": true,
        "book_label": "Book now",
        "book_link": "",
        "show_account": true,
        "account_label": "Member Login"
      }
    }
  },
  "order": ["header"]
}
```

### `sections/footer-group.json`
```json
{
  "type": "footer",
  "name": "Footer group",
  "sections": {
    "footer": {
      "type": "footer",
      "blocks": {
        "services": { "type": "link", "settings": { "label": "Services", "url": "/pages/services" } },
        "gallery":  { "type": "link", "settings": { "label": "Gallery", "url": "/pages/gallery" } },
        "about":    { "type": "link", "settings": { "label": "About", "url": "/pages/about" } },
        "policies": { "type": "link", "settings": { "label": "Policies", "url": "/pages/policies" } },
        "contact":  { "type": "link", "settings": { "label": "Contact", "url": "/pages/contact" } }
      },
      "block_order": ["services", "gallery", "about", "policies", "contact"],
      "settings": { "menu_title": "Explore", "copyright_extra": "site by srtxrp" }
    }
  },
  "order": ["footer"]
}
```

---

## 6. Sections (Liquid)

### `sections/header.liquid`
```liquid
<header class="header">
  <div class="page-width header__inner">
    <a class="header__logo" href="{{ routes.root_url }}">
      {%- if settings.logo -%}
        <img
          src="{{ settings.logo | image_url: width: settings.logo_width | times: 2 }}"
          alt="{{ settings.business_name | escape }}"
          width="{{ settings.logo_width }}"
          style="width: {{ settings.logo_width }}px;">
      {%- else -%}
        <span class="header__logo-text">{{ settings.business_name }}</span>
      {%- endif -%}
    </a>

    <nav class="header__nav" aria-label="Primary">
      <ul class="nav-list">
        {%- for block in section.blocks -%}
          {%- if block.type == 'link' -%}
            <li {{ block.shopify_attributes }}><a href="{{ block.settings.url | default: '#' }}">{{ block.settings.label }}</a></li>
          {%- endif -%}
        {%- endfor -%}
        {%- if section.settings.show_account -%}
          <li><a href="{{ routes.account_url }}">{{ section.settings.account_label }}</a></li>
        {%- endif -%}
      </ul>
    </nav>

    <div class="header__actions">
      {%- if section.settings.show_book_button -%}
        <a class="btn btn--primary btn--small header__book" href="{{ section.settings.book_link | default: settings.booking_url | default: '#' }}">
          {{ section.settings.book_label }}
        </a>
      {%- endif -%}
      <a class="cart-link" href="{{ routes.cart_url }}" aria-label="{{ 'cart.title' | t }}">
        <svg class="icon-cart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        {%- if cart.item_count > 0 -%}
          <span class="cart-count">{{ cart.item_count }}</span>
        {%- endif -%}
      </a>
      <button
        class="menu-toggle"
        type="button"
        data-menu-toggle
        aria-expanded="false"
        aria-controls="MobileNav"
        aria-label="{{ 'general.menu' | t }}">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <nav class="mobile-nav" id="MobileNav" aria-label="Mobile">
    <ul>
      {%- for block in section.blocks -%}
        {%- if block.type == 'link' -%}
          <li {{ block.shopify_attributes }}><a href="{{ block.settings.url | default: '#' }}">{{ block.settings.label }}</a></li>
        {%- endif -%}
      {%- endfor -%}
      {%- if section.settings.show_account -%}
        <li><a href="{{ routes.account_url }}">{{ section.settings.account_label }}</a></li>
      {%- endif -%}
      {%- if section.settings.show_book_button -%}
        <li><a href="{{ section.settings.book_link | default: settings.booking_url | default: '#' }}">{{ section.settings.book_label }}</a></li>
      {%- endif -%}
    </ul>
  </nav>
</header>

{% schema %}
{
  "name": "Header",
  "settings": [
    { "type": "checkbox", "id": "show_book_button", "label": "Show booking button", "default": true },
    { "type": "text", "id": "book_label", "label": "Booking button label", "default": "Book now" },
    { "type": "url", "id": "book_link", "label": "Booking button link", "info": "Falls back to the default booking URL in Theme settings > Contact & Social." },
    { "type": "header", "content": "Member account" },
    { "type": "checkbox", "id": "show_account", "label": "Show Member Login link", "default": true },
    { "type": "text", "id": "account_label", "label": "Member Login label", "default": "Member Login" }
  ],
  "blocks": [
    {
      "type": "link",
      "name": "Nav link",
      "settings": [
        { "type": "text", "id": "label", "label": "Label", "default": "Page" },
        { "type": "url", "id": "url", "label": "Link" }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/footer.liquid`
```liquid
<footer class="footer">
  <div class="page-width">
    <div class="footer__grid">
      <div class="footer__col">
        <h4>{{ settings.business_name }}</h4>
        {%- if settings.location_text != blank -%}
          <p class="footer__hours">{{ settings.location_text }}</p>
        {%- endif -%}
        {%- if settings.phone != blank -%}
          <p><a href="tel:{{ settings.phone | strip }}">{{ settings.phone }}</a></p>
        {%- endif -%}
        {%- if settings.email != blank -%}
          <p><a href="mailto:{{ settings.email }}">{{ settings.email }}</a></p>
        {%- endif -%}
        <div class="footer__social">
          {%- if settings.instagram_url != blank -%}<a href="{{ settings.instagram_url }}">Instagram</a>{%- endif -%}
          {%- if settings.facebook_url != blank -%}<a href="{{ settings.facebook_url }}">Facebook</a>{%- endif -%}
        </div>
      </div>

      <div class="footer__col">
        <h4>{{ section.settings.menu_title }}</h4>
        <ul>
          {%- for block in section.blocks -%}
            {%- if block.type == 'link' -%}
              <li {{ block.shopify_attributes }}><a href="{{ block.settings.url | default: '#' }}">{{ block.settings.label }}</a></li>
            {%- endif -%}
          {%- endfor -%}
        </ul>
      </div>

      <div class="footer__col">
        <h4>Hours</h4>
        <p class="footer__hours">{{ settings.business_hours }}</p>
      </div>

      <div class="footer__col">
        <h4>Find us</h4>
        {%- if settings.map_embed != blank -%}
          <div class="map-embed">{{ settings.map_embed }}</div>
        {%- endif -%}
        {%- if settings.location_text != blank -%}
          <p class="footer__hours">{{ settings.location_text }}</p>
        {%- endif -%}
      </div>
    </div>

    <div class="footer__bottom">
      &copy; {{ 'now' | date: '%Y' }} {{ settings.business_name }}. {{ section.settings.copyright_extra }}
    </div>
  </div>
</footer>

{% schema %}
{
  "name": "Footer",
  "settings": [
    { "type": "text", "id": "menu_title", "label": "Links column title", "default": "Explore" },
    { "type": "text", "id": "copyright_extra", "label": "Extra copyright text" }
  ],
  "blocks": [
    {
      "type": "link",
      "name": "Footer link",
      "settings": [
        { "type": "text", "id": "label", "label": "Label", "default": "Page" },
        { "type": "url", "id": "url", "label": "Link" }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/hero.liquid`
```liquid
<section class="hero">
  {%- if section.settings.image -%}
    <div class="hero__bg">
      <img
        src="{{ section.settings.image | image_url: width: 1800 }}"
        srcset="{{ section.settings.image | image_url: width: 900 }} 900w, {{ section.settings.image | image_url: width: 1800 }} 1800w"
        sizes="100vw"
        alt="{{ section.settings.image.alt | escape }}"
        width="1800"
        height="1012"
        fetchpriority="high">
    </div>
  {%- endif -%}

  <div class="page-width hero__content">
    {%- if section.settings.eyebrow != blank -%}
      <span class="eyebrow">{{ section.settings.eyebrow }}</span>
    {%- endif -%}
    <h1>{{ section.settings.heading }}</h1>
    {%- if section.settings.subheading != blank -%}
      <p>{{ section.settings.subheading }}</p>
    {%- endif -%}
    <div class="hero__actions">
      {%- if section.settings.button_label != blank -%}
        <a class="btn btn--primary" href="{{ section.settings.button_link | default: settings.booking_url | default: '#' }}">
          {{ section.settings.button_label }}
        </a>
      {%- endif -%}
      {%- if section.settings.button2_label != blank -%}
        <a class="btn btn--ghost" href="{{ section.settings.button2_link | default: '/collections/services' }}">
          {{ section.settings.button2_label }}
        </a>
      {%- endif -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Hero",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Background image" },
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "ECB Stylez" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Braids & installs, done right" },
    { "type": "textarea", "id": "subheading", "label": "Subheading", "default": "Premium hair styling with a clean, modern finish. Book your appointment today." },
    { "type": "text", "id": "button_label", "label": "Primary button label", "default": "Book now" },
    { "type": "url", "id": "button_link", "label": "Primary button link", "info": "Falls back to the default booking URL." },
    { "type": "text", "id": "button2_label", "label": "Secondary button label", "default": "View services" },
    { "type": "url", "id": "button2_link", "label": "Secondary button link" }
  ],
  "presets": [{ "name": "Hero" }]
}
{% endschema %}
```

### `sections/about.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="about">
      <div class="about__media">
        {%- if section.settings.image -%}
          <img src="{{ section.settings.image | image_url: width: 800 }}" alt="{{ section.settings.heading | escape }}" loading="lazy" width="800" height="900">
        {%- else -%}
          {{ 'image' | placeholder_svg_tag: 'about__media' }}
        {%- endif -%}
      </div>
      <div class="about__text">
        {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
        <h2>{{ section.settings.heading }}</h2>
        <div class="rte">{{ section.settings.bio }}</div>
        {%- if section.settings.button_label != blank -%}
          <a class="btn btn--primary" href="{{ section.settings.button_link | default: settings.booking_url | default: '#' }}" style="margin-top:1rem">{{ section.settings.button_label }}</a>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "About",
  "settings": [
    { "type": "image_picker", "id": "image", "label": "Photo" },
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "About" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Meet your stylist" },
    { "type": "richtext", "id": "bio", "label": "Bio", "default": "<p>Tell clients who you are, your experience, and what makes your styling special.</p>" },
    { "type": "text", "id": "button_label", "label": "Button label", "default": "Book with me" },
    { "type": "url", "id": "button_link", "label": "Button link" }
  ],
  "presets": [{ "name": "About" }]
}
{% endschema %}
```

### `sections/collection-grid.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="section__head">
      <h1>{{ collection.title | default: section.settings.heading }}</h1>
      {%- if collection.description != blank -%}
        <div class="rte">{{ collection.description }}</div>
      {%- elsif section.settings.subheading != blank -%}
        <p>{{ section.settings.subheading }}</p>
      {%- endif -%}
    </div>

    {%- if section.settings.filter_menu != blank and section.settings.filter_menu.links.size > 0 -%}
      <nav class="filter-bar" aria-label="Filter by category">
        <a href="{{ routes.all_products_collection_url }}" {% if template.name == 'list-collections' or collection.handle == blank %}class="is-active"{% endif %}>
          {{ section.settings.all_label }}
        </a>
        {%- for link in section.settings.filter_menu.links -%}
          <a href="{{ link.url }}" {% if link.active %}class="is-active"{% endif %}>{{ link.title }}</a>
        {%- endfor -%}
      </nav>
    {%- endif -%}

    {%- paginate collection.products by 12 -%}
      {%- if collection.products.size > 0 -%}
        {%- if section.settings.layout == 'list' -%}
          <div class="service-list">
            {%- for product in collection.products -%}
              {% render 'product-row', product: product, button_label: section.settings.button_label %}
            {%- endfor -%}
          </div>
        {%- else -%}
          <div class="grid grid--4">
            {%- for product in collection.products -%}
              {% render 'product-card', product: product %}
            {%- endfor -%}
          </div>
        {%- endif -%}

        {%- if paginate.pages > 1 -%}
          <div class="social-cta">
            {%- if paginate.previous -%}<a class="btn btn--ghost btn--small" href="{{ paginate.previous.url }}">Previous</a>{%- endif -%}
            {%- if paginate.next -%}<a class="btn btn--ghost btn--small" href="{{ paginate.next.url }}">Next</a>{%- endif -%}
          </div>
        {%- endif -%}
      {%- else -%}
        <p style="text-align:center;color:var(--color-muted)">No products here yet.</p>
      {%- endif -%}
    {%- endpaginate -%}
  </div>
</section>

{% schema %}
{
  "name": "Product grid",
  "settings": [
    {
      "type": "select",
      "id": "layout",
      "label": "Layout",
      "options": [
        { "value": "grid", "label": "Grid (cards)" },
        { "value": "list", "label": "List (Booksy-style rows)" }
      ],
      "default": "grid",
      "info": "Use List for service-style products: photo, name, price and a Book button per row."
    },
    { "type": "text", "id": "button_label", "label": "List button label", "default": "Book" },
    { "type": "text", "id": "heading", "label": "Fallback heading", "default": "Shop" },
    { "type": "textarea", "id": "subheading", "label": "Subheading" },
    { "type": "link_list", "id": "filter_menu", "label": "Category filter menu", "info": "Link a menu of collections to show as filter tabs." },
    { "type": "text", "id": "all_label", "label": "\"All\" tab label", "default": "All" }
  ]
}
{% endschema %}
```

### `sections/contact-form.liquid`
```liquid
<section class="section" id="contact-form">
  <div class="page-width">
    <div class="section__head">
      {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
      <h2>{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<p>{{ section.settings.subheading }}</p>{%- endif -%}
    </div>

    <div class="contact">
      <div class="contact__form">
        {%- form 'contact', id: 'ContactForm' -%}
          {%- if form.posted_successfully? -%}
            <p class="form-success">{{ 'contact.success' | t }}</p>
          {%- endif -%}
          {%- if form.errors -%}
            <p class="form-success" style="border-color:#c0392b">{{ form.errors | default_errors }}</p>
          {%- endif -%}
          <div class="field">
            <label for="ContactName">{{ 'contact.name' | t }}</label>
            <input type="text" id="ContactName" name="contact[name]" value="{{ form.name }}" required>
          </div>
          <div class="field">
            <label for="ContactEmail">{{ 'contact.email' | t }}</label>
            <input type="email" id="ContactEmail" name="contact[email]" value="{{ form.email }}" required>
          </div>
          <div class="field">
            <label for="ContactMessage">{{ 'contact.message' | t }}</label>
            <textarea id="ContactMessage" name="contact[body]" rows="5" required>{{ form.body }}</textarea>
          </div>
          <button type="submit" class="btn btn--primary">{{ 'contact.send' | t }}</button>
        {%- endform -%}
      </div>

      <div class="contact__info">
        {%- if settings.phone != blank -%}<p>Phone: <a href="tel:{{ settings.phone | strip }}">{{ settings.phone }}</a></p>{%- endif -%}
        {%- if settings.email != blank -%}<p>Email: <a href="mailto:{{ settings.email }}">{{ settings.email }}</a></p>{%- endif -%}
        {%- if settings.instagram_url != blank -%}<p>Instagram: <a href="{{ settings.instagram_url }}">{{ section.settings.instagram_handle | default: 'Follow us' }}</a></p>{%- endif -%}
        {%- if settings.facebook_url != blank -%}<p>Facebook: <a href="{{ settings.facebook_url }}">{{ section.settings.facebook_handle | default: 'Find us' }}</a></p>{%- endif -%}
        {%- if settings.location_text != blank -%}<p>{{ settings.location_text }}</p>{%- endif -%}

        {%- if settings.map_embed != blank -%}
          <div class="map-embed" style="margin-top:1rem">{{ settings.map_embed }}</div>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Contact form",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Contact" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Get in touch" },
    { "type": "textarea", "id": "subheading", "label": "Subheading", "default": "Questions before booking? Send a message." },
    { "type": "text", "id": "instagram_handle", "label": "Instagram handle text", "default": "@theecbstylez" },
    { "type": "text", "id": "facebook_handle", "label": "Facebook label text" }
  ],
  "presets": [{ "name": "Contact form" }]
}
{% endschema %}
```

### `sections/gallery-slider.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="section__head">
      {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
      <h2>{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<p>{{ section.settings.subheading }}</p>{%- endif -%}
    </div>

    {%- liquid
      assign open_group = false
    -%}
    {%- for block in section.blocks -%}
      {%- case block.type -%}
        {%- when 'group' -%}
          {%- if open_group -%}</div></div>{%- endif -%}
          <div class="gallery-group" {{ block.shopify_attributes }}>
            <h3 class="gallery-group__title">{{ block.settings.title }}</h3>
            <div class="slider">
          {%- assign open_group = true -%}
        {%- when 'pair' -%}
          {%- unless open_group -%}<div class="gallery-group"><div class="slider">{%- assign open_group = true -%}{%- endunless -%}
          <div class="slider__item">
            {% render 'before-after',
              before: block.settings.before_image,
              after: block.settings.after_image,
              caption: block.settings.caption %}
          </div>
      {%- endcase -%}
    {%- endfor -%}
    {%- if open_group -%}</div></div>{%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Gallery",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Gallery" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Our work" },
    { "type": "textarea", "id": "subheading", "label": "Subheading", "default": "Before & after, grouped by service." }
  ],
  "blocks": [
    {
      "type": "group",
      "name": "Group heading",
      "settings": [
        { "type": "text", "id": "title", "label": "Group title", "default": "Knotless" }
      ]
    },
    {
      "type": "pair",
      "name": "Before/after",
      "settings": [
        { "type": "image_picker", "id": "before_image", "label": "Before image" },
        { "type": "image_picker", "id": "after_image", "label": "After image" },
        { "type": "text", "id": "caption", "label": "Caption" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Gallery",
      "blocks": [
        { "type": "group", "settings": { "title": "Knotless" } },
        { "type": "pair" },
        { "type": "pair" },
        { "type": "group", "settings": { "title": "Sew-In" } },
        { "type": "pair" },
        { "type": "group", "settings": { "title": "Wig Install" } },
        { "type": "pair" }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/gallery-teaser.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="section__head">
      {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
      <h2>{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<p>{{ section.settings.subheading }}</p>{%- endif -%}
    </div>

    <div class="slider">
      {%- for block in section.blocks -%}
        <div class="slider__item" {{ block.shopify_attributes }}>
          {% render 'before-after',
            before: block.settings.before_image,
            after: block.settings.after_image,
            caption: block.settings.caption %}
        </div>
      {%- endfor -%}
    </div>

    {%- if section.settings.button_label != blank -%}
      <div class="social-cta">
        <a class="btn btn--ghost" href="{{ section.settings.button_link | default: '#' }}">{{ section.settings.button_label }}</a>
      </div>
    {%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Gallery teaser",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Gallery" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Before & after" },
    { "type": "textarea", "id": "subheading", "label": "Subheading" },
    { "type": "text", "id": "button_label", "label": "Button label", "default": "View full gallery" },
    { "type": "url", "id": "button_link", "label": "Button link" }
  ],
  "blocks": [
    {
      "type": "pair",
      "name": "Before/after",
      "settings": [
        { "type": "image_picker", "id": "before_image", "label": "Before image" },
        { "type": "image_picker", "id": "after_image", "label": "After image" },
        { "type": "text", "id": "caption", "label": "Caption" }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [
    { "name": "Gallery teaser", "blocks": [{ "type": "pair" }, { "type": "pair" }, { "type": "pair" }] }
  ]
}
{% endschema %}
```

### `sections/list-collections.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="section__head">
      <h1>{{ section.settings.heading }}</h1>
    </div>
    <div class="grid grid--3">
      {%- for collection in collections -%}
        <a class="card" href="{{ collection.url }}">
          <div class="card__media">
            {%- if collection.featured_image -%}
              <img src="{{ collection.featured_image | image_url: width: 600 }}" alt="{{ collection.title | escape }}" loading="lazy" width="600" height="450">
            {%- else -%}
              {{ 'collection-1' | placeholder_svg_tag: 'card__media' }}
            {%- endif -%}
          </div>
          <div class="card__body"><h3>{{ collection.title }}</h3></div>
        </a>
      {%- endfor -%}
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Collections list",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Shop by category" }
  ]
}
{% endschema %}
```

### `sections/main-404.liquid`
```liquid
<section class="section">
  <div class="page-width" style="text-align:center">
    <h1>404</h1>
    <p style="color:var(--color-muted)">The page you’re looking for can’t be found.</p>
    <a class="btn btn--primary" href="{{ routes.root_url }}">Back home</a>
  </div>
</section>

{% schema %}
{ "name": "404", "settings": [] }
{% endschema %}
```

### `sections/main-cart.liquid`
```liquid
<section class="section">
  <div class="page-width" style="max-width:820px">
    <h1>{{ 'cart.title' | t }}</h1>

    {%- if cart.item_count > 0 -%}
      {%- form 'cart', cart -%}
        {%- for item in cart.items -%}
          <div class="cart-item">
            <a href="{{ item.url }}">
              {%- if item.image -%}
                <img src="{{ item.image | image_url: width: 160 }}" alt="{{ item.title | escape }}" width="80" height="80">
              {%- endif -%}
            </a>
            <div>
              <a href="{{ item.url }}"><strong>{{ item.product.title }}</strong></a>
              {%- unless item.variant.title contains 'Default' -%}
                <div class="service-row__meta">{{ item.variant.title }}</div>
              {%- endunless -%}
              <div class="service-row__meta">{{ item.final_price | money }}</div>
              <a href="{{ item.url_to_remove }}" class="service-row__meta">{{ 'cart.remove' | t }}</a>
            </div>
            <div class="field" style="margin:0;width:72px">
              <input type="number" name="updates[]" value="{{ item.quantity }}" min="0" aria-label="{{ 'cart.quantity' | t }}">
            </div>
          </div>
        {%- endfor -%}

        <div class="cart__footer">
          <div>
            <button type="submit" name="update" class="btn btn--ghost btn--small">Update</button>
          </div>
          <div style="text-align:right">
            <p style="margin:0"><strong>{{ 'cart.subtotal' | t }}: {{ cart.total_price | money }}</strong></p>
            <button type="submit" name="checkout" class="btn btn--primary" style="margin-top:.5rem">{{ 'cart.checkout' | t }}</button>
          </div>
        </div>
      {%- endform -%}
    {%- else -%}
      <p style="color:var(--color-muted)">{{ 'cart.empty' | t }}</p>
      <a class="btn btn--primary" href="{{ routes.all_products_collection_url }}">{{ 'cart.continue_shopping' | t }}</a>
    {%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Cart",
  "settings": []
}
{% endschema %}
```

### `sections/main-product.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="about">
      <div class="about__media">
        {%- if product.featured_image -%}
          <img src="{{ product.featured_image | image_url: width: 900 }}" alt="{{ product.featured_image.alt | default: product.title | escape }}" width="900" height="900">
        {%- else -%}
          {{ 'product-1' | placeholder_svg_tag: 'about__media' }}
        {%- endif -%}
      </div>
      <div class="about__text">
        {%- assign booking_tag = section.settings.booking_tag | default: 'booking' -%}
        {%- assign is_booking = false -%}
        {%- if product.tags contains booking_tag -%}{%- assign is_booking = true -%}{%- endif -%}
        {%- assign deposit_note = product.metafields.custom.deposit_note | default: section.settings.deposit_note -%}

        <h1>{{ product.title }}</h1>
        <p class="product-card__price" style="font-size:1.4rem" data-price>
          {{ product.selected_or_first_available_variant.price | money }}
          {%- if is_booking -%}<span class="deposit-tag">deposit</span>{%- endif -%}
        </p>

        {%- if is_booking and deposit_note != blank -%}
          <p class="booking-note">{{ deposit_note }}</p>
        {%- endif -%}

        {%- form 'product', product, id: 'ProductForm' -%}
          {%- unless product.has_only_default_variant -%}
            {%- for option in product.options_with_values -%}
              <div class="field">
                <label for="Option-{{ option.position }}">{{ option.name }}</label>
                <select id="Option-{{ option.position }}" name="options[{{ option.name | escape }}]" data-option-selector>
                  {%- for value in option.values -%}
                    <option value="{{ value | escape }}" {% if option.selected_value == value %}selected{% endif %}>{{ value }}</option>
                  {%- endfor -%}
                </select>
              </div>
            {%- endfor -%}
          {%- endunless -%}

          {%- if is_booking and section.settings.show_request_fields -%}
            <div class="field">
              <label for="BookDate">Preferred date</label>
              <input type="date" id="BookDate" name="properties[Preferred date]" required>
            </div>
            <div class="field">
              <label for="BookTime">Preferred time</label>
              <input type="time" id="BookTime" name="properties[Preferred time]" required>
            </div>
            <div class="field">
              <label for="BookNotes">Notes (style, length, inspo, phone)</label>
              <textarea id="BookNotes" name="properties[Notes]" rows="3"></textarea>
            </div>
          {%- endif -%}

          <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" data-variant-id>
          {%- if is_booking -%}
            {%- assign add_label = section.settings.booking_button_label | default: 'Book & pay deposit' -%}
          {%- else -%}
            {%- assign add_label = 'products.add_to_cart' | t -%}
          {%- endif -%}
          <button
            type="submit"
            name="add"
            class="btn btn--primary"
            data-add-button
            data-add-text="{{ add_label | escape }}"
            data-sold-text="{{ 'products.sold_out' | t }}"
            {% unless product.selected_or_first_available_variant.available %}disabled{% endunless %}>
            {%- if product.selected_or_first_available_variant.available -%}{{ add_label }}{%- else -%}{{ 'products.sold_out' | t }}{%- endif -%}
          </button>

          {%- if is_booking -%}
            <p class="booking-note booking-note--small">You’ll pay the deposit at checkout to secure your spot. {{ shop.name }} will confirm your appointment time.</p>
          {%- endif -%}

          <script type="application/json" data-variants>
            [
              {%- for variant in product.variants -%}
                {"id": {{ variant.id }}, "options": {{ variant.options | json }}, "available": {{ variant.available }}, "price": {{ variant.price | money | json }}}{%- unless forloop.last -%},{%- endunless -%}
              {%- endfor -%}
            ]
          </script>
        {%- endform -%}

        {%- comment -%} Booking app widget (e.g. Cowlendar/Appointo) goes here via app blocks {%- endcomment -%}
        {%- for block in section.blocks -%}
          {%- if block.type == '@app' -%}
            <div class="product-app-block" {{ block.shopify_attributes }}>{% render block %}</div>
          {%- endif -%}
        {%- endfor -%}

        {%- if product.description != blank -%}
          <div class="rte" style="margin-top:1.5rem">{{ product.description }}</div>
        {%- endif -%}
      </div>
    </div>
  </div>
</section>

{% schema %}
{
  "name": "Product",
  "settings": [
    { "type": "header", "content": "Booking (service products)" },
    { "type": "paragraph", "content": "Tag a product with the booking tag below to turn its page into a deposit + date/time request. The price is the deposit; the requested date/time are saved on the order." },
    { "type": "text", "id": "booking_tag", "label": "Booking product tag", "default": "booking" },
    { "type": "text", "id": "booking_button_label", "label": "Booking button label", "default": "Book & pay deposit" },
    { "type": "checkbox", "id": "show_request_fields", "label": "Show preferred date/time fields", "info": "Turn OFF if you use a booking app block below (it provides its own calendar).", "default": true },
    { "type": "textarea", "id": "deposit_note", "label": "Deposit note", "info": "Shown on booking products. Per-product override: metafield custom.deposit_note.", "default": "A non-refundable deposit secures your appointment and goes toward your total. Balance due at your visit." }
  ],
  "blocks": [
    { "type": "@app" }
  ]
}
{% endschema %}
```

### `sections/main-search.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <h1>{{ 'general.search' | t }}</h1>
    <form action="{{ routes.search_url }}" method="get" role="search" class="field" style="max-width:480px">
      <input type="search" name="q" value="{{ search.terms | escape }}" placeholder="Search products…" aria-label="{{ 'general.search' | t }}">
    </form>

    {%- if search.performed -%}
      {%- if search.results.size > 0 -%}
        <div class="grid grid--4" style="margin-top:2rem">
          {%- for item in search.results -%}
            {%- if item.object_type == 'product' -%}
              {% render 'product-card', product: item %}
            {%- endif -%}
          {%- endfor -%}
        </div>
      {%- else -%}
        <p style="color:var(--color-muted)">No results found.</p>
      {%- endif -%}
    {%- endif -%}
  </div>
</section>

{% schema %}
{ "name": "Search", "settings": [] }
{% endschema %}
```

### `sections/page.liquid`
```liquid
<section class="section">
  <div class="page-width" style="max-width:820px">
    <h1>{{ page.title }}</h1>
    <div class="rte">{{ page.content }}</div>
  </div>
</section>

{% schema %}
{
  "name": "Page content",
  "settings": []
}
{% endschema %}
```

### `sections/policies.liquid`
```liquid
<section class="section">
  <div class="page-width" style="max-width:820px">
    <div class="section__head">
      {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
      <h2>{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<p>{{ section.settings.subheading }}</p>{%- endif -%}
    </div>

    {%- for block in section.blocks -%}
      <details class="policy" {% if forloop.first %}open{% endif %} {{ block.shopify_attributes }}>
        <summary>{{ block.settings.title }}</summary>
        <div class="policy__content rte">{{ block.settings.content }}</div>
      </details>
    {%- endfor -%}
  </div>
</section>

{% schema %}
{
  "name": "Policies",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Policies" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Salon policies" },
    { "type": "textarea", "id": "subheading", "label": "Subheading", "default": "Please review before booking." }
  ],
  "blocks": [
    {
      "type": "policy",
      "name": "Policy",
      "settings": [
        { "type": "text", "id": "title", "label": "Policy title", "default": "Health Policy" },
        { "type": "richtext", "id": "content", "label": "Policy details", "default": "<p>Add the details of this policy here.</p>" }
      ]
    }
  ],
  "presets": [
    {
      "name": "Policies",
      "blocks": [
        { "type": "policy", "settings": { "title": "Health Policy" } },
        { "type": "policy", "settings": { "title": "Cancellations" } },
        { "type": "policy", "settings": { "title": "Extra Guest" } },
        { "type": "policy", "settings": { "title": "Deposits" } },
        { "type": "policy", "settings": { "title": "Late Arrivals" } },
        { "type": "policy", "settings": { "title": "Travel Fee" } },
        { "type": "policy", "settings": { "title": "Reschedule" } }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/service-menu.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="section__head">
      {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
      <h2>{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<p>{{ section.settings.subheading }}</p>{%- endif -%}
    </div>

    {%- liquid
      assign open_category = false
    -%}
    {%- for block in section.blocks -%}
      {%- case block.type -%}
        {%- when 'category' -%}
          {%- if open_category -%}</div>{%- endif -%}
          <div class="service-category" {{ block.shopify_attributes }}>
            <h3>{{ block.settings.title }}{%- if block.settings.note != blank -%}<span class="service-row__notes">{{ block.settings.note }}</span>{%- endif -%}</h3>
          {%- assign open_category = true -%}
        {%- when 'service' -%}
          {% render 'service-row', block: block %}
      {%- endcase -%}
    {%- endfor -%}
    {%- if open_category -%}</div>{%- endif -%}

    {%- if section.settings.footnote != blank -%}
      <p class="service-row__notes" style="margin-top:2rem">{{ section.settings.footnote }}</p>
    {%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Service menu",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Services" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Service menu" },
    { "type": "textarea", "id": "subheading", "label": "Subheading", "default": "Browse services by category. Select a service to begin booking." },
    { "type": "textarea", "id": "footnote", "label": "Footnote", "info": "Shown below the menu, e.g. global deposit / booking terms." }
  ],
  "blocks": [
    {
      "type": "category",
      "name": "Category heading",
      "settings": [
        { "type": "text", "id": "title", "label": "Category name", "default": "Knotless" },
        { "type": "text", "id": "note", "label": "Category note" }
      ]
    },
    {
      "type": "service",
      "name": "Service",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Service photo (square)", "info": "Optional. Shown as a square thumbnail. Best with a 1:1 image." },
        { "type": "text", "id": "name", "label": "Service name", "default": "Medium knotless" },
        { "type": "text", "id": "duration", "label": "Duration", "default": "5–6 hrs" },
        { "type": "text", "id": "price", "label": "Price", "default": "$180" },
        { "type": "textarea", "id": "notes", "label": "Notes", "info": "e.g. \"Must book 2 weeks in advance\", deposit terms." },
        { "type": "text", "id": "select_label", "label": "Button label", "default": "Book" },
        { "type": "url", "id": "select_link", "label": "Booking link for this service", "info": "Falls back to the default booking URL, then the contact form." }
      ]
    }
  ],
  "presets": [
    {
      "name": "Service menu",
      "blocks": [
        { "type": "category", "settings": { "title": "Bundle Deal" } },
        { "type": "service" },
        { "type": "category", "settings": { "title": "Knotless" } },
        { "type": "service" },
        { "type": "service" },
        { "type": "category", "settings": { "title": "Natural" } },
        { "type": "service" },
        { "type": "category", "settings": { "title": "Quick Weave" } },
        { "type": "service" },
        { "type": "category", "settings": { "title": "Sew-In" } },
        { "type": "service" },
        { "type": "category", "settings": { "title": "Wig Install" } },
        { "type": "service" }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/services-preview.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="section__head">
      {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
      <h2>{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<p>{{ section.settings.subheading }}</p>{%- endif -%}
    </div>

    <div class="grid grid--3">
      {%- for block in section.blocks -%}
        <a class="card" href="{{ block.settings.link | default: section.settings.view_all_link | default: '#' }}" {{ block.shopify_attributes }}>
          <div class="card__media">
            {%- if block.settings.image -%}
              <img src="{{ block.settings.image | image_url: width: 600 }}" alt="{{ block.settings.title | escape }}" loading="lazy" width="600" height="450">
            {%- else -%}
              {{ 'image' | placeholder_svg_tag: 'card__media' }}
            {%- endif -%}
          </div>
          <div class="card__body">
            <h3>{{ block.settings.title }}</h3>
            {%- if block.settings.text != blank -%}<p>{{ block.settings.text }}</p>{%- endif -%}
          </div>
        </a>
      {%- endfor -%}
    </div>

    {%- if section.settings.view_all_label != blank -%}
      <div class="social-cta">
        <a class="btn btn--ghost" href="{{ section.settings.view_all_link | default: '#' }}">{{ section.settings.view_all_label }}</a>
      </div>
    {%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Services preview",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Services" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "What we do" },
    { "type": "textarea", "id": "subheading", "label": "Subheading" },
    { "type": "text", "id": "view_all_label", "label": "View-all button label", "default": "See full service menu" },
    { "type": "url", "id": "view_all_link", "label": "View-all / card fallback link" }
  ],
  "blocks": [
    {
      "type": "service",
      "name": "Service card",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Image" },
        { "type": "text", "id": "title", "label": "Title", "default": "Knotless braids" },
        { "type": "textarea", "id": "text", "label": "Short description" },
        { "type": "url", "id": "link", "label": "Link", "info": "Falls back to the view-all link." }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [
    {
      "name": "Services preview",
      "blocks": [{ "type": "service" }, { "type": "service" }, { "type": "service" }]
    }
  ]
}
{% endschema %}
```

### `sections/social-proof.liquid`
```liquid
<section class="section">
  <div class="page-width">
    <div class="section__head">
      {%- if section.settings.eyebrow != blank -%}<span class="eyebrow">{{ section.settings.eyebrow }}</span>{%- endif -%}
      <h2>{{ section.settings.heading }}</h2>
      {%- if section.settings.subheading != blank -%}<p>{{ section.settings.subheading }}</p>{%- endif -%}
    </div>

    <div class="reviews">
      {%- for block in section.blocks -%}
        <div class="review" {{ block.shopify_attributes }}>
          {%- if block.settings.rating > 0 -%}
            <div class="review__stars" aria-label="{{ block.settings.rating }} out of 5">
              {%- for i in (1..block.settings.rating) -%}★{%- endfor -%}
            </div>
          {%- endif -%}
          <p>{{ block.settings.quote }}</p>
          {%- if block.settings.author != blank -%}
            <div class="review__author">— {{ block.settings.author }}</div>
          {%- endif -%}
        </div>
      {%- endfor -%}
    </div>

    {%- if section.settings.instagram_embed != blank -%}
      <div class="map-embed" style="margin-top:2rem">{{ section.settings.instagram_embed }}</div>
    {%- endif -%}

    {%- if section.settings.button_label != blank -%}
      <div class="social-cta">
        <a class="btn btn--primary" href="{{ section.settings.button_link | default: settings.instagram_url | default: '#' }}">{{ section.settings.button_label }}</a>
      </div>
    {%- endif -%}
  </div>
</section>

{% schema %}
{
  "name": "Reviews / social proof",
  "settings": [
    { "type": "text", "id": "eyebrow", "label": "Eyebrow", "default": "Reviews" },
    { "type": "text", "id": "heading", "label": "Heading", "default": "Loved by clients" },
    { "type": "textarea", "id": "subheading", "label": "Subheading" },
    { "type": "html", "id": "instagram_embed", "label": "Instagram embed (optional)", "info": "Paste an Instagram embed code, or leave blank to just link out." },
    { "type": "text", "id": "button_label", "label": "Button label", "default": "Follow on Instagram" },
    { "type": "url", "id": "button_link", "label": "Button link", "info": "Falls back to the Instagram URL in Theme settings." }
  ],
  "blocks": [
    {
      "type": "review",
      "name": "Review",
      "settings": [
        { "type": "range", "id": "rating", "min": 0, "max": 5, "step": 1, "label": "Star rating", "default": 5 },
        { "type": "textarea", "id": "quote", "label": "Quote", "default": "Absolutely love my hair! So professional and clean." },
        { "type": "text", "id": "author", "label": "Author" }
      ]
    }
  ],
  "max_blocks": 6,
  "presets": [
    { "name": "Reviews", "blocks": [{ "type": "review" }, { "type": "review" }, { "type": "review" }] }
  ]
}
{% endschema %}
```

---

## 7. Snippets (Liquid)

### `snippets/before-after.liquid`
```liquid
{%- comment -%}
  Draggable before/after comparison slider.
  Accepts: before, after, before_label, after_label, caption
{%- endcomment -%}
<figure class="ba-figure">
  <div class="ba" data-ba style="--pos:50%">
    {%- if after -%}
      <img class="ba__img ba__after" src="{{ after | image_url: width: 800 }}" alt="{{ caption | default: 'After' | escape }}" loading="lazy" width="800" height="1067">
    {%- else -%}
      <div class="ba__img ba__after">{{ 'image' | placeholder_svg_tag }}</div>
    {%- endif -%}

    {%- if before -%}
      <img class="ba__img ba__before" src="{{ before | image_url: width: 800 }}" alt="{{ caption | default: 'Before' | escape }}" loading="lazy" width="800" height="1067">
    {%- else -%}
      <div class="ba__img ba__before">{{ 'image' | placeholder_svg_tag }}</div>
    {%- endif -%}

    <span class="ba__tag ba__tag--before">{{ before_label | default: 'Before' }}</span>
    <span class="ba__tag ba__tag--after">{{ after_label | default: 'After' }}</span>

    <div class="ba__divider" aria-hidden="true"><span class="ba__handle"></span></div>

    <input
      class="ba__range"
      type="range"
      min="0"
      max="100"
      value="50"
      aria-label="{{ caption | default: 'Before and after' | escape }} — drag to compare"
      data-ba-range>
  </div>
  {%- if caption != blank -%}
    <figcaption class="ba-figure__caption">{{ caption }}</figcaption>
  {%- endif -%}
</figure>
```

### `snippets/price.liquid`
```liquid
{%- comment -%}
  Renders a product price. Accepts: product
{%- endcomment -%}
{%- liquid
  assign target = product
  assign price = target.price
-%}
<span class="product-card__price">
  {%- if target.compare_at_price > price -%}
    <s>{{ target.compare_at_price | money }}</s>
  {%- endif -%}
  {%- if target.price_varies -%}
    {{ 'products.from' | t }} {{ price | money }}
  {%- else -%}
    {{ price | money }}
  {%- endif -%}
</span>
```

### `snippets/product-card.liquid`
```liquid
{%- comment -%}
  Renders a product card. Accepts: product
{%- endcomment -%}
<a class="card product-card" href="{{ product.url }}">
  <div class="card__media">
    {%- if product.featured_image -%}
      <img
        src="{{ product.featured_image | image_url: width: 600 }}"
        srcset="{{ product.featured_image | image_url: width: 300 }} 300w, {{ product.featured_image | image_url: width: 600 }} 600w, {{ product.featured_image | image_url: width: 900 }} 900w"
        sizes="(min-width: 990px) 25vw, 50vw"
        alt="{{ product.featured_image.alt | default: product.title | escape }}"
        loading="lazy"
        width="600"
        height="450">
    {%- else -%}
      {{ 'product-1' | placeholder_svg_tag: 'card__media' }}
    {%- endif -%}
  </div>
  <div class="card__body">
    <h3 class="product-card__title">{{ product.title }}</h3>
    {% render 'price', product: product %}
    {%- unless product.available -%}
      <p>{{ 'products.sold_out' | t }}</p>
    {%- endunless -%}
  </div>
</a>
```

### `snippets/product-row.liquid`
```liquid
{%- comment -%}
  Renders a product as a Booksy-style list row. Accepts: product, button_label
{%- endcomment -%}
<div class="service-row">
  <div class="service-row__media">
    {%- if product.featured_image -%}
      <img
        src="{{ product.featured_image | image_url: width: 200 }}"
        alt="{{ product.featured_image.alt | default: product.title | escape }}"
        loading="lazy"
        width="200"
        height="200">
    {%- else -%}
      {{ 'product-1' | placeholder_svg_tag }}
    {%- endif -%}
  </div>
  <div class="service-row__info">
    <a href="{{ product.url }}" class="service-row__name">{{ product.title }}</a>
    {%- if product.type != blank -%}
      <div class="service-row__meta">{{ product.type }}</div>
    {%- endif -%}
  </div>
  <div class="service-row__end">
    <div class="service-row__price">{% render 'price', product: product %}</div>
    <div class="service-row__action">
      <a class="btn btn--ghost btn--small" href="{{ product.url }}">
        {{ button_label | default: 'Book' }}
      </a>
    </div>
  </div>
</div>
```

### `snippets/service-row.liquid`
```liquid
{%- comment -%}
  Renders one service row. Accepts a block (settings: image, name, duration, price, notes, select_label, select_link)
{%- endcomment -%}
<div class="service-row" {{ block.shopify_attributes }}>
  {%- if block.settings.image -%}
    <div class="service-row__media">
      <img
        src="{{ block.settings.image | image_url: width: 200 }}"
        alt="{{ block.settings.name | escape }}"
        loading="lazy"
        width="200"
        height="200">
    </div>
  {%- endif -%}
  <div class="service-row__info">
    <div class="service-row__name">{{ block.settings.name }}</div>
    {%- if block.settings.duration != blank -%}
      <div class="service-row__meta">{{ block.settings.duration }}</div>
    {%- endif -%}
    {%- if block.settings.notes != blank -%}
      <div class="service-row__notes">{{ block.settings.notes }}</div>
    {%- endif -%}
  </div>
  <div class="service-row__end">
    <div class="service-row__price">{{ block.settings.price }}</div>
    <div class="service-row__action">
      <a class="btn btn--ghost btn--small"
         href="{{ block.settings.select_link | default: settings.booking_url | default: '/pages/contact' }}">
        {{ block.settings.select_label | default: 'Book' }}
      </a>
    </div>
  </div>
</div>
```

---

## 8. Templates (JSON)

### `templates/index.json`
```json
{
  "sections": {
    "hero": {
      "type": "hero",
      "settings": {
        "eyebrow": "ECB Stylez",
        "heading": "Braids & installs, done right",
        "subheading": "Premium hair styling with a clean, modern finish. Book your appointment today.",
        "button_label": "Book now",
        "button_link": "shopify://collections/all",
        "button2_label": "View services",
        "button2_link": ""
      }
    },
    "services": {
      "type": "services-preview",
      "blocks": {
        "s1": { "type": "service", "settings": { "title": "Knotless braids", "text": "Lightweight, natural-looking, long-lasting.", "link": "" } },
        "s2": { "type": "service", "settings": { "title": "Sew-Ins", "text": "Seamless installs with a flawless finish.", "link": "" } },
        "s3": { "type": "service", "settings": { "title": "Wig installs", "text": "Custom, glued or glueless, melted to perfection.", "link": "" } }
      },
      "block_order": ["s1", "s2", "s3"],
      "settings": {
        "eyebrow": "Services",
        "heading": "What we do",
        "subheading": "",
        "view_all_label": "See full service menu",
        "view_all_link": "shopify://collections/all"
      }
    },
    "gallery": {
      "type": "gallery-teaser",
      "blocks": {
        "g1": { "type": "pair", "settings": { "caption": "Knotless" } },
        "g2": { "type": "pair", "settings": { "caption": "Sew-In" } },
        "g3": { "type": "pair", "settings": { "caption": "Wig install" } }
      },
      "block_order": ["g1", "g2", "g3"],
      "settings": {
        "eyebrow": "Gallery",
        "heading": "Before & after",
        "subheading": "",
        "button_label": "View full gallery",
        "button_link": ""
      }
    },
    "reviews": {
      "type": "social-proof",
      "blocks": {
        "r1": { "type": "review", "settings": { "rating": 5, "quote": "Absolutely love my hair! So professional and clean.", "author": "Client" } },
        "r2": { "type": "review", "settings": { "rating": 5, "quote": "Best braids I've ever had. Booking again already.", "author": "Client" } },
        "r3": { "type": "review", "settings": { "rating": 5, "quote": "Gentle, fast, and the install looked perfect.", "author": "Client" } }
      },
      "block_order": ["r1", "r2", "r3"],
      "settings": {
        "eyebrow": "Reviews",
        "heading": "Loved by clients",
        "subheading": "",
        "instagram_embed": "",
        "button_label": "Follow on Instagram",
        "button_link": ""
      }
    }
  },
  "order": ["hero", "services", "gallery", "reviews"]
}
```

### `templates/collection.json`
```json
{
  "sections": {
    "main": {
      "type": "collection-grid",
      "settings": {
        "layout": "list",
        "button_label": "Book",
        "heading": "Shop",
        "subheading": "",
        "filter_menu": "",
        "all_label": "All"
      }
    }
  },
  "order": ["main"]
}
```

### `templates/collection.services.json`
```json
{
  "sections": {
    "main": {
      "type": "collection-grid",
      "settings": {
        "layout": "list",
        "button_label": "Book",
        "heading": "Services",
        "all_label": "All"
      }
    }
  },
  "order": ["main"]
}
```

### `templates/page.about.json`
```json
{
  "sections": {
    "about": {
      "type": "about",
      "settings": {
        "heading": "Meet your stylist",
        "bio": "<p>Hi, I'm Kassie — the hands behind ECB Stylez. I specialize in protective styles, braids, and installs with a clean, modern finish. Add your story, training, and what makes your chair the one to book.</p>",
        "button_label": "Book with me"
      }
    }
  },
  "order": ["about"]
}
```

### `templates/page.contact.json`
```json
{
  "sections": {
    "contact": {
      "type": "contact-form",
      "settings": {
        "heading": "Get in touch",
        "instagram_handle": "@theecbstylez"
      }
    }
  },
  "order": ["contact"]
}
```

### `templates/page.gallery.json`
```json
{
  "sections": {
    "gallery": {
      "type": "gallery-slider",
      "blocks": {
        "g_knotless":  { "type": "group", "settings": { "title": "Knotless" } },
        "p_knotless1": { "type": "pair",  "settings": { "caption": "Small knotless" } },
        "p_knotless2": { "type": "pair",  "settings": { "caption": "Medium knotless" } },
        "g_sewin":     { "type": "group", "settings": { "title": "Sew-In" } },
        "p_sewin1":    { "type": "pair",  "settings": { "caption": "Full sew-in" } },
        "g_wig":       { "type": "group", "settings": { "title": "Wig Install" } },
        "p_wig1":      { "type": "pair",  "settings": { "caption": "Glueless install" } }
      },
      "block_order": ["g_knotless", "p_knotless1", "p_knotless2", "g_sewin", "p_sewin1", "g_wig", "p_wig1"],
      "settings": { "heading": "Our work" }
    }
  },
  "order": ["gallery"]
}
```

### `templates/page.policies.json`
```json
{
  "sections": {
    "policies": {
      "type": "policies",
      "blocks": {
        "health":        { "type": "policy", "settings": { "title": "Health Policy", "content": "<p>Please reschedule if you are unwell or showing symptoms of illness. Come with freshly washed, detangled hair unless a wash is booked.</p>" } },
        "cancellations": { "type": "policy", "settings": { "title": "Cancellations", "content": "<p>Cancellations must be made at least 48 hours in advance. Deposits are non-refundable.</p>" } },
        "extra_guest":   { "type": "policy", "settings": { "title": "Extra Guest", "content": "<p>To keep appointments on schedule, please do not bring extra guests or children to your appointment.</p>" } },
        "deposits":      { "type": "policy", "settings": { "title": "Deposits", "content": "<p>A non-refundable deposit is required to book. It is applied toward your total service cost.</p>" } },
        "late":          { "type": "policy", "settings": { "title": "Late Arrivals", "content": "<p>There is a 15-minute grace period. Arrivals later than 15 minutes may be rescheduled and forfeit the deposit.</p>" } },
        "travel":        { "type": "policy", "settings": { "title": "Travel Fee", "content": "<p>Mobile and travel appointments may incur an additional fee based on distance. Ask for a quote.</p>" } },
        "reschedule":    { "type": "policy", "settings": { "title": "Reschedule", "content": "<p>One reschedule is allowed with 48 hours' notice. Your deposit transfers to the new date.</p>" } }
      },
      "block_order": ["health", "cancellations", "extra_guest", "deposits", "late", "travel", "reschedule"],
      "settings": { "heading": "Salon policies" }
    }
  },
  "order": ["policies"]
}
```

### `templates/page.services.json`
```json
{
  "sections": {
    "menu": {
      "type": "service-menu",
      "blocks": {
        "c_bundle":     { "type": "category", "settings": { "title": "Bundle Deal" } },
        "s_bundle1":    { "type": "service",  "settings": { "name": "Wash, blow dry & style", "duration": "2 hrs", "price": "$120", "notes": "Includes deep conditioning." } },
        "c_knotless":   { "type": "category", "settings": { "title": "Knotless" } },
        "s_knotless1":  { "type": "service",  "settings": { "name": "Small knotless", "duration": "6–8 hrs", "price": "$220", "notes": "Must book 2 weeks in advance. Non-refundable deposit required." } },
        "s_knotless2":  { "type": "service",  "settings": { "name": "Medium knotless", "duration": "5–6 hrs", "price": "$180", "notes": "Non-refundable deposit required." } },
        "c_natural":    { "type": "category", "settings": { "title": "Natural" } },
        "s_natural1":   { "type": "service",  "settings": { "name": "Silk press", "duration": "1.5 hrs", "price": "$85" } },
        "c_quickweave": { "type": "category", "settings": { "title": "Quick Weave" } },
        "s_quickweave1":{ "type": "service",  "settings": { "name": "Quick weave install", "duration": "2.5 hrs", "price": "$130", "notes": "Hair not included." } },
        "c_sewin":      { "type": "category", "settings": { "title": "Sew-In" } },
        "s_sewin1":     { "type": "service",  "settings": { "name": "Full sew-in", "duration": "3 hrs", "price": "$160", "notes": "Hair not included." } },
        "c_wig":        { "type": "category", "settings": { "title": "Wig Install" } },
        "s_wig1":       { "type": "service",  "settings": { "name": "Glueless wig install", "duration": "1.5 hrs", "price": "$110" } }
      },
      "block_order": ["c_bundle", "s_bundle1", "c_knotless", "s_knotless1", "s_knotless2", "c_natural", "s_natural1", "c_quickweave", "s_quickweave1", "c_sewin", "s_sewin1", "c_wig", "s_wig1"],
      "settings": {
        "heading": "Service menu",
        "footnote": "A non-refundable deposit is required to secure all appointments. Deposits go toward your service total."
      }
    }
  },
  "order": ["menu"]
}
```

### Simple templates (each just wires one main section)
```json
// templates/404.json
{ "sections": { "main": { "type": "main-404" } }, "order": ["main"] }

// templates/cart.json
{ "sections": { "main": { "type": "main-cart" } }, "order": ["main"] }

// templates/product.json
{ "sections": { "main": { "type": "main-product" } }, "order": ["main"] }

// templates/search.json
{ "sections": { "main": { "type": "main-search" } }, "order": ["main"] }

// templates/page.json
{ "sections": { "main": { "type": "page" } }, "order": ["main"] }

// templates/list-collections.json
{ "sections": { "main": { "type": "list-collections", "settings": { "heading": "Shop by category" } } }, "order": ["main"] }
```

---

## 9. Locales

### `locales/en.default.json`
```json
{
  "general": { "skip_to_content": "Skip to content", "menu": "Menu", "close": "Close", "search": "Search" },
  "products": { "add_to_cart": "Add to cart", "sold_out": "Sold out", "from": "From", "view_details": "View details" },
  "cart": { "title": "Your cart", "empty": "Your cart is empty", "subtotal": "Subtotal", "checkout": "Check out", "continue_shopping": "Continue shopping", "remove": "Remove", "quantity": "Quantity" },
  "contact": { "name": "Name", "email": "Email", "message": "Message", "send": "Send message", "success": "Thanks — your message has been sent." }
}
```

---

# 10. Modifications to apply in the clone

These are the two changes to implement. They're scoped precisely so they don't break layout. Concrete diffs below.

## 10.1 Remove the butterfly icon from all buttons

The butterfly exists **only as inline CSS** in `assets/base.css` (no asset file, no icon font, no Liquid reference). It appears in **3 places**:

| # | Location | What it is | Action |
|---|----------|-----------|--------|
| 1 | `:root { --butterfly: url("data:image/svg+xml,…") }` (top of file) | the SVG data-URI definition | Delete the variable (after #2 & #3 no longer use it). |
| 2 | `.btn::after` + `.btn:hover::after` | **the butterfly on every button** | Delete both rules. |
| 3 | `.ba__handle` | before/after slider **drag handle** (not a button) | Replace its butterfly `background` with a neutral handle, **or** leave it if the brand keeps the motif there. |

**Button removal (the core ask) — delete these rules:**
```css
/* DELETE */
.btn::after {
  content: "";
  position: absolute;
  top: -9px;
  right: -9px;
  width: 22px;
  height: 22px;
  background: var(--butterfly) no-repeat center / contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .55));
  transition: transform .2s ease;
  pointer-events: none;
}
/* DELETE */
.btn:hover::after { transform: rotate(-10deg) scale(1.08); }
```
`.btn` keeps `position: relative;` (harmless) and its padding `.85rem 1.75rem` is untouched, so **layout/padding are unaffected** — the only change is the corner icon disappears.

**Slider handle (#3)** — since the icon also lives on the gallery drag handle, decide whether "site-wide" includes it. Clean neutral replacement:
```css
.ba__handle {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--color-silver);
  border: 2px solid var(--color-bg);
  box-shadow: 0 1px 4px rgba(0, 0, 0, .7);
}
```
Then the `--butterfly` variable is unused and should be deleted from `:root`.

> ⚠️ Decision point for the clone-builder: the request says "all **buttons**." The `.ba__handle` is a drag handle, not a button. Confirm whether to also de-butterfly it. If yes, use the snippet above; if no, only do #1/#2 but keep `--butterfly` (since the handle still references it).

## 10.2 Color + gradient editor system

**Current state:** 7 solid colors are already centralized as `settings.color_*` → injected as `--color-*` CSS vars in `layout/theme.liquid`. But several backgrounds are **hardcoded** and **not gradient-swappable**:
- `.btn--primary` → `linear-gradient(135deg, #f4f4f6 0%, var(--color-silver) 55%, #8d8d92 100%)` (hardcoded hex)
- `.hero::after` → `linear-gradient(180deg, rgba(10,10,10,.55), rgba(10,10,10,.85))`
- `.ba__tag` → `rgba(10,10,10,.7)`
- `contact-form.liquid` inline error → `#c0392b`
- Flat backgrounds (`body`, `.card`, `.footer`, inputs) use solid `--color-surface`/`--color-bg` with no gradient option.

**Target design — token model (gradient-capable):**
Introduce a paired token scheme. Each "background" resolves to a **gradient if the merchant set one, else the solid color** — so any flat background becomes gradient-swappable from the editor with zero code edits.

### Step A — `config/settings_schema.json`: extend the "Colors" group
Add gradient pickers (Shopify type `color_background` renders a gradient/solid picker) and an error color:
```json
{
  "name": "Colors",
  "settings": [
    { "type": "header", "content": "Solid palette" },
    { "type": "color", "id": "color_background", "label": "Background", "default": "#0a0a0a" },
    { "type": "color", "id": "color_surface", "label": "Surface / cards", "default": "#141414" },
    { "type": "color", "id": "color_text", "label": "Text", "default": "#f2f2f2" },
    { "type": "color", "id": "color_muted", "label": "Muted text", "default": "#a8a8a8" },
    { "type": "color", "id": "color_silver", "label": "Silver accent", "default": "#c8c8cc" },
    { "type": "color", "id": "color_border", "label": "Borders / hairlines", "default": "#2a2a2a" },
    { "type": "color", "id": "color_button_text", "label": "Button text", "default": "#0a0a0a" },
    { "type": "color", "id": "color_error", "label": "Error / alert", "default": "#c0392b" },

    { "type": "header", "content": "Gradients (optional — override the solid backgrounds)" },
    { "type": "paragraph", "content": "Set a gradient to replace the matching flat background. Leave blank to keep the solid color." },
    { "type": "color_background", "id": "gradient_background", "label": "Page background gradient" },
    { "type": "color_background", "id": "gradient_surface", "label": "Surface / cards gradient" },
    { "type": "color_background", "id": "gradient_footer", "label": "Footer gradient" },
    { "type": "color_background", "id": "gradient_button", "label": "Primary button gradient", "default": "linear-gradient(135deg, #f4f4f6 0%, #c8c8cc 55%, #8d8d92 100%)" },
    { "type": "color_background", "id": "gradient_section", "label": "Section background gradient" },
    { "type": "color_background", "id": "gradient_hero_overlay", "label": "Hero overlay gradient", "default": "linear-gradient(180deg, rgba(10,10,10,0.55), rgba(10,10,10,0.85))" }
  ]
}
```

### Step B — `layout/theme.liquid`: compute the tokens
Replace the `:root` block with solids **plus** resolved `--bg-*` tokens (gradient wins, else solid). Keep `--color-bg` as a pure color (it's used in `color-mix()` which can't take a gradient):
```liquid
:root {
  /* Solid colors */
  --color-bg: {{ settings.color_background }};
  --color-surface: {{ settings.color_surface }};
  --color-text: {{ settings.color_text }};
  --color-muted: {{ settings.color_muted }};
  --color-silver: {{ settings.color_silver }};
  --color-border: {{ settings.color_border }};
  --color-button-text: {{ settings.color_button_text }};
  --color-error: {{ settings.color_error | default: '#c0392b' }};

  /* Background tokens — gradient if set, else solid */
  --bg-page:    {{ settings.gradient_background  | default: settings.color_background }};
  --bg-surface: {{ settings.gradient_surface     | default: settings.color_surface }};
  --bg-footer:  {{ settings.gradient_footer      | default: settings.color_surface }};
  --bg-button:  {{ settings.gradient_button      | default: settings.color_silver }};
  --bg-section: {{ settings.gradient_section     | default: settings.color_background }};
  --bg-hero-overlay: {{ settings.gradient_hero_overlay | default: 'linear-gradient(180deg, rgba(10,10,10,.55), rgba(10,10,10,.85))' }};

  --font-heading: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  --font-heading-weight: 600;
  --page-width: 1200px;
}
```

### Step C — `assets/base.css`: consume the tokens (remove hardcoded values)
```css
body            { background: var(--bg-page); }          /* was var(--color-bg) */
.btn--primary   { background: var(--bg-button); }        /* was the hardcoded silver gradient */
.hero::after    { background: var(--bg-hero-overlay); }  /* was linear-gradient(180deg, rgba(10,10,10,…)) */
.card           { background: var(--bg-surface); }       /* was var(--color-surface) */
.footer         { background: var(--bg-footer); }        /* was var(--color-surface) */
.ba__tag        { background: color-mix(in srgb, var(--color-bg) 78%, transparent); } /* was rgba(10,10,10,.7) */
```
Optionally also route `.section` to `var(--bg-section)` if you want full-page-section gradients (default keeps it transparent over `--bg-page`). Keep form `input/textarea` on the solid `--color-surface` for legibility (gradients in text fields look poor) — this is the one deliberate exception.

### Step D — `sections/contact-form.liquid`: tokenize the error red
```liquid
{# was: style="border-color:#c0392b" #}
<p class="form-success" style="border-color:var(--color-error)">{{ form.errors | default_errors }}</p>
```

**Result:** every theme color now flows from `settings.*` → CSS variables; **no palette hex values remain hardcoded** in CSS/Liquid; and every flat background (`body`, cards, footer, primary button, hero overlay, sections) can be switched to a gradient from **Theme settings → Colors → Gradients** with no code changes. Defaults reproduce the current look exactly.
