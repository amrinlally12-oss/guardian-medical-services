# Guardian Medical Services — Website

Official website for **Guardian Medical Services**, a non-emergency medical transportation (NEMT) provider serving the Sacramento Valley and Northern California.

Static, multi-page site — pure HTML/CSS/JS, no build tools. Designed to deploy free on GitHub Pages.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, services overview, why-us, how-it-works, service area, CTA |
| `services.html` | Core services + specialty transport (bariatric, oxygen, long distance) |
| `book.html` | Book a Ride — Formspree request form (minimized personal info) |
| `about.html` | About, values, certifications, team |
| `faq.html` | Frequently asked questions |
| `contact.html` | Phone, email, hours, service-area counties |
| `404.html` | Custom not-found page |

## Tech

- Pure HTML, CSS (`css/style.css`), JavaScript (`js/main.js`) — no frameworks or dependencies
- Google Fonts: Poppins (display) + Inter (body)
- [Formspree](https://formspree.io) for the booking form (free tier, no backend)
- GitHub Pages hosting

## Setup checklist (before launch)

1. **Add the logo.** Save the Guardian shield/wordmark image as `images/logo.png`
   (recommended ~600px wide, transparent PNG). Until then, the site shows a styled
   text fallback and the SVG shield. A favicon (`images/favicon.svg`) is already included.
2. **Wire up the booking form.** Create a form at [formspree.io](https://formspree.io)
   and replace `YOUR_FORM_ID` in `book.html` (the `<form action="...">` URL) with your
   real form endpoint. Until then the form shows a local success message and sends nothing.
3. **Enable GitHub Pages.** Repo → Settings → Pages → deploy from `main` / root.
4. *(Optional)* Add a custom domain via a `CNAME` file + DNS, and add Google Analytics.

## Brand colors

| Token | Hex | Use |
|-------|-----|-----|
| `--navy` | `#143041` | Shield navy, dark backgrounds |
| `--navy-deep` | `#0e2532` | Deepest backgrounds |
| `--blue` | `#2c87a8` | Primary accent, buttons |
| `--blue-light` | `#3ba6cb` | Hover / lighter accent |
| `--sky` | `#e9f4f8` | Light tinted sections |

## Local preview

Open `index.html` directly in a browser, or run a local server from the project folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Key facts

- **Phone:** (530) 453-6220 — available 24/7
- **Email:** Admin@guardianms.org
- **Counties served:** Sacramento, Placer, Yolo, Yuba, Sutter, Nevada, Solano, San Joaquin, Butte, Colusa, Glenn (+ long distance)
- **Services:** Ambulatory, Wheelchair, Gurney; Specialty: Bariatric, Oxygen Tank, Long Distance
- **Drivers:** HIPAA, First Aid, and CPR certified
- **Payment:** Private-pay only — no insurance, Medicaid, or brokers
