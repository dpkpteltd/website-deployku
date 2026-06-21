import os
from PIL import Image, ImageDraw, ImageFont

here = os.path.dirname(os.path.abspath(__file__))
W, H = 1200, 630
NAVY = (14, 35, 62)
GREEN = (44, 255, 113)

# Base: cover-crop the hero photo to 1200x630
src = Image.open(os.path.join(here, "bg-1.png")).convert("RGB")
scale = max(W / src.width, H / src.height)
img = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)
left = (img.width - W) // 2
top = (img.height - H) // 2
img = img.crop((left, top, left + W, top + H))

# Scrim: darken left + bottom so white text reads
scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = scrim.load()
for y in range(H):
    for x in range(W):
        fx = 1 - (x / W)            # stronger on the left
        fy = (y / H)                # stronger toward the bottom
        a = int(205 * max(fx * 0.85, fy ** 1.6 * 0.9))
        sd[x, y] = (NAVY[0], NAVY[1], NAVY[2], min(a, 210))
img = Image.alpha_composite(img.convert("RGBA"), scrim).convert("RGB")

draw = ImageDraw.Draw(img)
f_eyebrow = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 30)
f_brand = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 92)
f_tag = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 40)

x0, y = 70, 360
draw.text((x0, y), "DEPLOYKU PTE LTD · SINGAPORE", font=f_eyebrow, fill=GREEN)
draw.text((x0, y + 44), "Deployku", font=f_brand, fill=(255, 255, 255))
draw.text((x0, y + 150), "We build the products that move", font=f_tag, fill=(226, 234, 245))
draw.text((x0, y + 196), "Southeast Asia.", font=f_tag, fill=(226, 234, 245))

out = os.path.join(here, "og-image.jpg")
img.save(out, "JPEG", quality=86, optimize=True)
print(f"og-image.jpg [{W}x{H}, {os.path.getsize(out)//1024}KB]")
