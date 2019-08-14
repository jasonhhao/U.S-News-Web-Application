import random
from PIL import Image, ImageDraw, ImageFont
import time
import os
import string

# Captcha auth code


class Captcha(object):

    # font path = 'utils/captcha/verdana.ttf'
    font_path = os.path.join(os.path.dirname(__file__), 'verdana.ttf')

    # the number of digits for auth code
    number = 4

    # (width, height) of auth image
    size = (100, 40)

    # auth image background color
    bg_color = (0, 0, 0)

    # random the color of font (R,G,B)
    random.seed(int(time.time()))
    fontcolor = (random.randint(200, 255), random.randint(100, 255), random.randint(100, 255))

    font_size = 20

    # random generate interference lines color
    line_color = (random.randint(0, 250), random.randint(0, 255), random.randint(0, 250))

    # use interference line or not
    draw_line = True

    # use interference point or not
    draw_point = True

    # interference lines number
    line_number = 3

    # auth code char comes from string.ascii_letters
    SOURCE = list(string.ascii_letters)
    for index in range(0, 10):
        SOURCE.append(str(index))

    # randomly generate code string
    @classmethod
    def gene_text(cls):
        return ''.join(random.sample(cls.SOURCE, cls.number))

    # draw interference line
    @classmethod
    def __gene_line(cls, draw, width, height):
        begin = (random.randint(0, width), random.randint(0, height))
        end = (random.randint(0, width), random.randint(0, height))
        draw.line([begin, end], fill=cls.line_color)

    # draw interference point
    @classmethod
    def __gene_points(cls, draw, point_chance, width, height):
        chance = min(100, max(0, int(point_chance)))
        for w in range(width):
            for h in range(height):
                tmp = random.randint(0, 100)
                if tmp > 100 - chance:
                    draw.point((w, h), fill=(0, 0, 0))

    # generate auth code
    @classmethod
    def gene_code(cls):
        width, height = cls.size
        image = Image.new('RGBA', (width, height), cls.bg_color)
        font = ImageFont.truetype(cls.font_path, cls.font_size)
        draw = ImageDraw.Draw(image)
        text = cls.gene_text()
        font_width, font_height = font.getsize(text)

        # draw text code on image
        # x-cord = (width - font_width) / 2
        # y-cord = (height - font_height) / 2
        draw.text(((width - font_width) / 2, (height - font_height) / 2), text, font=font, fill=cls.fontcolor)

        if cls.draw_line:
            for x in range(0,cls.line_number):
                cls.__gene_line(draw, width, height)

        if cls.draw_point:
            cls.__gene_points(draw, 10, width, height)

        return text, image
