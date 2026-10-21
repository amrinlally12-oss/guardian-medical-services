# CLAUDE.md — Guardian Medical Services Website

## Project Overview

Official website for **Guardian Medical Services**, a private-pay non-emergency medical
transportation (NEMT) provider serving the Sacramento Valley and Northern California.
Static multi-page site on GitHub Pages at https://guardianms.org (HTTPS enforced).

**Goal:** Establish trust and generate ride requests (families) and facility accounts (B2B).
**Audience:** Patients, adult children booking for parents, caregivers, discharge planners,
care facilities. Skews older, so readability and large tap targets matter.

## Tech Stack

- Pure HTML / CSS / JavaScript — no frameworks. GitHub Pages serves the committed files.
- Google Fonts: Poppins 600/700/800 (display) + Inter 400–700 (body)
- Formspree endpoint `https://formspree.io/f/mnjyjjgy` (→ admin@guardianms.org) for both
  the booking form and the facility account form (different `_subject`)
- Pillow (Python) for generating image assets

## File Structure

```
index.html        Home (hero + ride card, audiences, services, steps, why, area, FAQ teaser)
services.html     All 6 services with anchors (#ambulatory #wheelchair #gurney #bariatric #oxygen #long-distance)
book.html         3-step ride request (Formspree)
facilities.html   B2B page + facility account form
about.html, faq.html, contact.html, privacy.html (privacy + accessibility statement), 404.html
css/style.css     All styles; design tokens at top
js/main.js        Header, mobile menu, text size, reveal, booking stepper, Formspree submit, tracking hooks
images/           icons.svg (sprite), logo*.webp/png, favicons, og-image.jpg
_partials/        head.html, header.html, footer.html  (NOT published — Jekyll skips "_" dirs)
_tools/           sync_partials.py, build_assets.py   (NOT published)
_source/          logo-master.png (source of all logo assets; NOT published)
sitemap.xml, robots.txt, site.webmanifest, CNAME
```

## Workflow — shared head/header/footer

Pages contain marker pairs `<!-- HEAD:START/END -->`, `<!-- HEADER:START/END -->`,
`<!-- FOOTER:START/END -->` (and `<!-- FAQ-SCHEMA:START/END -->` on faq.html).
**Never edit inside those markers in a page.** Edit `_partials/*.html`, then run:

```
python3 _tools/sync_partials.py
```

It stamps the partials into every page, sets `aria-current="page"` on the matching nav
link (`data-nav="<page>"`), and regenerates the FAQPage JSON-LD from the visible
`<details class="faq-item">` blocks. Running it twice must report "0 page(s) updated".
A new page needs empty marker pairs (with a blank line between) and an entry in sitemap.xml.

Image assets are regenerated from `_source/logo-master.png` with `python3 _tools/build_assets.py`.

When CSS/JS changes need to bust caches, bump `?v=` in `_partials/head.html` / `footer.html`.

## Conventions

- Icons: `<svg class="icon" aria-hidden="true"><use href="/images/icons.svg#i-NAME"/></svg>`.
  Add new icons as `<symbol>`s in images/icons.svg. No inline SVG copies.
- Root-absolute URLs everywhere (`/book.html`, `/css/style.css`) so 404.html works at any path.
- Colors: use `--blue-ink` (#1f6e8c) for text, links and button backgrounds on light
  surfaces. `--blue` (#2c87a8) fails AA as text — decorative only. `--blue-light` on navy.
- Base text is 18px (`html { font-size: 112.5% }`); size everything in rem so the
  A / A+ / A++ control (`data-text-size` on <html>, saved in localStorage) scales it.
- No inline `style=""` attributes; add a class.
- Content must work without JS: `.reveal` and `[data-show-when]` are only hidden under
  `.js`; the FAQ uses native `<details>`; the booking form becomes one long form.
- In `.check-list` items, wrap text in a `<span>` if it contains a link (items are flex).
- Booking stepper: one `<fieldset class="form-step" data-step="N">` per step; conditional
  fields use `data-show-when="radioName=Value|Value2"`; links can prefill with
  `book.html?for=self|family|facility&service=<data-key>`.

## Company Facts

- **Phone:** (530) 453-6220 (24/7 booking) — `tel:+15304536220`
- **Email:** Admin@guardianms.org (Google Workspace — never touch MX/SPF/DKIM DNS records)
- **Office hours:** Mon–Fri 8–6, Sat 9–3, Sun closed (booking line still 24/7)
- **Counties:** Sacramento, Placer, Yolo, Yuba, Sutter, Nevada, Solano, San Joaquin,
  Butte, Colusa, Glenn (+ long distance)
- **Services:** Ambulatory, Wheelchair, Gurney; Specialty: Bariatric, Oxygen Tank, Long Distance
- **Drivers:** HIPAA, First Aid, CPR certified; background-checked; licensed
- **Payment:** Private-pay ONLY. Do NOT add insurance / Medi-Cal / broker claims.
- **Pricing:** Owner chose NOT to publish prices — "every trip is quoted before you book."

## Content Guardrails

- Non-emergency only. Utility bar and footer say "call 911"; booking requires a
  non-emergency checkbox. Never imply ambulance/emergency service.
- Forms collect **minimal personal info** — no DOB, diagnosis, medications, insurance IDs
  (Formspree's terms forbid sensitive data). Coordinators collect the rest by phone.
- No fabricated stats, testimonials, reviews, driver names, or photos. Only claims the
  owner has stated. No review/rating schema for our own business.
- Tone: warm, reassuring, professional; written for worried family members.

## Owner facts still to confirm (site uses neutral wording until then)

Callback-time promise · ride-along limit (site says family/caregivers ride free) ·
door-to-door vs door-through-door / stair help · "licensed & insured" + CPUC status ·
payment methods · cancellation terms beyond "call 24h ahead" · same-day discharge ·
facility invoicing terms / W-9 / COI · bariatric capacity · years in business ·
owner name for About · whether the business line accepts texts · Yuba City as the
business locality (used in JSON-LD).

## Roadmap

- [x] Phase 1 premium rebuild (Oct 2026): partials, accessibility (WCAG 2.2 AA), sticky
      mobile call bar, 3-step booking, facilities page, FAQ expansion, SEO (JSON-LD, OG,
      sitemap, canonicals), WebP/sprite performance work
- [ ] Owner: Google Business Profile, review requests, vehicle/driver photos
- [ ] Phase 2: county/hub pages with real local destinations, service-area map,
      Spanish pages, photos, reviews section, analytics provider (hooks: `data-track`)

## Local Preview

`~/Desktop` is TCC-protected — copy the site to a scratch folder and serve from there:
`python3 -m http.server` (run inside the copy). `.claude/` is gitignored.
