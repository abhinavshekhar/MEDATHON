"""Extract form fields, headings, and tables from BHAVYA HIMS pages."""
import json
import re
import sys
from html.parser import HTMLParser

import requests

MAIN_BASE = "https://hims.bhavyabiharhealth.in"
APHC_BASE = "https://hims-aphc.bhavyabiharhealth.in"
USERNAME = "ANO-2260"
PASSWORD = "PlusA@123"
FACILITY_CODE = "SA-Y75"

PAGES = [
    "/PatientRecords.php",
    "/MCHPatientRegistration.php",
    "/pharmacyQueue.php",
    "/labQueue.php",
    "/MISDashboard.php",
    "/AEPatientRegistration.php",
    "/drugDispensev2.php",
    "/pathologyPatientRegistration.php",
    "/abdmProfile.php",
    "/rosterManagement.php",
]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.headings = []
        self.fields = []
        self.tables = []
        self._current_heading_tag = None
        self._current_table = None
        self._in_th = False
        self._in_option = False
        self._current_select = None
        self._current_option_text = ""
        self._label_map = {}
        self._in_label = False
        self._label_for = ""
        self._label_text = ""

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        tag = tag.lower()

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._current_heading_tag = tag
            self._heading_buf = []

        if tag == "label":
            self._in_label = True
            self._label_for = attrs_dict.get("for", "")
            self._label_text = ""

        if tag == "table":
            self._current_table = {"id": attrs_dict.get("id", ""), "headers": []}

        if tag == "th" and self._current_table is not None:
            self._in_th = True
            self._th_text = []

        if tag == "select":
            self._current_select = {
                "tag": "select",
                "type": "",
                "name": attrs_dict.get("name", ""),
                "id": attrs_dict.get("id", ""),
                "label": "",
                "placeholder": "",
                "required": "required" in attrs_dict,
                "options": [],
            }

        if tag == "option" and self._current_select is not None:
            self._in_option = True
            self._current_option_text = ""

        if tag in ("input", "textarea"):
            field = {
                "tag": tag,
                "type": attrs_dict.get("type", "text" if tag == "input" else ""),
                "name": attrs_dict.get("name", ""),
                "id": attrs_dict.get("id", ""),
                "label": "",
                "placeholder": attrs_dict.get("placeholder", ""),
                "required": "required" in attrs_dict,
                "options": [],
            }
            self.fields.append(field)

    def handle_endtag(self, tag):
        tag = tag.lower()

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self._current_heading_tag == tag:
            text = "".join(self._heading_buf).strip()
            if text:
                self.headings.append(text)
            self._current_heading_tag = None

        if tag == "label" and self._in_label:
            if self._label_for:
                self._label_map[self._label_for] = self._label_text.strip()
            self._in_label = False

        if tag == "th" and self._in_th:
            text = "".join(self._th_text).strip()
            if text and self._current_table is not None:
                self._current_table["headers"].append(text)
            self._in_th = False

        if tag == "table" and self._current_table is not None:
            self.tables.append(self._current_table)
            self._current_table = None

        if tag == "option" and self._in_option:
            text = self._current_option_text.strip()
            if text and self._current_select is not None:
                if len(self._current_select["options"]) < 20:
                    self._current_select["options"].append(text)
            self._in_option = False

        if tag == "select" and self._current_select is not None:
            self.fields.append(self._current_select)
            self._current_select = None

    def handle_data(self, data):
        if self._current_heading_tag:
            self._heading_buf.append(data)
        if self._in_label:
            self._label_text += data
        if self._in_th:
            self._th_text.append(data)
        if self._in_option:
            self._current_option_text += data

    def finalize_fields(self):
        for field in self.fields:
            fid = field.get("id", "")
            if fid and fid in self._label_map:
                field["label"] = self._label_map[fid]
            elif not field["label"]:
                field["label"] = field.get("placeholder") or field.get("name") or ""


def login_and_access_facility(session: requests.Session) -> bool:
    r = session.post(
        f"{MAIN_BASE}/doLogin.php",
        data={"username": USERNAME, "password": PASSWORD},
        allow_redirects=True,
        timeout=30,
    )
    print(f"Login -> {r.url}", file=sys.stderr)
    if "dashboard" not in r.url:
        return False

    r2 = session.get(
        f"{MAIN_BASE}/accessHIMS.php?sFacilityCode={FACILITY_CODE}",
        allow_redirects=True,
        timeout=30,
    )
    print(f"Facility -> {r2.url}", file=sys.stderr)
    return "aphc" in r2.url and "login" not in r2.url.lower()


def parse_page(html: str, url: str) -> dict:
    title_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    title = re.sub(r"\s+", " ", title_m.group(1)).strip() if title_m else ""

    parser = PageParser()
    parser.feed(html)
    parser.finalize_fields()

    return {
        "url": url,
        "title": title,
        "headings": parser.headings,
        "fields": parser.fields[:80],
        "tables": parser.tables,
    }


def main():
    session = requests.Session()
    session.headers.update(
        {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )

    if not login_and_access_facility(session):
        print(json.dumps({"error": "Login or facility access failed"}))
        sys.exit(1)

    results = []
    for page in PAGES:
        url = f"{APHC_BASE}{page}"
        print(f"Fetching {url}...", file=sys.stderr)
        try:
            r = session.get(url, timeout=60)
            data = parse_page(r.text, r.url)
            data["status_code"] = r.status_code
            data["is_login_page"] = "login" in r.url.lower() or (
                len(data["fields"]) == 2
                and all(f.get("name") in ("username", "password") for f in data["fields"])
            )
            results.append(data)
        except Exception as e:
            results.append({"url": url, "error": str(e)})

    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
