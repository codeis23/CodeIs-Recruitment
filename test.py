from PIL import Image

img = Image.open('Gemini_Generated_Image_rgni14rgni14rgni.png').convert('RGBA')
data = img.getdata()

new_data = []
# Target color: #F2C230 -> 242, 194, 48
tr, tg, tb = 242, 194, 48

for r, g, b, a in data:
    if b > 210 and r > 200 and g > 200:
        alpha = 0
    elif b < 150 or r < 200 or g < 200:
        alpha = 255
    else:
        # Interpolate between 150 and 210 for blue
        alpha = int(255 * (210 - max(b, 150)) / (210 - 150))
    
    if alpha > 0:
        new_data.append((tr, tg, tb, alpha))
    else:
        new_data.append((0, 0, 0, 0))

img.putdata(new_data)
img.save('test_transparent2.png')
print("Saved test_transparent2.png")
