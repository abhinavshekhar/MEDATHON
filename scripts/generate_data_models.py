#!/usr/bin/env python3
"""Convert raw HIMS page extraction JSON into structured data model files."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
INPUT = ROOT / "scripts" / "extraction_output_utf8.json"
OUTPUT_DIR = ROOT / "docs" / "DATA_MODELS" / "pages"

# Map page titles to slug filenames
SLUG_MAP = {
    "Patient Records": "patient-records",
    "MCH Patient Registration": "mch-registration",
    "Pharmacy Workspace": "pharmacy-workspace",
    "Lab Workspace": "lab-workspace",
    "MIS Reports": "mis-dashboard",
    "A & E Patient Registration": "ae-registration",
    "Drug Dispense": "drug-dispense",
    "Pathology Patient Registration": "pathology-registration",
    "ABDM Profile": "abdm-profile",
    "Roster Management": "roster-management",
}


def clean_heading(h: str) -> str:
    return re.sub(r"\s+", " ", h).strip()


def is_system_field(field: dict) -> bool:
    fid = field.get("id", "")
    ftype = field.get("type", "")
    if ftype == "hidden":
        return True
    if fid.startswith("idHidden") or fid in ("_csrf_token",):
        return True
    return False


def build_page_model(page: dict) -> dict:
    visible_fields = [f for f in page.get("fields", []) if not is_system_field(f)]
    headings = [clean_heading(h) for h in page.get("headings", []) if clean_heading(h) not in ("BHAVYA", "Veena Kumari", "Logged in Since")]

    return {
        "title": page["title"],
        "url": page["url"],
        "legacyPath": "/" + page["url"].split("/")[-1],
        "headings": headings,
        "searchFields": [
            f for f in visible_fields
            if "search" in (f.get("label") or "").lower() or "search" in (f.get("id") or "").lower()
        ],
        "formFields": [
            {
                "id": f.get("id"),
                "label": f.get("label") or f.get("placeholder") or f.get("id"),
                "type": f.get("type") or f.get("tag"),
                "tag": f.get("tag"),
                "required": f.get("required", False),
                "options": f.get("options") or [],
            }
            for f in visible_fields
            if "search" not in (f.get("label") or "").lower()
        ],
        "tables": page.get("tables", []),
        "fieldCount": len(visible_fields),
        "tableCount": len(page.get("tables", [])),
    }


def main():
    data = json.loads(INPUT.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    index = {"generatedFrom": str(INPUT.relative_to(ROOT)), "pages": []}

    for page in data:
        slug = SLUG_MAP.get(page["title"], re.sub(r"[^a-z0-9]+", "-", page["title"].lower()).strip("-"))
        model = build_page_model(page)
        out_path = OUTPUT_DIR / f"{slug}.json"
        out_path.write_text(json.dumps(model, indent=2, ensure_ascii=False), encoding="utf-8")
        index["pages"].append({
            "slug": slug,
            "title": page["title"],
            "file": f"pages/{slug}.json",
            "fieldCount": model["fieldCount"],
            "tableCount": model["tableCount"],
        })
        print(f"  {slug}.json — {model['fieldCount']} fields, {model['tableCount']} tables")

    index_path = ROOT / "docs" / "DATA_MODELS" / "index.json"
    index_path.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {len(index['pages'])} page models + index.json")


if __name__ == "__main__":
    main()
