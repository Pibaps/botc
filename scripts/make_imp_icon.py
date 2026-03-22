from PIL import Image, ImageDraw
import os
src = 'C:/Users/pbapi/Documents/Projets/botc/public/assets/botc/wiki.bloodontheclocktower.com/Icon_imp-32541f1a31.png'
dst = 'C:/Users/pbapi/Documents/Projets/botc/public/assets/botc/app-icons/botc-imp-dark.png'
os.makedirs(os.path.dirname(dst), exist_ok=True)
img = Image.open(src).convert('RGBA')
size = max(img.width, img.height, 591)
background = Image.new('RGBA', (size, size), (10, 5, 6, 255))
draw = ImageDraw.Draw(background)
for y in range(size):
    t = y / (size - 1)
    r = int(10 + t * 45)
    g = int(5 + t * 2)
    b = int(6 + t * 4)
    draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
scale = min((size * 0.8) / img.width, (size * 0.8) / img.height)
neww = int(img.width * scale)
newh = int(img.height * scale)
imp = img.resize((neww, newh), Image.LANCZOS)
background.paste(imp, ((size - neww) // 2, (size - newh) // 2), imp)
background.save(dst, 'PNG')
print('created', dst, 'size', size, 'imp', neww, newh)
