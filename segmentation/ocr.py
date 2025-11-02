from PIL import Image
import pytesseract
import os


path = os.path.join(os.environ["HOME"], "Pictures", "isu.png")
image = Image.open(path)
print(pytesseract.image_to_string(image, lang="eng"))
