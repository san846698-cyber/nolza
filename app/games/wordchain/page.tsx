"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

const WORDS = [
  "가방","가족","가을","가위","가수","가지","간식","감자","개구리","개미","거리","거울","건강","건물","게임","결과","경기","경험","계단","계절",
  "고기","고양이","곤충","골프","공항","공원","공책","과일","과자","광고","교실","교통","구두","국가","국수","그림","글자","금요일","기억","기차",
  "기침","김밥","김치","꽃밭","나무","나비","나이","낙엽","날씨","남자","냉장고","노래","노력","농구","눈물","늑대","능력","다리","단어","달력",
  "담요","대학","도서관","도시","동물","동생","두뇌","등산","딸기","라디오","라면","레몬","로봇","리듬","마늘","마음","말씀","매미","머리","면접",
  "명동","모자","목걸이","무지개","문제","미국","미술","바나나","바다","바람","바위","박물관","발음","방학","배구","백화점","버스","번호","별빛","병원",
  "보석","본문","부엌","분필","비누","빈손","사과","사람","사진","산책","살구","삼각","새벽","색깔","생일","서울","선물","성공","세계","소금",
  "손목","송아지","수업","숙제","시간","시계","식당","신발","신호","실내","심리","아침","안경","야구","약속","양말","어른","얼굴","여름","역사",
  "영화","옥수수","온도","옷장","요리","우주","운동","원숭이","월요일","위치","유리","음악","의자","이불","인형","일기","임금","입학","자동차","자전거",
  "작가","장미","재미","저녁","전화","정원","제목","주말","주방","줄넘기","중요","지구","지도","직업","진짜","짐꾸리기","차량","책상","천국","청소",
  "체육","초콜릿","추억","축구","출근","친구","침대","카메라","커피","컴퓨터","코끼리","콜라","콩나물","클립","키위","타조","탁구","태양","토끼","통조림",
  "튤립","트럭","티셔츠","파도","파인애플","팔찌","페달","편지","평화","포도","표지","푸들","풍선","피아노","핑크","하늘","학교","학생","한국","항구",
  "해변","행복","햇살","향기","헬멧","호랑이","화면","환경","회사","후회","휴식","흰색","힘",
];

const byFirst: Record<string, string[]> = {};
for (const w of WORDS) {
  const f = w[0];
  (byFirst[f] ||= []).push(w);
}

type Turn = { word: string; by: "me" | "ai" };

export default function WordChain() {
  const [chain, setChain] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [strikes, setStrikes] = useState(0);
  const [done, setDone] = useState<"win" | "lose" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const used = useMemo(() => new Set(chain.map((t) => t.word)), [chain]);
  const lastChar = chain.length > 0 ? chain[chain.length - 1].word.slice(-1) : null;

  const aiPlay = (firstChar: string, currentUsed: Set<string>): string | null => {
    const cands = (byFirst[firstChar] || []).filter((w) => !currentUsed.has(w));
    if (cands.length === 0) return null;
    return cands[Math.floor(Math.random() * cands.length)];
  };

  const onStrike = () => {
    setStrikes((s) => {
      const next = s + 1;
      if (next >= 3) setDone("lose");
      return next;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (done || aiThinking) return;
    const word = input.trim();
    if (!word) return;
    if (word.length < 2) {
      setError("두 글자 이상이어야 해요");
      onStrike();
      return;
    }
    if (lastChar && word[0] !== lastChar) {
      setError(`"${lastChar}"로 시작해야 해요`);
      onStrike();
      return;
    }
    if (used.has(word)) {
      setError("이미 사용한 단어예요");
      onStrike();
      return;
    }
    const meTurn: Turn = { word, by: "me" };
    setChain((c) => [...c, meTurn]);
    setInput("");
    setError(null);
    setAiThinking(true);

    setTimeout(() => {
      const newUsed = new Set([...used, word]);
      const aiWord = aiPlay(word.slice(-1), newUsed);
      if (!aiWord) {
        setChain((c) => [...c, meTurn]);
        setDone("win");
      } else {
        setChain((c) => [...c, { word: aiWord, by: "ai" }]);
      }
      setAiThinking(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 700);
  };

  const restart = () => {
    setChain([]);
    setInput("");
    setStrikes(0);
    setDone(null);
    setError(null);
  };

  const handleShare = async () => {
    const text =
      done === "win"
        ? `AI 끝말잇기 이겼다! 총 ${chain.length}턴 🏆 → nolza.fun/games/wordchain`
        : `AI 끝말잇기 ${chain.length}턴 만에 졌다 🥲 → nolza.fun/games/wordchain`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-bg pb-32">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xs text-gray-400 hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
          <div className="text-xs text-gray-500">
            오답 <span className="font-bold text-accent">{strikes}/3</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-10 md:px-8 md:pt-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black md:text-5xl">
            끝말잇기 <span className="text-accent">vs AI</span>
          </h1>
          <p className="mt-3 text-sm text-gray-400 md:text-base">
            AI와 끝말잇기 대결. 3번 틀리면 패배합니다. (단어 사전: {WORDS.length}개)
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
          {chain.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              아무 단어로 시작해보세요
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {chain.map((t, i) => (
                <li
                  key={i}
                  className={`rounded-xl border px-4 py-3 ${
                    t.by === "me"
                      ? "border-accent/30 bg-accent/5 text-right"
                      : "border-border bg-bg"
                  }`}
                >
                  <span className="text-xs text-gray-500">
                    {t.by === "me" ? "나" : "AI"}
                  </span>
                  <span className="ml-2 text-base font-bold">{t.word}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!done && (
          <form onSubmit={submit} className="mt-4 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={aiThinking}
              placeholder={lastChar ? `"${lastChar}"로 시작...` : "첫 단어 입력"}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-base text-white outline-none focus:border-accent disabled:opacity-50"
              maxLength={10}
              autoFocus
            />
            <button
              type="submit"
              disabled={aiThinking || !input.trim()}
              className="rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-30"
            >
              {aiThinking ? "AI 생각중..." : "제출"}
            </button>
          </form>
        )}
        {error && <div className="mt-3 text-sm text-accent">{error}</div>}

        {done && (
          <div className="mt-6 rounded-2xl border border-accent/40 bg-card p-6 md:p-8">
            <div className="text-xs text-accent">
              {done === "win" ? "🏆 승리!" : "😅 패배"}
            </div>
            <div className="mt-2 text-3xl font-black md:text-4xl">
              {done === "win"
                ? "AI가 단어를 못 찾았어요!"
                : `오답 3번 누적. 총 ${chain.length}턴`}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={restart} type="button" className="rounded-full border border-border bg-bg px-6 py-3 text-sm font-medium text-white hover:border-accent hover:text-accent">
                ↻ 다시 도전
              </button>
              <button onClick={handleShare} type="button" className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:opacity-90">
                {copied ? "✓ 복사됐어요" : "📋 결과 공유하기"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link href="/" className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-gray-300 hover:border-accent hover:text-accent">
            ← 놀자.fun으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
