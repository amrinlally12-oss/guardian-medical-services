#!/usr/bin/env python3
"""Stamp the shared head/header/footer partials into every page.

Each page contains marker pairs:
    <!-- HEAD:START --> ... <!-- HEAD:END -->
    <!-- HEADER:START --> ... <!-- HEADER:END -->
    <!-- FOOTER:START --> ... <!-- FOOTER:END -->
The content between markers is replaced with _partials/<name>.html. The nav
link matching the page (data-nav="<page>") gets aria-current="page".

A page may also contain <!-- FAQ-SCHEMA:START/END -->; it is filled with
FAQPage JSON-LD built from the page's <details class="faq-item"> blocks, so
the structured data always matches the visible questions and answers.

Output is plain HTML that is committed, so GitHub Pages needs no build step.
Safe to run repeatedly. Run from the repo root:  python3 _tools/sync_partials.py
"""
import html as htmllib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTIALS = ROOT / "_partials"
BLOCKS = ["HEAD", "HEADER", "FOOTER"]


def page_key(path):
    return "home" if path.stem == "index" else path.stem


def render(block, key):
    text = (PARTIALS / f"{block.lower()}.html").read_text(encoding="utf-8").rstrip("\n")
    if block == "HEADER":
        text = text.replace(f'data-nav="{key}"', f'data-nav="{key}" aria-current="page"')
    return text


def plain_text(fragment):
    text = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", htmllib.unescape(text)).strip()


def faq_schema(html):
    items = []
    for block in re.findall(r'<details class="faq-item"[^>]*>(.*?)</details>', html, re.S):
        question = re.search(r"<summary>(.*?)</summary>", block, re.S)
        answer = re.search(r'<div class="faq-answer">(.*)</div>', block, re.S)
        if question and answer:
            items.append({
                "@type": "Question",
                "name": plain_text(question.group(1)),
                "acceptedAnswer": {"@type": "Answer", "text": plain_text(answer.group(1))},
            })
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items}
    body = json.dumps(data, indent=4, ensure_ascii=False).replace("</", "<\\/")
    body = "\n".join("    " + line for line in body.splitlines())
    return f'    <script type="application/ld+json">\n{body}\n    </script>'


def main():
    changed = 0
    for page in sorted(ROOT.glob("*.html")):
        html = page.read_text(encoding="utf-8")
        new = html
        faq = re.compile(r"(<!-- FAQ-SCHEMA:START -->\n).*?(\n[ \t]*<!-- FAQ-SCHEMA:END -->)", re.S)
        if faq.search(new):
            schema = faq_schema(new)
            new = faq.sub(lambda m: m.group(1) + schema + m.group(2), new)
        for block in BLOCKS:
            pattern = re.compile(
                rf"(<!-- {block}:START -->\n).*?(\n[ \t]*<!-- {block}:END -->)", re.S
            )
            if not pattern.search(new):
                print(f"warning: {page.name} has no {block} markers", file=sys.stderr)
                continue
            content = render(block, page_key(page))
            new = pattern.sub(lambda m: m.group(1) + content + m.group(2), new)
        if new != html:
            page.write_text(new, encoding="utf-8")
            changed += 1
            print(f"updated {page.name}")
    print(f"{changed} page(s) updated")


if __name__ == "__main__":
    main()
