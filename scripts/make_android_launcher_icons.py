from PIL import Image
import os

ROOT = r"C:\Users\pbapi\Documents\Projets\botc"
SOURCE = os.path.join(ROOT, "public", "assets", "botc", "wiki.bloodontheclocktower.com", "Icon_imp-32541f1a31.png")
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

FOREGROUND_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}

LEGACY_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

BACKGROUND = (10, 5, 6, 255)
ACCENT = (88, 7, 12, 255)


def fit_logo(img: Image.Image, target: int, padding_ratio: float = 0.18) -> Image.Image:
    canvas = Image.new("RGBA", (target, target), (0, 0, 0, 0))
    max_size = int(target * (1 - padding_ratio))
    scale = min(max_size / img.width, max_size / img.height)
    width = max(1, int(img.width * scale))
    height = max(1, int(img.height * scale))
    resized = img.resize((width, height), Image.LANCZOS)
    canvas.paste(resized, ((target - width) // 2, (target - height) // 2), resized)
    return canvas


def make_legacy_icon(img: Image.Image, target: int) -> Image.Image:
    canvas = Image.new("RGBA", (target, target), BACKGROUND)
    for y in range(target):
        t = y / max(1, target - 1)
        red_band = max(0.0, 1.0 - abs(t - 0.58) * 1.7)
        r = int(BACKGROUND[0] + (ACCENT[0] - BACKGROUND[0]) * (0.55 * t + 0.75 * red_band))
        g = int(BACKGROUND[1] + (ACCENT[1] - BACKGROUND[1]) * (0.30 * t + 0.20 * red_band))
        b = int(BACKGROUND[2] + (ACCENT[2] - BACKGROUND[2]) * (0.28 * t + 0.12 * red_band))
        for x in range(target):
            canvas.putpixel((x, y), (r, g, b, 255))
    logo = fit_logo(img, target, padding_ratio=0.20)
    canvas.paste(logo, (0, 0), logo)
    return canvas


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")

    for folder, size in FOREGROUND_SIZES.items():
        target_dir = os.path.join(RES, folder)
        os.makedirs(target_dir, exist_ok=True)
        foreground = fit_logo(source, size, padding_ratio=0.10)
        foreground.save(os.path.join(target_dir, "ic_launcher_foreground.png"), "PNG")

    for folder, size in LEGACY_SIZES.items():
        target_dir = os.path.join(RES, folder)
        os.makedirs(target_dir, exist_ok=True)
        icon = make_legacy_icon(source, size)
        icon.save(os.path.join(target_dir, "ic_launcher.png"), "PNG")
        icon.save(os.path.join(target_dir, "ic_launcher_round.png"), "PNG")

    print("Android launcher icons regenerated from source Imp artwork.")


if __name__ == "__main__":
    main()
