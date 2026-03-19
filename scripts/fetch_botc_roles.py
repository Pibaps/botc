#!/usr/bin/env python3
"""
Scrape Blood on the Clocktower wiki to extract roles and their composition rules.
Saves comprehensive JSON database of all roles and their constraints per edition.

Usage:
    python fetch_botc_roles.py
    python fetch_botc_roles.py --output src/data/wiki-roles.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass, asdict, field
from pathlib import Path
from typing import Optional
from urllib import request, error
from urllib.parse import urljoin
from html.parser import HTMLParser

USER_AGENT = "BOCT-RoleScraper/1.0 (+local project tooling)"

# Map of wiki pages to BotC editions
EDITION_URLS = [
    ("trouble-brewing", "https://wiki.bloodontheclocktower.com/index.php/Trouble_Brewing"),
    ("bad-moon-rising", "https://wiki.bloodontheclocktower.com/index.php/Bad_Moon_Rising"),
    ("sects-and-violets", "https://wiki.bloodontheclocktower.com/index.php/Sects_and_Violets"),
]


@dataclass
class Role:
    id: str
    name: str
    role_type: str  # townsfolk, outsider, minion, demon, traveller, fabled
    edition: str
    ability: str
    first_night: bool = False
    other_nights: bool = False
    link: Optional[str] = None


class WikiRoleExtractor(HTMLParser):
    """Extract roles from wiki HTML using common patterns."""
    
    def __init__(self):
        super().__init__()
        self.current_section: Optional[str] = None
        self.roles: list[Role] = []
        self.in_header = False
        self.current_text = []
    
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        # Detect section headers (Townsfolk, Outsiders, Minions, Demons)
        if tag in ("h2", "h3"):
            self.in_header = True
    
    def handle_endtag(self, tag):
        if tag in ("h2", "h3"):
            self.in_header = False
            section_text = "".join(self.current_text).strip()
            self.current_text = []
            
            # Map section to role type
            section_lower = section_text.lower()
            if "townsfolk" in section_lower:
                self.current_section = "townsfolk"
            elif "outsider" in section_lower:
                self.current_section = "outsider"
            elif "minion" in section_lower:
                self.current_section = "minion"
            elif "demon" in section_lower:
                self.current_section = "demon"
            elif "traveller" in section_lower:
                self.current_section = "traveller"
            elif "fabled" in section_lower:
                self.current_section = "fabled"
    
    def handle_data(self, data):
        if self.in_header:
            self.current_text.append(data)


def fetch_url(url: str) -> str:
    """Fetch URL content with proper headers."""
    try:
        req = request.Request(url, headers={"User-Agent": USER_AGENT})
        with request.urlopen(req, timeout=30) as response:
            return response.read().decode("utf-8")
    except error.URLError as e:
        print(f"Error fetching {url}: {e}", file=sys.stderr)
        return ""


def extract_roles_from_html(html: str, edition: str) -> list[Role]:
    """
    Extract roles from wiki HTML by finding sections and extracting character links.
    Wikipedia/MediaWiki format: <h2><span...>SECTION</span></h2> followed by <a title="CharName">
    """
    roles: list[Role] = []
    
    # Section types we care about
    role_types = ["Townsfolk", "Outsiders?", "Minions?", "Demons?", "Travellers?", "Fabled"]
    
    for role_type_pattern in role_types:
        # Build pattern to find section header and content until next h2
        section_pattern = (
            rf'<h2><span class="mw-headline"[^>]*>{role_type_pattern}</span>.*?</h2>(.*?)(?=<h2>)'
        )
        
        match = re.search(section_pattern, html, re.IGNORECASE | re.DOTALL)
        if not match:
            continue
        
        section_content = match.group(1)
        header_match = re.search(rf'{role_type_pattern}', match.group(0), re.IGNORECASE)
        if not header_match:
            continue
        
        section_name = header_match.group(0).lower()
        
        # Map section to role type
        if "townsfolk" in section_name:
            role_type = "townsfolk"
        elif "outsider" in section_name:
            role_type = "outsider"
        elif "minion" in section_name:
            role_type = "minion"
        elif "demon" in section_name:
            role_type = "demon"
        elif "traveller" in section_name:
            role_type = "traveller"
        elif "fabled" in section_name:
            role_type = "fabled"
        else:
            continue
        
        # Extract character names from links within section
        # Pattern: <a href="..." title="CharacterName">...</a>
        char_links = re.findall(
            r'<a href="[^"]*" title="([^"]+)"[^>]*>',
            section_content
        )
        
        # Deduplicate and add roles
        seen = set()
        for char_name in char_links:
            char_id = re.sub(r'[^\w]+', '-', char_name).lower().strip("-")
            
            # Skip if we've already added this character in this edition
            key = (char_id, edition)
            if key in seen or char_id in ("file", "enlarge", "icon"):
                continue
            
            seen.add(key)
            roles.append(Role(
                id=char_id,
                name=char_name,
                role_type=role_type,
                edition=edition,
                ability="",
                first_night=False,
                other_nights=False,
            ))
    
    return roles


def scrape_edition(edition: str, url: str) -> list[Role]:
    """Scrape all roles from an edition page."""
    print(f"[*] Scraping {edition} from wiki...")
    html = fetch_url(url)
    
    if not html:
        print(f"[!] Failed to fetch {edition}", file=sys.stderr)
        return []
    
    roles = extract_roles_from_html(html, edition)
    print(f"[+] Extracted {len(roles)} roles from {edition}")
    
    # Small delay to be respectful to wiki server
    time.sleep(1)
    
    return roles


def main():
    parser = argparse.ArgumentParser(
        description="Scrape BotC wiki for roles and export as JSON.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python fetch_botc_roles.py
  python fetch_botc_roles.py --output src/data/wiki-roles.json
  python fetch_botc_roles.py --editions trouble-brewing bad-moon-rising
        """
    )
    parser.add_argument("--output", "-o", default="public/assets/botc/wiki-roles.json",
                        help="Output JSON file path (default: %(default)s)")
    parser.add_argument("--editions", nargs="+", 
                        default=[e[0] for e in EDITION_URLS],
                        help="Editions to scrape (default: all)")
    parser.add_argument("--dry-run", action="store_true", 
                        help="Don't write files, just print extracted data")
    
    args = parser.parse_args()
    
    all_roles: list[Role] = []
    
    print("\n[*] Blood on the Clocktower Role Scraper\n")
    
    for edition, url in EDITION_URLS:
        if edition not in args.editions:
            continue
        
        roles = scrape_edition(edition, url)
        all_roles.extend(roles)
    
    # Group by edition
    by_edition = {}
    for role in all_roles:
        if role.edition not in by_edition:
            by_edition[role.edition] = []
        by_edition[role.edition].append(role)
    
    # Statistics
    print(f"\n[+] Summary:")
    for edition in sorted(by_edition.keys()):
        roles = by_edition[edition]
        by_type = {}
        for role in roles:
            by_type.setdefault(role.role_type, []).append(role)
        
        type_str = ", ".join(f"{k}: {len(v)}" for k, v in sorted(by_type.items()))
        print(f"  {edition}: {len(roles)} roles ({type_str})")
    
    # Convert to JSON-serializable format
    roles_data = [asdict(r) for r in all_roles]
    
    if not args.dry_run:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(roles_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n[OK] Wrote {len(roles_data)} roles to {output_path}")
    else:
        print("\n[*] Dry run: printing extracted data...\n")
        print(json.dumps(roles_data, indent=2, ensure_ascii=False))
    
    return 0


if __name__ == "__main__":
    sys.exit(main())

