"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import { trackResultView, trackRetryClick, trackShareClick, trackTestStart } from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";
import {
  classifyCouple,
  hashString,
  mulberry32,
  pickClass,
  pickFromArray,
  pickJoseonName,
  PROFESSIONS,
  type ClassInfo,
  type Gender,
  type JoseonName,
} from "@/lib/joseon";

type Phase = "input" | "result";
type CoupleSharePayload = {
  v: 1;
  name1: string;
  name2: string;
  gender1: Gender;
  gender2: Gender;
  locale?: SimpleLocale;
};

const HANJI = "#f5f0e0";
const HANJI_DEEP = "#ebdfb8";
const DANCHEONG_RED = "#C41E3A";
const DANCHEONG_BLUE = "#2E4A6B";
const GOLD = "#B8960C";
const INK = "#1a1a1a";
const INK_SOFT = "#3a2f22";
const SUBTLE = "rgba(26,26,26,0.55)";
const RULE = "rgba(26,26,26,0.18)";
const SERIF = "var(--font-noto-serif-kr), 'Noto Serif KR', 'Nanum Myeongjo', serif";

type Person = {
  cls: ClassInfo;
  name: JoseonName;
  role: { ko: string; en: string };
  original: string;
  gender: Gender;
};

type CoupleResult = {
  p1: Person;
  p2: Person;
  romance: RomanceResult;
  score: number;
};

type RomanceContext = {
  name1: string;
  name2: string;
  joseonName1: string;
  joseonName2: string;
  role1: string;
  role2: string;
  class1: string;
  class2: string;
  score: number;
};

type SceneCard = {
  titleKo: string;
  titleEn: string;
  textKo: string;
  textEn: string;
};

type RomanceResult = {
  titleKo: string;
  titleEn: string;
  interpretationKo: string;
  interpretationEn: string;
  storyKo: string[];
  storyEn: string[];
  scenes: SceneCard[];
  dramaLineKo: string;
  dramaLineEn: string;
  shareLineKo: string;
  shareLineEn: string;
};

type RomanceArchetype = {
  titleKo: string;
  titleEn: string;
  build: (ctx: RomanceContext) => Omit<RomanceResult, "titleKo" | "titleEn">;
};

function buildPerson(originalName: string, gender: Gender, salt: number): Person {
  const seed = hashString(`${originalName}|${gender}|${salt}`);
  const rng = mulberry32(seed);
  const cls = pickClass(rng, gender);
  const name = pickJoseonName(rng, gender, originalName);
  const role = pickFromArray(rng, PROFESSIONS[cls.id]);
  return { cls, name, role, original: originalName, gender };
}

function scoreInterpretationKo(score: number): string {
  if (score >= 90) {
    return `${score}점\n두 사람은 처음부터 같은 마음으로 걸어온 인연은 아니었습니다.\n그러나 서로를 알아본 뒤에는, 세상의 소란보다 서로의 침묵을 더 믿게 되는 인연입니다.`;
  }
  if (score >= 80) {
    return `${score}점\n두 사람은 닮은 듯 다르고, 다른 듯 오래 머무는 인연입니다.\n마음이 어긋나는 날도 있지만, 결국 서로에게 돌아올 길을 잃지 않습니다.`;
  }
  if (score >= 70) {
    return `${score}점\n완벽히 쉬운 인연은 아니었습니다.\n다만 서로의 부족한 계절을 채워주며, 천천히 깊어지는 쪽에 가까운 사랑입니다.`;
  }
  return `${score}점\n두 사람의 길에는 망설임과 기다림이 많습니다.\n그래도 한 번 마음에 새기면 쉽게 지워지지 않는, 오래 접어둔 편지 같은 인연입니다.`;
}

function scoreInterpretationEn(score: number): string {
  if (score >= 90) {
    return `${score} pts\nThis bond did not begin perfectly, but once recognized, it becomes quieter and stronger than the noise around it.`;
  }
  if (score >= 80) {
    return `${score} pts\nThey are alike and different in equal measure, but they rarely lose the road back to each other.`;
  }
  if (score >= 70) {
    return `${score} pts\nNot an easy fate, but one that fills each other's missing season and deepens slowly.`;
  }
  return `${score} pts\nA hesitant, waiting kind of bond, like a letter folded away and never forgotten.`;
}

const ROMANCE_ARCHETYPES: RomanceArchetype[] = [
  {
    titleKo: "비 오는 장터의 인연",
    titleEn: "A Rainy Market Fate",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 여름, 한양의 장터에는 유난히 긴 비가 내렸습니다.`,
        `${c.name1}에게는 조선의 이름으로 ${c.joseonName1}이(가) 주어졌고, 그는 ${c.class1}의 신분으로 ${c.role1}의 일을 맡고 있었습니다. ${c.name2}는 ${c.joseonName2}이라 불리며, ${c.class2}로서 ${c.role2}의 하루를 조용히 견디고 있었습니다.`,
        `두 사람은 젖은 처마 아래에서 처음 마주쳤습니다. 소란스러운 장터 한가운데서도, 이상하게 서로의 눈빛만은 비에 번지지 않고 선명했습니다.`,
        `${c.joseonName1}은(는) 먼저 현실을 보았고, ${c.joseonName2}은(는) 먼저 마음을 보았습니다. 그래서 두 사람의 말은 자주 어긋났지만, 헤어진 뒤에는 서로의 마지막 표정이 오래 남았습니다.`,
        `어느 날 ${c.joseonName2}이(가) 곤란한 일을 당했을 때, ${c.joseonName1}은(는) 아무 말 없이 사람들 앞에 섰습니다. 그제야 ${c.joseonName2}은(는) 알았습니다. 이 사람은 마음을 말로 주는 사람이 아니라, 행동으로 남기는 사람이라는 것을.`,
        `비가 깊어질수록 두 사람은 더 조심스러워졌습니다. 신분과 형편, 서로 다른 삶의 방식이 몇 번이나 등을 돌리게 했지만, 밤이 오면 이상하게 같은 달을 바라보았습니다.`,
        `결국 두 사람은 화려한 고백보다 조용한 선택으로 서로에게 남았습니다. 비가 그친 장터 끝에서 ${c.joseonName1}은(는) 기다렸고, ${c.joseonName2}은(는) 처음으로 망설이지 않고 그 곁으로 걸어갔습니다.`,
      ],
      storyEn: [
        `That summer, rain lingered over the market streets of Hanyang.`,
        `${c.name1}, known in Joseon as ${c.joseonName1}, lived as ${c.role1}. ${c.name2}, called ${c.joseonName2}, carried the days of ${c.role2}.`,
        `They first met beneath a wet eave. In the crowded market, only each other's presence seemed clear.`,
        `${c.joseonName1} looked first at reality; ${c.joseonName2} looked first at the heart. Their words often missed each other, but their expressions stayed.`,
        `When ${c.joseonName2} was cornered, ${c.joseonName1} stood forward without a word. That was when ${c.joseonName2} understood: this was someone who loved through action.`,
        `The rain grew deeper, and so did their caution. Status, livelihood, and different ways of loving turned them away more than once.`,
        `Yet at the end of the market, after the rain stopped, ${c.joseonName1} waited. For the first time, ${c.joseonName2} walked toward that waiting without hesitation.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "두 사람은 조용한 곳이 아니라 사람이 많은 장터에서 먼저 스쳤습니다. 소란 속에서도 서로의 존재만은 이상하게 또렷했습니다.",
          textEn: "They did not meet in silence, but in a crowded market. Even there, each other felt strangely clear.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "말보다 행동이 먼저 닿았습니다. 누군가의 편이 되어주는 작은 순간이, 두 사람의 마음을 바꾸었습니다.",
          textEn: "Action reached before words. A small act of standing beside someone changed everything.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "크게 불타오르기보다 오래 남는 쪽에 가까운 사랑입니다. 한 번 마음에 들이면 쉽게 지워지지 않는, 조선의 늦여름 같은 인연입니다.",
          textEn: "This is not a love that burns loudly, but one that remains. A late-summer Joseon fate.",
        },
      ],
      dramaLineKo: "그날 비가 그치지 않았다면, 나는 그대를 지나치지 않았을 것입니다.",
      dramaLineEn: "Had the rain stopped sooner, I might have passed you by.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「비 오는 장터의 인연」.\n그해 여름, 두 사람의 인연은 젖은 처마 아래에서 조용히 시작되었다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "A Rainy Market Fate." Their story began quietly beneath a rain-soaked eave.`,
    }),
  },
  {
    titleKo: "달빛 아래 맺어진 약속",
    titleEn: "A Promise Beneath Moonlight",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 가을, 궁궐 뒤편 담장에는 달빛이 유난히 낮게 내려앉았습니다.`,
        `${c.name1}, 조선의 이름 ${c.joseonName1}은(는) ${c.class1}의 신분으로 ${c.role1}의 자리를 지키고 있었습니다. ${c.name2}, 곧 ${c.joseonName2}은(는) ${c.class2}로서 ${c.role2}의 길을 걷고 있었습니다.`,
        `두 사람은 등불이 꺼진 뒤의 작은 길목에서 처음 말을 나누었습니다. 처음 나눈 말은 짧았지만, 말하지 않은 마음이 오히려 더 길었습니다.`,
        `${c.joseonName1}은(는) 쉽게 다가서지 못했고, ${c.joseonName2} 또한 마음을 먼저 내보이지 않았습니다. 그래서 두 사람의 사랑은 큰 소리 대신, 접어둔 편지와 오래 머문 시선으로 자랐습니다.`,
        `어느 밤, ${c.joseonName1}은(는) 달빛 아래에서 약속했습니다. 지금은 모든 것을 말할 수 없어도, 언젠가 같은 길 위에서 기다리겠다고.`,
        `하지만 세상은 두 사람을 쉽게 놓아주지 않았습니다. 지켜야 할 이름과 감춰야 할 마음 사이에서, 두 사람은 몇 번이나 서로를 모른 척해야 했습니다.`,
        `마침내 다시 만난 밤, ${c.joseonName2}은(는) 오래 품었던 편지를 꺼냈습니다. 달빛은 그대로였고, 두 사람은 그제야 말하지 못한 시간이 사랑이었다는 것을 알았습니다.`,
      ],
      storyEn: [
        `That autumn, moonlight settled low along the palace wall.`,
        `${c.name1}, known as ${c.joseonName1}, stood in the place of ${c.role1}. ${c.name2}, called ${c.joseonName2}, walked the path of ${c.role2}.`,
        `They first spoke on a narrow path after the lanterns went out. Their words were brief, but the silence was long.`,
        `Neither came close easily. Their love grew through folded letters and glances that stayed longer than they should.`,
        `One night beneath the moon, ${c.joseonName1} promised to wait on the same road someday.`,
        `The world did not release them easily. Between names to protect and hearts to hide, they had to pretend not to know each other.`,
        `When they met again, ${c.joseonName2} unfolded the old letter. Only then did they understand that all the unsaid time had been love.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "두 사람은 등불이 꺼진 뒤의 길목에서 조심스럽게 가까워졌습니다. 낮보다 밤이, 말보다 침묵이 두 사람에게 더 솔직했습니다.",
          textEn: "They drew close after the lanterns dimmed. Night and silence were more honest than day or words.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "건네지 못한 편지 한 장이 마음을 붙들었습니다. 말하지 못했기에 더 오래 남는 약속이 되었습니다.",
          textEn: "An undelivered letter held their hearts. What could not be said became a lasting promise.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "쉽게 드러낼 수 없는 마음이지만, 한 번 정하면 오래 지키는 인연입니다. 두 사람은 조용히, 그러나 분명히 서로에게 남습니다.",
          textEn: "A hidden love, but once chosen, it stays. Quiet, certain, and lasting.",
        },
      ],
      dramaLineKo: "말하지 못한 마음은 결국 가장 오래 남는 약속이 되었습니다.",
      dramaLineEn: "The heart I could not speak became the promise that lasted longest.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「달빛 아래 맺어진 약속」.\n말하지 못한 마음이 가장 오래 남는 약속이 되었다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "A Promise Beneath Moonlight." What went unsaid became the longest promise.`,
    }),
  },
  {
    titleKo: "궁궐 담장 너머의 마음",
    titleEn: "Beyond the Palace Wall",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 봄, 궁궐의 살구꽃은 담장 너머로 먼저 피었습니다.`,
        `${c.joseonName1}은(는) ${c.name1}의 조선 이름으로, ${c.class1}의 신분과 ${c.role1}의 책임을 지닌 사람이었습니다. ${c.joseonName2}은(는) ${c.name2}의 또 다른 이름으로, ${c.class2}의 자리에서 ${c.role2}의 하루를 살고 있었습니다.`,
        `두 사람은 궁궐 안팎을 오가는 문 앞에서 처음 서로를 보았습니다. 가까이 있었지만 가까워질 수 없는 거리, 그것이 두 사람의 첫 장면이었습니다.`,
        `처음에는 예법이 마음을 막았습니다. 고개를 숙여야 할 때와 눈을 들어야 할 때가 정해져 있어, 두 사람은 서로를 바라보는 일조차 조심스러웠습니다.`,
        `그러나 ${c.joseonName2}이(가) 어려운 선택 앞에 섰을 때, ${c.joseonName1}은(는) 자신의 이름을 걸고 그 곁에 섰습니다. 그 순간 담장은 두 사람 사이를 가르는 벽이 아니라, 함께 넘어야 할 계절이 되었습니다.`,
        `세상은 두 사람에게 침묵을 요구했습니다. 하지만 마음은 이상하게도 침묵 속에서 더 또렷해졌고, 짧은 인사 하나가 긴 고백처럼 남았습니다.`,
        `마지막 장면에서 두 사람은 같은 담장 아래에 섰습니다. 살구꽃이 떨어지는 소리만 들리는 가운데, ${c.joseonName1}과(와) ${c.joseonName2}은(는) 처음으로 같은 방향을 바라보았습니다.`,
      ],
      storyEn: [
        `That spring, apricot blossoms bloomed beyond the palace wall.`,
        `${c.joseonName1}, the Joseon name of ${c.name1}, carried the duty of ${c.role1}. ${c.joseonName2}, the other name of ${c.name2}, lived each day as ${c.role2}.`,
        `They first saw each other near a palace gate. Near, yet impossible to approach.`,
        `At first, ritual blocked the heart. Even a glance had to be careful.`,
        `When ${c.joseonName2} faced a difficult choice, ${c.joseonName1} stood beside them with their own name at stake.`,
        `The world demanded silence, but the heart grew clearer inside it.`,
        `In the final scene, they stood below the same wall. As blossoms fell, they looked in the same direction for the first time.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "궁궐 문 앞, 가까운 듯 먼 거리에서 시작된 인연입니다. 서로를 바라보는 일조차 조심스러웠습니다.",
          textEn: "A bond that began near a palace gate, close and far at once.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "누군가 자기 이름을 걸고 곁에 서주는 순간, 마음은 더 이상 숨을 곳을 찾지 못했습니다.",
          textEn: "When someone risked their name to stand beside the other, the heart could no longer hide.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "규칙과 거리 사이에서 자라는 사랑입니다. 쉽게 뜨거워지지는 않아도, 한 번 피면 오래 지지 않습니다.",
          textEn: "A love grown between distance and rules. Slow to bloom, slow to fade.",
        },
      ],
      dramaLineKo: "담장 하나가 우리를 갈라놓아도, 같은 달빛은 막지 못했습니다.",
      dramaLineEn: "A wall could divide us, but it could not stop the same moonlight.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「궁궐 담장 너머의 마음」.\n가까워질 수 없던 거리에서, 마음은 더 선명해졌다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "Beyond the Palace Wall." Distance only made the heart clearer.`,
    }),
  },
  {
    titleKo: "늦여름의 재회",
    titleEn: "A Late Summer Reunion",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 늦여름, 매미 소리가 잦아들 무렵 두 사람은 다시 만났습니다.`,
        `${c.name1}은(는) ${c.joseonName1}이라는 이름으로 ${c.role1}의 삶을 살고 있었고, ${c.name2}는 ${c.joseonName2}이라는 이름으로 ${c.role2}의 시간을 견디고 있었습니다.`,
        `처음 만났던 날, 두 사람은 서로에게 다정하지 못했습니다. 해야 할 말은 많았지만, 둘 다 먼저 마음을 꺼내는 법을 몰랐습니다.`,
        `그렇게 계절 하나가 지나갔고, 남은 것은 돌아보지 않은 길과 보내지 못한 안부뿐이었습니다. 하지만 이상하게도 좋은 풍경을 볼 때마다 두 사람은 서로를 떠올렸습니다.`,
        `재회는 갑작스러웠습니다. ${c.joseonName2}이(가) 낡은 다리 위에 서 있던 날, ${c.joseonName1}은(는) 오래전 하지 못한 말을 품은 채 그 앞에 나타났습니다.`,
        `이번에는 달랐습니다. 두 사람은 서로를 바꾸려 하지 않고, 각자의 상처가 어디서 시작되었는지 들여다보았습니다.`,
        `해가 기울자 강물 위로 붉은 빛이 번졌습니다. ${c.joseonName1}과(와) ${c.joseonName2}은(는) 지난 계절을 탓하지 않고, 다시 만난 이 계절을 오래 바라보았습니다.`,
      ],
      storyEn: [
        `In late summer, as the cicadas quieted, they met again.`,
        `${c.name1} lived as ${c.joseonName1}, carrying the life of ${c.role1}. ${c.name2} endured time as ${c.joseonName2}, a ${c.role2}.`,
        `At first, they were not gentle to each other. There was much to say, but neither knew how to begin.`,
        `A season passed, leaving only roads not taken and greetings never sent.`,
        `The reunion came suddenly. On an old bridge, ${c.joseonName1} appeared before ${c.joseonName2} with the words once left unsaid.`,
        `This time was different. They did not try to change each other; they looked at where the hurt began.`,
        `As red light spread over the river, they stopped blaming the past and looked long at the season that returned them.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "첫 만남은 서툴렀고, 그래서 더 오래 남았습니다. 다정하지 못했던 말들이 뒤늦게 마음을 건드렸습니다.",
          textEn: "The first meeting was clumsy, and therefore unforgettable.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "다시 만난 순간, 두 사람은 아직 끝나지 않은 마음을 알아보았습니다. 늦었지만 늦지 않은 장면이었습니다.",
          textEn: "When they met again, they recognized a feeling that had not ended.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "타이밍이 느린 사랑입니다. 그러나 한 번 돌아오면, 지나간 계절까지 품고 오래 이어집니다.",
          textEn: "A love with slow timing, but one that returns carrying every season before it.",
        },
      ],
      dramaLineKo: "그대를 만난 뒤로, 나는 매일 같은 길을 다른 마음으로 걷게 되었습니다.",
      dramaLineEn: "After meeting you, I walked the same road with a different heart every day.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「늦여름의 재회」.\n엇갈린 계절 끝에서, 두 사람은 다시 서로를 알아보았다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "A Late Summer Reunion." At the end of a missed season, they recognized each other again.`,
    }),
  },
  {
    titleKo: "오래 접어둔 편지",
    titleEn: "The Letter Long Folded Away",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 겨울이 오기 전, 한 통의 편지가 오래 접힌 채 서랍 안에 남아 있었습니다.`,
        `${c.joseonName1}이라 불린 ${c.name1}은(는) ${c.class1}의 신분으로 ${c.role1}의 일을 했고, ${c.joseonName2}라 불린 ${c.name2}는 ${c.class2}로서 ${c.role2}의 이름을 지키고 있었습니다.`,
        `두 사람의 첫 만남은 붓끝에서 시작되었습니다. 같은 문장을 다르게 읽은 두 사람은 서로의 생각이 낯설면서도 이상하게 그리웠습니다.`,
        `${c.joseonName1}은(는) 마음을 곧장 말하지 못했고, ${c.joseonName2}은(는) 너무 쉽게 믿고 싶지 않았습니다. 그래서 마음은 말이 되지 못하고, 편지의 여백에 남았습니다.`,
        `어느 날 작은 오해가 두 사람을 멀어지게 했습니다. 서로에게 닿지 못한 말들은 밤마다 다시 쓰였고, 찢지 못한 편지는 오래 품은 약속이 되었습니다.`,
        `시간이 지나 ${c.joseonName2}은(는) 그 편지를 읽게 되었습니다. 한 글자마다 늦은 진심이 묻어 있었고, 그제야 두 사람은 침묵도 사랑의 한 방식이었음을 알았습니다.`,
        `마지막에는 답장이 도착했습니다. 눈 내리기 전의 차가운 바람 속에서, ${c.joseonName1}은(는) 봉투를 열고 아주 오래 참았던 미소를 지었습니다.`,
      ],
      storyEn: [
        `Before winter arrived, a letter remained folded in a drawer.`,
        `${c.name1}, called ${c.joseonName1}, lived as ${c.role1}; ${c.name2}, called ${c.joseonName2}, guarded the name of ${c.role2}.`,
        `Their first meeting began at the tip of a brush. They read the same sentence differently and found that difference unforgettable.`,
        `${c.joseonName1} could not speak directly, and ${c.joseonName2} could not trust too easily. Their feelings stayed in the margins of letters.`,
        `A small misunderstanding pulled them apart. Words that failed to arrive were rewritten every night.`,
        `When ${c.joseonName2} finally read the letter, every line carried a late sincerity.`,
        `In the end, a reply arrived. In the cold before snow, ${c.joseonName1} opened the envelope and smiled for the first time in a long while.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "두 사람은 문장 하나를 사이에 두고 가까워졌습니다. 같은 글을 다르게 읽는 마음이 서로를 궁금하게 만들었습니다.",
          textEn: "They grew close through a single sentence, each reading it differently.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "늦게 도착한 편지가 두 사람의 시간을 다시 이어주었습니다. 진심은 늦어도 사라지지 않았습니다.",
          textEn: "A late letter tied their time together again. Sincerity had not disappeared.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "말보다 오래 남는 글의 인연입니다. 서툴러도 진심을 끝내 전하는 쪽에 가까운 사랑입니다.",
          textEn: "A bond of written words, slow but sincere to the end.",
        },
      ],
      dramaLineKo: "건네지 못한 편지는, 결국 그대에게 가기 위해 오래 기다린 마음이었습니다.",
      dramaLineEn: "The letter I could not send was only a heart waiting to reach you.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「오래 접어둔 편지」.\n늦게 닿은 진심이 두 사람의 계절을 다시 열었다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "The Letter Long Folded Away." A late truth reopened their season.`,
    }),
  },
  {
    titleKo: "붉은 노을의 혼례",
    titleEn: "A Wedding Beneath the Red Sunset",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 가을, 마을 어귀에는 붉은 노을이 오래 머물렀습니다.`,
        `${c.name1}은(는) ${c.joseonName1}이라는 이름으로 ${c.role1}의 길을 걸었고, ${c.name2}는 ${c.joseonName2}이라는 이름으로 ${c.role2}의 하루를 살았습니다.`,
        `처음 두 사람은 서로를 오해했습니다. ${c.joseonName1}은(는) 너무 차분해 보였고, ${c.joseonName2}은(는) 너무 단단해 보여서 누구도 먼저 마음을 묻지 못했습니다.`,
        `하지만 함께 어려운 일을 지나며 두 사람은 알게 되었습니다. 서로의 고집은 멀어지기 위한 벽이 아니라, 소중한 것을 지키기 위한 방식이었다는 것을.`,
        `혼례가 가까워질수록 두 사람은 더 많이 흔들렸습니다. 누군가는 이 인연을 쉽게 말했고, 누군가는 두 사람의 차이를 오래 걱정했습니다.`,
        `해가 지는 마당 끝에서 ${c.joseonName1}은(는) ${c.joseonName2}의 손을 놓지 않았습니다. 붉은 노을 아래, 두 사람은 완벽한 닮음보다 끝까지 함께하기로 한 마음을 택했습니다.`,
      ],
      storyEn: [
        `That autumn, red sunset lingered at the village edge.`,
        `${c.name1} walked as ${c.joseonName1}, a ${c.role1}; ${c.name2} lived as ${c.joseonName2}, a ${c.role2}.`,
        `At first they misunderstood each other. One seemed too calm, the other too firm.`,
        `Through hardship, they learned that stubbornness was not a wall, but a way of protecting what mattered.`,
        `As the wedding neared, the world worried over their differences.`,
        `At sunset, ${c.joseonName1} did not let go of ${c.joseonName2}'s hand. They chose not perfect sameness, but staying.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "두 사람은 첫눈에 알아본 인연이라기보다, 오래 바라본 뒤 이해하게 되는 인연입니다.",
          textEn: "Not love recognized at first sight, but understood after a long look.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "서로의 고집 뒤에 숨어 있던 진심을 보았을 때, 두 사람의 마음은 처음으로 같은 쪽을 향했습니다.",
          textEn: "When they saw the sincerity behind each other's stubbornness, their hearts turned the same way.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "갈등 뒤에 더 단단해지는 인연입니다. 쉽게 흔들려도, 쉽게 놓지는 않는 사랑입니다.",
          textEn: "A bond strengthened after conflict; easily shaken, not easily released.",
        },
      ],
      dramaLineKo: "그대와 내가 같아서가 아니라, 달라도 함께 걷고 싶어 혼례를 올립니다.",
      dramaLineEn: "I marry you not because we are the same, but because I wish to walk with you though we differ.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「붉은 노을의 혼례」.\n오해를 지나, 두 사람은 끝까지 함께하기로 마음먹었다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "A Wedding Beneath the Red Sunset." Beyond misunderstanding, they chose to stay.`,
    }),
  },
  {
    titleKo: "눈 내리는 길목",
    titleEn: "The Snowy Crossroad",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 겨울, 한양의 길목에는 눈이 조용히 쌓였습니다.`,
        `${c.joseonName1}은(는) ${c.name1}의 조선 이름으로 ${c.class1}의 신분과 ${c.role1}의 책임을 지고 있었습니다. ${c.joseonName2}은(는) ${c.name2}의 조선 이름으로 ${c.class2}의 자리와 ${c.role2}의 삶을 견디고 있었습니다.`,
        `두 사람은 눈발 속에서 처음 스쳤습니다. 차가운 바람이 옷깃을 파고들었지만, 이상하게도 그 짧은 인사는 오래 따뜻했습니다.`,
        `사랑은 빠르게 다가오지 않았습니다. ${c.joseonName1}은(는) 조심스러웠고, ${c.joseonName2}은(는) 쉽게 기대지 않았습니다.`,
        `어느 날 길이 막히고 모두가 흩어졌을 때, 두 사람은 서로를 기다렸습니다. 기다림은 말보다 느렸지만, 말보다 정확했습니다.`,
        `눈이 그친 뒤의 길목에서 ${c.joseonName1}과(와) ${c.joseonName2}은(는) 나란히 걸었습니다. 발자국은 작았지만, 같은 방향으로 오래 이어졌습니다.`,
      ],
      storyEn: [
        `That winter, snow settled quietly at a Hanyang crossroad.`,
        `${c.joseonName1}, the Joseon name of ${c.name1}, carried the duty of ${c.role1}. ${c.joseonName2}, the Joseon name of ${c.name2}, endured the life of ${c.role2}.`,
        `They first passed each other in falling snow. The wind was cold, but the brief greeting stayed warm.`,
        `Love did not arrive quickly. One was careful; the other did not lean easily.`,
        `When the road closed and everyone scattered, they waited for each other.`,
        `After the snow stopped, they walked side by side. Their footprints were small, but they continued in the same direction.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "차가운 길목에서 시작된 인연입니다. 짧은 인사가 오래 남을 만큼, 두 사람은 서로에게 낯설고도 따뜻했습니다.",
          textEn: "A bond born at a cold crossroad, where a brief greeting stayed warm.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "기다림이 마음을 증명했습니다. 서두르지 않는 사람이 오히려 가장 오래 곁에 남았습니다.",
          textEn: "Waiting proved the heart. The one who did not hurry stayed the longest.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "차가운 계절을 함께 버티는 사랑입니다. 화려하지 않아도, 곁을 지키는 힘이 깊습니다.",
          textEn: "A love that survives winter together, quiet but deeply loyal.",
        },
      ],
      dramaLineKo: "눈이 길을 지워도, 그대에게 가는 마음만은 지워지지 않았습니다.",
      dramaLineEn: "Even when snow erased the road, it could not erase the heart going to you.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「눈 내리는 길목」.\n차가운 계절에도, 두 사람은 서로를 기다렸다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "The Snowy Crossroad." Even in winter, they waited for each other.`,
    }),
  },
  {
    titleKo: "푸른 비단과 낡은 약속",
    titleEn: "Blue Silk and an Old Promise",
    build: (c) => ({
      interpretationKo: scoreInterpretationKo(c.score),
      interpretationEn: scoreInterpretationEn(c.score),
      storyKo: [
        `그해 봄, 한양의 포목전에는 푸른 비단이 바람에 흔들리고 있었습니다.`,
        `${c.name1}은(는) ${c.joseonName1}이라는 이름으로 ${c.role1}의 현실을 살았고, ${c.name2}는 ${c.joseonName2}이라는 이름으로 ${c.role2}의 몫을 감당했습니다.`,
        `두 사람은 비단 값을 두고 처음 말을 섞었습니다. 말은 담담했지만, 서로가 쉽게 물러서지 않는 사람이라는 것을 단번에 알아보았습니다.`,
        `${c.joseonName1}은(는) 마음보다 살림을 먼저 생각했고, ${c.joseonName2}은(는) 계산보다 사람의 온기를 먼저 보았습니다. 그래서 두 사람은 자주 부딪혔지만, 이상하게도 함께 있으면 하루가 덜 막막했습니다.`,
        `어느 날 오래된 약속 하나가 두 사람 앞에 놓였습니다. 지키기에는 버겁고 버리기에는 아픈 약속이었습니다.`,
        `그때 ${c.joseonName1}은(는) 푸른 비단을 접어 ${c.joseonName2}에게 건넸습니다. 화려한 말 대신, 앞으로의 계절을 함께 견디겠다는 조용한 표시였습니다.`,
        `마지막에 두 사람은 같은 가게의 문을 열었습니다. 바람에 흔들리는 비단 사이로, 낡은 약속은 더 이상 짐이 아니라 함께 지키는 이름이 되었습니다.`,
      ],
      storyEn: [
        `That spring, blue silk moved in the wind at a Hanyang fabric shop.`,
        `${c.name1} lived as ${c.joseonName1}, carrying the reality of ${c.role1}; ${c.name2} lived as ${c.joseonName2}, bearing the share of ${c.role2}.`,
        `They first spoke over the price of silk. Their words were calm, but both recognized a person who would not easily step back.`,
        `${c.joseonName1} thought first of livelihood; ${c.joseonName2} saw warmth before calculation. They clashed often, yet life felt less bleak together.`,
        `One day an old promise stood before them, too heavy to keep and too painful to abandon.`,
        `${c.joseonName1} folded blue silk and handed it to ${c.joseonName2}; not a grand confession, but a quiet sign of enduring the seasons together.`,
        `In the end, they opened the same shop door. The old promise became not a burden, but a name they protected together.`,
      ],
      scenes: [
        {
          titleKo: "첫 만남",
          titleEn: "First Meeting",
          textKo: "두 사람은 푸른 비단 앞에서 처음 말을 섞었습니다. 서로의 현실감과 온기가 같은 자리에서 부딪혔습니다.",
          textEn: "They first spoke before blue silk, where practicality and warmth met.",
        },
        {
          titleKo: "마음이 움직인 순간",
          titleEn: "The Moment",
          textKo: "말이 아니라 건네는 물건 하나로 마음이 닿았습니다. 함께 버티겠다는 뜻은 조용할수록 선명했습니다.",
          textEn: "A single offered object carried the heart. The quieter the promise, the clearer it was.",
        },
        {
          titleKo: "이 인연의 결말",
          titleEn: "The Ending",
          textKo: "현실을 함께 짊어지는 사랑입니다. 낭만보다 생활에 가깝지만, 그래서 더 오래 곁에 남습니다.",
          textEn: "A love that carries reality together; closer to daily life than fantasy, and therefore lasting.",
        },
      ],
      dramaLineKo: "비단은 접히면 자국이 남고, 마음은 접어두면 약속이 남습니다.",
      dramaLineEn: "Folded silk keeps a crease; a folded heart keeps a promise.",
      shareLineKo: `${c.name1}와(과) ${c.name2}의 조선 로맨스는 「푸른 비단과 낡은 약속」.\n현실을 지나, 두 사람은 함께 지킬 이름을 만들었다.`,
      shareLineEn: `${c.name1} and ${c.name2}'s Joseon romance: "Blue Silk and an Old Promise." Through reality, they made a promise to keep together.`,
    }),
  },
];

function buildRomanceResult(p1: Person, p2: Person, score: number, seedText: string): RomanceResult {
  const rng = mulberry32(hashString(seedText));
  const archetype = pickFromArray(rng, ROMANCE_ARCHETYPES);
  const ctx: RomanceContext = {
    name1: p1.original,
    name2: p2.original,
    joseonName1: p1.name.display,
    joseonName2: p2.name.display,
    role1: p1.role.ko,
    role2: p2.role.ko,
    class1: p1.cls.ko,
    class2: p2.cls.ko,
    score,
  };
  const built = archetype.build(ctx);
  return {
    titleKo: archetype.titleKo,
    titleEn: archetype.titleEn,
    ...built,
  };
}

function computeCouple(
  n1: string,
  g1: Gender,
  n2: string,
  g2: Gender,
): CoupleResult {
  const p1 = buildPerson(n1, g1, 1);
  const p2 = buildPerson(n2, g2, 2);
  const key = classifyCouple(p1.cls.id, p2.cls.id, p1.gender, p2.gender);
  const baseScoreByKey: Record<ReturnType<typeof classifyCouple>, number> = {
    "yangban-gisaeng": 88,
    "yangban-yangban": 92,
    "merchant-farmer": 78,
    "military-yangban": 84,
    "yangban-nobi": 73,
    "royal-yangban": 86,
    "merchant-merchant": 82,
    "farmer-farmer": 90,
    "jungin-jungin": 87,
    default: 75,
  };
  const tweakSeed = hashString(`${n1}|${n2}`);
  const tweak = (mulberry32(tweakSeed)() * 14) - 7;
  const score = Math.max(60, Math.min(99, Math.round(baseScoreByKey[key] + tweak)));
  const romance = buildRomanceResult(p1, p2, score, `${n1}|${n2}|${key}`);

  return { p1, p2, romance, score };
}

export default function JoseonCouplePage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("input");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [gender1, setGender1] = useState<Gender>("male");
  const [gender2, setGender2] = useState<Gender>("female");
  const [result, setResult] = useState<CoupleResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [stamping, setStamping] = useState(false);
  const [isSharedResult, setIsSharedResult] = useState(false);

  useEffect(() => {
    if (result) {
      trackResultView("joseon-couple", result.romance.titleEn);
    }
  }, [result]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = decodeSharePayload<CoupleSharePayload>(
      new URLSearchParams(window.location.search).get("s"),
    );
    const genders: Gender[] = ["male", "female"];
    if (
      !payload ||
      payload.v !== 1 ||
      !payload.name1?.trim() ||
      !payload.name2?.trim() ||
      !genders.includes(payload.gender1) ||
      !genders.includes(payload.gender2)
    ) {
      return;
    }
    const n1 = payload.name1.trim();
    const n2 = payload.name2.trim();
    const restoreId = window.setTimeout(() => {
      setName1(n1);
      setName2(n2);
      setGender1(payload.gender1);
      setGender2(payload.gender2);
      setResult(computeCouple(n1, payload.gender1, n2, payload.gender2));
      setPhase("result");
      setIsSharedResult(true);
    }, 0);
    return () => window.clearTimeout(restoreId);
  }, []);

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const n1 = name1.trim();
      const n2 = name2.trim();
      if (!n1 || !n2) return;
      trackTestStart("joseon-couple", "Joseon Couple Compatibility");
      setIsSharedResult(false);
      setStamping(true);
      setTimeout(() => {
        setResult(computeCouple(n1, gender1, n2, gender2));
        setPhase("result");
        setStamping(false);
      }, 150);
    },
    [name1, gender1, name2, gender2],
  );

  const handleReset = useCallback(() => {
    trackRetryClick("joseon-couple", "compatibility");
    setPhase("input");
    setResult(null);
    setName1("");
    setName2("");
    setGender1("male");
    setGender2("female");
    setIsSharedResult(false);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", "/games/joseon-couple");
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!result) return;
    const title = locale === "ko" ? result.romance.titleKo : result.romance.titleEn;
    const shareLine = locale === "ko" ? result.romance.shareLineKo : result.romance.shareLineEn;
    trackShareClick("joseon-couple", "compatibility", result.romance.titleEn);
    const url = buildShareUrl("/games/joseon-couple", {
      v: 1,
      name1: result.p1.original,
      name2: result.p2.original,
      gender1: result.p1.gender,
      gender2: result.p2.gender,
      locale,
    } satisfies CoupleSharePayload);
    const text = t(
      `${result.p1.original}와(과) ${result.p2.original}의 조선 로맨스는 「${title}」, ${result.score}점.\n` +
        `${shareLine}\n` +
        `${url}`,
      `${result.p1.original} and ${result.p2.original}'s Joseon romance: "${title}", ${result.score} pts.\n` +
        `${shareLine}\n` +
        `${url}`,
    );
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [locale, result, t]);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [phase]);

  return (
    <main
      style={{
        minHeight: "100svh",
        background: HANJI,
        color: INK,
        fontFamily: SERIF,
        position: "relative",
        paddingBottom: 100,
        overflow: "hidden",
      }}
    >
      <HanjiTexture />
      <SansuBackdrop />
      <DancheongTopBorder />
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          left: 16,
          top: 32,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          fontSize: 22,
          color: DANCHEONG_RED,
          textDecoration: "none",
          background: "rgba(245,240,224,0.85)",
          backdropFilter: "blur(4px)",
          border: `1px solid ${RULE}`,
        }}
      >
        ←
      </Link>
      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: phase === "input" ? "center" : "flex-start",
          padding: "80px 16px 20px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
      >
        {phase === "input" && (
          <InputView
            name1={name1}
            setName1={setName1}
            name2={name2}
            setName2={setName2}
            gender1={gender1}
            setGender1={setGender1}
            gender2={gender2}
            setGender2={setGender2}
            onSubmit={handleSubmit}
            stamping={stamping}
            t={t}
          />
        )}

        {phase === "result" && result && (
          <ResultView
            result={result}
            locale={locale}
            t={t}
            onShare={handleShare}
            onReset={handleReset}
            copied={copied}
            isSharedResult={isSharedResult}
          />
        )}
      </div>

      <AdMobileSticky />

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes scrollUnroll {
  0%   { opacity: 0; transform: translateY(-6px) scaleY(0.96); }
  100% { opacity: 1; transform: translateY(0) scaleY(1); }
}
@keyframes inkBloom {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes sealStamp {
  0%   { transform: scale(1.4) rotate(-6deg); opacity: 0; }
  60%  { transform: scale(0.95) rotate(1deg); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
@keyframes lotusBloom {
  0%   { transform: scale(0.85) rotate(-8deg); opacity: 0; }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
.jc-scroll {
  animation: scrollUnroll 0.32s cubic-bezier(.2,.7,.2,1) forwards;
  transform-origin: top center;
  will-change: opacity, transform;
}
.jc-ink {
  opacity: 0;
  animation: inkBloom 0.28s ease-out forwards;
  animation-delay: calc(var(--jc-i, 0) * 35ms + 80ms);
  will-change: opacity, transform;
}
.jc-lotus { animation: lotusBloom 0.4s ease-out 100ms forwards; opacity: 0; }
.jc-seal { animation: sealStamp 0.3s cubic-bezier(.3,.7,.3,1.4) forwards; }
.jc-stamp-btn:hover .jc-stamp-inner { transform: rotate(-3deg) scale(1.03); }
.jc-stamp-btn:active .jc-stamp-inner { transform: rotate(2deg) scale(0.96); }
@media (prefers-reduced-motion: reduce) {
  .jc-scroll, .jc-ink, .jc-lotus, .jc-seal { animation-duration: 1ms !important; animation-delay: 0ms !important; }
}
`,
        }}
      />
    </main>
  );
}

/* ---------- Decorative ---------- */

function HanjiTexture(): ReactElement {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.5,
        backgroundImage:
          "radial-gradient(circle at 12% 18%, rgba(184,150,12,0.08), transparent 35%)," +
          "radial-gradient(circle at 88% 70%, rgba(46,74,107,0.06), transparent 40%)," +
          "radial-gradient(circle at 50% 100%, rgba(196,30,58,0.05), transparent 50%)",
      }}
    />
  );
}

function SansuBackdrop(): ReactElement {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 1200"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.1,
        zIndex: 0,
      }}
    >
      <path
        d="M 0 700 Q 80 600 160 660 T 320 640 Q 400 580 480 650 T 640 630 Q 720 590 800 660 L 800 800 L 0 800 Z"
        fill={INK}
        opacity="0.6"
      />
      <path
        d="M 0 780 Q 100 700 200 760 T 400 740 Q 500 690 600 750 T 800 730 L 800 880 L 0 880 Z"
        fill={INK}
        opacity="0.4"
      />
      <g fill="none" stroke={INK} strokeWidth="1.5" opacity="0.7">
        <path d="M 80 200 q 30 -20 60 0 q 30 -20 60 0 q 30 -20 60 0" />
        <path d="M 560 280 q 30 -20 60 0 q 30 -20 60 0 q 30 -20 60 0" />
      </g>
      <g stroke={INK} strokeWidth="2" fill="none" opacity="0.7">
        <path d="M 120 700 L 120 540" strokeWidth="3" />
        <path d="M 120 600 q -30 -20 -50 -10 M 120 580 q 30 -25 55 -12 M 120 555 q -25 -18 -45 -8 M 120 540 q 25 -10 35 0" />
      </g>
      <circle cx="680" cy="120" r="32" fill={DANCHEONG_RED} opacity="0.5" />
    </svg>
  );
}

function DancheongTopBorder(): ReactElement {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 18,
        zIndex: 30,
        backgroundImage:
          `repeating-linear-gradient(90deg, ${DANCHEONG_RED} 0 14px, ${GOLD} 14px 18px, ${DANCHEONG_BLUE} 18px 32px, ${GOLD} 32px 36px)`,
        boxShadow: `0 1px 0 ${INK} inset, 0 -1px 0 ${INK} inset, 0 2px 4px rgba(0,0,0,0.08)`,
      }}
    />
  );
}

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }): ReactElement {
  const map: Record<string, React.CSSProperties> = {
    tl: { top: 24, left: 8, transform: "rotate(0deg)" },
    tr: { top: 24, right: 8, transform: "scaleX(-1)" },
    bl: { bottom: 8, left: 8, transform: "scaleY(-1)" },
    br: { bottom: 8, right: 8, transform: "scale(-1,-1)" },
  };
  return (
    <svg
      aria-hidden
      width="64"
      height="64"
      viewBox="0 0 64 64"
      style={{ position: "fixed", zIndex: 20, opacity: 0.85, ...map[position] }}
    >
      <path d="M 4 4 L 60 4 L 60 12 L 12 12 L 12 60 L 4 60 Z" fill={DANCHEONG_RED} />
      <path d="M 12 12 L 56 12 L 56 16 L 16 16 L 16 56 L 12 56 Z" fill={GOLD} />
      <path d="M 18 18 L 50 18 L 50 22 L 22 22 L 22 50 L 18 50 Z" fill={DANCHEONG_BLUE} />
      <circle cx="34" cy="34" r="3" fill={DANCHEONG_RED} />
    </svg>
  );
}

/* ---------- Input ---------- */

function InputView({
  name1,
  setName1,
  name2,
  setName2,
  gender1,
  setGender1,
  gender2,
  setGender2,
  onSubmit,
  stamping,
  t,
}: {
  name1: string;
  setName1: (v: string) => void;
  name2: string;
  setName2: (v: string) => void;
  gender1: Gender;
  setGender1: (g: Gender) => void;
  gender2: Gender;
  setGender2: (g: Gender) => void;
  onSubmit: (e?: FormEvent) => void;
  stamping: boolean;
  t: (ko: string, en: string) => string;
}): ReactElement {
  const ready = name1.trim() && name2.trim();
  return (
    <div className="jc-scroll" style={{ maxWidth: 720, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 24,
            letterSpacing: "0.4em",
            color: DANCHEONG_RED,
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          緣 分
        </div>
        <div
          aria-hidden
          style={{ width: 50, height: 1.5, background: INK, margin: "8px auto" }}
        />
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: SUBTLE,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
          }}
        >
          {t("조선시대 커플 시뮬레이터", "JOSEON COUPLE SIMULATOR")}
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            margin: "14px 0 6px",
            color: INK,
            fontFamily: SERIF,
          }}
        >
          {t("우리가 조선의 연인이었다면?", "What if we were Joseon lovers?")}
        </h1>
        <p style={{ fontSize: 14, color: INK_SOFT, fontFamily: SERIF }}>
          {t("신분을 넘어선 운명적 사랑", "A fateful love beyond social class")}
        </p>
      </div>

      <form onSubmit={onSubmit}>
        {/* Two scrolls facing each other */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 14,
            alignItems: "center",
          }}
        >
          <PersonScroll
            name={name1}
            setName={setName1}
            gender={gender1}
            setGender={setGender1}
            placeholder={t("첫 번째", "First")}
            side="left"
            t={t}
          />

          <LotusOrnament />

          <PersonScroll
            name={name2}
            setName={setName2}
            gender={gender2}
            setGender={setGender2}
            placeholder={t("두 번째", "Second")}
            side="right"
            t={t}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <SealButton
            ready={!!ready}
            stamping={stamping}
            label={t("운명 확인하기", "Reveal Our Fate")}
          />
        </div>
      </form>

      <p
        style={{
          marginTop: 20,
          fontSize: 13,
          color: SUBTLE,
          lineHeight: 1.6,
          fontFamily: SERIF,
          textAlign: "center",
        }}
      >
        {t(
          "신분 차이가 클수록 더 흥미로운 이야기가 나옵니다",
          "Larger class differences make for more dramatic tales",
        )}
      </p>
    </div>
  );
}

function PersonScroll({
  name,
  setName,
  gender,
  setGender,
  placeholder,
  side,
  t,
}: {
  name: string;
  setName: (v: string) => void;
  gender: Gender;
  setGender: (g: Gender) => void;
  placeholder: string;
  side: "left" | "right";
  t: (ko: string, en: string) => string;
}): ReactElement {
  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${HANJI} 0%, ${HANJI_DEEP} 100%)`,
        border: `1.5px solid ${INK}`,
        borderRadius: 4,
        padding: "20px 14px 16px",
        boxShadow: `inset 0 0 0 4px ${HANJI}, inset 0 0 0 5px ${GOLD}`,
        minWidth: 0,
      }}
    >
      {/* scroll caps */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -10,
          left: -6,
          right: -6,
          height: 14,
          background: `linear-gradient(180deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 3,
          boxShadow: `inset 0 1px 0 ${GOLD}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -10,
          left: -6,
          right: -6,
          height: 14,
          background: `linear-gradient(0deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 3,
          boxShadow: `inset 0 -1px 0 ${GOLD}`,
        }}
      />
      <div
        style={{
          textAlign: "center",
          fontFamily: SERIF,
          fontSize: 12,
          letterSpacing: "0.3em",
          color: DANCHEONG_RED,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        {side === "left" ? "其 一" : "其 二"}
      </div>

      <input
        type="text"
        autoComplete="off"
        maxLength={30}
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          marginTop: 10,
        }}
      >
        <HanbokTile
          selected={gender === "male"}
          onClick={() => setGender("male")}
          type="male"
          label={t("남", "M")}
        />
        <HanbokTile
          selected={gender === "female"}
          onClick={() => setGender("female")}
          type="female"
          label={t("여", "F")}
        />
      </div>
    </div>
  );
}

function HanbokTile({
  selected,
  onClick,
  type,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  type: "male" | "female";
  label: string;
}): ReactElement {
  const fillBody = type === "male" ? DANCHEONG_BLUE : DANCHEONG_RED;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: selected ? HANJI_DEEP : HANJI,
        color: INK,
        border: `1.5px solid ${selected ? DANCHEONG_RED : RULE}`,
        borderRadius: 4,
        padding: "8px 4px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: SERIF,
        transition: "all 0.18s",
        boxShadow: selected ? `inset 0 0 0 2px ${GOLD}` : "none",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 44 44" aria-hidden>
        <circle cx="22" cy="11" r="6" fill={INK_SOFT} />
        {type === "male" ? (
          <>
            <ellipse cx="22" cy="6" rx="11" ry="2.5" fill={INK} />
            <rect x="19" y="2.5" width="6" height="4" fill={INK} />
            <path d="M 8 36 L 10 22 Q 22 17 34 22 L 36 36 Z" fill={fillBody} />
            <path d="M 14 36 L 18 42 L 26 42 L 30 36 Z" fill={INK_SOFT} />
            <rect x="11" y="28" width="22" height="2" fill={GOLD} />
          </>
        ) : (
          <>
            <path d="M 16 8 Q 22 3 28 8 L 28 12 L 16 12 Z" fill={INK} />
            <path d="M 12 22 Q 22 19 32 22 L 30 28 L 14 28 Z" fill={fillBody} />
            <path d="M 8 42 Q 8 32 14 28 L 30 28 Q 36 32 36 42 Z" fill={DANCHEONG_BLUE} />
          </>
        )}
      </svg>
      <span>{label}</span>
    </button>
  );
}

function LotusOrnament(): ReactElement {
  return (
    <div
      className="jc-lotus"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
        {/* Lotus petals */}
        <g>
          <ellipse cx="24" cy="14" rx="6" ry="10" fill={DANCHEONG_RED} opacity="0.85" />
          <ellipse cx="14" cy="22" rx="6" ry="10" fill={DANCHEONG_RED} opacity="0.85" transform="rotate(-50 14 22)" />
          <ellipse cx="34" cy="22" rx="6" ry="10" fill={DANCHEONG_RED} opacity="0.85" transform="rotate(50 34 22)" />
          <ellipse cx="18" cy="32" rx="5" ry="9" fill={DANCHEONG_RED} opacity="0.7" transform="rotate(-30 18 32)" />
          <ellipse cx="30" cy="32" rx="5" ry="9" fill={DANCHEONG_RED} opacity="0.7" transform="rotate(30 30 32)" />
          <circle cx="24" cy="22" r="5" fill={GOLD} />
          <circle cx="24" cy="22" r="2" fill={INK} />
        </g>
      </svg>
      <div
        aria-hidden
        style={{
          fontFamily: SERIF,
          fontSize: 18,
          color: DANCHEONG_RED,
          fontWeight: 900,
          letterSpacing: "0.05em",
        }}
      >
        ❤
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 11,
          color: SUBTLE,
          fontWeight: 700,
          letterSpacing: "0.2em",
        }}
      >
        緣
      </div>
    </div>
  );
}

function SealButton({
  ready,
  stamping,
  label,
}: {
  ready: boolean;
  stamping: boolean;
  label: string;
}): ReactElement {
  return (
    <button
      type="submit"
      disabled={!ready || stamping}
      className="jc-stamp-btn"
      style={{
        background: "transparent",
        border: "none",
        cursor: ready && !stamping ? "pointer" : "default",
        opacity: ready ? 1 : 0.45,
        position: "relative",
        padding: "8px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className={`jc-stamp-inner ${stamping ? "jc-seal" : ""}`}
        style={{
          width: 84,
          height: 84,
          borderRadius: 12,
          background: DANCHEONG_RED,
          border: `3px solid ${DANCHEONG_RED}`,
          boxShadow:
            "inset 0 0 0 4px rgba(245,240,224,0.95), 0 6px 16px rgba(196,30,58,0.4)," +
            "0 0 0 1px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SERIF,
          color: HANJI,
          fontWeight: 900,
          fontSize: 22,
          transition: "transform 0.18s",
          textShadow: "0 1px 0 rgba(0,0,0,0.25)",
          lineHeight: 1.05,
          textAlign: "center",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        緣分
      </div>
      <span
        style={{
          marginLeft: 14,
          fontFamily: SERIF,
          fontSize: 16,
          fontWeight: 700,
          color: INK,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* ---------- Result ---------- */

function ResultView({
  result,
  locale,
  t,
  onShare,
  onReset,
  copied,
  isSharedResult,
}: {
  result: CoupleResult;
  locale: SimpleLocale;
  t: (ko: string, en: string) => string;
  onShare: () => void;
  onReset: () => void;
  copied: boolean;
  isSharedResult: boolean;
}): ReactElement {
  const { p1, p2, romance, score } = result;
  const title = locale === "ko" ? romance.titleKo : romance.titleEn;
  const interpretation = locale === "ko" ? romance.interpretationKo : romance.interpretationEn;
  const storyParagraphs = locale === "ko" ? romance.storyKo : romance.storyEn;
  const dramaLine = locale === "ko" ? romance.dramaLineKo : romance.dramaLineEn;
  let revealIdx = 0;
  const stagger = (): React.CSSProperties => ({
    ["--jc-i" as string]: String(revealIdx++),
  });

  return (
    <div className="jc-scroll" style={{ maxWidth: 600, width: "100%" }}>
      <ScrollFrame>
        <div className="jc-ink" style={{ ...stagger(), textAlign: "center", marginBottom: 16 }}>
          {isSharedResult && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "7px 13px",
                borderRadius: 999,
                border: `1px solid ${RULE}`,
                color: DANCHEONG_RED,
                background: "rgba(196,30,58,0.08)",
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              {t("공유된 결과", "Shared Result")}
            </div>
          )}
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              letterSpacing: "0.4em",
              color: DANCHEONG_RED,
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            緣 分
          </div>
          <div
            aria-hidden
            style={{ width: 50, height: 1.5, background: INK, margin: "8px auto" }}
          />
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              color: SUBTLE,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
            }}
          >
            {t("우리의 조선 로맨스", "OUR JOSEON ROMANCE")}
          </div>
        </div>

        {/* Hero */}
        <div
          className="jc-ink"
          style={{
            ...stagger(),
            background: HANJI,
            border: `1px solid ${INK}`,
            borderRadius: 4,
            padding: "26px 18px 22px",
            marginBottom: 16,
            textAlign: "center",
            boxShadow: `inset 0 0 0 4px ${HANJI}, inset 0 0 0 5px ${DANCHEONG_RED}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <PersonCard person={p1} locale={locale} />
            <div
              aria-hidden
              style={{
                fontSize: 26,
                color: DANCHEONG_RED,
                fontWeight: 900,
              }}
            >
              ❤
            </div>
            <PersonCard person={p2} locale={locale} />
          </div>

          <div
            style={{
              marginTop: 22,
              fontFamily: SERIF,
              fontSize: 26,
              fontWeight: 800,
              lineHeight: 1.3,
              color: INK,
            }}
          >
            「{title}」
          </div>

          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 11,
                letterSpacing: "0.3em",
                color: DANCHEONG_BLUE,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              緣 · {t("인연의 점수", "Fate Score")}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 38,
                fontWeight: 900,
                color: DANCHEONG_RED,
                letterSpacing: "-0.02em",
                marginTop: 4,
              }}
            >
              {score}
              <span style={{ fontSize: 16, marginLeft: 4, color: SUBTLE }}>
                {t("점", "pts")}
              </span>
            </div>
            <p style={{ ...storyTextStyle, whiteSpace: "pre-line", margin: "10px auto 0", maxWidth: 430 }}>
              {interpretation.replace(`${score}점\n`, "").replace(`${score} pts\n`, "")}
            </p>
          </div>
        </div>

        <div className="jc-ink" style={{ ...stagger(), display: "flex", justifyContent: "center", margin: "0 0 18px" }}>
          <button type="button" onClick={onShare} style={primarySealButton}>
            {copied ? t("✓ 복사됨", "✓ Copied") : t("우리 조선 로맨스 공유하기", "Share our Joseon romance")}
          </button>
        </div>

        <StorySection title={t("두 사람의 조선 로맨스", "Your Joseon Romance")} stagger={stagger}>
          {storyParagraphs.map((paragraph, index) => (
            <p key={index} style={romanceParagraphStyle}>
              {paragraph}
            </p>
          ))}
        </StorySection>

        <div className="jc-ink" style={{ ...stagger(), marginBottom: 14 }}>
          <div style={sectionTitleWrap}>
            <div style={{ flex: 1, height: 1, background: INK }} />
            <div style={sectionTitleText}>場 · {t("장면으로 보는 인연", "Cinematic Scenes")}</div>
            <div style={{ flex: 1, height: 1, background: INK }} />
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {romance.scenes.map((scene) => (
              <SceneCardView key={scene.titleKo} scene={scene} locale={locale} />
            ))}
          </div>
        </div>

        <Section title={t("이 인연의 한 줄 대사", "A Line From This Romance")} hanja="詞" stagger={stagger}>
          <p
            style={{
              ...storyTextStyle,
              color: DANCHEONG_RED,
              fontSize: 17,
              lineHeight: 1.8,
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            “{dramaLine}”
          </p>
        </Section>

        <div
          className="jc-ink"
          style={{
            ...stagger(),
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 24,
          }}
        >
          <button type="button" onClick={onShare} style={primarySealButton}>
            {copied ? t("✓ 복사됨", "✓ Copied") : t("우리 조선 로맨스 공유하기", "Share our Joseon romance")}
          </button>
          <button type="button" onClick={onReset} style={secondaryButton}>
            {isSharedResult ? t("나도 해보기", "Try it myself") : t("다시 하기", "Try again")}
          </button>
        </div>
      </ScrollFrame>
    </div>
  );
}

function ScrollFrame({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <div
      style={{
        position: "relative",
        background: `linear-gradient(180deg, ${HANJI} 0%, ${HANJI_DEEP} 100%)`,
        border: `1.5px solid ${INK}`,
        borderRadius: 6,
        padding: "32px 24px 30px",
        boxShadow:
          "0 12px 30px rgba(26,26,26,0.12), inset 0 0 0 6px " + HANJI + ", inset 0 0 0 7px " + GOLD,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -12,
          left: -8,
          right: -8,
          height: 18,
          background: `linear-gradient(180deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 4,
          boxShadow: `inset 0 1px 0 ${GOLD}, 0 2px 6px rgba(0,0,0,0.2)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -16,
          left: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -16,
          right: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -12,
          left: -8,
          right: -8,
          height: 18,
          background: `linear-gradient(0deg, ${INK_SOFT}, ${INK})`,
          borderRadius: 4,
          boxShadow: `inset 0 -1px 0 ${GOLD}, 0 2px 6px rgba(0,0,0,0.2)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -16,
          left: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -16,
          right: -16,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${GOLD}, ${INK_SOFT})`,
          border: `1.5px solid ${INK}`,
        }}
      />
      {children}
    </div>
  );
}

function PersonCard({
  person,
  locale,
}: {
  person: Person;
  locale: SimpleLocale;
}): ReactElement {
  return (
    <div style={{ textAlign: "center", minWidth: 110 }}>
      <div style={{ fontSize: 34, marginBottom: 4 }}>{person.cls.emoji}</div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 26,
          fontWeight: 800,
          color: INK,
          letterSpacing: "0.03em",
          lineHeight: 1.05,
        }}
      >
        {person.name.display}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 16, color: GOLD, marginTop: 2, fontWeight: 600 }}>
        {person.name.hanja}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          color: DANCHEONG_RED,
          fontFamily: SERIF,
          letterSpacing: "0.15em",
          fontWeight: 700,
        }}
      >
        {locale === "ko" ? person.cls.ko : person.cls.en}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          color: INK_SOFT,
          fontFamily: SERIF,
          fontWeight: 700,
        }}
      >
        {locale === "ko" ? person.role.ko : person.role.en}
      </div>
      {person.original && person.original.trim() !== person.name.display && (
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            color: SUBTLE,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ({person.original})
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  hanja,
  stagger,
  children,
}: {
  title: string;
  hanja: string;
  stagger: () => React.CSSProperties;
  children: React.ReactNode;
}): ReactElement {
  return (
    <div className="jc-ink" style={{ ...stagger(), marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ flex: 1, height: 1, background: INK }} />
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 14,
            letterSpacing: "0.3em",
            color: DANCHEONG_RED,
            fontWeight: 800,
          }}
        >
          {hanja} · {title}
        </div>
        <div style={{ flex: 1, height: 1, background: INK }} />
      </div>
      <div
        style={{
          background: HANJI,
          border: `1px solid ${RULE}`,
          borderLeft: `3px solid ${DANCHEONG_RED}`,
          borderRadius: 4,
          padding: "16px 18px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function StorySection({
  title,
  stagger,
  children,
}: {
  title: string;
  stagger: () => React.CSSProperties;
  children: React.ReactNode;
}): ReactElement {
  return (
    <section className="jc-ink" style={{ ...stagger(), marginBottom: 18 }}>
      <div style={sectionTitleWrap}>
        <div style={{ flex: 1, height: 1, background: INK }} />
        <div style={sectionTitleText}>戀 · {title}</div>
        <div style={{ flex: 1, height: 1, background: INK }} />
      </div>
      <div
        style={{
          background:
            `linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.04)), ${HANJI}`,
          border: `1px solid ${RULE}`,
          borderTop: `3px solid ${DANCHEONG_RED}`,
          borderRadius: 6,
          padding: "22px 20px",
          boxShadow: `inset 0 0 0 3px rgba(184,150,12,0.08), 0 10px 20px rgba(26,26,26,0.06)`,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function SceneCardView({
  scene,
  locale,
}: {
  scene: SceneCard;
  locale: SimpleLocale;
}): ReactElement {
  return (
    <article
      style={{
        background: "rgba(245,240,224,0.72)",
        border: `1px solid ${RULE}`,
        borderLeft: `3px solid ${DANCHEONG_BLUE}`,
        borderRadius: 5,
        padding: "14px 16px",
      }}
    >
      <h3
        style={{
          margin: "0 0 7px",
          color: DANCHEONG_RED,
          fontFamily: SERIF,
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "0.04em",
        }}
      >
        {locale === "ko" ? scene.titleKo : scene.titleEn}
      </h3>
      <p style={{ ...storyTextStyle, lineHeight: 1.75 }}>
        {locale === "ko" ? scene.textKo : scene.textEn}
      </p>
    </article>
  );
}

const inputStyle: React.CSSProperties = {
  background: HANJI,
  color: INK,
  border: `1.5px solid ${RULE}`,
  borderRadius: 4,
  padding: "12px 12px",
  fontSize: 15,
  outline: "none",
  fontFamily: SERIF,
  width: "100%",
  boxSizing: "border-box",
  textAlign: "center",
  fontWeight: 700,
};

const primarySealButton: React.CSSProperties = {
  background: DANCHEONG_RED,
  color: HANJI,
  border: `2px solid ${DANCHEONG_RED}`,
  padding: "12px 24px",
  borderRadius: 4,
  fontSize: 15,
  fontWeight: 800,
  letterSpacing: "0.15em",
  cursor: "pointer",
  fontFamily: SERIF,
  boxShadow: `inset 0 0 0 2px rgba(245,240,224,0.9), 0 4px 12px rgba(196,30,58,0.3)`,
};

const secondaryButton: React.CSSProperties = {
  background: "transparent",
  color: INK,
  border: `1.5px solid ${INK}`,
  padding: "12px 24px",
  borderRadius: 4,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: SERIF,
};

const storyTextStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.95,
  color: INK,
  fontFamily: SERIF,
  margin: 0,
};

const romanceParagraphStyle: React.CSSProperties = {
  ...storyTextStyle,
  fontSize: 16,
  lineHeight: 2.05,
  margin: "0 0 15px",
};

const sectionTitleWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 10,
};

const sectionTitleText: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: 14,
  letterSpacing: "0.18em",
  color: DANCHEONG_RED,
  fontWeight: 800,
  textAlign: "center",
};
