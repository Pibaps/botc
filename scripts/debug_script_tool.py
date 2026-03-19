#!/usr/bin/env python3

from urllib import request
import re

url = "https://wiki.bloodontheclocktower.com/index.php/Script_Tool"
req = request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = request.urlopen(req, timeout=30).read().decode("utf-8")

print(html[:1500])
