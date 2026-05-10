// Era metadata for the Korean Rewind game.
// Index 0 = present day; higher index = further past.
// `font` is a CSS font-family string applied to the era's rendered output.

export type EraIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Era {
  index: EraIndex;
  yearLabel: string;        // "2025", "1947" etc — shown on the timeline
  nameKo: string;
  nameEn: string;
  blurbKo: string;          // one-line vibe description
  blurbEn: string;
  font: string;             // CSS font-family
}

export const ERAS: Era[] = [
  {
    index: 0,
    yearLabel: "2025",
    nameKo: "지금",
    nameEn: "Now",
    blurbKo: "줄임말과 외래어가 자연스러운 시대",
    blurbEn: "Abbreviations and loanwords feel native",
    font: "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif",
  },
  {
    index: 1,
    yearLabel: "2012",
    nameKo: "2010년대",
    nameEn: "2010s",
    blurbKo: "유행어 폭발기, 존맛탱·갓·인정",
    blurbEn: "Slang boom — 존맛탱, 갓, 인정",
    font: "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif",
  },
  {
    index: 2,
    yearLabel: "2003",
    nameKo: "2000년대 초반",
    nameEn: "Early 2000s",
    blurbKo: "이모티콘과 외계어, ^_^ 시대",
    blurbEn: "Emoticons and altspeak, ^_^ era",
    font: "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif",
  },
  {
    index: 3,
    yearLabel: "1995",
    nameKo: "PC통신 시대",
    nameEn: "PC Communication era",
    blurbKo: "하이텔·천리안, 정중한 통신체",
    blurbEn: "Hitel, Chollian — polite digital prose",
    font: "var(--font-noto-sans-kr), 'Noto Sans KR', sans-serif",
  },
  {
    index: 4,
    yearLabel: "1985",
    nameKo: "1980년대",
    nameEn: "1980s",
    blurbKo: "표준 한국어, 격식 있는 문어",
    blurbEn: "Standard Korean, formal written voice",
    font: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
  },
  {
    index: 5,
    yearLabel: "1935",
    nameKo: "일제강점기",
    nameEn: "Japanese Occupation",
    blurbKo: "한자 혼용, 옛 어휘가 살아있는 시기",
    blurbEn: "Hanja-mixed script, archaic vocabulary",
    font: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
  },
  {
    index: 6,
    yearLabel: "1905",
    nameKo: "개화기",
    nameEn: "Enlightenment era",
    blurbKo: "구한말 신문체, -노라·-도다",
    blurbEn: "Late-Joseon newspaper prose, -노라·-도다",
    font: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
  },
  {
    index: 7,
    yearLabel: "1750",
    nameKo: "조선 후기",
    nameEn: "Late Joseon",
    blurbKo: "한글 소설체, 고풍스러운 어미",
    blurbEn: "Hangul novel prose, archaic endings",
    font: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
  },
  {
    index: 8,
    yearLabel: "1447",
    nameKo: "훈민정음",
    nameEn: "Hunminjeongeum",
    blurbKo: "아래아·옛이응이 살아있던 창제 시기",
    blurbEn: "When ㆍ and ㆁ were still in use",
    font: "var(--font-noto-serif-kr), 'Noto Serif KR', serif",
  },
];

export const TOTAL_ERAS = ERAS.length;
