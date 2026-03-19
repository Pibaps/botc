#!/usr/bin/env python3

from urllib import request

url = "https://wiki.bloodontheclocktower.com/index.php/Setup"
req = request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = request.urlopen(req, timeout=30).read().decode("utf-8")

terms = ["5 players", "6 players", "7 players", "8 players", "9 players", "10 players"]

for term in terms:
    idx = html.find(term)
    if idx != -1:
        print(f"--- {term} ---")
        start = max(0, idx - 200)
        end = idx + 300
        snippet = html[start:end]
        snippet = snippet.replace("\n", " ")
        snippet = " ".join(snippet.split())
        print(snippet)
        print()
    else:
        print(f"{term}: not found")
