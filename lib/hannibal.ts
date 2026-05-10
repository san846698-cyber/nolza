// Hannibal — your command-style assessment.
// Five independent dilemmas drawn from Hannibal's Italian campaign (218–216 BCE).
// Each choice is tagged on four command axes; results match the user to a
// commander archetype and report match rate against Hannibal's actual decisions.
//
// Sources: Polybius, Histories 3.34–3.118; Livy, AUC 21–22.
// Modern: Goldsworthy, The Punic Wars (2000); Lazenby, Hannibal's War (1978);
// Daly, Cannae (2002); Hoyos, Hannibal's Dynasty (2003).

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

export const HANNIBAL_DILEMMAS: Dilemma[] = [
  {
    id: "alps",
    index: 1,
    era: L("기원전 218년 가을", "Autumn, 218 BCE"),
    location: L("로다누스 강 서안 — 알프스 직전", "West of the Rhône — at the foot of the Alps"),
    scene: L(
      "스페인 신(新)카르타고에서 출발한 9만 군이 5개월 만에 갈리아 남부에 도달했다. 이미 4분의 1이 사라졌다. 앞에는 알프스, 뒤에는 가을이 깊어지고, 로마군은 마실리아(마르세유) 인근에서 진군 중이다.",
      "Ninety thousand who set out from New Carthage in Spain are five months on the road and now in southern Gaul. A quarter are already gone. The Alps lie ahead, autumn is closing in, and a Roman army is advancing near Massilia.",
    ),
    briefing: [
      {
        label: L("병력 (폴리비오스 3.35, 3.56)", "Forces (Polybius 3.35, 3.56)"),
        value: L(
          "출발 약 9만 → 현재 약 5만 (보병 3만 8천 · 기병 8천 · 코끼리 37). 알프스에서 추가 손실 예상.",
          "≈ 90,000 at start → now ≈ 50,000 (38k infantry, 8k cavalry, 37 elephants). Further losses expected in the Alps.",
        ),
      },
      {
        label: L("계절 (폴리비오스 3.54)", "Season (Polybius 3.54)"),
        value: L(
          "10월 말. 산정에는 이미 첫눈. 남쪽 해안 우회는 시간이 걸리고 마실리아에서 로마군과 부딪힐 가능성이 높다.",
          "Late October. First snow on the high passes. The southern coastal route is slow and risks contact with Rome at Massilia.",
        ),
      },
      {
        label: L("로마의 위치 (리비우스 21.32)", "Rome's position (Livy 21.32)"),
        value: L(
          "푸블리우스 스키피오의 군단이 로다누스 강 어귀에 도달. 카르타고가 남쪽으로 나오면 정면 충돌.",
          "Publius Scipio's legions have reached the Rhône delta. If Carthage moves south, head-on collision.",
        ),
      },
      {
        label: L("보급 상태", "Supply"),
        value: L(
          "로다누스 도하 후 보급 비축은 부족. 갈리아 부족 일부와 협상하는 중이지만 신뢰는 약하다.",
          "After the Rhône crossing, stocks are thin. Some Gallic tribes are negotiating, but trust is fragile.",
        ),
      },
    ],
    prompt: L("어느 길로 이탈리아에 들어갈 것인가?", "How will you enter Italy?"),
    choices: [
      {
        id: "direct",
        label: L("험준한 직선 경로 — 즉시 알프스를 강행 횡단", "Force the direct mountain pass at once"),
        reasoning: L(
          "겨울 전에 이탈리아 평원에 도달해야 한다. 손실은 크겠지만 로마는 이 시점의 우리를 예상하지 못한다.",
          "Be in the Italian plain before winter. Losses will be heavy, but Rome will not expect us this soon.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "한니발이 실제로 한 선택. 횡단에서 약 절반을 잃지만 12월 트레비아에서 결판을 낸다 (폴리비오스 3.56).",
          "Hannibal's actual choice. He lost roughly half the army crossing — but won at Trebia in December (Polybius 3.56).",
        ),
        judgment: L(
          "당신은 시간을 상수가 아닌 변수로 본다. 손실보다 속도를 택한 결단 — 큰 그림 안에서 작은 것을 던질 줄 아는 판단력.",
          "You treat time as a variable, not a constant. Speed over losses — the judgment of someone willing to spend the small to win the large.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "south-detour",
        label: L("남쪽 해안으로 우회한다 — 마실리아를 피해 리구리아로", "Detour south along the coast — past Massilia into Liguria"),
        reasoning: L(
          "산을 피하고 해안으로 가면 손실은 적다. 그러나 스키피오와 부딪힐 가능성이 크다.",
          "The coast spares the army the mountains — but Scipio likely intercepts.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Goldsworthy(2000)는 한니발이 이 길을 거부한 이유로 \"갈리아 동맹의 직선 보장\"을 든다. 우회는 시간을 잃고 동맹을 잃는다.",
          "Goldsworthy (2000) explains why Hannibal refused this path: it loses time and Gallic allies. The direct route was the alliance route.",
        ),
        judgment: L(
          "당신은 보이는 위험보다 보이지 않는 위험을 더 두려워한다. 안전을 우선하는 손실 회피 성향 — 신중함이 자기 결정의 무게를 잡아주는 사람.",
          "You fear unseen risk more than the one in front of you. Loss-aversion as a steady hand — caution is what anchors your judgment.",
        ),
      },
      {
        id: "winter-cisalpina",
        label: L("키사알피나에서 봄까지 대기한다", "Winter in Cisalpine Gaul, wait for spring"),
        reasoning: L(
          "병사들은 지쳤다. 봄에 신선한 군으로 알프스를 넘으면 손실이 적다.",
          "The men are exhausted. A fresh crossing in spring costs less.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: 1 },
          { axis: "AGG", weight: -2 },
        ],
        shadowOutcome: L(
          "로마는 겨울 동안 군단을 두 배로 늘리고 갈리아 동맹을 흔든다. 봄에 한니발이 도착할 즈음 이탈리아는 이미 준비되어 있다.",
          "Over winter Rome doubles its legions and undermines the Gallic alliance. By spring, Italy is ready and waiting.",
        ),
        judgment: L(
          "당신은 사람의 상태를 결정의 무게로 끌어들인다. 군사를 자원이 아닌 사람으로 보는 신중함 — 다만 적도 같은 시간에 쉰다는 것을 잊지 않아야 하는 판단.",
          "You let the state of your people weigh on your decisions. A caution that treats soldiers as people, not resources — though the enemy rests on the same clock.",
        ),
      },
      {
        id: "scout-first",
        label: L("정찰 분견대를 먼저 보내 길을 정하고 본대는 며칠 대기", "Send scouts ahead, hold the main force for a few days"),
        reasoning: L(
          "측근들도 길을 모른다. 며칠의 정보는 며칠의 시간만큼 가치가 있다.",
          "Even my officers don't know the passes. A few days of intelligence is worth a few days of time.",
        ),
        tags: [
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "정찰이 갈리아 부족 길잡이를 확보하면 손실을 줄일 수 있지만, 그 며칠 동안 스키피오가 더 다가온다.",
          "Scouts may secure Gallic guides and lower losses — but Scipio closes the gap during those days.",
        ),
        judgment: L(
          "당신은 결정 전에 정보를 더 모은다. 직관과 신중을 동시에 운영할 줄 아는 균형감 — 다만 정보가 시간을 먹는다는 것은 안다.",
          "You gather more before you commit. A balance of intuition and caution — knowing that information itself costs time.",
        ),
      },
    ],
    commanderActual: L(
      "한니발은 직선 경로를 강행했다. 15일 만에 알프스를 넘었지만 약 절반의 병력과 거의 모든 코끼리를 잃었다. 폴리비오스(3.56)는 이탈리아 평원에 도착했을 때 보병 2만, 기병 6천만 남았다고 적었다.",
      "Hannibal forced the direct route. He crossed in fifteen days but lost roughly half the army and nearly all the elephants. Polybius (3.56) records 20,000 infantry and 6,000 cavalry reaching the Italian plain.",
    ),
    sources: L(
      "출처: 폴리비오스 3.50–56 · 리비우스 21.31–37 · Goldsworthy, The Punic Wars (2000), pp. 168–172.",
      "Sources: Polybius 3.50–56; Livy 21.31–37; Goldsworthy, The Punic Wars (2000), pp. 168–172.",
    ),
  },
  {
    id: "trebia",
    index: 2,
    era: L("기원전 218년 12월", "December, 218 BCE"),
    location: L("트레비아 강 — 키사알피나", "River Trebia — Cisalpine Gaul"),
    scene: L(
      "알프스 횡단의 후유증이 가시지 않은 채, 카르타고는 트레비아 강 인근에서 갈리아 동맹과 함께 진을 친다. 로마 집정관 셈프로니우스 롱구스는 결전을 갈망한다 — 그의 임기 안에 승리를 거두려 한다.",
      "The army has not yet recovered from the Alps. Hannibal camps near the Trebia with Gallic allies. The Roman consul Sempronius Longus burns for a decisive battle — he wants the victory before his term ends.",
    ),
    briefing: [
      {
        label: L("적 지휘", "Enemy command"),
        value: L(
          "셈프로니우스(강경)와 부상으로 침대에 누운 푸블리우스 스키피오(신중) — 셈프로니우스가 단독으로 결정한다.",
          "Sempronius (hawkish) and the wounded, bed-bound Publius Scipio (cautious) — Sempronius is acting alone.",
        ),
      },
      {
        label: L("지형 (폴리비오스 3.71)", "Terrain (Polybius 3.71)"),
        value: L(
          "트레비아 강 동안에 평원, 강 한쪽에 가려진 소하천 도랑. 동생 마고가 \"기병 1천을 도랑에 매복할 수 있다\"고 보고했다.",
          "Plain on the east bank; a hidden streambed cuts the field. Hannibal's brother Mago reports: \"a thousand cavalry can hide in that gully.\"",
        ),
      },
      {
        label: L("기상", "Weather"),
        value: L(
          "한겨울. 새벽 강물은 얼음 같다. 도하한 군은 추위로 무너진다.",
          "Mid-winter. The river runs ice-cold at dawn. Troops who cross will be numb before the fight.",
        ),
      },
      {
        label: L("병력 (폴리비오스 3.72)", "Forces (Polybius 3.72)"),
        value: L(
          "카르타고 약 3만 (갈리아 동맹 포함) — 로마 약 4만 (보병 1만 6천 로마인 + 동맹 2만 + 기병 4천)",
          "Carthage ≈ 30,000 (with Gallic allies) — Rome ≈ 40,000 (16k Roman infantry + 20k allies + 4k cavalry).",
        ),
      },
    ],
    prompt: L("어떻게 결판을 낼 것인가?", "How will you settle this?"),
    choices: [
      {
        id: "ambush",
        label: L("새벽에 적을 도발해 차가운 강을 건너게 하고, 마고의 매복을 친다", "Provoke them at dawn into the icy river, then spring Mago's ambush"),
        reasoning: L(
          "셈프로니우스의 조급함을 무기로 쓴다. 그가 강을 건너오는 순간 그의 군은 이미 절반이 무너진 군이다.",
          "Use Sempronius's impatience against him. By the time he crosses, half his army is already broken — by the cold.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "한니발의 실제 선택. 로마군 약 2만이 사망하고, 마고의 측면 매복이 결정타가 된다 (폴리비오스 3.74).",
          "Hannibal's actual choice. About 20,000 Romans fell; Mago's flank ambush was the decisive blow (Polybius 3.74).",
        ),
        judgment: L(
          "당신은 적의 약점을 자기 무기로 만든다. 상대의 조급함을 자기 자원으로 채굴하는 직관 — 사람을 읽고 그 위에 진형을 그리는 판단.",
          "You forge the enemy's weakness into your own weapon. The intuition that mines impatience like ore — reading people, then drawing the line over them.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "frontal",
        label: L("평원에서 정면 결전을 건다", "Stake everything on a frontal battle on the plain"),
        reasoning: L(
          "갈리아 동맹은 시간이 갈수록 흔들린다. 빨리 부숴야 한다.",
          "The Gallic alliance erodes by the day. Strike fast.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "수적으로 불리한 정면전. Daly(2002)는 정면 결전이 카르타고에 \"승률 5할 미만\"이었다고 본다.",
          "An outnumbered frontal fight. Daly (2002) estimates such an engagement gave Carthage \"under 50% odds.\"",
        ),
        judgment: L(
          "당신은 시간이 자기 편이 아니라고 판단했다. 정면 충돌의 무게를 받아들이는 결단형 — 빠른 결판을 두려워하지 않는 의지.",
          "You judged that time was not on your side. The decisiveness to accept a head-on collision — willing to settle quickly, even on bad odds.",
        ),
      },
      {
        id: "withdraw",
        label: L("후퇴해 동계 보급을 확보하고 봄에 다시 친다", "Withdraw for winter supply, strike again in spring"),
        reasoning: L(
          "병사들은 알프스 직후라 지쳤다. 봄이면 신선한 군이 된다.",
          "The army is still battered from the Alps. By spring it will be fresh.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "셈프로니우스가 \"한니발이 도망쳤다\"고 선전한다. 갈리아 동맹이 흔들리고, 키사알피나의 기반이 위태로워진다.",
          "Sempronius will trumpet that Hannibal fled. Gallic allies waver; the Cisalpine foothold weakens.",
        ),
        judgment: L(
          "당신은 한 번의 승리보다 한 번의 회복을 택한다. 길게 보는 자제력 — 다만 회피가 적의 선전 카드가 된다는 것은 감수해야 하는 판단.",
          "You choose a recovery over a victory. The self-restraint of the long view — knowing that retreat itself becomes the enemy's headline.",
        ),
      },
      {
        id: "diplomacy",
        label: L("갈리아 부족과 동맹을 강화하며 시간을 번다", "Deepen Gallic alliances, play for time"),
        reasoning: L(
          "보이족·인수브레스족과 결혼·인질 외교를 묶으면 봄까지의 기반이 단단해진다.",
          "Hostage-and-marriage diplomacy with the Boii and Insubres locks in the base by spring.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "동맹은 굳어진다. 그러나 로마 원로원도 같은 시간에 군단을 두 배로 늘린다 (Hoyos 2003).",
          "Alliances harden — but Rome doubles its legions in the same months (Hoyos 2003).",
        ),
        judgment: L(
          "당신은 칼로 풀 일을 말로 풀려 한다. 동맹을 자원으로 보는 외교 지향 — 칼을 미루는 것이 칼을 두려워하는 것과 다르다는 것을 아는 판단.",
          "You try to settle with words what others would settle with steel. A diplomatic instinct — knowing that delaying the sword is not the same as fearing it.",
        ),
      },
    ],
    commanderActual: L(
      "한니발은 누미디아 기병으로 새벽에 셈프로니우스를 도발했다. 로마군은 아침을 거른 채 얼음 강을 건넜고, 마고의 매복은 결정타가 됐다. 약 2만 명의 로마군이 그날 죽었다 (폴리비오스 3.71–74).",
      "Hannibal sent Numidians to bait Sempronius at dawn. The Romans crossed the frozen river without breakfast; Mago's ambush did the rest. About 20,000 Romans died that day (Polybius 3.71–74).",
    ),
    sources: L(
      "출처: 폴리비오스 3.71–74 · 리비우스 21.54–56 · Lazenby, Hannibal's War (1978), pp. 55–58.",
      "Sources: Polybius 3.71–74; Livy 21.54–56; Lazenby, Hannibal's War (1978), pp. 55–58.",
    ),
  },
  {
    id: "trasimene",
    index: 3,
    era: L("기원전 217년 6월", "June, 217 BCE"),
    location: L("트라시메누스 호 북안 — 에트루리아", "North shore of Lake Trasimene — Etruria"),
    scene: L(
      "트레비아 다음 해 봄. 카르타고는 아펜니노 산맥을 넘으며 늪 행군에서 한쪽 눈을 잃은 한니발이 군을 이끈다. 새 집정관 가이우스 플라미니우스는 트레비아의 복수를 외치며 전속력으로 추격해온다. 호수 북쪽, 산이 호반까지 내려오는 좁은 길이 보인다.",
      "Spring after Trebia. Hannibal crosses the Apennines, losing one eye in the Arno marshes. The new consul, Gaius Flaminius, vows to avenge Trebia and pursues at full speed. North of the lake, hills come right down to the shore — a narrow defile.",
    ),
    briefing: [
      {
        label: L("적 지휘 (폴리비오스 3.80)", "Enemy command (Polybius 3.80)"),
        value: L(
          "플라미니우스는 \"한니발의 흔적만 봐도 추격한다\"는 말을 들을 만큼 조급하다. 보좌관들의 신중론을 거부.",
          "Flaminius is so impatient he is said to chase \"the smoke of Hannibal's trail.\" He has refused his officers' caution.",
        ),
      },
      {
        label: L("지형 (리비우스 22.4)", "Terrain (Livy 22.4)"),
        value: L(
          "호수 북안 — 한쪽은 호수, 다른 한쪽은 산. 새벽 안개가 호수에서 자주 올라온다. 4km의 길에 2만 5천을 매복할 수 있다.",
          "North shore — lake on one side, hills on the other. Dawn mist rises from the water. 25,000 men can hide along 4 km of road.",
        ),
      },
      {
        label: L("정찰 보고", "Scout report"),
        value: L(
          "플라미니우스가 일출 직후 호반 길에 진입할 것으로 예상. 후위 척후를 두지 않는다.",
          "Flaminius expected to enter the lake road at sunrise; he is moving without a rear guard.",
        ),
      },
    ],
    prompt: L("어떻게 칠 것인가?", "How do you strike?"),
    choices: [
      {
        id: "lake-ambush",
        label: L("호반 안개를 이용해 4km 매복선을 친다", "Set the 4-km ambush line, screened by lake mist"),
        reasoning: L(
          "그가 진입하면 빠져나갈 길이 없다. 학계는 이 매복을 \"고대 군사사상 가장 완벽한 함정\"이라 부른다.",
          "Once he enters, he cannot leave. Scholars call this trap one of the most perfect in ancient military history.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "한니발의 실제 선택. 약 3시간 만에 로마군 1만 5천이 죽고 플라미니우스도 전사 (폴리비오스 3.84).",
          "Hannibal's actual choice. In about three hours, 15,000 Romans died and Flaminius fell (Polybius 3.84).",
        ),
        judgment: L(
          "당신은 지형이 줄 수 있는 마지막 한 방울까지 짜낸다. 안개·호수·산을 무기로 읽는 직관 — 환경을 읽는 사람의 결정.",
          "You squeeze the last drop out of the terrain. The intuition that reads mist, lake, and hills as weapons — the judgment of someone who reads environment as much as enemy.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "force-pitched",
        label: L("호수에서 멀리 떨어진 평원에서 정면 결전을 건다", "Pull back to open ground and force a pitched battle"),
        reasoning: L(
          "플라미니우스가 추격해 오는 한 우리가 장소를 고를 수 있다. 트레비아처럼 정면에서도 이길 수 있다.",
          "While he is chasing, we choose the ground. We won at Trebia in the open; we can do it again.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: -1 },
        ],
        shadowOutcome: L(
          "정면 결전은 사상자가 양쪽 모두 큰 피로스 승. 다음 결전이 훨씬 어려워진다.",
          "A frontal fight is a Pyrrhic win — heavy losses on both sides. The next decisive battle becomes far harder.",
        ),
        judgment: L(
          "당신은 한 번 통한 길이 또 통한다고 본다. 자신감과 정공법의 결단형 — 다만 적이 학습하는 속도를 과소평가할 수 있다는 점은 자기 약점.",
          "What worked once will work again — that's how you read it. The confidence of straightforward force, with one cost: underestimating how fast the enemy learns.",
        ),
      },
      {
        id: "bypass",
        label: L("산악으로 우회해 플라미니우스의 후방·보급을 차단한다", "Swing through the hills, cut Flaminius's supply"),
        reasoning: L(
          "결전 없이 그를 무력화한다. 그러나 시간이 걸리고, 우리도 보급이 부족하다.",
          "Neutralize him without battle. But it takes time, and our own supply is thin.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "Lazenby(1978): 한니발의 \"진짜 의도는 동맹 분리\". 결전을 피하면 동맹 도시에 더 큰 압력을 가할 수 있다 — 그러나 결정적 충격은 없다.",
          "Lazenby (1978): Hannibal's \"true intent was alliance separation.\" Avoiding battle pressures cities more — but no decisive shock.",
        ),
        judgment: L(
          "당신은 결전 없이 적의 발을 묶을 줄 안다. 큰 그림에서 한 수를 빼는 침착함 — 결정적 한 방을 포기하더라도 판을 흔드는 사람의 사고.",
          "You can pin the enemy without a battle. The composure to subtract a move from the big picture — willing to forgo the decisive blow if it shifts the board.",
        ),
      },
      {
        id: "avoid",
        label: L("결전 회피, 풀리아로 진군해 동맹을 흔든다", "Avoid battle, march into Apulia, work on allies"),
        reasoning: L(
          "플라미니우스가 추격을 멈추지 않으면 우리도 결전을 강요당할 수 있다. 회피는 시간을 산다.",
          "If Flaminius keeps chasing, battle could be forced anyway. Avoiding buys time.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "로마 원로원이 파비우스를 독재관에 임명한다 — 한니발의 가장 어려운 상대가 등장.",
          "The Senate appoints Fabius dictator — the hardest opponent Hannibal will face.",
        ),
        judgment: L(
          "당신은 적의 추격에 자기 결정을 맡기지 않는다. 자기 페이스를 지키는 자제력 — 강요받은 결전을 거부하는 의지의 판단.",
          "You don't let the enemy's pursuit set the tempo of your decision. The self-control to keep your own pace — the judgment that refuses a battle on someone else's terms.",
        ),
      },
    ],
    commanderActual: L(
      "한니발은 호반 매복을 선택했다. 일출과 함께 안개에서 카르타고군이 쏟아져 나왔고, 플라미니우스의 군은 진형도 짜지 못한 채 무너졌다. 1만 5천이 죽고 1만 5천이 포로가 됐다 (리비우스 22.7).",
      "Hannibal chose the lake ambush. As the sun rose through the mist, Carthaginian troops poured down from the hills. Flaminius's army never formed a line. 15,000 dead, 15,000 captured (Livy 22.7).",
    ),
    sources: L(
      "출처: 폴리비오스 3.80–85 · 리비우스 22.3–7 · Goldsworthy, The Punic Wars (2000), pp. 191–195.",
      "Sources: Polybius 3.80–85; Livy 22.3–7; Goldsworthy, The Punic Wars (2000), pp. 191–195.",
    ),
  },
  {
    id: "cannae-formation",
    index: 4,
    era: L("기원전 216년 8월 2일 새벽", "Dawn, August 2, 216 BCE"),
    location: L("아우피두스 강 옆 평원 — 아풀리아", "Plain by the river Aufidus — Apulia"),
    scene: L(
      "두 해의 추격 끝에 로마는 사상 최대의 군단을 칸나에로 보냈다. 두 집정관, 8만이 넘는 보병, 6천 기병. 로마는 \"이번 한 번에 끝낸다\"고 결의했다. 카르타고는 그 절반의 병력으로 마주 선다. 새벽 안개가 걷히기 전, 진영을 짜야 한다.",
      "After two years of pursuit, Rome has sent its largest army ever to Cannae — two consuls, over 80,000 infantry, 6,000 cavalry. Rome has resolved to \"settle it in one stroke.\" Carthage has half those numbers. The mist has not yet lifted. The line must be set now.",
    ),
    briefing: [
      {
        label: L("로마 진형 (폴리비오스 3.113)", "Roman line (Polybius 3.113)"),
        value: L(
          "정면 폭은 평소보다 좁고, 보병 깊이는 \"전례 없는\" 두께. 바로의 강경 지휘일이다.",
          "An unusually narrow front, with infantry of \"unprecedented\" depth. Today is Varro's command day.",
        ),
      },
      {
        label: L("Daly(2002)의 분석", "Daly (2002)"),
        value: L(
          "정면 폭이 좁으면 로마 후위는 싸움에 가담조차 못한다. 깊이가 강점이 아닌 부담이 된다.",
          "With a narrow front, Roman rear ranks never reach the fight. Depth becomes a burden, not a strength.",
        ),
      },
      {
        label: L("기병 비교", "Cavalry"),
        value: L(
          "카르타고 1만 (스페인·갈리아 중장 + 누미디아 경기병) — 로마 6천. 거의 두 배.",
          "Carthage 10,000 (heavy + Numidian light) — Rome 6,000. Nearly 2:1 in your favor.",
        ),
      },
      {
        label: L("바람 (폴리비오스 3.115)", "Wind (Polybius 3.115)"),
        value: L(
          "남동풍 볼투르누스가 로마군 방향으로 분다. 먼지가 그들 눈을 덮을 것이다.",
          "The southeast Volturnus blows toward the Roman line. Dust will fly into their eyes.",
        ),
      },
    ],
    prompt: L("진영의 핵심 동작은?", "Your decisive maneuver?"),
    choices: [
      {
        id: "yielding-center",
        label: L("약한 중앙을 일부러 적쪽으로 볼록 내밀고, 양 측면 베테랑이 안쪽으로 회전한다", "Bow the weak center forward; veteran flanks pivot inward"),
        reasoning: L(
          "로마가 깊숙이 들어올수록 측면이 길어진다. 우리 기병이 후방을 도는 시간이 생긴다.",
          "The deeper they push, the longer their flanks. The cavalry has time to ride around their rear.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "한니발의 실제 선택. 폴리비오스는 약 7만 로마 사망·1만 포로, 카르타고 5,700 사망을 기록했다 (3.117).",
          "Hannibal's actual choice. Polybius records ~70,000 Romans killed, 10,000 captured, against 5,700 Carthaginian dead (3.117).",
        ),
        judgment: L(
          "당신은 자기 약점을 미끼로 던질 줄 안다. 진형의 한가운데에 위험을 두는 직관과 담력 — 위험을 통제하는 사람과 회피하는 사람의 결정적 차이.",
          "You can bait with your own weakness. The intuition and nerve to place risk at the center of the line — the line that separates someone who controls risk from someone who flees it.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "strong-center",
        label: L("정통적인 강한 중앙으로 정면 충돌한다", "Hold a conventional strong center, slug it out"),
        reasoning: L(
          "안전하다. 그러나 로마의 깊이가 결국 시간을 얻는다.",
          "Safer — but Roman depth eventually buys them time.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "Goldsworthy(2000): \"승리는 했겠지만 학살은 아니었을 것.\" 카르타고 베테랑 손실이 커진다.",
          "Goldsworthy (2000): \"You would still have won — but not produced a massacre.\" Veteran losses rise.",
        ),
        judgment: L(
          "당신은 안전한 진형으로 시간을 버는 길을 택했다. 모험보다 안정을 우선하는 판단 — 큰 승리는 미루더라도 큰 패배는 막는 사고.",
          "You chose the safer line, buying time with stability. Stability over adventure — willing to delay a great win to forbid a great loss.",
        ),
      },
      {
        id: "feigned-retreat",
        label: L("트레비아처럼 위장 후퇴로 적을 끌어낸다", "Stage a feigned retreat, as at Trebia"),
        reasoning: L(
          "한 번 통한 수다.",
          "It worked once.",
        ),
        tags: [
          { axis: "INT", weight: 1 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "Daly(2002): \"한니발의 가장 큰 기교는 첫 회였기에 통했다.\" 로마 군단병들은 트레비아 생존자에게서 그 패배를 들었다.",
          "Daly (2002): \"Hannibal's deceptions worked because they were first encounters.\" By Cannae the legionaries have heard the Trebia story.",
        ),
        judgment: L(
          "당신은 한 번 통한 기교에 의지한다. 검증된 카드를 다시 꺼내는 실용주의 — 다만 적이 학습했음을 살피지 않으면 자기 무기가 자기에게 돌아온다.",
          "You lean on a trick that worked. A pragmatism that reuses the proven card — but if you miss that the enemy has learned, the weapon turns on you.",
        ),
      },
      {
        id: "wide-flank",
        label: L("정면 폭을 넓혀 측면을 충분히 보호한다", "Widen the front to fully protect the flanks"),
        reasoning: L(
          "안전한 진형. 그러나 우리 기병의 우위가 살아나지 않는다.",
          "A safe formation — but your cavalry advantage stops mattering.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "결정적 결판이 없는 소모전. 양쪽 모두 전열을 유지한 채 일몰을 맞이한다.",
          "An attritional clash with no decision. Both lines hold until sunset.",
        ),
        judgment: L(
          "당신은 위험을 측면에서 잘라낸다. 강점을 살리기보다 약점을 먼저 막는 방어 우선형 — 큰 승리를 그리는 손이 아닌, 큰 패배를 막는 손.",
          "You cut risk off at the flank. Defense before offense — not the hand that paints the great victory, but the one that blocks the great defeat.",
        ),
      },
    ],
    commanderActual: L(
      "한니발은 약한 갈리아·스페인 보병을 중앙에서 적쪽으로 볼록하게 내밀고, 강한 아프리카 베테랑을 양 측면에 두었다. 중앙이 후퇴할수록 양 측면이 안쪽으로 회전했고, 하스드루발의 기병이 후방을 차단했다 (폴리비오스 3.115).",
      "Hannibal placed his weakest Gallic and Spanish infantry forward in a convex bow, with his strongest Africans on the flanks. As the center yielded, the flanks pivoted inward; Hasdrubal's cavalry sealed the rear (Polybius 3.115).",
    ),
    sources: L(
      "출처: 폴리비오스 3.113–117 · 리비우스 22.46–49 · Daly, Cannae (2002).",
      "Sources: Polybius 3.113–117; Livy 22.46–49; Daly, Cannae (2002).",
    ),
  },
  {
    id: "march-on-rome",
    index: 5,
    era: L("기원전 216년 8월 2일 일몰", "Sunset, August 2, 216 BCE"),
    location: L("칸나에 평원 — 시체로 채워진 들", "The plain of Cannae — a field of corpses"),
    scene: L(
      "포위가 완성됐다. 일몰까지 학살이 이어진다. 부지휘관 마하르발이 한니발 앞에 서서 외친다 — \"한니발, 당신은 이기는 법은 알지만 승리를 쓰는 법은 모릅니다. 닷새 안에 카피톨리움에서 식사하실 수 있습니다.\"",
      "The encirclement is closed. The slaughter has gone on until sunset. Maharbal stands before Hannibal: \"Hannibal, you know how to win a victory but not how to use one. In five days, you could be dining on the Capitol.\"",
    ),
    briefing: [
      {
        label: L("우리의 상황", "Your situation"),
        value: L(
          "병력 손실 약 5,700~8,000 (사료별 차이). 보병은 지쳤고, 공성 장비는 없다.",
          "Casualties ≈ 5,700–8,000 (sources differ). Infantry exhausted; no siege train.",
        ),
      },
      {
        label: L("로마까지", "Distance to Rome"),
        value: L(
          "약 400km — 강행군 닷새. 도중의 라티움 동맹들은 무너지지 않았다.",
          "≈ 400 km — five days at forced march. Latin allies along the route have not fallen.",
        ),
      },
      {
        label: L("학자 견해", "Scholarly views"),
        value: L(
          "Liddell Hart(1929)는 가능했다고 본다. Delbrück·Goldsworthy는 공성 장비·보급 부재로 불가능했다고 본다. 양 견해 살아 있다.",
          "Liddell Hart (1929) argued it was possible. Delbrück and Goldsworthy held it was not — no siege train, no supply. Both views remain.",
        ),
      },
      {
        label: L("동맹 도시 분위기", "Allied cities"),
        value: L(
          "카푸아·타렌툼이 흔들린다. 결정적 한 수가 그들의 결심을 굳힐 수 있다.",
          "Capua and Tarentum are wavering. A decisive move could make up their minds.",
        ),
      },
    ],
    prompt: L("승리 다음의 한 수는?", "What do you do with the victory?"),
    choices: [
      {
        id: "rest-allies",
        label: L("병사를 쉬게 하고 동맹을 늘린다", "Rest the men and gather more allies"),
        reasoning: L(
          "\"카피톨리움의 식사\"는 사양한다. 동맹 분리가 진짜 목적이다.",
          "I decline the dinner on the Capitol. Breaking the alliances is the real aim.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: 2 },
        ],
        shadowOutcome: L(
          "한니발의 실제 선택. 카푸아가 카르타고 편으로 돌아선다. 그러나 라티움 핵심 동맹은 끝까지 흔들리지 않는다.",
          "Hannibal's actual choice. Capua flips. But the Latin core never wavers.",
        ),
        judgment: L(
          "당신은 칼을 거두고 동맹을 그릴 줄 안다. 승리의 다음 한 수를 외교에서 보는 장기 전략가의 사고 — 다만 결정적 한 방을 미루는 대가도 같이 지는 판단.",
          "You sheathe the sword and reach for alliances. The long-strategist who sees the next move in diplomacy — though the cost of postponing the decisive blow is yours to carry.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "march-rome",
        label: L("즉시 로마로 강행군한다", "Force-march on Rome at once"),
        reasoning: L(
          "마하르발의 길이다. 학자들이 가장 오래 다투는 분기.",
          "Maharbal's road. The longest-running counterfactual in the literature.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "Goldsworthy·Lazenby는 \"공성 수단 부재\"로 불가능했다고 본다. 시문 앞에서 수일을 머무르다 보급 부족으로 후퇴.",
          "Goldsworthy and Lazenby see it as impossible without a siege train. The army would camp at Rome's gates for days, then retreat for lack of supply.",
        ),
        judgment: L(
          "당신은 기회의 창을 두 번 보지 않는다. 망설이면 사라지는 순간을 잡는 결단형 — 이상은 위험하지만 망설임은 더 위험하다는 사고.",
          "You don't look twice at a window of opportunity. The decisiveness that grabs the moment before it closes — risk is dangerous, but hesitation is worse.",
        ),
      },
      {
        id: "ostia",
        label: L("로마의 곡물 항구 오스티아를 친다", "Strike Rome's grain port at Ostia"),
        reasoning: L(
          "곡물을 끊어 로마를 협상으로 끌어낸다.",
          "Cut the grain, bring Rome to the table.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "Lazenby(1978): \"카르타고 함대가 서안에 도달할 능력 자체가 의심스럽다.\" 점령은 가능하나 유지가 어렵다.",
          "Lazenby (1978): \"The Carthaginian fleet's ability to reach the western coast is itself questionable.\" Capture, perhaps; hold, no.",
        ),
        judgment: L(
          "당신은 정공법 대신 보급선을 본다. 적의 약점을 다른 각도에서 짚는 사고 — 직접 충돌이 아닌 우회로 결판을 보는 전략적 시야.",
          "You don't go straight at the enemy — you go at his supply line. The thinking that strikes from a different angle — strategic vision over frontal force.",
        ),
      },
      {
        id: "peace",
        label: L("로마 원로원에 평화 사절을 보낸다", "Send peace envoys to Rome"),
        reasoning: L(
          "이번엔 칸나에의 7만 시체가 협상을 강요한다.",
          "This time the seventy thousand corpses argue the terms.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "리비우스 22.58: 로마 원로원은 한 표 차로 사절 입성을 거부한다. 8천 포로는 노예로 팔린다.",
          "Livy 22.58: the Senate refuses entry by a single vote. Eight thousand prisoners are sold into slavery.",
        ),
        judgment: L(
          "당신은 칼로 얻은 우위를 말로 결판짓고자 한다. 외교를 마지막 무기로 보는 평화주의자 — 다만 적이 같은 합리성을 공유한다는 가정에 베팅하는 판단.",
          "You bring the advantage won by steel to the table of words. The peace-seeker who keeps diplomacy as the final weapon — but the bet rests on the enemy sharing your reason.",
        ),
      },
    ],
    commanderActual: L(
      "한니발은 마하르발에게 답했다 — \"앉아서 더 깊이 생각해보아야겠다.\" 그는 로마로 진군하지 않고 칸나에에서 휴식하며 동맹 확장을 택했다. 카푸아·타렌툼이 카르타고 편으로 돌아섰지만, 라티움 핵심 동맹은 끝내 흔들리지 않았다 (리비우스 22.51).",
      "Hannibal answered Maharbal: \"I will sit and think on it.\" He did not march on Rome; he rested at Cannae and worked on alliances. Capua and Tarentum flipped to Carthage — but the Latin core never broke (Livy 22.51).",
    ),
    sources: L(
      "출처: 리비우스 22.51, 22.58 · Liddell Hart, Greater than Napoleon (1929) · Delbrück, Geschichte der Kriegskunst (1920) · Lazenby, Hannibal's War (1978).",
      "Sources: Livy 22.51, 22.58; Liddell Hart, Greater than Napoleon (1929); Delbrück, Geschichte der Kriegskunst (1920); Lazenby, Hannibal's War (1978).",
    ),
  },
];

export const HANNIBAL_ARCHETYPES: Archetype[] = [
  {
    id: "hannibal",
    name: L("한니발형 — 큰 그림과 결단의 지휘관", "The Hannibal — Vision and Decisiveness"),
    signature: L(
      "당신은 칸나에에서 코끼리를 다시 풀었을 지휘관이다.",
      "You are the hand that would have loosed the elephants at Cannae again.",
    ),
    desc: L(
      "직관과 공격성을 동시에 갖춘 드문 지휘관. 정해진 절차를 거부하고 적의 약점을 한순간에 짚어낸다. 큰 그림을 그리되 결정적 순간에 망설이지 않는다.",
      "A rare hand that holds intuition and aggression together. Refuses procedure and reads the enemy's weak point in a single moment. Draws the big picture, but does not hesitate at the decisive instant.",
    ),
    strengths: [
      L("적이 보지 못한 길을 먼저 본다", "Sees roads the enemy has not seen"),
      L("기회의 창이 열리면 망설이지 않는다", "Does not hesitate when a window opens"),
      L("불리한 숫자를 직관과 진형으로 뒤집는다", "Flips bad odds with intuition and formation"),
    ],
    watchOut: [
      L("승리한 다음의 한 수를 종종 비워둔다", "Often leaves the move-after-victory blank"),
      L("같은 기교를 두 번 쓰면 적이 학습한다", "Repeating a trick teaches the enemy"),
      L("정치·보급의 후방이 약해질 수 있다", "The political and supply rear can thin"),
    ],
    pairsWithId: "fabius",
    clashesWithId: "scipio",
    profile: { AGG: 1, CAU: 0, DIP: 0, INT: 2 },
  },
  {
    id: "fabius",
    name: L("파비우스형 — 시간으로 승리하는 지휘관", "The Fabius — Wear Them Down"),
    signature: L(
      "당신은 적이 스스로 무너지는 시간을 살 줄 안다.",
      "You buy the time in which the enemy ruins himself.",
    ),
    desc: L(
      "Q. 파비우스 막시무스 쿵크타토르(\"지연자\"). 결전을 받지 않고 적의 보급·시간·정치를 갉아먹는다. 단기 영광보다 장기 승리를 선택한다.",
      "Q. Fabius Maximus Cunctator — \"the Delayer.\" Refuses pitched battle, eats away supply, time, and politics. Chooses long victory over short glory.",
    ),
    strengths: [
      L("불리할 때 시간을 자기 편으로 만든다", "Makes time itself an ally when outmatched"),
      L("적의 조급함을 자원처럼 채굴한다", "Mines the enemy's impatience like ore"),
      L("외교·보급으로 전장을 우회 설계한다", "Redesigns the battlefield through supply and diplomacy"),
    ],
    watchOut: [
      L("\"비겁자\"라는 비난을 안에서 듣는다", "Hears \"coward\" from your own side"),
      L("결정적 순간에도 결전을 미뤄 기회를 놓친다", "May postpone the decisive blow until it slips away"),
      L("정치적 신임이 떨어지면 전략 자체가 무너진다", "If political trust fades, the whole strategy collapses"),
    ],
    pairsWithId: "marcellus",
    clashesWithId: "hannibal",
    profile: { AGG: -1, CAU: 2, DIP: 1, INT: 0 },
  },
  {
    id: "scipio",
    name: L("스키피오형 — 균형으로 한니발을 이긴 지휘관", "The Scipio — Balance That Beat Hannibal"),
    signature: L(
      "당신은 한니발에게서 배우고, 그 배움으로 그를 꺾는 지휘관이다.",
      "You learn from Hannibal — and use the lesson to beat him.",
    ),
    desc: L(
      "스키피오 아프리카누스. 한니발의 전술을 학습하되 정치·외교를 함께 운용한 균형형. 자마에서 한니발 본인을 꺾는다.",
      "Scipio Africanus. Learned Hannibal's tactics but added politics and diplomacy — the balanced commander who defeated Hannibal at Zama.",
    ),
    strengths: [
      L("적의 무기를 빌려 그것을 적에게 돌려준다", "Borrows the enemy's weapon and turns it back"),
      L("전술과 정치를 동시에 운용한다", "Holds tactics and politics in the same hand"),
      L("한 번 진 곳에서 다시 일어선다", "Rises again from where you once fell"),
    ],
    watchOut: [
      L("균형은 가끔 결단의 무게를 지운다", "Balance can dilute the weight of a single decision"),
      L("개혁이 너무 빠르면 본국이 의심한다", "Reforms move so fast that home grows suspicious"),
      L("승리 후의 정치 무대가 칼날만큼 위험하다", "The politics after victory cuts as deep as any sword"),
    ],
    pairsWithId: "fabius",
    clashesWithId: "hannibal",
    profile: { AGG: 1, CAU: 1, DIP: 1, INT: 1 },
  },
  {
    id: "marcellus",
    name: L("마르첼루스형 — 로마의 검", "The Marcellus — Rome's Sword"),
    signature: L(
      "당신은 부수기 위해 부서지기를 두려워하지 않는다.",
      "You do not fear breaking, so long as you break the enemy too.",
    ),
    desc: L(
      "M. 클라우디우스 마르첼루스. 정면 충돌을 두려워하지 않는다. \"로마의 검\"이라 불렸으며, 한니발도 결정전을 피한 거의 유일한 적장. 부수기 위해 부서질 각오를 한다.",
      "M. Claudius Marcellus, called \"the Sword of Rome.\" Does not flinch from frontal collision — one of the few Roman generals Hannibal himself avoided fighting. Ready to break in order to break.",
    ),
    strengths: [
      L("정면 충돌의 무게를 자기 무기로 삼는다", "Wields the weight of head-on collision as a weapon"),
      L("아군 사기가 위태로운 순간 앞장선다", "Steps forward exactly when morale wavers"),
      L("적이 가장 두려워하는 적이 된다", "Becomes the enemy your enemy fears"),
    ],
    watchOut: [
      L("자신을 너무 자주 일선에 둔다", "Puts yourself on the front line too often"),
      L("전략적 우회의 가치를 과소평가하기 쉽다", "Underestimates the value of strategic detour"),
      L("한 번의 매복이 전체 작전을 끝낼 수 있다", "A single ambush can end the whole campaign"),
    ],
    pairsWithId: "fabius",
    clashesWithId: "hanno",
    profile: { AGG: 2, CAU: -1, DIP: 0, INT: 0 },
  },
  {
    id: "hanno",
    name: L("한노형 — 전쟁보다 협상을 보는 지휘관", "The Hanno — Negotiation Before War"),
    signature: L(
      "당신은 칼을 빼기 전에 끝낼 수 있는 전쟁을 본다.",
      "You see the war that ends before the sword is drawn.",
    ),
    desc: L(
      "한노 대(大)왕. 카르타고 평화파의 지도자로서 한니발의 이탈리아 원정 자체를 반대했다. 외교와 신중을 우선하며, 칼이 아닌 말로 결판을 보려 한다.",
      "Hanno the Great. Leader of Carthage's peace faction; opposed Hannibal's Italian expedition from the start. Diplomacy and caution before all — settles by word, not sword.",
    ),
    strengths: [
      L("싸우기 전에 끝낼 길을 본다", "Sees the road that ends the war before it begins"),
      L("동맹·결혼·인질을 무기처럼 운용한다", "Uses alliance, marriage, and hostage as weapons"),
      L("국력을 칼날 아닌 그릇으로 본다", "Treats national strength as a vessel, not a blade"),
    ],
    watchOut: [
      L("말이 칼보다 빠르지 않은 순간이 온다", "There comes a moment when words can't keep up with steel"),
      L("강경파에게 \"매국노\"로 몰리기 쉽다", "Easily branded a traitor by the war faction"),
      L("협상 카드가 사라진 자리에 남는 것이 없다", "When the negotiating cards run out, nothing remains"),
    ],
    pairsWithId: "scipio",
    clashesWithId: "marcellus",
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
    pairsWithId: "hannibal",
    clashesWithId: "marcellus",
    profile: { AGG: 0.5, CAU: 0.5, DIP: 0.5, INT: 0.5 },
  },
];

export function getArchetypeById(id: string): Archetype | undefined {
  return HANNIBAL_ARCHETYPES.find((a) => a.id === id);
}

export function encodePicks(picks: Record<string, string>): string {
  return encodePicksFor(picks, HANNIBAL_DILEMMAS);
}

export function decodePicks(
  p: string | null | undefined,
): Record<string, string> | null {
  return decodePicksFor(p, HANNIBAL_DILEMMAS);
}

export function evaluate(picks: Record<string, string>): EvalResult {
  return evaluatePicks(picks, HANNIBAL_DILEMMAS, HANNIBAL_ARCHETYPES);
}
