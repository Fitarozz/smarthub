#!/usr/bin/env python3
"""Regenerate all Tauri icon sizes from smarthub.png source."""
import os
from PIL import Image

ICONS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src-tauri', 'icons')
ICONSET_DIR = os.path.join(ICONS_DIR, 'icons.iconset')
os.makedirs(ICONSET_DIR, exist_ok=True)

src = Image.open(os.path.join(ICONS_DIR, 'smarthub.png')).convert('RGBA')
print(f"Source: {src.size}, corner pixel: {src.getpixel((0, 0))}")

ICONSET_SIZES = [
    ('icon_16x16.png',       16),
    ('icon_16x16@2x.png',    32),
    ('icon_32x32.png',       32),
    ('icon_32x32@2x.png',    64),
    ('icon_128x128.png',    128),
    ('icon_128x128@2x.png', 256),
    ('icon_256x256.png',    256),
    ('icon_256x256@2x.png', 512),
    ('icon_512x512.png',    512),
    ('icon_512x512@2x.png', 1024),
]

for fname, size in ICONSET_SIZES:
    img = src.resize((size, size), Image.LANCZOS)
    path = os.path.join(ICONSET_DIR, fname)
    img.save(path)
    print(f"  {fname} ({size}x{size})")

# Standalone files referenced in tauri.conf.json
for fname, size in [('icon_32x32.png', 32), ('icon_128x128.png', 128),
                    ('icon_256x256.png', 256), ('icon_512x512.png', 512)]:
    img = src.resize((size, size), Image.LANCZOS)
    img.save(os.path.join(ICONS_DIR, fname))

# icon.png (1024)
src.save(os.path.join(ICONS_DIR, 'icon.png'))
print("Done regenerating PNG sizes.")
