from pathlib import Path
import json
import math

from PIL import Image, ImageDraw, ImageFont, ImageFilter
from moviepy import ImageClip, concatenate_videoclips


ROOT = Path.cwd()
OUT = ROOT / "marketing" / "defense-mechanism-short"
CAPTURES = OUT / "captures"
FRAMES = OUT / "frames"
VIDEO = OUT / "defense-mechanism-youtube-shorts-ad.mp4"
MANIFEST = OUT / "youtube-upload-package.md"

W, H = 1080, 1920
PHONE_W, PHONE_H = 790, 1710
PHONE_X, PHONE_Y = (W - PHONE_W) // 2, 62
FONT_REG = "C:/Windows/Fonts/malgun.ttf"
FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"


SCENES = [
    ("01_intro.png", 2.5, "힘들 때 나는\n어떻게 나를 지킬까?", "방어기제 테스트"),
    ("01_intro.png", 3.5, "불편한 감정이\n올라올 때", "심리 테스트"),
    ("01_intro.png", 3.5, "16문항으로 보는\n내 마음의 습관", "약 4분 · 자기이해"),
    ("02_question.png", 5.5, "상황을 고르면", "내 마음의 패턴이 보입니다"),
    ("03_answer_1.png", 2.0, "내가 자주 쓰는", "방어 방식이 쌓이고"),
    ("03_answer_2.png", 2.0, "망설임 없이", "가까운 답을 고르면"),
    ("03_answer_3.png", 2.0, "결과가 조금씩", "선명해집니다"),
    ("04_loading.png", 4.0, "결과를\n정리하는 중...", "당신의 보호 방식"),
    ("05_result.png", 6.0, "나는 어떤 방식으로\n버티는 사람일까?", "결과 예시"),
    ("05_result.png", 4.0, "놀자에서\n바로 해보기", "nolza.fun/tests/defense-mechanism"),
]


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def fit_text(draw, text, max_width, start_size, min_size=34):
    size = start_size
    while size >= min_size:
        f = font(size, True)
        lines = text.split("\n")
        if all(draw.textbbox((0, 0), line, font=f)[2] <= max_width for line in lines):
            return f
        size -= 2
    return font(min_size, True)


def cover_resize(img, target_w, target_h):
    scale = max(target_w / img.width, target_h / img.height)
    new_size = (math.ceil(img.width * scale), math.ceil(img.height * scale))
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    left = (img.width - target_w) // 2
    top = (img.height - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def draw_centered(draw, text, y, f, fill, spacing=10, stroke=0):
    lines = text.split("\n")
    line_boxes = [draw.textbbox((0, 0), line, font=f, stroke_width=stroke) for line in lines]
    heights = [b[3] - b[1] for b in line_boxes]
    total_h = sum(heights) + spacing * (len(lines) - 1)
    cy = y - total_h // 2
    for line, box, lh in zip(lines, line_boxes, heights):
        tw = box[2] - box[0]
        draw.text(
            ((W - tw) // 2, cy),
            line,
            font=f,
            fill=fill,
            stroke_width=stroke,
            stroke_fill=(20, 18, 15, 230),
        )
        cy += lh + spacing


def make_frame(index, capture_name, title, kicker):
    bg = Image.open(CAPTURES / capture_name).convert("RGB")
    bg = cover_resize(bg, W, H).filter(ImageFilter.GaussianBlur(24))
    overlay = Image.new("RGBA", (W, H), (10, 17, 24, 185))
    canvas = Image.alpha_composite(bg.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(canvas)

    phone = Image.open(CAPTURES / capture_name).convert("RGB")
    phone = cover_resize(phone, PHONE_W, PHONE_H)
    shadow = Image.new("RGBA", (PHONE_W + 56, PHONE_H + 56), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((28, 28, PHONE_W + 28, PHONE_H + 28), radius=74, fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    canvas.alpha_composite(shadow, (PHONE_X - 28, PHONE_Y - 18))

    mask = rounded_mask((PHONE_W, PHONE_H), 62)
    canvas.paste(phone, (PHONE_X, PHONE_Y), mask)
    draw.rounded_rectangle(
        (PHONE_X, PHONE_Y, PHONE_X + PHONE_W, PHONE_Y + PHONE_H),
        radius=62,
        outline=(248, 239, 226, 120),
        width=4,
    )

    grad = Image.new("RGBA", (W, 560), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    for y in range(560):
        alpha = int(225 * (y / 560) ** 1.25)
        gd.line((0, y, W, y), fill=(8, 12, 18, alpha))
    canvas.alpha_composite(grad, (0, H - 560))

    badge_f = font(34, True)
    badge = kicker
    bb = draw.textbbox((0, 0), badge, font=badge_f)
    bw = bb[2] - bb[0] + 48
    draw.rounded_rectangle(
        ((W - bw) // 2, 1392, (W + bw) // 2, 1454),
        radius=31,
        fill=(242, 200, 121, 238),
    )
    draw.text(((W - (bb[2] - bb[0])) // 2, 1402), badge, font=badge_f, fill=(22, 20, 17))

    title_f = fit_text(draw, title, 900, 82)
    draw_centered(draw, title, 1548, title_f, (255, 250, 238, 255), spacing=8, stroke=3)

    small_f = font(27, True)
    if index == len(SCENES) - 1:
        note = "재미용 자기이해 콘텐츠입니다"
    else:
        note = "nolza.fun"
    nb = draw.textbbox((0, 0), note, font=small_f)
    draw.text(((W - (nb[2] - nb[0])) // 2, 1814), note, font=small_f, fill=(248, 239, 226, 190))

    return canvas.convert("RGB")


def main():
    FRAMES.mkdir(parents=True, exist_ok=True)
    clips = []
    for idx, (capture, duration, title, kicker) in enumerate(SCENES, 1):
        frame_path = FRAMES / f"frame_{idx:02d}.png"
        make_frame(idx, capture, title, kicker).save(frame_path, quality=95)
        clips.append(ImageClip(str(frame_path)).with_duration(duration))

    final = concatenate_videoclips(clips, method="compose")
    final.write_videofile(
        str(VIDEO),
        fps=30,
        codec="libx264",
        audio=False,
        preset="medium",
        ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    )
    final.close()

    meta_path = OUT / "capture-meta.json"
    result = ""
    if meta_path.exists():
        result = json.loads(meta_path.read_text(encoding="utf-8")).get("resultTitle") or ""

    MANIFEST.write_text(
        f"""# 방어기제 테스트 YouTube Shorts 업로드 패키지

## 파일
- 영상: `defense-mechanism-youtube-shorts-ad.mp4`
- 길이: 35초
- 형식: 1080x1920, 무성, 자막 포함
- 결과 예시: {result or "결과 화면"}

## 제목 후보
1. 힘들 때 내가 쓰는 방어기제는? #심리테스트
2. 나는 회피형일까, 합리화형일까? 방어기제 테스트
3. 불편한 감정이 올라올 때 내 마음이 하는 일

## 설명
힘들 때 나는 어떤 방식으로 나를 보호할까요? 방어기제 테스트로 가볍게 확인해보세요.

바로 해보기: https://nolza.fun/tests/defense-mechanism

## 해시태그
#놀자 #방어기제테스트 #심리테스트 #자기이해 #유튜브쇼츠

## 고정 댓글
당신은 어떤 방어기제가 나왔나요? 놀자에서 해보고 댓글로 알려주세요.
""",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
