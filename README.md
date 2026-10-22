# Guardian Medical Services — Website

Official website for **Guardian Medical Services**, a private-pay non-emergency medical transportation (NEMT) provider serving the Sacramento Valley and Northern California. Live at **https://guardianms.org**.

Static, multi-page site: plain HTML/CSS/JS served by GitHub Pages. No build step is needed to deploy.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home: hero with "how your ride works" ticket and credentials spec row, who's-riding paths, numbered services index, why private pay, service-area departure board, FAQ teaser, closing call CTA |
| `services.html` | All six services with deep-link anchors and "Request this ride" buttons |
| `book.html` | 3-step ride/quote request (Formspree), works without JavaScript too |
| `facilities.html` | For hospitals, SNFs, dialysis, assisted living, hospice + facility account form |
| `about.html` | Story, values, certifications, team roles |
| `faq.html` | 18 questions for families (FAQPage structured data generated automatically) |
| `contact.html` | Phone, email, hours, service area |
| `privacy.html` | Privacy notice + accessibility statement |
| `404.html` | Not-found page (root-absolute paths, so it works at any URL) |

## Editing the shared header / footer

The `<head>` assets, header, and footer live in `_partials/`. After editing them run:

```bash
python3 _tools/sync_partials.py
```

That copies them into every page (inside the `<!-- …:START/END -->` markers) and rebuilds the FAQ structured data. Don't edit between those markers directly. See `CLAUDE.md` for all conventions.

## Assets

Logo files, favicons, and the social share image are generated from `_source/logo-master.png`:

```bash
python3 _tools/build_assets.py
```

Icons are one SVG sprite, `images/icons.svg`.

## Forms

Both forms post to Formspree `https://formspree.io/f/mnjyjjgy`, which emails admin@guardianms.org. The forms intentionally avoid medical details (Formspree doesn't allow sensitive data). The Formspree free plan has a monthly submission cap; upgrade if request volume grows.

## Brand colors

| Token | Hex | Use |
|-------|-----|-----|
| `--navy` | `#143041` | Shield navy, dark sections |
| `--navy-deep` | `#0e2532` | Deepest backgrounds, footer |
| `--blue-ink` | `#1f6e8c` | Buttons, links, eyebrows (AA contrast) |
| `--blue` | `#2c87a8` | Decorative accents only |
| `--blue-light` | `#3ba6cb` | Accents on navy |
| `--paper` | `#f3f6f6` | Cool off-white sections |
| `--rule` | `#d3dcdf` | Hairline dividers |
| `--signal` | `#e0a526` | Route-line dot only (never text) |

Fonts: **Atkinson Hyperlegible Next** (text) and **Atkinson Hyperlegible Mono** (labels, phone numbers, counties), both from Google Fonts.

## Local preview

Serve the folder with a local server (root-absolute paths need one; opening files directly won't load styles):

```bash
python3 -m http.server 8000
```

On this Mac, `~/Desktop` is privacy-protected, so copy the folder elsewhere first if the server can't read it.

## Key facts

- **Phone:** (530) 453-6220, booking line open 24/7
- **Email:** Admin@guardianms.org
- **Counties served:** Sacramento, Placer, Yolo, Yuba, Sutter, Nevada, Solano, San Joaquin, Butte, Colusa, Glenn (+ long distance)
- **Services:** Ambulatory, Wheelchair, Gurney; Specialty: Bariatric, Oxygen Tank, Long Distance
- **Drivers:** HIPAA, First Aid, and CPR certified; background-checked
- **Payment:** Private pay only, no insurance, Medi-Cal/Medicaid, or brokers. Trips are quoted before booking.
