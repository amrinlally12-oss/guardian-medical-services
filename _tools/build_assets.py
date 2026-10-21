#!/usr/bin/env python3
"""Generate the site's derived image assets from _source/logo-master.png.

Outputs (in images/):
  logo.png / logo.webp        full vertical lockup
  logo-icon.png / .webp       shield only (nav + footer)
  favicon-32.png              browser tab fallback for favicon.svg
  apple-touch-icon.png        180x180, white background (iOS fills transparency black)
  icon-192.png, icon-512.png  web app manifest icons
  og-image.jpg                1200x630 social share card

Requires Pillow. Run from the repo root:  python3 _tools/build_assets.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "_source" / "logo-master.png"
OUT = ROOT / "images"

NAVY = (20, 48, 65)
NAVY_DEEP = (14, 37, 50)
BLUE_LIGHT = (59, 166, 203)
WHITE = (255, 255, 255)
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

# The master is shield (rows 0-1195) above the GUARDIAN wordmark.
SHIELD_BOTTOM = 1205


def fit_width(img, width):
    w, h = img.size
    return img.resize((width, round(h * width / w)), Image.LANCZOS)


def fit_height(img, height):
    w, h = img.size
    return img.resize((round(w * height / h), height), Image.LANCZOS)


def on_square(img, size, bg, pad_ratio):
    canvas = Image.new("RGBA", (size, size), bg)
    inner = round(size * (1 - 2 * pad_ratio))
    icon = img.copy()
    icon.thumbnail((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
    return canvas


def og_image(shield):
    w, h = 1200, 630
    card = Image.new("RGB", (w, h), NAVY_DEEP)
    # Vertical gradient navy-deep -> navy
    draw = ImageDraw.Draw(card)
    for y in range(h):
        t = y / (h - 1)
        draw.line([(0, y), (w, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(NAVY_DEEP, NAVY)))

    # White rounded plate behind the shield so its navy outline stays visible.
    plate = Image.new("RGBA", (300, 340), (0, 0, 0, 0))
    ImageDraw.Draw(plate).rounded_rectangle([0, 0, 299, 339], radius=36, fill=WHITE)
    icon = fit_height(shield, 260)
    plate.alpha_composite(icon, ((300 - icon.width) // 2, 40))
    card.paste(plate, (90, 145), plate)

    big = ImageFont.truetype(FONT_BOLD, 76)
    mid = ImageFont.truetype(FONT_BOLD, 34)
    small = ImageFont.truetype(FONT_REG, 30)
    x = 450
    draw.text((x, 170), "GUARDIAN", font=big, fill=WHITE)
    draw.text((x, 258), "MEDICAL SERVICES", font=mid, fill=BLUE_LIGHT)
    draw.text((x, 330), "Wheelchair, gurney & medical", font=small, fill=(220, 232, 238))
    draw.text((x, 370), "transportation across Northern California", font=small, fill=(220, 232, 238))
    draw.text((x, 432), "Rides 24/7  •  (530) 453-6220", font=mid, fill=WHITE)
    return card


def main():
    master = Image.open(SRC).convert("RGBA")
    full = master.crop(master.getbbox())
    shield = master.crop((0, 0, master.width, SHIELD_BOTTOM))
    shield = shield.crop(shield.getbbox())

    logo = fit_width(full, 720)
    logo.save(OUT / "logo.png", optimize=True)
    logo.save(OUT / "logo.webp", quality=90, method=6)

    icon = fit_height(shield, 430)
    icon.save(OUT / "logo-icon.png", optimize=True)
    # Shown at 46-55px tall; 2x for retina.
    fit_height(shield, 120).save(OUT / "logo-icon.webp", quality=90, method=6)

    on_square(shield, 32, (0, 0, 0, 0), 0.02).save(OUT / "favicon-32.png", optimize=True)
    on_square(shield, 180, WHITE, 0.12).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
    on_square(shield, 192, WHITE, 0.12).save(OUT / "icon-192.png", optimize=True)
    on_square(shield, 512, WHITE, 0.12).save(OUT / "icon-512.png", optimize=True)

    og_image(shield).save(OUT / "og-image.jpg", quality=88, optimize=True, progressive=True)

    for f in sorted(OUT.iterdir()):
        print(f"{f.name:22} {f.stat().st_size:>8,} bytes")


if __name__ == "__main__":
    main()
