import { classifyCouple, hashString, mulberry32, pickClass, type Gender } from "@/lib/joseon";
import { decodeSharePayload } from "@/lib/share-result";

type PreviewLocale = "ko" | "en";

type SearchParamInput = Record<string, string | string[] | undefined>;

type CoupleSharePayload = {
  v: 1;
  name1: string;
  name2: string;
  gender1: Gender;
  gender2: Gender;
  locale?: PreviewLocale;
};

type ResultPreview = {
  title: string;
  description: string;
  imageAlt: string;
  imageUrl: string;
  locale: PreviewLocale;
  names: [string, string];
  resultTitle: string;
  teaser: string;
  url: string;
};

type JoseonCouplePreviewCopy = {
  id: string;
  titleKo: string;
  titleEn: string;
  summaryKo: (name1: string, name2: string) => string;
  summaryEn: (name1: string, name2: string) => string;
  teaserKo: string;
  teaserEn: string;
};

const MAX_NAME_LENGTH = 16;

const JOSEON_COUPLE_PREVIEWS: JoseonCouplePreviewCopy[] = [
  {
    id: "rainy-market",
    titleKo: "비 오는 장터의 인연",
    titleEn: "A Rainy Market Fate",
    summaryKo: (a, b) =>
      `${a}와 ${b}는 비 내리는 장터에서 스치듯 시작된 인연입니다. 이 만남은 우연일까요, 오래 남을 운명일까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b} meet like a passing moment in a rain-soaked market. Is it coincidence, or a fate that lingers?`,
    teaserKo: "비 오는 장터에서 시작된 인연",
    teaserEn: "A fate born in a rainy market",
  },
  {
    id: "moonlight-promise",
    titleKo: "달빛 아래 맺어진 약속",
    titleEn: "A Promise Beneath Moonlight",
    summaryKo: (a, b) =>
      `${a}와 ${b}는 달빛 아래 말하지 못한 마음을 남깁니다. 조용한 약속은 사랑이 될까요, 기다림이 될까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b} leave an unspoken heart beneath the moon. Will this quiet promise become love, or longing?`,
    teaserKo: "달빛 아래 남겨진 조용한 약속",
    teaserEn: "A quiet promise beneath moonlight",
  },
  {
    id: "palace-wall",
    titleKo: "궁궐 담장 너머의 마음",
    titleEn: "Beyond the Palace Wall",
    summaryKo: (a, b) =>
      `${a}와 ${b}는 궁궐의 담장처럼 가까우면서도 먼 인연입니다. 예법을 넘어 마음이 닿을 수 있을까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b} are close yet divided like a palace wall. Can a careful heart cross the rules of Joseon?`,
    teaserKo: "궁궐 담장 너머로 흔들리는 마음",
    teaserEn: "A heart beyond the palace wall",
  },
  {
    id: "late-summer",
    titleKo: "늦여름의 재회",
    titleEn: "A Late Summer Reunion",
    summaryKo: (a, b) =>
      `${a}와 ${b}는 엇갈린 계절 끝에서 다시 마주칩니다. 늦게 돌아온 이 인연은 이번엔 이어질 수 있을까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b} meet again at the end of a missed season. Can this late return become a second beginning?`,
    teaserKo: "엇갈린 계절 끝의 재회",
    teaserEn: "A reunion after a missed season",
  },
  {
    id: "folded-letter",
    titleKo: "오래 접어둔 편지",
    titleEn: "The Letter Long Folded Away",
    summaryKo: (a, b) =>
      `${a}와 ${b}의 인연은 오래 접어둔 편지처럼 천천히 열립니다. 늦게 닿은 진심은 무엇을 바꿀까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b}'s bond opens like a letter folded away for years. What changes when sincerity arrives late?`,
    teaserKo: "오래 접어둔 편지처럼 열린 마음",
    teaserEn: "A heart hidden like an old letter",
  },
  {
    id: "red-sunset",
    titleKo: "붉은 노을의 혼례",
    titleEn: "A Wedding Beneath the Red Sunset",
    summaryKo: (a, b) =>
      `${a}와 ${b}는 오해를 지나 붉은 노을 아래 같은 편에 섭니다. 이 혼례는 운명일까요, 선택일까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b} stand together beyond misunderstanding beneath a red sunset. Is this fate, or a choice?`,
    teaserKo: "붉은 노을 아래 같은 편이 된 두 사람",
    teaserEn: "Two hearts beneath a red sunset",
  },
  {
    id: "snowy-crossroad",
    titleKo: "눈 내리는 길목",
    titleEn: "The Snowy Crossroad",
    summaryKo: (a, b) =>
      `${a}와 ${b}는 눈 내리는 길목에서 서로를 기다립니다. 차가운 계절에도 이 마음은 남을 수 있을까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b} wait for each other at a snowy crossroad. Can this feeling survive the cold season?`,
    teaserKo: "눈 내리는 길목에서 기다린 마음",
    teaserEn: "A heart waiting at a snowy crossroad",
  },
  {
    id: "blue-silk",
    titleKo: "푸른 비단과 낡은 약속",
    titleEn: "Blue Silk and an Old Promise",
    summaryKo: (a, b) =>
      `${a}와 ${b}는 푸른 비단처럼 현실과 약속 사이에서 흔들립니다. 두 사람은 무엇을 함께 지키게 될까요?`,
    summaryEn: (a, b) =>
      `${a} and ${b} sway between reality and promise like blue silk. What will they choose to protect together?`,
    teaserKo: "푸른 비단처럼 흔들리는 약속",
    teaserEn: "A promise swaying like blue silk",
  },
];

function firstSearchParam(params: SearchParamInput, key: string): string | null {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function safeDisplayName(value: unknown): string {
  if (typeof value !== "string") return "";
  return Array.from(
    value
      .trim()
      .replace(/[\u0000-\u001f\u007f<>]/g, "")
      .replace(/^[\s"'`“”‘’「」『』!?.,，。！？]+|[\s"'`“”‘’「」『』!?.,，。！？]+$/g, "")
      .replace(/\s+/g, " "),
  )
    .slice(0, MAX_NAME_LENGTH)
    .join("")
    .trim();
}

function isGender(value: unknown): value is Gender {
  return value === "male" || value === "female";
}

function normalizeLocale(value: unknown): PreviewLocale {
  return value === "en" ? "en" : "ko";
}

function computeJoseonCouplePreviewIndex(
  name1: string,
  gender1: Gender,
  name2: string,
  gender2: Gender,
): number {
  const p1Class = pickClass(mulberry32(hashString(`${name1}|${gender1}|1`)), gender1);
  const p2Class = pickClass(mulberry32(hashString(`${name2}|${gender2}|2`)), gender2);
  const key = classifyCouple(p1Class.id, p2Class.id, gender1, gender2);
  const seedText = `${name1}|${name2}|${key}`;
  const rng = mulberry32(hashString(seedText));
  return Math.floor(rng() * JOSEON_COUPLE_PREVIEWS.length);
}

export function getJoseonCoupleSharePreview(encodedPayload: string | null): ResultPreview | null {
  const payload = decodeSharePayload<CoupleSharePayload>(encodedPayload);
  if (
    !payload ||
    payload.v !== 1 ||
    !isGender(payload.gender1) ||
    !isGender(payload.gender2)
  ) {
    return null;
  }

  const name1 = safeDisplayName(payload.name1);
  const name2 = safeDisplayName(payload.name2);
  if (!name1 || !name2) return null;

  const locale = normalizeLocale(payload.locale);
  const preview =
    JOSEON_COUPLE_PREVIEWS[
      computeJoseonCouplePreviewIndex(name1, payload.gender1, name2, payload.gender2)
    ] ?? JOSEON_COUPLE_PREVIEWS[0];

  const title =
    locale === "ko"
      ? `${name1} ❤️ ${name2}의 조선시대 인연 결과`
      : `${name1} ❤️ ${name2}'s Joseon Couple Result`;
  const description =
    locale === "ko" ? preview.summaryKo(name1, name2) : preview.summaryEn(name1, name2);
  const teaser = locale === "ko" ? preview.teaserKo : preview.teaserEn;
  const resultTitle = locale === "ko" ? preview.titleKo : preview.titleEn;
  const encoded = encodeURIComponent(encodedPayload ?? "");

  return {
    title,
    description,
    imageAlt: title,
    imageUrl: `/games/joseon-couple/share-og?s=${encoded}`,
    locale,
    names: [name1, name2],
    resultTitle,
    teaser,
    url: `/games/joseon-couple?s=${encoded}`,
  };
}

export function getShareMetadata(
  gameSlug: string,
  searchParams: SearchParamInput,
): ResultPreview | null {
  if (gameSlug !== "joseon-couple") return null;
  return getJoseonCoupleSharePreview(firstSearchParam(searchParams, "s"));
}
