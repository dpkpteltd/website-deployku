import os
from PIL import Image

# section key -> source numbered PNG (number-order mapping, light sections only)
MAPPING = {
    "hero": 1,
    "caps": 2,
    "work": 8,
    "approach": 4,
    "about": 7,
    "contact": 6,
}

DESKTOP_MAXW = 1920
MOBILE_MAXW = 828
DESKTOP_Q = 80
MOBILE_Q = 78

here = os.path.dirname(os.path.abspath(__file__))

def load_rgb(num):
    im = Image.open(os.path.join(here, f"bg-{num}.png"))
    if im.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA")
        bg.paste(im, mask=im.split()[-1])
        return bg
    return im.convert("RGB")

def scaled(im, maxw):
    if im.width <= maxw:
        return im
    h = round(im.height * maxw / im.width)
    return im.resize((maxw, h), Image.LANCZOS)

for key, num in MAPPING.items():
    src = load_rgb(num)
    d = scaled(src, DESKTOP_MAXW)
    dpath = os.path.join(here, f"bg-{key}.webp")
    d.save(dpath, "WEBP", quality=DESKTOP_Q, method=6)
    m = scaled(src, MOBILE_MAXW)
    mpath = os.path.join(here, f"bg-{key}-m.webp")
    m.save(mpath, "WEBP", quality=MOBILE_Q, method=6)
    print(f"bg-{num}.png ({src.width}x{src.height})  ->  "
          f"bg-{key}.webp [{d.width}x{d.height}, {os.path.getsize(dpath)//1024}KB]  +  "
          f"bg-{key}-m.webp [{m.width}x{m.height}, {os.path.getsize(mpath)//1024}KB]")
