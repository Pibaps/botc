#!/usr/bin/env python3

import re
from urllib import request

url = "https://wiki.bloodontheclocktower.com/index.php/Setup"
req = request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = request.urlopen(req, timeout=30).read().decode("utf-8")

# Find the first table on the page
m = re.search(r"(?s)<table.*?</table>", html)
if not m:
    print("No table found")
    exit(1)

# Print a cleaned snippet of the first table
snippet = re.sub(r"\s+", " ", m.group(0))
print(snippet[:2400])
