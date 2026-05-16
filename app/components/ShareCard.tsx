"use client";

import { useRef, useState, type ReactNode, type CSSProperties } from "react";

/**
 * Wrap a result panel with <ShareCard> and pass a `filename`. The component
 * exposes a button that:
 *   1. Snapshots the wrapped subtree as a PNG (html-to-image, client-side).
 *   2. On mobile w/ Web Share API + file sharing, opens the OS share sheet
 *      (KakaoTalk, Instagram DM, etc. appear there if the apps are installed).
 *   3. Otherwise triggers a download — user can long-press / drag the file
 *      into Instagram Stories or attach in KakaoTalk.
 *
 * The render function receives a `cardRef` to attach to the DOM node that
 * should be captured. Anything outside that ref (e.g. the share button itself)
 * won't appear in the image.
 */

export type ShareCardRenderProps = {
  cardRef: React.RefObject<HTMLDivElement | null>;
  saving: boolean;
};

type Props = {
  filename: string;
  /** Optional accessible label / button text override. */
  buttonLabel?: { ko: string; en: string };
  /** Optional locale; defaults to "ko". */
  locale?: "ko" | "en";
  /** Optional inline style applied to the button. */
  buttonStyle?: CSSProperties;
  /** Optional className applied to the button. */
  buttonClassName?: string;
  /** Show the built-in image save/share button. Hidden by default on result pages. */
  showButton?: boolean;
  /** Pixel scale (2 = retina). Larger = bigger file. */
  pixelRatio?: number;
  /** Background color used when the captured node has no opaque bg. */
  backgroundColor?: string;
  children: (props: ShareCardRenderProps) => ReactNode;
};

export function ShareCard({
  filename,
  buttonLabel,
  locale = "ko",
  buttonStyle,
  buttonClassName,
  showButton = false,
  pixelRatio = 2,
  backgroundColor,
  children,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<"saved" | "shared" | null>(null);

  const label =
    done === "saved"
      ? locale === "ko"
        ? "✓ 저장됨"
        : "✓ Saved"
      : done === "shared"
      ? locale === "ko"
        ? "✓ 공유됨"
        : "✓ Shared"
      : saving
      ? locale === "ko"
        ? "저장 중…"
        : "Saving…"
      : (buttonLabel?.[locale] ??
        (locale === "ko" ? "이미지로 저장" : "Save as image"));

  const handleClick = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    setDone(null);
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(cardRef.current, {
        pixelRatio,
        cacheBust: true,
        backgroundColor,
        // Skip ads / outbound iframes — they often block CORS.
        filter: (node: HTMLElement) => {
          if (node.tagName === "IFRAME") return false;
          if (node.dataset?.shareCardSkip === "true") return false;
          return true;
        },
      });
      if (!blob) throw new Error("no-blob");

      const file = new File([blob], `${filename}.png`, { type: "image/png" });

      // Web Share Level 2 — surfaces OS share sheet incl. Kakao/Instagram.
      const nav = typeof navigator !== "undefined" ? navigator : undefined;
      const canShareFile =
        nav &&
        "share" in nav &&
        "canShare" in nav &&
        typeof (nav as Navigator & {
          canShare?: (d: { files: File[] }) => boolean;
        }).canShare === "function" &&
        (nav as Navigator & {
          canShare: (d: { files: File[] }) => boolean;
        }).canShare({ files: [file] });

      if (canShareFile) {
        try {
          await (nav as Navigator & {
            share: (d: { files: File[]; title?: string }) => Promise<void>;
          }).share({ files: [file], title: filename });
          setDone("shared");
          setTimeout(() => setDone(null), 2000);
          return;
        } catch (err) {
          // User cancelled — fall through to download.
          if ((err as { name?: string })?.name === "AbortError") {
            setSaving(false);
            return;
          }
        }
      }

      // Fallback: programmatic download.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone("saved");
      setTimeout(() => setDone(null), 2000);
    } catch (err) {
      console.error("ShareCard failed:", err);
      alert(
        locale === "ko"
          ? "이미지 저장에 실패했어요. 화면을 직접 캡처해주세요."
          : "Couldn't save the image. Please screenshot instead.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {children({ cardRef, saving })}
      {showButton ? (
      <button
        type="button"
        onClick={handleClick}
        disabled={saving}
        className={buttonClassName}
        data-share-card-skip="true"
        style={
          buttonStyle ?? {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 999,
            border: "1px solid currentColor",
            background: "transparent",
            color: "inherit",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.06em",
            cursor: saving ? "wait" : "pointer",
            opacity: saving ? 0.6 : 1,
            minHeight: 44,
          }
        }
      >
        {!saving && done == null && <span aria-hidden>⬇</span>}
        {label}
      </button>
      ) : null}
    </>
  );
}
