"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AdTop, AdBottom, AdMobileSticky } from "../../components/Ads";
import GameIntro from "../../components/game/GameIntro";
import ResultScreen from "../../components/game/ResultScreen";
import { useLocale } from "@/hooks/useLocale";

type Category =
  | "daily"
  | "electronics"
  | "luxury"
  | "cars"
  | "realestate"
  | "absurd";

type SpecialBlock = { ko: string; en: string };
type Localized = { ko: string; en: string };

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

const CAT_LABELS: Record<Category, Localized> = {
  daily: { ko: "일상", en: "Daily" },
  electronics: { ko: "전자기기", en: "Tech" },
  luxury: { ko: "명품", en: "Luxury" },
  cars: { ko: "자동차", en: "Cars" },
  realestate: { ko: "부동산", en: "Real Estate" },
  absurd: { ko: "황당", en: "Absurd" },
};

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

function getSpendingType({
  spent,
  totalItems,
  topCategory,
  topItem,
  ratio,
}: {
  spent: number;
  totalItems: number;
  topCategory: Category | null;
  topItem: Item | null;
  ratio: number;
}): { name: Localized; line: Localized } {
  if (spent <= 0) {
    return {
      name: { ko: "돈 쓰는 재능 없음", en: "No-Spend Talent" },
      line: {
        ko: "30조를 앞에 두고도 장바구니 앞에서 심호흡하는 타입입니다.",
        en: "You can stare at ₩30T and still hesitate at checkout.",
      },
    };
  }
  if (topCategory === "daily" && ratio < 0.01) {
    return {
      name: { ko: "편의점 재벌", en: "Convenience-store Tycoon" },
      line: {
        ko: "세계 경제보다 삼각김밥 회전율에 더 진심입니다.",
        en: "You care more about triangle kimbap turnover than the global economy.",
      },
    };
  }
  if (topCategory === "realestate") {
    return {
      name: { ko: "부동산 영혼 보유자", en: "Real-estate Soul" },
      line: {
        ko: "돈이 생기자마자 땅부터 보는 아주 한국적인 영혼입니다.",
        en: "Very Korean: money arrives, real estate tabs open.",
      },
    };
  }
  if (topCategory === "absurd" && ["mars", "shuttle", "iss"].includes(topItem?.id ?? "")) {
    return {
      name: { ko: "우주까지 사버린 사람", en: "Bought Outer Space" },
      line: {
        ko: "지구에서 살 수 있는 건 거의 끝났다고 판단하셨군요.",
        en: "Apparently Earth shopping was too small for you.",
      },
    };
  }
  if (ratio >= 0.75 || totalItems >= 30) {
    return {
      name: { ko: "플렉스 중독자", en: "Flex Addict" },
      line: {
        ko: "카드 승인 문자가 오기도 전에 다음 구매를 누르는 타입입니다.",
        en: "You press buy again before the card alert even arrives.",
      },
    };
  }
  if (ratio < 0.08) {
    return {
      name: { ko: "재벌 초보", en: "Beginner Chaebol" },
      line: {
        ko: "돈은 많은데 아직 가격표 보는 습관을 못 버렸습니다.",
        en: "Rich budget, normal-person price-checking reflex.",
      },
    };
  }
  return {
    name: { ko: "차분한 회장님", en: "Calm Chairperson" },
    line: {
      ko: "쓴 건 썼는데 아직도 나라 예산처럼 남았습니다.",
      en: "You spent a lot and it still looks like a national budget.",
    },
  };
}

// ── Item thumbnail (image w/ emoji fallback) ───────────────────────────
function ItemThumb({ item }: { item: Item }) {
  const [errored, setErrored] = useState(false);
  const imageSrc = !errored ? item.image : undefined;
  return (
    <div
      className="ijy-thumb"
      style={{
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
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={item.ko}
          fill
          sizes="80px"
          loading="lazy"
          onError={() => setErrored(true)}
          style={{
            objectFit: "cover",
          }}
        />
      ) : (
        <span className="ijy-thumb-emoji" aria-hidden style={{ lineHeight: 1 }}>
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
  const [introDone, setIntroDone] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [bumpKey, setBumpKey] = useState(0);
  const [tab, setTab] = useState<Category | "all">("all");
  const [block, setBlock] = useState<SpecialBlock | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastBuy, setLastBuy] = useState<{ item: Item; count: number } | null>(null);

  // Auto-dismiss the special-block message after 3.2s.
  useEffect(() => {
    if (!block) return;
    const id = setTimeout(() => setBlock(null), 3200);
    return () => clearTimeout(id);
  }, [block]);

  useEffect(() => {
    if (!lastBuy) return;
    const id = setTimeout(() => setLastBuy(null), 1200);
    return () => clearTimeout(id);
  }, [lastBuy]);

  const spent = useMemo(
    () => ITEMS.reduce((acc, item) => acc + (counts[item.id] ?? 0) * item.price, 0),
    [counts],
  );
  const remaining = TOTAL_MONEY - spent;
  const ratio = Math.min(1, spent / TOTAL_MONEY);
  const reaction = getReaction(ratio, t);
  const balance = formatBalance(remaining, locale);
  const spentDisplay = formatBalance(spent, locale);

  const purchased = useMemo(
    () => ITEMS
      .map((item) => ({ item, count: counts[item.id] ?? 0 }))
      .filter(({ count }) => count > 0),
    [counts],
  );
  const totalItems = purchased.reduce((sum, entry) => sum + entry.count, 0);
  const topItem =
    purchased
      .slice()
      .sort((a, b) => b.count * b.item.price - a.count * a.item.price)[0]?.item ?? null;
  const topCategory = useMemo(() => {
    const totals = new Map<Category, number>();
    for (const { item, count } of purchased) {
      totals.set(item.cat, (totals.get(item.cat) ?? 0) + item.price * count);
    }
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  }, [purchased]);
  const spendingType = getSpendingType({ spent, totalItems, topCategory, topItem, ratio });
  const topCategoryLabel = topCategory ? CAT_LABELS[topCategory][locale] : t("없음", "None");
  const topItemName = topItem ? topItem[locale] : t("없음", "None");
  const resultDetails = [
    t(`총 ${totalItems.toLocaleString("ko-KR")}개를 샀습니다. 손가락 관절도 재벌급으로 일했습니다.`, `Bought ${totalItems.toLocaleString("en-US")} items. Your thumb did executive-level labor.`),
    t(`가장 크게 쓴 분야: ${topCategoryLabel}`, `Biggest category: ${topCategoryLabel}`),
    t(`가장 큰 지출 아이템: ${topItemName}`, `Biggest purchase: ${topItemName}`),
    t(`남은 돈: ${balance.value}${balance.unit}. 아직도 숫자가 현실감이 없습니다.`, `Remaining: ${balance.value} ${balance.unit}. Still not a normal number.`),
  ];
  const shareText = t(
    `나는 30조 중 ${spentDisplay.value}${spentDisplay.unit}을 쓰고도 아직 ${balance.value}${balance.unit}이 남았다.\n내 소비 유형은 "${spendingType.name.ko}". 너도 이재용 돈 다 써봐.`,
    `I spent ${spentDisplay.value} ${spentDisplay.unit} out of ₩30T and still have ${balance.value} ${balance.unit} left.\nMy spending type: "${spendingType.name.en}". Try spending Lee Jae-yong's money.`,
  );
  const resultVisible = showResult || ratio >= 1;

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
    const nextCount = (counts[item.id] ?? 0) + 1;
    setCounts((p) => ({ ...p, [item.id]: (p[item.id] ?? 0) + 1 }));
    setLastBuy({ item, count: nextCount });
    setBumpKey((k) => k + 1);
    setShowResult(false);
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
    setShowResult(false);
  };

  const restart = () => {
    setCounts({});
    setBumpKey((k) => k + 1);
    setBlock(null);
    setLastBuy(null);
    setHovered(null);
    setShowResult(false);
    setTab("all");
  };

  if (!introDone) {
    return (
      <main
        className="min-h-screen page-in flex items-center justify-center px-5 py-16"
        style={{ backgroundColor: COLOR.bg, color: COLOR.ink }}
      >
        <GameIntro
          eyebrow={t("LIVE IT · 재벌 시뮬레이터", "LIVE IT · CHAEBOL SIM")}
          title={t("이재용 돈 다 써봐", "Spend Lee Jae-yong's Money")}
          hook={t("30조원이 들어왔습니다. 이제 가격표가 당신을 무서워합니다.", "₩30T just arrived. Price tags fear you now.")}
          howTo={t("물건을 눌러 사고, 마지막에 소비 유형을 정산하세요. 결과는 링크로 바로 공유할 수 있어요.", "Buy items, settle your spending type, and share the result link.")}
          meta={[t("약 1분", "1 min"), t("52개 아이템", "52 items"), t("결과 카드", "Result card")]}
          startLabel={t("쇼핑 시작", "Start shopping")}
          onStart={() => setIntroDone(true)}
          tone="paper"
        />
        <AdMobileSticky />
      </main>
    );
  }

  return (
    <main
      className="min-h-screen page-in"
      style={{ backgroundColor: COLOR.bg, color: COLOR.ink }}
    >
      <style>{`
        .ijy-ad-wrap { padding: 24px 32px 0; }
        .ijy-shell { padding: 20px 24px 60px; }
        .ijy-breadcrumb { font-size: 16px; letter-spacing: 0.32em; }
        .ijy-hero { margin-top: 80px; margin-bottom: 32px; }
        .ijy-hero-label { font-size: 16px; letter-spacing: 0.24em; margin-bottom: 22px; }
        .ijy-hero-number { gap: 18px; }
        .ijy-hero-value { font-size: clamp(72px, 14vw, 168px); }
        .ijy-hero-unit { font-size: clamp(34px, 5.5vw, 64px); }
        .ijy-hero-reaction { margin-top: 32px; font-size: 19px; }
        .ijy-tabs { margin-top: 64px; }
        .ijy-thumb { width: 80px; height: 80px; }
        .ijy-thumb-emoji { font-size: 40px; }
        .ijy-row { gap: 16px; min-height: 96px; padding: 12px 0; }
        .ijy-row-name { font-size: 16px; }
        .ijy-row-price { font-size: 15px; }
        .ijy-qty-btn { width: 44px; height: 44px; font-size: 22px; }
        .ijy-qty-count { min-width: 44px; font-size: 17px; }
        .ijy-row-controls { gap: 8px; }
        .ijy-mobile-settle { display: none; }
        @keyframes ijyToastIn {
          0% { opacity: 0; transform: translate(-50%, 10px) scale(0.96); }
          18% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .ijy-purchase-toast { animation: ijyToastIn 0.22s ease-out; }

        @media (max-width: 640px) {
          .ijy-ad-wrap { padding: 16px 12px 0; }
          .ijy-shell { padding: 12px 14px 96px; }
          .ijy-breadcrumb { font-size: 13px; letter-spacing: 0.2em; }
          .ijy-hero { margin-top: 36px; margin-bottom: 24px; }
          .ijy-hero-label { font-size: 13px; letter-spacing: 0.2em; margin-bottom: 14px; }
          .ijy-hero-number { gap: 10px; }
          .ijy-hero-value { font-size: clamp(56px, 16vw, 96px); }
          .ijy-hero-unit { font-size: clamp(26px, 7vw, 40px); }
          .ijy-hero-reaction { margin-top: 20px; font-size: 15px; }
          .ijy-tabs { margin-top: 36px; }
          .ijy-thumb { width: 60px; height: 60px; border-radius: 10px; }
          .ijy-thumb-emoji { font-size: 28px; }
          .ijy-row { gap: 12px; min-height: 80px; padding: 10px 0; }
          .ijy-row-name { font-size: 15px; }
          .ijy-row-price { font-size: 13px; }
          .ijy-qty-btn { width: 38px; height: 38px; font-size: 20px; }
          .ijy-qty-count { min-width: 32px; font-size: 15px; }
          .ijy-row-controls { gap: 4px; }
          .ijy-mobile-settle {
            display: inline-flex;
            position: fixed;
            left: 14px;
            right: 14px;
            bottom: calc(env(safe-area-inset-bottom, 0px) + 82px);
            z-index: 70;
            min-height: 50px;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 999px;
            background: ${COLOR.buttonBg};
            color: ${COLOR.buttonText};
            font-weight: 900;
            box-shadow: 0 18px 38px -22px rgba(20,17,14,0.55);
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .ijy-shell { padding: 16px 20px 80px; }
          .ijy-hero { margin-top: 56px; }
          .ijy-hero-value { font-size: clamp(72px, 12vw, 128px); }
          .ijy-hero-unit { font-size: clamp(32px, 5vw, 52px); }
        }
      `}</style>
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

      <div className="ijy-ad-wrap mx-auto" style={{ maxWidth: 1000 }}>
        <AdTop />
      </div>

      <div className="ijy-shell mx-auto" style={{ maxWidth: 760 }}>
        {/* Tiny breadcrumb */}
        <div
          className="ijy-breadcrumb text-center"
          style={{
            color: COLOR.muted,
            fontWeight: 500,
            opacity: 0.6,
          }}
        >
          {t("이재용 · 30조원", "Lee Jae-yong · ₩30T")}
        </div>

        {/* Big balance — dominant top hero so the scale of 30조 lands. */}
        <div className="ijy-hero text-center">
          <div
            className="ijy-hero-label"
            style={{
              color: COLOR.muted,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t("남은 돈", "Remaining")}
          </div>
          <div
            key={bumpKey}
            className="ijy-hero-number number-bump tabular-nums"
            style={{
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
              color: COLOR.ink,
              fontFamily: "var(--font-inter), var(--font-noto-sans-kr)",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <span className="ijy-hero-value">{balance.value}</span>
            <span
              className="ijy-hero-unit"
              style={{
                fontWeight: 700,
                color: COLOR.accent,
                letterSpacing: 0,
              }}
            >
              {balance.unit}
            </span>
          </div>
          <div
            className="ijy-hero-reaction"
            style={{
              color: COLOR.muted,
              letterSpacing: "0.02em",
            }}
          >
            {reaction}
          </div>
          <div
            className="ijy-guide"
            style={{
              margin: "22px auto 0",
              maxWidth: 560,
              display: "grid",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {[t("1. 사고 싶은 걸 누르기", "1. Tap what you want"), t("2. 돈이 줄어드는지 보기", "2. Watch the money shrink"), t("3. 소비 유형 정산", "3. Get your spending type")].map((item) => (
                <span
                  key={item}
                  style={{
                    border: `1px solid ${COLOR.border}`,
                    borderRadius: 999,
                    padding: "7px 11px",
                    color: COLOR.muted,
                    fontSize: 13,
                    fontWeight: 700,
                    background: COLOR.card,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="btn-press"
              disabled={spent <= 0}
              onClick={() => setShowResult(true)}
              style={{
                justifySelf: "center",
                minHeight: 46,
                border: "none",
                borderRadius: 999,
                background: spent > 0 ? COLOR.buttonBg : COLOR.disabled,
                color: COLOR.buttonText,
                padding: "11px 22px",
                fontWeight: 800,
                cursor: spent > 0 ? "pointer" : "not-allowed",
              }}
            >
              {spent > 0
                ? t("내 소비 유형 보기", "Settle my spending")
                : t("먼저 뭐라도 사보세요", "Buy something first")}
            </button>
          </div>
        </div>

        {resultVisible && spent > 0 && (
          <ResultScreen
            locale={locale}
            currentGameId="ijy"
            eyebrow={t("소비 정산 완료", "Spending settled")}
            title={spendingType.name[locale]}
            score={`${spentDisplay.value}${spentDisplay.unit}`}
            scoreLabel={t("사용", "spent")}
            description={spendingType.line[locale]}
            details={resultDetails}
            shareTitle={t("이재용 돈 다 써봐 결과", "Spend Lee Jae-yong's Money result")}
            shareText={shareText}
            shareUrl="/games/ijy"
            onReplay={restart}
            replayLabel={t("다시 30조 받기", "Get ₩30T again")}
            recommendedIds={["kbti", "password", "circle"]}
            tone="paper"
          />
        )}

        {/* Category tabs */}
        <div
          className="ijy-tabs"
          role="tablist"
          aria-label={t("카테고리", "Categories")}
          style={{
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
                className="ijy-row"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered((h) => (h === item.id ? null : h))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: `1px solid ${COLOR.hairline}`,
                  position: "relative",
                }}
              >
                <ItemThumb item={item} />

                <div
                  className="flex flex-1 flex-col min-w-0"
                  style={{ gap: 4 }}
                  onClick={() => {
                    if (tipText) setHovered((h) => (h === item.id ? null : item.id));
                  }}
                >
                  <span
                    className="ijy-row-name"
                    style={{
                      fontWeight: 500,
                      color: count > 0 ? COLOR.ink : COLOR.ink2,
                      lineHeight: 1.3,
                      wordBreak: "keep-all",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {itemName}
                    {isBlocked && (
                      <span
                        aria-hidden
                        style={{
                          marginLeft: 8,
                          fontSize: 12,
                          color: COLOR.muted,
                          letterSpacing: "0.1em",
                        }}
                      >
                        · {t("판매 불가", "BLOCKED")}
                      </span>
                    )}
                  </span>
                  <span
                    className="ijy-row-price tabular-nums whitespace-nowrap"
                    style={{ color: COLOR.muted }}
                  >
                    {formatPrice(item.price, locale)}
                  </span>
                </div>

                <div className="ijy-row-controls flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    disabled={decDisabled}
                    aria-label={t("감소", "Decrease")}
                    className="ijy-qty-btn btn-press"
                    style={{
                      borderRadius: "50%",
                      border: "none",
                      background: decDisabled ? COLOR.disabled : COLOR.buttonBg,
                      color: COLOR.buttonText,
                      fontWeight: 500,
                      lineHeight: 1,
                      cursor: decDisabled ? "not-allowed" : "pointer",
                      transition: "background 0.15s ease, transform 0.1s ease",
                    }}
                  >
                    −
                  </button>
                  <span
                    className="ijy-qty-count tabular-nums text-center"
                    style={{
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
                    className="ijy-qty-btn btn-press"
                    style={{
                      borderRadius: "50%",
                      border: "none",
                      background: cantAfford
                        ? COLOR.disabled
                        : isBlocked
                        ? COLOR.accent
                        : COLOR.buttonBg,
                      color: COLOR.buttonText,
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
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)",
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

      {lastBuy && (
        <div
          role="status"
          aria-live="polite"
          className="ijy-purchase-toast"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 150px)",
            transform: "translateX(-50%)",
            zIndex: 75,
            background: COLOR.card,
            border: `1px solid ${COLOR.border}`,
            color: COLOR.ink,
            padding: "10px 14px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 800,
            maxWidth: "92vw",
            textAlign: "center",
            boxShadow: "0 18px 40px -24px rgba(20,17,14,0.55)",
          }}
        >
          {t(
            `${lastBuy.item.ko} ${lastBuy.count.toLocaleString("ko-KR")}개째 결제 완료`,
            `${lastBuy.item.en} x${lastBuy.count.toLocaleString("en-US")} purchased`,
          )}
        </div>
      )}

      {spent > 0 && !resultVisible && (
        <button type="button" className="ijy-mobile-settle btn-press" onClick={() => setShowResult(true)}>
          {t(`${spentDisplay.value}${spentDisplay.unit} 사용 · 소비 유형 보기`, `${spentDisplay.value} ${spentDisplay.unit} spent · See type`)}
        </button>
      )}

      <div className="mx-auto max-w-3xl px-6" style={{ paddingBottom: 80 }}>
        <AdBottom />
      </div>
      <AdMobileSticky />
    </main>
  );
}
