#!/usr/bin/env python3
"""Quick debug script to inspect wiki HTML structure."""

from urllib import request
import re

url = 'https://wiki.bloodontheclocktower.com/index.php/Trouble_Brewing'
req = request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

with request.urlopen(req, timeout=30) as response:
    html = response.read().decode('utf-8')
    
    # Find Townsfolk section
    match = re.search(r'<h2><span class="mw-headline"[^>]*>Townsfolk</span>.*?</h2>(.*?)(?=<h2>)', html, re.DOTALL)
    
    if match:
        section = match.group(1)
        # Extract all links
        links = re.findall(r'<a href="[^"]*" title="([^"]+)"[^>]*>', section)
        print(f'Found {len(links)} links in Townsfolk section:')
        for i, link in enumerate(links[:15]):
            print(f'  {i+1}. {link}')
    else:
        print('Townsfolk section not found')
        # Try simpler search
        print("\nSearching for h2 tags...")
        headers = re.findall(r'<h2><span class="mw-headline"[^>]*>([^<]+)</span>', html)
        print(f"Found {len(headers)} headers:")
        for h in headers[:10]:
            print(f"  - {h}")
