// 워털루 — your command-style assessment.
// Five independent dilemmas drawn from Napoleon's Hundred Days (1815).
//
// Sources: Wellington's despatches (1815, The Waterloo Despatch);
// Napoleon, Mémoires pour servir à l'histoire de France sous Napoléon
// (St. Helena dictations); Henri Houssaye, 1815: Waterloo (1898);
// David Chandler, The Campaigns of Napoleon (1966);
// Peter Hofschröer, 1815: The Waterloo Campaign (1999);
// Alessandro Barbero, The Battle: A New History of Waterloo (2003);
// Andrew Roberts, Napoleon: A Life (2014).

export type {
  Archetype,
  Axis,
  AxisTag,
  BriefingItem,
  Choice,
  Dilemma,
  EvalResult,
  LocalizedString,
} from "./battle-shared";
export { AXIS_DESC, AXIS_LABEL, emptyScores } from "./battle-shared";

import {
  type Archetype,
  type Axis,
  type Dilemma,
  type EvalResult,
  type LocalizedString,
  decodePicksFor,
  encodePicksFor,
  evaluatePicks,
} from "./battle-shared";

const L = (ko: string, en: string): LocalizedString => ({ ko, en });

export const WATERLOO_DILEMMAS: Dilemma[] = [
  {
    id: "attack-time",
    index: 1,
    era: L("1815년 6월 18일 새벽", "Dawn, June 18, 1815"),
    location: L("벨알리앙스 능선 — 몽생장 남쪽", "Belle Alliance ridge — south of Mont-Saint-Jean"),
    scene: L(
      "엘바 탈출 후 백 일. 어젯밤 폭우로 들판은 진창이 됐다. 능선 너머에 웰링턴이 약 6만 8천을 줄 세웠고, 동쪽 어디선가 블뤼허의 프로이센군이 다가오고 있다. 그루시는 3만 3천을 데리고 바브르에서 프로이센 후위를 추격 중이다. 포는 진창에 발이 묶이고, 참모장 술트는 \"포가 자유롭게 기동할 수 있을 때까지\"를 권한다.",
      "A hundred days after Elba. Last night's downpour has turned the field to mud. Beyond the ridge, Wellington has lined up about 68,000; somewhere east, Blücher's Prussians are coming. Grouchy is at Wavre with 33,000, chasing a Prussian rearguard. The guns sink in the mud; chief of staff Soult advises waiting \"until the artillery can manoeuvre freely.\"",
    ),
    briefing: [
      {
        label: L("병력 (Houssaye 1898)", "Forces (Houssaye 1898)"),
        value: L(
          "프랑스 약 7만 3천 (보병 5만 3천 · 기병 1만 4천 · 포 252문). 영국·연합 약 6만 8천. 프로이센 약 5만이 전장을 향해 행군 중.",
          "France ≈ 73,000 (53k infantry, 14k cavalry, 252 guns). Anglo-Allied ≈ 68,000. ≈ 50,000 Prussians marching toward the field.",
        ),
      },
      {
        label: L("지면 상태", "Ground"),
        value: L(
          "밤새 호우. 포탄이 진창에 박혀 도탄(跳彈) 효과를 잃는다. 기병 돌격도 속도가 떨어진다.",
          "All-night rain. Round shot buries in mud, killing the bounce. Cavalry charges will lose speed.",
        ),
      },
      {
        label: L("그루시의 위치 (Chandler 1966)", "Grouchy's position (Chandler 1966)"),
        value: L(
          "바브르 방향 약 18km 동쪽. 새 명령을 받으면 워털루 합류까지 최소 6~8시간.",
          "≈ 18 km east toward Wavre. With fresh orders, six to eight hours minimum to join Waterloo.",
        ),
      },
      {
        label: L("프로이센 도착 예측", "Prussian ETA"),
        value: L(
          "Hofschröer(1999)는 뷜로의 4군단이 오후 4시경 우익에 닿을 것으로 추정. 시간이 우리 편이 아니다.",
          "Hofschröer (1999) estimates Bülow's IV Corps reaches the right flank around 4 p.m. Time is not on your side.",
        ),
      },
    ],
    prompt: L("언제, 어떻게 공격을 시작할 것인가?", "When and how do you open the attack?"),
    choices: [
      {
        id: "dawn-storm",
        label: L("진창에도 새벽에 강행 — 프로이센 도착 전에 끝낸다", "Push at dawn through the mud — finish before the Prussians arrive"),
        reasoning: L(
          "포의 효과는 떨어지지만 시간이 더 비싼 자원이다. 웰링턴이 진형을 굳히기 전에 부숴야 한다.",
          "The guns will be less effective, but time is the more expensive resource. Break Wellington before his line sets.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "Roberts(2014)는 \"새벽 강행이 가능했다면 프로이센 도착 전에 결판 가능성\"을 인정하면서도, 진창 포병의 무력화로 보병 손실이 더 컸을 것이라 본다.",
          "Roberts (2014) concedes a dawn assault \"might have decided it before the Prussians arrived,\" but adds that mud-bound artillery would have raised infantry losses sharply.",
        ),
        judgment: L(
          "당신은 시간을 가장 비싼 자원으로 본다. 조건이 갖춰지지 않아도 창이 열리면 친다 — 망설임의 비용을 안다.",
          "You price time as the most expensive resource. You strike when the window opens, even on bad ground — you know the cost of hesitation.",
        ),
      },
      {
        id: "wait-1130",
        label: L("11시 30분까지 땅이 마르길 기다린다", "Wait until 11:30 a.m. for the ground to dry"),
        reasoning: L(
          "포가 살아야 보병이 산다. 도탄 효과를 회복한 뒤 정면으로 부순다.",
          "Without the guns the infantry bleeds. Restore the bounce, then break them frontally.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "나폴레옹의 실제 선택. Houssaye(1898)는 이 지연이 \"프로이센 합류를 결정적 변수로 만들었다\"고 본다.",
          "Napoleon's actual choice. Houssaye (1898) holds that this delay \"made the Prussian arrival the decisive variable.\"",
        ),
        judgment: L(
          "당신은 무기의 조건을 결정의 조건으로 삼는다. 도구가 살아야 결판이 산다고 보는 정통 — 다만 적의 시계도 같이 흐른다.",
          "You let your weapon's condition set the decision's condition. Doctrine that says the tool must live first — but the enemy's clock is ticking too.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "recall-grouchy",
        label: L("그루시에게 즉시 합류 명령을 보내고 그가 도착할 때까지 결전을 미룬다", "Send Grouchy fresh orders to join now; defer the battle until he arrives"),
        reasoning: L(
          "3만 3천은 무시할 숫자가 아니다. 그를 우익에 붙이면 프로이센 도착에도 대응할 수 있다.",
          "Thirty-three thousand is not a number to spend. With Grouchy on the right, the Prussian arrival becomes manageable.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: 1 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Chandler(1966)는 \"이른 재소환 명령이 갔다면 그루시가 늦어도 오후 늦게 우익에 닿을 수 있었다\"고 본다 — 다만 명령 전달 시간 자체가 변수.",
          "Chandler (1966) argues that with an early recall, Grouchy \"could have reached the right flank by late afternoon\" — though courier time itself is a variable.",
        ),
        judgment: L(
          "당신은 흩어진 카드를 먼저 모은다. 결판의 시간을 자기 자원이 갖춰지는 순간으로 옮기는 정렬형 사고.",
          "You gather the scattered cards before you play. The thinking that moves the decisive hour to the moment your resources are aligned.",
        ),
      },
      {
        id: "feint-wavre",
        label: L("바브르 쪽으로 양동을 보내 프로이센을 더 묶고 본 공격을 뒤로 미룬다", "Throw a feint toward Wavre to fix the Prussians, hold the main attack"),
        reasoning: L(
          "프로이센 합류만 막을 수 있다면 다음 날 결판도 늦지 않다.",
          "If I can only delay the Prussian junction, settling tomorrow is not too late.",
        ),
        tags: [
          { axis: "INT", weight: 1 },
          { axis: "DIP", weight: 1 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "Hofschröer(1999)는 \"바브르 양동은 프로이센 4군단 본대를 막지 못했을 것\"이라 본다 — 블뤼허의 의지가 변수다.",
          "Hofschröer (1999) holds a Wavre feint \"would not have stopped Bülow's IV Corps\" — Blücher's resolve is the variable.",
        ),
        judgment: L(
          "당신은 본 결판 전에 적의 보조선을 먼저 끊으려 한다. 우회로 판을 다시 그리는 사고 — 다만 웰링턴이 같은 시간을 받는다는 것은 안다.",
          "You cut the enemy's supporting line before the main fight. The thinking that redraws the board through detour — knowing Wellington is granted the same hours.",
        ),
      },
    ],
    commanderActual: L(
      "나폴레옹은 술트의 권고를 받아들여 11시 30분에 공격을 개시했다. Houssaye(1898) 추정으로 약 4시간의 지연. 같은 시간 동안 블뤼허의 4군단이 프로이센 본대를 끌고 워털루 우익으로 접근하고 있었다.",
      "Napoleon accepted Soult's advice and opened the attack at 11:30 a.m. Houssaye (1898) puts the delay at roughly four hours. In those same hours, Bülow's IV Corps was leading the Prussian main body toward Waterloo's right flank.",
    ),
    sources: L(
      "출처: Houssaye, 1815: Waterloo (1898), pp. 312–320; Chandler, The Campaigns of Napoleon (1966), Ch. 87; Roberts, Napoleon: A Life (2014).",
      "Sources: Houssaye, 1815: Waterloo (1898), pp. 312–320; Chandler, The Campaigns of Napoleon (1966), Ch. 87; Roberts, Napoleon: A Life (2014).",
    ),
  },
  {
    id: "hougoumont",
    index: 2,
    era: L("1815년 6월 18일 11시 30분", "11:30 a.m., June 18, 1815"),
    location: L("우구몽 농가 — 영국군 우익 측면", "Hougoumont farm — Wellington's right flank"),
    scene: L(
      "전장 우측 숲 속에 돌담을 두른 농가가 있다. 웰링턴이 \"이 마당이 워털루의 결판을 좌우한다\"고 말한 자리(Wellington Despatch). 영국 근위대 1,500여 명이 농가를 지킨다. 동생 제롬에게 어디까지 맡길 것인가?",
      "On the right, a stone-walled farm sits in a wood. Wellington wrote in the Despatch that \"the success of the battle turned on the closing of the gates of Hougoumont.\" About 1,500 British Guards hold it. How far do you commit your brother Jérôme?",
    ),
    briefing: [
      {
        label: L("위치의 의미 (Wellington Despatch)", "What the position means (Wellington Despatch)"),
        value: L(
          "영국군 우익을 가려주는 방패. 함락되면 웰링턴 우측이 노출되지만, 함락에는 큰 피의 대가가 따른다.",
          "A shield in front of Wellington's right. Its fall exposes that flank — but the fall itself comes at heavy cost.",
        ),
      },
      {
        label: L("초기 의도 (Barbero 2003)", "Initial intent (Barbero 2003)"),
        value: L(
          "원안은 \"양동\"이었다 — 영국 예비대를 우구몽으로 끌어내고 본 공격은 중앙. 그러나 제롬이 점점 더 많은 병력을 쏟아붓는다.",
          "The plan was a feint — pull Wellington's reserves to Hougoumont, then strike the center. But Jérôme keeps feeding in more troops.",
        ),
      },
      {
        label: L("투입 추정", "Forces committed"),
        value: L(
          "오전 양동에 2개 사단 약 1만 4천 — 결국 종일 1만 4천 가까이 묶이게 된다 (Houssaye 1898).",
          "About two divisions, ~14,000 men in the morning probe — eventually nearly that number is tied down all day (Houssaye 1898).",
        ),
      },
      {
        label: L("선택지의 의미", "What's at stake"),
        value: L(
          "양동은 적 예비대를 끌어내야 의미가 있다. 너무 약하면 무시당하고, 너무 강하면 본 공격을 굶긴다.",
          "A feint only works if it draws reserves. Too weak and Wellington ignores it; too strong and it starves your main blow.",
        ),
      },
    ],
    prompt: L("우구몽을 어떻게 다룰 것인가?", "How do you handle Hougoumont?"),
    choices: [
      {
        id: "feint-as-planned",
        label: L("계획대로 양동만 — 제롬에게 더 이상 증원하지 말라 명령", "Limited feint only — order Jérôme not to escalate"),
        reasoning: L(
          "양동의 의도는 적 예비를 끌어내는 것이지 농가를 부수는 것이 아니다. 본 공격에 병력을 남겨야 한다.",
          "A feint pulls reserves; it does not break a farm. Save the troops for the main blow.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "Barbero(2003)는 \"제롬이 자제했다면 중앙 종대에 1만 명을 더 보낼 수 있었을 것\"이라 본다 — 그러나 웰링턴 예비대도 우구몽으로 빨려가지 않는다.",
          "Barbero (2003) argues that with Jérôme restrained, \"another 10,000 could have gone to the center\" — but Wellington's reserves would not have been drawn to Hougoumont either.",
        ),
        judgment: L(
          "당신은 양동의 정의를 안다. 무게중심을 분산하지 않는 정통 — 작전의 자기 정의를 지키는 사람의 결정.",
          "You know what a feint is. The doctrine that refuses to dilute the center of mass — the judgment of someone who keeps the plan true to itself.",
        ),
      },
      {
        id: "ignore-center",
        label: L("우구몽을 무시하고 중앙 능선에만 집중", "Mask Hougoumont; concentrate everything on the center"),
        reasoning: L(
          "농가는 측면이지 결판이 아니다. 결판은 능선 한가운데에 있다.",
          "The farm is a flank, not a decision. The decision sits on the ridge.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "Chandler(1966): 우구몽을 가리지 않고 두면 영국군 우익 사격이 중앙 공격의 측면을 갉는다. 중앙 종대 손실이 더 커진다.",
          "Chandler (1966): leaving Hougoumont uncovered lets its garrison rake the flank of the center attack, raising the cost of the main column.",
        ),
        judgment: L(
          "당신은 한 점에 모든 것을 모은다. 결판의 자리를 한 곳으로 좁히는 결단형 — 측면을 비우는 비용을 감수한다.",
          "You concentrate everything on one point. The decisiveness that narrows the decision to a single spot — willing to pay the cost of an open flank.",
        ),
      },
      {
        id: "feint-and-escalate",
        label: L("양동으로 시작하되 끌려가는 대로 증원해 농가를 함락한다", "Start as a feint, escalate as the day demands"),
        reasoning: L(
          "농가가 약해 보이면 부숴버린다. 측면을 차지하면 중앙도 흔들린다.",
          "If the farm looks weak, take it. With the flank in hand, the center wobbles too.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "INT", weight: -1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "나폴레옹(제롬)의 실제 선택. Houssaye(1898): 종일 약 1만 4천이 묶였고 농가는 끝내 함락되지 않았다 — 양동이 본대를 굶긴 사례.",
          "Jérôme's de facto choice. Houssaye (1898): nearly 14,000 men were tied down all day, and the farm never fell — a feint that starved the main attack.",
        ),
        judgment: L(
          "당신은 기회가 보이면 양동의 정의를 잊는다. 현장의 흐름에 따라 계획을 다시 쓰는 즉응형 — 다만 작은 기회가 큰 자원을 먹는다.",
          "When opportunity shows, you forget what the feint was. The reactive hand that rewrites the plan with the field — but small openings devour large resources.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "smash-with-guard",
        label: L("황실 근위대를 직접 투입해 농가를 단번에 분쇄한다", "Throw the Imperial Guard at it; smash the farm in one stroke"),
        reasoning: L(
          "지지부진한 양동보다 한 번의 충격이 낫다.",
          "One hammer blow beats a half-day of feinting.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: -1 },
        ],
        shadowOutcome: L(
          "Roberts(2014): 근위대를 측면 농가에 소진하면 중앙 결판에 던질 마지막 패가 사라진다 — 결과적으로 더 큰 위험.",
          "Roberts (2014): spending the Guard on a flank farm leaves no last card for the center — a larger risk in net.",
        ),
        judgment: L(
          "당신은 망설임 대신 망치를 든다. 정면에서 한 번에 끝내려는 결단 — 다만 마지막 패를 처음 자리에 내는 비용은 안다.",
          "You reach for the hammer, not the wait. The decisiveness that ends things in one stroke — knowing the cost of spending the last card first.",
        ),
      },
    ],
    commanderActual: L(
      "원안은 양동이었으나 제롬은 종일 증원을 멈추지 않았다. 영국 근위대 1,500여 명이 농가를 끝까지 지켰고, 프랑스는 약 1만 4천을 측면에 묶였다. 웰링턴은 Despatch에 \"우구몽 문이 닫힌 것이 결판을 갈랐다\"고 적었다.",
      "The plan was a feint, but Jérôme escalated all day. About 1,500 British Guards held the farm until evening; France tied down nearly 14,000 on the flank. Wellington wrote in the Despatch that \"the closing of the gates of Hougoumont\" decided the day.",
    ),
    sources: L(
      "출처: Wellington's Waterloo Despatch (1815); Houssaye, 1815: Waterloo (1898), pp. 340–355; Barbero, The Battle (2003), pp. 130–158.",
      "Sources: Wellington's Waterloo Despatch (1815); Houssaye, 1815: Waterloo (1898), pp. 340–355; Barbero, The Battle (2003), pp. 130–158.",
    ),
  },
  {
    id: "derlon-attack",
    index: 3,
    era: L("1815년 6월 18일 오후 1시 30분", "1:30 p.m., June 18, 1815"),
    location: L("라에생트 — 영국군 중앙", "La Haye Sainte — Wellington's center"),
    scene: L(
      "거대 포병 80문의 포격이 능선을 두드린다. 데를롱의 1군단 약 1만 7천이 라에생트와 그 동쪽 능선을 향해 진형을 짠다. 종대인가 산병선인가, 농가 점령인가 우회인가 — 진형의 모양이 사상자의 모양을 결정한다.",
      "The grand battery of 80 guns hammers the ridge. D'Erlon's I Corps, about 17,000, forms up against La Haye Sainte and the ridge to its east. Column or skirmish line, take the farm or sweep around — the shape of the formation will be the shape of the casualty list.",
    ),
    briefing: [
      {
        label: L("종대 진형 (Chandler 1966)", "Column formation (Chandler 1966)"),
        value: L(
          "프랑스 거대 종대 — 정면 폭 약 200명, 깊이 25열. 정면 사격에 가장 약하다.",
          "The French 'grand column' — about 200 wide, 25 deep. Maximally exposed to frontal musketry.",
        ),
      },
      {
        label: L("능선 너머의 비밀 (Barbero 2003)", "Behind the ridge (Barbero 2003)"),
        value: L(
          "웰링턴이 보병을 능선 뒤 사면(reverse slope)에 숨겼다. 프랑스 포는 그들을 보지 못한다 — 능선을 넘어야 비로소 사격선이 보인다.",
          "Wellington has hidden his infantry on the reverse slope. The French guns cannot see them — only after cresting the ridge will the firing line appear.",
        ),
      },
      {
        label: L("라에생트 수비대", "Garrison of La Haye Sainte"),
        value: L(
          "독일왕립군단(KGL) 약 400명이 농가를 지킨다. 능선 중앙의 \"보조 못\".",
          "About 400 of the King's German Legion hold the farm — the supporting nail in the center of the ridge.",
        ),
      },
      {
        label: L("기병 (Houssaye 1898)", "Cavalry (Houssaye 1898)"),
        value: L(
          "영국 중기병 (\"Union·Household Brigade\")이 능선 뒤에 대기. 종대 깊이는 그들에게 가장 좋은 표적이다.",
          "British heavy cavalry (Union and Household Brigades) waits behind the ridge. Depth is exactly what they want to hit.",
        ),
      },
    ],
    prompt: L("데를롱 군단을 어떤 진형으로 어디에 던질 것인가?", "Where and in what formation do you commit D'Erlon?"),
    choices: [
      {
        id: "grand-column",
        label: L("거대 종대로 정면 능선에 정통 돌격", "Grand columns straight at the ridge — the doctrinal blow"),
        reasoning: L(
          "한 번의 충격으로 능선을 부순다. 깊이가 충격이고, 충격이 결판이다.",
          "Break the ridge in one shock. Depth is shock; shock is the decision.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "데를롱의 실제 진형. Barbero(2003)는 종대 깊이가 \"능선 너머 영국 보병의 일제 사격에 가장 약한 표적\"이었다고 본다. 직후 영국 중기병 돌격에 약 3,000명 손실.",
          "D'Erlon's actual formation. Barbero (2003) argues that depth made the column \"the perfect target for the volley waiting on the reverse slope.\" The British heavy cavalry charge then cost about 3,000 men.",
        ),
        judgment: L(
          "당신은 정통 화력에 자기 결판을 맡긴다. 깊이를 충격으로 보는 정통의 사고 — 다만 적이 그 깊이를 표적으로 본다는 것을 잊을 수 있다.",
          "You stake the decision on doctrinal mass. The thinking that reads depth as shock — at the cost of forgetting that depth, to the enemy, is target.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "skirmish-line",
        label: L("산병선으로 분산해 사상자를 줄이며 압박", "Disperse into skirmish line — pressure with fewer casualties"),
        reasoning: L(
          "능선 너머의 일제 사격을 분산으로 흡수한다. 결판은 늦어도 군은 산다.",
          "Absorb the volley in dispersion. Slower decision, but the army survives.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Chandler(1966): 산병만으로는 영국 보병 진형을 부수지 못한다 — 시간만 벌고 결판은 못 낸다. 그 사이 프로이센이 도착한다.",
          "Chandler (1966): skirmishers alone cannot break a British line. You buy time and lose the decision; the Prussians arrive in the gap.",
        ),
        judgment: L(
          "당신은 사상자의 모양을 먼저 본다. 깊이가 표적임을 아는 신중함 — 다만 결판 없는 압박은 시간을 적에게 준다.",
          "You see the shape of the casualty list first. The caution that knows depth is target — though pressure without decision hands time to the enemy.",
        ),
      },
      {
        id: "take-farm",
        label: L("라에생트만 먼저 점령하고 본 공격은 지원 정렬을 기다린다", "Take La Haye Sainte first; hold the main blow until support is lined up"),
        reasoning: L(
          "능선 중앙의 못을 빼면 다음 충격은 가벼워진다. 한 발씩 나아간다.",
          "Pull the nail from the center of the ridge first; the next blow comes lighter. One step at a time.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "라에생트는 실제로 오후 6시경 함락됐고 그 직후 웰링턴 중앙이 가장 위태로웠다 (Wellington Despatch). Roberts(2014)는 \"농가를 더 일찍 노렸다면 결판 시간을 앞당겼을 가능성\"을 제기한다.",
          "La Haye Sainte fell about 6 p.m. — the moment Wellington's center was most exposed (Wellington Despatch). Roberts (2014) suggests that taking it earlier \"might have moved the decisive hour forward.\"",
        ),
        judgment: L(
          "당신은 결판의 못을 먼저 빼낸다. 보조 거점의 가치를 아는 사고 — 한 발씩 나아가되 한 발이 결판을 옮긴다는 것을 안다.",
          "You pull the supporting nail first. The thinking that knows the value of secondary points — moving one step at a time, knowing one step shifts the decision.",
        ),
      },
      {
        id: "flank-sweep",
        label: L("측면으로 우회해 능선 후방의 보급·예비를 끊는다", "Sweep around the flank; cut the rear and reserves behind the ridge"),
        reasoning: L(
          "정면이 가장 비싼 길이라면 측면으로 간다. 능선 뒤를 끊으면 진형 전체가 흔들린다.",
          "If the front is the most expensive road, take the side. Cutting the rear shakes the whole line.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "Hofschröer(1999)는 영국 좌익 우회는 \"프로이센 선두와 정면 충돌하는 길\"이라고 본다 — 우회 자체가 새로운 정면을 만든다.",
          "Hofschröer (1999) holds that swinging round Wellington's left \"runs straight into the Prussian advance guard\" — the detour creates a new front.",
        ),
        judgment: L(
          "당신은 정면 대신 후방을 본다. 결판의 자리를 다시 그리는 직관 — 다만 우회로가 새로운 정면이 될 수 있다는 것은 안다.",
          "You read the rear, not the front. The intuition that redraws where the decision happens — knowing a detour can become a new front.",
        ),
      },
    ],
    commanderActual: L(
      "데를롱은 거대 종대 4개로 능선을 정면으로 쳤다. 영국 보병의 일제 사격과 직후의 영국 중기병 돌격(Union·Household Brigade)이 약 3,000명을 무너뜨렸다 (Houssaye 1898). 진형의 깊이가 진형의 죽음이 됐다.",
      "D'Erlon attacked frontally in four grand columns. The British volley and the immediately following heavy cavalry charge — the Union and Household Brigades — cost about 3,000 men (Houssaye 1898). The depth of the formation became its death.",
    ),
    sources: L(
      "출처: Houssaye, 1815: Waterloo (1898), pp. 380–402; Chandler, The Campaigns of Napoleon (1966), Ch. 87; Barbero, The Battle (2003), pp. 192–225.",
      "Sources: Houssaye, 1815: Waterloo (1898), pp. 380–402; Chandler, The Campaigns of Napoleon (1966), Ch. 87; Barbero, The Battle (2003), pp. 192–225.",
    ),
  },
  {
    id: "imperial-guard",
    index: 4,
    era: L("1815년 6월 18일 오후 7시 30분", "7:30 p.m., June 18, 1815"),
    location: L("벨알리앙스 능선 뒤 — 마지막 예비", "Behind Belle Alliance — the last reserve"),
    scene: L(
      "프로이센 4군단이 우익 플랑스누아에 도달했다. 라에생트는 함락됐고, 영국군 중앙은 처음으로 얇아졌다. 황실 근위대 — 한 번도 패한 적 없는 \"불멸의 부대\"가 마지막 패로 남아 있다. 하지만 어디에 던질 것인가, 그리고 모두 던질 것인가?",
      "Bülow's IV Corps has reached Plancenoit on the right. La Haye Sainte has fallen; for the first time, Wellington's center is thin. The Imperial Guard — \"the Immortals,\" never beaten — is the last card. Where do you play it, and do you play all of it?",
    ),
    briefing: [
      {
        label: L("우익 상황 (Hofschröer 1999)", "Right flank (Hofschröer 1999)"),
        value: L(
          "플랑스누아에서 청년 근위대가 프로이센과 격전 중. 우익이 무너지면 후퇴로도 위험하다.",
          "The Young Guard is fighting the Prussians at Plancenoit. If the right flank breaks, even the line of retreat is at risk.",
        ),
      },
      {
        label: L("중앙의 기회", "Window in the center"),
        value: L(
          "라에생트 함락 직후 약 30분, 웰링턴 중앙에 빈 자리가 있었다 (Wellington Despatch).",
          "For roughly thirty minutes after La Haye Sainte fell, a gap opened in Wellington's center (Wellington Despatch).",
        ),
      },
      {
        label: L("근위대 규모", "The Guard"),
        value: L(
          "고참 근위대 약 4,000 + 중년 근위대 약 4,000. 황제와 함께한 마지막 베테랑.",
          "Old Guard ≈ 4,000 + Middle Guard ≈ 4,000. The last veterans who came back from Elba.",
        ),
      },
      {
        label: L("학자 견해", "Scholarly view"),
        value: L(
          "Barbero(2003)는 근위대가 능선을 정면으로 쳤을 때 영국 근위대의 일제 사격에 \"진형 자체가 처음 본 광경\"이었다고 본다.",
          "Barbero (2003) writes that when the Guard hit the ridge frontally, the British Guards' volley produced \"a sight the formation had never seen before.\"",
        ),
      },
    ],
    prompt: L("마지막 패, 어떻게 던질 것인가?", "Your last card — how do you play it?"),
    choices: [
      {
        id: "frontal-ridge",
        label: L("정면 능선의 영국군을 단번에 부수려 정면 투입", "Throw the Guard frontally at the ridge — break Wellington in one stroke"),
        reasoning: L(
          "라에생트의 빈 자리가 닫히기 전에 결판을 낸다. 한 번도 패하지 않은 부대, 마지막 한 번에 다 건다.",
          "Settle it before the gap at La Haye Sainte closes. The unbeaten formation, all-in on the last hour.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -2 },
        ],
        shadowOutcome: L(
          "나폴레옹의 실제 선택. Barbero(2003): 근위대가 처음으로 정면 사격에 무너지자 \"근위대가 후퇴한다\"는 외침이 전군의 사기를 부쉈다.",
          "Napoleon's actual choice. Barbero (2003): when the Guard fell to the volley for the first time, the cry \"La Garde recule!\" broke the morale of the whole army.",
        ),
        judgment: L(
          "당신은 결정적 순간에 가장 큰 패를 던진다. 마지막 한 번에 다 거는 결단형 — 패배의 모양도 그만큼 크다는 것을 안다.",
          "At the decisive moment you bet the biggest card. The decisiveness of all-in on the last hour — knowing the shape of defeat is then equally large.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "block-prussians",
        label: L("동쪽 플랑스누아로 보내 프로이센을 차단한다", "Send the Guard east to Plancenoit; seal off the Prussians"),
        reasoning: L(
          "두 적을 동시에 상대할 수는 없다. 한쪽을 끊으면 다른 쪽은 다음 날의 일이다.",
          "I cannot fight both armies at once. Seal off one; the other becomes tomorrow's problem.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "Hofschröer(1999): 근위대가 프로이센을 늦췄다면 후퇴는 가능했지만 결정적 승리는 사라진다 — 결과적으로 백 일 천하의 종말은 며칠 미뤄질 뿐.",
          "Hofschröer (1999): with the Guard sealing the Prussians, retreat is possible but decisive victory is gone — the Hundred Days end only a few days later.",
        ),
        judgment: L(
          "당신은 두 정면을 본다. 결판보다 생존을 먼저 묶는 사고 — 결정적 승리를 포기하고 다음 날을 사는 판단.",
          "You see two fronts at once. The thinking that locks down survival before victory — willing to forgo the decisive win for another day.",
        ),
      },
      {
        id: "preserve-retreat",
        label: L("근위대를 보존하고 질서 있는 후퇴를 엄호한다", "Preserve the Guard; cover an orderly retreat"),
        reasoning: L(
          "패전이 보이면 군을 살리는 게 정치를 살리는 길이다. 파리에서 다시 짠다.",
          "If defeat is on the field, saving the army is the way to save the politics. We rebuild from Paris.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: 1 },
          { axis: "AGG", weight: -2 },
        ],
        shadowOutcome: L(
          "Roberts(2014): 근위대를 보존했다 해도 동맹군은 점점 더 강해지고, 프랑스 내부 정치 기반은 이미 흔들렸다 — 정치적 결과는 동일.",
          "Roberts (2014): even with the Guard intact, the Coalition only grew stronger and Napoleon's political base was already cracking — the political outcome would have been the same.",
        ),
        judgment: L(
          "당신은 마지막 패를 보존한다. 다음 날을 위해 오늘을 접는 자제력 — 다만 정치는 군의 후퇴를 패배로 읽는다는 것을 안다.",
          "You preserve the last card. The self-restraint that folds today for tomorrow — knowing politics will read the retreat as defeat.",
        ),
      },
      {
        id: "split-guard",
        label: L("근위대를 둘로 쪼개 양면에 동시 투입", "Split the Guard — half to the ridge, half to the Prussians"),
        reasoning: L(
          "두 정면 모두 결판이 필요하다. 근위대의 이름값이 부족한 숫자를 메운다.",
          "Both fronts need a decision. The Guard's name fills what its numbers cannot.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "INT", weight: -1 },
        ],
        shadowOutcome: L(
          "Chandler(1966): 근위대 분할 투입은 \"두 곳 모두에서 결판을 못 내는 가장 비싼 선택\"이라 본다 — 이름값도 결국 숫자에 부서진다.",
          "Chandler (1966) calls splitting the Guard \"the most expensive choice — decisive in neither place\" — even reputation breaks against numbers.",
        ),
        judgment: L(
          "당신은 두 결판을 동시에 보려 한다. 양면을 외면하지 않는 의지 — 다만 마지막 패를 쪼개는 비용은 안다.",
          "You refuse to look away from either front. The will that takes both decisions on at once — knowing the cost of splitting the last card.",
        ),
      },
    ],
    commanderActual: L(
      "나폴레옹은 중년 근위대 5개 대대를 능선 중앙에 정면 투입했다. 웰링턴이 사면 뒤에서 기다리던 영국 근위대가 \"Up, Guards, and at them!\"으로 일어나 일제 사격을 퍼부었다. 처음으로 근위대가 무너졌고, \"La Garde recule!\"라는 외침이 전군 사기를 부쉈다 (Houssaye 1898; Barbero 2003).",
      "Napoleon sent five battalions of the Middle Guard frontally at the center. Wellington's British Guards rose from behind the slope — \"Up, Guards, and at them!\" — and fired the volley. For the first time the Imperial Guard broke, and the cry \"La Garde recule!\" shattered the army's morale (Houssaye 1898; Barbero 2003).",
    ),
    sources: L(
      "출처: Wellington's Waterloo Despatch (1815); Houssaye, 1815: Waterloo (1898), pp. 440–470; Barbero, The Battle (2003), pp. 290–320; Roberts, Napoleon (2014).",
      "Sources: Wellington's Waterloo Despatch (1815); Houssaye, 1815: Waterloo (1898), pp. 440–470; Barbero, The Battle (2003), pp. 290–320; Roberts, Napoleon (2014).",
    ),
  },
  {
    id: "after-defeat",
    index: 5,
    era: L("1815년 6월 18일 밤", "Night, June 18, 1815"),
    location: L("벨알리앙스 — 무너진 전장", "Belle Alliance — a collapsing field"),
    scene: L(
      "근위대가 무너졌다. \"La Garde recule!\"의 외침과 함께 진형 전체가 흩어진다. 웰링턴은 능선에서 모자를 들어 올리고 전 전선의 진격을 명한다. 동쪽에서 블뤼허의 기병이 다가온다. 황제는 마지막 한 발을 어디에 둘 것인가?",
      "The Guard has broken. With the cry \"La Garde recule!\" the whole line dissolves. From the ridge Wellington raises his hat and orders the general advance. Blücher's cavalry rides in from the east. The Emperor's last step — where does it fall?",
    ),
    briefing: [
      {
        label: L("군의 상태 (Houssaye 1898)", "State of the army (Houssaye 1898)"),
        value: L(
          "프랑스 약 25,000 사상 + 7,000 포로. 영국·연합 약 17,000 사상. 프로이센 약 7,000 사상.",
          "France ≈ 25,000 killed/wounded + 7,000 prisoners. Anglo-Allied ≈ 17,000 casualties. Prussians ≈ 7,000.",
        ),
      },
      {
        label: L("후퇴로", "Line of retreat"),
        value: L(
          "샤를루아 쪽 도로 한 줄. 프로이센 기병이 추격한다. 후위의 질서가 군의 생존을 결정한다.",
          "A single road toward Charleroi. Prussian cavalry is in pursuit; the rearguard's order will decide whether an army survives.",
        ),
      },
      {
        label: L("정치적 시계", "Political clock"),
        value: L(
          "파리 의회는 동요한다. 황제가 부재한 시간이 길어질수록 폐위 압력이 커진다 (Roberts 2014).",
          "The Paris chambers are wavering. Every hour the Emperor is absent, the pressure for abdication grows (Roberts 2014).",
        ),
      },
      {
        label: L("개인적 출구", "Personal exits"),
        value: L(
          "동맹군은 황제 본인을 노린다. 항복은 곧 영구 유폐, 망명은 멀고 위태롭다.",
          "The Coalition wants the Emperor's person. Surrender means permanent imprisonment; exile is far and uncertain.",
        ),
      },
    ],
    prompt: L("패전이 보일 때 당신의 마지막 한 발은?", "When defeat is on the field, your last step?"),
    choices: [
      {
        id: "rearguard",
        label: L("본인이 후위를 지휘하며 후퇴를 엄호한다", "Lead the rearguard yourself; cover the retreat"),
        reasoning: L(
          "군이 살아야 정치도 산다. 마지막까지 일선에 남는다.",
          "Politics survives only if the army does. Stay on the line to the end.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "Chandler(1966): 황제가 일선에 남았다면 후위는 더 질서 있게 무너졌겠지만, 황제 본인의 포로화 위험이 결정적으로 커진다.",
          "Chandler (1966): with the Emperor on the line, the rearguard would have held more order — but the risk of his own capture rises decisively.",
        ),
        judgment: L(
          "당신은 패전의 무게를 자기 어깨에 둔다. 군과 함께 무너질 각오의 결단형 — 다만 자기 자신이 가장 비싼 자원이라는 것은 안다.",
          "You take the weight of defeat on your own shoulders. The decisiveness ready to break with the army — knowing your own person is the most expensive resource.",
        ),
      },
      {
        id: "flee-paris",
        label: L("즉시 파리로 이탈해 정치적으로 재집결한다", "Quit the field at once for Paris; rebuild politically"),
        reasoning: L(
          "전장은 끝났다. 의회·동맹·재집결 — 다음 결판은 파리에 있다.",
          "The battle is over. The chambers, the alliances, the regrouping — the next decision is in Paris.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "CAU", weight: 1 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "나폴레옹의 실제 선택. Roberts(2014): 6월 21일 파리 도착 시점에 의회는 이미 폐위 쪽으로 기울어 있었다 — 정치적 결판의 시간이 군사적 결판보다 빨랐다.",
          "Napoleon's actual choice. Roberts (2014): by the time he reached Paris on June 21, the chambers had already tilted toward abdication — the political clock had run faster than the military one.",
        ),
        judgment: L(
          "당신은 전장의 결판이 끝난 자리에서 정치의 결판을 본다. 무대를 옮길 줄 아는 사고 — 다만 무대 뒤의 시계도 같이 흐른다.",
          "When the field's decision is over, you see the political one. The thinking that knows when to change the stage — knowing the clock keeps ticking behind it too.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "surrender",
        label: L("동맹군에게 직접 항복해 군의 목숨을 살린다", "Surrender to the Coalition in person; spare the army"),
        reasoning: L(
          "한 사람의 항복으로 수만 명이 산다. 1814년처럼 명예로운 유폐를 협상한다.",
          "One man's surrender saves tens of thousands. Negotiate honorable confinement, as in 1814.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "AGG", weight: -2 },
        ],
        shadowOutcome: L(
          "Hofschröer(1999): 블뤼허는 \"보나파르트를 잡으면 즉결\"을 공언했다 — 1815년의 항복은 1814년과 다른 조건이다.",
          "Hofschröer (1999): Blücher had publicly threatened summary execution if Bonaparte were caught — 1815 surrender is not 1814 surrender.",
        ),
        judgment: L(
          "당신은 자기 한 명의 무게로 전체를 사려 한다. 마지막 협상 카드를 자기 자신으로 두는 평화 우선 — 다만 협상이 일방적 처분이 될 수 있다는 것은 감수한다.",
          "You try to buy the whole army with your single self. The peace-first hand that holds itself as the last bargaining card — accepting that 'negotiation' may become one-sided judgment.",
        ),
      },
      {
        id: "abandon-exile",
        label: L("군 통제를 포기하고 미국·서반구로 망명한다", "Abandon command; flee to the Americas"),
        reasoning: L(
          "유럽에서는 다음 결판이 없다. 대서양 너머에서 다시 그릴 수 있다.",
          "There is no next move in Europe. The Atlantic gives a new board.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "DIP", weight: -1 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Roberts(2014): 1815년 7월 로슈포르에서 미국행을 실제로 검토했으나 영국 해군 봉쇄에 막혔다 — 망명은 가능성보다 의지의 문제였다.",
          "Roberts (2014): in July 1815 at Rochefort, Napoleon actually considered sailing for America but was blocked by the Royal Navy — the question was less feasibility than will.",
        ),
        judgment: L(
          "당신은 무대를 통째로 옮기려 한다. 판이 끝났다고 판단되면 새 판을 찾는 사고 — 다만 무대를 옮기는 데도 자기 의지의 마지막이 든다.",
          "You move the entire stage. The thinking that searches for a new board when the present one is done — knowing the move itself spends the last of your will.",
        ),
      },
    ],
    commanderActual: L(
      "나폴레옹은 근위대의 마지막 방진(square) 옆에서 후퇴하다가 곧 본대를 떠나 제노프 방향으로 빠졌다. 6월 21일 파리에 도착했을 때, 의회는 이미 폐위 쪽으로 기울어 있었다. 6월 22일 두 번째 퇴위 선언. 7월 로슈포르에서 미국행을 검토했으나 영국 해군에 의해 차단됐고, 7월 15일 HMS Bellerophon에서 항복했다 (Roberts 2014).",
      "Napoleon retreated alongside the last square of the Guard, then left the army toward Genappe. By the time he reached Paris on June 21, the chambers had already moved toward abdication. He abdicated for the second time on June 22. At Rochefort in July he considered America, was blocked by the Royal Navy, and surrendered on HMS Bellerophon on July 15 (Roberts 2014).",
    ),
    sources: L(
      "출처: Houssaye, 1815: Waterloo (1898), pp. 480–510; Hofschröer, 1815: The Waterloo Campaign (1999); Roberts, Napoleon: A Life (2014), Ch. 31.",
      "Sources: Houssaye, 1815: Waterloo (1898), pp. 480–510; Hofschröer, 1815: The Waterloo Campaign (1999); Roberts, Napoleon: A Life (2014), Ch. 31.",
    ),
  },
];

export const WATERLOO_ARCHETYPES: Archetype[] = [
  {
    id: "napoleon",
    name: L("나폴레옹형 — 결정적 순간에 가장 큰 패를 던지는 손", "The Napoleon — All-In on the Decisive Hour"),
    signature: L(
      "당신은 결정적 순간에 마지막 패를 망설이지 않고 던지는 지휘관이다.",
      "You are the hand that throws the last card without hesitation, on the decisive hour.",
    ),
    desc: L(
      "공격성과 직관을 동시에 갖춘 결단형. 창이 열리면 정통 진형으로 정면을 부수려 한다. 큰 승리를 그리되, 큰 패배의 모양도 같이 안고 가는 손.",
      "A hand that holds aggression and intuition together. When a window opens, it goes frontal in doctrinal form. Paints the great victory — and accepts that the shape of defeat will be just as large.",
    ),
    strengths: [
      L("결정적 순간을 망설이지 않고 짚는다", "Identifies the decisive moment without hesitation"),
      L("정통 진형을 끝까지 신뢰한다", "Trusts doctrine to the very end"),
      L("자기 부대의 이름값으로 공기를 바꾼다", "Changes the field's mood with the formation's name"),
    ],
    watchOut: [
      L("적이 학습한 정통이 자기 무기가 된다", "The doctrine the enemy has learned becomes his weapon"),
      L("마지막 패를 너무 늦게 본다", "Reads the last card too late"),
      L("정치적 후방을 군사적 결판에 종속시킨다", "Subordinates political rear to military decision"),
    ],
    pairsWithId: "metternich",
    clashesWithId: "wellington",
    profile: { AGG: 2, CAU: -1, DIP: 0, INT: 1 },
  },
  {
    id: "wellington",
    name: L("웰링턴형 — 능선 뒤에 숨어 적의 패를 먼저 보는 손", "The Wellington — The Hand That Reads the Enemy First"),
    signature: L(
      "당신은 적이 능선을 넘기를 기다린 뒤에야 자기 패를 보여준다.",
      "You show your hand only after the enemy crests the ridge.",
    ),
    desc: L(
      "신중과 직관의 결합. 사면 뒤에 보병을 숨기고 적이 정면 사격선에 들어올 때까지 기다린다. 결판의 자리를 자기가 정한다.",
      "Caution joined to intuition. Hides the line on the reverse slope and waits until the enemy enters the volley. Picks where the decision happens.",
    ),
    strengths: [
      L("결판의 자리를 자기가 정한다", "Chooses the ground of decision"),
      L("적의 정통을 자기 표적으로 만든다", "Turns the enemy's doctrine into a target"),
      L("동맹의 도착 시간을 자기 시계에 맞춘다", "Synchronizes the allies' arrival with his own clock"),
    ],
    watchOut: [
      L("동맹이 늦으면 정면 압력에 가장 약하다", "If allies are late, frontal pressure cuts deepest"),
      L("결정적 반격의 타이밍을 놓치기 쉽다", "Easily misses the moment for the decisive counter-stroke"),
      L("\"수동적\"이라는 비판을 자기편에서 듣는다", "Hears \"too passive\" from his own side"),
    ],
    pairsWithId: "blucher",
    clashesWithId: "napoleon",
    profile: { AGG: -1, CAU: 2, DIP: 0, INT: 1 },
  },
  {
    id: "blucher",
    name: L("블뤼허형 — 쓰러져도 다시 일어나 합류하는 손", "The Blücher — Rises and Joins"),
    signature: L(
      "당신은 어제 진 자리에서 오늘 다시 진군하는 지휘관이다.",
      "You march today from the same field where you fell yesterday.",
    ),
    desc: L(
      "공격성과 동맹 의지의 결합. 16일 리니에서 패해 말 아래 깔리고도, 18일 워털루 우익에 닿았다. 동맹과의 약속을 군사적 결정 위에 둔다.",
      "Aggression bound to alliance will. Beaten at Ligny on the 16th, pinned under his horse, yet on the 18th he reached Waterloo's right flank. Places the promise to the ally above the strict military calculation.",
    ),
    strengths: [
      L("패배 다음의 진군을 의심하지 않는다", "Never doubts the march that follows defeat"),
      L("동맹과의 약속을 군사적 위험 위에 둔다", "Holds the alliance promise above military risk"),
      L("결정적 시간에 \"한 시간 더\"를 짜낸다", "Squeezes one more hour out of the decisive moment"),
    ],
    watchOut: [
      L("개인의 의지에 부대 전체가 의존한다", "Whole force depends on a single will"),
      L("정치적 사후 정리를 종종 부족하게 한다", "Often handles the political aftermath thinly"),
      L("같은 의지의 동맹이 없으면 무모해 보인다", "Without an ally of equal will, looks reckless"),
    ],
    pairsWithId: "wellington",
    clashesWithId: "grouchy",
    profile: { AGG: 2, CAU: -1, DIP: 1, INT: 0 },
  },
  {
    id: "grouchy",
    name: L("그루시형 — 명령에 따르되 결정 못 하는 손", "The Grouchy — Obeys, but Will Not Decide"),
    signature: L(
      "당신은 포성이 들리는 방향이 아니라 명령서가 가리키는 방향으로 간다.",
      "You march not toward the guns, but toward the line on the order.",
    ),
    desc: L(
      "신중과 복종의 결합. 6월 18일 바브르에서 워털루의 포성을 듣고도 \"명령은 프로이센 추격\"이라며 합류하지 않았다. 자기 결정을 두려워하는 신중함.",
      "Caution bound to obedience. On June 18, hearing the guns of Waterloo from Wavre, he refused to march to them — \"orders are to pursue the Prussians.\" The caution that fears its own decision.",
    ),
    strengths: [
      L("명령의 글자를 정확히 지킨다", "Keeps the letter of the order exactly"),
      L("자기 분야 안의 작전은 흠 없이 수행한다", "Executes assigned operations without flaw"),
      L("부대를 손실 없이 보존한다", "Preserves the force without loss"),
    ],
    watchOut: [
      L("결정적 순간에 자기 판단을 거부한다", "Refuses his own judgment at the decisive moment"),
      L("\"명령에 없다\"가 변명이 된다", "\"Not in the orders\" becomes the excuse"),
      L("작전 전체의 결판을 자기 분야 밖으로 미룬다", "Pushes the campaign's decision outside his own remit"),
    ],
    pairsWithId: "metternich",
    clashesWithId: "blucher",
    profile: { AGG: -1, CAU: 2, DIP: -1, INT: -1 },
  },
  {
    id: "metternich",
    name: L("메테르니히형 — 전장 밖에서 판을 짜는 손", "The Metternich — Drawing the Board Off the Field"),
    signature: L(
      "당신은 칼이 아닌 회의장에서 결판을 본다.",
      "You settle in the conference hall, not on the field.",
    ),
    desc: L(
      "외교와 신중의 결합. 비엔나 회의에서 동맹을 묶어 나폴레옹의 백 일 천하를 외교적으로 먼저 끝낸 손. 전장의 결판을 외교의 결판으로 옮긴다.",
      "Diplomacy bound to caution. At the Congress of Vienna, locked the coalition against Napoleon and ended the Hundred Days diplomatically before they ended militarily. Moves the decisive moment off the field.",
    ),
    strengths: [
      L("전장 밖의 결판을 먼저 본다", "Sees the decisive move off the battlefield first"),
      L("동맹을 자원이 아닌 구조로 본다", "Treats alliance as structure, not resource"),
      L("승리 후의 정치 무대를 미리 그린다", "Maps the post-victory political stage in advance"),
    ],
    watchOut: [
      L("군사적 시간을 외교적 시간으로 오해한다", "Misreads military time as diplomatic time"),
      L("개혁의 의지를 회의장에 가둔다", "Locks the will for reform inside the conference hall"),
      L("결정적 순간을 미루는 것이 자기 무기가 된다", "Postponing the decisive moment becomes the weapon — and the trap"),
    ],
    pairsWithId: "wellington",
    clashesWithId: "napoleon",
    profile: { AGG: -2, CAU: 1, DIP: 2, INT: 0 },
  },
  {
    id: "balanced",
    name: L("균형 사령관형 — 어느 한 면에도 치우치지 않는다", "Balanced Commander — No Single Tilt"),
    signature: L(
      "당신의 무기는 결정 자체가 아니라, 매번 다른 결정을 내리는 적응력이다.",
      "Your weapon is not any single decision — it is the hand that picks a new one each time.",
    ),
    desc: L(
      "공격성과 신중, 외교와 직관 어느 축에도 크게 기울지 않는다. 상황에 맞는 전술을 골라 쓰는 — 결정 자체보다 적응을 무기로 삼는다.",
      "Tilts on no single axis. Picks the right hand for each moment — adaptation itself is the weapon.",
    ),
    strengths: [
      L("상황의 결을 읽고 매번 다른 결정을 내린다", "Reads the grain of the moment and picks a different hand each time"),
      L("어느 축의 적도 결정적으로 두렵지 않다", "No single axis of enemy is decisively frightening"),
      L("동료 지휘관의 약점을 채워주는 자리에 어울린다", "Fits the seat that fills allied commanders' gaps"),
    ],
    watchOut: [
      L("결정적 색깔이 없어 \"개성 없는 지휘관\"이라 평가받는다", "Risks being judged a hand without color"),
      L("모든 길에 적당해서 어느 길도 정복하지 못한다", "Adequate on every road, master of none"),
      L("균형 자체가 위기에서는 우유부단으로 보인다", "In crisis, balance can read as indecision"),
    ],
    pairsWithId: "napoleon",
    clashesWithId: "grouchy",
    profile: { AGG: 0.5, CAU: 0.5, DIP: 0.5, INT: 0.5 },
  },
];

export function getArchetypeById(id: string): Archetype | undefined {
  return WATERLOO_ARCHETYPES.find((a) => a.id === id);
}

export function encodePicks(picks: Record<string, string>): string {
  return encodePicksFor(picks, WATERLOO_DILEMMAS);
}

export function decodePicks(
  p: string | null | undefined,
): Record<string, string> | null {
  return decodePicksFor(p, WATERLOO_DILEMMAS);
}

export function evaluate(picks: Record<string, string>): EvalResult {
  return evaluatePicks(picks, WATERLOO_DILEMMAS, WATERLOO_ARCHETYPES);
}
