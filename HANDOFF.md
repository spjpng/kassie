# Project Handoff — ECB Stylez Shopify Theme

**Client:** Kassie (@theecbstylez) — hair stylist & braider
**Repo:** `spjpng/kassie`
**Theme:** Custom Shopify **Online Store 2.0** Liquid theme (silver & black, mobile-first, no paid apps)
**Last updated:** 2026-06-30

This document is the operational handoff. It summarizes what's built, what's
live, how the moving parts work, and what's left to do. For day-to-day setup
see `README.md`; for a full file-by-file technical reference see `BUILD_SPEC.md`.

---

## 1. Where things stand

The theme is feature-complete for **phase 1** and connected to the Shopify
store via **Online Store → Themes → Connect from GitHub**. Edits pushed to
`main` flow into the store; the client edits content in the theme editor.

Built and working:

- Full storefront: Home, Shop (product grid + list/Booksy-style rows),
  Services, Gallery (before/after), About, Policies, Contact.
- Brand system: silver & black palette, Inter typography, butterfly mark —
  all driven by theme settings (no hardcoded content).
- **Native in-Shopify booking + deposit** on service products (see §3).
- Product page supports **booking-app blocks** (`@app`) for stores that later
  add a calendar app.

Everything merchant-facing (services, prices, policies, hours, links, images)
is editable in the theme editor or Shopify admin — nothing is hardcoded.

---

## 2. Architecture at a glance

```
layout/theme.liquid          Document shell; injects color/font tokens from settings
config/settings_schema.json  Global theme settings (brand, colors, type, contact, hours, map)
config/settings_data.json    Saved values (synced from Shopify on "Update from Shopify" commits)
sections/                    UI sections, each with its own schema
snippets/                    Reusable partials (product card/row, price, service row, before/after)
templates/*.json             Page → section wiring + starter content
assets/base.css, theme.js    Plain CSS + vanilla JS (nav, smooth-scroll, variant/cart logic)
locales/en.default.json      UI strings
```

- **No build step.** Plain CSS + vanilla JS. No Node, no package.json, no SCSS.
- **Fonts:** Inter via Google Fonts (loaded in `layout/theme.liquid`).
- **Images:** none committed — all come from Shopify CDN or `placeholder_svg_tag`.
- Commits titled **"Update from Shopify for theme kassie/main"** are content/
  settings the client saved in the editor, pushed back to the repo. Treat those
  as the client's data; don't revert them when making code changes.

### Page → template map

| Route | Template | Notes |
|-------|----------|-------|
| Home | `index.json` | Hero, Services preview, Gallery teaser, Reviews |
| Shop | `collection.json` / `list-collections.json` | Product grid; supports grid or list layout |
| Services (collection) | `collection.services.json` | List-layout collection of service products |
| Services (static) | `page.services.json` | Category-grouped service menu w/ booking links |
| Gallery | `page.gallery.json` | Before/after slider grouped by service type |
| About | `page.about.json` | Bio + photo |
| Policies | `page.policies.json` | Accordion |
| Contact | `page.contact.json` | Native contact form + info + map |
| Product | `product.json` | Standard product **or** booking product (see §3) |

---

## 3. Native booking + deposit flow (important)

Implemented in `sections/main-product.liquid`. There is **no paid booking app
required** — booking is handled natively through the cart/checkout.

How it works:

1. **Tag a product** with the booking tag (default `booking`, configurable in
   the Product section settings → "Booking product tag").
2. That product page then renders as a **deposit + appointment request**:
   - The product price is treated as the **deposit** (a `deposit` chip shows
     next to the price).
   - Optional **Preferred date / Preferred time / Notes** fields are captured
     as line-item properties and saved on the order.
   - The submit button label becomes "Book & pay deposit" (configurable).
   - A deposit note explains the deposit is non-refundable and applied to the
     total. Per-product override via metafield `custom.deposit_note`.
3. The client confirms the actual appointment time after the deposit is paid.

**If a calendar app is added later:** the section also renders `@app` blocks
(e.g. Cowlendar/Appointo). In that case turn **off** "Show preferred date/time
fields" in the Product section settings so the app provides its own calendar.

Relevant settings live in the **Product** section schema:
`booking_tag`, `booking_button_label`, `show_request_fields`, `deposit_note`.

---

## 4. Operating the store (client checklist)

After connecting the theme (also in `README.md`):

1. **Theme settings → Brand/Colors/Typography** — logo, palette.
2. **Theme settings → Contact & Social** — phone, email, Instagram, Facebook,
   and **Default booking URL** (fallback for "Book"/"Select" buttons).
3. **Theme settings → Location & Hours** — hours, location, Google Map embed.
4. Create Pages (Services, Gallery, About, Policies, Contact) and assign the
   matching templates (`page.services`, etc.).
5. Build collections in admin; link a collections menu to the Shop filter.
6. For each service you want to take a deposit on: create a product, set the
   **price to the deposit amount**, and add the **`booking`** tag.
7. Replace placeholder prices, gallery images, and review text in the editor.

---

## 5. Working in this repo (next developer)

- Branch for theme code changes off `main`; open a PR. Do **not** hand-edit
  `config/settings_data.json` — that's the client's saved content.
- No local build needed. To preview against the live store use the Shopify CLI:
  `shopify theme dev` (pull) / `shopify theme push` (push to a dev theme).
- Keep content out of Liquid — new merchant-editable values belong in section/
  block schema or theme settings, consumed via CSS custom properties where
  styling is involved.
- `BUILD_SPEC.md` has verbatim file contents and is the authoritative reference
  if the theme ever needs to be rebuilt from scratch.

---

## 6. Pending / future phases

- **Live calendar booking.** Phase 1 is deposit + manual confirmation. A real
  calendar (availability, auto-confirm) means adding a booking app and wiring
  its `@app` block on the product page (scaffolding already present).
- **Intake-form mapping.** Theme settings are named to map onto the agency-os
  client intake fields (see README table) so a submitted intake drops straight
  in — the intake itself is not yet wired up.
- Replace remaining placeholder content (gallery, reviews, service prices) with
  the client's real assets as they're delivered.
