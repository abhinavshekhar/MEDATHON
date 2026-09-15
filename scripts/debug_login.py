import re
import requests

s = requests.Session()
s.headers["User-Agent"] = "Mozilla/5.0"

r = s.post(
    "https://hims-aphc.bhavyabiharhealth.in/doLogin.php",
    data={"username": "ANO-2260", "password": "PlusA@123"},
    allow_redirects=True,
    timeout=30,
)
print("URL:", r.url)
print("Cookies:", [(c.name, c.domain, c.value[:20]) for c in s.cookies])

links = re.findall(r'href=["\']([^"\']+)["\']', r.text)
keywords = ("aphc", "mordiva", "dashboard", "facility", "clinic", "hims-aphc")
relevant = [l for l in links if any(k in l.lower() for k in keywords)]
print("Relevant links:", relevant[:30])

title = re.search(r"<title>(.*?)</title>", r.text, re.I)
print("Title:", title.group(1) if title else "none")

# Try main portal login too
r2 = s.post(
    "https://hims.bhavyabiharhealth.in/doLogin.php",
    data={"username": "ANO-2260", "password": "PlusA@123"},
    allow_redirects=True,
    timeout=30,
)
print("\nMain portal URL:", r2.url)
links2 = re.findall(r'href=["\']([^"\']+)["\']', r2.text)
relevant2 = [l for l in links2 if any(k in l.lower() for k in keywords)]
print("Main portal relevant links:", relevant2[:30])

# Try accessing dashboard directly with session
r3 = s.get("https://hims-aphc.bhavyabiharhealth.in/dashboard.php", timeout=30)
print("\nDashboard URL:", r3.url)
print("Dashboard title:", re.search(r"<title>(.*?)</title>", r3.text, re.I).group(1))
print("Is login?", "Sign in" in r3.text or "username" in r3.text[:3000])
