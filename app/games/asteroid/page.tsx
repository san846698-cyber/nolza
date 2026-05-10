"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import {
  COMPOSITIONS,
  computeImpact,
  formatDistance,
  formatHiroshimas,
  formatYield,
  type Composition,
  type ImpactResult,
} from "./physics";
import s from "./asteroid.module.css";

// Leaflet must not run during SSR.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className={s.mapLoading}>LOADING MAP…</div>,
});

type LatLng = { lat: number; lng: number };

export type SectionId =
  | "hero"
  | "crater"
  | "fireball"
  | "thermal"
  | "shockwave"
  | "shockwaveLight"
  | "wind"
  | "earthquake"
  | "final";

const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 }; // Seoul
const DEFAULT_ZOOM = 4;

type SearchHit = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function AsteroidGame() {
  const { locale, t } = useLocale();

  // Asteroid params
  const [composition, setComposition] = useState<Composition>("stone");
  const [diameter, setDiameter] = useState(150); // m
  const [velocity, setVelocity] = useState(20);  // km/s
  const [angle, setAngle] = useState(45);        // deg

  // Map
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [target, setTarget] = useState<LatLng | null>(null);
  const [flyTo, setFlyTo] = useState<LatLng | null>(null);
  const [flySeq, setFlySeq] = useState(0);
  const [playSeq, setPlaySeq] = useState(-1);

  // Search
  const [searchText, setSearchText] = useState("");
  const [searchHits, setSearchHits] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const searchAbortRef = useRef<AbortController | null>(null);

  // Result
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  const flyHere = (p: LatLng, z?: number) => {
    setFlyTo(p);
    setFlySeq((n) => n + 1);
    if (z !== undefined) setZoom(z);
  };

  // Initial geolocation
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(here);
        flyHere(here, 6);
      },
      () => { /* permission denied — keep default */ },
      { timeout: 6000, maximumAge: 60_000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        flyHere(here, 8);
      },
      () => {
        alert(t("위치 권한을 허용해 주세요.", "Please allow location access."));
      },
    );
  };

  // Geocoding via Nominatim. Debounced.
  useEffect(() => {
    const q = searchText.trim();
    if (q.length < 2) {
      setSearchHits([]);
      return;
    }
    const timer = setTimeout(async () => {
      searchAbortRef.current?.abort();
      const ctl = new AbortController();
      searchAbortRef.current = ctl;
      setSearching(true);
      try {
        const url =
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=` +
          encodeURIComponent(q);
        const res = await fetch(url, {
          signal: ctl.signal,
          headers: { "Accept-Language": locale === "ko" ? "ko" : "en" },
        });
        const json: SearchHit[] = await res.json();
        setSearchHits(json);
      } catch (e) {
        if ((e as Error).name !== "AbortError") setSearchHits([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchText, locale]);

  const goToHit = (hit: SearchHit) => {
    const p = { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) };
    setTarget(p);          // also drop the pin so the user gets visible feedback
    setResult(null);
    flyHere(p, 9);
    setSearchHits([]);
    setSearchText(hit.display_name.split(",")[0]);
  };

  const launch = () => {
    if (!target) return;
    const r = computeImpact({
      diameterM: diameter,
      velocityKmS: velocity,
      angleDeg: angle,
      composition,
    });
    setResult(r);
    setActiveSection("hero");
    setPlaySeq((n) => n + 1); // trigger streak + flash + shockwave animation
  };

  const reset = () => {
    setResult(null);
    setTarget(null);
    setActiveSection("hero");
  };

  const onPick = (p: LatLng) => {
    setTarget(p);
    setResult(null); // any prior result is invalidated
  };

  // Composition carousel
  const compOrder: Composition[] = useMemo(
    () => ["stone", "iron", "carbon", "gold", "comet"],
    [],
  );
  const compIdx = compOrder.indexOf(composition);
  const cycleComp = (delta: number) => {
    const next =
      (compIdx + delta + compOrder.length) % compOrder.length;
    setComposition(compOrder[next]);
  };

  const handleShare = async () => {
    if (!result) return;
    const text =
      locale === "ko"
        ? `놀자.fun · 소행성 충돌 · ${formatYield(result.yieldKtTNT, "ko")} · 화구 ${formatDistance(result.fireballRadiusM, "ko")}`
        : `nolza.fun · Asteroid Strike · ${formatYield(result.yieldKtTNT, "en")} · fireball ${formatDistance(result.fireballRadiusM, "en")}`;
    try {
      await navigator.clipboard.writeText(text + "  → nolza.fun/games/asteroid");
      alert(t("결과가 복사됐어요.", "Result copied."));
    } catch {}
  };

  const formattedDiameter =
    diameter >= 1000 ? `${(diameter / 1000).toFixed(2)} km` : `${diameter} m`;

  return (
    <main className={s.shell}>
      <header className={s.topbar}>
        <div className={s.topbar__inner}>
          <Link href="/" className={s.topbar__back}>
            ← {t("놀자.fun", "Nolza.fun")}
          </Link>
          <div className={s.topbar__brand}>
            <small>{t("소행성 발사대", "Asteroid Launcher")}</small>
            {t("지구를 망쳐보자", "Ruin the Earth")}
          </div>
          <div style={{ width: 80 }} />
        </div>
      </header>

      <div className={s.layout}>
        <aside className={s.sidebar}>
          <div className={s.sectionTitle}>{t("위치", "Where")}</div>

          <div className={s.searchRow}>
            <input
              className={s.searchInput}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t("도시·국가·주소", "city, country, address")}
            />
            {searching && (
              <div className={s.searchBtn} style={{ pointerEvents: "none" }}>
                …
              </div>
            )}
          </div>
          {searchHits.length > 0 && (
            <div className={s.searchResults}>
              {searchHits.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  className={s.searchItem}
                  onClick={() => goToHit(h)}
                >
                  {h.display_name}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={useMyLocation}
            className={s.locateBtn}
            style={{ marginTop: 8 }}
          >
            ⌖ {t("내 위치로 이동", "Use my location")}
          </button>

          <div className={s.sectionTitle}>{t("성분", "Composition")}</div>
          <div className={s.compStage}>
            <button
              type="button"
              onClick={() => cycleComp(-1)}
              className={s.compChevron}
              aria-label={t("이전", "Previous")}
            >
              ‹
            </button>
            <div className={s.compDisplay}>
              <AsteroidVisual composition={composition} />
              <div className={s.compName}>
                {COMPOSITIONS[composition][locale]}{" "}
                {t("소행성", "Asteroid")}
              </div>
              <div className={s.compBody}>
                {COMPOSITIONS[composition].body[locale]}
              </div>
              <div className={s.compMeta}>
                {COMPOSITIONS[composition].density.toLocaleString()} kg/m³
              </div>
              <div className={s.compDots}>
                {compOrder.map((k) => (
                  <span
                    key={k}
                    className={`${s.compDot} ${
                      k === composition ? s.compDotActive : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => cycleComp(1)}
              className={s.compChevron}
              aria-label={t("다음", "Next")}
            >
              ›
            </button>
          </div>

          <div className={s.sectionTitle}>{t("크기·속도·각도", "Size · Speed · Angle")}</div>

          <div className={s.sliderGroup}>
            <div className={s.sliderHead}>
              <span>{t("지름", "Diameter")}</span>
              <strong>{formattedDiameter}</strong>
            </div>
            <input
              className={s.slider}
              type="range"
              min={1}
              max={10000}
              step={1}
              value={diameter}
              onChange={(e) => setDiameter(parseInt(e.target.value, 10))}
            />
          </div>

          <div className={s.sliderGroup}>
            <div className={s.sliderHead}>
              <span>{t("속도", "Velocity")}</span>
              <strong>{velocity} km/s</strong>
            </div>
            <input
              className={s.slider}
              type="range"
              min={11}
              max={72}
              step={1}
              value={velocity}
              onChange={(e) => setVelocity(parseInt(e.target.value, 10))}
            />
          </div>

          <div className={s.sliderGroup}>
            <div className={s.sliderHead}>
              <span>{t("진입각", "Entry angle")}</span>
              <strong>{angle}°</strong>
            </div>
            <input
              className={s.slider}
              type="range"
              min={15}
              max={90}
              step={1}
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value, 10))}
            />
          </div>

          <button
            type="button"
            onClick={launch}
            disabled={!target}
            className={s.launchBtn}
          >
            {target
              ? t("발사", "Launch")
              : t("지도에서 충돌 지점 선택", "Pick a target on the map")}
          </button>

          {(target || result) && (
            <button type="button" onClick={reset} className={s.resetBtn}>
              {t("다시 설정", "Reset")}
            </button>
          )}
        </aside>

        <div className={s.mapWrap}>
          <MapView
            center={center}
            zoom={zoom}
            target={target}
            flyTo={flyTo}
            flySeq={flySeq}
            onPick={onPick}
            result={result}
            playSeq={playSeq}
            activeSection={activeSection}
          />

          {!target && !result && (
            <div className={s.mapHint}>
              {t("지도를 클릭해 충돌 지점을 골라요", "Click the map to choose a target")}
            </div>
          )}

          {result && (
            <ResultNarrative
              result={result}
              locale={locale}
              t={t}
              onReset={reset}
              onShare={handleShare}
              onActiveSectionChange={setActiveSection}
            />
          )}
        </div>
      </div>
    </main>
  );
}

// ─────────────── Result Narrative (scroll-driven story) ───────────────

function ResultNarrative({
  result,
  locale,
  t,
  onReset,
  onShare,
  onActiveSectionChange,
}: {
  result: ImpactResult;
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
  onReset: () => void;
  onShare: () => void;
  onActiveSectionChange: (id: SectionId) => void;
}) {
  const dist = (m: number) => formatDistance(m, locale);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Track which section is currently most-visible inside the scroll panel.
  useEffect(() => {
    const root = panelRef.current;
    if (!root) return;
    const sections = root.querySelectorAll<HTMLElement>("[data-section]");
    if (sections.length === 0) return;

    let lastReported: SectionId | null = null;
    const visibility = new Map<SectionId, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-section") as SectionId | null;
          if (!id) continue;
          visibility.set(id, entry.intersectionRatio);
        }
        // Pick section with highest visibility ratio
        let best: SectionId | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best && best !== lastReported) {
          lastReported = best;
          onActiveSectionChange(best);
        }
      },
      {
        root,
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-20% 0px -50% 0px",
      },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [result, onActiveSectionChange]);

  return (
    <div className={s.narrative} ref={panelRef}>
      {/* HERO — yield + Hiroshima comparison */}
      <section className={s.heroSection} data-section="hero">
        <div className={s.heroKicker}>
          {result.airburst
            ? t("대기 중 폭발", "Airburst")
            : t("충돌 결과", "Impact")}
        </div>
        <div className={s.heroYield}>{formatYield(result.yieldKtTNT, locale)}</div>
        <div className={s.heroHiroshima}>
          ≈ {formatHiroshimas(result.hiroshimas, locale)}
        </div>
        {result.airburst && (
          <div className={s.airburstNote}>
            {t(
              "이 정도 크기·진입각이면 대기권에서 산산조각 납니다. 지면 충격은 없지만 충격파와 화구는 여전히 퍼집니다.",
              "An object this size at this angle disintegrates in the atmosphere. No crater — but the shockwave and fireball still spread.",
            )}
          </div>
        )}
        <div className={s.scrollHint}>
          <span>{t("스크롤", "scroll")}</span>
          <span>↓</span>
        </div>
      </section>

      {/* CRATER (skip if airburst) */}
      {!result.airburst && result.craterDiameterM > 0 && (
        <section className={s.section} data-section="crater">
          <span className={s.sectionEmoji}>🕳️</span>
          <div className={s.sectionKicker}>
            <span className={s.sectionSwatch} style={{ background: "#241612" }} />
            {t("분화구", "Crater")}
          </div>
          <h2 className={s.sectionHuge}>
            {t("폭", "")}
            <span className={s.sectionHugeUnit}> {dist(result.craterDiameterM)} </span>
            {t("의 분화구가 생깁니다", "wide crater")}
          </h2>
          <p className={s.sectionBody}>
            {t(
              "이 안에 있던 모든 것 — 건물, 도로, 지층 일부까지 — 은 증발해 사라집니다. 분화구 깊이는 대략 지름의 ",
              "Everything inside — buildings, roads, even bedrock — is vaporized. The crater is roughly ",
            )}
            <em>{(result.craterDiameterM / 5).toFixed(0)} m</em>
            {t(" 정도.", " deep.")}
          </p>
        </section>
      )}

      {/* FIREBALL */}
      <section className={s.section} data-section="fireball">
        <span className={s.sectionEmoji}>🔥</span>
        <div className={s.sectionKicker}>
          <span className={s.sectionSwatch} style={{ background: "#FF7A3D" }} />
          {t("화구", "Fireball")}
        </div>
        <h2 className={s.sectionHuge}>
          {t("반경 ", "A ")}
          <span className={s.sectionHugeUnit}> {dist(result.fireballRadiusM)} </span>
          {t("의 화구가 형성됩니다", "fireball spreads outward")}
        </h2>
        <p className={s.sectionBody}>
          {t(
            "내부 온도는 강철의 녹는점을 가뿐히 넘습니다. 화구 안의 모든 가연물은 즉시 발화하고, 노출된 사람·동물은 ",
            "Temperatures inside exceed the melting point of steel. Anything flammable ignites instantly. Living things in this radius are ",
          )}
          <em>{t("탄소 가루로 환원", "reduced to carbon")}</em>
          {t("됩니다.", ".")}
        </p>
      </section>

      {/* THERMAL BURNS */}
      <section className={s.section} data-section="thermal">
        <span className={s.sectionEmoji}>👕</span>
        <div className={s.sectionKicker}>
          <span className={s.sectionSwatch} style={{ background: "#FFB347" }} />
          {t("열복사", "Thermal radiation")}
        </div>
        <h2 className={s.sectionHuge}>
          <span className={s.sectionHugeUnit}>{dist(result.thermalBurnRadiusM)}</span>{" "}
          {t("안의 노출된 피부는 3도 화상", "of exposed skin: 3rd-degree burns")}
        </h2>
        <p className={s.sectionBody}>
          {t(
            "옷이 자연발화되고, 종이는 검게 그을리며, 자동차 도색이 부풀어 오릅니다. 햇빛 정도가 아니라 ",
            "Clothing self-ignites, paper chars black, car paint blisters. This isn't sunburn — it's ",
          )}
          <em>{t("용광로 1초 노출", "a furnace flash")}</em>
          {t(" 수준입니다.", ".")}
        </p>
      </section>

      {/* SHOCKWAVE — SEVERE */}
      <section className={s.section} data-section="shockwave">
        <span className={s.sectionEmoji}>🏚️</span>
        <div className={s.sectionKicker}>
          <span className={s.sectionSwatch} style={{ background: "#FFD166" }} />
          {t("심각 충격파", "Severe shockwave")}
        </div>
        <h2 className={s.sectionHuge}>
          <span className={s.sectionHugeUnit}>{dist(result.shockwaveSeriousRadiusM)}</span>{" "}
          {t("안의 건물 대부분이 붕괴", "of buildings collapse")}
        </h2>
        <p className={s.sectionBody}>
          {t(
            "폭심에서 시작된 5 psi 초과압이 콘크리트 빌딩도 흔들어 무너뜨립니다. 도로는 갈라지고, 지하철 터널은 ",
            "A 5-psi overpressure front rolls outward, collapsing reinforced concrete. Roads split open, subway tunnels ",
          )}
          <em>{t("일제히 무너집니다", "cave in")}</em>
          {t(".", ".")}
        </p>
      </section>

      {/* SHOCKWAVE — LIGHT */}
      <section className={s.section} data-section="shockwaveLight">
        <span className={s.sectionEmoji}>🪟</span>
        <div className={s.sectionKicker}>
          <span className={s.sectionSwatch} style={{ background: "#5DD9FF" }} />
          {t("광범위 충격파", "Wide shockwave")}
        </div>
        <h2 className={s.sectionHuge}>
          <span className={s.sectionHugeUnit}>{dist(result.shockwaveLightRadiusM)}</span>{" "}
          {t("거리에서 유리창이 깨집니다", "out, windows shatter")}
        </h2>
        <p className={s.sectionBody}>
          {t(
            "1 psi 압력은 약해 보이지만 — 도시 전체의 자동차 경보가 동시에 울리고, 사람들은 폭음을 듣고 1~2분 뒤에야 충격파가 닿는 것을 느낍니다.",
            "1 psi sounds gentle, but every car alarm in the city goes off at once. People hear the boom 1–2 minutes before the shockwave arrives.",
          )}
        </p>
      </section>

      {/* WIND */}
      <section className={s.section} data-section="wind">
        <span className={s.sectionEmoji}>🌪️</span>
        <div className={s.sectionKicker}>
          <span className={s.sectionSwatch} style={{ background: "#9B8AFF" }} />
          {t("강풍", "Hurricane wind")}
        </div>
        <h2 className={s.sectionHuge}>
          <span className={s.sectionHugeUnit}>{dist(result.windRadiusM)}</span>{" "}
          {t("반경에 허리케인급 강풍", "of hurricane-force winds")}
        </h2>
        <p className={s.sectionBody}>
          {t(
            "초속 50미터를 넘는 바람이 가로수를 뿌리째 뽑고, 지붕 기와를 한 줄로 날려보냅니다. 한반도 태풍 ‘매미’보다 ",
            "Winds over 50 m/s tear trees out by the roots and strip roofs in seconds. ",
          )}
          <em>{t("훨씬 강한 풍속", "Far stronger than a Category-5 hurricane")}</em>
          {t("입니다.", ".")}
        </p>
      </section>

      {/* EARTHQUAKE */}
      <section className={s.section} data-section="earthquake">
        <span className={s.sectionEmoji}>📈</span>
        <div className={s.sectionKicker}>
          <span className={s.sectionSwatch} style={{ background: "#C25A4E" }} />
          {t("지진 등가", "Seismic equivalent")}
        </div>
        <h2 className={s.sectionHuge}>
          <span className={s.sectionHugeUnit}>
            M {result.earthquakeMagnitude.toFixed(1)}
          </span>
          {t(" 규모의 지진", " magnitude earthquake")}
        </h2>
        <p className={s.sectionBody}>
          {earthquakeDescription(result.earthquakeMagnitude, locale, t)}
        </p>
      </section>

      {/* FINAL CTA */}
      <section className={s.finalSection} data-section="final">
        <div className={s.finalKicker}>
          {t("이게 끝이에요. 다시 해볼까요?", "That's it. Want to do it again?")}
        </div>
        <div className={s.finalBtns}>
          <button
            type="button"
            onClick={onReset}
            className={`${s.shareBtn} ${s["shareBtn--primary"]}`}
          >
            ↻ {t("다른 곳에 떨어뜨리기", "Hit another place")}
          </button>
          <button type="button" onClick={onShare} className={s.shareBtn}>
            📋 {t("결과 공유", "Share result")}
          </button>
        </div>
      </section>
    </div>
  );
}

// ─────────────── Asteroid Visual (real Wikimedia photo, per composition) ───────────────

function AsteroidVisual({ composition }: { composition: Composition }) {
  const info = COMPOSITIONS[composition];
  return (
    <div className={`${s.asteroidScene} ${s[`comp--${composition}`]}`}>
      <div className={s.asteroidStars} />
      <div className={s.asteroidGlow} />
      <div className={s.asteroidPhoto} key={composition}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={info.image}
          alt={info.body.en}
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  );
}

function earthquakeDescription(
  m: number,
  locale: "ko" | "en",
  t: (ko: string, en: string) => string,
): string {
  if (m < 4) {
    return t(
      "근처에 서 있던 사람만 흔들림을 느낍니다. 충돌 자체에 비하면 미미한 진동.",
      "Only people standing nearby feel it. Minor compared to the impact itself.",
    );
  }
  if (m < 6) {
    return t(
      "도시 단위로 흔들립니다. 약한 건물에 금이 가고, 식기장 속 그릇이 깨집니다.",
      "The city shakes. Cracks form in weak buildings; dishes fall from shelves.",
    );
  }
  if (m < 7) {
    return t(
      "2017년 포항 지진(M 5.4)보다 훨씬 강합니다. 광범위한 구조물 손상이 발생합니다.",
      "Stronger than the 2010 Haiti quake. Widespread structural damage across the region.",
    );
  }
  if (m < 8) {
    return t(
      "1976년 탕산 대지진(M 7.8)급. 진앙 주변 수백 km까지 건물이 붕괴됩니다.",
      "On par with the 1906 San Francisco earthquake. Buildings collapse hundreds of km away.",
    );
  }
  if (m < 9.5) {
    return t(
      "지구 역사상 손꼽히는 대지진. 진앙으로부터 1,000km 떨어진 곳에서도 책상이 흔들립니다.",
      "Among the largest earthquakes ever recorded. Felt 1,000 km away.",
    );
  }
  return t(
    "관측 가능한 가장 강한 지진을 능가합니다. 지각 자체가 새로운 지형을 만들어냅니다.",
    "Stronger than any earthquake on the seismic record. The crust itself is being reshaped.",
  );
}
