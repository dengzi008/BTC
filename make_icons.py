from PIL import Image, ImageDraw

size = 512
img = Image.new('RGBA', (size, size), (18, 8, 4, 255))
d = ImageDraw.Draw(img)

for i in range(size):
    t = i / (size - 1)
    r = int(58 * (1 - t) + 245 * t)
    g = int(24 * (1 - t) + 155 * t)
    b = int(10 * (1 - t) + 51 * t)
    d.line([(0, i), (size, i)], fill=(r, g, b, 255))

d.rounded_rectangle((18, 18, size - 18, size - 18), radius=108, outline=(255, 213, 142, 70), width=8)
d.ellipse((84, 84, 428, 428), outline=(255, 208, 138, 70), width=6)
d.ellipse((116, 116, 396, 396), outline=(255, 208, 138, 46), width=4)

points = [
    (256, 126), (292, 164), (344, 162), (330, 214), (368, 256), (330, 298), (344, 350), (292, 348),
    (256, 386), (220, 348), (168, 350), (182, 298), (144, 256), (182, 214), (168, 162), (220, 164)
]
d.polygon(points, fill=(255, 211, 138, 245))

ink = (126, 54, 14, 255)
d.line((256, 170, 256, 342), fill=ink, width=18)
d.line((208, 218, 304, 218), fill=ink, width=18)
d.line((194, 272, 318, 272), fill=ink, width=18)
d.line((216, 320, 296, 320), fill=ink, width=18)
d.ellipse((166, 166, 346, 346), outline=(255, 241, 209, 180), width=8)
d.arc((78, 252, 434, 470), start=200, end=340, fill=(255, 242, 218, 70), width=8)

img.save('apple-touch-icon.png')
img.save('favicon-32x32.png', sizes=[(32, 32)])
img.save('favicon-16x16.png', sizes=[(16, 16)])
img.save('favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
