import re
import requests

s = requests.Session()
s.headers["User-Agent"] = "Mozilla/5.0"

# Login on main portal
r = s.post(
    "https://hims.bhavyabiharhealth.in/doLogin.php",
    data={"username": "ANO-2260", "password": "PlusA@123"},
    allow_redirects=True,
    timeout=30,
)
print("After login:", r.url)

# Find facility access links
links = re.findall(r'href=["\']([^"\']+)["\']', r.text)
access = [l for l in links if "accessHIMS" in l]
print("Access links:", access)

# Access facility
if access:
    facility_url = access[0]
    if not facility_url.startswith("http"):
        facility_url = "https://hims.bhavyabiharhealth.in/" + facility_url.lstrip("/")
    r2 = s.get(facility_url, allow_redirects=True, timeout=30)
    print("Facility URL:", r2.url)
    print("Facility title:", re.search(r"<title>(.*?)</title>", r2.text, re.I).group(1))

# Try APHC pages
for page in ["/dashboard.php", "/PatientRecords.php"]:
    r3 = s.get(f"https://hims-aphc.bhavyabiharhealth.in{page}", allow_redirects=True, timeout=30)
    title = re.search(r"<title>(.*?)</title>", r3.text, re.I)
    print(f"\n{page} -> {r3.url}")
    print("Title:", title.group(1) if title else "none")
    headings = re.findall(r"<h[1-6][^>]*>(.*?)</h[1-6]>", r3.text, re.I | re.S)
    print("Headings:", [re.sub(r"\s+", " ", h).strip()[:80] for h in headings[:5]])
    inputs = len(re.findall(r"<input", r3.text, re.I))
    selects = len(re.findall(r"<select", r3.text, re.I))
    tables = len(re.findall(r"<table", r3.text, re.I))
    print(f"Inputs: {inputs}, Selects: {selects}, Tables: {tables}")
