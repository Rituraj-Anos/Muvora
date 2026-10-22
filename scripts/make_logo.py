"""
Render the Muvora brand art with Pillow.

Outputs:
  Logo.png    1024x1024  square app logo (mark on near-black)
  Banner.png  1600x500   wordmark + mark for the README header

The mark is the lime "M" flanked by two equalizer bars on each side, matching
app/src/main/res/drawable/ic_launcher_foreground.xml.
"""
from PIL import Image, ImageDraw, ImageFont
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BG = (5, 5, 5, 255)
# Lime gradient endpoints (top-left bright -> bottom-right deeper).
G0 = (217, 255, 58)   # #D9FF3A
G1 = (163, 245, 82)   # #A3F552
BAR = (196, 248, 60)  # #C4F83C


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


def rounded_bar(draw, cx, half_h, w, color, top_y=None, bot_y=None):
    """A vertical pill centred on x=cx."""
    if top_y is None:
        top_y = 512 - half_h
        bot_y = 512 + half_h
    draw.rounded_rectangle(
        [cx - w / 2, top_y, cx + w / 2, bot_y],
        radius=w / 2, fill=color,
    )


def draw_mark(size=1024, scale=1.0, dx=0, dy=0):
    """Return an RGBA image of the mark on a transparent canvas of `size`."""
    SS = 4  # supersample for clean edges
    img = Image.new("RGBA", (size * SS, size * SS), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    def X(x):
        return (512 + (x - 512) * scale + dx) * (size / 1024) * SS

    def Y(y):
        return (512 + (y - 512) * scale + dy) * (size / 1024) * SS

    def bar(cx, top, bot, w, color):
        d.rounded_rectangle(
            [X(cx - w / 2), Y(top), X(cx + w / 2), Y(bot)],
            radius=(w / 2) * (size / 1024) * SS * scale, fill=color,
        )

    # Equalizer bars (outer shorter, inner taller), centred on y=435.
    bar(300, 415, 455, 30, BAR)
    bar(360, 380, 490, 30, BAR)
    bar(665, 380, 490, 30, BAR)
    bar(725, 415, 455, 30, BAR)

    # The M, drawn as four rounded strokes, each filled with a vertical
    # lime gradient so the mark reads as one piece.
    def grad_stroke(points, w):
        # Approximate a gradient by stacking short segments is overkill;
        # the M is small, so a flat mid-lime with the two legs slightly
        # brighter at top looks clean enough. We fill per-shape with a
        # gradient image masked to the stroke.
        pass

    # Build a gradient tile the size of the M bounding box and paste masked.
    mask = Image.new("L", img.size, 0)
    md = ImageDraw.Draw(mask)
    LW = 60  # stroke width in source units

    def seg(p0, p1):
        md.line([X(p0[0]), Y(p0[1]), X(p1[0]), Y(p1[1])],
                fill=255, width=round(LW * (size / 1024) * SS * scale), joint="curve")
        r = (LW / 2) * (size / 1024) * SS * scale
        for p in (p0, p1):
            md.ellipse([X(p[0]) - r, Y(p[1]) - r, X(p[0]) + r, Y(p[1]) + r], fill=255)

    # left leg, left diagonal, right diagonal, right leg
    seg((400, 320), (400, 500))
    seg((400, 320), (512, 455))
    seg((512, 455), (625, 320))
    seg((625, 320), (625, 500))

    grad = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = grad.load()
    top, bot = Y(300), Y(520)
    for yy in range(img.size[1]):
        t = min(1.0, max(0.0, (yy - top) / (bot - top))) if bot > top else 0
        c = lerp(G0, G1, t) + (255,)
        for xx in range(img.size[0]):
            gd[xx, yy] = c
    img.paste(grad, (0, 0), mask)

    return img.resize((size, size), Image.LANCZOS)


def make_logo():
    base = Image.new("RGBA", (1024, 1024), BG)
    mark = draw_mark(1024, scale=1.25, dx=0, dy=0)
    base.alpha_composite(mark)
    base.convert("RGB").save(os.path.join(HERE, "Logo.png"))
    # Transparent mark for the banner.
    draw_mark(1024, scale=1.0).save(os.path.join(HERE, "scripts", "mark.png"))


def load_font(size):
    for name in ("segoeuib.ttf", "ariblk.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            continue
    return ImageFont.load_default()


def make_banner():
    W, H = 1600, 500
    img = Image.new("RGB", (W, H), (5, 5, 5))
    # Mark on the left.
    mark = draw_mark(360, scale=1.3)
    img.paste(mark.convert("RGB"), (150, H // 2 - 180), mark)
    # Wordmark.
    d = ImageDraw.Draw(img)
    font = load_font(150)
    text = "Muvora"
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    d.text((560, H // 2 - th // 2 - bbox[1]), text, font=font, fill=(245, 245, 245))
    img.save(os.path.join(HERE, "Banner.png"))


if __name__ == "__main__":
    make_logo()
    make_banner()
    print("wrote Logo.png and Banner.png")
