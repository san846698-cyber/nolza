"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { AdBottom } from "@/app/components/Ads";
import { trackResultView, trackRetryClick, trackShareClick, trackTestStart } from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";

/* ============================================================
 * 색 / 폰트 — 검은 문학책 + 심판대
 * ========================================================== */
const C = {
  bg: "#0d0d0d",
  ink: "#f5f0e8",
  sub: "rgba(245,240,232,0.55)",
  red: "#c0392b",
  redSoft: "#e0584a",
  line: "rgba(245,240,232,0.16)",
};
const FONT = `"Noto Serif KR", "Noto Serif", Georgia, serif`;

/* ============================================================
 * 질문 데이터 — D축(1-15) 본성 / C축(16-30) 언행일치
 * ========================================================== */
type Q = { ko: string; en: string };

const D_QUESTIONS: Q[] = [
  {
    ko: "엘리베이터에 사람이 오고 있는데 혼자 타고 싶어서 닫힘 버튼을 누른 적 있다",
    en: "Someone was coming, but you hit 'close' to ride the elevator alone.",
  },
  {
    ko: "카톡 읽고 귀찮아서 며칠째 씹은 적 있다",
    en: "You read a message and, out of laziness, left it unanswered for days.",
  },
  {
    ko: "약속 전날 갑자기 귀찮아서 취소한 적 있다",
    en: "The night before plans, you suddenly canceled out of pure reluctance.",
  },
  {
    ko: "더치페이할 때 슬쩍 조금 덜 낸 적 있다",
    en: "Splitting the bill, you quietly chipped in a little less.",
  },
  {
    ko: "지하철에서 노인이 앞에 서 있는데 자는 척한 적 있다",
    en: "An elderly person stood before you on the subway, and you faked sleep.",
  },
  {
    ko: "내가 분명히 실수했는데 상황 탓, 남 탓으로 넘긴 적 있다",
    en: "You clearly messed up, then pinned it on the situation or someone else.",
  },
  {
    ko: "내 잘못으로 누군가 피해를 봤는데 사과 없이 넘어간 적 있다",
    en: "Your fault hurt someone, and you moved on without an apology.",
  },
  {
    ko: "앞에서는 웃으면서 뒤에서 그 사람 욕한 적 있다",
    en: "You smiled to their face, then trashed them behind their back.",
  },
  {
    ko: "화가 나서 막말했는데 사과 안 하고 그냥 넘어간 적 있다",
    en: "You snapped and said cruel things, then let it slide without apologizing.",
  },
  {
    ko: "절대 말하지 말라고 들은 비밀을 다른 사람한테 말한 적 있다",
    en: "A secret you swore to keep, you told someone else.",
  },
  {
    ko: "누군가의 약점을 알면서 그걸 이용해 이득을 본 적 있다",
    en: "Knowing someone's weakness, you used it to your own advantage.",
  },
  {
    ko: "친구가 진짜 힘들다고 했는데 귀찮아서 모른 척한 적 있다",
    en: "A friend said they were truly struggling, and you ignored it out of bother.",
  },
  {
    ko: "남의 불행 소식을 듣고 속으로 시원하다고 느낀 적 있다",
    en: "You heard of someone's misfortune and felt a quiet relief inside.",
  },
  {
    ko: "일부러 거짓 소문을 내거나 퍼뜨린 적 있다",
    en: "You deliberately started or spread a false rumor.",
  },
  {
    ko: "누군가를 의도적으로 따돌리거나 집단으로 무시한 적 있다",
    en: "You intentionally excluded someone or joined in shunning them.",
  },
];

const C_QUESTIONS: Q[] = [
  {
    ko: "헌혈은 해야 한다고 생각하면서 한 번도 한 적이 없다",
    en: "You think you should donate blood — yet have never once done it.",
  },
  {
    ko: "환경 오염 심각하다고 하면서 일회용품을 아무렇지 않게 쓴다",
    en: "You call pollution dire — yet use disposables without a second thought.",
  },
  {
    ko: "자주 연락하고 지내자 해놓고 먼저 연락한 적이 한 번도 없다",
    en: "You said \"let's keep in touch,\" then never once reached out first.",
  },
  {
    ko: "노약자석은 비워야 한다고 생각하면서 비어있으면 앉은 적 있다",
    en: "You believe priority seats should stay empty — but sit when one is free.",
  },
  {
    ko: "도와줄게 해놓고 바빠진다는 핑계로 슬그머니 잊어버린 적 있다",
    en: "You offered to help, then quietly forgot once you \"got busy.\"",
  },
  {
    ko: "저런 사람 되면 안 된다고 욕하면서 나도 똑같이 한 적 있다",
    en: "You cursed \"never be like that person\" — then did the exact same thing.",
  },
  {
    ko: "뒤에 사람이 오는데 문 잡아주기 귀찮아서 그냥 놓은 적 있다",
    en: "Someone was behind you, but you let the door go instead of holding it.",
  },
  {
    ko: "돈 많이 버는 사람들은 기부해야 한다고 생각하면서 정작 본인은 1원도 기부한 적 없다",
    en: "You think the rich should donate — yet have never given a single won yourself.",
  },
  {
    ko: "이번엔 진짜라고 굳게 결심했는데 사흘 안에 깬 적 있다",
    en: "You swore \"this time for real,\" then broke it within three days.",
  },
  {
    ko: "불친절한 직원 욕하면서 정작 내가 직원한테 반말한 적 있다",
    en: "You cursed a rude clerk — while talking down to a clerk yourself.",
  },
  {
    ko: "쓰레기 무단투기 나쁘다고 생각하면서 나도 한 적 있다",
    en: "You think littering is wrong — and have done it yourself.",
  },
  {
    ko: "차별하면 안 된다고 생각하면서 속으로 편견 가진 적 있다",
    en: "You believe in not discriminating — yet hold prejudice quietly inside.",
  },
  {
    ko: "폭력은 절대 안 된다고 하면서 누군가한테 손 댄 적 있다",
    en: "You say violence is never okay — yet have raised a hand against someone.",
  },
  {
    ko: "거짓말하면 안 된다고 생각하면서 상습적으로 거짓말한 적 있다",
    en: "You believe lying is wrong — yet lie as a matter of habit.",
  },
  {
    ko: "법은 지켜야 한다고 생각하면서 의도적으로 어긴 적 있다",
    en: "You believe the law should be obeyed — yet have broken it on purpose.",
  },
];

const ALL_QUESTIONS: Q[] = [...D_QUESTIONS, ...C_QUESTIONS];

/* ============================================================
 * 티어 / 등급 → 12가지 결과
 * ========================================================== */
type Tier = "buddha" | "human" | "beast" | "demon";
type Grade = "pass" | "hold" | "fail";

const TIER_KO: Record<Tier, string> = { buddha: "부처", human: "인간", beast: "짐승", demon: "악마" };
const TIER_EN: Record<Tier, string> = { buddha: "Buddha", human: "Human", beast: "Beast", demon: "Demon" };
const GRADE_KO: Record<Grade, string> = { pass: "합격", hold: "보류", fail: "실격" };
const GRADE_EN: Record<Grade, string> = { pass: "Pass", hold: "Hold", fail: "Disqualified" };

function tierFromD(d: number): Tier {
  if (d <= 2) return "buddha";
  if (d <= 6) return "human";
  if (d <= 11) return "beast";
  return "demon";
}
function gradeFromC(c: number): Grade {
  if (c <= 4) return "pass";
  if (c <= 9) return "hold";
  return "fail";
}

type ResultCopy = {
  verdict: { ko: string; en: string };
  body: { ko: string; en: string };
  tags: { ko: [string, string, string]; en: [string, string, string] };
};

const RESULTS: Record<`${Tier}_${Grade}`, ResultCopy> = {
  buddha_pass: {
    verdict: { ko: "살아있는 성인. 의심스럽다.", en: "A living saint. Suspiciously so." },
    body: {
      ko: "당신은 거의 죄를 짓지 않고 여기까지 왔다. 서른 번의 질문 앞에서 당신은 대체로 고개를 저었고, 그 부정의 몸짓에는 망설임이 없었다. 놀라운 일이다. 인간으로 태어나 이만큼 깨끗하기란 사실 거의 불가능에 가깝다. 그래서 나는 조금 의심한다. 정말 그런 적이 없는 것인지, 아니면 기억하고 싶지 않은 것인지. 성인(聖人)이란 죄가 없는 사람이 아니라 죄를 잊는 데 능한 사람일지도 모른다. 어쨌든 합격이다. 부디 그 표정을 끝까지 유지하시길. 들키지 않는 선함도 선함이니까.",
      en: "You arrived here having sinned almost not at all. Before thirty questions you mostly shook your head, and the gesture held no hesitation. Remarkable — to be born human and stay this clean is nearly impossible. Which is why I'm a little suspicious: did it truly never happen, or do you simply prefer not to remember? A saint may not be one without sin, but one skilled at forgetting it. Either way, you pass. Do keep that face to the very end. Goodness no one catches is still goodness.",
    },
    tags: {
      ko: ["#살아있는_성인", "#의심스러운_결백", "#들키지_않은_선함"],
      en: ["#living_saint", "#suspicious_purity", "#unseen_goodness"],
    },
  },
  buddha_hold: {
    verdict: { ko: "착하긴 한데 가끔 흔들린다.", en: "Kind — but you waver sometimes." },
    body: {
      ko: "당신의 본성은 분명 선한 쪽이다. 남을 해치는 일에는 서툴고, 누군가 다치는 걸 보면 가슴 한구석이 먼저 아파온다. 다만 당신은 가끔 흔들린다. 옳다고 믿는 것과 실제로 하는 것 사이에 손바닥 하나만큼의 틈이 있고, 그 틈으로 작은 핑계들이 스며든다. '오늘은 피곤하니까', '이번 한 번쯤은'. 부처는 그 틈을 모른 척하지 않았다. 그래서 당신은 합격이 아니라 보류다. 나쁜 사람은 아니지만 아직 완성되지 않은 사람. 다행히 흔들린다는 건 아직 중심이 있다는 뜻이다.",
      en: "Your nature leans good. You're clumsy at hurting people, and when someone gets wounded a corner of your chest aches first. But you waver. Between what you believe is right and what you actually do there is a gap the width of a palm, and small excuses seep through it. \"I'm tired today.\" \"Just this once.\" The Buddha never pretended not to see that gap. So you are not a pass but a hold: not a bad person, only an unfinished one. Happily, to waver still means you have a center.",
    },
    tags: {
      ko: ["#착한_본성", "#가끔_흔들림", "#아직_미완성"],
      en: ["#kind_by_nature", "#occasional_wobble", "#still_unfinished"],
    },
  },
  buddha_fail: {
    verdict: { ko: "마음은 부처, 행동은 딴판.", en: "A Buddha's heart, a stranger's deeds." },
    body: {
      ko: "이상한 결과가 나왔다. 당신의 마음은 분명 부처에 가까운데, 행동을 적어보면 영 딴사람이다. 머릿속으로는 늘 옳은 자리에 서 있다. 헌혈을 해야 한다고 믿고, 약속은 지켜야 한다고 믿고, 문은 잡아줘야 한다고 믿는다. 그런데 실제로 한 적은 거의 없다. 당신은 선의의 수집가다. 좋은 마음만 모아두고 한 번도 꺼내 쓰지 않았다. 마음은 합격인데 손발이 실격을 받았다. 다자이라면 이렇게 적었을 것이다 — 부끄럼 많은 생애를 보냈습니다, 그것도 아주 선량한 얼굴로.",
      en: "A strange verdict. Your heart sits close to the Buddha, yet write down your actions and it reads like a different person. In your head you always stand in the right place — you believe in donating blood, keeping promises, holding doors. You've simply almost never done it. You are a collector of good intentions: hoarding kind thoughts, never once spending them. Your heart passes; your hands and feet are disqualified. Dazai might have put it this way — I have lived a life of much shame, and with a very gentle face at that.",
    },
    tags: {
      ko: ["#선의_수집가", "#마음만_부처", "#행동은_딴판"],
      en: ["#hoarder_of_good_intent", "#buddha_in_thought", "#elsewhere_in_deed"],
    },
  },
  human_pass: {
    verdict: { ko: "평범하게 살고 있다. 그게 전부다.", en: "You live an ordinary life. That's all." },
    body: {
      ko: "축하한다, 라고 해야 할지 모르겠다. 당신은 합격이다. 다만 그 합격은 빛나는 종류가 아니라 그냥 무탈한 종류다. 당신은 크게 악하지 않고 크게 선하지도 않다. 적당히 거짓말하고, 적당히 양보하고, 적당히 후회한다. 대부분의 인간이 그렇게 산다. 평범하다는 건 사실 가장 어려운 균형이다. 너무 착하면 손해를 보고 너무 나쁘면 외로워지니까. 당신은 그 사이 어딘가에서 용케 버티고 있다. 그게 전부다. 그리고 어쩌면, 그게 인간이 할 수 있는 최선이다.",
      en: "Congratulations — though I'm not sure that's the word. You pass. Not the shining kind of pass, just the uneventful kind. You're not greatly evil, nor greatly good. You lie in moderation, yield in moderation, regret in moderation. Most humans live exactly like this. Being ordinary is in fact the hardest balance to hold: too kind and you lose, too cruel and you're alone. You've somehow held the middle. That's all there is. And perhaps that is the best a human can do.",
    },
    tags: {
      ko: ["#적당한_인간", "#무탈한_합격", "#그게_전부"],
      en: ["#moderately_human", "#uneventful_pass", "#that_is_all"],
    },
  },
  human_hold: {
    verdict: { ko: "인간이긴 한데 애매하다.", en: "Human — but hard to place." },
    body: {
      ko: "당신은 인간이다. 그건 확실하다. 문제는 어떤 인간인지가 애매하다는 것이다. 어떤 날은 자리를 양보하고, 어떤 날은 모른 척 눈을 감는다. 어떤 약속은 지키고, 어떤 약속은 슬그머니 잊는다. 당신은 일관성이라는 단어와 사이가 좋지 않다. 그래서 판정을 내리기가 어렵다. 합격을 주기엔 빈틈이 보이고, 실격을 주기엔 양심이 살아 있다. 보류란 결국 '좀 더 지켜보겠다'는 뜻이다. 당신 자신도 당신을 아직 다 모르는 것 같으니, 우리도 조금 기다려 보기로 한다.",
      en: "You are human — that much is certain. The trouble is which kind is unclear. Some days you give up your seat; other days you shut your eyes and look away. Some promises you keep; others you quietly forget. You and the word \"consistency\" are not on good terms, which makes a verdict hard: too many gaps to pass you, too much conscience to fail you. A hold means, in the end, \"we'll watch a little longer.\" You don't seem to fully know yourself yet either — so we'll wait a while too.",
    },
    tags: {
      ko: ["#애매한_인간", "#일관성_부족", "#판정_보류"],
      en: ["#ambiguous_human", "#low_consistency", "#verdict_pending"],
    },
  },
  human_fail: {
    verdict: { ko: "인간 자격, 박탈 직전.", en: "Human license — on the verge of revocation." },
    body: {
      ko: "인간 실격. 다자이가 빌려준 그 무거운 제목이 오늘은 당신 위에 놓였다. 너무 절망할 필요는 없다. 이건 당신이 괴물이라는 뜻이 아니라, 인간이라는 자격을 너무 자주 깜빡했다는 뜻이다. 당신은 옳은 걸 알면서도 자주 반대로 갔고, 미안한 줄 알면서도 사과를 아꼈다. 양심은 있는데 그 양심을 행동보다 늘 한 박자 늦게 꺼냈다. 박탈 직전이라는 건 아직 박탈되진 않았다는 뜻이기도 하다. 자격은 반납하는 게 아니라 다시 얻는 것이다. 오늘부터 한 칸씩.",
      en: "No Longer Human. Today the heavy title Dazai lent us rests on you. No need to despair too much — it doesn't mean you're a monster, only that you forgot your human credentials a bit too often. You knew the right thing and frequently went the other way; you knew you were sorry and rationed the apology. The conscience is there, just always drawn a beat late. \"On the verge of revocation\" also means: not yet revoked. A qualification isn't surrendered — it's earned again. Starting today, one square at a time.",
    },
    tags: {
      ko: ["#인간실격_직전", "#늦은_양심", "#박탈_유예"],
      en: ["#almost_disqualified", "#late_conscience", "#revocation_deferred"],
    },
  },
  beast_pass: {
    verdict: { ko: "본능에 충실하되 일관되다.", en: "True to instinct — and consistent." },
    body: {
      ko: "흥미로운 인간이다. 당신은 욕망에 충실하다. 하고 싶으면 하고, 싫으면 안 한다. 위선의 옷을 굳이 껴입지 않는다. 보통 이런 사람은 실격을 받기 쉬운데 당신은 합격이다. 이유는 단 하나, 일관성이다. 당신은 적어도 자기 자신에게 거짓말을 하지 않는다. 짐승은 위선을 모른다. 배고프면 먹고 졸리면 잔다. 그 정직한 본능 앞에서는 어설픈 선인(善人)보다 차라리 당신이 덜 위험하다. 다만 기억하라. 본능에 솔직한 것과 타인을 잊는 것은 다르다. 그 경계만 지키면 당신은 꽤 멋진 짐승이다.",
      en: "An interesting creature. You're loyal to your appetites: if you want to, you do; if you don't, you don't. You never bother squeezing into the costume of hypocrisy. Usually this earns a fail, yet you pass — for one reason only: consistency. You at least don't lie to yourself. A beast knows no hypocrisy; hungry, it eats; sleepy, it sleeps. Before that honest instinct you're frankly less dangerous than a clumsy do-gooder. But remember: being honest with your instincts is not the same as forgetting others. Keep that line, and you make a rather fine beast.",
    },
    tags: {
      ko: ["#정직한_본능", "#위선_없음", "#일관된_짐승"],
      en: ["#honest_instinct", "#no_hypocrisy", "#consistent_beast"],
    },
  },
  beast_hold: {
    verdict: { ko: "짐승인지 인간인지 본인도 모른다.", en: "Beast or human? Even you can't tell." },
    body: {
      ko: "당신은 지금 경계선 위에 서 있다. 한 발은 인간 쪽에, 한 발은 짐승 쪽에. 본인도 자기가 어느 쪽 사람인지 잘 모른다. 어떤 순간엔 놀랍도록 따뜻하고, 어떤 순간엔 서늘하게 자기 잇속만 챙긴다. 그 변덕이 당신을 예측 불가능하게 만든다. 주변 사람들은 당신을 좋아하면서도 한 번씩 멈칫한다. '얘는 대체 무슨 생각이지?' 사실 당신도 모른다. 보류라는 판정은 그 혼란을 정직하게 옮겨 적은 것뿐이다. 짐승이 되기로 마음먹은 것도 아니고 인간으로 남기로 결심한 것도 아닌 사람. 결정은 결국 당신 몫이다.",
      en: "You stand on the borderline right now — one foot on the human side, one on the beast's. You yourself aren't sure which you are. In some moments you're astonishingly warm; in others, coolly self-serving. That caprice makes you unpredictable. People like you, yet flinch now and then: \"What on earth is this one thinking?\" Truthfully, you don't know either. The verdict \"hold\" is only that confusion copied down honestly. You haven't resolved to be a beast, nor decided to remain human. The choice, in the end, is yours.",
    },
    tags: {
      ko: ["#경계선_위", "#예측불가", "#본인도_모름"],
      en: ["#on_the_borderline", "#unpredictable", "#even_you_dont_know"],
    },
  },
  beast_fail: {
    verdict: { ko: "짐승이면서 반성도 안 한다.", en: "A beast — and unrepentant." },
    body: {
      ko: "솔직히 말하겠다. 당신의 행적은 거칠다. 욕망은 앞서고 양심은 한참 뒤에 처져 있다. 그것까지는 짐승의 자연스러운 모습이라 치자. 문제는 그다음이다. 당신은 반성을 하지 않는다. 짐승은 배가 부르면 멈추고 가끔은 미안한 눈빛이라도 짓는다. 그런데 당신은 일을 저지르고도 '뭐 어때'로 마무리한다. 후회 없는 잘못은 습관이 되고, 습관이 된 잘못은 성격이 된다. 그래서 실격이다. 그러나 이 글을 끝까지 읽고 있다는 건 마음 한구석이 아직 찔린다는 증거다. 그 찔림을 버리지 마라. 거기서부터가 사람이다.",
      en: "I'll be blunt: your record is rough. Desire runs ahead and conscience lags far behind. Fine — call that the natural shape of a beast. The problem is what comes after: you don't reflect. A beast stops when it's full and sometimes manages an apologetic look. You finish the deed with a shrug — \"so what.\" A wrong without regret becomes a habit, and a habit becomes a character. Hence: disqualified. And yet that you're reading this to the end is proof a corner of you still stings. Don't throw that sting away. That's where being a person begins.",
    },
    tags: {
      ko: ["#반성_없음", "#후회_제로", "#찔림은_남았다"],
      en: ["#no_remorse", "#zero_regret", "#the_sting_remains"],
    },
  },
  demon_pass: {
    verdict: { ko: "악하지만 적어도 솔직하다.", en: "Wicked — but at least honest." },
    body: {
      ko: "무섭도록 솔직한 사람이다. 당신은 자신이 이기적이라는 걸 안다. 남을 밟고 올라설 수 있다는 것도 안다. 보통 사람들은 그 사실을 감추려 애쓰는데 당신은 굳이 숨기지 않는다. 그 뻔뻔할 만큼의 정직함이 역설적으로 당신을 합격시켰다. 가장 위험한 악은 자기가 선하다고 믿는 악이다. 당신은 적어도 그 함정엔 빠지지 않았다. 스스로를 악마라 인정하는 악마는 사실 다룰 수 있는 악마다. 부디 그 자기 인식을 칼이 아니라 거울로 쓰기를. 솔직한 악인은 마음만 먹으면 가장 정직한 선인이 될 수 있다.",
      en: "A frighteningly honest person. You know you're selfish. You know you could climb by stepping on others. Most people strain to hide this; you simply don't bother. That shameless honesty, paradoxically, is what passed you. The most dangerous evil is the evil that believes itself good — and you, at least, didn't fall into that trap. A demon who admits to being a demon is, in fact, one you can handle. Please use that self-knowledge as a mirror, not a blade. An honest villain, if he chooses, can become the most honest good man alive.",
    },
    tags: {
      ko: ["#무서운_솔직함", "#자기인식_있음", "#다룰_수_있는_악"],
      en: ["#frank_to_a_fault", "#self_aware", "#a_manageable_evil"],
    },
  },
  demon_hold: {
    verdict: { ko: "악마 예비군. 가능성 충분.", en: "Demon-in-reserve. Plenty of potential." },
    body: {
      ko: "당신에게는 가능성이 있다. 좋은 의미는 아니다. 아직 큰일을 저지르진 않았지만 저지를 수 있는 자질이 충분히 보인다. 당신은 죄책감의 무게를 가볍게 견딘다. 보통 사람이 며칠 잠 못 이룰 일을 당신은 하룻밤이면 털어낸다. 그 회복력이 어떤 자리에서는 무기가 되고 어떤 자리에서는 흉기가 된다. 지금 당신은 갈림길에 서 있다. 한쪽은 매력적인 리더의 길, 다른 한쪽은 모두가 등 돌리는 길. 보류는 '아직 늦지 않았다'는 마지막 경고다. 악마 예비군에서 제대하는 방법은 의외로 간단하다 — 한 번쯤, 손해 보는 선택을 해보는 것.",
      en: "You have potential — and not in the flattering sense. You haven't done anything grave yet, but the aptitude for it is plainly there. You carry the weight of guilt lightly: what keeps an ordinary person up for days, you shake off in a single night. That resilience is a weapon in some seats and a blade in others. You stand at a fork now — one path the charismatic leader's, the other the road where everyone turns their back. \"Hold\" is the last warning that it isn't too late. Discharge from the demon reserves is oddly simple: just once, make the choice that costs you something.",
    },
    tags: {
      ko: ["#악마_예비군", "#가벼운_죄책감", "#갈림길"],
      en: ["#demon_reserves", "#guilt_runs_light", "#at_the_fork"],
    },
  },
  demon_fail: {
    verdict: {
      ko: "당신은 이 테스트의 설계 범위를 벗어났습니다.",
      en: "You have exceeded the design range of this test.",
    },
    body: {
      ko: "이 결과는 통계적으로 나와선 안 됩니다. 30개의 질문 앞에서 당신은 한 번도 망설이지 않았습니다. 우리는 당신에 대해 더 이상 할 말이 없습니다. 부디 사회에서 잘 지내시길 바랍니다.",
      en: "This result was not supposed to be statistically possible. Across thirty questions, you never once hesitated. We have nothing left to say about you. We sincerely hope you get along well out in society.",
    },
    tags: {
      ko: ["#설계범위_초과", "#통계적_이상값", "#사회에서_잘지내세요"],
      en: ["#out_of_design_range", "#statistical_outlier", "#do_well_out_there"],
    },
  },
};

/* ============================================================
 * 공유 페이로드
 * ========================================================== */
type SharePayload = { v: 1; d: number; c: number };

function encodeShare(d: number, c: number): string {
  return buildShareUrl("/games/human-test", { v: 1, d, c } satisfies SharePayload);
}

/* ============================================================
 * 페이지
 * ========================================================== */
type Phase = "intro" | "quiz" | "result";

function HumanTestInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { t, locale } = useLocale();

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [visible, setVisible] = useState(true);
  const [scores, setScores] = useState<{ d: number; c: number } | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [shake, setShake] = useState(false);

  // 공유 링크로 들어온 경우 자동 결과
  useEffect(() => {
    const shared = decodeSharePayload<SharePayload>(params.get("s"));
    if (
      shared?.v === 1 &&
      Number.isInteger(shared.d) &&
      Number.isInteger(shared.c) &&
      shared.d >= 0 &&
      shared.d <= 15 &&
      shared.c >= 0 &&
      shared.c <= 15
    ) {
      const id = window.setTimeout(() => {
        setScores({ d: shared.d, c: shared.c });
        setPhase("result");
        setIsShared(true);
      }, 0);
      return () => window.clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = useMemo(() => {
    if (!scores) return null;
    const tier = tierFromD(scores.d);
    const grade = gradeFromC(scores.c);
    return {
      tier,
      grade,
      copy: RESULTS[`${tier}_${grade}`],
    };
  }, [scores]);

  useEffect(() => {
    if (result) {
      trackResultView("human-test", `${TIER_EN[result.tier]}_${GRADE_EN[result.grade]}`);
    }
  }, [result]);

  const startQuiz = () => {
    trackTestStart("human-test", "No Longer Human Test");
    setAnswers([]);
    setIndex(0);
    setScores(null);
    setIsShared(false);
    setVisible(true);
    setPhase("quiz");
  };

  const answer = (yes: boolean) => {
    if (!visible) return;
    const next = [...answers, yes];
    setVisible(false);
    window.setTimeout(() => {
      if (next.length >= ALL_QUESTIONS.length) {
        const d = next.slice(0, 15).filter(Boolean).length;
        const c = next.slice(15, 30).filter(Boolean).length;
        const isExtreme = tierFromD(d) === "demon" && gradeFromC(c) === "fail";
        setAnswers(next);
        if (typeof window !== "undefined") {
          const url = encodeShare(d, c);
          router.replace(url.replace(window.location.origin, ""));
        }
        if (isExtreme) {
          // 악마실격: 1초 pause → shake → 결과
          window.setTimeout(() => {
            setScores({ d, c });
            setPhase("result");
            setShake(true);
            window.setTimeout(() => setShake(false), 700);
          }, 1000);
        } else {
          setScores({ d, c });
          setPhase("result");
        }
      } else {
        setAnswers(next);
        setIndex(next.length);
        setVisible(true);
      }
    }, 300);
  };

  const retry = () => {
    trackRetryClick("human-test", "judgment");
    setPhase("intro");
    setAnswers([]);
    setIndex(0);
    setScores(null);
    setIsShared(false);
    setVisible(true);
    setShake(false);
    router.replace("/games/human-test");
  };

  const shareKakao = async () => {
    if (!result || !scores) return;
    const stampKo = `${TIER_KO[result.tier]}${GRADE_KO[result.grade]}`;
    const stampEn = `${TIER_EN[result.tier]} · ${GRADE_EN[result.grade]}`;
    trackShareClick("human-test", "judgment", `${result.tier}_${result.grade}`);
    const url = encodeShare(scores.d, scores.c);
    const title = t(
      `인간실격 테스트 — 나의 판정: ${stampKo}`,
      `No Longer Human Test — My verdict: ${stampEn}`,
    );
    const desc = result.copy.verdict[locale];

    const w =
      typeof window !== "undefined"
        ? (window as unknown as {
            Kakao?: { isInitialized?: () => boolean; Share?: { sendDefault: (a: unknown) => void } };
          })
        : undefined;
    if (w?.Kakao?.Share && w.Kakao.isInitialized?.()) {
      try {
        w.Kakao.Share.sendDefault({
          objectType: "feed",
          content: { title, description: desc, link: { webUrl: url, mobileWebUrl: url } },
        });
        return;
      } catch {
        /* fall through */
      }
    }
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: { title: string; text: string; url: string }) => Promise<void> })
          .share({ title, text: desc, url });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(`${title}\n${desc}\n${url}`);
    } catch {
      /* ignore */
    }
  };

  return (
    <main
      className={shake ? "ht-shake" : undefined}
      style={{
        minHeight: "100svh",
        background: C.bg,
        color: C.ink,
        fontFamily: FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700;900&display=swap"
      />

      <style jsx global>{`
        @keyframes ht-shake {
          0% { transform: translate(0, 0); }
          15% { transform: translate(-6px, 3px) rotate(-0.4deg); }
          30% { transform: translate(5px, -4px) rotate(0.4deg); }
          45% { transform: translate(-5px, 2px) rotate(-0.3deg); }
          60% { transform: translate(4px, -3px) rotate(0.3deg); }
          75% { transform: translate(-3px, 2px); }
          100% { transform: translate(0, 0); }
        }
        .ht-shake {
          animation: ht-shake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
      `}</style>

      {/* 위/아래 종이 결 비네팅 */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(192,57,43,0.06) 0%, transparent 45%), radial-gradient(100% 60% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "16px 20px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link href="/" style={{ color: C.sub, textDecoration: "none", fontSize: 13 }}>
            ← {t("놀자 홈", "Home")}
          </Link>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "8px 20px 96px" }}>
        {phase === "intro" ? (
          <IntroView onStart={startQuiz} t={t} />
        ) : phase === "quiz" ? (
          <QuizView index={index} visible={visible} onAnswer={answer} t={t} locale={locale} />
        ) : result && scores ? (
          <ResultView
            tier={result.tier}
            grade={result.grade}
            copy={result.copy}
            onShareKakao={shareKakao}
            onRetry={retry}
            isShared={isShared}
            t={t}
            locale={locale}
          />
        ) : null}
      </div>
    </main>
  );
}

/* ============================================================
 * 인트로 (심판대)
 * ========================================================== */
function IntroView({ onStart, t }: { onStart: () => void; t: (ko: string, en: string) => string }) {
  return (
    <div
      style={{
        maxWidth: 560,
        margin: "0 auto",
        minHeight: "62svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 13, letterSpacing: "0.34em", color: C.red, marginBottom: 26 }}>
        {t("심 판 대", "THE TRIBUNAL")}
      </div>
      <h1
        style={{
          margin: 0,
          fontWeight: 900,
          fontSize: "clamp(34px, 9vw, 56px)",
          lineHeight: 1.18,
          letterSpacing: "0.02em",
        }}
      >
        {t("인간실격", "No Longer")}
        <br />
        {t("테스트", "Human")}
      </h1>
      <p
        style={{
          marginTop: 30,
          fontSize: "clamp(18px, 4.6vw, 22px)",
          fontStyle: "italic",
          color: C.ink,
          lineHeight: 1.6,
        }}
      >
        {t("당신은 인간 자격이 있습니까?", "Do you qualify as human?")}
      </p>
      <p style={{ marginTop: 16, fontSize: 14, color: C.sub, lineHeight: 1.8, maxWidth: 420 }}>
        {t(
          "30개의 질문 앞에서 당신은 정직해야 합니다. 끝나면 하나의 판정이 내려집니다 — 부처, 인간, 짐승, 혹은 악마.",
          "Thirty questions demand your honesty. At the end, one verdict is stamped — Buddha, Human, Beast, or Demon.",
        )}
      </p>

      <button type="button" onClick={onStart} className="ht-start">
        {t("심판대에 오르기", "Step onto the stand")}
      </button>

      <p style={{ marginTop: 16, fontSize: 11.5, color: C.sub }}>
        {t("· 답변은 저장되지 않습니다 ·", "· nothing is stored ·")}
      </p>

      <style jsx>{`
        .ht-start {
          margin-top: 40px;
          padding: 16px 40px;
          border: 1px solid ${C.red};
          background: transparent;
          color: ${C.redSoft};
          font-family: ${FONT};
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.25s, color 0.25s;
        }
        .ht-start:hover {
          background: ${C.red};
          color: ${C.bg};
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * 질문 화면
 * ========================================================== */
function QuizView({
  index,
  visible,
  onAnswer,
  t,
  locale,
}: {
  index: number;
  visible: boolean;
  onAnswer: (yes: boolean) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}) {
  const q = ALL_QUESTIONS[index];
  const n = index + 1;
  const pct = (n / ALL_QUESTIONS.length) * 100;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        minHeight: "70svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* 심판 N / 30 */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 14, letterSpacing: "0.2em", color: C.red, fontWeight: 700 }}>
          {t(`심판 ${n} / 30`, `Judgment ${n} / 30`)}
        </div>
        <div
          style={{
            margin: "14px auto 0",
            width: "min(220px, 60%)",
            height: 2,
            background: C.line,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${pct}%`,
              background: C.red,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* 질문 (fade 0.3s) */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          margin: "48px auto 56px",
          maxWidth: 520,
        }}
      >
        <p
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "clamp(20px, 5.2vw, 24px)",
            lineHeight: 1.7,
            fontWeight: 500,
            wordBreak: "keep-all",
          }}
        >
          {locale === "ko" ? q.ko : q.en}
        </p>
      </div>

      {/* 있다 / 없다 */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          maxWidth: 460,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <button type="button" className="ht-ans ht-yes" onClick={() => onAnswer(true)}>
          {t("있다", "I have")}
        </button>
        <button type="button" className="ht-ans ht-no" onClick={() => onAnswer(false)}>
          {t("없다", "Never")}
        </button>
      </div>

      <style jsx>{`
        .ht-ans {
          padding: 20px 12px;
          background: transparent;
          font-family: ${FONT};
          font-size: 19px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.1s;
        }
        .ht-ans:active {
          transform: scale(0.97);
        }
        .ht-yes {
          border: 1px solid ${C.red};
          color: ${C.redSoft};
        }
        .ht-yes:hover {
          background: ${C.red};
          color: ${C.bg};
        }
        .ht-no {
          border: 1px solid ${C.ink};
          color: ${C.ink};
        }
        .ht-no:hover {
          background: ${C.ink};
          color: ${C.bg};
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * 결과 화면
 * ========================================================== */
function ResultView({
  tier,
  grade,
  copy,
  onShareKakao,
  onRetry,
  isShared,
  t,
  locale,
}: {
  tier: Tier;
  grade: Grade;
  copy: ResultCopy;
  onShareKakao: () => void;
  onRetry: () => void;
  isShared: boolean;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}) {
  const stamp = locale === "ko" ? `${TIER_KO[tier]}${GRADE_KO[grade]}` : `${TIER_EN[tier]} · ${GRADE_EN[grade]}`;
  const verdict = copy.verdict[locale];
  const body = copy.body[locale];
  const tags = copy.tags[locale];

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      {/* 판정 도장 */}
      <div style={{ textAlign: "center", marginTop: 34 }}>
        <div style={{ fontSize: 12, letterSpacing: "0.3em", color: C.sub }}>
          {t("최 종 판 정", "FINAL VERDICT")}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 22,
            padding: "16px 30px",
            border: `3px solid ${C.red}`,
            color: C.red,
            transform: "rotate(-7deg)",
            boxShadow: "0 0 0 1px rgba(192,57,43,0.35) inset",
          }}
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: locale === "ko" ? "clamp(40px, 12vw, 68px)" : "clamp(26px, 8vw, 44px)",
              letterSpacing: locale === "ko" ? "0.08em" : "0.02em",
              lineHeight: 1,
              display: "block",
            }}
          >
            {stamp}
          </span>
        </div>
      </div>

      {/* 판정문 */}
      <p
        style={{
          margin: "40px auto 0",
          maxWidth: 460,
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "clamp(19px, 4.6vw, 23px)",
          lineHeight: 1.6,
          color: C.ink,
        }}
      >
        “{verdict}”
      </p>

      {/* 서술 */}
      <p
        style={{
          margin: "28px auto 0",
          maxWidth: 540,
          fontSize: 15.5,
          lineHeight: 2,
          color: "rgba(245,240,232,0.86)",
          wordBreak: "keep-all",
        }}
      >
        {body}
      </p>

      {/* 태그 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          marginTop: 30,
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "6px 14px",
              border: `1px solid ${C.line}`,
              fontSize: 13,
              color: "rgba(245,240,232,0.8)",
              letterSpacing: "0.02em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 공유용 캡처 카드 */}
      <div
        id="result-card"
        style={{
          marginTop: 40,
          padding: "36px 28px 30px",
          background: C.bg,
          border: `1px solid ${C.line}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: "0.24em", color: C.sub }}>
          {t("놀자.fun 심판소", "nolza.fun TRIBUNAL")}
        </div>

        <div style={{ marginTop: 22, fontSize: 11, letterSpacing: "0.3em", color: C.sub }}>
          {t("인간실격 테스트", "NO LONGER HUMAN TEST")}
        </div>

        <div
          style={{
            display: "inline-block",
            marginTop: 18,
            padding: "12px 26px",
            border: `3px solid ${C.red}`,
            color: C.red,
            transform: "rotate(-6deg)",
          }}
        >
          <span
            style={{
              fontWeight: 900,
              fontSize: locale === "ko" ? "clamp(38px, 13vw, 56px)" : "clamp(24px, 9vw, 40px)",
              letterSpacing: locale === "ko" ? "0.08em" : "0.02em",
              lineHeight: 1,
              display: "block",
            }}
          >
            {stamp}
          </span>
        </div>

        <p
          style={{
            margin: "26px auto 0",
            maxWidth: 380,
            fontStyle: "italic",
            fontSize: 16,
            lineHeight: 1.6,
            color: C.ink,
          }}
        >
          “{verdict}”
        </p>

        <div
          style={{
            marginTop: 26,
            paddingTop: 16,
            borderTop: `1px solid ${C.line}`,
            fontSize: 13,
            letterSpacing: "0.2em",
            color: C.redSoft,
          }}
        >
          nolza.fun
        </div>
      </div>

      {/* 광고 — 공유 카드 아래 */}
      <div style={{ margin: "24px 0" }}>
        <AdBottom />
      </div>

      {/* 버튼 */}
      <button type="button" onClick={onShareKakao} className="ht-kakao">
        {t("친구에게 공유하기", "Share with friends")}
      </button>
      <button type="button" onClick={onRetry} className="ht-retry">
        {isShared ? t("나도 심판받기", "Judge me too") : t("다시 심판받기", "Be judged again")}
      </button>

      <style jsx>{`
        .ht-kakao {
          width: 100%;
          padding: 15px;
          border: none;
          background: #fee500;
          color: #191600;
          font-family: ${FONT};
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }
        .ht-retry {
          margin-top: 12px;
          width: 100%;
          padding: 14px;
          border: 1px solid ${C.line};
          background: transparent;
          color: ${C.sub};
          font-family: ${FONT};
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .ht-retry:hover {
          color: ${C.ink};
          border-color: ${C.ink};
        }
      `}</style>
    </div>
  );
}

/* ============================================================
 * Suspense 래퍼
 * ========================================================== */
export default function HumanTestPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <HumanTestInner />
    </Suspense>
  );
}

function Fallback() {
  return (
    <main
      style={{
        minHeight: "100svh",
        background: C.bg,
        color: C.ink,
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.3em", color: C.red }}>인간실격 테스트</div>
        <p style={{ marginTop: 14, fontStyle: "italic", color: C.sub }}>당신은 인간 자격이 있습니까?</p>
      </div>
    </main>
  );
}
