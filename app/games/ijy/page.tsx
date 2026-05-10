"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type Category =
  | "daily"
  | "electronics"
  | "luxury"
  | "cars"
  | "realestate"
  | "absurd";

type SpecialBlock = { ko: string; en: string };

type Item = {
  id: string;
  ko: string;
  en: string;
  price: number;
  cat: Category;
  emoji: string;
  image?: string;
  desc?: { ko: string; en: string };
  block?: SpecialBlock;
};

// Player budget — Lee Jae-yong's reported wealth (~₩30조). Items that exceed
// the budget surface as out-of-budget; special-blocked items (독도, 백두산,
// 국회의사당, 달 토지) override the affordability check and always show their
// lore message instead.
const TOTAL_MONEY = 30_000_000_000_000; // ₩30조

const ITEMS: Item[] = [
  // ── 일상 ───────────────────────────────────────────────────────────
  { id: "kimbap",     cat: "daily", ko: "삼각김밥",       en: "Triangle Kimbap",         price: 1_500,    emoji: "🍙", image: "/items/kimbap.jpg" },
  { id: "ramyeon",    cat: "daily", ko: "컵라면",          en: "Cup Noodles",             price: 1_200,    emoji: "🍜", image: "/items/ramyeon.jpg" },
  { id: "starbucks",  cat: "daily", ko: "스타벅스 아메리카노", en: "Starbucks Americano",  price: 6_500,    emoji: "☕", image: "/items/starbucks.jpg" },
  { id: "chicken",    cat: "daily", ko: "치킨 한 마리",    en: "Whole Chicken",            price: 22_000,   emoji: "🍗", image: "/items/chicken.jpg" },
  { id: "pizza",      cat: "daily", ko: "피자 한 판",      en: "A Pizza",                  price: 25_000,   emoji: "🍕", image: "/items/pizza.jpg" },
  { id: "soju",       cat: "daily", ko: "소주 한 병",      en: "Bottle of Soju",           price: 1_500,    emoji: "🍶", image: "/items/soju.jpg" },
  { id: "beer",       cat: "daily", ko: "맥주 한 캔",      en: "Can of Beer",              price: 2_500,    emoji: "🍺", image: "/items/beer.jpg" },
  { id: "lunchbox",   cat: "daily", ko: "편의점 도시락",   en: "Convenience-store Bento",  price: 4_500,    emoji: "🍱", image: "/items/lunchbox.jpg" },
  { id: "delivery",   cat: "daily", ko: "배달비",          en: "Delivery Fee",             price: 4_000,    emoji: "🛵", image: "/items/delivery.jpg" },
  { id: "taxi",       cat: "daily", ko: "택시 기본요금",   en: "Taxi Base Fare",           price: 4_800,    emoji: "🚖", image: "/items/taxi.jpg" },

  // ── 전자기기 ───────────────────────────────────────────────────────
  { id: "airpods",    cat: "electronics", ko: "에어팟 프로",      en: "AirPods Pro",         price: 359_000,    emoji: "🎧", image: "/items/airpods.jpg",
    desc: { ko: "노이즈 캔슬링.", en: "Noise cancelling." } },
  { id: "iphone",     cat: "electronics", ko: "아이폰 16 Pro",    en: "iPhone 16 Pro",       price: 1_550_000,  emoji: "📱", image: "/items/iphone.jpg" },
  { id: "galaxy",     cat: "electronics", ko: "갤럭시 S25 Ultra", en: "Galaxy S25 Ultra",    price: 1_800_000,  emoji: "📱", image: "/items/galaxy.jpg" },
  { id: "macbook",    cat: "electronics", ko: "맥북 프로",         en: "MacBook Pro",         price: 3_500_000,  emoji: "💻", image: "/items/macbook.jpg" },
  { id: "dyson",      cat: "electronics", ko: "다이슨 청소기",     en: "Dyson Vacuum",        price: 900_000,    emoji: "🧹", image: "/items/dyson.jpg" },
  { id: "lgtv",       cat: "electronics", ko: "LG 올레드 TV",      en: "LG OLED TV",          price: 2_000_000,  emoji: "📺", image: "/items/lgtv.jpg" },
  { id: "switch",     cat: "electronics", ko: "닌텐도 스위치",     en: "Nintendo Switch",     price: 400_000,    emoji: "🎮", image: "/items/switch.jpg" },
  { id: "ps5",        cat: "electronics", ko: "플레이스테이션 5",  en: "PlayStation 5",       price: 750_000,    emoji: "🎮", image: "/items/ps5.png" },

  // ── 명품 ───────────────────────────────────────────────────────────
  { id: "rolex",      cat: "luxury", ko: "롤렉스 데이토나",    en: "Rolex Daytona",        price: 22_000_000,  emoji: "⌚", image: "/items/rolex.jpg",
    desc: { ko: "기다리는 데만 5년.", en: "5-year waiting list." } },
  { id: "birkin",     cat: "luxury", ko: "에르메스 버킨백",    en: "Hermès Birkin",        price: 30_000_000,  emoji: "👜", image: "/items/birkin.jpg",
    desc: { ko: "돈 있어도 못 사는 가방.", en: "Money alone won't buy it." } },
  { id: "lv",         cat: "luxury", ko: "루이비통 가방",      en: "Louis Vuitton Bag",    price: 5_000_000,   emoji: "👜", image: "/items/lv.jpg" },
  { id: "chanel",     cat: "luxury", ko: "샤넬 클래식 플랩",   en: "Chanel Classic Flap",  price: 15_000_000,  emoji: "👜", image: "/items/chanel.jpg" },

  // ── 자동차 ─────────────────────────────────────────────────────────
  { id: "avante",     cat: "cars", ko: "아반떼",             en: "Hyundai Avante",       price: 25_000_000,    emoji: "🚗", image: "/items/avante.jpg" },
  { id: "g90",        cat: "cars", ko: "제네시스 G90",       en: "Genesis G90",          price: 120_000_000,   emoji: "🚘", image: "/items/g90.jpg" },
  { id: "benz",       cat: "cars", ko: "벤츠 S클래스",       en: "Mercedes-Benz S-Class",price: 200_000_000,   emoji: "🚙", image: "/items/benz.jpg" },
  { id: "porsche",    cat: "cars", ko: "포르쉐 911",         en: "Porsche 911",          price: 200_000_000,   emoji: "🏎️", image: "/items/porsche.jpg" },
  { id: "lambo",      cat: "cars", ko: "람보르기니 우라칸",  en: "Lamborghini Huracán",  price: 350_000_000,   emoji: "🏎️", image: "/items/lambo.jpg" },
  { id: "ferrari",    cat: "cars", ko: "페라리 SF90",        en: "Ferrari SF90",         price: 550_000_000,   emoji: "🏎️", image: "/items/ferrari.jpg" },
  { id: "phantom",    cat: "cars", ko: "롤스로이스 팬텀",    en: "Rolls-Royce Phantom",  price: 700_000_000,   emoji: "🚖", image: "/items/phantom.jpg" },

  // ── 부동산 ─────────────────────────────────────────────────────────
  { id: "apt",        cat: "realestate", ko: "강남 아파트 한 채", en: "Gangnam Apartment", price: 3_000_000_000,    emoji: "🏢", image: "/items/apt.jpg",
    desc: { ko: "한 평에 1억.", en: "₩100M per pyeong." } },
  { id: "jeju-land",  cat: "realestate", ko: "제주도 땅 1만평",   en: "10,000-pyeong of Jeju", price: 5_000_000_000, emoji: "🏝️", image: "/items/jeju-land.jpg" },
  { id: "bld63",      cat: "realestate", ko: "63빌딩",            en: "63 Building",        price: 1_000_000_000_000,   emoji: "🏬", image: "/items/bld63.jpg" },
  { id: "yeouido",    cat: "realestate", ko: "여의도 전체",       en: "All of Yeouido",     price: 10_000_000_000_000,  emoji: "🏙️", image: "/items/yeouido.jpg" },

  // ── 황당 ───────────────────────────────────────────────────────────
  { id: "kakao",      cat: "absurd", ko: "카카오 인수",            en: "Acquire Kakao",            price: 30_000_000_000_000,  emoji: "🟡", image: "/items/kakao.jpg",
    desc: { ko: "전 국민의 메신저.", en: "Korea's chat app." } },
  { id: "hybe",       cat: "absurd", ko: "하이브 인수",            en: "Acquire HYBE",             price: 14_000_000_000_000,  emoji: "🎤", image: "/items/hybe.jpg" },
  { id: "bok-gold",   cat: "absurd", ko: "한국은행 금 보유량",    en: "Bank of Korea Gold Reserves", price: 50_000_000_000_000, emoji: "🪙", image: "/items/bok-gold.jpg" },

  { id: "han-river",  cat: "absurd", ko: "한강 물 전부",          en: "All of the Han River",     price: 50_000_000_000,      emoji: "🌊", image: "/items/han-river.jpg",
    desc: { ko: "한강은 끝없이 다시 채워집니다.", en: "The Han keeps refilling itself." } },
  { id: "subway",     cat: "absurd", ko: "서울 지하철 하루 빌리기", en: "Rent the Seoul Subway for a Day", price: 10_000_000_000, emoji: "🚇", image: "/items/subway.jpg" },
  { id: "ktx",        cat: "absurd", ko: "KTX 전체 임대",          en: "Lease the Entire KTX",     price: 1_000_000_000_000,   emoji: "🚄", image: "/items/ktx.jpg" },
  { id: "gyeongbok",  cat: "absurd", ko: "경복궁 하루 대관",       en: "Rent Gyeongbokgung for a Day", price: 1_000_000_000, emoji: "🏯", image: "/items/gyeongbok.jpg",
    desc: { ko: "한복 입고 가야겠죠.", en: "Hanbok mandatory." } },
  { id: "dmz",        cat: "absurd", ko: "DMZ 땅 전체",            en: "All of the DMZ",           price: 100_000_000_000_000, emoji: "🪖", image: "/items/dmz.jpg" },

  // ── 황당: 막힌 구매 (specially-blocked) ─────────────────────────────
  { id: "assembly",   cat: "absurd", ko: "국회의사당",             en: "National Assembly Building", price: 999_000_000_000_000, emoji: "🏛️", image: "/items/assembly.png",
    block: {
      ko: "민주주의는 팔 수 없습니다 🏛️",
      en: "Democracy is not for sale 🏛️",
    } },
  { id: "dokdo",      cat: "absurd", ko: "독도",                  en: "Dokdo",                    price: 50_000_000_000_000,  emoji: "🇰🇷", image: "/items/dokdo.jpg",
    block: {
      ko: "독도는 우리 땅이라 살 수 없습니다 🇰🇷",
      en: "Dokdo belongs to Korea — not for sale 🇰🇷",
    } },
  { id: "baekdu",     cat: "absurd", ko: "백두산",                en: "Mount Paektu",             price: 200_000_000_000_000, emoji: "🌋", image: "/items/baekdu.jpg",
    block: {
      ko: "북한 영토입니다... 협상이 필요해요",
      en: "It's in North Korea. You'll need to negotiate first.",
    } },

  // 스포츠/엔터 — absurd 묶음에 포함
  { id: "son-salary", cat: "absurd", ko: "손흥민 1년치 연봉",     en: "Son Heung-min's Annual Salary", price: 40_000_000_000, emoji: "⚽", image: "/items/son.jpg" },
  { id: "bts-show",   cat: "absurd", ko: "BTS 콘서트 1회 개최",   en: "Host a BTS Concert",       price: 5_000_000_000,       emoji: "🎤", image: "/items/bts.jpg" },
  { id: "wc-trophy",  cat: "absurd", ko: "월드컵 우승 트로피 복제품", en: "World Cup Replica Trophy", price: 1_000_000_000,   emoji: "🏆", image: "/items/wc-trophy.jpg" },
  { id: "olympic",    cat: "absurd", ko: "올림픽 금메달 복제품",  en: "Replica Olympic Gold",     price: 100_000_000,         emoji: "🥇", image: "/items/olympic.jpg" },

  // 우주/황당
  { id: "moon",       cat: "absurd", ko: "달 토지 1평",            en: "1 Pyeong of Moon Land",    price: 50_000,              emoji: "🌕", image: "/items/moon.jpg",
    block: {
      ko: "국제우주조약상 달은 누구의 소유도 아닙니다",
      en: "Per the Outer Space Treaty, the Moon belongs to no one.",
    } },
  { id: "mars",       cat: "absurd", ko: "화성 토지 1평",          en: "1 Pyeong of Mars Land",    price: 30_000,              emoji: "🔴", image: "/items/mars.png" },
  { id: "shuttle",    cat: "absurd", ko: "NASA 우주왕복선",        en: "NASA Space Shuttle",       price: 2_000_000_000_000,   emoji: "🚀", image: "/items/shuttle.jpg" },
  { id: "iss",        cat: "absurd", ko: "국제우주정거장",         en: "International Space Station", price: 150_000_000_000_000, emoji: "🛰️", image: "/items/iss.jpg" },
];

const CAT_TABS: { id: Category | "all"; ko: string; en: string }[] = [
  { id: "all",         ko: "전체",     en: "All" },
  { id: "daily",       ko: "일상",     en: "Daily" },
  { id: "electronics", ko: "전자기기", en: "Tech" },
  { id: "luxury",      ko: "명품",     en: "Luxury" },
  { id: "cars",        ko: "자동차",   en: "Cars" },
  { id: "realestate",  ko: "부동산",   en: "Real Estate" },
  { id: "absurd",      ko: "황당",     en: "Absurd" },
];

const COLOR = {
  bg: "#faf8f3",          // cream (matches home)
  card: "#ffffff",        // thumb panel
  border: "#e5e0d0",      // hairline
  hairline: "rgba(20,17,14,0.10)",
  accent: "#C60C30",      // injoo red — used for active states + count chip
  ink: "#111111",
  ink2: "#2a2520",
  muted: "#666666",       // prices, secondary copy
  disabled: "#cfcabb",
  trackBg: "#ece7d8",
  buttonBg: "#111111",
  buttonText: "#ffffff",
};

function formatBalance(
  n: number,
  locale: "ko" | "en",
): { value: string; unit: string } {
  if (locale === "en") {
    if (n <= 0) return { value: "0", unit: "KRW" };
    if (n >= 1e15) return { value: (n / 1e15).toFixed(2), unit: "Q KRW" };
    if (n >= 1e12) return { value: (n / 1e12).toFixed(2), unit: "T KRW" };
    if (n >= 1e9) return { value: (n / 1e9).toFixed(1), unit: "B KRW" };
    if (n >= 1e6) return { value: (n / 1e6).toFixed(1), unit: "M KRW" };
    return { value: Math.floor(n).toLocaleString("en-US"), unit: "KRW" };
  }
  if (n <= 0) return { value: "0", unit: "원" };
  const t = n / 1e12;
  if (t >= 1) return { value: t.toFixed(2), unit: "조원" };
  const e = n / 1e8;
  if (e >= 1) return { value: e.toFixed(1), unit: "억원" };
  const m = n / 1e4;
  if (m >= 1) return { value: Math.floor(m).toLocaleString("ko-KR"), unit: "만원" };
  return { value: Math.floor(n).toLocaleString("ko-KR"), unit: "원" };
}

function formatPrice(n: number, locale: "ko" | "en"): string {
  if (locale === "en") {
    if (n >= 1e15) return `₩${(n / 1e15).toFixed(1)}Q`;
    if (n >= 1e12) return `₩${(n / 1e12).toFixed(1)}T`;
    if (n >= 1e9) return `₩${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `₩${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `₩${(n / 1e3).toFixed(0)}K`;
    return `₩${n}`;
  }
  if (n >= 1e12) {
    const v = n / 1e12;
    if (v >= 10) return `${Math.floor(v).toLocaleString("ko-KR")}조원`;
    return `${parseFloat(v.toFixed(1))}조원`;
  }
  if (n >= 1e8) {
    const v = n / 1e8;
    return `${parseFloat(v.toFixed(1)).toLocaleString("ko-KR")}억원`;
  }
  if (n >= 1e4) {
    const m = n / 1e4;
    if (m % 1 === 0) return `${Math.floor(m).toLocaleString("ko-KR")}만원`;
    return `${n.toLocaleString("ko-KR")}원`;
  }
  return `${n.toLocaleString("ko-KR")}원`;
}

function getReaction(spentRatio: number, t: (ko: string, en: string) => string): string {
  if (spentRatio === 0) return t("30조원이 들어왔습니다", "₩30 trillion has arrived");
  if (spentRatio < 0.001) return t("거의 티도 안 나는데요", "Barely a dent");
  if (spentRatio < 0.01) return t("뭔가 사보세요!", "Buy something!");
  if (spentRatio < 0.05) return t("슬슬 감 잡으셨네요", "Getting the hang of it");
  if (spentRatio < 0.2) return t("이재용도 이 정도는 안 쓸 듯요", "Even Lee Jae-yong wouldn't spend this much");
  if (spentRatio < 0.5) return t("드디어 절반이에요!", "Finally halfway there!");
  if (spentRatio < 0.9) return t("이러다 진짜 다 써버리겠어요", "You're really going to spend it all");
  if (spentRatio < 1) return t("마지막 한 방", "Final blow");
  return t("파산!", "Bankrupt!");
}

// ── Item thumbnail (image w/ emoji fallback) ───────────────────────────
function ItemThumb({ item }: { item: Item }) {
  const [errored, setErrored] = useState(false);
  const showImage = item.image && !errored;
  return (
    <div
      style={{
        width: 80,
        height: 80,
        flexShrink: 0,
        borderRadius: 12,
        background: COLOR.card,
        border: `1px solid ${COLOR.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {showImage ? (
        <img
          src={item.image}
          alt={item.ko}
          loading="lazy"
          onError={() => setErrored(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <span style={{ fontSize: 40, lineHeight: 1 }} aria-hidden>
          {item.emoji}
        </span>
      )}
    </div>
  );
}

// ── Tooltip on hover ───────────────────────────────────────────────────
function ItemTooltip({ text }: { text: string }) {
  return (
    <div
      role="tooltip"
      style={{
        position: "absolute",
        bottom: "calc(100% + 8px)",
        left: 0,
        zIndex: 5,
        padding: "8px 12px",
        background: COLOR.ink,
        border: `1px solid ${COLOR.ink}`,
        borderRadius: 8,
        fontSize: 15,
        color: "#ffffff",
        boxShadow: "0 8px 24px rgba(20,17,14,0.18)",
        maxWidth: 280,
        pointerEvents: "none",
        whiteSpace: "normal",
      }}
    >
      {text}
    </div>
  );
}

export default function IjyGame() {
  const { locale, t } = useLocale();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [bumpKey, setBumpKey] = useState(0);
  const [tab, setTab] = useState<Category | "all">("all");
  const [block, setBlock] = useState<SpecialBlock | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Auto-dismiss the special-block message after 3.2s.
  useEffect(() => {
    if (!block) return;
    const id = setTimeout(() => setBlock(null), 3200);
    return () => clearTimeout(id);
  }, [block]);

  const spent = useMemo(
    () => ITEMS.reduce((acc, item) => acc + (counts[item.id] ?? 0) * item.price, 0),
    [counts],
  );
  const remaining = TOTAL_MONEY - spent;
  const ratio = Math.min(1, spent / TOTAL_MONEY);
  const reaction = getReaction(ratio, t);
  const balance = formatBalance(remaining, locale);

  const visibleItems = useMemo(
    () => (tab === "all" ? ITEMS : ITEMS.filter((it) => it.cat === tab)),
    [tab],
  );

  const add = (item: Item) => {
    if (item.block) {
      setBlock(item.block);
      return;
    }
    if (remaining < item.price) return;
    setCounts((p) => ({ ...p, [item.id]: (p[item.id] ?? 0) + 1 }));
    setBumpKey((k) => k + 1);
  };
  const remove = (item: Item) => {
    setCounts((p) => {
      const cur = p[item.id] ?? 0;
      if (cur <= 0) return p;
      const next = { ...p, [item.id]: cur - 1 };
      if (next[item.id] === 0) delete next[item.id];
      return next;
    });
    setBumpKey((k) => k + 1);
  };

  return (
    <main
      className="min-h-screen page-in"
      style={{ backgroundColor: COLOR.bg, color: COLOR.ink }}
    >
      {/* Top thin progress bar */}
      <div
        className="fixed left-0 right-0 top-0 z-30"
        style={{ height: 2, backgroundColor: COLOR.trackBg }}
      >
        <div
          className="h-full transition-[width] duration-300"
          style={{ width: `${ratio * 100}%`, backgroundColor: COLOR.accent }}
        />
      </div>

      <div className="mx-auto" style={{ maxWidth: 1000, padding: "24px 32px 0" }}>
        <AdTop />
      </div>

      <div className="mx-auto" style={{ maxWidth: 760, padding: "20px 24px 60px" }}>
        {/* Tiny breadcrumb */}
        <div
          className="text-center"
          style={{
            fontSize: 16,
            color: COLOR.muted,
            letterSpacing: "0.32em",
            fontWeight: 500,
            opacity: 0.6,
          }}
        >
          {t("이재용 · 30조원", "Lee Jae-yong · ₩30T")}
        </div>

        {/* Big balance — dominant top hero so the scale of 30조 lands. */}
        <div className="text-center" style={{ marginTop: 80, marginBottom: 32 }}>
          <div
            style={{
              fontSize: 16,
              color: COLOR.muted,
              letterSpacing: "0.24em",
              marginBottom: 22,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t("남은 돈", "Remaining")}
          </div>
          <div
            key={bumpKey}
            className="number-bump tabular-nums"
            style={{
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
              color: COLOR.ink,
              fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "clamp(96px, 14vw, 168px)" }}>
              {balance.value}
            </span>
            <span
              style={{
                fontSize: "clamp(40px, 5.5vw, 64px)",
                fontWeight: 700,
                color: COLOR.accent,
                letterSpacing: 0,
              }}
            >
              {balance.unit}
            </span>
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 19,
              color: COLOR.muted,
              letterSpacing: "0.02em",
            }}
          >
            {reaction}
          </div>
        </div>

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label={t("카테고리", "Categories")}
          style={{
            marginTop: 64,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {CAT_TABS.map((c) => {
            const active = tab === c.id;
            const label = locale === "ko" ? c.ko : c.en;
            const count =
              c.id === "all" ? ITEMS.length : ITEMS.filter((it) => it.cat === c.id).length;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(c.id)}
                className="btn-press"
                style={{
                  padding: "8px 14px",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  border: `1px solid ${active ? COLOR.accent : COLOR.border}`,
                  background: active ? "rgba(74,222,128,0.10)" : "transparent",
                  color: active ? COLOR.accent : COLOR.muted,
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {label}
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 13,
                    opacity: 0.7,
                    fontWeight: 400,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Item list */}
        <section style={{ marginTop: 32 }}>
          {visibleItems.map((item) => {
            const count = counts[item.id] ?? 0;
            const isBlocked = !!item.block;
            // Blocked items remain clickable so the special message can fire.
            const cantAfford = !isBlocked && remaining < item.price && count === 0;
            const decDisabled = count === 0;
            const itemName = locale === "ko" ? item.ko : item.en;
            const tipText =
              item.desc?.[locale] ??
              (item.block ? item.block[locale] : undefined);
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered((h) => (h === item.id ? null : h))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  minHeight: 96,
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderBottom: `1px solid ${COLOR.hairline}`,
                  position: "relative",
                }}
              >
                <ItemThumb item={item} />

                <div className="flex flex-1 items-baseline justify-between gap-4 min-w-0">
                  <span
                    className="truncate"
                    style={{
                      fontSize: 19,
                      fontWeight: 500,
                      color: count > 0 ? COLOR.ink : COLOR.ink2,
                    }}
                  >
                    {itemName}
                    {isBlocked && (
                      <span
                        aria-hidden
                        style={{
                          marginLeft: 8,
                          fontSize: 13,
                          color: COLOR.muted,
                          letterSpacing: "0.1em",
                        }}
                      >
                        · {t("판매 불가", "BLOCKED")}
                      </span>
                    )}
                  </span>
                  <span
                    className="tabular-nums whitespace-nowrap"
                    style={{ fontSize: 17, color: COLOR.muted }}
                  >
                    {formatPrice(item.price, locale)}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    disabled={decDisabled}
                    aria-label={t("감소", "Decrease")}
                    className="btn-press"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "none",
                      background: decDisabled ? COLOR.disabled : COLOR.buttonBg,
                      color: COLOR.buttonText,
                      fontSize: 22,
                      fontWeight: 500,
                      lineHeight: 1,
                      cursor: decDisabled ? "not-allowed" : "pointer",
                      transition: "background 0.15s ease, transform 0.1s ease",
                    }}
                  >
                    −
                  </button>
                  <span
                    className="tabular-nums text-center"
                    style={{
                      minWidth: 44,
                      fontSize: 17,
                      fontWeight: 600,
                      color: count > 0 ? COLOR.accent : COLOR.disabled,
                    }}
                  >
                    {count.toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(item)}
                    disabled={cantAfford}
                    aria-label={t("증가", "Increase")}
                    className="btn-press"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: "none",
                      background: cantAfford
                        ? COLOR.disabled
                        : isBlocked
                        ? COLOR.accent
                        : COLOR.buttonBg,
                      color: COLOR.buttonText,
                      fontSize: 22,
                      fontWeight: 500,
                      lineHeight: 1,
                      cursor: cantAfford ? "not-allowed" : "pointer",
                      transition: "background 0.15s ease, transform 0.1s ease",
                    }}
                  >
                    +
                  </button>
                </div>

                {hovered === item.id && tipText && <ItemTooltip text={tipText} />}
              </div>
            );
          })}
        </section>

        {ratio >= 1 && (
          <div
            className="text-center"
            style={{
              marginTop: 40,
              fontSize: 16,
              color: COLOR.accent,
              letterSpacing: "0.05em",
            }}
          >
            {t("이재용 되는 게 쉽지 않네요", "Being Lee Jae-yong isn't easy")}
          </div>
        )}
      </div>

      {/* Special-block toast — for items whose purchase is forbidden lore-wise. */}
      {block && (
        <div
          role="alert"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "10vh",
            transform: "translateX(-50%)",
            zIndex: 80,
            background: COLOR.ink,
            border: `2px solid ${COLOR.accent}`,
            color: "#ffffff",
            padding: "16px 24px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 500,
            maxWidth: "90vw",
            textAlign: "center",
            boxShadow: "0 24px 48px -12px rgba(20,17,14,0.35)",
          }}
        >
          {block[locale]}
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6" style={{ paddingBottom: 80 }}>
        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}
