# ECB Stylez — Shopify Theme

A custom Shopify Online Store 2.0 Liquid theme for Kassie (@theecbstylez), hair
stylist & braider. Products, collections, orders and inventory stay native in
Shopify admin. All page content (services, prices, policies, hours, links)
is editable in the **theme editor** — nothing is hardcoded.

Design: silver & black, clean/premium, mobile-first. No paid apps.

## Connecting the theme

This repo is meant to be connected to a Shopify store via
**Online Store → Themes → Add theme → Connect from GitHub** (or the Shopify
CLI: `shopify theme dev` / `shopify theme push`). Once connected, edits push
from GitHub and the client edits content in the theme editor.

## Structure

```
layout/theme.liquid          Document shell; injects color/font tokens from settings
config/settings_schema.json  Global theme settings (brand, colors, type, contact, hours, map)
sections/                    All UI sections (each with its own schema)
snippets/                    Reusable partials (product card, price, service row, before/after)
templates/*.json             Page → section wiring, with starter content
assets/base.css, theme.js    Styles + lightweight JS (nav, smooth-scroll)
locales/en.default.json      UI strings
```

## Pages

| Route | Template | Sections |
|-------|----------|----------|
| Home | `index.json` | Hero, Services preview, Gallery teaser, Reviews |
| Shop | `collection.json` / `list-collections.json` | Product grid (+ collection filter) |
| Services | `page.services.json` | Service menu (category-grouped, per-service booking links) |
| Gallery | `page.gallery.json` | Before/after slider grouped by service type |
| About | `page.about.json` | Bio + photo |
| Policies | `page.policies.json` | Accordion (Health, Cancellations, Extra Guest, Deposits, Late, Travel, Reschedule) |
| Contact | `page.contact.json` | Native contact form + info + map |

To use the named page templates: in Shopify admin create a Page (e.g. "Services")
and assign the matching template (`page.services`) from the template dropdown.

## Setup checklist (after connecting)

1. **Theme settings → Brand/Colors/Typography**: upload logo, confirm palette.
2. **Theme settings → Contact & Social**: phone, email, Instagram, Facebook,
   and **Default booking URL** (used by all "Book"/"Select" buttons unless a
   specific link is set).
3. **Theme settings → Location & Hours**: hours, location text, Google Map embed.
4. Create Pages (Services, Gallery, About, Policies, Contact) and assign templates.
5. Build collections in admin; link a collections menu to the Shop filter
   (Product grid section → "Category filter menu").
6. Replace placeholder service prices, gallery images, and review text in the editor.

## Booking (this phase)

Static informational Services page. Each service has its own optional booking
link (**Service menu → Service → "Booking link for this service"**), falling
back to the global Default booking URL, then the on-site contact form. No live
calendar logic — that's a later phase.

## Intake-form mapping

Settings are named to map onto the agency-os client intake fields, so once that
intake is submitted the values drop straight in:

| Intake field | Theme location |
|--------------|----------------|
| Brand colors | Theme settings → Colors |
| Logo | Theme settings → Brand → Logo |
| Photos (hero, about, gallery) | Hero / About / Gallery sections |
| Services (name, duration, price, notes) | Service menu blocks |
| Policies | Policies blocks |
| Booking platform URL | Theme settings → Default booking URL |
| GMB / map | Theme settings → Google Map embed |
| Business hours / location | Theme settings → Location & Hours |
| Instagram / Facebook | Theme settings → Contact & Social |
