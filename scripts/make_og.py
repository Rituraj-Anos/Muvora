"""
Render website/public/og.png (and a square icon) — the social link-preview card.

A premium dark composition: soft lime glow behind the Muvora mark, mark + wordmark
lockup, tagline, a thin divider, feature pills and a download hint. 1200x630.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "website", "public", "og.png")

W, H = 1200, 630
SS = 2  # supersample

BG_TOP = (10, 11, 9)
BG_BOT = (3, 3, 3)
LIME = (200, 255, 61)
LIME_HI = (217, 255, 90)
LIME_LO = (150, 230, 70)
WHITE = (244, 244, 240)
GREY = (150, 150, 144)

FB = r"C:\Windows\Fonts\arialbd.ttf"
FBL = r"C:\Windows\Fonts\ariblk.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def vgrad(w, h, top, bot):
    base = Image.new("RGB", (w, h), top)
    draw = ImageDraw.Draw(base)
    for y in range(h):
        t = y / max(1, h - 1)
        c = tuple(round(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        draw.line([(0, y), (w, y)], fill=c)
    return base


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def draw_mark(size, stroke_w=60):
    """Muvora mark on transparent canvas. Source viewBox ~ x265..760, y290..545."""
    cv = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(cv)
    # source space is 1024; map into `size` with padding
    pad = size * 0.14
    span = size - pad * 2

    def X(x):
        return pad + (x - 265) / (760 - 265) * span

    def Y(y):
        # centre the ~290..545 band vertically
        return pad + (y - 290) / (545 - 290) * span

    sx = span / (760 - 265)

    # gradient fill via mask
    mask = Image.new("L", (size, size), 0)
    md = ImageDraw.Draw(mask)

    def bar(cx, top, bot, w):
        md.rounded_rectangle([X(cx - w / 2), Y(top), X(cx + w / 2), Y(bot)],
                             radius=(w / 2) * sx, fill=255)

    bar(300, 415, 455, 30)
    bar(360, 380, 490, 30)
    bar(665, 380, 490, 30)
    bar(725, 415, 455, 30)

    lw = int(stroke_w * sx)
    pts = [((400, 320), (400, 500)), ((400, 320), (512, 455)),
           ((512, 455), (625, 320)), ((625, 320), (625, 500))]
    for p0, p1 in pts:
        md.line([X(p0[0]), Y(p0[1]), X(p1[0]), Y(p1[1])], fill=255, width=lw, joint="curve")
        r = lw / 2
        for p in (p0, p1):
            md.ellipse([X(p[0]) - r, Y(p[1]) - r, X(p[0]) + r, Y(p[1]) + r], fill=255)

    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gp = grad.load()
    for y in range(size):
        t = y / max(1, size - 1)
        c = lerp(LIME_HI, LIME_LO, t) + (255,)
        for x in range(size):
            gp[x, y] = c
    cv.paste(grad, (0, 0), mask)
    return cv


def rounded_text_pill(draw, xy, text, fnt, pad=(20, 11)):
    x, y = xy
    tb = draw.textbbox((0, 0), text, font=fnt)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    w = tw + pad[0] * 2
    h = th + pad[1] * 2
    draw.rounded_rectangle([x, y, x + w, y + h], radius=h / 2, outline=(60, 60, 56), width=2)
    draw.text((x + pad[0] - tb[0], y + pad[1] - tb[1]), text, font=fnt, fill=GREY)
    return w


def main():
    img = vgrad(W * SS, H * SS, BG_TOP, BG_BOT).convert("RGBA")

    # radial lime glow upper-left behind the mark
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx, gy, gr = int(265 * SS), int(300 * SS), int(230 * SS)
    gd.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=(200, 255, 61, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(120 * SS // 2))
    img.alpha_composite(glow)

    # faint corner wordmark watermark (big, very dark) for depth
    d = ImageDraw.Draw(img)

    # --- mark + wordmark lockup ---
    mark_sz = int(188 * SS)
    mark = draw_mark(mark_sz)
    mark_x, mark_y = int(150 * SS), int(205 * SS)
    img.alpha_composite(mark, (mark_x, mark_y))

    word = font(FBL, int(132 * SS))
    wx = mark_x + mark_sz + int(28 * SS)
    wtb = d.textbbox((0, 0), "Muvora", font=word)
    wy = mark_y + (mark_sz - (wtb[3] - wtb[1])) // 2 - wtb[1]
    d.text((wx, wy), "Muvora", font=word, fill=WHITE)

    # --- tagline ---
    tag = font(FB, int(40 * SS))
    d.text((int(152 * SS), int(432 * SS)), "Music, without the noise.", font=tag, fill=LIME)

    sub = font(FB, int(26 * SS))
    d.text((int(152 * SS), int(486 * SS)),
           "A free, open-source music player for Android", font=sub, fill=GREY)

    # --- divider ---
    d.line([(152 * SS, 545 * SS), (1048 * SS, 545 * SS)], fill=(42, 42, 40), width=2 * SS)

    # --- feature pills (left) + download hint (right) ---
    pill = font(FB, int(21 * SS))
    x = int(152 * SS)
    for label in ("Stream", "Offline", "Synced lyrics"):
        w = rounded_text_pill(d, (x, int(566 * SS)), label, pill, pad=(int(18 * SS), int(10 * SS)))
        x += w + int(12 * SS)

    hint = font(FB, int(24 * SS))
    htb = d.textbbox((0, 0), "muvora.pages.dev", font=hint)
    d.text((1048 * SS - (htb[2] - htb[0]), int(574 * SS)), "muvora.pages.dev", font=hint, fill=WHITE)

    out = img.convert("RGB").resize((W, H), Image.LANCZOS)
    out.save(OUT)
    print("wrote", OUT, out.size)


if __name__ == "__main__":
    main()
