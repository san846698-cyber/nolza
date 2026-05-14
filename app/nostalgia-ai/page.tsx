"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type RelationType =
  | "Business"
  | "Client"
  | "Investor"
  | "Team"
  | "Family"
  | "Friend"
  | "Partner";

type MemoryKind = "Meeting" | "Meal" | "Call" | "Trip" | "Event" | "Gift" | "Note";

type Person = {
  id: string;
  name: string;
  role: string;
  relation: RelationType;
  birthday: string;
  tastes: string[];
  notes: string;
  lastSeen: string;
  photo: string;
};

type Memory = {
  id: string;
  personId: string;
  kind: MemoryKind;
  title: string;
  date: string;
  place: string;
  raw: string;
  summary: string;
  actions: string[];
  mood: string;
  image: string;
  importance: 1 | 2 | 3;
};

const PEOPLE: Person[] = [
  {
    id: "p1",
    name: "김민수",
    role: "B2B SaaS 창업자",
    relation: "Business",
    birthday: "03.12",
    tastes: ["위스키", "러닝", "일본 여행", "명확한 숫자"],
    notes: "가격 정책과 엔터프라이즈 세일즈에 관심이 많다. 소개 약속은 빠르게 팔로업하는 편.",
    lastSeen: "2026.05.10",
    photo:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p2",
    name: "박지영",
    role: "가족, 엄마",
    relation: "Family",
    birthday: "11.04",
    tastes: ["제주 여행", "담백한 한식", "수국", "조용한 카페"],
    notes: "검진 일정과 여행 계획을 미리 챙기면 좋아한다. 너무 늦은 전화는 피하기.",
    lastSeen: "2026.05.05",
    photo:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p3",
    name: "이수연",
    role: "브랜드 디자이너",
    relation: "Friend",
    birthday: "07.22",
    tastes: ["전시", "네롤리 향", "화이트 와인", "재즈 바"],
    notes: "작업 이야기를 할 때 컨셉 무드보드를 좋아한다. 선물은 향 관련 아이템이 잘 맞음.",
    lastSeen: "2026.04.28",
    photo:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
  },
];

const MEMORIES: Memory[] = [
  {
    id: "m1",
    personId: "p1",
    kind: "Meeting",
    title: "파트너십 가격 정책 미팅",
    date: "2026.05.10",
    place: "성수, 파란 간판 카페",
    raw: "민수와 B2B SaaS 가격 정책을 논의했다. 초기 고객에게 3개월 파일럿을 제안하고, 다음 주 투자자 한 명을 소개해주기로 했다. 민수는 러닝 대회를 준비 중이라고 했다.",
    summary:
      "B2B 가격 정책과 파일럿 구조를 정리했다. 다음 액션은 투자자 소개와 3개월 파일럿 제안서 공유.",
    actions: ["투자자 소개 메일 보내기", "3개월 파일럿 제안서 초안 공유"],
    mood: "집중적이고 실무적인 대화",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    importance: 3,
  },
  {
    id: "m2",
    personId: "p2",
    kind: "Trip",
    title: "제주 가족 여행 계획",
    date: "2026.05.05",
    place: "집",
    raw: "엄마가 가을 제주 여행을 가고 싶다고 했다. 수국이 보이는 조용한 숙소를 좋아하고, 음식은 자극적이지 않은 한식을 선호한다. 6월 검진 일정도 다시 확인해야 한다.",
    summary:
      "가을 제주 여행 후보를 찾아야 한다. 숙소 취향은 조용한 분위기와 수국, 음식은 담백한 한식.",
    actions: ["6월 검진 일정 확인", "제주 조용한 숙소 3곳 찾기"],
    mood: "따뜻하고 편안한 가족 대화",
    image:
      "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80",
    importance: 3,
  },
  {
    id: "m3",
    personId: "p3",
    kind: "Event",
    title: "전시 보고 와인 한 잔",
    date: "2026.04.28",
    place: "한남동 전시관",
    raw: "수연과 전시를 보고 화이트 와인을 마셨다. 네롤리 향수를 좋아한다고 했고, 최근에는 브랜드 리뉴얼 프로젝트 때문에 바쁘다고 했다.",
    summary:
      "수연의 최근 관심사는 브랜드 리뉴얼과 향. 다음 선물 후보는 네롤리 계열 향수나 전시 티켓.",
    actions: ["리뉴얼 프로젝트 안부 묻기", "생일 전 네롤리 향 선물 후보 저장"],
    mood: "가볍고 영감 있는 저녁",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    importance: 2,
  },
  {
    id: "m4",
    personId: "p1",
    kind: "Call",
    title: "투자자 소개 전 짧은 콜",
    date: "2026.04.17",
    place: "전화",
    raw: "민수가 일본 시장 진출 가능성을 물었다. 빠르게 실험하고 숫자로 판단하는 방식을 선호한다고 다시 확인했다.",
    summary:
      "민수는 일본 시장과 빠른 검증을 중요하게 본다. 소개 전 자료는 숫자 중심으로 준비하는 것이 좋다.",
    actions: ["일본 시장 가설 3줄 요약"],
    mood: "속도감 있는 체크인",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
    importance: 1,
  },
];

const relationOptions: RelationType[] = [
  "Business",
  "Client",
  "Investor",
  "Team",
  "Family",
  "Friend",
  "Partner",
];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function inferKind(text: string): MemoryKind {
  if (/회의|미팅|제안|투자|가격|파트너/i.test(text)) return "Meeting";
  if (/밥|점심|저녁|카페|와인|커피/i.test(text)) return "Meal";
  if (/전화|콜|통화/i.test(text)) return "Call";
  if (/여행|제주|숙소/i.test(text)) return "Trip";
  if (/생일|선물/i.test(text)) return "Gift";
  return "Note";
}

function summarize(text: string, person?: Person) {
  const clean = text.trim();
  const first = clean.split(/[.!?。]/)[0] || clean;
  const actionWords = ["해야", "보내", "공유", "확인", "소개", "찾기", "예약", "연락"];
  const actions = clean
    .split(/[.!?\n]/)
    .filter((line) => actionWords.some((word) => line.includes(word)))
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    summary: `${person ? person.name + "와 " : ""}${first.slice(0, 80)}${
      first.length > 80 ? "..." : ""
    }`,
    actions: actions.length ? actions : ["다음 만남 전에 이 기록 다시 보기"],
    mood: /가족|엄마|친구|추억|여행|생일/.test(clean)
      ? "개인적이고 따뜻한 맥락"
      : "실무적이고 관계 중심적인 맥락",
  };
}

export default function NostalgiaAiPage() {
  const [people, setPeople] = useState<Person[]>(PEOPLE);
  const [memories, setMemories] = useState<Memory[]>(MEMORIES);
  const [selectedId, setSelectedId] = useState("p1");
  const [mode, setMode] = useState<"All" | RelationType>("All");
  const [query, setQuery] = useState("민수랑 다음에 할 일");
  const [quickNote, setQuickNote] = useState("");
  const [newPerson, setNewPerson] = useState({ name: "", role: "", birthday: "", tastes: "" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedPeople = localStorage.getItem("nostalgia-ai-people");
        const savedMemories = localStorage.getItem("nostalgia-ai-memories");
        if (savedPeople) setPeople(JSON.parse(savedPeople));
        if (savedMemories) setMemories(JSON.parse(savedMemories));
      } catch {
        setPeople(PEOPLE);
        setMemories(MEMORIES);
      } finally {
        setHydrated(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("nostalgia-ai-people", JSON.stringify(people));
    localStorage.setItem("nostalgia-ai-memories", JSON.stringify(memories));
  }, [hydrated, people, memories]);

  const selected = people.find((person) => person.id === selectedId) ?? people[0];

  const selectedMemories = memories
    .filter((memory) => memory.personId === selected?.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const filteredPeople = mode === "All" ? people : people.filter((person) => person.relation === mode);

  const recall = useMemo(() => {
    const q = query.toLowerCase();
    const matchedPerson = people.find((person) => q.includes(person.name.toLowerCase().slice(0, 2)));
    const pool = matchedPerson ? memories.filter((memory) => memory.personId === matchedPerson.id) : memories;
    const scored = pool
      .map((memory) => {
        const person = people.find((item) => item.id === memory.personId);
        const haystack = `${person?.name} ${person?.tastes.join(" ")} ${person?.notes} ${memory.title} ${memory.place} ${memory.raw} ${memory.summary} ${memory.actions.join(" ")}`.toLowerCase();
        const score = q
          .split(/\s+/)
          .filter(Boolean)
          .reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
        return { memory, person, score };
      })
      .sort((a, b) => b.score - a.score || b.memory.date.localeCompare(a.memory.date));

    const best = scored[0];
    if (!best) return "아직 검색할 관계 기억이 없습니다.";

    const actionText = best.memory.actions[0] ? ` 다음 액션은 '${best.memory.actions[0]}'입니다.` : "";
    return `${best.person?.name ?? "이 사람"}와의 '${best.memory.title}' 기록이 가장 가깝습니다. ${best.memory.summary}${actionText}`;
  }, [memories, people, query]);

  function addQuickMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !quickNote.trim()) return;

    const ai = summarize(quickNote, selected);
    const nextMemory: Memory = {
      id: createId("m"),
      personId: selected.id,
      kind: inferKind(quickNote),
      title: quickNote.split(/[.!?\n]/)[0]?.slice(0, 28) || "새 관계 기록",
      date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
      place: /카페|성수|한남|제주|집/.exec(quickNote)?.[0] ?? "장소 미지정",
      raw: quickNote,
      summary: ai.summary,
      actions: ai.actions,
      mood: ai.mood,
      image:
        selected.relation === "Family" || selected.relation === "Friend"
          ? "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80"
          : "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      importance: quickNote.length > 80 ? 3 : 2,
    };

    setMemories((current) => [nextMemory, ...current]);
    setQuickNote("");
  }

  function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newPerson.name.trim()) return;

    const nextPerson: Person = {
      id: createId("p"),
      name: newPerson.name.trim(),
      role: newPerson.role.trim() || "새 관계",
      relation: "Business",
      birthday: newPerson.birthday.trim() || "미입력",
      tastes: newPerson.tastes
        .split(",")
        .map((taste) => taste.trim())
        .filter(Boolean),
      notes: "새로 추가된 관계입니다. 다음 만남 후 메모를 남겨보세요.",
      lastSeen: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
      photo:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
    };

    setPeople((current) => [nextPerson, ...current]);
    setSelectedId(nextPerson.id);
    setNewPerson({ name: "", role: "", birthday: "", tastes: "" });
  }

  const actionCount = memories.reduce((sum, memory) => sum + memory.actions.length, 0);
  const upcomingBirthdays = people.filter((person) => person.birthday !== "미입력").slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f6f2ea] text-[#17130f]">
      <section className="border-b border-[#17130f]/10 bg-[#ece3d4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-8 lg:px-10">
          <div className="flex min-h-[440px] flex-col justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 border border-[#17130f]/20 bg-white/55 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#7d3f2a]">
                Nostalgia AI MVP
              </div>
              <h1 className="max-w-3xl font-serif text-[44px] font-black leading-[1.02] tracking-normal text-[#17130f] md:text-[74px]">
                사람을 기억하는 AI 관계 메모리
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#584f46]">
                회의 기록, 생일, 취향, 약속, 가족과 친구의 추억을 한 사람의 프로필 안에
                정리합니다. 비즈니스 CRM의 실용성과 사적인 스크랩북의 온도를 함께 담은
                첫 MVP입니다.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Metric label="관계" value={`${people.length}`} />
              <Metric label="기억" value={`${memories.length}`} />
              <Metric label="액션" value={`${actionCount}`} />
            </div>
          </div>

          <div className="grid content-end gap-4">
            <div className="overflow-hidden border border-[#17130f]/15 bg-[#17130f] text-white shadow-2xl shadow-black/20">
              <div
                className="h-72 bg-cover bg-center"
                style={{ backgroundImage: `url(${selected?.photo})` }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#e5c76b]">오늘 다시 볼 사람</p>
                    <h2 className="mt-1 text-3xl font-black">{selected?.name}</h2>
                    <p className="mt-1 text-sm text-white/65">{selected?.role}</p>
                  </div>
                  <span className="border border-white/20 px-3 py-1 text-xs font-black">
                    {selected?.relation}
                  </span>
                </div>
                <div className="mt-5 grid gap-2 text-sm text-white/78">
                  <p>생일: {selected?.birthday}</p>
                  <p>취향: {selected?.tastes.join(", ")}</p>
                  <p>최근 만남: {selected?.lastSeen}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 md:grid-cols-[280px_minmax(0,1fr)_330px] md:px-8 lg:px-10">
        <aside className="grid content-start gap-4">
          <Panel title="관계 필터">
            <div className="grid grid-cols-2 gap-2">
              {(["All", ...relationOptions] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`min-h-10 border px-3 text-left text-xs font-black ${
                    mode === item
                      ? "border-[#17130f] bg-[#17130f] text-white"
                      : "border-[#17130f]/12 bg-white text-[#584f46]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="사람 목록">
            <div className="grid gap-2">
              {filteredPeople.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedId(person.id)}
                  className={`grid gap-1 border p-3 text-left ${
                    selected?.id === person.id
                      ? "border-[#7d3f2a] bg-[#fff8e8]"
                      : "border-[#17130f]/10 bg-white"
                  }`}
                >
                  <span className="text-base font-black">{person.name}</span>
                  <span className="text-xs font-bold text-[#7a7066]">{person.role}</span>
                  <span className="text-xs text-[#9a4f35]">{person.relation}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="새 관계 추가">
            <form onSubmit={addPerson} className="grid gap-2">
              <Input
                value={newPerson.name}
                onChange={(value) => setNewPerson((current) => ({ ...current, name: value }))}
                placeholder="이름"
              />
              <Input
                value={newPerson.role}
                onChange={(value) => setNewPerson((current) => ({ ...current, role: value }))}
                placeholder="관계/직함"
              />
              <Input
                value={newPerson.birthday}
                onChange={(value) => setNewPerson((current) => ({ ...current, birthday: value }))}
                placeholder="생일 예: 08.14"
              />
              <Input
                value={newPerson.tastes}
                onChange={(value) => setNewPerson((current) => ({ ...current, tastes: value }))}
                placeholder="취향, 관심사"
              />
              <button className="min-h-11 bg-[#17130f] px-4 text-sm font-black text-white">
                관계 저장
              </button>
            </form>
          </Panel>
        </aside>

        <section className="grid content-start gap-4">
          <Panel title="AI 회상 검색">
            <div className="grid gap-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-h-12 border border-[#17130f]/15 bg-white px-4 text-base font-bold outline-none focus:border-[#7d3f2a]"
                placeholder="예: 지영이가 좋아하는 숙소 취향"
              />
              <div className="border-l-4 border-[#7d3f2a] bg-[#fff8e8] p-4 text-sm font-semibold leading-7 text-[#3d332b]">
                {recall}
              </div>
            </div>
          </Panel>

          <Panel title={`${selected?.name ?? "선택된 사람"}의 관계 프로필`}>
            <div className="grid gap-4 md:grid-cols-[170px_minmax(0,1fr)]">
              <div
                className="min-h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${selected?.photo})` }}
              />
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-black">{selected?.name}</h2>
                    <p className="mt-1 text-sm font-bold text-[#6b6258]">{selected?.role}</p>
                  </div>
                  <span className="border border-[#17130f]/20 bg-white px-3 py-2 text-xs font-black">
                    {selected?.relation}
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium leading-7 text-[#584f46]">{selected?.notes}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected?.tastes.map((taste) => (
                    <span key={taste} className="bg-[#e6dccd] px-3 py-2 text-xs font-black text-[#584f46]">
                      {taste}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <form onSubmit={addQuickMemory} className="border border-[#17130f]/12 bg-[#17130f] p-4 text-white">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-black">플로팅 보이스 메모 시뮬레이션</h2>
              <span className="text-xs font-bold text-white/55">15초 기록 UX</span>
            </div>
            <textarea
              value={quickNote}
              onChange={(event) => setQuickNote(event.target.value)}
              className="min-h-28 w-full resize-none border border-white/15 bg-white/10 p-4 text-sm leading-7 text-white outline-none placeholder:text-white/40 focus:border-[#e5c76b]"
              placeholder={`${selected?.name ?? "이 사람"}와 방금 나눈 회의/식사/통화 내용을 편하게 적어보세요.`}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-white/58">
                저장하면 AI가 활동 유형, 요약, 다음 액션, 분위기를 자동 생성합니다.
              </p>
              <button className="min-h-11 bg-[#e5c76b] px-5 text-sm font-black text-[#17130f]">
                AI로 기록 저장
              </button>
            </div>
          </form>

          <div className="grid gap-4">
            {selectedMemories.map((memory) => (
              <article
                key={memory.id}
                className={`grid overflow-hidden border border-[#17130f]/12 bg-white ${
                  memory.importance === 3 ? "md:grid-cols-[1fr_1.15fr]" : "md:grid-cols-[190px_1fr]"
                }`}
              >
                <div
                  className={`bg-cover bg-center ${memory.importance === 3 ? "min-h-72" : "min-h-44"}`}
                  style={{ backgroundImage: `url(${memory.image})` }}
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#17130f] px-2 py-1 text-xs font-black text-white">
                      {memory.kind}
                    </span>
                    <span className="text-xs font-bold text-[#7a7066]">{memory.date}</span>
                    <span className="text-xs font-bold text-[#7a7066]">{memory.place}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-black">{memory.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-[#584f46]">{memory.summary}</p>
                  <div className="mt-4 grid gap-2">
                    {memory.actions.map((action) => (
                      <div key={action} className="border-l-2 border-[#9a4f35] pl-3 text-sm font-bold text-[#3d332b]">
                        {action}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs font-bold text-[#9a4f35]">{memory.mood}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="grid content-start gap-4">
          <Panel title="오늘의 관계 브리핑">
            <div className="grid gap-3">
              <Brief label="다음 액션" value={`${actionCount}개`} detail="회의 팔로업과 가족 일정이 섞여 있습니다." />
              <Brief label="최근 비즈니스" value="민수" detail="투자자 소개와 파일럿 제안서가 남아 있습니다." />
              <Brief label="개인 케어" value="엄마" detail="검진 일정과 제주 숙소를 챙기면 좋습니다." />
            </div>
          </Panel>

          <Panel title="생일과 취향">
            <div className="grid gap-3">
              {upcomingBirthdays.map((person) => (
                <div key={person.id} className="border border-[#17130f]/10 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <strong>{person.name}</strong>
                    <span className="text-sm font-black text-[#9a4f35]">{person.birthday}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-5 text-[#6b6258]">
                    {person.tastes.slice(0, 3).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="MVP 범위">
            <div className="grid gap-2 text-sm font-semibold leading-6 text-[#584f46]">
              <p>1. 사람 중심 프로필</p>
              <p>2. 회의/추억 기록</p>
              <p>3. 취향, 생일, 다음 액션</p>
              <p>4. AI 요약 시뮬레이션</p>
              <p>5. 자연어 회상 검색</p>
              <p>6. localStorage 저장</p>
            </div>
          </Panel>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[#17130f]/12 bg-[#fbf7ee] p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-black uppercase tracking-[0.12em] text-[#7d3f2a]">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#17130f]/12 bg-[#fbf7ee] p-4">
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#7a7066]">{label}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-10 border border-[#17130f]/12 bg-white px-3 text-sm font-semibold outline-none focus:border-[#7d3f2a]"
      placeholder={placeholder}
    />
  );
}

function Brief({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="border border-[#17130f]/10 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.12em] text-[#7a7066]">{label}</span>
        <strong className="text-lg">{value}</strong>
      </div>
      <p className="mt-2 text-xs font-semibold leading-5 text-[#6b6258]">{detail}</p>
    </div>
  );
}
