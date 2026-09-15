import json
from pathlib import Path

data = json.loads(Path("extraction_output_utf8.json").read_text(encoding="utf-8"))

for i, page in enumerate(data, 1):
    print(f"\n{'='*80}")
    print(f"PAGE {i}: {page['title']}")
    print(f"URL: {page['url']}")
    print(f"{'='*80}")
    print("\nHEADINGS:")
    for h in page.get("headings", []):
        print(f"  - {h}")
    print("\nFORM FIELDS:")
    for f in page.get("fields", []):
        opts = f.get("options", [])
        opt_str = f" | options: {opts}" if opts else ""
        req = " [required]" if f.get("required") else ""
        print(f"  - {f.get('label') or f.get('name') or f.get('id')} (name={f.get('name')}, id={f.get('id')}, type={f.get('type') or f.get('tag')}){req}{opt_str}")
    print("\nTABLES:")
    for t in page.get("tables", []):
        tid = f" (id={t['id']})" if t.get("id") else ""
        headers = ", ".join(t.get("headers", [])) or "(no headers)"
        print(f"  -{tid} columns: {headers}")
