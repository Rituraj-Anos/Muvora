"""Regenerate Banner.png — a wide README header matching the og.png style."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "Banner.png")

W, H = 1600, 420
LIME_HI = (217, 255, 90)
LIME_LO = (150, 230, 70)
LIME = (200, 255, 61)
WHITE = (244, 244, 240)
GREY = (150, 150, 144)
FBL = r"C:\Windows\Fonts\ariblk.ttf"
FB = r"C:\Windows\Fonts\arialbd.ttf"


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vgrad(w, h, top, bot):
    img = Image.new("RGB", (w, h), top)
    d = ImageDraw.Draw(img)
    for y in range(h):
        d.line([(0, y), (w, y)], fill=lerp(top, bot, y / max(1, h - 1)))
    return img


def draw_mark(size):
    cv = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pad = size * 0.12
    span = size - pad * 2
    sx = span / (760 - 265)

    def X(x):
        return pad + (x - 265) / (760 - 265) * span

    def Y(y):
        return pad + (y - 290) / (545 - 290) * span

    mask = Image.new("L", (size, size), 0)
    md = ImageDraw.Draw(mask)

    def bar(cx, top, bot, w):
        md.rounded_rectangle([X(cx - w / 2), Y(top), X(cx + w / 2), Y(bot)], radius=(w / 2) * sx, fill=255)

    bar(300, 415, 455, 30); bar(360, 380, 490, 30); bar(665, 380, 490, 30); bar(725, 415, 455, 30)
    lw = int(60 * sx)
    for p0, p1 in [((400, 320), (400, 500)), ((400, 320), (512, 455)), ((512, 455), (625, 320)), ((625, 320), (625, 500))]:
        md.line([X(p0[0]), Y(p0[1]), X(p1[0]), Y(p1[1])], fill=255, width=lw, joint="curve")
        r = lw / 2
        for p in (p0, p1):
            md.ellipse([X(p[0]) - r, Y(p[1]) - r, X(p[0]) + r, Y(p[1]) + r], fill=255)

    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gp = grad.load()
    for y in range(size):
        c = lerp(LIME_HI, LIME_LO, y / max(1, size - 1)) + (255,)
        for x in range(size):
            gp[x, y] = c
    cv.paste(grad, (0, 0), mask)
    return cv


def main():
    SS = 2
    img = vgrad(W * SS, H * SS, (12, 13, 11), (3, 3, 3)).convert("RGBA")

    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gx, gy, gr = int(360 * SS), int(210 * SS), int(240 * SS)
    gd.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=(200, 255, 61, 60))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(130 * SS // 2)))

    d = ImageDraw.Draw(img)
    mark_sz = int(210 * SS)
    mark = draw_mark(mark_sz)
    mx, my = int(255 * SS), int((H * SS - mark_sz) // 2)
    img.alpha_composite(mark, (mx, my))

    word = ImageFont.truetype(FBL, int(150 * SS))
    wx = mx + mark_sz + int(30 * SS)
    wtb = d.textbbox((0, 0), "Muvora", font=word)
    wy = int(H * SS / 2) - int(96 * SS)
    d.text((wx, wy), "Muvora", font=word, fill=WHITE)

    tag = ImageFont.truetype(FB, int(38 * SS))
    d.text((wx + int(6 * SS), wy + int(168 * SS)), "Music, without the noise.", font=tag, fill=LIME)

    out = img.convert("RGB").resize((W, H), Image.LANCZOS)
    out.save(OUT)
    print("wrote", OUT, out.size)


if __name__ == "__main__":
    main()
