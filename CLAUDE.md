# CLAUDE.md — Guardian Medical Services Website

## Project Overview

Official website for **Guardian Medical Services**, a non-emergency medical
transportation (NEMT) provider serving the Sacramento Valley and Northern California.
Static multi-page site, hosted on GitHub Pages.

**Goal:** Establish trust and generate ride-booking requests.
**Audience:** Patients, families, caregivers, and care facilities needing NEMT.

## Tech Stack

- Pure HTML / CSS / JavaScript — no frameworks, no build step
- Google Fonts: Poppins (display) + Inter (body)
- Formspree for the booking form (free tier)
- GitHub Pages static hosting

## File Structure

```
index.html       Home
services.html    Core + specialty services
book.html        Booking form (Formspree)
about.html       About / values / certs / team
faq.html         FAQ accordion
contact.html     Contact info, hours, counties
404.html         Custom 404
css/style.css    All styles (design tokens at top)
js/main.js       Nav, mobile menu, FAQ, scroll reveal, form
images/          logo.png (user-supplied) + favicon.svg
robots.txt
```

Header and footer markup are duplicated across pages (standard for a no-build static
site). When editing nav/footer, update all HTML files consistently.

## Brand

- Navy `#143041`, deep navy `#0e2532`, medical blue `#2c87a8`, light blue `#3ba6cb`,
  sky tint `#e9f4f8`. All defined as CSS variables in `css/style.css`.
- Logo: shield with star-of-life. Use `images/logo.png`. Falls back to a CSS text
  wordmark + inline SVG shield if the PNG is missing (via `onerror` on the `<img>`).
- Icons are inline Feather-style SVG strokes using `currentColor`.

## Company Facts

- **Phone:** (530) 453-6220 (24/7 booking) — `tel:+15304536220`
- **Email:** Admin@guardianms.org
- **Office hours:** Mon–Fri 8–6, Sat 9–3, Sun closed (booking line still 24/7)
- **Counties:** Sacramento, Placer, Yolo, Yuba, Sutter, Nevada, Solano, San Joaquin,
  Butte, Colusa, Glenn (+ long distance)
- **Services:** Ambulatory, Wheelchair, Gurney; Specialty: Bariatric, Oxygen Tank,
  Long Distance
- **Drivers:** HIPAA, First Aid, CPR certified; background-checked
- **Payment:** Private-pay ONLY. Do NOT add insurance / Medicaid / broker claims.

## Content Guardrails

- This is **non-emergency** transport. Every page footer notes "call 911 in an
  emergency." Don't imply emergency/ambulance service.
- Booking form intentionally collects **minimal personal info** (no DOB, no diagnosis,
  no full medical detail) to limit PHI exposure — a coordinator collects the rest by
  phone. Keep it that way unless a HIPAA-compliant backend is added.
- Tone: warm, reassuring, professional. Frame everything from the passenger's /
  family's peace of mind.

## Logo Assets

Source master is `images/png.png` (vertical lockup, dark-navy elements). Two derived
assets are generated from it with Pillow and used on the site:
- `images/logo.png` — full lockup (720px), used in the home hero on a WHITE plate
  (the logo's dark navy would vanish on the dark hero, so it sits on a white card).
- `images/logo-icon.png` — shield only (360px), used in the nav and footer paired with
  a text wordmark (`.logo-fallback` span, always visible — not a fallback anymore).

## Outstanding Tasks

- [x] Logo added (`logo.png` + `logo-icon.png`)
- [ ] Replace `YOUR_FORM_ID` in `book.html` with the real Formspree endpoint
- [x] GitHub Pages enabled
- [ ] (Optional) custom domain + CNAME, Google Analytics, OG share image, sitemap.xml

## Local Preview Note

`~/Desktop` is TCC-protected on this machine — run preview servers from `/tmp`
(copy the folder there to serve), not directly from the Desktop path.
