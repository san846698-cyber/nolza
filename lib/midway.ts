// 미드웨이 — your command-style assessment.
// Five independent dilemmas drawn from Nimitz's command of CINCPAC, June 1942.
//
// Sources (primary): U.S. Navy Action Reports, CINCPAC Operations Plan 29-42;
// Japanese sortie records translated in Parshall & Tully (2005).
// Modern: Walter Lord, Incredible Victory (1967); Gordon W. Prange, Miracle at
// Midway (1982); John B. Lundstrom, The First Team (1984); Jonathan Parshall &
// Anthony Tully, Shattered Sword (2005); Craig L. Symonds, The Battle of
// Midway (2011); Edwin T. Layton, And I Was There (1985).

export type {
  Archetype, Axis, AxisTag, BriefingItem, Choice, Dilemma,
  EvalResult, LocalizedString,
} from "./battle-shared";
export { AXIS_DESC, AXIS_LABEL, emptyScores } from "./battle-shared";

import {
  type Archetype, type Axis, type Dilemma, type EvalResult, type LocalizedString,
  decodePicksFor, encodePicksFor, evaluatePicks,
} from "./battle-shared";

const L = (ko: string, en: string): LocalizedString => ({ ko, en });

export const MIDWAY_DILEMMAS: Dilemma[] = [
  {
    id: "af-intel",
    index: 1,
    era: L("1942년 5월 하순", "Late May, 1942"),
    location: L("진주만 — CINCPAC 사령부 지하 암호 해독실", "Pearl Harbor — CINCPAC HQ, the basement of Station Hypo"),
    scene: L(
      "산호해 한 달 후. 일본 항모 한 척(쇼카쿠)은 손상, 한 척(즈이카쿠)은 항공대 소진. 그러나 1차 항모 기동부대 4척은 손대지 않았다. 로치포트 중령의 Station Hypo 팀은 일본 무선에서 'AF'라는 작전 목표가 반복된다고 보고한다. 로치포트는 'AF=미드웨이'라고 확신하지만, 워싱턴의 OP-20-G와 킹 제독은 알류샨 또는 진주만일 가능성을 더 높게 본다.",
      "One month after the Coral Sea. One Japanese carrier (Shōkaku) damaged, one (Zuikaku) drained of aircrew — but the four-carrier Kidō Butai is untouched. Cdr. Joseph Rochefort's Station Hypo reports the codename 'AF' running through Japanese traffic. Rochefort is sure AF = Midway. Washington's OP-20-G and Adm. King lean toward the Aleutians, or even Pearl itself.",
    ),
    briefing: [
      {
        label: L("정보원 (Layton 1985)", "The source (Layton 1985)"),
        value: L(
          "Station Hypo는 JN-25 암호의 약 10–15%만 해독한다. 'AF' 식별은 결정적 확증이 아니라 누적 추론 — 그러나 로치포트의 해석을 워싱턴은 의심하고 있다.",
          "Station Hypo reads only 10–15% of JN-25. The 'AF' identification is cumulative inference, not proof — and Washington distrusts Rochefort's reading.",
        ),
      },
      {
        label: L("아군 전력 (Lundstrom 1984)", "Own forces (Lundstrom 1984)"),
        value: L(
          "운용 가능한 항모 2척 (엔터프라이즈·호넷). 요크타운은 산호해에서 폭탄 3발 명중, 진주만 도크에 입거 중. 일본은 4척 기동.",
          "Two operational carriers (Enterprise, Hornet). Yorktown is in dry dock at Pearl after three bomb hits at Coral Sea. The Japanese will sortie four.",
        ),
      },
      {
        label: L("Layton의 미끼 제안", "Layton's bait (Layton 1985)"),
        value: L(
          "정보참모 Layton: 미드웨이 기지에서 \"증류기 고장 — 담수 부족\"을 평문 송신, 일본이 'AF에 담수 부족'으로 중계하면 확정된다.",
          "Layton's idea: have Midway radio in the clear that its desalination plant has failed. If Japanese traffic then reports 'AF short of water,' the identification is sealed.",
        ),
      },
      {
        label: L("정치 압력", "Political pressure"),
        value: L(
          "진주만 함락 6개월 후. 또 한 번의 기습은 니미츠의 지위를 끝낸다. 워싱턴은 '하와이 방어 우선'을 요구한다.",
          "Six months after Pearl Harbor. A second surprise ends Nimitz. Washington demands Hawaii first.",
        ),
      },
    ],
    prompt: L("Station Hypo의 'AF=미드웨이'를 어떻게 다룰 것인가?", "How will you handle Hypo's 'AF = Midway' call?"),
    choices: [
      {
        id: "trust-ambush",
        label: L("로치포트의 판단을 전적으로 신뢰하고 미드웨이 북동쪽에 매복 함대를 배치한다", "Trust Rochefort fully and pre-position the carriers northeast of Midway as an ambush"),
        reasoning: L(
          "정보가 70%면 95%를 기다릴 수 없다. 매복은 위치 선점에 달려 있다.",
          "Seventy-percent intelligence cannot wait for ninety-five. Ambush depends on getting there first.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "니미츠의 실제 선택. CINCPAC OpPlan 29-42는 미드웨이 북동 'Point Luck'에 항모를 배치한다 (Symonds 2011, ch. 8).",
          "Nimitz's actual choice. CINCPAC Operation Plan 29-42 stationed the carriers at \"Point Luck\" northeast of Midway (Symonds 2011, ch. 8).",
        ),
        judgment: L(
          "당신은 부하의 직관을 자기 결단의 무게로 받아들인다. 정보의 빈틈을 사람의 판단으로 메우는 위임형 — 신뢰가 함대의 위치를 정한다.",
          "You take a subordinate's intuition and carry it as your own decision. The delegating hand that fills information gaps with human judgment — trust itself sets the fleet's position.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "pearl-priority",
        label: L("하와이 방어를 최우선으로, 항모를 진주만 인근에 묶어둔다", "Hold the carriers near Pearl, defending Hawaii first"),
        reasoning: L(
          "진주만이 또 당하면 전쟁의 무게중심 자체가 무너진다. 미드웨이는 잃어도 다시 얻을 수 있다.",
          "If Pearl falls again, the war's center of gravity collapses. Midway can be lost and retaken.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Symonds(2011): 미드웨이 함락 시 \"하와이는 봉쇄 압박을 받지만 일본의 항속 한계상 점령 유지는 어렵다\". 다만 항모 4척이 온전히 살아남아 솔로몬 작전이 6개월 미뤄진다.",
          "Symonds (2011): Losing Midway would have \"pressed Hawaii under blockade but exceeded Japanese logistical reach for occupation.\" Yet four Japanese carriers survive intact, postponing the Solomons by six months.",
        ),
        judgment: L(
          "당신은 보이지 않는 위협보다 보이는 보호 책임을 우선한다. 본거지를 지키는 신중함 — 다만 적이 미끼와 본대를 분리했을 때 그 신중이 어디를 가리키는지가 시험된다.",
          "You weigh the visible duty to protect over the invisible threat. The caution of guarding the home — though when the enemy separates bait from main force, that caution is tested by where it points.",
        ),
      },
      {
        id: "wait-confirm",
        label: L("Layton의 담수 미끼를 송신하고 확증 전문이 잡힐 때까지 출항 대기", "Run Layton's water-shortage ruse and wait for the confirming intercept before sortieing"),
        reasoning: L(
          "확증되면 모두를 설득할 수 있다. 며칠의 대기로 95%의 신뢰를 산다.",
          "Confirmation persuades everyone. A few days of delay buys ninety-five-percent trust.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "Layton(1985)에 따르면 미끼는 실제로 송신됐고 며칠 안에 일본 측이 'AF 담수 부족'으로 중계 — 그러나 출항을 그때까지 미뤘다면 Point Luck 선점이 늦어졌을 것.",
          "Layton (1985) records that the ruse was actually sent and the Japanese duly relayed 'AF short of water' within days — but waiting to sortie until then would have cost the Point Luck position.",
        ),
        judgment: L(
          "당신은 결단 전에 한 걸음 더 정보를 본다. 직관과 절차를 동시에 운용하는 균형감 — 다만 시간을 사는 비용이 위치를 잃는 비용일 수 있다는 판단.",
          "You take one more step into the data before you commit. The balance that runs intuition and procedure together — though the time you buy can cost you the ground.",
        ),
      },
      {
        id: "split-hedge",
        label: L("함대를 분할해 미드웨이·알류샨에 동시 대비한다", "Split the fleet to cover Midway and the Aleutians simultaneously"),
        reasoning: L(
          "두 가능성에 모두 대비하면 어느 쪽이라도 패배는 면한다.",
          "Cover both possibilities and neither defeat is total.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "AGG", weight: -1 },
          { axis: "DIP", weight: 1 },
        ],
        shadowOutcome: L(
          "Prange(1982): 미군이 항모 3척을 분할했다면 \"수적 열세가 결정적 열세가 됐을 것\". 4 대 3은 매복으로 깨지지만 4 대 1.5는 그렇지 않다.",
          "Prange (1982): had Nimitz split the three carriers, \"numerical disadvantage would have become decisive.\" Four-to-three breaks under ambush; four-to-one-and-a-half does not.",
        ),
        judgment: L(
          "당신은 가능성의 어느 쪽에도 패배를 두지 않으려 한다. 위험을 분산하는 보험형 — 다만 분산은 매복의 무게를 분산해 결정적 한 방을 묽게 만든다.",
          "You refuse to leave defeat on either branch of the tree. The insurance hand that diversifies risk — but diversification dilutes the weight that an ambush needs.",
        ),
      },
    ],
    commanderActual: L(
      "니미츠는 로치포트의 판단에 베팅했다. Layton의 담수 미끼로 워싱턴까지 설득한 후, OpPlan 29-42에 따라 항모 3척을 미드웨이 북동 'Point Luck' (32°N, 173°W 인근)에 배치했다 (Layton 1985; Symonds 2011).",
      "Nimitz bet on Rochefort. Layton's water-shortage ruse confirmed AF for Washington, and CINCPAC Operation Plan 29-42 placed all three carriers at \"Point Luck,\" some 325 miles northeast of Midway (Layton 1985; Symonds 2011).",
    ),
    sources: L(
      "출처: CINCPAC OpPlan 29-42 · Layton, And I Was There (1985), ch. 22 · Symonds, The Battle of Midway (2011), ch. 8 · Prange, Miracle at Midway (1982).",
      "Sources: CINCPAC Op Plan 29-42; Layton, And I Was There (1985), ch. 22; Symonds, The Battle of Midway (2011), ch. 8; Prange, Miracle at Midway (1982).",
    ),
  },
  {
    id: "yorktown-repair",
    index: 2,
    era: L("1942년 5월 27일", "May 27, 1942"),
    location: L("진주만 — 1번 드라이독", "Pearl Harbor — Drydock No. 1"),
    scene: L(
      "요크타운이 산호해에서 폭탄 3발을 맞은 채 입항한다. 정상 수리 견적은 약 90일. 그러나 일본 함대는 6월 4일경 미드웨이에 도달한다. 니미츠는 도크에 들어가 수리반장에게 묻는다 — \"72시간 안에 출항할 수 있게 해주게.\"",
      "Yorktown limps into Pearl with three bomb hits from Coral Sea. The standard estimate for proper repair: about ninety days. But the Japanese strike force will be at Midway on or about June 4. Nimitz walks into the drydock and tells the yard chief: \"I want her out in seventy-two hours.\"",
    ),
    briefing: [
      {
        label: L("손상 상황 (CV-5 Action Report)", "Damage (CV-5 Action Report)"),
        value: L(
          "비행 갑판 관통 1, 격납고 화재, 보일러실 손상. 전투 가능 항공대는 제19함재기군과 결합 필요.",
          "One bomb through the flight deck, hangar fire, boiler-room damage. Fightable air group requires merging surviving Yorktown squadrons with VS-5/VB-5 elements.",
        ),
      },
      {
        label: L("수리 자원", "Yard resources"),
        value: L(
          "1,400명의 수리공이 24시간 3교대 가능. 발전·용접 자재는 충분, 단 비행 갑판 강재는 즉응품 한정.",
          "Some 1,400 yard workers can run 24-hour shifts. Power and welding stock adequate; flight-deck plating limited to what's on hand.",
        ),
      },
      {
        label: L("대안 (Lundstrom 1984)", "Alternative (Lundstrom 1984)"),
        value: L(
          "요크타운 없이 출전하면 항모 2 대 4. 산호해 사후 분석은 \"항모 1척 차이가 결정적\"이라고 본다.",
          "Without Yorktown the ratio is 2:4. Post-Coral-Sea analysis (Lundstrom 1984) holds that \"one carrier of difference is decisive.\"",
        ),
      },
      {
        label: L("리스크", "Risk"),
        value: L(
          "응급 수리 후 출항한 함은 다음 피탄 시 손상통제 능력이 정상의 60–70% 수준이라는 평가.",
          "A patched-up carrier's damage control will run at 60–70% of normal effectiveness on the next hit.",
        ),
      },
    ],
    prompt: L("요크타운을 어떻게 할 것인가?", "What do you do with Yorktown?"),
    choices: [
      {
        id: "72hr",
        label: L("72시간 응급 수리 후 출항시킨다", "Patch her in seventy-two hours and sortie her"),
        reasoning: L(
          "3척 대 4척과 2척 대 4척은 다른 전쟁이다. 손상통제 약화는 감수한다.",
          "Three-versus-four and two-versus-four are different wars. I will accept the weakened damage control.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "INT", weight: 2 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "니미츠의 실제 선택. 6월 4일 요크타운의 SBD가 소류를 격침에 기여하고, 요크타운 자신은 히류 공격으로 침몰 — 그러나 그 전에 4척 격침에 기여 (Lundstrom 1984; Symonds 2011).",
          "Nimitz's actual choice. On June 4 Yorktown's SBDs helped sink Sōryū before Hiryū's strike doomed her — but not before she had contributed to four enemy carriers down (Lundstrom 1984; Symonds 2011).",
        ),
        judgment: L(
          "당신은 \"불완전한 자산을 결정적 순간에 던진다\"는 결단을 안다. 100%를 기다리지 않고 60%를 결정적 시점에 투입하는 결단형.",
          "You know how to spend an incomplete asset at the decisive moment. The hand that does not wait for one hundred percent — it commits sixty at the right hour.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "full-repair",
        label: L("정상 90일 수리 — 요크타운 없이 출전한다", "Send her to full ninety-day repair; sortie without her"),
        reasoning: L(
          "응급 수리한 함을 잃는 것은 함과 승조원 둘 다 잃는 것이다.",
          "A patched carrier sunk is hull and crew both lost.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Parshall & Tully(2005): \"항모 2 대 4는 매복이라도 비대칭이 너무 크다.\" 6월 4일 결정적 한 시점에 더글러스 던틀리스 폭격대 한 무리가 부족했을 것.",
          "Parshall & Tully (2005): \"Two-versus-four is asymmetric beyond what an ambush can fix.\" The decisive minutes of June 4 would have been short one squadron of SBDs.",
        ),
        judgment: L(
          "당신은 자산을 보존하는 길을 우선한다. 다음 전쟁을 위해 이번 전쟁의 카드를 아끼는 보존형 — 다만 보존이 결정적 순간을 비우는 비용을 같이 진다.",
          "You preserve the asset. The conservator who keeps cards for the next war — though preservation pays the cost of an empty hand at the decisive hour.",
        ),
      },
      {
        id: "scrap",
        label: L("즉시 폐기·승조원을 신형 함으로 분산한다", "Strike her, redistribute the crew to other ships"),
        reasoning: L(
          "한 척에 베팅하지 말고 인적 자산을 함대 전체에 퍼뜨린다.",
          "Do not bet on one hull; spread the human asset across the fleet.",
        ),
        tags: [
          { axis: "DIP", weight: 1 },
          { axis: "CAU", weight: 1 },
          { axis: "AGG", weight: -2 },
        ],
        shadowOutcome: L(
          "산호해에서 벌어진 일과 정반대의 도박. Lord(1967)의 평: \"미군의 약점은 함이 아니라 숙련된 손이었다 — 그 손을 흩뜨리는 것은 다음 해를 위해 이번 해를 버리는 것\".",
          "The opposite gamble. Lord (1967): \"the American shortage was not hulls but trained hands — to scatter those hands was to spend this year for next.\"",
        ),
        judgment: L(
          "당신은 함보다 사람을 본다. 하드웨어보다 인적 자산을 자원으로 보는 시각 — 다만 이번 한 번의 전투에서 그 사람을 같은 갑판에 모아두지 못한 비용을 진다.",
          "You see people before steel. The hand that treats trained crews as the real resource — though the price is not having those people on the same deck for this one fight.",
        ),
      },
      {
        id: "atoll-base",
        label: L("미드웨이 인근으로 끌고 가 부동 기지함으로 쓴다", "Tow her near Midway as a stationary base ship"),
        reasoning: L(
          "기동은 못 해도 항공기 회수·재무장 거점으로는 쓸 수 있다.",
          "If she can't maneuver, she can still recover and rearm aircraft.",
        ),
        tags: [
          { axis: "INT", weight: 1 },
          { axis: "DIP", weight: 1 },
        ],
        shadowOutcome: L(
          "정지한 항모는 잠수함의 표적. Lundstrom(1984): \"기동 없는 갑판은 갑판이 아니다.\" 일본 잠수함 배치선과의 충돌 가능성이 매우 높다.",
          "A motionless carrier is a submarine's gift. Lundstrom (1984): \"a deck without movement is not a deck.\" The Japanese submarine cordon would almost certainly have found her.",
        ),
        judgment: L(
          "당신은 자산을 다른 형태로 다시 정의한다. 기동력 잃은 함을 기지로 변환하는 창의적 사고 — 다만 적의 고전적 공격 패턴이 그 창의를 처벌한다.",
          "You redefine an asset in a new shape. The creativity that turns a damaged carrier into a base — though the enemy's classical attack pattern punishes that creativity.",
        ),
      },
    ],
    commanderActual: L(
      "니미츠는 72시간 응급 수리를 명령했다. 약 1,400명의 진주만 수리공이 24시간 3교대로 투입돼 5월 30일 요크타운은 출항했다. 6월 4일 그녀의 SBD가 소류 격침에 기여했고, 히류의 두 차례 공격을 받아 침몰 직전 상태로 6월 7일 일본 잠수함 I-168의 어뢰에 침몰 (Lundstrom 1984).",
      "Nimitz ordered a 72-hour patch job. About 1,400 yard workers ran round-the-clock shifts; Yorktown sailed on May 30. On June 4 her SBDs helped sink Sōryū; Hiryū's two strikes left her crippled, and on June 7 Japanese submarine I-168 finished her with torpedoes (Lundstrom 1984).",
    ),
    sources: L(
      "출처: CV-5 Action Report (1942) · Lundstrom, The First Team (1984), pp. 320–340 · Symonds, The Battle of Midway (2011), ch. 9.",
      "Sources: CV-5 Action Report (1942); Lundstrom, The First Team (1984), pp. 320–340; Symonds, The Battle of Midway (2011), ch. 9.",
    ),
  },
  {
    id: "spruance-orders",
    index: 3,
    era: L("1942년 5월 28일", "May 28, 1942"),
    location: L("진주만 — CINCPAC 사령관실", "Pearl Harbor — CINCPAC commander's office"),
    scene: L(
      "할시가 피부병으로 입원한다. TF16 (엔터프라이즈·호넷)을 누구에게 맡길 것인가. 니미츠는 할시의 추천대로 순양함대 사령관 레이먼드 스프루언스를 항모 사령관으로 임명한다 — 항모 운용 경험이 없는 수상함 전문가다. 작전 명령서를 작성해야 한다.",
      "Halsey is hospitalized with dermatitis. Who takes Task Force 16 (Enterprise, Hornet)? On Halsey's recommendation, Nimitz hands TF16 to a cruiser admiral, Raymond Spruance — a surface officer with no carrier experience. The operation order must now be written.",
    ),
    briefing: [
      {
        label: L("스프루언스 평가", "On Spruance"),
        value: L(
          "냉철·계산적·과묵. 항공 운용은 참모(브라우닝)에게 의존해야 한다. 함교에서 \"감\"으로 결정하는 할시와 정반대 기질.",
          "Cool, calculating, taciturn. Will rely on his staff (Browning) for aviation. The opposite temperament to Halsey's bridge instinct.",
        ),
      },
      {
        label: L("플레처 (TF17 사령관)", "Fletcher (TF17)"),
        value: L(
          "산호해 경험 보유, 명목상 선임. 그러나 요크타운 한 척만 운용. 스프루언스가 더 큰 전력을 가진다.",
          "Has Coral Sea experience and is nominally senior — but commands only Yorktown. Spruance has the bigger force.",
        ),
      },
      {
        label: L("거리·통신", "Distance and signals"),
        value: L(
          "Point Luck에서 진주만까지 약 1,300nm. 무선 침묵이 원칙. CINCPAC가 함교 결정을 실시간으로 통제하는 것은 사실상 불가능.",
          "Point Luck is ~1,300 nm from Pearl. Radio silence is the rule. Real-time CINCPAC control of bridge decisions is effectively impossible.",
        ),
      },
      {
        label: L("학자 평 (Symonds 2011)", "Scholar's note (Symonds 2011)"),
        value: L(
          "Symonds: \"calculated risk\"라는 명령 문구는 \"미국 해군사상 가장 결과 좋은 한 줄\".",
          "Symonds: the phrase \"calculated risk\" became \"perhaps the most consequential single sentence in U.S. Navy doctrine.\"",
        ),
      },
    ],
    prompt: L("스프루언스에게 어떤 명령서를 줄 것인가?", "What kind of order do you give Spruance?"),
    choices: [
      {
        id: "calculated-risk",
        label: L("\"calculated risk의 원칙에 의해 행동하라\" — 현장 판단을 위임한다", "\"Be governed by the principle of calculated risk\" — delegate to the bridge"),
        reasoning: L(
          "1,300해리 떨어진 사령관이 함교의 5분 결정을 통제할 수 없다. 신뢰가 명령서를 대신한다.",
          "A commander 1,300 miles away cannot run a five-minute bridge call. Trust replaces orders.",
        ),
        tags: [
          { axis: "DIP", weight: 1 },
          { axis: "INT", weight: 2 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "니미츠의 실제 명령. 그 한 줄이 6월 4일 스프루언스의 \"즉시 발진\" 결정과 6월 5일 야간 회군 결정을 모두 가능케 했다 (Symonds 2011, ch. 10).",
          "Nimitz's actual order. That one sentence enabled both Spruance's \"launch now\" call on June 4 and his \"turn east\" call on the night of June 5 (Symonds 2011, ch. 10).",
        ),
        judgment: L(
          "당신은 결정을 자기 손에 쥐지 않는다. 멀리 있는 자가 가까이 있는 자에게 결단의 무게를 옮기는 위임형 — 신뢰의 단위로 함대를 운용하는 사고.",
          "You do not keep the decision in your own hand. The delegating commander who moves the weight of the call from the far back to the near front — running a fleet in units of trust.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "detailed-orders",
        label: L("교전 절차·진형·발진 시점을 상세히 명령서로 못박는다", "Issue a detailed engagement schedule — formations, launch windows, strike sequencing"),
        reasoning: L(
          "스프루언스는 항공 신참이다. 절차의 명확성이 그의 약점을 보완한다.",
          "Spruance is new to aviation. Procedural clarity covers his blind spot.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Parshall & Tully(2005): 미군이 절차에 묶여 있었다면 6월 4일 \"정확하지 않은 거리에서의 즉시 발진\" 같은 결단은 불가능했을 것.",
          "Parshall & Tully (2005): had the Americans been bound to procedure, the \"launch now from less-than-perfect range\" call on June 4 would not have happened.",
        ),
        judgment: L(
          "당신은 후임의 약점을 절차로 메우려 한다. 시스템에 권위를 두는 신중함 — 다만 시스템은 함교의 5분을 살 수 없다는 점이 자기 한계.",
          "You patch a subordinate's weakness with procedure. Authority placed in the system — though the system cannot buy back a bridge's five minutes.",
        ),
      },
      {
        id: "self-command",
        label: L("CINCPAC 본인이 함교에 직접 올라 지휘한다", "Take TF16 yourself, leave CINCPAC to a deputy"),
        reasoning: L(
          "최대의 결전이라면 사령관 자신이 함교에 있어야 한다.",
          "If this is the decisive battle, the commander belongs on the bridge.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "CAU", weight: -2 },
        ],
        shadowOutcome: L(
          "King 제독은 CINCPAC가 함대 한 척 위에 묶이는 것을 결단코 거부했을 것. 워싱턴-CINCPAC-함대의 3층 지휘 구조가 무너진다.",
          "Adm. King would never have permitted CINCPAC to be tied to a single hull. The Washington–CINCPAC–fleet three-tier structure collapses.",
        ),
        judgment: L(
          "당신은 결정적 순간에는 자신이 그 자리에 있어야 한다고 본다. 책임을 자기 어깨로 받는 직접형 — 다만 함대 위의 사령관은 함대 너머의 전쟁을 잃을 수 있다.",
          "You believe the commander belongs where the decision is. The direct hand that takes responsibility on its own shoulder — though a commander on a hull can lose the war beyond it.",
        ),
      },
      {
        id: "contingency-tree",
        label: L("시나리오별 컨틴전시 트리를 사전 작성한다", "Pre-write a branching contingency tree, every plausible scenario"),
        reasoning: L(
          "계산된 리스크는 계산을 미리 끝내야 진짜 리스크다.",
          "Calculated risk only deserves the name when the calculation is done in advance.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "DIP", weight: 1 },
          { axis: "INT", weight: -1 },
        ],
        shadowOutcome: L(
          "Symonds(2011): 일본 측 \"이른바 5단계 계획\"이 정확히 이 길이었다 — 너무 많은 분기를 사전 결정해 둔 결과 함교에서의 적응력을 잃었다.",
          "Symonds (2011): the Japanese \"so-called five-phase plan\" was exactly this road — so many branches pre-decided that the bridge lost its adaptability.",
        ),
        judgment: L(
          "당신은 사전 계산으로 위험을 덮으려 한다. 시나리오 사고의 철저함 — 다만 일본의 5단계 계획이 가르친 교훈, 사전 결정의 무게가 함교의 적응을 죽인다.",
          "You try to cover risk with pre-calculation. The rigor of scenario thinking — but Japan's five-phase plan teaches that the weight of pre-decided branches kills bridge adaptation.",
        ),
      },
    ],
    commanderActual: L(
      "니미츠가 5월 28일 스프루언스와 플레처에게 발한 명령은 한 문장이 핵심이었다 — \"You will be governed by the principle of calculated risk, which you shall interpret to mean the avoidance of exposure of your force to attack by superior enemy forces without good prospect of inflicting greater damage on the enemy.\" 함교의 결단은 함교에 맡긴다는 위임이었다 (CINCPAC OpPlan 29-42, Annex A).",
      "Nimitz's order to Spruance and Fletcher of May 28 turned on a single sentence: \"You will be governed by the principle of calculated risk, which you shall interpret to mean the avoidance of exposure of your force to attack by superior enemy forces without good prospect of inflicting greater damage on the enemy.\" The decision belonged on the bridge (CINCPAC Op Plan 29-42, Annex A).",
    ),
    sources: L(
      "출처: CINCPAC OpPlan 29-42, Annex A · Symonds, The Battle of Midway (2011), ch. 10 · Buell, The Quiet Warrior (1974, Spruance 평전).",
      "Sources: CINCPAC Op Plan 29-42, Annex A; Symonds, The Battle of Midway (2011), ch. 10; Buell, The Quiet Warrior (1974, Spruance biography).",
    ),
  },
  {
    id: "atoll-use",
    index: 4,
    era: L("1942년 6월 1–3일", "June 1–3, 1942"),
    location: L("미드웨이 환초 — 샌드 섬·이스턴 섬", "Midway Atoll — Sand Island and Eastern Island"),
    scene: L(
      "환초 자체가 \"움직이지 않는 항모\"다. 이스턴 섬에는 항공기 약 127대 (PBY 카탈리나 정찰기, B-17 폭격기, F2A 버팔로 전투기, TBF 어벤저 등). 일본 함대가 환초에 도달하기 전, 환초를 어떻게 운용할 것인가.",
      "The atoll is a fixed carrier. Eastern Island holds roughly 127 aircraft — PBY Catalina patrol planes, B-17 bombers, F2A Buffalo fighters, the first TBF Avengers. Before the Japanese fleet arrives, how will the atoll itself be used?",
    ),
    briefing: [
      {
        label: L("환초 항공력 (Lord 1967)", "Atoll air strength (Lord 1967)"),
        value: L(
          "PBY 32대, B-17 19대, F2A·F4F 28대, SB2U 18대, SBD·TBF 등. 다양하지만 기종 통합 운용 미숙.",
          "32 PBYs, 19 B-17s, 28 F2A/F4F fighters, 18 SB2Us, plus SBDs and the new TBFs. A varied force, but with limited cross-type integration.",
        ),
      },
      {
        label: L("정찰 반경", "Search radius"),
        value: L(
          "PBY는 약 700nm 정찰 가능. 환초 중심 반원 정찰을 일출 전 발진 시 일본 함대를 약 6월 3일 오후~6월 4일 새벽에 포착 예상.",
          "PBYs can search out to ~700 nm. A pre-dawn fan from the atoll should detect the Japanese fleet in the late afternoon of June 3 or the early hours of June 4.",
        ),
      },
      {
        label: L("환초 자체 (CINCPAC 보고)", "The atoll itself (CINCPAC report)"),
        value: L(
          "샌드 섬에 사령부, 이스턴 섬에 활주로, 잠수함 12척이 환초 주변 배치 가능 (TF7).",
          "Sand Island holds the command post; Eastern Island the airstrip. Twelve submarines (TF7) can ring the atoll.",
        ),
      },
      {
        label: L("리스크", "Risk"),
        value: L(
          "환초 항공기를 정면으로 일본 항모에 던지면 손실이 크다 — 사후 분석상 환초 발진 어뢰기는 6월 4일 거의 전멸.",
          "Throwing atoll aircraft straight at the Kidō Butai costs heavily — post-action analysis shows atoll-launched torpedo planes were nearly wiped out on June 4.",
        ),
      },
    ],
    prompt: L("미드웨이 환초를 어떻게 운용할 것인가?", "How do you use the atoll?"),
    choices: [
      {
        id: "integrated",
        label: L("환초를 미끼·정찰·반격 거점으로 통합 운용한다", "Integrate the atoll as bait, scout, and strike base together"),
        reasoning: L(
          "고정 갑판은 잠수할 수 없지만 미끼는 될 수 있다. 정찰·미끼·반격을 같은 환초에서 운영한다.",
          "A fixed deck cannot dive, but it can bait. Scout, decoy, and strike will all run from the same atoll.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "니미츠의 실제 운용. PBY 정찰이 6월 3일 일본 수송단을, 6월 4일 새벽 항모군을 포착했고, 환초 항공대의 (실패한) 공격이 일본 갑판 회전 주기를 흔들었다. Parshall & Tully(2005)는 \"환초 공격 자체보다, 환초 공격이 일본의 갑판 운용을 분단한 효과\"가 결정적이었다고 본다.",
          "Nimitz's actual setup. PBYs found the transports on June 3 and the carriers in the early hours of June 4; the atoll's (failed) attacks broke the rhythm of the Japanese deck cycle. Parshall & Tully (2005) argue the decisive effect was \"not the damage from the atoll strikes but the disruption they imposed on Japanese deck management.\"",
        ),
        judgment: L(
          "당신은 한 자산을 여러 역할에 동시에 쓴다. 한 갑판이 미끼이자 정찰이자 망치인 다층 사고 — 자원의 적은 쪽이 자원을 여러 번 쓰는 법.",
          "You make one asset play several roles at once. The layered thinking that turns a single deck into bait, scout, and hammer — the side with fewer resources spends each one twice.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "scout-only",
        label: L("환초는 정찰 전용으로 보존한다", "Reserve the atoll purely as a scouting platform"),
        reasoning: L(
          "PBY가 일본 함대를 찾아내기만 하면 항모가 일을 끝낸다.",
          "If the PBYs just find the fleet, the carriers do the rest.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Parshall & Tully(2005): \"환초 공격이 없었다면 나구모는 갑판 무장 전환을 더 여유롭게 마쳤을 것.\" 결정적 5분이 사라진다.",
          "Parshall & Tully (2005): \"without the atoll attacks, Nagumo would have completed the deck rearm more comfortably.\" The decisive five minutes disappear.",
        ),
        judgment: L(
          "당신은 자산의 역할을 한 가지에 묶는다. 명확성을 우선하는 신중함 — 다만 결정적 순간을 만들어내는 것은 종종 \"실패할 줄 알면서도 던진 한 무리\"다.",
          "You bind an asset to one role. The clarity of caution — though decisive moments often come from \"a wave you knew would fail, thrown anyway.\"",
        ),
      },
      {
        id: "reinforce-mainland",
        label: L("즉시 본도 방어 강화에 모든 환초 자원을 쏟는다", "Pour every atoll resource into ground defense"),
        reasoning: L(
          "환초가 함락되면 모든 것이 무의미하다. 본도부터 지킨다.",
          "If the atoll falls, the rest is moot. Hold the ground first.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: -1 },
        ],
        shadowOutcome: L(
          "Symonds(2011): 일본의 \"미드웨이 점령\" 단계는 항모 4척이 살아 있을 때만 가능. 항모를 잡으면 점령은 자동 좌절. 본도 방어 강화는 \"적의 두 번째 단계를 막는 데 자원을 쓰는\" 도치된 우선순위.",
          "Symonds (2011): Japan's \"land Midway\" phase only worked if the carriers survived. Sink the carriers, the landing collapses automatically. Hardening the atoll is \"spending resources to defeat the enemy's phase two.\"",
        ),
        judgment: L(
          "당신은 가장 가까운 위협을 가장 무겁게 본다. 본거지를 지키는 우선순위 — 다만 우선순위가 가까움에 묶이면 적의 진짜 무게중심을 놓친다.",
          "You weigh the nearest threat the heaviest. The instinct that defends home first — but priorities tied to nearness can miss the enemy's actual center of gravity.",
        ),
      },
      {
        id: "submarine-base",
        label: L("환초를 비밀 잠수함 거점으로 전환한다", "Convert the atoll into a covert submarine base"),
        reasoning: L(
          "TF7 잠수함 12척을 환초 주변에 매복시켜 항모를 잡는다.",
          "Hide TF7's twelve subs around the atoll and hunt the carriers.",
        ),
        tags: [
          { axis: "INT", weight: 1 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "TF7은 실제로 환초 주변에 배치됐고 I-168과 그루퍼 등 사례가 있었지만, 항모 격침의 결정적 한 방은 아니었다 (Parshall & Tully 2005). 잠수함 단독으로는 4척의 갑판 회전을 방해할 수 없다.",
          "TF7 was in fact deployed around Midway, but the submarines were not the decisive blow against the Kidō Butai (Parshall & Tully 2005). Submarines alone cannot disrupt four flight decks' rotation cycle.",
        ),
        judgment: L(
          "당신은 보이지 않는 자산에 결판을 맡긴다. 비대칭 무기에 베팅하는 직관 — 다만 잠수함 단독으로는 갑판 운용의 시간을 빼앗지 못한다.",
          "You wager the decision on the unseen asset. The intuition that bets on the asymmetric weapon — though submarines alone cannot steal time from a four-deck cycle.",
        ),
      },
    ],
    commanderActual: L(
      "니미츠는 환초를 통합 거점으로 운용했다. PBY가 6월 3일 정오경 일본 수송단을, 6월 4일 0534에 항모군을 포착했고, 환초 항공대의 어뢰기·B-17 공격은 거의 전멸했지만 그 사이 일본 갑판 무장 전환을 두 번 강요했다 (Parshall & Tully, Shattered Sword 2005, ch. 7–10).",
      "Nimitz used the atoll as an integrated base. PBYs sighted the transports near midday June 3 and the carriers at 0534 on June 4; the atoll's torpedo planes and B-17s were nearly annihilated, but they forced the Japanese deck rearm cycle to switch twice in the process (Parshall & Tully, Shattered Sword 2005, ch. 7–10).",
    ),
    sources: L(
      "출처: Lord, Incredible Victory (1967) · Parshall & Tully, Shattered Sword (2005), ch. 7–10 · CINCPAC Action Report on Midway (June 28, 1942).",
      "Sources: Lord, Incredible Victory (1967); Parshall & Tully, Shattered Sword (2005), ch. 7–10; CINCPAC Action Report on Midway (June 28, 1942).",
    ),
  },
  {
    id: "pursuit-or-turn",
    index: 5,
    era: L("1942년 6월 4일 일몰 ~ 6월 5일 새벽", "Sunset June 4 to dawn June 5, 1942"),
    location: L("미드웨이 북서 해역 — TF16 함교", "Northwest of Midway — bridge of TF16"),
    scene: L(
      "오후까지 일본 항모 4척 전부에 명중탄이 떨어진다. 아카기·카가·소류는 격침 절차에 들어갔고 히류는 마지막 공격을 보낸 후 저녁에 격침된다. 그러나 야마모토의 주력 함대(전함 야마토, 무사시 등 + 중순양함)가 동진하며 야간 수상함전을 강요하려 한다. 스프루언스는 결정해야 한다 — 추격할 것인가, 회군할 것인가. CINCPAC는 \"calculated risk\"라는 한 줄만 걸어두었다.",
      "By afternoon, all four Japanese carriers have been hit. Akagi, Kaga, and Sōryū are doomed; Hiryū goes down by evening after launching her own last strike. But Yamamoto's main body — battleships Yamato and Musashi, heavy cruisers — is steaming east, hoping to force a night surface action. Spruance must choose: pursue, or turn east. CINCPAC has hung a single thread on him: \"calculated risk.\"",
    ),
    briefing: [
      {
        label: L("일본 주력 (Parshall & Tully 2005)", "Japanese main body (Parshall & Tully 2005)"),
        value: L(
          "야마토(46cm 주포 9문)·무사시(준비 중)·전함 나가토 등. 야간 수상함 화력은 미군을 압도. 미군 항모는 야간전 능력이 없다.",
          "Yamato (nine 46-cm guns), Musashi (working up), battleship Nagato, heavy cruisers. Their night-surface firepower dominates anything Spruance has. American carriers cannot fight at night.",
        ),
      },
      {
        label: L("아군 손실 상황", "Own losses"),
        value: L(
          "요크타운 대파, 항공대 약 100기 이상 손실 (TBD 어뢰기 거의 전멸). 엔터프라이즈·호넷의 SBD 갑판 잔존 약 50기 수준.",
          "Yorktown crippled, over 100 aircraft lost (TBD torpedo squadrons effectively annihilated). Enterprise and Hornet have perhaps 50 SBDs serviceable between them.",
        ),
      },
      {
        label: L("거리·시간", "Distance and time"),
        value: L(
          "야마모토는 동쪽으로 약 20–25노트 진행. 일몰 후 4–6시간이면 미 항모 함대와 야간 수상전 거리.",
          "Yamamoto closes east at 20–25 knots. Four to six hours after sunset puts him in night gun range of the American carriers.",
        ),
      },
      {
        label: L("\"calculated risk\" 해석", "Reading \"calculated risk\""),
        value: L(
          "니미츠 명령서: \"우월한 적에게 노출되지 않을 것 — 더 큰 손해를 적에게 줄 명백한 전망이 없는 한.\"",
          "Nimitz's order: avoid exposure to superior force \"without good prospect of inflicting greater damage on the enemy.\"",
        ),
      },
    ],
    prompt: L("일몰 후 항로를 어디로 잡을 것인가?", "Where do you steer after sunset?"),
    choices: [
      {
        id: "night-pursuit",
        label: L("일본 주력 함대를 야간 추격해 추가 타격을 노린다", "Pursue Yamamoto's main body westward through the night"),
        reasoning: L(
          "4척 격침의 모멘텀을 야마토까지 끌고 간다. 새벽이면 항공대로 다시 친다.",
          "Carry the momentum from four sunk carriers all the way to Yamato. At dawn, hit again with the air group.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -2 },
        ],
        shadowOutcome: L(
          "Parshall & Tully(2005): 야마토급 46cm 주포의 야간 사거리에 항모를 노출시키는 것은 \"워싱턴이 짊어질 수 없는 손실\". 4 대 0의 승리가 \"4 대 2\"가 됐을 가능성이 높다.",
          "Parshall & Tully (2005): exposing carriers to Yamato's 46-cm guns in a night surface action would have been \"a loss Washington could not bear.\" The 4–0 victory likely becomes 4–2.",
        ),
        judgment: L(
          "당신은 모멘텀을 끝까지 따라간다. 승세에서 한 발 더 가는 결단형 — 다만 야간 함포 사거리 안에서 갑판은 갑판이 아니다.",
          "You ride momentum all the way. The decisiveness that takes one step further on the winning streak — though inside night gun range, a flight deck stops being a flight deck.",
        ),
      },
      {
        id: "turn-east",
        label: L("일몰 후 동쪽으로 회군해 항모를 보존한다", "Turn east at sunset; preserve the carriers"),
        reasoning: L(
          "오늘의 승리를 내일의 함대로 환산한다. 야마토는 항공대로만 친다, 야간 함포로 들어가지 않는다.",
          "Convert today's victory into tomorrow's fleet. Yamato is a job for aircraft, not for guns at night.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "스프루언스의 실제 결정. Symonds(2011)와 Parshall & Tully(2005) 모두 \"미드웨이의 두 번째 결정적 결단\"으로 평가. 항모 3척 보존이 6개월 후 솔로몬 작전의 기반이 된다.",
          "Spruance's actual decision. Symonds (2011) and Parshall & Tully (2005) both treat it as \"the second decisive call of Midway.\" Three preserved carriers became the foundation of Guadalcanal six months later.",
        ),
        judgment: L(
          "당신은 정확히 멈출 때를 안다. 승리의 무게를 함대의 길이로 환산하는 신중함 — 다음 전쟁의 갑판이 오늘 밤의 자제에서 나온다는 사고.",
          "You know precisely when to stop. The caution that converts a victory's weight into the length of a fleet — knowing tomorrow's deck comes from tonight's restraint.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "submarine-only",
        label: L("항모는 동진하되 잠수함만으로 야마모토를 추격한다", "Turn the carriers east, send the submarines after Yamamoto"),
        reasoning: L(
          "갑판은 보존하고 비대칭 자산만 던진다.",
          "Save the decks; throw only the asymmetric asset.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "TF7 잠수함은 실제로 추격 작전에 일부 투입됐다. I-168 같은 일본 잠수함이 요크타운을 6월 7일 격침한 사례에서 보듯 잠수함의 야간 항모 추격 효과는 제한적 (Lundstrom 1984). 야마모토의 호위 구축함을 뚫기 어렵다.",
          "TF7 boats did partially pursue. As I-168's later torpedoing of Yorktown on June 7 shows, submarine night-pursuit of capital ships had limited effect (Lundstrom 1984). Penetrating Yamamoto's destroyer screen at night was unlikely.",
        ),
        judgment: L(
          "당신은 추격을 자산별로 분리해 본다. 위험은 잠수함에게, 갑판은 안전 항로에 두는 분업형 — 다만 잠수함은 호위 구축막을 뚫기 어렵다는 것이 한계.",
          "You split the pursuit by asset. The division-of-labor mind that puts risk on the submarine and safety on the carrier — though submarines rarely pierce a destroyer screen at night.",
        ),
      },
      {
        id: "back-to-midway",
        label: L("미드웨이 본도 방어로 회귀한다", "Turn back to defend Midway itself"),
        reasoning: L(
          "환초가 또 공격받을 수 있다. 본도 방어가 우선이다.",
          "The atoll could be hit again. Hold the ground.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: -1 },
        ],
        shadowOutcome: L(
          "Symonds(2011): 야마모토의 \"미드웨이 점령\" 단계는 항모 4척 격침과 함께 자동 좌절. 본도 회귀는 이미 사라진 위협을 향한 자원 할당 — 추가 타격 기회를 잃는다.",
          "Symonds (2011): with the four carriers sunk, Yamamoto's \"land Midway\" phase died automatically. Returning to the atoll spends resources on a threat already gone, while losing the chance for further damage.",
        ),
        judgment: L(
          "당신은 위협의 우선순위가 사라졌다는 것을 보지 못한다. 본거지에 대한 보수적 충성 — 다만 적의 계획표에서 이미 지워진 단계에 자원을 쓰는 도치된 신중.",
          "You miss that the threat has already collapsed. Conservative loyalty to home — caution inverted, spending resources on an enemy phase that no longer exists.",
        ),
      },
    ],
    commanderActual: L(
      "스프루언스는 일몰 직후 동쪽으로 회군했다. 그 결정에 대해 항공 참모 마일스 브라우닝은 격렬히 반대했지만, 스프루언스는 \"야마토의 야간 함포 안으로 항모를 끌고 들어갈 이유가 없다\"고 답했다. 다음 날 다시 서진해 미카게·모가미 등 부상 순양함을 추격했다 (Symonds 2011, ch. 12; Parshall & Tully 2005, ch. 18).",
      "Spruance turned east at sunset. His air staff officer Miles Browning argued violently against it, but Spruance answered that there was \"no reason to bring carriers inside Yamato's night guns.\" The next day he turned back west to pursue the damaged cruisers Mikuma and Mogami (Symonds 2011, ch. 12; Parshall & Tully 2005, ch. 18).",
    ),
    sources: L(
      "출처: TF16 War Diary (June 4–6, 1942) · Symonds, The Battle of Midway (2011), ch. 12 · Parshall & Tully, Shattered Sword (2005), ch. 18 · Buell, The Quiet Warrior (1974).",
      "Sources: TF16 War Diary (June 4–6, 1942); Symonds, The Battle of Midway (2011), ch. 12; Parshall & Tully, Shattered Sword (2005), ch. 18; Buell, The Quiet Warrior (1974).",
    ),
  },
];

export const MIDWAY_ARCHETYPES: Archetype[] = [
  {
    id: "nimitz",
    name: L("니미츠형 — 위임으로 함대를 운용하는 지휘관", "The Nimitz — Command by Delegation"),
    signature: L(
      "당신은 결정을 가까운 손에 옮겨주는 멀리 있는 손이다.",
      "You are the far hand that moves the decision to the nearer one.",
    ),
    desc: L(
      "체스터 W. 니미츠. 1,300해리 떨어진 사령부에서 \"calculated risk\"라는 한 줄로 함교의 결단을 살린다. 자기 손에 결정을 쥐지 않고, 사람을 골라 그 사람에게 결정을 옮긴다. 균형이지만 \"위임의 균형\"이다.",
      "Chester W. Nimitz. From a headquarters 1,300 miles away, a single line — \"calculated risk\" — keeps the bridge's judgment alive. Doesn't keep the decision in his own hand; picks the person and moves the decision to them. Balanced, but balanced through delegation.",
    ),
    strengths: [
      L("부하의 직관을 자기 결단의 무게로 받는다", "Carries a subordinate's intuition as one's own weight"),
      L("정보의 빈틈을 사람의 판단으로 메운다", "Fills information gaps with human judgment"),
      L("멀리서도 함교의 5분을 망치지 않는다", "Does not ruin the bridge's five minutes from far away"),
    ],
    watchOut: [
      L("위임한 자가 무너지면 책임은 모두 자기 몫", "If the delegate breaks, the whole load returns"),
      L("\"왜 그 자리에 없었느냐\"는 정치적 비난을 듣는다", "Hears \"why weren't you there\" from the political rear"),
      L("위임은 신뢰의 단위 — 신뢰가 없으면 무너진다", "Delegation is the unit of trust — without trust, it collapses"),
    ],
    pairsWithId: "spruance",
    clashesWithId: "yamamoto",
    profile: { AGG: 0.5, CAU: 1, DIP: 1, INT: 1.5 },
  },
  {
    id: "yamamoto",
    name: L("야마모토형 — 큰 그림과 흩어지는 실행", "The Yamamoto — Grand Design, Scattered Execution"),
    signature: L(
      "당신은 큰 그림을 그리지만 결정의 무게가 함교까지 도달하지 않는다.",
      "You draw the great picture — but the weight of the decision doesn't reach the bridge.",
    ),
    desc: L(
      "야마모토 이소로쿠. 진주만의 설계자. 미드웨이에서도 \"5단계 작전\"으로 모든 분기를 사전 결정해 두었지만, 그 사전 결정의 무게가 정작 6월 4일 함교의 적응을 죽였다 (Parshall & Tully 2005). 큰 그림에 강하지만 실행은 분산된다.",
      "Isoroku Yamamoto. Architect of Pearl Harbor. At Midway his \"five-phase plan\" pre-decided every branch — and the weight of that pre-decision killed bridge adaptation on June 4 (Parshall & Tully 2005). Strong on grand design, scattered in execution.",
    ),
    strengths: [
      L("작전의 큰 그림을 처음부터 끝까지 본다", "Sees the operation's whole arc from start to finish"),
      L("기습과 직관의 결단을 두려워하지 않는다", "Does not flinch from surprise and intuitive call"),
      L("다층 미끼·견제·주력의 동시 운용을 설계한다", "Designs simultaneous bait, fixing force, and main body"),
    ],
    watchOut: [
      L("사전 결정이 너무 많아 함교의 적응을 죽인다", "Pre-decisions so dense the bridge cannot adapt"),
      L("자산을 분산해 결정적 한 점에 집중하지 못한다", "Diffused force fails to concentrate on the decisive point"),
      L("계획이 아름다워서 적의 단순함을 과소평가한다", "Loves the plan so much it underrates the enemy's simplicity"),
    ],
    pairsWithId: "halsey",
    clashesWithId: "nimitz",
    profile: { AGG: 1.5, CAU: -0.5, DIP: 0, INT: 1.5 },
  },
  {
    id: "spruance",
    name: L("스프루언스형 — 정확히 멈출 때를 아는 지휘관", "The Spruance — Knows Exactly When to Stop"),
    signature: L(
      "당신은 승리의 무게를 함대의 길이로 환산할 줄 안다.",
      "You can convert a victory's weight into the length of a fleet.",
    ),
    desc: L(
      "레이먼드 A. 스프루언스. 항공 신참이었지만 6월 4일 \"불완전한 거리에서 즉시 발진\"의 결단과, 같은 날 일몰 후 \"동쪽으로 회군\"의 결단을 함께 내렸다. 직관은 결정적 순간에만 쓰고, 그 외에는 신중을 무기로 한다.",
      "Raymond A. Spruance. Came new to aviation but made both calls on June 4: \"launch now from less-than-perfect range\" in the morning, and \"turn east\" at sunset. Saves intuition for the decisive moments; runs caution as a weapon the rest of the time.",
    ),
    strengths: [
      L("승세 안에서도 함대를 다음 전쟁으로 옮긴다", "Even riding a winning streak, moves the fleet toward the next war"),
      L("불완전한 자산을 결정적 시점에 던진다", "Spends an incomplete asset at the decisive instant"),
      L("자기 결단의 책임을 함교에서 끝까지 진다", "Carries decisional responsibility on the bridge to the end"),
    ],
    watchOut: [
      L("\"용기 없는 신중\"이라는 비난을 함내에서 듣는다", "Hears \"caution without courage\" from one's own staff"),
      L("결정적 순간에 한 발 더 갈 기회를 보내기도 한다", "Sometimes lets one further blow slip away"),
      L("말 적은 지휘관은 사후 평가에서 손해를 본다", "A taciturn commander loses in the historiography"),
    ],
    pairsWithId: "nimitz",
    clashesWithId: "halsey",
    profile: { AGG: 0, CAU: 1.5, DIP: 0, INT: 1.5 },
  },
  {
    id: "halsey",
    name: L("할시형 — 정면으로 부수러 가는 지휘관", "The Halsey — Goes Straight to Break"),
    signature: L(
      "당신은 망설이는 함교가 가장 위험한 함교라고 본다.",
      "To you, the most dangerous bridge is the one that hesitates.",
    ),
    desc: L(
      "윌리엄 \"불 (Bull)\" 할시. 함교의 감으로 결단하고 정면으로 부수러 간다. 미드웨이에는 입원으로 빠졌지만 그의 기질은 이후 솔로몬과 레이테에서 빛났다 — 그리고 사마르 해전의 위기를 만들기도 했다.",
      "William \"Bull\" Halsey. Bridge instinct, straight-line strike. Hospitalized for Midway, but his temperament shone afterward at the Solomons and Leyte — and produced the Samar crisis.",
    ),
    strengths: [
      L("기회의 창에 가장 빨리 도달한다", "First to reach an opening window"),
      L("승조원 사기를 자기 존재만으로 끌어올린다", "Lifts crew morale by his presence alone"),
      L("적이 가장 두려워하는 적이 된다", "Becomes the enemy your enemy fears"),
    ],
    watchOut: [
      L("미끼 함대에 본대를 끌고 가버린다 (레이테 사례)", "Charges the bait force with the main body (the Leyte case)"),
      L("정확히 멈출 때를 종종 놓친다", "Often misses precisely when to stop"),
      L("야간 함포 안으로 갑판을 끌고 들어갈 위험", "Risks bringing flight decks into night-gun range"),
    ],
    pairsWithId: "yamamoto",
    clashesWithId: "spruance",
    profile: { AGG: 2, CAU: -1.5, DIP: -0.5, INT: 1 },
  },
  {
    id: "king",
    name: L("킹형 — 본부의 정치를 다루는 지휘관", "The King — Runs the Politics of the Rear"),
    signature: L(
      "당신은 함대 너머의 전쟁을 함대 안으로 끌고 들어오지 않는다.",
      "You don't drag the war beyond the fleet into the fleet itself.",
    ),
    desc: L(
      "어니스트 J. 킹 함대총사령관. 워싱턴에서 영국·육군·해병대와 자원을 다투며 태평양에 함대를 보낸다. 외교와 정치, 신중한 자원 배분이 무기. 함교에 직접 서지 않지만 함대가 갑판 위에 있을 수 있게 만든다.",
      "Adm. Ernest J. King, Cominch. From Washington he fights British, Army, and Marine claimants for the resources to keep a Pacific fleet at sea. Diplomacy, politics, and disciplined allocation are the weapons. Never on the bridge, but makes sure the bridge has a deck under it.",
    ),
    strengths: [
      L("자원 분배의 정치를 직접 운용한다", "Personally runs the politics of allocation"),
      L("연합 작전의 무게중심을 자기 우선순위로 끌어온다", "Pulls the coalition's center of gravity onto one's own priorities"),
      L("함대 너머의 전쟁을 함대를 위해 다룬다", "Manages the war beyond the fleet on the fleet's behalf"),
    ],
    watchOut: [
      L("함교에서 멀어 결정적 시점의 감을 잃는다", "Far from the bridge, loses the feel of the decisive instant"),
      L("동맹·동료에게서 \"고집스럽다\"는 비난을 받는다", "Allies and peers call you stubborn"),
      L("정치가 길어지면 결단의 무게가 종이로 변한다", "Stretched politics turns decisions to paper"),
    ],
    pairsWithId: "nimitz",
    clashesWithId: "halsey",
    profile: { AGG: 0, CAU: 1, DIP: 2, INT: -0.5 },
  },
  {
    id: "balanced-cmdr",
    name: L("균형 사령관형 — 정치·군사·외교를 한 손에 쥐는 지휘관", "The Balanced Commander — Politics, Force, and Diplomacy in One Hand"),
    signature: L(
      "당신의 무기는 어느 한 결정이 아니라 매번 무게를 옮기는 손이다.",
      "Your weapon is not any one decision — it is the hand that shifts the weight each time.",
    ),
    desc: L(
      "어느 한 축에도 치우치지 않는다. 공격성·신중·외교·직관을 상황에 따라 나눠 쓴다. 위임형 니미츠와 달리 자기가 자리에 있고, 정치·군사·외교를 한 책상 위에서 다룬다.",
      "Tilts on no single axis. Spends aggression, caution, diplomacy, and intuition by situation. Unlike the delegating Nimitz, sits at the desk personally, handling politics, force, and diplomacy on a single table.",
    ),
    strengths: [
      L("어느 축의 적도 결정적으로 두렵지 않다", "No single axis of enemy is decisively frightening"),
      L("상황의 결을 매번 다르게 읽는다", "Reads the grain of the moment differently each time"),
      L("팀 내 약점을 자기 손으로 메운다", "Patches the team's weak axes with your own hand"),
    ],
    watchOut: [
      L("어느 축의 색깔도 진하지 않아 \"개성 없다\"는 평", "No axis colored deeply — judged a hand without color"),
      L("위기에서 균형은 우유부단으로 보인다", "In crisis, balance reads as indecision"),
      L("모든 길에 적당하지만 어느 길도 정복하지 못한다", "Adequate on every road, master of none"),
    ],
    pairsWithId: "spruance",
    clashesWithId: "yamamoto",
    profile: { AGG: 0.7, CAU: 0.7, DIP: 0.7, INT: 0.7 },
  },
];

export function getArchetypeById(id: string): Archetype | undefined {
  return MIDWAY_ARCHETYPES.find((a) => a.id === id);
}

export function encodePicks(picks: Record<string, string>): string {
  return encodePicksFor(picks, MIDWAY_DILEMMAS);
}

export function decodePicks(
  p: string | null | undefined,
): Record<string, string> | null {
  return decodePicksFor(p, MIDWAY_DILEMMAS);
}

export function evaluate(picks: Record<string, string>): EvalResult {
  return evaluatePicks(picks, MIDWAY_DILEMMAS, MIDWAY_ARCHETYPES);
}
