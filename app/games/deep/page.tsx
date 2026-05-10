"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";

const CATEGORY_EN: Record<string, string> = {
  "햇빛대": "Sunlight Zone",
  "중층대": "Twilight Zone",
  "심해대": "Midnight Zone",
  "초심해대": "Abyssal Zone",
  "해구대": "Hadal Zone",
};

// ============================================================
// Types
// ============================================================

type Category = "햇빛대" | "중층대" | "심해대" | "초심해대" | "해구대";

type CreatureKind =
  | "whale"
  | "shark"
  | "turtle"
  | "fish"
  | "ray"
  | "jelly"
  | "octopus"
  | "anglerfish"
  | "small"
  | "static";

type ArtId =
  | "fish"
  | "whale"
  | "shark"
  | "turtle"
  | "ray"
  | "jelly"
  | "octopus"
  | "anglerfish"
  | "squid"
  | "marlin"
  | "seahorse"
  | "isopod"
  | "starfish"
  | "shrimp"
  | "wormtube"
  | "cell"
  | "vent"
  | "wreck"
  | "dot";

type Stop = {
  depth: number; // negative; 0 at the surface
  category: Category;
  title: string;
  english?: string;
  body: string[];
  reaction?: string;
  photoUrl?: string; // file under /sea/
  artId?: ArtId;
  kind?: CreatureKind;
  isEvent?: boolean;
  redFish?: boolean;
  zoneIntro?: string; // shown above depthLabel for first stop of a zone
};

// ============================================================
// Stops data
// ============================================================

const STOPS: Stop[] = [
  { depth: 0, category: "햇빛대", title: "수면", english: "Surface", body: ["지구 해양 탐험을 시작합니다", "햇빛이 가득한 표층"], isEvent: true },

  { depth: -5, category: "햇빛대", title: "산호초", english: "Coral Reef", body: ["바다의 우림이라 불립니다", "지구 해양생물의 25%가 여기 삽니다"], photoUrl: "coral.jpg", artId: "fish", kind: "static" },
  { depth: -10, category: "햇빛대", title: "클라운피쉬", english: "Clownfish", body: ["영화 니모를 찾아서의 주인공", "실제로 성전환을 할 수 있습니다"], photoUrl: "clownfish.jpg", artId: "fish", kind: "fish" },
  { depth: -15, category: "햇빛대", title: "블루탱", english: "Blue Tang", body: ["영화 니모를 찾아서의 도리", "꼬리에 칼 같은 가시가 있습니다"], photoUrl: "blue-tang.jpg", artId: "fish", kind: "fish" },
  { depth: -20, category: "햇빛대", title: "만타가오리", english: "Manta Ray", body: ["날개 폭 7m까지 자랍니다", "거울로 자신을 인식할 수 있습니다"], photoUrl: "manta.jpg", artId: "ray", kind: "ray" },
  { depth: -25, category: "햇빛대", title: "갯민숭달팽이", english: "Nudibranch", body: ["바다의 보석이라 불립니다", "독을 먹어 자기 방어로 사용합니다"], reaction: "아름다움 ✨", photoUrl: "nudibranch.jpg", artId: "starfish", kind: "small" },
  { depth: -30, category: "햇빛대", title: "바다거북", english: "Sea Turtle", body: ["최대 150년을 삽니다", "알을 낳으러 태어난 해변으로 돌아옵니다"], photoUrl: "turtle.jpg", artId: "turtle", kind: "turtle" },
  { depth: -35, category: "햇빛대", title: "해마", english: "Seahorse", body: ["수컷이 임신하고 출산합니다", "꼬리로 해초를 잡고 떠다닙니다"], photoUrl: "seahorse.jpg", artId: "seahorse", kind: "small" },
  { depth: -40, category: "햇빛대", title: "대왕조개", english: "Giant Clam", body: ["1.4m까지 자랍니다", "100년 이상 한 자리에 머뭅니다"], photoUrl: "giant-clam.jpg", artId: "wormtube", kind: "static" },
  { depth: -45, category: "햇빛대", title: "나폴레옹피쉬", english: "Napoleon Wrasse", body: ["멸종위기종 / 2m까지 자랍니다", "이마에 돌출된 혹이 있습니다"], photoUrl: "napoleon.jpg", artId: "fish", kind: "fish" },
  { depth: -50, category: "햇빛대", title: "바라쿠다", english: "Barracuda", body: ["시속 60km로 헤엄칩니다", "이빨이 면도날처럼 날카롭습니다"], reaction: "무서움", photoUrl: "barracuda.jpg", artId: "fish", kind: "fish" },

  { depth: -60, category: "햇빛대", title: "혹등고래", english: "Humpback Whale", body: ["노래로 수백km 떨어진 고래와 소통합니다", "점프할 때 몸 전체가 물 밖으로 나옵니다"], reaction: "귀여움 🐋", photoUrl: "whale.jpg", artId: "whale", kind: "whale" },
  { depth: -70, category: "햇빛대", title: "돌고래", english: "Dolphin", body: ["인간 다음으로 지능이 높습니다", "잠을 잘 때 뇌의 절반만 잡니다"], photoUrl: "dolphin.jpg", artId: "fish", kind: "fish" },
  { depth: -80, category: "햇빛대", title: "청새치", english: "Blue Marlin", body: ["시속 130km. 지구에서 가장 빠른 물고기", "부리로 먹이를 기절시킵니다"], reaction: "소름 🔵", photoUrl: "marlin.jpg", artId: "marlin", kind: "fish" },
  { depth: -90, category: "햇빛대", title: "돛새치", english: "Sailfish", body: ["전류처럼 색이 변합니다", "등지느러미가 돛처럼 큽니다"], photoUrl: "sailfish.jpg", artId: "marlin", kind: "fish" },
  { depth: -100, category: "햇빛대", title: "참다랑어", english: "Bluefin Tuna", body: ["시속 80km로 헤엄칩니다", "한 마리 가격이 수십억까지 갑니다"], photoUrl: "tuna.jpg", artId: "fish", kind: "fish" },
  { depth: -110, category: "햇빛대", title: "청상아리", english: "Mako Shark", body: ["가장 빠른 상어, 시속 74km", "온혈동물에 가까운 체온 유지"], photoUrl: "mako.jpg", artId: "shark", kind: "shark" },
  { depth: -120, category: "햇빛대", title: "백상아리", english: "Great White Shark", body: ["조스의 모델 / 길이 6m까지 자랍니다", "한 입에 100kg을 뜯어냅니다"], reaction: "공포 🦈", photoUrl: "shark.jpg", artId: "shark", kind: "shark" },
  { depth: -130, category: "햇빛대", title: "귀상어", english: "Hammerhead Shark", body: ["360도 시야를 가집니다", "전자기장으로 숨은 먹이를 찾습니다"], photoUrl: "hammerhead.jpg", artId: "shark", kind: "shark" },
  { depth: -140, category: "햇빛대", title: "범고래", english: "Orca", body: ["바다 최상위 포식자", "가족 단위로 사냥합니다", "백상아리도 사냥합니다"], reaction: "경이로움", photoUrl: "orca.jpg", artId: "whale", kind: "whale" },
  { depth: -150, category: "햇빛대", title: "돌묵상어", english: "Basking Shark", body: ["두번째로 큰 상어, 12m", "플랑크톤만 먹는 순한 상어"], photoUrl: "basking-shark.jpg", artId: "shark", kind: "shark" },
  { depth: -160, category: "햇빛대", title: "문어", english: "Octopus", body: ["세 개의 심장을 가집니다", "혈액이 파란색입니다", "팔마다 독립적으로 생각할 수 있습니다"], reaction: "소름 🐙", photoUrl: "octopus.jpg", artId: "octopus", kind: "octopus" },
  { depth: -170, category: "햇빛대", title: "오징어", english: "Common Squid", body: ["10개의 팔이 있습니다", "위협받으면 먹물을 내뿜습니다"], photoUrl: "squid.jpg", artId: "squid", kind: "small" },
  { depth: -180, category: "햇빛대", title: "전기가오리", english: "Electric Ray", body: ["220볼트 전기를 만듭니다", "사람을 기절시킬 수 있습니다"], reaction: "위험 ⚡", photoUrl: "electric-ray.jpg", artId: "ray", kind: "ray" },
  { depth: -190, category: "햇빛대", title: "투구게", english: "Horseshoe Crab", body: ["4억 5천만 년 전부터 살아왔습니다", "공룡보다 오래된 살아있는 화석"], reaction: "역사 그 자체", photoUrl: "horseshoe-crab.jpg", artId: "isopod", kind: "small" },

  { depth: -200, category: "햇빛대", title: "빛의 마지막 경계", english: "Twilight Zone", body: ["여기서부터 태양빛이 닿지 않습니다"], isEvent: true },

  { depth: -250, category: "중층대", title: "향유고래", english: "Sperm Whale", body: ["세계 최대의 이빨 포식자", "뇌 무게 9kg. 지구 최대의 뇌", "심해 대왕오징어와 싸웁니다"], reaction: "경이로움", photoUrl: "whale.jpg", artId: "whale", kind: "whale" },
  { depth: -300, category: "중층대", title: "유리오징어", english: "Glass Squid", body: ["몸이 완전히 투명합니다", "내장이 그대로 보여요"], reaction: "소름 + 귀여움", photoUrl: "glass-squid.jpg", artId: "squid", kind: "small" },
  { depth: -350, category: "중층대", title: "산갈치", english: "Oarfish", body: ["길이 11m. 가장 긴 경골어류", "용으로 오해받았던 신비의 물고기"], reaction: "신비로움", photoUrl: "oarfish.jpg", artId: "fish", kind: "fish" },
  { depth: -400, category: "중층대", title: "검은 용고기", english: "Black Dragonfish", body: ["자신의 빛으로 먹이를 유인합니다", "이빨이 너무 커서 입을 다물 수 없습니다"], reaction: "무서움 😱", photoUrl: "dragonfish.jpg", artId: "fish", kind: "fish" },
  { depth: -450, category: "중층대", title: "실러캔스", english: "Coelacanth", body: ["4억 년 전부터 살아온 살아있는 화석", "1938년까지 멸종한 줄 알았던 물고기"], reaction: "역사 그 자체", photoUrl: "coelacanth.jpg", artId: "fish", kind: "fish" },
  { depth: -500, category: "중층대", title: "키메라", english: "Chimaera", body: ["상어의 사촌, 4억 년 전부터 존재", "유령 상어라고도 불립니다"], photoUrl: "chimera.jpg", artId: "shark", kind: "shark" },
  { depth: -550, category: "중층대", title: "풍선장어", english: "Gulper Eel", body: ["입이 몸의 1/3을 차지합니다", "자기 몸보다 큰 먹이도 삼킵니다"], reaction: "소름", photoUrl: "gulper-eel.jpg", artId: "fish", kind: "small" },
  { depth: -600, category: "중층대", title: "초롱아귀 (암컷)", english: "Anglerfish", body: ["머리의 빛으로 먹이를 유인", "수컷은 암컷 몸에 붙어 기생합니다", "수컷은 결국 암컷의 일부가 됩니다"], reaction: "충격 😨", photoUrl: "anglerfish.jpg", artId: "anglerfish", kind: "anglerfish" },
  { depth: -650, category: "중층대", title: "검은 삼키개", english: "Black Swallower", body: ["자기 몸보다 10배 큰 먹이도 삼킵니다", "위가 풍선처럼 늘어납니다"], reaction: "기괴함", photoUrl: "black-swallower.jpg", artId: "fish", kind: "small" },
  { depth: -700, category: "중층대", title: "배럴아이", english: "Barreleye", body: ["머리가 완전히 투명합니다", "눈이 위를 향해 회전합니다", "1938년까지 존재가 알려지지 않았습니다"], reaction: "외계생물 같음 👽", photoUrl: "barreleye.jpg", artId: "fish", kind: "small" },
  { depth: -800, category: "중층대", title: "빗해파리", english: "Comb Jelly", body: ["뇌도 심장도 없습니다", "무지개빛으로 반짝입니다", "지구에서 가장 오래된 동물 중 하나"], reaction: "아름다움 ✨", photoUrl: "comb-jellyfish.jpg", artId: "jelly", kind: "jelly" },
  { depth: -900, category: "중층대", title: "거대 등각류", english: "Giant Isopod", body: ["초대형 쥐며느리처럼 생겼습니다", "길이 최대 76cm", "5년 동안 굶어도 삽니다"], reaction: "소름 🦑", photoUrl: "giant-isopod.jpg", artId: "isopod", kind: "small" },

  { depth: -1000, category: "중층대", title: "일반 잠수함 한계", english: "Submarine Limit", body: ["여기서부터 일반 잠수함도 못 내려갑니다"], isEvent: true },

  { depth: -1200, category: "심해대", title: "대왕오징어", english: "Giant Squid", body: ["눈이 농구공 크기입니다", "실존하지만 거의 포착된 적 없습니다"], reaction: "실존하는 게 믿기지 않음", photoUrl: "giant-squid.jpg", artId: "squid", kind: "small" },
  { depth: -1500, category: "심해대", title: "흡혈오징어", english: "Vampire Squid", body: ["이름과 달리 피를 빨지 않습니다", "위협받으면 몸을 뒤집어 가시를 드러냅니다"], reaction: "귀여움 🦑", photoUrl: "vampire-squid.jpg", artId: "squid", kind: "small" },
  { depth: -1800, category: "심해대", title: "돼지오징어", english: "Piglet Squid", body: ["돼지처럼 동그란 모양", "표정처럼 생긴 무늬가 있습니다"], reaction: "귀여움 🐷", photoUrl: "piglet-squid.jpg", artId: "squid", kind: "small" },

  { depth: -2000, category: "심해대", title: "완전한 어둠", english: "Total Darkness", body: ["해양 생물의 76%가 스스로 빛을 냅니다"], isEvent: true },

  { depth: -2200, category: "심해대", title: "Deepstaria 해파리", english: "Deepstaria", body: ["거대한 비닐봉지처럼 생긴 해파리", "먹이를 감싸 잡습니다"], reaction: "기괴함", photoUrl: "deepstaria.jpg", artId: "jelly", kind: "jelly" },
  { depth: -2500, category: "심해대", title: "덤보 문어", english: "Dumbo Octopus", body: ["귀처럼 생긴 지느러미로 헤엄칩니다", "역대 가장 깊은 곳에서 발견된 문어", "너무 귀여워서 이름이 덤보예요 🥰"], reaction: "역대급 귀여움 🐙❤️", photoUrl: "dumbo-octopus.jpg", artId: "octopus", kind: "octopus", redFish: true },
  { depth: -2800, category: "심해대", title: "거대 태평양 문어", english: "Giant Pacific Octopus", body: ["8m까지 자랍니다", "지구 최대의 문어 / 4년만 삽니다"], photoUrl: "giant-octopus.jpg", artId: "octopus", kind: "octopus", redFish: true },
  { depth: -3000, category: "심해대", title: "심해 해마", english: "Deep Seahorse", body: ["수컷이 임신하고 출산합니다", "지구 유일의 수컷 출산 척추동물"], reaction: "충격", photoUrl: "seahorse-deep.jpg", artId: "seahorse", kind: "small", redFish: true },
  { depth: -3500, category: "심해대", title: "열수분출공", english: "Hydrothermal Vent", body: ["영하 200도 우주에서도 살 수 있는 생물들이 삽니다", "태양 없이 화학에너지로만 살아갑니다", "외계 생명체가 있다면 이런 모습일 것입니다"], reaction: "외계 느낌 🌋", photoUrl: "hydrothermal.jpg", artId: "vent", kind: "static" },
  { depth: -3800, category: "심해대", title: "타이타닉", english: "RMS Titanic", body: ["1912년 이후 여기 잠들어 있습니다", "2031년이면 완전히 부식됩니다"], reaction: "숙연함", photoUrl: "titanic.jpg", artId: "wreck", kind: "static" },

  { depth: -4000, category: "초심해대", title: "심해 해삼", english: "Sea Cucumber", body: ["해저의 80%를 덮고 있습니다", "위협받으면 내장을 뱉습니다 (나중에 재생됩니다)"], reaction: "소름 + 신기함", photoUrl: "sea-cucumber.jpg", artId: "starfish", kind: "small", redFish: true },
  { depth: -4200, category: "초심해대", title: "심해 산호", english: "Deep-Sea Coral", body: ["햇빛 없이 수천 년을 삽니다", "가장 오래된 산호는 4,000살"], photoUrl: "deep-coral.jpg", artId: "wormtube", kind: "static" },
  { depth: -4500, category: "초심해대", title: "스네일피쉬", english: "Snailfish", body: ["이 깊이에서 발견된 가장 깊은 물고기", "뼈가 물렁물렁해서 수압을 견딥니다"], reaction: "신기함", photoUrl: "snailfish.jpg", artId: "fish", kind: "small" },
  { depth: -4800, category: "초심해대", title: "일본 거미게", english: "Japanese Spider Crab", body: ["다리 길이 4m. 세계 최대의 게", "100년 이상 산다고 알려져 있습니다"], reaction: "소름", photoUrl: "spider-crab.jpg", artId: "shrimp", kind: "small", redFish: true },
  { depth: -5000, category: "초심해대", title: "심해 불가사리", english: "Deep-Sea Starfish", body: ["햇빛 없이도 빛을 만들어냅니다"], photoUrl: "starfish.jpg", artId: "starfish", kind: "small", redFish: true },

  { depth: -5500, category: "초심해대", title: "에베레스트 기준선", english: "Everest Mark", body: ["에베레스트(8,848m)를 여기 놓으면 완전히 잠깁니다"], reaction: "스케일 충격", isEvent: true },
  { depth: -6000, category: "초심해대", title: "초심해대", english: "Hadal Zone", body: ["지구 해양의 1%만이 이보다 깊습니다", "여기서도 플라스틱이 발견됐습니다"], reaction: "씁쓸함", isEvent: true },

  { depth: -6500, category: "해구대", title: "심해 단각류", english: "Amphipoda", body: ["새우처럼 생겼지만 30cm", "위에서 플라스틱이 발견됐습니다"], photoUrl: "amphipoda.jpg", artId: "shrimp", kind: "small" },
  { depth: -7000, category: "해구대", title: "달팽이고기", english: "Mariana Snailfish", body: ["현재 가장 깊은 곳에서 발견된 물고기", "몸이 젤리처럼 투명합니다"], reaction: "신기함 + 귀여움", photoUrl: "snailfish.jpg", artId: "fish", kind: "small" },

  { depth: -7500, category: "해구대", title: "인류 첫 심해 잠수 (1960)", english: "First Human Descent", body: ["돈 월시와 자크 피카르", "달에 간 사람보다 여기 온 사람이 적습니다"], isEvent: true },
  { depth: -10000, category: "해구대", title: "거의 도착", english: "Almost There", body: ["우주보다 덜 탐험된 곳입니다"], isEvent: true },
  { depth: -10935, category: "해구대", title: "챌린저 딥", english: "Challenger Deep", body: ["당신은 지구에서 가장 깊은 곳에 왔습니다", "수압 1,086기압", "여기서도 박테리아와 단각류가 삽니다", "인류가 달에 간 것보다 여기 온 사람이 적습니다"], isEvent: true },
];

// ============================================================
// Visual sizing per kind
// ============================================================

const KIND_STYLE: Record<CreatureKind, { size: number; anim: string }> = {
  whale: { size: 360, anim: "swim 6s ease-in-out infinite" },
  shark: { size: 280, anim: "swim 2.5s ease-in-out infinite" },
  turtle: { size: 200, anim: "swim 8s ease-in-out infinite" },
  fish: { size: 200, anim: "swim 3s ease-in-out infinite" },
  ray: { size: 240, anim: "float 5s ease-in-out infinite" },
  jelly: { size: 160, anim: "float 4s ease-in-out infinite" },
  octopus: {
    size: 200,
    anim: "float 5s ease-in-out infinite, swim 7s ease-in-out infinite",
  },
  anglerfish: { size: 160, anim: "float 6s ease-in-out infinite" },
  small: { size: 140, anim: "swim 4s ease-in-out infinite" },
  static: { size: 320, anim: "none" },
};

// ============================================================
// Background zones — depth-banded gradients
// ============================================================

type Zone = { upTo: number; c1: string; c2: string };

const ZONES: Zone[] = [
  { upTo: 50, c1: "#00b4d8", c2: "#0096c7" },
  { upTo: 200, c1: "#0096c7", c2: "#0077b6" },
  { upTo: 500, c1: "#0077b6", c2: "#023e8a" },
  { upTo: 1000, c1: "#023e8a", c2: "#03045e" },
  { upTo: 3000, c1: "#03045e", c2: "#010127" },
  { upTo: 6000, c1: "#010127", c2: "#000814" },
  { upTo: 11000, c1: "#000000", c2: "#000000" },
];

function zoneGradient(depthPositive: number): string {
  for (const z of ZONES) {
    if (depthPositive <= z.upTo) {
      return `linear-gradient(180deg, ${z.c1} 0%, ${z.c2} 100%)`;
    }
  }
  return "#000000";
}

function depthFromProgress(progress: number): number {
  // Slot-based depth interpolation: each STOPS entry occupies one slot.
  // Linearly interpolates between adjacent stops as the user scrolls.
  const slotF = progress * (STOPS.length - 1);
  const i0 = Math.min(STOPS.length - 1, Math.max(0, Math.floor(slotF)));
  const i1 = Math.min(STOPS.length - 1, i0 + 1);
  const t = slotF - i0;
  const d0 = Math.abs(STOPS[i0].depth);
  const d1 = Math.abs(STOPS[i1].depth);
  return d0 + (d1 - d0) * t;
}

// ============================================================
// SVG fallback art
// ============================================================

type ArtProps = { artId?: ArtId; kind: CreatureKind };

function SvgFallback({ artId, kind }: ArtProps): ReactElement {
  const ks = KIND_STYLE[kind];
  const id = artId ?? "dot";
  const size = ks.size;
  return (
    <div
      style={{
        width: size,
        maxWidth: "100%",
        filter: "drop-shadow(0 0 15px rgba(100, 200, 255, 0.3))",
        animation: ks.anim,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {renderArt(id)}
      </svg>
    </div>
  );
}

function renderArt(id: ArtId): ReactElement {
  switch (id) {
    case "whale":
      return (
        <g fill="#dbe9f5" stroke="rgba(255,255,255,0.25)">
          <ellipse cx="105" cy="105" rx="78" ry="28" />
          <path d="M30 105 L8 90 L8 120 Z" />
          <circle cx="150" cy="100" r="3" fill="#0b1a2c" />
        </g>
      );
    case "shark":
      return (
        <g fill="#c8d6e1" stroke="rgba(255,255,255,0.25)">
          <path d="M20 110 Q90 70 170 105 Q90 130 20 110 Z" />
          <path d="M95 75 L100 50 L120 90 Z" />
          <path d="M170 105 L195 90 L195 120 Z" />
          <circle cx="155" cy="100" r="2" fill="#0b1a2c" />
        </g>
      );
    case "turtle":
      return (
        <g fill="#9ec3a8" stroke="rgba(255,255,255,0.25)">
          <ellipse cx="100" cy="105" rx="55" ry="40" />
          <circle cx="155" cy="100" r="14" />
          <ellipse cx="55" cy="80" rx="18" ry="9" />
          <ellipse cx="55" cy="130" rx="18" ry="9" />
          <ellipse cx="148" cy="80" rx="14" ry="8" />
          <ellipse cx="148" cy="130" rx="14" ry="8" />
        </g>
      );
    case "ray":
      return (
        <g fill="#b8c8d8" stroke="rgba(255,255,255,0.25)">
          <path d="M100 60 Q40 100 100 140 Q160 100 100 60 Z" />
          <path d="M100 140 L110 180 L96 180 Z" />
        </g>
      );
    case "jelly":
      return (
        <g fill="rgba(220,200,255,0.6)" stroke="rgba(255,255,255,0.4)">
          <path d="M55 95 Q100 30 145 95 L140 110 L60 110 Z" />
          <path
            d="M70 110 Q72 160 65 180 M90 110 Q92 165 86 185 M110 110 Q108 165 114 185 M130 110 Q128 160 135 180"
            fill="none"
          />
        </g>
      );
    case "octopus":
      return (
        <g fill="#e6a4c4" stroke="rgba(255,255,255,0.3)">
          <ellipse cx="100" cy="80" rx="42" ry="36" />
          <circle cx="88" cy="78" r="4" fill="#0b1a2c" />
          <circle cx="112" cy="78" r="4" fill="#0b1a2c" />
          <path
            d="M70 110 Q60 160 50 180 M85 115 Q80 170 75 185 M100 115 Q100 175 100 190 M115 115 Q120 170 125 185 M130 110 Q140 160 150 180"
            stroke="#e6a4c4"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    case "anglerfish":
      return (
        <g fill="#3a4a5a" stroke="rgba(255,255,255,0.25)">
          <ellipse cx="105" cy="110" rx="55" ry="32" />
          <path d="M55 110 L25 95 L35 130 Z" />
          <path d="M120 95 L122 65 Q125 60 130 60" stroke="#fff" fill="none" />
          <circle cx="130" cy="58" r="6" fill="#fffbb0" />
          <path
            d="M95 115 L100 125 L108 115 L113 128 L120 115"
            stroke="#fff"
            fill="none"
          />
          <circle cx="130" cy="105" r="3" fill="#fff" />
        </g>
      );
    case "squid":
      return (
        <g fill="rgba(255,200,220,0.7)" stroke="rgba(255,255,255,0.3)">
          <path d="M100 30 L70 110 L130 110 Z" />
          <path
            d="M75 115 L72 175 M88 115 L85 180 M100 115 L100 185 M112 115 L115 180 M125 115 L128 175"
            stroke="rgba(255,200,220,0.7)"
            strokeWidth="4"
            fill="none"
          />
          <circle cx="92" cy="80" r="3" fill="#0b1a2c" />
          <circle cx="108" cy="80" r="3" fill="#0b1a2c" />
        </g>
      );
    case "marlin":
      return (
        <g fill="#3b6f9d" stroke="rgba(255,255,255,0.25)">
          <path d="M40 105 Q100 75 165 105 Q100 130 40 105 Z" />
          <path d="M165 105 L195 95 L195 115 Z" />
          <path d="M40 105 L0 100 L20 110 Z" />
          <circle cx="150" cy="100" r="2" fill="#fff" />
        </g>
      );
    case "seahorse":
      return (
        <g fill="#d2c08a" stroke="rgba(255,255,255,0.25)">
          <path d="M100 30 Q130 50 120 80 Q90 90 100 130 Q120 160 95 180" fill="none" strokeWidth="14" stroke="#d2c08a" strokeLinecap="round" />
          <circle cx="115" cy="40" r="2" fill="#0b1a2c" />
        </g>
      );
    case "isopod":
      return (
        <g fill="#8a7560" stroke="rgba(255,255,255,0.25)">
          <ellipse cx="100" cy="105" rx="60" ry="35" />
          <path
            d="M50 90 L150 90 M50 105 L150 105 M50 120 L150 120"
            stroke="rgba(0,0,0,0.4)"
          />
        </g>
      );
    case "starfish":
      return (
        <g fill="#d68b6c" stroke="rgba(255,255,255,0.25)">
          <path d="M100 30 L120 90 L180 90 L130 125 L150 185 L100 145 L50 185 L70 125 L20 90 L80 90 Z" />
        </g>
      );
    case "shrimp":
      return (
        <g fill="#f0a08c" stroke="rgba(255,255,255,0.25)">
          <path d="M40 110 Q100 70 160 110 Q150 130 110 130 Q70 130 40 110 Z" />
          <path d="M160 110 L185 95 L180 130 Z" />
          <circle cx="150" cy="105" r="2" fill="#0b1a2c" />
        </g>
      );
    case "wormtube":
      return (
        <g fill="#c25c5c" stroke="rgba(255,255,255,0.25)">
          <rect x="80" y="100" width="40" height="80" fill="#deb887" />
          <ellipse cx="100" cy="100" rx="20" ry="10" fill="#c25c5c" />
          <path d="M85 90 Q90 60 95 88 M100 88 Q105 50 110 86 M115 90 Q118 65 120 88" stroke="#c25c5c" strokeWidth="3" fill="none" />
        </g>
      );
    case "cell":
      return (
        <g fill="rgba(220,220,180,0.5)" stroke="rgba(255,255,255,0.4)">
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="20" fill="rgba(255,255,255,0.3)" />
          <circle cx="80" cy="80" r="6" fill="rgba(255,255,255,0.4)" />
          <circle cx="125" cy="115" r="5" fill="rgba(255,255,255,0.4)" />
        </g>
      );
    case "vent":
      return (
        <g>
          <rect x="60" y="120" width="80" height="60" fill="#3a2a25" />
          <path
            d="M75 120 Q70 60 80 30 M100 120 Q95 50 105 20 M125 120 Q130 70 120 40"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="14"
            fill="none"
          />
        </g>
      );
    case "wreck":
      return (
        <g fill="#5a4a3a" stroke="rgba(255,255,255,0.2)">
          <path d="M30 150 Q100 110 170 150 L160 175 L40 175 Z" />
          <rect x="80" y="120" width="40" height="20" />
          <line x1="100" y1="80" x2="100" y2="120" stroke="#5a4a3a" strokeWidth="3" />
        </g>
      );
    case "fish":
      return (
        <g fill="#9bb3c6" stroke="rgba(255,255,255,0.25)">
          <ellipse cx="100" cy="105" rx="55" ry="22" />
          <path d="M45 105 L20 90 L20 120 Z" />
          <circle cx="135" cy="100" r="2" fill="#0b1a2c" />
        </g>
      );
    case "dot":
    default:
      return (
        <g>
          <circle cx="100" cy="100" r="40" fill="rgba(255,255,255,0.15)" />
          <circle cx="100" cy="100" r="14" fill="rgba(255,255,255,0.55)" />
        </g>
      );
  }
}

// ============================================================
// PhotoOrFallback — two-level image fallback chain (JPG → SVG)
// ============================================================

type PhotoProps = {
  stop: Stop;
  kind: CreatureKind;
  visible: boolean;
};

function PhotoOrFallback({ stop, kind, visible }: PhotoProps): ReactElement {
  const [failed, setFailed] = useState(false);
  const ks = KIND_STYLE[kind];

  const wrapperStyle = {
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(120px)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 8,
  };

  if (!stop.photoUrl || failed) {
    return (
      <div style={wrapperStyle}>
        <SvgFallback artId={stop.artId} kind={kind} />
      </div>
    );
  }

  const url = `/sea/${stop.photoUrl}`;
  const deep = stop.depth <= -1000;
  return (
    <div style={wrapperStyle}>
      <div className="creature-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={deep ? "sea-creature deep" : "sea-creature"}
          src={url}
          alt={stop.title}
          loading="lazy"
          onError={() => {
            console.error("[deep] image failed:", stop.photoUrl);
            setFailed(true);
          }}
          style={{ animation: ks.anim }}
        />
      </div>
      <div
        style={{
          fontSize: 8,
          color: "rgba(255,255,255,0.3)",
          textAlign: "center",
          marginTop: 6,
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        © Wikipedia Commons
      </div>
    </div>
  );
}

// ============================================================
// Stop section
// ============================================================

type StopSectionProps = {
  stop: Stop;
  locale: SimpleLocale;
};

function StopSection({ stop, locale }: StopSectionProps): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.4) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasImage = !stop.isEvent && (stop.photoUrl || stop.artId);
  const kind: CreatureKind = stop.kind ?? "small";
  const categoryLabel = locale === "en" ? (CATEGORY_EN[stop.category] ?? stop.category) : stop.category;
  const depthLabel = `${stop.depth}m · ${categoryLabel}`;
  const displayTitle = locale === "en" && stop.english ? stop.english : stop.title;

  const titleStyle = {
    fontSize: stop.isEvent ? 40 : 32,
    fontWeight: 500 as const,
    color: "rgba(255,255,255,0.95)",
    fontFamily: "var(--font-noto-serif-kr), serif",
    letterSpacing: "-0.5px",
    margin: 0,
    lineHeight: 1.2,
  };

  const englishStyle = {
    fontSize: 15,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.1em",
    fontFamily: "var(--font-inter), sans-serif",
    marginTop: 4,
  };

  const depthLabelStyle = {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.15em",
    marginBottom: 8,
    textTransform: "uppercase" as const,
  };

  const bodyLineStyle = {
    fontSize: 17,
    lineHeight: 1.85,
    color: "rgba(255,255,255,0.85)",
    marginTop: 16,
  };

  const reactionStyle = {
    fontSize: 15,
    color: "rgba(255,255,255,0.55)",
    marginTop: 20,
    fontStyle: "italic" as const,
  };

  const redFishStyle = {
    fontSize: 14,
    color: "rgba(255,180,180,0.7)",
    marginTop: 12,
  };

  return (
    <section
      ref={ref}
      style={{
        width: "100%",
        padding: "32px 16px",
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 0.9s ease-out, transform 0.9s ease-out",
      }}
    >
      {hasImage ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <PhotoOrFallback stop={stop} kind={kind} visible={visible} />
        </div>
      ) : null}
      <div style={depthLabelStyle}>{depthLabel}</div>
      <h2 style={titleStyle}>{displayTitle}</h2>
      {locale === "ko" && stop.english ? <div style={englishStyle}>{stop.english}</div> : null}
      {stop.body.map((line, i) => (
        <p key={i} style={bodyLineStyle}>
          {line}
        </p>
      ))}
      {stop.reaction ? (
        <div style={reactionStyle}>— {stop.reaction}</div>
      ) : null}
      {stop.redFish ? (
        <div style={redFishStyle}>
          {locale === "ko"
            ? "💡 빨간색은 이 깊이에서 보이지 않아 위장색입니다"
            : "💡 Red is invisible at this depth — it's camouflage"}
        </div>
      ) : null}
    </section>
  );
}

// ============================================================
// Depth-aware particle canvas
// ============================================================

type Bubble = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };
type Drifter = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };
type Biolum = { x: number; y: number; size: number; phase: number; period: number; color: string };

const BIOLUM_COLORS = ["rgba(0,255,136,1)", "rgba(136,255,255,1)", "rgba(255,255,255,1)"];

function ParticleCanvas({
  depthRef,
}: {
  depthRef: React.MutableRefObject<number>;
}): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Bubbles (0~-200m): 80 white ascending
    const bubbles: Bubble[] = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(0.3 + Math.random() * 1.1),
      size: 2 + Math.random() * 4,
      alpha: 0.3 + Math.random() * 0.3,
    }));

    // Drifters (-200~-1000m): 50 calm blue
    const drifters: Drifter[] = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.15,
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.4,
    }));

    // Bioluminescence (-1000~-6000m): 30 blinking
    const biolums: Biolum[] = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random(),
      phase: Math.random() * Math.PI * 2,
      period: 2000 + Math.random() * 3000,
      color: BIOLUM_COLORS[Math.floor(Math.random() * BIOLUM_COLORS.length)],
    }));

    // Sparse (-6000m+): 10 very faint
    const sparseCount = 10;

    const onResize = () => {
      resize();
      for (const b of bubbles) {
        if (b.x > width) b.x = Math.random() * width;
        if (b.y > height) b.y = Math.random() * height;
      }
      for (const d of drifters) {
        if (d.x > width) d.x = Math.random() * width;
        if (d.y > height) d.y = Math.random() * height;
      }
      for (const bl of biolums) {
        if (bl.x > width) bl.x = Math.random() * width;
        if (bl.y > height) bl.y = Math.random() * height;
      }
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!canvas || !ctx) return;
      const dt = Math.min(48, now - last);
      last = now;
      const depth = depthRef.current; // positive

      ctx.clearRect(0, 0, width, height);

      // Mode weights — soft crossfade between zones
      const wBubble = clamp(1 - smooth(depth, 100, 250), 0, 1);
      const wDrift = clamp(smooth(depth, 100, 250), 0, 1) * clamp(1 - smooth(depth, 800, 1100), 0, 1);
      const wBiolum = clamp(smooth(depth, 800, 1100), 0, 1) * clamp(1 - smooth(depth, 5500, 6200), 0, 1);
      const wSparse = clamp(smooth(depth, 5500, 6200), 0, 1);

      // Bubbles
      if (wBubble > 0.02) {
        for (const b of bubbles) {
          b.x += b.vx * (dt / 16);
          b.y += b.vy * (dt / 16);
          if (b.y < -10) {
            b.y = height + 10;
            b.x = Math.random() * width;
          }
          if (b.x < -8) b.x = width + 8;
          if (b.x > width + 8) b.x = -8;
          ctx.globalAlpha = b.alpha * wBubble;
          ctx.fillStyle = "rgba(255,255,255,1)";
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fill();
          // bubble outline
          ctx.globalAlpha = b.alpha * 0.4 * wBubble;
          ctx.strokeStyle = "rgba(255,255,255,1)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Drifters
      if (wDrift > 0.02) {
        for (const d of drifters) {
          d.x += d.vx * (dt / 16);
          d.y += d.vy * (dt / 16);
          if (d.x < -4) d.x = width + 4;
          if (d.x > width + 4) d.x = -4;
          if (d.y < -4) d.y = height + 4;
          if (d.y > height + 4) d.y = -4;
          ctx.globalAlpha = d.alpha * wDrift;
          ctx.fillStyle = "rgba(140,200,240,1)";
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Bioluminescence — blinking
      const blumActive = Math.max(wBiolum, wSparse * 0.5);
      if (blumActive > 0.02) {
        const visibleCount = wSparse > 0.5 ? sparseCount : biolums.length;
        for (let i = 0; i < visibleCount; i++) {
          const bl = biolums[i];
          bl.phase += (dt * Math.PI * 2) / bl.period;
          const cycle = (Math.sin(bl.phase) + 1) / 2;
          const flash = Math.pow(cycle, 4);
          const a = (0.1 + flash * 0.85) * blumActive;
          ctx.globalAlpha = a;
          ctx.fillStyle = bl.color;
          // glow
          const r = bl.size + flash * 4;
          const grd = ctx.createRadialGradient(bl.x, bl.y, 0, bl.x, bl.y, r * 3);
          grd.addColorStop(0, bl.color);
          grd.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(bl.x, bl.y, r * 3, 0, Math.PI * 2);
          ctx.fill();
          // core
          ctx.fillStyle = bl.color;
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(bl.x, bl.y, bl.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [depthRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden
    />
  );
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function smooth(v: number, lo: number, hi: number): number {
  if (v <= lo) return 0;
  if (v >= hi) return 1;
  const t = (v - lo) / (hi - lo);
  return t * t * (3 - 2 * t);
}

// ============================================================
// Final share section
// ============================================================

function FinalShare({ locale }: { locale: SimpleLocale }): ReactElement {
  const [copied, setCopied] = useState(false);

  const onShare = () => {
    const text =
      locale === "ko"
        ? "마리아나 해구 -10,935m 까지 내려갔다 → nolza.fun/games/deep"
        : "Reached the bottom of the Mariana Trench at -10,935m → nolza.fun/games/deep";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
    } else {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 160px",
        position: "relative",
        zIndex: 1,
        gap: 36,
      }}
    >
      <h2
        style={{
          fontSize: 36,
          fontWeight: 500,
          color: "rgba(255,255,255,0.95)",
          fontFamily: "var(--font-noto-serif-kr), serif",
          letterSpacing: "-0.5px",
          textAlign: "center",
          margin: 0,
          maxWidth: 720,
          lineHeight: 1.3,
        }}
      >
        {locale === "ko"
          ? "당신은 지구에서 가장 깊은 곳에 왔습니다"
          : "You've reached the deepest point on Earth"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 18,
          width: "100%",
          maxWidth: 720,
          padding: "24px",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <Stat
          label={locale === "ko" ? "깊이" : "Depth"}
          value="-10,935m"
        />
        <Stat
          label={locale === "ko" ? "수압" : "Water Pressure"}
          value={locale === "ko" ? "1,086기압" : "1,086 atm"}
        />
        <Stat
          label={locale === "ko" ? "위치" : "Location"}
          value={locale === "ko" ? "챌린저 딥 마리아나 해구" : "Challenger Deep, Mariana Trench"}
        />
      </div>

      <button
        type="button"
        onClick={onShare}
        style={{
          padding: "14px 32px",
          borderRadius: 50,
          border: "1px solid rgba(255,255,255,0.25)",
          background: "transparent",
          color: "rgba(255,255,255,0.95)",
          fontSize: 15,
          letterSpacing: "0.05em",
          cursor: "pointer",
          fontFamily: "var(--font-inter), sans-serif",
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
      >
        {copied ? (locale === "ko" ? "복사됨" : "Copied") : (locale === "ko" ? "공유" : "Share")}
      </button>
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}): ReactElement {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 13,
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.45)",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.92)",
          fontFamily: "var(--font-noto-serif-kr), serif",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ============================================================
// Main page component
// ============================================================

const SLOT_PX = 800;
const TOTAL_SCROLL_PX = STOPS.length * SLOT_PX;

function cardSide(idx: number, depth: number): "left" | "right" {
  // deterministic pseudo-random; alternates by parity then perturbed by depth
  const seed = (idx * 2654435761 + Math.abs(depth) * 17) >>> 0;
  return seed % 2 === 0 ? "left" : "right";
}

export default function DeepGame(): ReactElement {
  const { locale } = useLocale();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const depthRef = useRef(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      const scrollTop =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;
      const trackTop = track.offsetTop;
      const trackHeight = track.offsetHeight;
      const within = scrollTop - trackTop;
      const p = trackHeight > 0
        ? Math.min(1, Math.max(0, within / trackHeight))
        : 0;
      progressRef.current = p;
      depthRef.current = depthFromProgress(p);
      setProgress(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const currentDepth = useMemo(
    () => Math.round(depthFromProgress(progress)),
    [progress],
  );
  const bgGrad = useMemo(() => zoneGradient(currentDepth), [currentDepth]);

  // Surface light fades by ~500m, caustics by ~200m
  const sunlightOpacity = clamp(1 - currentDepth / 500, 0, 1);
  const causticOpacity = clamp(1 - currentDepth / 200, 0, 1);

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* Fixed background — viewport-sized, color updates with scroll depth */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100vh",
          background: bgGrad,
          transition: "background 0.6s linear",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes swim {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25%      { transform: translateX(-8px) rotate(-1deg); }
  75%      { transform: translateX(8px) rotate(1deg); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-15px); }
}
@keyframes wave {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(-20px); }
}
@keyframes wave-back {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(24px); }
}
@keyframes caustic {
  0%   { opacity: 0.1; transform: rotate(0deg) translateY(0); }
  50%  { opacity: 0.35; transform: rotate(5deg) translateY(8px); }
  100% { opacity: 0.1; transform: rotate(0deg) translateY(0); }
}
img.sea-creature {
  mix-blend-mode: luminosity;
  filter: brightness(1.3) contrast(1.2) saturate(0.8)
          drop-shadow(0 0 20px rgba(0,150,255,0.5));
  max-width: 250px;
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at center, black 50%, transparent 100%);
  mask-image: radial-gradient(ellipse 80% 80% at center, black 50%, transparent 100%);
  background: transparent;
  border: none;
  box-shadow: none;
  transition: transform 0.3s ease, filter 0.3s ease;
}
img.sea-creature:hover {
  transform: scale(1.08);
  filter: brightness(1.5) contrast(1.3) saturate(0.9)
          drop-shadow(0 0 30px rgba(0,200,255,0.7));
}
img.sea-creature.deep {
  filter: brightness(1.3) contrast(1.2) saturate(0.7)
          drop-shadow(0 0 15px rgba(0,255,136,0.5))
          drop-shadow(0 0 30px rgba(0,255,136,0.2));
}
img.sea-creature.deep:hover {
  transform: scale(1.08);
  filter: brightness(1.5) contrast(1.3) saturate(0.85)
          drop-shadow(0 0 22px rgba(0,255,180,0.75))
          drop-shadow(0 0 44px rgba(0,255,136,0.35));
}
.creature-wrap {
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: 12px;
  background: transparent;
  border: none;
  box-shadow: none;
}
.deep-card {
  position: absolute;
  width: 40%;
}
.deep-card.left  { left: 20%; }
.deep-card.right { left: 60%; }
@media (max-width: 768px) {
  .deep-card { width: 86% !important; }
  .deep-card.left,
  .deep-card.right { left: 7% !important; }
}
.caustic-ray {
  position: absolute;
  top: -40px;
  width: 2px;
  height: 240px;
  background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%);
  filter: blur(4px);
  transform-origin: top center;
}
@media (max-width: 699px) {
  .deep-row { flex-direction: column !important; gap: 24px !important; }
  .deep-depth-indicator { left: 12px !important; }
  .deep-depth-number { font-size: 22px !important; }
  .deep-back-arrow { left: 52px !important; }
  img.sea-creature { max-width: 240px; }
}
`,
        }}
      />

      {/* Sunlight halo (top center radial) */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)",
          opacity: sunlightOpacity,
          transition: "opacity 0.4s linear",
          zIndex: 0,
        }}
      />

      {/* Caustic light rays (0~-200m) */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: causticOpacity,
          transition: "opacity 0.4s linear",
          zIndex: 0,
        }}
      >
        {[5, 18, 32, 47, 62, 78, 92].map((leftPct, i) => (
          <div
            key={i}
            className="caustic-ray"
            style={{
              left: `${leftPct}%`,
              animation: `caustic ${4 + (i % 3) * 0.6}s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Wave surface (top of document, scrolls away) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 90,
          pointerEvents: "none",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 1200 90"
          preserveAspectRatio="none"
          style={{
            width: "calc(100% + 60px)",
            height: "100%",
            position: "absolute",
            left: -30,
            animation: "wave-back 7s ease-in-out infinite",
          }}
        >
          <path
            d="M0,55 C200,30 400,80 600,55 C800,30 1000,80 1200,55 L1200,90 L0,90 Z"
            fill="rgba(255,255,255,0.18)"
          />
        </svg>
        <svg
          viewBox="0 0 1200 90"
          preserveAspectRatio="none"
          style={{
            width: "calc(100% + 60px)",
            height: "100%",
            position: "absolute",
            left: -30,
            animation: "wave 5s ease-in-out infinite",
          }}
        >
          <path
            d="M0,65 C150,40 350,90 600,65 C850,40 1050,90 1200,65 L1200,90 L0,90 Z"
            fill="rgba(255,255,255,0.38)"
          />
        </svg>
      </div>

      <ParticleCanvas depthRef={depthRef} />

      {/* Top-left back arrow */}
      <Link
        href="/"
        aria-label={locale === "ko" ? "홈으로" : "Home"}
        className="deep-back-arrow"
        style={{
          position: "fixed",
          top: 24,
          left: 64,
          color: "rgba(255,255,255,0.65)",
          fontSize: 22,
          textDecoration: "none",
          zIndex: 51,
          lineHeight: 1,
        }}
      >
        ←
      </Link>
      {/* Fixed left depth indicator */}
      <div
        className="deep-depth-indicator"
        style={{
          position: "fixed",
          left: 24,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            letterSpacing: "0.1em",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {locale === "ko" ? "현재 깊이" : "Current Depth"}
        </div>
        <div
          className="deep-depth-number"
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 28,
            fontWeight: 500,
            fontFamily: "var(--font-noto-serif-kr), serif",
            lineHeight: 1.1,
          }}
        >
          -{currentDepth.toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}m
        </div>
        <div
          style={{
            width: 2,
            height: 200,
            backgroundColor: "rgba(255,255,255,0.15)",
            position: "relative",
            marginTop: 8,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${Math.round(progress * 100)}%`,
              backgroundColor: "rgba(255,255,255,0.7)",
              transition: "height 0.1s linear",
            }}
          />
        </div>
      </div>

      {/* Index-slotted scroll track — each creature gets its own SLOT_PX of vertical space */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          width: "100%",
          height: TOTAL_SCROLL_PX,
          zIndex: 1,
        }}
      >
        {STOPS.map((stop, idx) => {
          const topPx = idx * SLOT_PX + SLOT_PX / 2;
          const side = cardSide(idx, stop.depth);
          return (
            <div
              key={`${stop.depth}-${idx}`}
              className={`deep-card ${side}`}
              style={{ top: `${topPx}px`, transform: "translateY(-50%)" }}
            >
              <StopSection stop={stop} locale={locale} />
            </div>
          );
        })}
      </div>

      {/* Final share section */}
      <FinalShare locale={locale} />

      <AdMobileSticky />
    </main>
  );
}
