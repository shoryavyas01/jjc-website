"""Check published HTML and artwork without third-party dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids, self.schemas, self.errors = [], [], [], []
        self.h1 = 0
        self.in_schema = False
        self.schema_text = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h1":
            self.h1 += 1
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for key in ("href", "src"):
            if key in attrs:
                self.refs.append(attrs[key])
        if tag == "img" and not attrs.get("alt"):
            self.errors.append("Missing image alternative text")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_schema = True
            self.schema_text = ""

    def handle_endtag(self, tag):
        if tag == "script" and self.in_schema:
            self.schemas.append(json.loads(self.schema_text))
            self.in_schema = False

    def handle_data(self, data):
        if self.in_schema:
            self.schema_text += data

pages = {}
for path in ROOT.glob("*.html"):
    page = Page()
    page.feed(path.read_text())
    pages[path.name] = page
    assert page.h1 == 1, f"{path.name}: expected one H1"
    assert len(page.ids) == len(set(page.ids)), f"{path.name}: duplicate IDs"
    assert not page.errors, f"{path.name}: {page.errors}"
    assert page.schemas, f"{path.name}: missing structured data"
for name, page in pages.items():
    for ref in page.refs:
        url = urlparse(ref)
        if url.scheme or url.netloc:
            continue
        target = unquote(url.path).lstrip("/") or name
        assert (ROOT / target).exists(), f"{name}: missing resource {ref}"
        if url.fragment and target in pages:
            assert url.fragment in pages[target].ids, f"{name}: missing anchor {ref}"
for path in (ROOT / "assets").rglob("*.svg"):
    ET.parse(path)
assert 'status = 404' in (ROOT / 'netlify.toml').read_text()
print(f"PASS: {len(pages)} pages; local links, anchors, images, IDs, H1s, JSON-LD, SVG XML, and 404 configuration.")
