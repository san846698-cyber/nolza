from pathlib import Path
import math
import wave

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from moviepy import AudioFileClip, ImageClip, concatenate_videoclips


ROOT = Path.cwd()
OUT = ROOT / "marketing" / "aqua-fishing-short"
CAPTURES = OUT / "captures"
FRAMES = OUT / "frames"
VIDEO = OUT / "aqua-fishing-gameplay-short.mp4"
AUDIO = OUT / "aqua-fishing-action-bed.wav"
MANIFEST = OUT / "youtube-upload-package.md"

W, H = 1080, 1920
FONT_REG = "C:/Windows/Fonts/malgun.ttf"
FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"

SCENES = [
    ("01_game_ui.png", 3.0, "심해 낚시 게임,\n첫 화면부터 바로 출항", "REAL GAME UI"),
    ("02_line_drop.png", 4.0, "스페이스로 줄을 내리고\n수심을 공략하세요", "DROP THE LINE"),
    ("03_deep_play.png", 5.0, "깊이 내려갈수록\n등장하는 대물 어종", "DEEPER = BIGGER"),
    ("04_reel_up.png", 4.0, "타이밍을 맞추면\n한 번에 낚아챕니다", "CATCH TIMING"),
    ("05_shop.png", 4.0, "코인으로 장비를 강화하고\n더 깊은 바다로", "UPGRADE"),
    ("06_dex.png", 4.0, "잡은 물고기는 도감에 기록\n50종 수집 도전", "COLLECTION"),
    ("01_game_ui.png", 6.0, "Aqua Fishing\n지금 바로 플레이", "PLAY NOW"),
]


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def fit_font(draw, text, max_width, start_size, min_size=42):
    size = start_size
    while size >= min_size:
        f = font(size, True)
        if all(draw.textbbox((0, 0), line, font=f)[2] <= max_width for line in text.split("\n")):
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


def draw_centered(draw, text, y, f, fill, spacing=12, stroke=4):
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
            stroke_fill=(0, 8, 16, 230),
        )
        top += line_h + spacing


def make_frame(index, capture_name, title, kicker):
    capture = Image.open(CAPTURES / capture_name).convert("RGB")
    canvas = cover_resize(capture, W, H).convert("RGBA")

    top = Image.new("RGBA", (W, 310), (0, 0, 0, 0))
    td = ImageDraw.Draw(top)
    for y in range(310):
        td.line((0, y, W, y), fill=(2, 9, 16, int(205 * (1 - y / 310))))
    canvas.alpha_composite(top, (0, 0))

    bottom = Image.new("RGBA", (W, 620), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bottom)
    for y in range(620):
        bd.line((0, y, W, y), fill=(1, 7, 13, int(235 * (y / 620) ** 1.35)))
    canvas.alpha_composite(bottom, (0, H - 620))

    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, W, 16), fill=(34, 211, 238, 255))
    draw.text((66, 56), "NOLZA GAME SHORTS", font=font(30, True), fill=(229, 252, 255, 230))
    draw.text((W - 194, 56), f"{index:02d}/07", font=font(30, True), fill=(250, 204, 21, 235))

    badge_f = font(32, True)
    badge_box = draw.textbbox((0, 0), kicker, font=badge_f)
    badge_w = badge_box[2] - badge_box[0] + 48
    badge_x = (W - badge_w) // 2
    draw.rounded_rectangle((badge_x, 1304, badge_x + badge_w, 1364), radius=30, fill=(34, 211, 238, 238))
    draw.text((badge_x + 24, 1314), kicker, font=badge_f, fill=(2, 18, 27, 255))

    title_f = fit_font(draw, title, 920, 80)
    draw_centered(draw, title, 1512, title_f, (248, 253, 252, 255))

    if index == 7:
        cta = "nolza.fun/games/aqua-fishing"
        cta_f = font(38, True)
        cta_box = draw.textbbox((0, 0), cta, font=cta_f)
        cta_w = cta_box[2] - cta_box[0] + 72
        draw.rounded_rectangle(((W - cta_w) // 2, 1762, (W + cta_w) // 2, 1842), radius=40, fill=(250, 204, 21, 245))
        draw.text(((W - (cta_box[2] - cta_box[0])) // 2, 1772), cta, font=cta_f, fill=(3, 16, 23, 255))
    else:
        draw.text((66, 1806), "실제 게임 플레이 화면", font=font(28, True), fill=(207, 250, 254, 210))

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
            pulse = 0.0
            for hit in range(0, seconds * 3):
                dt = t - hit / 3
                if 0 <= dt < 0.06:
                    pulse += math.sin(2 * math.pi * 92 * t) * math.exp(-dt * 48)
            shimmer = math.sin(2 * math.pi * (440 + 24 * math.sin(t * 0.7)) * t) * 0.025
            value = max(-1, min(1, pulse * 0.32 + shimmer))
            frames.extend(int(value * 32767).to_bytes(2, "little", signed=True))
        wav.writeframes(frames)


def write_manifest():
    MANIFEST.write_text(
        """# Aqua Fishing 게임 홍보 YouTube Shorts 업로드 패키지

## 파일
- 영상: `aqua-fishing-gameplay-short.mp4`
- 길이: 30초
- 형식: 1080x1920, 세로형, 실제 게임 UI 캡처 기반
- 오디오: 무권리 생성 사운드

## 제목 후보
1. 스페이스로 줄 내리고, 심해 대물 낚기 #AquaFishing
2. 50종 수집 도전! 심해 낚시 게임 Aqua Fishing
3. 깊이 내려갈수록 커진다. 심해 낚시 게임 플레이

## 설명
실제 Aqua Fishing 플레이 화면으로 만든 30초 쇼츠입니다. 줄을 내리고, 타이밍을 맞춰 낚고, 코인으로 장비를 강화하며 더 깊은 바다의 대물 어종을 노려보세요.

플레이: https://nolza.fun/games/aqua-fishing

## 해시태그
#AquaFishing #심해낚시게임 #낚시게임 #웹게임 #미니게임 #Nolza

## 고정 댓글
몇 m까지 내려가 봤나요? 가장 희귀하게 잡은 물고기를 댓글로 알려주세요.

## 검수 체크리스트
- 실제 게임 UI가 모든 장면의 주된 시각 요소임
- 첫 3초 안에 게임 제목과 플레이 화면이 보임
- 조작, 수심, 장비 강화, 도감 수집 루프가 전달됨
- 범고래 등 보호 해양포유류 포획 홍보 장면 없음
- 마지막 CTA에 플레이 URL 표시
""",
        encoding="utf-8",
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    FRAMES.mkdir(parents=True, exist_ok=True)
    clips = []
    for index, (capture, duration, title, kicker) in enumerate(SCENES, 1):
        frame_path = FRAMES / f"frame_{index:02d}.png"
        make_frame(index, capture, title, kicker).save(frame_path, quality=95)
        clips.append(ImageClip(str(frame_path)).with_duration(duration))

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
