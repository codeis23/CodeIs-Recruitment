from PIL import Image

img = Image.open('backup_logo.png').convert('RGBA')
data = img.getdata()

new_data = []
tr, tg, tb = 242, 194, 48  # #F2C230

for r, g, b, a in data:
    # We want to identify the checkerboard background.
    # The background is white/gray. R, G, B are all high and very close to each other.
    # The logo is golden/yellow.
    
    # Calculate how grayscale the pixel is
    colorfulness = max(abs(r-g), abs(g-b), abs(r-b))
    
    # Calculate lightness
    lightness = (r + g + b) / 3.0
    
    # Background pixels are light (>180) and have low colorfulness (<20)
    if lightness > 180 and colorfulness < 30:
        # It's background or anti-aliased edge fading into background
        # Let's create a smooth alpha based on how dark the pixel is compared to pure white
        # If lightness is 255 -> alpha 0
        # If lightness is 180 -> alpha 255
        alpha = int(255 * (240 - lightness) / (240 - 180))
        alpha = max(0, min(255, alpha))
    else:
        # It's the logo
        alpha = 255
        
    if alpha > 0:
        # Preserve relative lightness for shading
        # Main logo color lightness is around 190
        factor = lightness / 190.0
        factor = max(0.5, min(factor, 1.2))
        
        nr = int(tr * factor)
        ng = int(tg * factor)
        nb = int(tb * factor)
        
        nr = max(0, min(255, nr))
        ng = max(0, min(255, ng))
        nb = max(0, min(255, nb))
        
        new_data.append((nr, ng, nb, alpha))
    else:
        new_data.append((0, 0, 0, 0))

img.putdata(new_data)
img.save('Gemini_Generated_Image_rgni14rgni14rgni.png')
print("Fixed logo saved.")
