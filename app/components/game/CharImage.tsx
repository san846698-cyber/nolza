"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactElement } from "react";

// 결과 캐릭터 비주얼 "이미지 슬롯".
// - /images/tests/<testId>/<key>.webp 를 next/image 로 로드.
// - 파일이 없거나 로드 실패(onError) 시 → "전통 무늬 + 이모지" 카드로 폴백.
// - 무늬는 *공용 전통 일본 패턴*(저작권 X)을 캐릭터 시그니처 색으로. 원본 하오리 그림 아님.
function patternBg(pattern: string | undefined, c: string): CSSProperties {
  switch (pattern) {
    case "ichimatsu": // 시장 바둑판 (탄지로)
      return {
        backgroundColor: `${c}1f`,
        backgroundImage: `conic-gradient(${c}80 0 90deg, transparent 0 180deg, ${c}80 0 270deg, transparent 0)`,
        backgroundSize: "30px 30px",
      };
    case "uroko": // 비늘 삼각 (젠이츠)
      return {
        backgroundColor: `${c}14`,
        backgroundImage: `linear-gradient(135deg, ${c}66 25%, transparent 25%), linear-gradient(225deg, ${c}66 25%, transparent 25%)`,
        backgroundSize: "26px 26px",
      };
    case "seigaiha": // 청해파 물결 (기유)
      return {
        backgroundColor: `${c}14`,
        backgroundImage: `radial-gradient(circle at 50% 100%, transparent 32%, ${c}66 33%, ${c}66 42%, transparent 43%)`,
        backgroundSize: "40px 20px",
      };
    case "asanoha": // 삼베잎 (네즈코) — 근사
      return {
        backgroundColor: `${c}16`,
        backgroundImage: `linear-gradient(60deg, ${c}55 1px, transparent 1px), linear-gradient(-60deg, ${c}55 1px, transparent 1px), linear-gradient(0deg, ${c}40 1px, transparent 1px)`,
        backgroundSize: "30px 52px",
      };
    case "flame": // 불꽃 (렌고쿠/아카자)
      return {
        backgroundColor: `${c}10`,
        backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 120%, ${c}99, transparent 70%), radial-gradient(ellipse 45% 40% at 20% 124%, ${c}66, transparent 70%), radial-gradient(ellipse 45% 40% at 80% 124%, ${c}66, transparent 70%)`,
      };
    case "kikkou": // 거북등 육각 (시노부) — 근사
      return {
        backgroundColor: `${c}14`,
        backgroundImage: `repeating-linear-gradient(0deg, ${c}55 0 1px, transparent 1px 24px), repeating-linear-gradient(60deg, ${c}55 0 1px, transparent 1px 24px), repeating-linear-gradient(-60deg, ${c}55 0 1px, transparent 1px 24px)`,
      };
    case "yagasuri": // 화살깃 사선 (이노스케/텐겐)
      return {
        backgroundColor: `${c}14`,
        backgroundImage: `repeating-linear-gradient(45deg, ${c}66 0 6px, transparent 6px 16px)`,
      };
    case "komon": // 작은 점 무늬 (미츠리/도우마)
      return {
        backgroundColor: `${c}16`,
        backgroundImage: `radial-gradient(${c}88 1.4px, transparent 1.7px)`,
        backgroundSize: "15px 15px",
      };
    default:
      return {
        background: `radial-gradient(circle at 50% 34%, ${c}, ${c}33 64%, rgba(0,0,0,0.25))`,
      };
  }
}

export default function CharImage({
  src,
  alt,
  emoji,
  color,
  pattern,
}: {
  src: string;
  alt: string;
  emoji: string;
  color: string;
  pattern?: string;
}): ReactElement {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`char-image${failed ? " char-image--fallback" : ""}`}
      style={failed ? { ...patternBg(pattern, color), borderColor: color } : { borderColor: color }}
    >
      {failed ? (
        <span className="char-image__emoji" role="img" aria-label={alt}>
          {emoji}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="220px"
          style={{ objectFit: "cover" }}
          onError={() => setFailed(true)}
        />
      )}
      <style jsx>{`
        .char-image {
          position: relative;
          width: clamp(200px, 62%, 300px);
          aspect-ratio: 1 / 1;
          margin: 4px auto 14px;
          border-radius: 18px;
          overflow: hidden;
          border: 2px solid;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
          background: rgba(0, 0, 0, 0.18);
        }
        .char-image--fallback {
          display: grid;
          place-items: center;
        }
        .char-image__emoji {
          font-size: clamp(58px, 21vw, 88px);
          line-height: 1;
          filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.55));
        }
      `}</style>
    </div>
  );
}
