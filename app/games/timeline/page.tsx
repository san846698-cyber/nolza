"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

// ============================================================================
// Theme
// ============================================================================

const KSANS = "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif";
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', serif";
const INTER = "var(--font-inter), 'Inter', sans-serif";
const ACCENT = "#fbbf24"; // soft amber

// ============================================================================
// Eras + colors
// ============================================================================

type Era = "선사시대" | "고대문명" | "중세" | "근대" | "현대";

const ERAS: Era[] = ["선사시대", "고대문명", "중세", "근대", "현대"];

const ERA_COLOR: Record<Era, string> = {
  선사시대: "#1a0f00",
  고대문명: "#0f1500",
  중세: "#000f1a",
  근대: "#1a001a",
  현대: "#0d0d0d",
};

const ERA_LABEL_EN: Record<Era, string> = {
  선사시대: "Prehistory",
  고대문명: "Ancient World",
  중세: "Medieval Era",
  근대: "Modern Era",
  현대: "Contemporary",
};

// ============================================================================
// Events — ordered chronologically
// ============================================================================

type Event = {
  year: number;
  display: { ko: string; en: string };
  era: Era;
  title: { ko: string; en: string };
  desc: { ko: string; en: string };
  fact: { ko: string; en: string };
};

const events: Event[] = [
  {
    year: -300_000,
    display: { ko: "기원전 30만년", en: "300,000 BC" },
    era: "선사시대",
    title: { ko: "호모 사피엔스 등장", en: "Homo Sapiens Appear" },
    desc: {
      ko: "당신의 조상이 처음 지구를 걸었습니다.",
      en: "Your ancestors walked the Earth for the first time.",
    },
    fact: {
      ko: "지금까지 존재한 모든 인간의 시작점이에요.",
      en: "The starting point of every human who ever lived.",
    },
  },
  {
    year: -70_000,
    display: { ko: "기원전 7만년", en: "70,000 BC" },
    era: "선사시대",
    title: { ko: "토바 화산 대폭발", en: "Toba Supervolcano Eruption" },
    desc: {
      ko: "인류가 거의 멸종할 뻔했습니다. 생존자: 약 1만명.",
      en: "Humanity nearly went extinct. Survivors: about 10,000.",
    },
    fact: {
      ko: "지금 80억 인류가 전부 그 1만명의 후손이에요.",
      en: "All 8 billion people today descended from those 10,000.",
    },
  },
  {
    year: -40_000,
    display: { ko: "기원전 4만년", en: "40,000 BC" },
    era: "선사시대",
    title: { ko: "동굴 벽화 시작", en: "Cave Paintings Begin" },
    desc: {
      ko: "인류 최초의 예술. 스페인 알타미라 동굴.",
      en: "Humanity's first art. Altamira cave in Spain.",
    },
    fact: {
      ko: "그림 실력이 지금 초등학생보다 나아요.",
      en: "The artistic skill rivals that of today's children.",
    },
  },
  {
    year: -10_000,
    display: { ko: "기원전 1만년", en: "10,000 BC" },
    era: "선사시대",
    title: { ko: "농업 혁명", en: "Agricultural Revolution" },
    desc: {
      ko: "씨앗을 처음 심었습니다. 인류 역사의 가장 큰 전환점.",
      en: "First seeds planted. The biggest turning point in human history.",
    },
    fact: {
      ko: "이전까지 인류는 10만년간 유목민이었어요.",
      en: "Before this, humans were nomads for 100,000 years.",
    },
  },
  {
    year: -8_000,
    display: { ko: "기원전 8000년", en: "8,000 BC" },
    era: "선사시대",
    title: { ko: "최초의 도시 탄생", en: "First Cities Emerge" },
    desc: {
      ko: "사람들이 처음으로 한곳에 모여 살기 시작했습니다.",
      en: "People began living together in permanent settlements.",
    },
    fact: {
      ko: "예리코가 세계 최초의 도시로 알려져 있어요.",
      en: "Jericho is considered the world's oldest city.",
    },
  },
  {
    year: -3_500,
    display: { ko: "기원전 3500년", en: "3,500 BC" },
    era: "고대문명",
    title: { ko: "수메르 문명", en: "Sumerian Civilization" },
    desc: {
      ko: "인류 최초의 문자, 도시, 법이 탄생했습니다.",
      en: "Humanity's first writing, cities, and laws emerged.",
    },
    fact: {
      ko: "지금의 이라크 지역이에요. 모든 문명의 시작점.",
      en: "Modern-day Iraq. The cradle of all civilization.",
    },
  },
  {
    year: -3_000,
    display: { ko: "기원전 3000년", en: "3,000 BC" },
    era: "고대문명",
    title: { ko: "이집트 피라미드 건설", en: "Egyptian Pyramids Built" },
    desc: {
      ko: "지금도 어떻게 만들었는지 완전히 모릅니다.",
      en: "We still don't fully know how they were built.",
    },
    fact: {
      ko: "4500년 전 건물이 아직 서있어요.",
      en: "A 4,500-year-old structure still standing today.",
    },
  },
  {
    year: -1_750,
    display: { ko: "기원전 1750년", en: "1,750 BC" },
    era: "고대문명",
    title: { ko: "함무라비 법전", en: "Code of Hammurabi" },
    desc: {
      ko: "'눈에는 눈, 이에는 이' 세계 최초의 성문법.",
      en: "'An eye for an eye.' The world's first written law.",
    },
    fact: {
      ko: "282개 법조문이 돌기둥에 새겨져 있어요.",
      en: "282 laws carved into a stone pillar.",
    },
  },
  {
    year: -1_200,
    display: { ko: "기원전 1200년", en: "1,200 BC" },
    era: "고대문명",
    title: { ko: "트로이 전쟁", en: "Trojan War" },
    desc: {
      ko: "호메로스의 일리아드. 목마 작전.",
      en: "Homer's Iliad. The Trojan Horse.",
    },
    fact: {
      ko: "신화인 줄 알았는데 실제로 있었던 전쟁이에요.",
      en: "Once thought myth — it actually happened.",
    },
  },
  {
    year: -776,
    display: { ko: "기원전 776년", en: "776 BC" },
    era: "고대문명",
    title: { ko: "최초의 올림픽", en: "First Olympic Games" },
    desc: {
      ko: "그리스 올림피아에서 시작됐습니다.",
      en: "Started in Olympia, Greece.",
    },
    fact: {
      ko: "처음엔 달리기 한 종목뿐이었어요.",
      en: "Originally just one event: a footrace.",
    },
  },
  {
    year: -563,
    display: { ko: "기원전 563년", en: "563 BC" },
    era: "고대문명",
    title: { ko: "석가모니 탄생", en: "Buddha Born" },
    desc: {
      ko: "불교의 시작. 지금 5억명이 믿는 종교.",
      en: "The beginning of Buddhism. Now followed by 500 million.",
    },
    fact: {
      ko: "왕자였지만 모든 걸 버리고 깨달음을 찾았어요.",
      en: "He was a prince who gave up everything to seek enlightenment.",
    },
  },
  {
    year: -551,
    display: { ko: "기원전 551년", en: "551 BC" },
    era: "고대문명",
    title: { ko: "공자 탄생", en: "Confucius Born" },
    desc: {
      ko: "동아시아 2500년을 지배한 사상의 시작.",
      en: "The philosophy that shaped East Asia for 2,500 years.",
    },
    fact: {
      ko: "인(仁), 의(義), 예(禮). 지금도 유효한 가르침이에요.",
      en: "Benevolence, righteousness, propriety. Still relevant today.",
    },
  },
  {
    year: -509,
    display: { ko: "기원전 509년", en: "509 BC" },
    era: "고대문명",
    title: { ko: "로마 공화국 탄생", en: "Roman Republic Founded" },
    desc: {
      ko: "원로원이 생겼습니다. 민주주의의 기원.",
      en: "The Senate was formed. The origin of democracy.",
    },
    fact: {
      ko: "500년간 지중해를 지배한 제국의 시작이에요.",
      en: "The beginning of an empire that ruled the Mediterranean for 500 years.",
    },
  },
  {
    year: -490,
    display: { ko: "기원전 490년", en: "490 BC" },
    era: "고대문명",
    title: { ko: "마라톤 전투", en: "Battle of Marathon" },
    desc: { ko: "그리스가 페르시아를 이겼습니다.", en: "Greece defeated Persia." },
    fact: {
      ko: "전령이 42km를 달려 승전보를 전하고 쓰러졌어요. 마라톤의 유래.",
      en: "A messenger ran 42km to deliver the news, then collapsed. Origin of the marathon.",
    },
  },
  {
    year: -300,
    display: { ko: "기원전 300년", en: "300 BC" },
    era: "고대문명",
    title: { ko: "마우리아 왕조 — 인도 최초 통일", en: "Maurya Empire — India's First Unification" },
    desc: {
      ko: "찬드라굽타가 인도를 처음으로 통일했습니다.",
      en: "Chandragupta unified India for the first time.",
    },
    fact: {
      ko: "아소카 왕이 불교를 전 아시아에 전파했어요.",
      en: "Emperor Ashoka spread Buddhism across all of Asia.",
    },
  },
  {
    year: -221,
    display: { ko: "기원전 221년", en: "221 BC" },
    era: "고대문명",
    title: { ko: "진시황 중국 통일", en: "Qin Shi Huang Unifies China" },
    desc: { ko: "만리장성 건설. 최초의 황제.", en: "Great Wall construction. China's first emperor." },
    fact: {
      ko: "병마용 8000개가 그의 무덤을 지키고 있어요.",
      en: "8,000 terracotta warriors guard his tomb.",
    },
  },
  {
    year: -200,
    display: { ko: "기원전 200년", en: "200 BC" },
    era: "고대문명",
    title: { ko: "실크로드 개통", en: "Silk Road Opens" },
    desc: {
      ko: "동서양이 처음으로 연결됐습니다.",
      en: "East and West connected for the first time.",
    },
    fact: {
      ko: "비단, 향신료, 종교, 질병이 함께 오갔어요.",
      en: "Silk, spices, religions, and diseases all traveled this route.",
    },
  },
  {
    year: -44,
    display: { ko: "기원전 44년", en: "44 BC" },
    era: "고대문명",
    title: { ko: "카이사르 암살", en: "Caesar Assassinated" },
    desc: {
      ko: "'브루투스, 너마저.' 로마 공화정의 종말.",
      en: "'Et tu, Brute?' The end of the Roman Republic.",
    },
    fact: {
      ko: "23번 칼에 찔렸습니다. 원로원 의원 60명이 가담했어요.",
      en: "Stabbed 23 times by 60 senators.",
    },
  },
  {
    year: -4,
    display: { ko: "기원전 4년", en: "4 BC" },
    era: "고대문명",
    title: { ko: "예수 탄생 (추정)", en: "Birth of Jesus (estimated)" },
    desc: { ko: "AD와 BC의 기준점.", en: "The dividing point of our calendar." },
    fact: {
      ko: "지금 24억명이 믿는 기독교의 시작이에요.",
      en: "The beginning of Christianity, now followed by 2.4 billion.",
    },
  },
  {
    year: 105,
    display: { ko: "서기 105년", en: "105 AD" },
    era: "중세",
    title: { ko: "종이 발명", en: "Paper Invented" },
    desc: { ko: "중국 채륜이 발명했습니다.", en: "Invented by Cai Lun in China." },
    fact: {
      ko: "이전까지는 대나무, 비단, 파피루스에 썼어요.",
      en: "Before this, people wrote on bamboo, silk, and papyrus.",
    },
  },
  {
    year: 313,
    display: { ko: "서기 313년", en: "313 AD" },
    era: "중세",
    title: { ko: "로마 기독교 공인", en: "Christianity Legalized in Rome" },
    desc: {
      ko: "박해받던 종교가 국교가 됐습니다.",
      en: "A persecuted religion became the state religion.",
    },
    fact: {
      ko: "이후 유럽 1500년을 교회가 지배했어요.",
      en: "The Church dominated Europe for the next 1,500 years.",
    },
  },
  {
    year: 570,
    display: { ko: "서기 570년", en: "570 AD" },
    era: "중세",
    title: { ko: "무함마드 탄생", en: "Muhammad Born" },
    desc: {
      ko: "이슬람교의 시작. 지금 18억명이 믿는 종교.",
      en: "The beginning of Islam. Now followed by 1.8 billion.",
    },
    fact: {
      ko: "불과 100년 만에 중동, 북아프리카를 덮었어요.",
      en: "Within 100 years, Islam spread across the Middle East and North Africa.",
    },
  },
  {
    year: 600,
    display: { ko: "서기 600년", en: "600 AD" },
    era: "중세",
    title: { ko: "이슬람 황금기", en: "Islamic Golden Age" },
    desc: {
      ko: "수학, 천문학, 의학의 혁명이 일어났습니다.",
      en: "A revolution in mathematics, astronomy, and medicine.",
    },
    fact: {
      ko: "대수학(Algebra)은 아랍어 al-jabr에서 왔어요.",
      en: "The word 'algebra' comes from the Arabic al-jabr.",
    },
  },
  {
    year: 1066,
    display: { ko: "서기 1066년", en: "1066 AD" },
    era: "중세",
    title: { ko: "노르만 정복", en: "Norman Conquest" },
    desc: {
      ko: "프랑스어가 영어에 섞이기 시작했습니다.",
      en: "French began mixing into English.",
    },
    fact: {
      ko: "지금 영어 단어의 30%가 프랑스어 기원이에요.",
      en: "30% of English words today have French origins.",
    },
  },
  {
    year: 1096,
    display: { ko: "서기 1096년", en: "1096 AD" },
    era: "중세",
    title: { ko: "십자군 전쟁 시작", en: "Crusades Begin" },
    desc: { ko: "200년간 이어진 종교 전쟁.", en: "200 years of religious warfare." },
    fact: {
      ko: "결국 예루살렘을 영구히 되찾지 못했어요.",
      en: "In the end, Jerusalem was never permanently reclaimed.",
    },
  },
  {
    year: 1206,
    display: { ko: "서기 1206년", en: "1206 AD" },
    era: "중세",
    title: { ko: "칭기즈칸 몽골 제국", en: "Genghis Khan's Mongol Empire" },
    desc: {
      ko: "역사상 최대 육상 제국.",
      en: "The largest contiguous land empire in history.",
    },
    fact: {
      ko: "전 세계 인구 10%를 죽인 것으로 추정됩니다.",
      en: "Estimated to have killed 10% of the world's population.",
    },
  },
  {
    year: 1215,
    display: { ko: "서기 1215년", en: "1215 AD" },
    era: "중세",
    title: { ko: "마그나카르타", en: "Magna Carta" },
    desc: {
      ko: "영국 왕이 처음으로 법 아래 놓였습니다.",
      en: "For the first time, a king was subject to the law.",
    },
    fact: { ko: "지금 헌법의 조상이에요.", en: "The ancestor of modern constitutions." },
  },
  {
    year: 1347,
    display: { ko: "서기 1347년", en: "1347 AD" },
    era: "중세",
    title: { ko: "흑사병", en: "Black Death" },
    desc: {
      ko: "유럽 인구 1/3 사망. 약 2500만명.",
      en: "1/3 of Europe's population died. About 25 million.",
    },
    fact: {
      ko: "의사들이 부리 달린 마스크를 쓰고 다녔어요.",
      en: "Doctors wore beak-shaped masks filled with herbs.",
    },
  },
  {
    year: 1400,
    display: { ko: "서기 1400년", en: "1400 AD" },
    era: "중세",
    title: { ko: "잉카·아즈텍 문명 전성기", en: "Inca & Aztec Civilizations Peak" },
    desc: {
      ko: "유럽이 모르던 아메리카에 거대 문명이 있었습니다.",
      en: "While Europe struggled, vast civilizations thrived in the Americas.",
    },
    fact: {
      ko: "잉카는 콘크리트 없이 마추픽추를 지었어요.",
      en: "The Inca built Machu Picchu without mortar or concrete.",
    },
  },
  {
    year: 1440,
    display: { ko: "서기 1440년", en: "1440 AD" },
    era: "중세",
    title: { ko: "구텐베르크 인쇄기", en: "Gutenberg's Printing Press" },
    desc: { ko: "정보 혁명의 시작.", en: "The beginning of the information revolution." },
    fact: {
      ko: "지식이 처음으로 대중에게 퍼지기 시작했어요.",
      en: "Knowledge began spreading to the masses for the first time.",
    },
  },
  {
    year: 1492,
    display: { ko: "서기 1492년", en: "1492 AD" },
    era: "근대",
    title: { ko: "콜럼버스 아메리카 도착", en: "Columbus Reaches the Americas" },
    desc: { ko: "세계가 연결되기 시작했습니다.", en: "The world began to connect." },
    fact: {
      ko: "원주민에게는 재앙의 시작. 90%가 사망했습니다.",
      en: "For indigenous peoples, it was catastrophe. 90% died.",
    },
  },
  {
    year: 1500,
    display: { ko: "서기 1500년", en: "1500 AD" },
    era: "근대",
    title: { ko: "종교개혁", en: "Protestant Reformation" },
    desc: {
      ko: "마르틴 루터가 교회에 반기를 들었습니다.",
      en: "Martin Luther challenged the Church.",
    },
    fact: {
      ko: "95개 반박문이 인쇄기 덕분에 유럽 전체에 퍼졌어요.",
      en: "His 95 theses spread across Europe thanks to the printing press.",
    },
  },
  {
    year: 1543,
    display: { ko: "서기 1543년", en: "1543 AD" },
    era: "근대",
    title: { ko: "코페르니쿠스 지동설", en: "Copernican Heliocentrism" },
    desc: { ko: "지구가 태양 주위를 돈다.", en: "The Earth orbits the Sun." },
    fact: {
      ko: "당시엔 이단이었어요. 갈릴레오는 이 때문에 감옥에 갔어요.",
      en: "Considered heresy. Galileo was imprisoned for supporting it.",
    },
  },
  {
    year: 1592,
    display: { ko: "서기 1592년", en: "1592 AD" },
    era: "근대",
    title: { ko: "임진왜란", en: "Imjin War" },
    desc: {
      ko: "이순신 장군. 거북선. 7년 전쟁.",
      en: "Admiral Yi Sun-sin. The Turtle Ship. 7 years of war.",
    },
    fact: {
      ko: "이순신은 23전 23승. 단 한 번도 지지 않았어요.",
      en: "Yi Sun-sin won all 23 battles. Never lost once.",
    },
  },
  {
    year: 1600,
    display: { ko: "서기 1600년", en: "1600 AD" },
    era: "근대",
    title: { ko: "오스만 제국 전성기", en: "Ottoman Empire at Peak" },
    desc: {
      ko: "유럽, 중동, 북아프리카를 지배했습니다.",
      en: "Controlled Europe, the Middle East, and North Africa.",
    },
    fact: {
      ko: "600년간 지속된 제국. 1922년에야 무너졌어요.",
      en: "An empire that lasted 600 years, collapsing in 1922.",
    },
  },
  {
    year: 1687,
    display: { ko: "서기 1687년", en: "1687 AD" },
    era: "근대",
    title: { ko: "뉴턴 만유인력 법칙", en: "Newton's Law of Gravity" },
    desc: {
      ko: "사과가 떨어지는 것을 보고 중력을 깨달았습니다.",
      en: "Watching an apple fall led to the discovery of gravity.",
    },
    fact: {
      ko: "23살에 흑사병 피해 집에 있다가 발견했어요.",
      en: "He was 23, hiding from the plague, when he figured it out.",
    },
  },
  {
    year: 1700,
    display: { ko: "서기 1700년", en: "1700 AD" },
    era: "근대",
    title: { ko: "계몽주의", en: "The Enlightenment" },
    desc: {
      ko: "이성과 과학이 종교의 자리를 대체하기 시작했습니다.",
      en: "Reason and science began replacing religion as the authority.",
    },
    fact: {
      ko: "볼테르, 루소, 로크. 민주주의 혁명의 씨앗이 됐어요.",
      en: "Voltaire, Rousseau, Locke. Seeds of democratic revolution.",
    },
  },
  {
    year: 1760,
    display: { ko: "서기 1760년", en: "1760 AD" },
    era: "근대",
    title: { ko: "산업혁명", en: "Industrial Revolution" },
    desc: { ko: "증기기관이 세상을 바꿨습니다.", en: "The steam engine changed everything." },
    fact: {
      ko: "인류가 처음으로 근육 힘이 아닌 기계 힘을 사용했어요.",
      en: "For the first time, humans used machine power instead of muscle.",
    },
  },
  {
    year: 1776,
    display: { ko: "서기 1776년", en: "1776 AD" },
    era: "근대",
    title: { ko: "미국 독립선언", en: "American Declaration of Independence" },
    desc: { ko: "'모든 인간은 평등하게 태어났다.'", en: "'All men are created equal.'" },
    fact: {
      ko: "당시 노예를 소유한 사람이 이 문장을 썼어요.",
      en: "Written by a man who owned slaves.",
    },
  },
  {
    year: 1789,
    display: { ko: "서기 1789년", en: "1789 AD" },
    era: "근대",
    title: { ko: "프랑스 혁명", en: "French Revolution" },
    desc: {
      ko: "자유, 평등, 박애. 왕의 시대가 끝나기 시작했습니다.",
      en: "Liberty, equality, fraternity. The age of kings began to end.",
    },
    fact: {
      ko: "루이 16세와 마리 앙투아네트가 단두대에서 처형됐어요.",
      en: "Louis XVI and Marie Antoinette were executed by guillotine.",
    },
  },
  {
    year: 1796,
    display: { ko: "서기 1796년", en: "1796 AD" },
    era: "근대",
    title: { ko: "천연두 백신 발명", en: "Smallpox Vaccine Invented" },
    desc: {
      ko: "인류 역사상 가장 많은 생명을 구한 발명.",
      en: "The invention that saved more lives than any other in history.",
    },
    fact: {
      ko: "천연두는 역사상 3억명을 죽인 질병. 지금은 완전히 사라졌어요.",
      en: "Smallpox killed 300 million throughout history. Now eradicated.",
    },
  },
  {
    year: 1850,
    display: { ko: "서기 1850년", en: "1850 AD" },
    era: "근대",
    title: { ko: "아편전쟁", en: "Opium Wars" },
    desc: {
      ko: "영국이 중국에 마약을 팔기 위해 전쟁을 일으켰습니다.",
      en: "Britain went to war with China to sell drugs.",
    },
    fact: {
      ko: "중국의 '굴욕의 세기'가 시작됐어요.",
      en: "The beginning of China's 'Century of Humiliation.'",
    },
  },
  {
    year: 1859,
    display: { ko: "서기 1859년", en: "1859 AD" },
    era: "근대",
    title: { ko: "다윈 진화론", en: "Darwin's Theory of Evolution" },
    desc: {
      ko: "인간이 원숭이와 공통 조상을 가진다.",
      en: "Humans share a common ancestor with apes.",
    },
    fact: {
      ko: "지금도 논쟁 중인 나라들이 있어요.",
      en: "Some countries still debate this today.",
    },
  },
  {
    year: 1865,
    display: { ko: "서기 1865년", en: "1865 AD" },
    era: "근대",
    title: { ko: "노예제 폐지 (미국)", en: "Abolition of Slavery (USA)" },
    desc: { ko: "링컨 암살. 남북전쟁 종전.", en: "Lincoln assassinated. Civil War ends." },
    fact: {
      ko: "400만명이 해방됐지만 진짜 평등까지는 100년이 더 걸렸어요.",
      en: "4 million freed, but true equality took 100 more years.",
    },
  },
  {
    year: 1876,
    display: { ko: "서기 1876년", en: "1876 AD" },
    era: "근대",
    title: { ko: "전화 발명", en: "Telephone Invented" },
    desc: {
      ko: "처음으로 목소리가 전선을 타고 갔습니다.",
      en: "For the first time, a voice traveled through a wire.",
    },
    fact: {
      ko: "특허 출원이 경쟁자보다 2시간 빨랐어요.",
      en: "Bell filed the patent just 2 hours ahead of his competitor.",
    },
  },
  {
    year: 1879,
    display: { ko: "서기 1879년", en: "1879 AD" },
    era: "근대",
    title: { ko: "전구 발명", en: "Light Bulb Invented" },
    desc: { ko: "밤이 낮이 되기 시작했습니다.", en: "Night began to become day." },
    fact: {
      ko: "1000번 실패 후 성공. '나는 안 되는 방법을 발견한 것'",
      en: "Failed 1,000 times. 'I found 1,000 ways that won't work.'",
    },
  },
  {
    year: 1884,
    display: { ko: "서기 1884년", en: "1884 AD" },
    era: "근대",
    title: { ko: "아프리카 분할 (베를린 회의)", en: "Scramble for Africa" },
    desc: {
      ko: "유럽 열강이 지도에 선을 그어 아프리카를 나눠가졌습니다.",
      en: "European powers drew lines on a map and divided Africa.",
    },
    fact: {
      ko: "아프리카인은 한 명도 회의에 참석하지 못했어요.",
      en: "Not a single African was present at the conference.",
    },
  },
  {
    year: 1895,
    display: { ko: "서기 1895년", en: "1895 AD" },
    era: "근대",
    title: { ko: "영화 발명", en: "Cinema Invented" },
    desc: {
      ko: "처음 영화를 본 관객들이 기차가 달려오자 도망쳤습니다.",
      en: "The first audience ran away when a train appeared on screen.",
    },
    fact: {
      ko: "지금은 영화 산업이 연간 100조원 규모예요.",
      en: "Today, the film industry is worth over $100 billion annually.",
    },
  },
  {
    year: 1903,
    display: { ko: "서기 1903년", en: "1903 AD" },
    era: "근대",
    title: { ko: "라이트 형제 첫 비행", en: "Wright Brothers' First Flight" },
    desc: { ko: "12초간 36미터.", en: "12 seconds. 36 meters." },
    fact: { ko: "66년 후 달에 갔어요.", en: "66 years later, we went to the Moon." },
  },
  {
    year: 1905,
    display: { ko: "서기 1905년", en: "1905 AD" },
    era: "근대",
    title: { ko: "아인슈타인 상대성이론", en: "Einstein's Theory of Relativity" },
    desc: {
      ko: "E=mc². 시간과 공간이 절대적이지 않다.",
      en: "E=mc². Time and space are not absolute.",
    },
    fact: {
      ko: "26살이었어요. 그 해에 논문 4편을 발표했어요.",
      en: "He was 26. He published four groundbreaking papers that year.",
    },
  },
  {
    year: 1910,
    display: { ko: "서기 1910년", en: "1910 AD" },
    era: "현대",
    title: { ko: "일제 강점기 시작", en: "Japanese Colonial Period Begins" },
    desc: { ko: "36년간의 역사.", en: "36 years of colonial rule." },
    fact: { ko: "1919년 3.1운동. 유관순 열사.", en: "March 1st Independence Movement, 1919." },
  },
  {
    year: 1914,
    display: { ko: "서기 1914년", en: "1914 AD" },
    era: "현대",
    title: { ko: "1차 세계대전", en: "World War I" },
    desc: { ko: "4년간 1700만명 사망.", en: "17 million died over 4 years." },
    fact: {
      ko: "방아쇠는 황태자 암살 한 발의 총알이었어요.",
      en: "Triggered by a single bullet — the assassination of Archduke Franz Ferdinand.",
    },
  },
  {
    year: 1917,
    display: { ko: "서기 1917년", en: "1917 AD" },
    era: "현대",
    title: { ko: "러시아 혁명", en: "Russian Revolution" },
    desc: { ko: "레닌. 공산주의 국가 탄생.", en: "Lenin. A communist state was born." },
    fact: {
      ko: "300년 로마노프 왕조가 하루아침에 무너졌어요.",
      en: "The 300-year Romanov dynasty collapsed overnight.",
    },
  },
  {
    year: 1918,
    display: { ko: "서기 1918년", en: "1918 AD" },
    era: "현대",
    title: { ko: "스페인 독감", en: "Spanish Flu" },
    desc: { ko: "전 세계 5000만명 사망.", en: "50 million people died worldwide." },
    fact: {
      ko: "1차대전 사망자보다 많아요. 스페인에서 시작된 게 아니에요.",
      en: "More than WWI deaths combined. It didn't originate in Spain.",
    },
  },
  {
    year: 1929,
    display: { ko: "서기 1929년", en: "1929 AD" },
    era: "현대",
    title: { ko: "대공황", en: "The Great Depression" },
    desc: {
      ko: "주식시장 붕괴. 전 세계 경제 마비.",
      en: "Stock market crash. Global economic paralysis.",
    },
    fact: { ko: "미국 실업률이 25%까지 올라갔어요.", en: "US unemployment reached 25%." },
  },
  {
    year: 1939,
    display: { ko: "서기 1939년", en: "1939 AD" },
    era: "현대",
    title: { ko: "2차 세계대전 시작", en: "World War II Begins" },
    desc: { ko: "6년간 7000만명 이상 사망.", en: "More than 70 million died over 6 years." },
    fact: {
      ko: "홀로코스트 600만명. 인류 역사상 최악의 전쟁.",
      en: "Holocaust: 6 million. The deadliest war in human history.",
    },
  },
  {
    year: 1945,
    display: { ko: "서기 1945년", en: "1945 AD" },
    era: "현대",
    title: { ko: "2차 세계대전 종전 + 광복", en: "WWII Ends + Korean Liberation" },
    desc: {
      ko: "원자폭탄 투하. 일본 항복. 8월 15일.",
      en: "Atomic bomb dropped. Japan surrenders. August 15.",
    },
    fact: {
      ko: "히로시마 원자폭탄 하나로 14만명이 사망했어요.",
      en: "A single atomic bomb killed 140,000 people in Hiroshima.",
    },
  },
  {
    year: 1945,
    display: { ko: "서기 1945년 (유엔)", en: "1945 AD (UN)" },
    era: "현대",
    title: { ko: "유엔 창설", en: "United Nations Founded" },
    desc: { ko: "다시는 세계대전이 없게.", en: "Never again." },
    fact: { ko: "지금 193개국이 가입해 있어요.", en: "193 countries are now members." },
  },
  {
    year: 1947,
    display: { ko: "서기 1947년", en: "1947 AD" },
    era: "현대",
    title: { ko: "인도 독립", en: "Indian Independence" },
    desc: {
      ko: "비폭력으로 대영제국을 이겼습니다.",
      en: "Nonviolence defeated the British Empire.",
    },
    fact: {
      ko: "간디는 독립 이듬해 암살됐어요.",
      en: "Gandhi was assassinated the year after independence.",
    },
  },
  {
    year: 1948,
    display: { ko: "서기 1948년", en: "1948 AD" },
    era: "현대",
    title: { ko: "이스라엘 건국", en: "Israel Founded" },
    desc: {
      ko: "지금까지 이어지는 중동 분쟁의 시작.",
      en: "The beginning of a conflict that continues today.",
    },
    fact: {
      ko: "2000년 만의 귀환. 팔레스타인 문제는 아직 미해결이에요.",
      en: "A return after 2,000 years. The Palestinian question remains unresolved.",
    },
  },
  {
    year: 1950,
    display: { ko: "서기 1950년", en: "1950 AD" },
    era: "현대",
    title: { ko: "한국전쟁", en: "Korean War" },
    desc: {
      ko: "3년간의 전쟁. 동족상잔.",
      en: "3 years of war. A nation divided against itself.",
    },
    fact: {
      ko: "아직 공식적으로 끝나지 않았어요. 정전 상태예요.",
      en: "The war technically never ended. Still an armistice.",
    },
  },
  {
    year: 1953,
    display: { ko: "서기 1953년", en: "1953 AD" },
    era: "현대",
    title: { ko: "DNA 이중나선 발견", en: "DNA Double Helix Discovered" },
    desc: { ko: "생명의 비밀이 밝혀졌습니다.", en: "The secret of life revealed." },
    fact: {
      ko: "로절린드 프랭클린의 연구가 결정적이었지만 노벨상은 못 받았어요.",
      en: "Rosalind Franklin's work was crucial but she never received the Nobel Prize.",
    },
  },
  {
    year: 1955,
    display: { ko: "서기 1955년", en: "1955 AD" },
    era: "현대",
    title: { ko: "베트남 전쟁 시작", en: "Vietnam War Begins" },
    desc: { ko: "20년간 이어진 전쟁. 300만명 사망.", en: "20 years of war. 3 million dead." },
    fact: { ko: "미국이 처음으로 패배한 전쟁.", en: "The first war America lost." },
  },
  {
    year: 1957,
    display: { ko: "서기 1957년", en: "1957 AD" },
    era: "현대",
    title: { ko: "스푸트니크 발사", en: "Sputnik Launched" },
    desc: {
      ko: "인류 최초의 인공위성. 우주 시대 시작.",
      en: "Humanity's first satellite. The space age begins.",
    },
    fact: {
      ko: "소련이 먼저 우주에 갔어요. 미국은 충격을 받았어요.",
      en: "The Soviets got there first. America was shocked.",
    },
  },
  {
    year: 1960,
    display: { ko: "서기 1960년", en: "1960 AD" },
    era: "현대",
    title: { ko: "아프리카 독립의 해", en: "Year of African Independence" },
    desc: {
      ko: "17개 아프리카 나라가 한 해에 독립했습니다.",
      en: "17 African nations gained independence in a single year.",
    },
    fact: {
      ko: "식민지배 100년이 끝났지만 그 상처는 아직 남아있어요.",
      en: "100 years of colonialism ended, but the scars remain.",
    },
  },
  {
    year: 1963,
    display: { ko: "서기 1963년", en: "1963 AD" },
    era: "현대",
    title: { ko: "케네디 암살", en: "Kennedy Assassinated" },
    desc: {
      ko: "달라스에서 저격. 미국이 충격에 빠졌습니다.",
      en: "Shot in Dallas. America was devastated.",
    },
    fact: {
      ko: "단독범인지 아직도 논란이에요.",
      en: "Whether it was a lone gunman is still debated today.",
    },
  },
  {
    year: 1968,
    display: { ko: "서기 1968년", en: "1968 AD" },
    era: "현대",
    title: { ko: "마틴 루터 킹 암살", en: "MLK Assassinated" },
    desc: { ko: "'나에게는 꿈이 있습니다.'", en: "'I have a dream.'" },
    fact: {
      ko: "그의 꿈은 아직 완전히 이루어지지 않았어요.",
      en: "His dream has not yet been fully realized.",
    },
  },
  {
    year: 1969,
    display: { ko: "서기 1969년", en: "1969 AD" },
    era: "현대",
    title: { ko: "달 착륙", en: "Moon Landing" },
    desc: { ko: "암스트롱의 첫 발걸음.", en: "Armstrong's first step." },
    fact: {
      ko: "지금까지 달에 간 사람: 12명뿐. 마지막은 1972년이에요.",
      en: "Only 12 humans have walked on the Moon. The last was in 1972.",
    },
  },
  {
    year: 1975,
    display: { ko: "서기 1975년", en: "1975 AD" },
    era: "현대",
    title: { ko: "베트남 전쟁 종전", en: "Vietnam War Ends" },
    desc: { ko: "사이공 함락. 미군 철수.", en: "Saigon falls. US forces withdraw." },
    fact: {
      ko: "헬리콥터로 대사관 지붕에서 탈출하는 장면이 전쟁의 끝을 상징해요.",
      en: "Helicopters evacuating from the embassy roof became the symbol of the war's end.",
    },
  },
  {
    year: 1986,
    display: { ko: "서기 1986년", en: "1986 AD" },
    era: "현대",
    title: { ko: "체르노빌 원전 폭발", en: "Chernobyl Disaster" },
    desc: {
      ko: "소련 붕괴를 앞당긴 사건.",
      en: "An event that accelerated the Soviet Union's collapse.",
    },
    fact: {
      ko: "지금도 반경 30km는 사람이 살 수 없어요.",
      en: "A 30km exclusion zone remains uninhabitable today.",
    },
  },
  {
    year: 1989,
    display: { ko: "서기 1989년", en: "1989 AD" },
    era: "현대",
    title: { ko: "베를린 장벽 붕괴 + 인터넷 탄생", en: "Berlin Wall Falls + Internet Born" },
    desc: {
      ko: "냉전 종식. 팀 버너스리가 WWW를 만들었습니다.",
      en: "Cold War ends. Tim Berners-Lee invented the World Wide Web.",
    },
    fact: {
      ko: "이 페이지도 그 덕분이에요.",
      en: "This very page exists because of that invention.",
    },
  },
  {
    year: 1991,
    display: { ko: "서기 1991년", en: "1991 AD" },
    era: "현대",
    title: { ko: "소련 붕괴", en: "Soviet Union Collapses" },
    desc: { ko: "15개 나라로 분리됐습니다.", en: "Split into 15 countries." },
    fact: {
      ko: "70년간의 공산주의 실험이 끝났어요.",
      en: "A 70-year communist experiment came to an end.",
    },
  },
  {
    year: 1994,
    display: { ko: "서기 1994년", en: "1994 AD" },
    era: "현대",
    title: { ko: "남아공 아파르트헤이트 종식", en: "End of Apartheid" },
    desc: {
      ko: "27년 감옥 후 만델라가 대통령이 됐습니다.",
      en: "After 27 years in prison, Mandela became president.",
    },
    fact: {
      ko: "만델라는 복수 대신 화해를 선택했어요.",
      en: "Mandela chose reconciliation over revenge.",
    },
  },
  {
    year: 1997,
    display: { ko: "서기 1997년", en: "1997 AD" },
    era: "현대",
    title: { ko: "IMF 외환위기", en: "Asian Financial Crisis" },
    desc: {
      ko: "한국 경제의 전환점. 금 모으기 운동.",
      en: "Korea's economic turning point. Citizens donated gold.",
    },
    fact: { ko: "351만명이 실직했어요.", en: "3.51 million Koreans lost their jobs." },
  },
  {
    year: 2001,
    display: { ko: "서기 2001년", en: "2001 AD" },
    era: "현대",
    title: { ko: "9/11 테러", en: "September 11 Attacks" },
    desc: { ko: "세계가 달라졌습니다.", en: "The world changed." },
    fact: {
      ko: "2977명 사망. 20년간의 테러와의 전쟁이 시작됐어요.",
      en: "2,977 died. It triggered 20 years of the War on Terror.",
    },
  },
  {
    year: 2007,
    display: { ko: "서기 2007년", en: "2007 AD" },
    era: "현대",
    title: { ko: "아이폰 출시", en: "iPhone Released" },
    desc: { ko: "스티브 잡스. 세상이 바뀌기 시작했습니다.", en: "Steve Jobs. The world began to change." },
    fact: {
      ko: "지금 전 세계 절반이 스마트폰을 들고 다녀요.",
      en: "Today, half the world carries a smartphone.",
    },
  },
  {
    year: 2008,
    display: { ko: "서기 2008년", en: "2008 AD" },
    era: "현대",
    title: { ko: "글로벌 금융위기", en: "Global Financial Crisis" },
    desc: {
      ko: "리먼브라더스 파산. 전 세계 경제 충격.",
      en: "Lehman Brothers collapsed. Global economic shock.",
    },
    fact: {
      ko: "전 세계 주식시장이 50% 폭락했어요.",
      en: "Global stock markets lost 50% of their value.",
    },
  },
  {
    year: 2020,
    display: { ko: "서기 2020년", en: "2020 AD" },
    era: "현대",
    title: { ko: "코로나19 팬데믹", en: "COVID-19 Pandemic" },
    desc: { ko: "전 세계가 멈췄습니다.", en: "The world came to a halt." },
    fact: {
      ko: "700만명 공식 사망. 실제는 훨씬 많을 것으로 추정돼요.",
      en: "7 million officially dead. The real number is believed much higher.",
    },
  },
  {
    year: 2022,
    display: { ko: "서기 2022년", en: "2022 AD" },
    era: "현대",
    title: { ko: "AI 혁명", en: "AI Revolution" },
    desc: { ko: "ChatGPT 출시. 또 다른 전환점.", en: "ChatGPT launched. Another turning point." },
    fact: {
      ko: "출시 5일 만에 100만 사용자. 역사상 가장 빠른 성장.",
      en: "1 million users in 5 days. The fastest-growing product in history.",
    },
  },
  {
    year: 2025,
    display: { ko: "지금", en: "Right Now" },
    era: "현대",
    title: { ko: "당신이 여기 있습니다", en: "You Are Here" },
    desc: {
      ko: "30만년 역사 끝에 당신이 있어요.",
      en: "At the end of 300,000 years of history, there's you.",
    },
    fact: {
      ko: "다음 역사는 당신이 만듭니다.",
      en: "The next chapter is yours to write.",
    },
  },
];

// ============================================================================
// Page
// ============================================================================

export default function TimelinePage(): ReactElement {
  const { locale, t } = useLocale();
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Keep refs array sized to the events list
  if (cardRefs.current.length !== events.length) {
    cardRefs.current = events.map((_, i) => cardRefs.current[i] ?? null);
  }

  const activeEvent = events[activeIdx];
  const activeEra = activeEvent.era;
  const bgColor = ERA_COLOR[activeEra];

  // Scroll progress + active-card detection (closest to viewport center)
  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      const top = track.offsetTop;
      const height = track.offsetHeight;
      const scrolled = (window.scrollY || document.documentElement.scrollTop) - top;
      const p = height > 0 ? Math.min(1, Math.max(0, scrolled / height)) : 0;
      setProgress(p);

      const center = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((node, i) => {
        if (!node) return;
        const r = node.getBoundingClientRect();
        const cardCenter = r.top + r.height / 2;
        const d = Math.abs(cardCenter - center);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      setActiveIdx(bestIdx);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Reveal cards on scroll via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("tl-in-view");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    cardRefs.current.forEach((n) => n && obs.observe(n));
    return () => obs.disconnect();
  }, []);

  // Walk through events; whenever the era changes, prepend an EraDivider
  const items = useMemo(() => {
    const out: Array<
      | { kind: "divider"; era: Era; key: string }
      | { kind: "event"; event: Event; idx: number; side: "left" | "right" }
    > = [];
    let lastEra: Era | null = null;
    let visibleIdx = 0;
    events.forEach((e, i) => {
      if (e.era !== lastEra) {
        out.push({ kind: "divider", era: e.era, key: `divider-${e.era}-${i}` });
        lastEra = e.era;
      }
      out.push({
        kind: "event",
        event: e,
        idx: i,
        side: visibleIdx % 2 === 0 ? "left" : "right",
      });
      visibleIdx += 1;
    });
    return out;
  }, []);

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100svh",
        color: "#f5f5f5",
        fontFamily: locale === "ko" ? KSANS : INTER,
        overflowX: "hidden",
      }}
    >
      {/* Era-tinted background */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: bgColor,
          transition: "background 0.8s ease",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.04), transparent 60%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Home button */}
      <Link
        href="/"
        aria-label="home"
        className="back-arrow dark"
      >
        ←
      </Link>

      {/* Left fixed indicator */}
      <SidePanel
        event={activeEvent}
        era={activeEra}
        progress={progress}
        idx={activeIdx}
        total={events.length}
        locale={locale}
      />

      {/* Hero */}
      <Hero locale={locale} t={t} />

      {/* Track */}
      <div
        ref={trackRef}
        className="tl-track"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 24px 180px",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        {/* Center spine — only shown on wide screens */}
        <div
          aria-hidden
          className="tl-spine"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            transform: "translateX(-1px)",
            background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.18) 5%, rgba(255,255,255,0.18) 95%, transparent)",
          }}
        />

        {items.map((item) => {
          if (item.kind === "divider") {
            return <EraDivider key={item.key} era={item.era} locale={locale} />;
          }
          return (
            <EventRow
              key={`event-${item.idx}`}
              event={item.event}
              side={item.side}
              locale={locale}
              registerRef={(node) => {
                cardRefs.current[item.idx] = node;
              }}
              active={item.idx === activeIdx}
            />
          );
        })}

        <FooterShare t={t} locale={locale} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes tlReveal {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tlDotPulse {
  0%, 100% { box-shadow: 0 0 0 5px rgba(0,0,0,0.65), 0 0 0 0 rgba(251,191,36,0.22), 0 0 20px rgba(251,191,36,0.35); }
  50% { box-shadow: 0 0 0 5px rgba(0,0,0,0.65), 0 0 0 12px rgba(251,191,36,0.06), 0 0 30px rgba(251,191,36,0.62); }
}
@keyframes tlSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tl-card {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.tl-card.tl-in-view {
  opacity: 1;
  transform: translateY(0);
}
.tl-card[data-active="true"] {
  transform: translateY(-2px);
}
.tl-card[data-active="true"] article {
  border-color: rgba(251,191,36,0.34) !important;
  box-shadow: 0 22px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,191,36,0.08), inset 0 1px 0 rgba(255,255,255,0.08) !important;
}
.tl-row[data-active="true"] .tl-dot {
  animation: tlDotPulse 1.8s ease-in-out infinite;
  transform: translateX(-50%) scale(1.08) !important;
}
.tl-row[data-active="true"] .tl-connector {
  opacity: 0.75 !important;
  transform: scaleX(1) !important;
}
@media (min-width: 901px) {
  .tl-row[data-side="left"] .tl-connector {
    right: calc(50% + 8px);
    transform-origin: right center;
  }
  .tl-row[data-side="right"] .tl-connector {
    left: calc(50% + 8px);
    transform-origin: left center;
  }
  .tl-row[data-final="true"] .tl-connector {
    display: none;
  }
}
@media (max-width: 900px) {
  .tl-side {
    display: none !important;
  }
  .tl-mobile-bar {
    display: flex !important;
  }
  .tl-spine {
    left: 22px !important;
    transform: none !important;
  }
  .tl-row {
    display: block !important;
    justify-content: flex-start !important;
    margin: 22px 0 !important;
  }
  .tl-row .tl-dot {
    left: 22px !important;
    transform: translateX(-50%) !important;
  }
  .tl-row .tl-connector {
    left: 22px !important;
    width: 28px !important;
    transform-origin: left center;
  }
  .tl-row .tl-card {
    width: calc(100% - 54px) !important;
    max-width: none !important;
    margin-left: 54px !important;
    margin-right: 0 !important;
  }
  .tl-row[data-final="true"] .tl-card {
    width: calc(100% - 54px) !important;
  }
  .tl-row article {
    text-align: left !important;
    padding: 20px 18px !important;
    border-radius: 14px !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tl-card,
  .tl-row .tl-dot,
  .tl-connector {
    animation: none !important;
    transition: none !important;
  }
}
`,
        }}
      />
    </main>
  );
}

// ============================================================================
// Side panel — fixed left
// ============================================================================

function SidePanel({
  event,
  era,
  progress,
  idx,
  total,
  locale,
}: {
  event: Event;
  era: Era;
  progress: number;
  idx: number;
  total: number;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <>
      <div
        className="tl-side"
        style={{
          position: "fixed",
          left: "max(24px, calc(50% - 600px))",
          top: 112,
          zIndex: 25,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 10,
          padding: "14px 15px",
          background: "linear-gradient(180deg, rgba(8,8,8,0.76), rgba(8,8,8,0.52))",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.11)",
          borderRadius: 16,
          width: 120,
          boxShadow: "0 18px 44px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            fontFamily: INTER,
            fontSize: 10,
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.62)",
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {locale === "ko" ? era : ERA_LABEL_EN[era].toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontSize: 18,
            fontWeight: 800,
            color: ACCENT,
            letterSpacing: "-0.01em",
            lineHeight: 1.18,
            transition: "color 0.4s ease",
          }}
        >
          {locale === "ko" ? event.display.ko : event.display.en}
        </div>
        <div
          style={{
            fontSize: 12,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.68)",
            fontFamily: locale === "ko" ? KSANS : INTER,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {locale === "ko" ? event.title.ko : event.title.en}
        </div>
        <div
          style={{
            width: "100%",
            height: 4,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 999,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${progress * 100}%`,
              height: "100%",
              background: ACCENT,
              borderRadius: 999,
              transition: "width 0.2s ease",
            }}
          />
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontSize: 11,
            color: "rgba(255,255,255,0.58)",
            letterSpacing: "0.05em",
          }}
        >
          {idx + 1} / {total} · {Math.round(progress * 100)}%
        </div>
      </div>

      {/* Mobile top bar */}
      <div
        className="tl-mobile-bar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px 14px 76px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.4))",
          backdropFilter: "blur(8px)",
          zIndex: 20,
          gap: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.2em",
              fontFamily: INTER,
              fontWeight: 700,
            }}
          >
            {locale === "ko" ? era : ERA_LABEL_EN[era].toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 18,
              color: ACCENT,
              fontWeight: 800,
              fontFamily: INTER,
              marginTop: 2,
            }}
          >
            {locale === "ko" ? event.display.ko : event.display.en}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            height: 3,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            maxWidth: 160,
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: ACCENT,
              borderRadius: 2,
              transition: "width 0.2s ease",
            }}
          />
        </div>
      </div>
    </>
  );
}

// ============================================================================
// Hero
// ============================================================================

function Hero({
  locale,
  t,
}: {
  locale: "ko" | "en";
  t: (ko: string, en: string) => string;
}): ReactElement {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: INTER,
          fontSize: 14,
          letterSpacing: "0.4em",
          color: ACCENT,
          fontWeight: 700,
          marginBottom: 22,
        }}
      >
        WORLD HISTORY · {t("세계사 타임라인", "TIMELINE")}
      </div>
      <h1
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(34px, 6vw, 64px)",
          margin: 0,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          maxWidth: 900,
          color: "#f5f5f5",
        }}
      >
        {t("세계사 타임라인", "World History Timeline")}
      </h1>
      <p
        style={{
          marginTop: 22,
          color: "rgba(255,255,255,0.7)",
          fontSize: 18,
          maxWidth: 580,
          lineHeight: 1.6,
          fontFamily: locale === "ko" ? KSANS : INTER,
        }}
      >
        {t(
          "기원전 30만년부터 지금까지. 스크롤로 인류의 발자취를 따라가세요.",
          "From 300,000 BC to today. Scroll through the milestones of being human.",
        )}
      </p>
      <div
        style={{
          marginTop: 56,
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
          letterSpacing: "0.25em",
          animation: "tlReveal 1s ease 0.8s both",
        }}
      >
        ↓ {t("아래로", "SCROLL")}
      </div>
    </section>
  );
}

// ============================================================================
// Era divider — full-width header card between sections
// ============================================================================

function EraDivider({
  era,
  locale,
}: {
  era: Era;
  locale: "ko" | "en";
}): ReactElement {
  return (
    <div
      className="tl-card"
      style={{
        position: "relative",
        zIndex: 2,
        padding: "100px 0 60px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: INTER,
          fontSize: 14,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.4em",
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        {locale === "ko" ? "장의 시작" : "NEW CHAPTER"}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: "clamp(28px, 4.5vw, 48px)",
          fontWeight: 700,
          color: ACCENT,
          letterSpacing: "0.02em",
          textShadow: `0 0 24px ${ACCENT}33`,
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
          maxWidth: "100%",
          padding: "0 16px",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 36,
            height: 1,
            background: ACCENT,
            opacity: 0.55,
          }}
        />
        <span style={{ whiteSpace: "nowrap" }}>
          {locale === "ko" ? era : ERA_LABEL_EN[era]}
        </span>
        <span
          aria-hidden
          style={{
            width: 36,
            height: 1,
            background: ACCENT,
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Event row — alternating left/right with center connector
// ============================================================================

function EventRow({
  event,
  side,
  locale,
  registerRef,
  active,
}: {
  event: Event;
  side: "left" | "right";
  locale: "ko" | "en";
  registerRef: (node: HTMLDivElement | null) => void;
  active: boolean;
}): ReactElement {
  const isFinal = event.year === 2025;
  return (
    <div
      className="tl-row"
      data-side={side}
      data-active={active}
      data-final={isFinal}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 112px minmax(0, 1fr)",
        alignItems: "start",
        margin: isFinal ? "72px 0 56px" : "30px 0",
      }}
    >
      {/* Connector dot on the spine */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: isFinal ? -6 : 34,
          transform: "translateX(-50%)",
          width: isFinal ? 18 : 13,
          height: isFinal ? 18 : 13,
          borderRadius: "50%",
          background: ACCENT,
          boxShadow: `0 0 0 5px rgba(0,0,0,0.62), 0 0 20px ${ACCENT}66`,
          zIndex: 3,
        }}
        className="tl-dot"
      />
      <span
        aria-hidden
        className="tl-connector"
        style={{
          position: "absolute",
          top: 40,
          width: "min(42px, 4vw)",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${ACCENT}aa, transparent)`,
          opacity: 0.36,
          transform: "scaleX(0.82)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          zIndex: 2,
        }}
      />

      <div
        ref={registerRef}
        className="tl-card"
        data-active={active}
        style={{
          gridColumn: isFinal ? "1 / -1" : side === "left" ? "1" : "3",
          justifySelf: isFinal ? "center" : side === "left" ? "end" : "start",
          width: "100%",
          maxWidth: isFinal ? 620 : 420,
        }}
      >
        <EventCard event={event} side={isFinal ? "center" : side} locale={locale} isFinal={isFinal} />
      </div>
    </div>
  );
}

function EventCard({
  event,
  side,
  locale,
  isFinal = false,
}: {
  event: Event;
  side: "left" | "right" | "center";
  locale: "ko" | "en";
  isFinal?: boolean;
}): ReactElement {
  return (
    <article
      style={{
        position: "relative",
        background: isFinal
          ? "linear-gradient(145deg, rgba(251,191,36,0.16), rgba(0,0,0,0.58) 42%, rgba(0,0,0,0.72))"
          : "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.68))",
        border: isFinal ? `1px solid ${ACCENT}55` : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: isFinal ? "30px 30px" : "24px 24px",
        backdropFilter: "blur(12px)",
        boxShadow: isFinal
          ? `0 24px 80px rgba(0,0,0,0.52), 0 0 44px ${ACCENT}18, inset 0 1px 0 rgba(255,255,255,0.09)`
          : "0 16px 48px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06)",
        textAlign: side === "center" ? "center" : side,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, transparent 0 30%, rgba(255,255,255,0.05) 45%, transparent 62%), radial-gradient(circle at 80% 0%, rgba(251,191,36,0.11), transparent 34%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          fontFamily: INTER,
          fontSize: 13,
          letterSpacing: "0.22em",
          color: ACCENT,
          fontWeight: 700,
          marginBottom: 9,
        }}
      >
        {locale === "ko" ? event.display.ko : event.display.en}
      </div>
      <h2
        style={{
          position: "relative",
          fontFamily: SERIF,
          fontSize: isFinal ? "clamp(28px, 4vw, 42px)" : "clamp(21px, 2.4vw, 29px)",
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.28,
          letterSpacing: "-0.01em",
          color: "#f5f5f5",
          marginBottom: 13,
        }}
      >
        {locale === "ko" ? event.title.ko : event.title.en}
      </h2>
      <p
        style={{
          position: "relative",
          fontSize: 16,
          lineHeight: 1.78,
          color: "rgba(255,255,255,0.86)",
          margin: 0,
          marginBottom: 14,
          fontFamily: locale === "ko" ? KSANS : INTER,
        }}
      >
        {locale === "ko" ? event.desc.ko : event.desc.en}
      </p>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "11px 14px",
          background: "rgba(251,191,36,0.1)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: 10,
          fontSize: 15,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.82)",
          fontFamily: locale === "ko" ? KSANS : INTER,
          textAlign: "left",
        }}
      >
        <span aria-hidden style={{ flex: "0 0 auto", fontSize: 14, color: ACCENT }}>✦</span>
        <span>{locale === "ko" ? event.fact.ko : event.fact.en}</span>
      </div>
    </article>
  );
}

// ============================================================================
// Footer share
// ============================================================================

function FooterShare({
  t,
  locale,
}: {
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const [copied, setCopied] = useState(false);
  const text = useMemo(
    () =>
      t(
        "세계사 타임라인 완주! 기원전 30만년부터 지금까지.\n→ nolza.fun/games/timeline",
        "Walked through 300,000 years of human history.\n→ nolza.fun/games/timeline",
      ),
    [t],
  );
  const share = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      style={{
        marginTop: 100,
        padding: "44px 28px",
        textAlign: "center",
        background: "rgba(0,0,0,0.45)",
        border: `1px solid ${ACCENT}33`,
        borderRadius: 18,
        animation: "tlReveal 0.6s ease",
        maxWidth: 640,
        margin: "100px auto 0",
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 24,
          fontWeight: 700,
          color: ACCENT,
          marginBottom: 12,
        }}
      >
        {t("끝까지 도착했습니다.", "You made it to the present.")}
      </div>
      <p
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.7)",
          marginBottom: 24,
          lineHeight: 1.6,
          fontFamily: locale === "ko" ? KSANS : INTER,
        }}
      >
        {t(
          "30만년의 인류 역사 끝에 당신이 서 있습니다. 다음 줄은 당신이 씁니다.",
          "300,000 years of history end where you stand. The next line gets written by you.",
        )}
      </p>
      <button
        onClick={share}
        className="btn-press"
        style={{
          background: ACCENT,
          color: "#1a1a1a",
          border: "none",
          padding: "14px 28px",
          borderRadius: 999,
          fontWeight: 800,
          fontSize: 15,
          fontFamily: INTER,
          letterSpacing: "0.05em",
          cursor: "pointer",
          boxShadow: `0 8px 24px ${ACCENT}44`,
        }}
      >
        {copied ? t("복사됨 ✓", "Copied ✓") : t("공유하기", "Share")}
      </button>
    </div>
  );
}
