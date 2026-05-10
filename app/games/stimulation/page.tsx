"use client";

import Link from "next/link";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";

export default function Stimulation() {
  return (
    <main
      className="min-h-screen page-in"
      style={{ backgroundColor: "#0a0a0a", color: "#fff" }}
    >
      <Link href="/" className="back-arrow dark" aria-label="home">
        ←
      </Link>

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6">
        <div className="text-center">
          <div
            style={{
              fontSize: 13,
              color: "#444",
              letterSpacing: "0.3em",
              marginBottom: 16,
            }}
          >
            COMING SOON
          </div>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 200,
              letterSpacing: "-0.02em",
              color: "#fff",
              fontFamily: "var(--font-inter)",
              lineHeight: 1,
            }}
          >
            stimulation
          </h1>
          <div
            className="mt-12 flex justify-center gap-2"
            aria-hidden
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="star"
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: 4,
                  height: 4,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p
            className="mt-12"
            style={{ fontSize: 15, color: "#666", letterSpacing: "0.05em" }}
          >
            지금은 잠시, 곧 새로 만나요
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}
