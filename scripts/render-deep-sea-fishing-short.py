from pathlib import Path
import math
import wave

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
from moviepy import AudioFileClip, ImageClip, concatenate_videoclips


ROOT = Path.cwd()
OUT = ROOT / "marketing" / "deep-sea-fishing-short"
FRAMES = OUT / "frames"
VIDEO = OUT / "deep-sea-trophy-fishing-short.mp4"
AUDIO = OUT / "deep-sea-action-bed.wav"
MANIFEST = OUT / "youtube-upload-package.md"

W, H = 1080, 1920
FONT_REG = "C:/Windows/Fonts/malgun.ttf"
FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"

SCENES = [
    {
        "image": ROOT / "public" / "sea" / "tuna.jpg",
        "duration": 3.0,
        "kicker": "DEEP SEA CHALLENGE",
        "title": "오늘,\n심해가 반응했다",
        "meta": "AM 05:10  출항 준비",
        "grade": (9, 20, 31),
    },
    {
        "image": ROOT / "public" / "sea" / "hydrothermal.jpg",
        "duration": 4.0,
        "kicker": "DEPTH 180M",
        "title": "수심 깊은 곳에서\n시작된 한 판",
        "meta": "어군 탐색  대물 포인트 진입",
        "grade": (8, 28, 42),
    },
    {
        "image": ROOT / "public" / "sea" / "sailfish.jpg",
        "duration": 4.0,
        "kicker": "HIT",
        "title": "릴이\n멈추지 않는 순간",
        "meta": "드랙 사운드 ON",
        "grade": (16, 28, 34),
    },
    {
        "image": ROOT / "public" / "sea" / "marlin.jpg",
        "duration": 5.0,
        "kicker": "FIGHT",
        "title": "낚싯대가 휘고\n팀이 움직인다",
        "meta": "라인 유지  호흡 맞추기",
        "grade": (10, 29, 40),
    },
    {
        "image": ROOT / "public" / "fish" / "yellowfin_tuna.png",
        "duration": 4.0,
        "kicker": "TROPHY CLASS",
        "title": "참치급 대물과의\n진짜 힘겨루기",
        "meta": "버티고 감고 다시 버티기",
        "grade": (14, 35, 45),
    },
    {
        "image": ROOT / "public" / "fish" / "bluefin_tuna.jpg",
        "duration": 4.0,
        "kicker": "LANDING",
        "title": "수면 위로 올라오는\n오늘의 주인공",
        "meta": "합법 어종  안전 랜딩",
        "grade": (18, 35, 44),
    },
    {
        "image": ROOT / "public" / "sea" / "tuna.jpg",
        "duration": 6.0,
        "kicker": "BOOK NOW",
        "title": "심해 낚시의 짜릿함을\n직접 경험하세요",
        "meta": "예약 문의  출항 일정 확인",
        "grade": (12, 32, 42),
    },
]


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def cover_resize(img, target_w, target_h, zoom=1.0):
    scale = max(target_w / img.width, target_h / img.height) * zoom
    new_size = (math.ceil(img.width * scale), math.ceil(img.height * scale))
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    left = (img.width - target_w) // 2
    top = (img.height - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))


def fit_font(draw, text, max_width, start_size, min_size=42):
    size = start_size
    while size >= min_size:
        f = font(size, True)
        if all(draw.textbbox((0, 0), line, font=f)[2] <= max_width for line in text.split("\n")):
            return f
        size -= 2
    return font(min_size, True)


def centered_text(draw, text, y, f, fill, spacing=14, stroke=4):
    boxes = [draw.textbbox((0, 0), line, font=f, stroke_width=stroke) for line in text.split("\n")]
    heights = [box[3] - box[1] for box in boxes]
    total_h = sum(heights) + spacing * (len(heights) - 1)
    top = y - total_h // 2
    for line, box, line_h in zip(text.split("\n"), boxes, heights):
        line_w = box[2] - box[0]
        draw.text(
            ((W - line_w) // 2, top),
            line,
            font=f,
            fill=fill,
            stroke_width=stroke,
            stroke_fill=(1, 8, 14, 225),
        )
        top += line_h + spacing


def draw_fishfinder(draw):
    panel = (72, 158, W - 72, 398)
    draw.rounded_rectangle(panel, radius=34, fill=(5, 19, 28, 185), outline=(93, 218, 231, 85), width=2)
    for i in range(6):
        y = panel[1] + 28 + i * 34
        draw.line((panel[0] + 28, y, panel[2] - 28, y), fill=(92, 177, 184, 45), width=1)
    for i in range(18):
        x = panel[0] + 44 + i * 49
        amp = 30 + (i % 5) * 8
        y = panel[3] - 52 - int(math.sin(i * 0.8) * amp)
        color = (245, 187, 69, 200) if i > 9 else (85, 217, 231, 150)
        draw.ellipse((x, y, x + 16, y + 16), fill=color)
    draw.text((panel[0] + 34, panel[1] + 24), "SONAR", font=font(28, True), fill=(178, 244, 250, 215))
    draw.text((panel[2] - 192, panel[1] + 24), "180M", font=font(28, True), fill=(245, 187, 69, 225))


def draw_frame(scene, index):
    bg = Image.open(scene["image"]).convert("RGB")
    bg = cover_resize(bg, W, H, zoom=1.08)
    bg = ImageEnhance.Contrast(bg).enhance(1.18)
    bg = ImageEnhance.Color(bg).enhance(0.82)
    canvas = bg.convert("RGBA")

    grade = Image.new("RGBA", (W, H), (*scene["grade"], 145))
    canvas = Image.alpha_composite(canvas, grade)

    top_grad = Image.new("RGBA", (W, 680), (0, 0, 0, 0))
    gd = ImageDraw.Draw(top_grad)
    for y in range(680):
        gd.line((0, y, W, y), fill=(2, 9, 15, int(205 * (1 - y / 680))))
    canvas.alpha_composite(top_grad, (0, 0))

    bottom_grad = Image.new("RGBA", (W, 880), (0, 0, 0, 0))
    gd = ImageDraw.Draw(bottom_grad)
    for y in range(880):
        gd.line((0, y, W, y), fill=(1, 7, 12, int(235 * (y / 880) ** 1.25)))
    canvas.alpha_composite(bottom_grad, (0, H - 880))

    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, W, 18), fill=(245, 187, 69, 255))
    draw.text((72, 62), "NOLZA DEEP SEA", font=font(32, True), fill=(235, 247, 247, 225))
    draw.text((W - 204, 62), f"{index:02d}/07", font=font(32, True), fill=(245, 187, 69, 235))

    if index == 2:
        draw_fishfinder(draw)

    badge_f = font(34, True)
    badge = scene["kicker"]
    bbox = draw.textbbox((0, 0), badge, font=badge_f)
    badge_w = bbox[2] - bbox[0] + 54
    badge_x = (W - badge_w) // 2
    draw.rounded_rectangle((badge_x, 1180, badge_x + badge_w, 1242), radius=31, fill=(245, 187, 69, 235))
    draw.text((badge_x + 27, 1190), badge, font=badge_f, fill=(12, 25, 31, 255))

    title_f = fit_font(draw, scene["title"], 920, 86)
    centered_text(draw, scene["title"], 1398, title_f, (250, 254, 252, 255))

    meta_f = font(34, True)
    meta = scene["meta"]
    meta_box = draw.textbbox((0, 0), meta, font=meta_f)
    meta_w = meta_box[2] - meta_box[0]
    draw.text(((W - meta_w) // 2, 1630), meta, font=meta_f, fill=(185, 230, 232, 225))

    if index == 7:
        cta = "예약 문의 / 지금 출항 일정 확인"
        cta_f = font(42, True)
        cta_box = draw.textbbox((0, 0), cta, font=cta_f)
        cta_w = cta_box[2] - cta_box[0] + 72
        draw.rounded_rectangle(((W - cta_w) // 2, 1740, (W + cta_w) // 2, 1820), radius=40, fill=(12, 205, 226, 245))
        draw.text(((W - (cta_box[2] - cta_box[0])) // 2, 1750), cta, font=cta_f, fill=(3, 18, 25, 255))
    else:
        draw.line((188, 1772, W - 188, 1772), fill=(245, 187, 69, 170), width=5)

    return canvas.convert("RGB")


def write_audio():
    sample_rate = 44100
    seconds = 30
    total = sample_rate * seconds
    with wave.open(str(AUDIO), "w") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        frames = bytearray()
        for n in range(total):
            t = n / sample_rate
            beat = 0.0
            for hit in range(0, seconds * 2):
                dt = t - hit * 0.5
                if 0 <= dt < 0.11:
                    beat += math.sin(2 * math.pi * 54 * t) * math.exp(-dt * 34)
            riser = math.sin(2 * math.pi * (160 + t * 9) * t) * min(1, t / 30) * 0.045
            value = max(-1, min(1, beat * 0.42 + riser))
            frames.extend(int(value * 32767).to_bytes(2, "little", signed=True))
        wav.writeframes(frames)


def write_manifest():
    MANIFEST.write_text(
        """# 심해 대물 낚시 YouTube Shorts 업로드 패키지

## 파일
- 영상: `deep-sea-trophy-fishing-short.mp4`
- 길이: 30초
- 형식: 1080x1920, 세로형, 자막 포함
- 오디오: 저음 드럼 + 라이저 기반의 무권리 생성 사운드

## 제목 후보
1. 릴이 멈추지 않는 순간, 심해 대물 챌린지
2. 오늘 심해가 반응했다. 참치급 대물 낚시
3. 수심 깊은 곳에서 시작된 한 판 #심해낚시

## 설명
심해에서 만나는 진짜 대물의 손맛. 출항부터 어군 탐색, 히트, 랜딩까지 30초 안에 담은 심해 낚시 체험 홍보 쇼츠입니다.

예약 문의 / 출항 일정 확인: 업체 연락처 또는 예약 링크를 여기에 입력하세요.

## 해시태그
#심해낚시 #대물낚시 #참치낚시 #선상낚시 #낚시쇼츠 #바다낚시

## 고정 댓글
심해 대물 챌린지에 도전해보고 싶다면 댓글로 출항 희망 날짜를 남겨주세요.

## 검수 체크리스트
- 첫 3초 안에 심해 낚시와 대물 콘셉트가 보임
- 범고래, 고래, 돌고래 등 보호 해양포유류 포획 장면 없음
- 잔혹하거나 불법 포획처럼 보이는 장면 없음
- 마지막 3초에 예약 문의 CTA 표시
- 모바일 9:16 화면에서 자막 잘림 없음
""",
        encoding="utf-8",
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    FRAMES.mkdir(parents=True, exist_ok=True)
    clips = []
    for index, scene in enumerate(SCENES, 1):
        frame_path = FRAMES / f"frame_{index:02d}.png"
        draw_frame(scene, index).save(frame_path, quality=95)
        clips.append(ImageClip(str(frame_path)).with_duration(scene["duration"]))

    write_audio()
    final = concatenate_videoclips(clips, method="compose")
    audio = AudioFileClip(str(AUDIO))
    final = final.with_audio(audio)
    final.write_videofile(
        str(VIDEO),
        fps=30,
        codec="libx264",
        audio_codec="aac",
        preset="medium",
        ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart", "-shortest"],
    )
    audio.close()
    final.close()
    write_manifest()


if __name__ == "__main__":
    main()
