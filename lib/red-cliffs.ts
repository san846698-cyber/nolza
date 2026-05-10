// 적벽대전 — your command-style assessment.
// Five independent dilemmas drawn from Zhou Yu's Red Cliffs campaign (208 CE).
// Each choice is tagged on four command axes; results match the user to a
// commander archetype and report match rate against Zhou Yu's actual decisions.
//
// Sources: 진수 『삼국지·오서·주유전·노숙전·황개전』; 사마광 『자치통감』 권65 (208년);
// 배송지 주 『삼국지주』(429 CE).
// Modern: Rafe de Crespigny, Generals of the South (1990); Rafe de Crespigny,
// Imperial Warlord: A Biography of Cao Cao (2010); Achilles Fang tr.,
// The Chronicle of the Three Kingdoms (1952); Christopher Beckwith,
// Empires of the Silk Road (2009).

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

export const RED_CLIFFS_DILEMMAS: Dilemma[] = [
  {
    id: "court-debate",
    index: 1,
    era: L("208년 가을 — 조조의 격문이 도착한 직후", "Autumn 208 CE — just after Cao Cao's ultimatum arrived"),
    location: L("시상(柴桑) — 손권의 본영", "Chaisang — Sun Quan's headquarters"),
    scene: L(
      "조조는 형주를 무혈입성한 뒤 \"수군 80만으로 강동에서 사냥하겠다\"는 격문을 보내왔다. 조정은 둘로 갈렸다. 장사(長史) 장소를 비롯한 다수가 항복을 주장하고, 노숙은 결전을 주장하며 파양에서 주유를 불러왔다. 손권은 아직 결정을 내리지 않았다. 당신이 들어가는 자리는 그 결정을 만들 자리다.",
      "Cao Cao has taken Jing Province without a fight and sent an ultimatum: \"With 800,000 marines I will hunt in the southeast.\" The court is split. Chief Clerk Zhang Zhao and most officials urge surrender; Lu Su has summoned you, Zhou Yu, from Poyang to argue for war. Sun Quan has not yet decided. You are walking into the room where the decision will be made.",
    ),
    briefing: [
      {
        label: L("조조의 자칭 병력 (자치통감 권65)", "Cao Cao's claimed forces (Zizhi Tongjian 65)"),
        value: L(
          "조조 격문은 \"수군 80만\"을 자칭. 주유의 실제 추산은 약 20여만 — 화북 정예 15~16만 + 형주 항복군 7~8만. de Crespigny(2010)는 약 22~24만으로 추정.",
          "Cao's letter claims \"800,000 marines.\" Zhou Yu's own estimate to Sun Quan: about 200,000-plus — roughly 150–160k Northern veterans plus 70–80k newly surrendered Jingzhou troops. de Crespigny (2010) puts the realistic total near 220–240k.",
        ),
      },
      {
        label: L("우리 병력 (삼국지·주유전)", "Our forces (Sanguozhi, Biography of Zhou Yu)"),
        value: L(
          "주유가 손권에게 청한 정예 3만. 손권 직속 동원 가능 병력은 5만 안팎이지만 즉시 출동 가능은 3만이라고 주유 본인이 말했다.",
          "Zhou Yu requests 30,000 elite troops. Sun Quan can mobilise around 50,000 in total, but Zhou Yu himself states only 30,000 are ready to march at once.",
        ),
      },
      {
        label: L("항복파의 논리 (장소)", "The surrender faction's logic (Zhang Zhao)"),
        value: L(
          "장강의 천험은 조조가 이미 형주 수군과 함대를 통째로 인수해 무력화됐다. 한 황실의 정통 승상에게 신하 되는 것은 명분 손해도 작다 — 봉공 안에서 살아남자.",
          "The Yangtze barrier is broken: Cao now owns Jingzhou's entire river fleet. Submitting to the legitimate Han Chancellor costs little face. Better to live within the empire.",
        ),
      },
      {
        label: L("노숙·주유의 약점 분석", "Lu Su / Zhou Yu's weak-point analysis"),
        value: L(
          "주유전: 조조군은 (1) 후방 마초·한수가 살아 있고, (2) 북방 기병을 버리고 익숙치 않은 수전을 강요받으며, (3) 형주 항복군은 충성이 얕고, (4) 한겨울 장강 풍토병이 화북군을 친다.",
          "Zhou Yu's four points: (1) Ma Chao and Han Sui still threaten Cao's rear, (2) Cao must fight on water without his cavalry, (3) the surrendered Jingzhou troops have shallow loyalty, (4) Yangtze winter disease is already striking the Northern army.",
        ),
      },
    ],
    prompt: L("손권 앞에서 어느 입장을 펴는가?", "What position do you take before Sun Quan?"),
    choices: [
      {
        id: "all-in-war",
        label: L("결전을 강력히 주장하고 정예 3만의 지휘권을 청한다", "Argue flatly for war and request command of 30,000 elite troops"),
        reasoning: L(
          "조조는 강해 보이지만 네 가지 약점이 있다. 항복은 손씨 정권의 종말이며, 우리가 이길 수 있는 한 번의 창이 지금이다.",
          "Cao looks strong but has four weak points. Surrender ends the Sun house. The window in which we can win is now.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "주유의 실제 선택. 손권은 칼로 책상 모서리를 베며 \"감히 다시 항복을 말하는 자는 이 책상과 같다\"고 결단했다 (자치통감 권65).",
          "Zhou Yu's actual choice. Sun Quan struck the table with his sword and declared anyone speaking of surrender again would be cut like the desk (Zizhi Tongjian 65).",
        ),
        judgment: L(
          "당신은 조정의 다수를 등지고 한 사람의 결단을 만들어낸다. 압도적 숫자 앞에서 약점 네 가지를 정확히 짚어 무게를 옮기는 사람 — 큰 그림 안에 한 수의 책략을 넣는 손.",
          "You stand against the room and make one person's mind. The hand that, faced with the bigger number, picks the four weak points and tilts the weight — a single calculated move inside the larger picture.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "conditional-submit",
        label: L("조건부 항복으로 시간을 번다", "Play for time with a conditional submission"),
        reasoning: L(
          "표면상 조서를 받되 실제로는 강 방어선과 동맹을 정비할 시간을 산다. 봉공의 명분 안에서 자치를 지킨다.",
          "Accept the imperial decree on the surface; in reality buy time to build river defences and alliances. Keep autonomy under the cloak of submission.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "CAU", weight: 1 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "장소 노선의 변형. 노숙이 손권에게 \"신하인 우리는 항복해도 자리를 지키지만, 군주가 항복하면 어디로 가시겠습니까\"라고 반박한 그 자리 (삼국지·노숙전).",
          "A milder Zhang Zhao line — but Lu Su's retort still applies: \"We officials can submit and keep our posts. But where will Your Lordship go?\" (Sanguozhi, Biography of Lu Su).",
        ),
        judgment: L(
          "당신은 명분과 시간을 동시에 사고 싶어한다. 봉공 안에 자치의 공간을 그리는 외교적 시야 — 다만 조조에게 시간을 주는 것이 우리에게 시간을 주는 것과 같지 않다는 점은 안다.",
          "You want to buy face and time at once. The diplomatic eye that draws a space of autonomy inside imperial submission — knowing the cost: time given to Cao is not the same as time given to us.",
        ),
      },
      {
        id: "go-alone",
        label: L("유비와는 거리를 두고 강동 단독으로 방어한다", "Hold the southeast alone, keep Liu Bei at arm's length"),
        reasoning: L(
          "유비는 패주 끝에 쫓겨온 약자다. 그와 묶이면 조조의 표적이 우리에게 집중된다. 장강 방어선만 굳히고 독자노선을 간다.",
          "Liu Bei is a beaten man on the run. Tying ourselves to him concentrates Cao's strike on us. Hold the Yangtze line alone and stay independent.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: -1 },
        ],
        shadowOutcome: L(
          "노숙은 정반대를 진언했다 — \"유비를 잡아 조조의 칼을 두 갈래로 만들어야 한다\" (삼국지·노숙전). 단독 방어는 조조의 전 화력이 강동 한 점에 떨어진다는 뜻.",
          "Lu Su argued exactly the reverse: \"Hold Liu Bei to split Cao's sword in two\" (Biography of Lu Su). Standing alone means Cao's full weight falls on a single point.",
        ),
        judgment: L(
          "당신은 약한 동맹의 비용을 본다. 자기 통제력 안에서만 결판을 보려는 신중함 — 다만 동맹의 가치는 그 약함 자체에 있다는 노숙의 통찰은 비껴간 판단.",
          "You see the cost of a weak ally. The caution that only fights inside its own span of control — though it misses Lu Su's insight that the ally's very weakness is what makes him useful.",
        ),
      },
      {
        id: "river-only",
        label: L("결전은 보류하고 장강 도하만 봉쇄한다", "Defer pitched battle, just block the river crossing"),
        reasoning: L(
          "수상에서 적을 막되 결전은 피한다. 시간이 가면 조조의 보급·풍토병이 그를 갉는다.",
          "Stop him on the water, refuse a decisive engagement. Time, supply, and disease will erode Cao on their own.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "de Crespigny(1990)는 \"조조의 진짜 약점은 시간이었다\"고 본다. 다만 도하 봉쇄만으로는 조조 함대를 부수지 못해 다음 봄에 다시 같은 상황이 온다.",
          "de Crespigny (1990) holds that \"Cao's true weakness was time.\" But blockade alone does not destroy Cao's fleet — next spring brings the same crisis back.",
        ),
        judgment: L(
          "당신은 결정적 결판보다 시간의 마모를 본다. 조조의 약점 중 \"시간\"만 골라 무기 삼는 신중함 — 결판을 피하면 같은 결판이 돌아온다는 비용은 감수하는 판단.",
          "You see attrition over a decisive blow. The caution that picks Cao's \"time\" weakness alone and turns it into a weapon — accepting the cost that battles deferred return as battles re-imposed.",
        ),
      },
    ],
    commanderActual: L(
      "주유는 노숙과 함께 결전을 강력히 주장했다. 그는 조조군의 네 가지 약점 — 마초·한수의 후방 위협, 북방군의 수전 미숙, 형주 항복군의 얕은 충성, 한겨울 풍토병 — 을 들어 \"3만의 정예면 조조의 머리를 보내드리겠다\"고 청했다. 손권은 그날 책상을 베어 결단을 보였다 (삼국지·주유전; 자치통감 권65).",
      "Zhou Yu, with Lu Su, argued flatly for war. He named Cao's four weak points — the unpacified Ma Chao and Han Sui in the rear, the Northerners' unfamiliarity with naval combat, the shallow loyalty of the surrendered Jingzhou troops, and Yangtze winter disease — and asked for 30,000 elite troops, promising he would send back Cao's head. That night Sun Quan struck his desk with his sword and committed (Sanguozhi, Biography of Zhou Yu; Zizhi Tongjian 65).",
    ),
    sources: L(
      "출처: 삼국지·오서·주유전·노숙전 · 자치통감 권65 (208년) · de Crespigny, Generals of the South (1990), ch. 5; Imperial Warlord (2010), pp. 254–262.",
      "Sources: Sanguozhi, Wushu, Biographies of Zhou Yu and Lu Su; Zizhi Tongjian 65 (208 CE); de Crespigny, Generals of the South (1990), ch. 5; Imperial Warlord (2010), pp. 254–262.",
    ),
  },
  {
    id: "alliance-shape",
    index: 2,
    era: L("208년 늦가을 — 적벽 도착 직전", "Late autumn 208 CE — just before reaching Red Cliffs"),
    location: L("번구(樊口) — 장강 중류, 유비의 임시 본영", "Fankou — middle Yangtze, Liu Bei's temporary base"),
    scene: L(
      "노숙은 이미 당양 장판에서 패주한 유비에게 가서 동맹을 약조했다. 제갈량이 시상에서 손권을 설득해 결전을 굳혔다. 이제 유비는 약 2만 — 장판 패전 직후의 잔병에 관우의 수군 1만 — 을 가지고 번구에 있다. 당신의 3만이 그 옆에 도착한다. 동맹의 형태를 정해야 한다.",
      "Lu Su has already met the defeated Liu Bei and pledged alliance. Zhuge Liang has come to Chaisang and locked Sun Quan into the war. Liu Bei now holds about 20,000 men — survivors of his rout at Changban plus Guan Yu's marine squadron of 10,000 — at Fankou. Your 30,000 arrive alongside. The shape of the alliance must be decided.",
    ),
    briefing: [
      {
        label: L("연합 병력 (삼국지·주유전·선주전)", "Combined forces (Biographies of Zhou Yu, Liu Bei)"),
        value: L(
          "손권군 약 3만 (주유 직속) + 유비군 약 2만 (관우 수군 1만 + 장판 잔병 1만). 합계 약 5만, 조조군 추산의 4분의 1 수준.",
          "Sun Quan's force ≈ 30,000 (under your direct command) + Liu Bei's ≈ 20,000 (Guan Yu's marines 10k + Changban survivors 10k). Combined ≈ 50,000 — about a quarter of Cao's army.",
        ),
      },
      {
        label: L("유비의 위상", "Liu Bei's standing"),
        value: L(
          "한실 종친(劉)이라는 정통성 자산을 가졌으나 영지가 없다. 장판에서 처자까지 두고 도주했고, 강하의 유기에 의탁한 상태다.",
          "He carries the legitimacy of a Han imperial relative but holds no territory. At Changban he abandoned even his family, and is currently a guest under Liu Qi at Jiangxia.",
        ),
      },
      {
        label: L("노숙의 동맹 설계", "Lu Su's alliance design"),
        value: L(
          "노숙은 \"유비를 도와 조조를 막은 뒤, 천하의 형세를 보아 결정한다\"는 장기 외교를 제시했다 (삼국지·노숙전).",
          "Lu Su's design: \"Help Liu Bei to block Cao now; later, decide based on the shape of the realm\" (Biography of Lu Su).",
        ),
      },
      {
        label: L("제갈량의 요구", "Zhuge Liang's terms"),
        value: L(
          "유비측은 \"전권 통일 지휘\"가 아니라 \"분할 지휘\"를 원한다. 관우의 수군은 유비의 자산이고 손씨에 직속되지 않는다.",
          "Liu Bei's side wants divided command, not unified. Guan Yu's marines remain Liu Bei's asset and will not come under Sun Quan's direct chain.",
        ),
      },
    ],
    prompt: L("동맹의 형태를 어떻게 정할 것인가?", "How will you shape this alliance?"),
    choices: [
      {
        id: "unified-command",
        label: L("전권 통일 지휘를 요구한다 — 유비도 내 명령 아래", "Demand unified command — Liu Bei under your authority"),
        reasoning: L(
          "장강의 결전은 한 사람이 지휘해야 한다. 두 군대 두 명령은 화공을 짤 수도, 풍향을 읽을 수도 없다.",
          "A river battle needs one hand. Two armies under two orders cannot plan a fire attack or read the wind together.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "CAU", weight: 1 },
          { axis: "DIP", weight: -1 },
        ],
        shadowOutcome: L(
          "유비는 거부할 명분이 충분하다 — 그는 한실 종친이며 자기 군의 통제권을 넘기지 않는다. de Crespigny(1990)는 \"동맹의 무게는 정확히 그 분리에 있었다\"고 본다.",
          "Liu Bei has every ground to refuse — as a Han imperial relative he will not yield his command. de Crespigny (1990): \"The weight of the alliance lay precisely in its being divided.\"",
        ),
        judgment: L(
          "당신은 작전의 통합성을 동맹의 형태보다 위에 둔다. 한 사람의 손에 결정을 모으려는 사고 — 다만 동맹의 명분이 통제력보다 큰 자산일 수 있다는 점은 살피지 못한 판단.",
          "You put operational unity above the alliance's shape. The instinct to gather decision in one hand — though it can miss that the alliance's legitimacy may be a bigger asset than its control.",
        ),
      },
      {
        id: "split-sectors",
        label: L("분할 구역으로 나눠 지휘 — 주공은 내가, 유비는 측면", "Divide sectors — main attack mine, Liu Bei holds the flank"),
        reasoning: L(
          "내가 화공의 주공을 맡고, 유비는 강 북안 추격과 측면 차단을 맡는다. 두 명령이지만 한 작전이 된다.",
          "I run the main fire attack, Liu Bei takes pursuit on the north bank and seals the flank. Two commands, one operation.",
        ),
        tags: [
          { axis: "DIP", weight: 1 },
          { axis: "INT", weight: 1 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "주유의 실제 선택. 그는 주공을, 유비는 화양도 방면 추격을 맡았다. 정사는 \"유비는 주유와 함께 진군했다\"고 기록한다 (삼국지·선주전).",
          "Zhou Yu's actual choice. He led the main strike; Liu Bei pursued through Huarong. The Sanguozhi records: \"Liu Bei advanced together with Zhou Yu\" (Biography of Liu Bei).",
        ),
        judgment: L(
          "당신은 명령의 통합 대신 작전의 통합을 본다. 두 손이 한 도면 위에서 움직이게 만드는 외교적 손 — 통제와 명분을 동시에 운용할 줄 아는 판단.",
          "You go for operational unity rather than command unity. The diplomatic hand that puts two commanders on one drawing board — running control and legitimacy together.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "logistics-only",
        label: L("유비는 후방 보급·정보에만 두고 전투에서 뺀다", "Keep Liu Bei to logistics and intelligence — out of the line"),
        reasoning: L(
          "유비의 잔병은 사기가 낮고 관우의 수군은 검증되지 않았다. 보급과 첩보로만 활용해도 가치가 충분하다.",
          "Liu Bei's survivors have shaky morale and Guan Yu's marines are untested. Using them for supply and intelligence alone is contribution enough.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "유비측은 거부한다 — 전투에 참여하지 않는 동맹은 전후 분배에서 자기 몫이 없다. de Crespigny(1990)는 유비의 \"전공 확보 동기\"를 동맹의 핵심 변수로 본다.",
          "Liu Bei will refuse. An ally who does not fight has no claim in the post-war division. de Crespigny (1990) treats Liu Bei's \"need for battlefield credit\" as a core variable of the alliance.",
        ),
        judgment: L(
          "당신은 약한 동맹을 약한 자리에 두려 한다. 위험을 측면에서 잘라내는 신중함 — 다만 동맹의 무게는 그가 같은 위험을 진다는 사실에서 나온다는 것은 비껴간 판단.",
          "You put the weak ally in the weak seat. The caution that cuts risk off at the flank — though it misses that an ally's weight comes precisely from sharing the same risk.",
        ),
      },
      {
        id: "nominal-ally",
        label: L("명목상 동맹·실질 독자 작전", "Nominal alliance, separate operations in practice"),
        reasoning: L(
          "유비와 깃발은 묶되 작전은 따로 짠다. 그가 어디로 가든 우리 화공에는 영향이 없다.",
          "We share a banner but plan separately. Whatever Liu Bei does, our fire attack stands on its own.",
        ),
        tags: [
          { axis: "INT", weight: 1 },
          { axis: "DIP", weight: -1 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "노숙이 가장 두려워한 형태. 형주 분할 단계에서 동맹이 폭발한다. 사마광은 권65에서 \"동맹의 깊이가 전후를 갈랐다\"고 평한다.",
          "The form Lu Su feared most. The alliance detonates when Jingzhou must be divided. Sima Guang in Tongjian 65 notes that the alliance's depth was what shaped the post-war settlement.",
        ),
        judgment: L(
          "당신은 동맹을 도구로만 본다. 외교를 표면에 두는 실용주의 — 다만 명목 동맹은 결판 다음에 자기 비용을 청구한다는 것을 안다.",
          "You see alliance as a tool only. The pragmatism that keeps diplomacy on the surface — knowing that a nominal alliance bills you back the moment the battle ends.",
        ),
      },
    ],
    commanderActual: L(
      "주유는 분할 지휘를 택했다. 그는 주공 — 화공과 장강 본진 결전 — 을 맡고, 유비에게는 강 북안 화양도 방면 추격과 측면 차단을 맡겼다. 두 군은 별개의 명령 체계 아래 한 작전 도면을 공유했다. 이 형태는 노숙의 외교 설계와도 정확히 들어맞았다 (삼국지·주유전·노숙전·선주전).",
      "Zhou Yu chose divided command. He took the main effort — the fire attack and the Yangtze line — while Liu Bei was tasked with pursuit through Huarong on the north bank and flank security. The two armies shared one operational drawing under separate chains of command. The arrangement also fitted Lu Su's diplomatic design exactly (Biographies of Zhou Yu, Lu Su, and Liu Bei).",
    ),
    sources: L(
      "출처: 삼국지·오서·주유전·노숙전 · 삼국지·촉서·선주전 · de Crespigny, Generals of the South (1990), pp. 209–217.",
      "Sources: Sanguozhi, Wushu (Biographies of Zhou Yu, Lu Su); Sanguozhi, Shushu (Biography of Liu Bei); de Crespigny, Generals of the South (1990), pp. 209–217.",
    ),
  },
  {
    id: "fire-attack",
    index: 3,
    era: L("208년 11월 ~ 12월 — 적벽 대치 막판", "November–December 208 CE — the standoff at Red Cliffs"),
    location: L("적벽 강안 — 조조 함대는 북안 오림에 사슬로 묶여 있다", "The cliffs of the Yangtze — Cao's fleet chained at Wulin on the north bank"),
    scene: L(
      "첫 접전에서 조조군은 이미 풍토병에 시달렸고 후퇴해 강 북안 오림에 진을 쳤다. 멀미를 줄이려 함선들을 사슬로 묶었다. 노장 황개가 들어와 \"조조의 함선이 머리부터 꼬리까지 이어져 있으니 화공이면 끝납니다\"라고 진언한다. 한겨울인데, 며칠 동안 동남풍이 분다.",
      "In the first clash Cao's army was already sick. He withdrew to Wulin on the north bank and chained his ships together to ease seasickness. The veteran Huang Gai comes to you: \"Cao's fleet is linked head to tail — fire will finish them.\" It is mid-winter, yet the wind has been blowing southeast for days.",
    ),
    briefing: [
      {
        label: L("조조군 상태 (삼국지·주유전)", "Cao's condition (Biography of Zhou Yu)"),
        value: L(
          "정사는 \"조조군에 이미 역병이 돌아 첫 접전에서 패해 강 북안에 물러섰다\"고 기록. 함선은 사슬로 묶여 기동성을 잃었다.",
          "The official record states Cao's army was already plague-stricken and lost the first skirmish, withdrawing to the north bank. His ships were chained, losing manoeuvrability.",
        ),
      },
      {
        label: L("기상 — 한겨울 동남풍", "Weather — winter southeast wind"),
        value: L(
          "Beckwith(2009)와 동아시아 기상 분석은 양자강 중류에서 한겨울 며칠간 \"한기 역류\"로 동남풍이 부는 사례를 기록한다 — 드물지만 실재.",
          "Beckwith (2009) and East Asian climatology document brief mid-winter \"reverse-flow\" episodes that drive a southeast wind on the middle Yangtze — rare, but documented.",
        ),
      },
      {
        label: L("황개의 거짓 항복 (삼국지·황개전)", "Huang Gai's false surrender (Biography of Huang Gai)"),
        value: L(
          "황개는 자기가 직접 거짓 항복 서신을 보내 화선(火船)을 조조 함대 앞까지 끌고 가겠다고 자청. 노장의 항복은 조조가 의심하지 않을 무게가 있다.",
          "Huang Gai volunteers to send the false-surrender letter himself and pilot the fire-ships up to Cao's fleet. The surrender of so senior a veteran is the kind Cao will not doubt.",
        ),
      },
      {
        label: L("정공법 비용", "The cost of frontal attack"),
        value: L(
          "정면 수전은 조조 함대(추정 800~1000척)와 우리 함대(추정 400척 이하)의 정면 충돌. de Crespigny(1990): \"수적으로는 우리가 패해야 정상.\"",
          "A pitched naval engagement pits Cao's roughly 800–1,000 ships against our fewer than 400. de Crespigny (1990): \"On numbers alone we should lose.\"",
        ),
      },
    ],
    prompt: L("어떻게 결판을 낼 것인가?", "How will you settle this?"),
    choices: [
      {
        id: "fire-ships",
        label: L("황개의 거짓 항복 + 화공으로 사슬에 묶인 함대를 태운다", "Use Huang Gai's false surrender and burn the chained fleet"),
        reasoning: L(
          "사슬로 묶인 함대는 한 척이 타면 옆도 탄다. 동남풍이 며칠 더 분다. 노장의 거짓 항복은 조조가 의심하지 않을 무게가 있다.",
          "Chained ships burn each other. The southeast wind has days left. The veteran's false surrender carries weight Cao will not doubt.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "주유와 황개의 실제 선택. 정사는 \"선박이 모두 불에 탔고 사람과 말이 빠져 죽었으며 시체가 강을 메웠다\"고 기록 (삼국지·주유전).",
          "Zhou Yu and Huang Gai's actual choice. The official record: \"The ships were entirely consumed by fire; men and horses drowned, and corpses filled the river\" (Biography of Zhou Yu).",
        ),
        judgment: L(
          "당신은 적의 자기 약점 — 사슬, 풍향, 의심하지 않을 노장 — 을 한 점에 모은다. 환경·심리·진형을 한 손으로 운용하는 직관 — 큰 그림 안에 한 수의 책략을 넣을 줄 아는 판단.",
          "You gather the enemy's own weaknesses — the chains, the wind, the veteran whose surrender he won't doubt — into one point. The intuition that runs environment, psychology, and formation in a single hand — a single calculated move inside the larger picture.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "frontal-naval",
        label: L("정면 수전 정공법으로 부순다", "Settle it by a straight pitched naval battle"),
        reasoning: L(
          "조조군은 풍토병에 시달리고 형주 수병은 충성이 얕다. 정면에서도 부술 수 있다.",
          "Cao's men are sick and his Jingzhou marines disloyal. We can break them frontally.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "de Crespigny(1990): 정면 수전은 우리 측 사상자도 컸을 것이며, 조조군 함대 자체는 보전돼 도하 위협이 봄까지 이어진다.",
          "de Crespigny (1990): a pitched battle would have cost us heavily and left Cao's fleet largely intact — the river-crossing threat would carry into spring.",
        ),
        judgment: L(
          "당신은 검증된 정공법으로 결판을 보려 한다. 한 번에 끝내는 결단형 — 다만 적의 약점을 모두 합쳐 만들 한 수의 가치를 정공법의 무게로 덮는 판단.",
          "You want to settle by straight, proven force. The decisiveness that finishes in one stroke — though it covers, with the weight of frontal attack, the value of a single move that gathers all the enemy's weaknesses.",
        ),
      },
      {
        id: "supply-cut",
        label: L("결전 회피, 보급선만 끊는 지구전", "Avoid battle, just cut the supply line and grind"),
        reasoning: L(
          "조조의 진짜 약점은 시간이다. 그를 강에 묶어두고 풍토병과 보급으로 갉으면 봄에 그가 먼저 후퇴한다.",
          "Cao's real weak point is time. Pin him on the river, let plague and supply do the work, and by spring he retreats first.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "de Crespigny(1990)도 가능성으로 인정하나, 조조가 봄까지 함대를 보전해 다시 도하를 시도할 위험이 크다고 본다.",
          "de Crespigny (1990) treats this as a possible course but warns that by spring Cao would still hold his fleet and try the crossing again.",
        ),
        judgment: L(
          "당신은 한 번의 결판보다 시간의 마모를 본다. 큰 그림에서 적의 \"시간\" 약점만 골라 운용하는 신중함 — 결판을 미루는 것이 결판을 두려워하는 것과 다르다는 것을 아는 판단.",
          "You see attrition over a decisive blow. The caution that picks out Cao's \"time\" weakness alone — knowing that to defer the decision is not the same as to fear it.",
        ),
      },
      {
        id: "rumor-disease",
        label: L("첩보로 역병 소문을 퍼뜨려 형주 항복군을 흔든다", "Spread plague rumours through agents to break the surrendered Jingzhou troops"),
        reasoning: L(
          "조조군의 약한 고리는 형주 항복군이다. 풍토병 소문을 안에서 키우면 그들이 먼저 무너진다.",
          "The weak link in Cao's army is the surrendered Jingzhou troops. Inflate the plague rumour from inside and they break first.",
        ),
        tags: [
          { axis: "DIP", weight: 1 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "심리전은 보조 수단으로는 가능하나 단독 결판이 되진 않는다. 정사는 화공으로 결판이 났다고 분명히 기록한다 (자치통감 권65).",
          "Psychological warfare can support but does not settle alone. The Tongjian (65) is explicit that the fire attack decided the battle.",
        ),
        judgment: L(
          "당신은 칼보다 소문을 먼저 본다. 적의 내부 균열을 무기 삼는 외교적 시야 — 다만 결판은 결국 한 점에서 일어나며 소문이 그 한 점을 만들어주진 않는다는 판단의 한계.",
          "You reach for rumour before steel. The diplomatic eye that weaponises the enemy's internal cracks — though it has a limit: the decisive moment falls at a single point, and rumour rarely lights that point itself.",
        ),
      },
    ],
    commanderActual: L(
      "주유는 황개의 화공안을 채택했다. 황개는 거짓 항복 서신을 보내 조조의 의심을 푼 뒤, 마른 풀과 기름을 가득 실은 화선 십수 척을 사슬로 묶인 조조 함대 정면까지 끌고 가 불을 붙였다. 동남풍이 불을 북안 오림 진영까지 옮겼고, 정사는 \"선박이 모두 불에 타고 사람과 말이 빠져 죽었다\"고 기록한다 (삼국지·주유전·황개전; 자치통감 권65).",
      "Zhou Yu adopted Huang Gai's fire plan. Huang Gai's false-surrender letter dropped Cao's guard; he then led a squadron of fire-ships, packed with dry reeds and oil, straight at Cao's chained fleet and set them alight. The southeast wind carried the flames into Cao's camp at Wulin on the north bank. The Sanguozhi records: \"The ships were entirely consumed by fire; men and horses drowned\" (Biographies of Zhou Yu and Huang Gai; Zizhi Tongjian 65).",
    ),
    sources: L(
      "출처: 삼국지·오서·주유전·황개전 · 자치통감 권65 · de Crespigny, Imperial Warlord (2010), pp. 264–270 · Beckwith, Empires of the Silk Road (2009), 동아시아 겨울 풍계 분석.",
      "Sources: Sanguozhi, Wushu (Biographies of Zhou Yu and Huang Gai); Zizhi Tongjian 65; de Crespigny, Imperial Warlord (2010), pp. 264–270; Beckwith, Empires of the Silk Road (2009) on East Asian winter wind systems.",
    ),
  },
  {
    id: "pursuit",
    index: 4,
    era: L("208년 12월 — 화공 직후, 며칠간", "December 208 CE — the days after the fire"),
    location: L("오림에서 화양도까지 — 강 북안의 진흙길", "From Wulin to Huarong — the muddy road on the north bank"),
    scene: L(
      "조조는 오림이 불타자 잔병을 끌고 화양도로 패주했다. 진흙비가 내려 길은 끊기고, 그는 약병자들을 풀로 깔게 해 자기 군이 그들을 짓밟고 지나가게 했다고 한다 (배송지 주). 추격이 가능한 시간의 창은 며칠뿐이다.",
      "When Wulin burned, Cao led his survivors in flight along the Huarong road. Cold rain turned the path to mire; according to Pei Songzhi's commentary, he had the sick laid down as fascines so the rest could trample over them. The pursuit window is days, not weeks.",
    ),
    briefing: [
      {
        label: L("조조의 상태", "Cao's state"),
        value: L(
          "함대 대부분 소실, 친위대 위주로 화양도 진흙길을 강행 도주. 본인은 살아 있고 화북에는 주력 예비 — 마초·한수와 대치 중인 후방 — 이 남아 있다.",
          "Most of his fleet is gone; he flees through the Huarong mire with his core guards. He himself is alive, and his main reserves remain in the north — currently facing Ma Chao and Han Sui.",
        ),
      },
      {
        label: L("우리 상태", "Our state"),
        value: L(
          "주유는 화공 직후 화살에 부상을 입은 상태. 부장은 추격 가능. 유비의 군은 화양도 방면 측면 차단을 맡고 있다.",
          "Zhou Yu has just taken an arrow wound. Subordinate commanders can lead a pursuit. Liu Bei's force is positioned to seal the Huarong flank.",
        ),
      },
      {
        label: L("형주의 정치 공백", "Jingzhou's political vacuum"),
        value: L(
          "조조가 잠깐 차지했던 형주 7군은 지금 무인지경. 강릉·강하·장사·계양·영릉·무릉·남양 — 어느 손이 먼저 가느냐가 영토를 정한다.",
          "The seven commanderies of Jingzhou that Cao briefly held are now without master: Jiangling, Jiangxia, Changsha, Guiyang, Lingling, Wuling, Nanyang. Whoever moves first owns the ground.",
        ),
      },
      {
        label: L("학자 견해", "Scholarly views"),
        value: L(
          "de Crespigny(2010): 조조 본인을 잡을 가능성은 \"낮지만 0은 아니었다\". 진흙·동맹 분리 추격·보급 부족이 현실적 한계. Achilles Fang(1952)도 화양도 추격이 실제로 거의 닿았다고 본다.",
          "de Crespigny (2010): the chance of catching Cao himself was \"low but not zero\" — the mud, divided pursuit, and supply shortfalls were real limits. Achilles Fang (1952) likewise notes the Huarong pursuit nearly closed.",
        ),
      },
    ],
    prompt: L("승리 다음의 한 수는?", "What is your move after the victory?"),
    choices: [
      {
        id: "all-out-cao",
        label: L("전 병력으로 조조 본인을 끝까지 추격한다", "Throw everything into hunting Cao himself to the end"),
        reasoning: L(
          "조조의 머리를 베면 화북이 흔들리고 한실의 무게가 다시 천하에 돌아온다. 시간의 창은 지금이다.",
          "Cut Cao's head and the North shakes; the Han banner returns to the realm. The window is now.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -2 },
        ],
        shadowOutcome: L(
          "Achilles Fang(1952): 화양도 진흙과 보급 한계로 본대 전체 추격은 자멸의 위험. de Crespigny(2010)도 \"성공률은 낮고 실패시 대가는 컸다\"고 평한다.",
          "Achilles Fang (1952): an all-out pursuit through the Huarong mire with no supply line risked self-destruction. de Crespigny (2010) likewise: \"low odds, high downside.\"",
        ),
        judgment: L(
          "당신은 결정적 한 방의 가치를 정확히 본다. 망설이면 사라지는 순간을 잡는 결단형 — 다만 진흙과 보급이 결판의 비용을 청구한다는 사실을 가벼이 보지 않아야 하는 판단.",
          "You see exactly the value of the one decisive blow. The decisiveness that grabs the moment before it closes — though the mud and supply will bill that decision back, and that price isn't to be taken lightly.",
        ),
      },
      {
        id: "split-pursuit",
        label: L("유비와 분할 추격하며 형주 영토를 동시에 확보한다", "Split the pursuit with Liu Bei and seize Jingzhou ground at the same time"),
        reasoning: L(
          "조조 본인은 화양도에서 유비가 막고, 나는 강릉을 친다. 머리는 놓치더라도 형주의 절반을 가진다.",
          "Liu Bei seals Huarong; I take Jiangling. We may miss the head, but we win half of Jingzhou.",
        ),
        tags: [
          { axis: "INT", weight: 1 },
          { axis: "DIP", weight: 1 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "주유의 실제 선택. 그는 강릉 공격에 1년을 들여 209년에야 함락하고 그 사이 화살 부상이 악화돼 210년에 사망한다 (삼국지·주유전).",
          "Zhou Yu's actual choice. He spent a year reducing Jiangling, taking it only in 209; meanwhile his arrow wound worsened and he died in 210 (Biography of Zhou Yu).",
        ),
        judgment: L(
          "당신은 한 번의 결판보다 영토와 동맹의 그림을 본다. 큰 그림 안에 두 손을 동시에 굴리는 직관 — 결판의 짜릿함을 영토의 무게로 바꿔 받는 사람의 판단.",
          "You take territory and alliance over a single dramatic blow. The intuition that runs two hands at once inside the big picture — trading the thrill of finishing for the weight of ground held.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "withdraw-defend",
        label: L("강남 본거지로 회군해 방어를 굳힌다", "Withdraw to the southeast base and consolidate the defence"),
        reasoning: L(
          "이긴 자리에서 머무르지 않는다. 회군해 강동을 굳히고 다음 단계를 본다.",
          "Don't linger on the won field. Withdraw, secure the southeast, plan the next phase.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "de Crespigny(1990): 회군은 \"결판을 절반에서 멈추는\" 선택. 형주 7군이 통째로 유비에게 넘어가 손씨는 결정적 영토 자산을 잃는다.",
          "de Crespigny (1990): withdrawing means \"stopping the victory at half.\" All seven Jingzhou commanderies fall to Liu Bei alone, costing the Sun house a decisive territorial asset.",
        ),
        judgment: L(
          "당신은 자기 권역에서만 결판을 보려 한다. 안전을 우선하는 자제력 — 다만 영토는 빈자리에 가장 빠르게 들어가는 손이 가진다는 사실은 비껴간 판단.",
          "You only finish things inside your own span. The self-restraint that prefers safety — though it misses that empty ground goes to whichever hand reaches it first.",
        ),
      },
      {
        id: "seal-crossings",
        label: L("도하 지점만 봉쇄해 잔병을 가둔다", "Seal the river crossings, cage the survivors"),
        reasoning: L(
          "조조 본인은 놓치더라도 잔병을 가두면 화북의 정예가 통째로 무너진다.",
          "Even if Cao escapes, caging the survivors collapses the North's veteran core.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "현실적으로 1000km에 이르는 강안을 5만 명으로 봉쇄하기는 어렵다. de Crespigny(1990)는 \"봉쇄망의 구멍이 결국 본대를 빠져나가게 했을 것\"이라고 본다.",
          "In practice, 50,000 men cannot seal a 1,000 km river line. de Crespigny (1990): \"the holes in the net would have let the bulk of the army through anyway.\"",
        ),
        judgment: L(
          "당신은 정공법 대신 봉쇄선을 본다. 적의 잔병을 시간으로 마모시키려는 신중함 — 다만 봉쇄망의 길이가 자기 인력의 길이를 넘어선다는 점은 살피지 않은 판단.",
          "You see the blockade rather than the chase. The caution that grinds the survivors with time — though it doesn't measure whether your manpower reaches as far as the line you draw.",
        ),
      },
    ],
    commanderActual: L(
      "주유는 분할 추격을 택했다. 유비는 화양도 방면을 막고, 주유 본인은 즉시 강릉으로 진군해 조인의 본대와 1년에 걸친 공방을 벌였다. 조조 본인은 화양도 진흙을 빠져나가 화북으로 살아 돌아갔다. 강릉은 209년 봄에 함락됐지만, 그 과정에서 주유는 화살 부상이 악화돼 210년에 36세로 사망했다 (삼국지·주유전; 자치통감 권65~66).",
      "Zhou Yu chose a divided pursuit. Liu Bei held the Huarong line; Zhou Yu himself moved at once on Jiangling and fought Cao Ren there for a year. Cao Cao escaped through the Huarong mud back to the north. Jiangling fell in spring 209, but in the siege Zhou Yu's earlier arrow wound worsened, and he died in 210 at the age of thirty-six (Biography of Zhou Yu; Zizhi Tongjian 65–66).",
    ),
    sources: L(
      "출처: 삼국지·오서·주유전 · 배송지 주 · 자치통감 권65~66 · de Crespigny, Imperial Warlord (2010), pp. 270–278 · Achilles Fang tr., The Chronicle of the Three Kingdoms (1952).",
      "Sources: Sanguozhi, Wushu (Biography of Zhou Yu); Pei Songzhi's commentary; Zizhi Tongjian 65–66; de Crespigny, Imperial Warlord (2010), pp. 270–278; Achilles Fang tr., The Chronicle of the Three Kingdoms (1952).",
    ),
  },
  {
    id: "jingzhou-share",
    index: 5,
    era: L("209년 — 강릉 함락 직후", "209 CE — just after the fall of Jiangling"),
    location: L("강릉 — 형주 중앙", "Jiangling — central Jingzhou"),
    scene: L(
      "강릉이 떨어졌다. 형주 7군의 분배가 도마에 오른다. 유비는 강남 4군(장사·계양·영릉·무릉)을 이미 평정한 상태이며, \"형주를 빌려 달라\"는 사절을 손권에게 보낸다. 노숙은 \"빌려주자\"고 진언하고, 당신과 강경파는 \"빌려주면 영영 못 받는다\"고 본다. 손권은 노숙의 안을 채택하려 한다.",
      "Jiangling has fallen. The division of Jingzhou's seven commanderies is now on the table. Liu Bei has already taken the four southern commanderies — Changsha, Guiyang, Lingling, Wuling — and now sends an envoy to Sun Quan asking to \"borrow\" Jingzhou. Lu Su urges Sun Quan to lend it; you and the hawks argue: lend it, lose it forever. Sun Quan is leaning toward Lu Su.",
    ),
    briefing: [
      {
        label: L("현재 점유", "Current holdings"),
        value: L(
          "손씨: 강릉(주유 직접 함락) + 강하(이전 점유). 유비: 강남 4군(자력 평정) + 공안 거점. 조조: 양양·번성 등 북부 잔여 2군.",
          "Sun: Jiangling (taken by Zhou Yu) and Jiangxia (held earlier). Liu: the four southern commanderies (taken by his own arms) and the base at Gong'an. Cao: Xiangyang and Fancheng, the two northern commanderies that remain.",
        ),
      },
      {
        label: L("노숙의 논리 (삼국지·노숙전)", "Lu Su's argument (Biography of Lu Su)"),
        value: L(
          "\"조조는 천하의 적이고 유비는 새 동지다. 형주 일부를 빌려줘 그를 강하게 두면 조조의 칼이 두 갈래가 된다. 우리가 통째로 가지면 조조가 한 점에 떨어진다.\"",
          "\"Cao is the enemy of the realm; Liu is our new comrade. Lend him part of Jingzhou and he becomes strong — Cao's sword splits in two. Hold it all ourselves and Cao falls on a single point.\"",
        ),
      },
      {
        label: L("주유의 강경 노선 (삼국지·주유전)", "Zhou Yu's hawkish line (Biography of Zhou Yu)"),
        value: L(
          "주유는 \"유비를 오에 잡아두고, 관우·장비를 따로 부리며, 형주는 손씨가 통째로 가져가야 한다\"고 손권에게 별도 진언했다. 손권은 받아들이지 않았다.",
          "Zhou Yu separately advised Sun Quan: keep Liu Bei in Wu under custody, employ Guan Yu and Zhang Fei separately, and hold Jingzhou whole for the Sun house. Sun Quan did not accept the proposal.",
        ),
      },
      {
        label: L("학자 견해", "Scholarly views"),
        value: L(
          "de Crespigny(1990·2010): 노숙안은 단기 외교 자산을 만들었으나, 215~219년 형주 분쟁과 관우의 죽음의 씨앗이 됐다. \"양 노선 모두 비용이 컸다.\"",
          "de Crespigny (1990, 2010): Lu Su's plan built short-term diplomatic capital but seeded the Jingzhou disputes of 215–219 and the death of Guan Yu. \"Both options carried heavy costs.\"",
        ),
      },
    ],
    prompt: L("형주의 분배를 어떻게 마무리할 것인가?", "How will you settle the partition of Jingzhou?"),
    choices: [
      {
        id: "take-all",
        label: L("강제로 전부 차지하고 유비를 옥에 가둔다", "Take the whole of Jingzhou and put Liu Bei under custody"),
        reasoning: L(
          "유비는 호랑이 새끼다. 지금 영토와 함께 자라게 두면 다음 적은 그가 된다. 형주를 통째로 가지고 유비는 오에 묶어둔다.",
          "Liu Bei is a tiger cub. Let him grow into territory now and the next enemy is him. Hold Jingzhou whole and keep Liu Bei in Wu.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "DIP", weight: -2 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "주유 본인이 진언한 강경안. 손권은 거부했다. de Crespigny(1990)는 \"실행했다면 동맹은 즉각 깨지고 조조가 다음 봄 다시 도하했을 것\"이라 본다.",
          "Zhou Yu's actual hawkish proposal — which Sun Quan refused. de Crespigny (1990): \"If acted on, the alliance would have broken at once and Cao would have crossed the river again the next spring.\"",
        ),
        judgment: L(
          "당신은 동맹의 미래 비용을 지금 청구하려 한다. 호랑이 새끼를 키우지 않으려는 결단형 — 다만 동맹을 깨는 비용이 키우는 비용보다 클 수 있다는 점은 무게로 받아야 하는 판단.",
          "You bill the alliance's future cost up front. The decisiveness that won't raise a tiger cub — though the cost of breaking the alliance may outweigh the cost of raising it, and that weight is yours to bear.",
        ),
      },
      {
        id: "lend-jingzhou",
        label: L("노숙안을 받아 유비에게 형주 일부를 빌려준다", "Adopt Lu Su's plan and lend part of Jingzhou to Liu Bei"),
        reasoning: L(
          "조조의 칼을 두 갈래로 만든다. 유비가 강해지는 비용은 조조가 한 점에 떨어지는 비용보다 작다.",
          "Split Cao's sword in two. The cost of Liu Bei growing strong is less than the cost of Cao falling on us alone.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "손권의 실제 선택. 단기적으로 동맹은 굳어지고 조조는 북에서 마초·한수와 다시 싸워야 했다. 그러나 215년 이후 형주 분쟁의 씨앗이 됐다 (de Crespigny 1990).",
          "Sun Quan's actual choice. In the short term, the alliance held and Cao had to face Ma Chao and Han Sui again in the north. But it seeded the Jingzhou disputes from 215 onward (de Crespigny 1990).",
        ),
        judgment: L(
          "당신은 단기 비용을 받아 장기 그림을 산다. 외교를 무기처럼 운용하는 손 — 다만 빌려준 영토는 빌려준 자의 손에 영원히 돌아오지 않을 수도 있다는 비용을 안고 가는 판단.",
          "You pay the short-term cost to buy the long-term picture. The hand that runs diplomacy as a weapon — knowing that lent ground sometimes never returns to the lender, and carrying that cost with you.",
        ),
      },
      {
        id: "alliance-break",
        label: L("동맹 결렬을 선언하고 강남 4군을 즉시 회수한다", "Declare the alliance over and reclaim the four southern commanderies at once"),
        reasoning: L(
          "유비가 영토를 자력 평정했다는 명분은 받아들이지 않는다. 동맹 깃발 아래 얻은 땅은 동맹의 자산이다.",
          "I don't accept the claim that Liu took those four by his own arms. Ground won under the alliance banner is alliance property.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "DIP", weight: -2 },
        ],
        shadowOutcome: L(
          "유비는 이미 4군에 행정 기반을 깔았다. 회수는 사실상 새 전쟁이며 조조가 즉시 도하한다 — Achilles Fang(1952)은 이를 \"양면 자살\"이라 평한다.",
          "Liu Bei has already built administration in those four. Reclaiming them means a fresh war while Cao crosses the river — Achilles Fang (1952) calls this \"two-front suicide.\"",
        ),
        judgment: L(
          "당신은 명분의 손해를 가장 무겁게 본다. 동맹의 형식보다 영토의 실질을 우선하는 판단 — 다만 조조라는 더 큰 적 앞에서 두 번째 전선을 여는 비용이 자기 손에 돌아온다는 점은 무겁게 받아야 하는 판단.",
          "You weigh face above all. The judgment that puts the substance of territory above the form of alliance — though opening a second front while the larger enemy still stands sends that bill back to your own hand, and that weight is yours.",
        ),
      },
      {
        id: "phased-deal",
        label: L("시간차 분할 약정으로 정치 자산을 만든다", "Set a phased-return treaty and turn the dispute into political capital"),
        reasoning: L(
          "지금은 빌려주되 \"익주를 얻으면 형주를 반환한다\"는 명문 약정을 둔다. 약정 자체가 다음 협상의 카드가 된다.",
          "Lend now, but on paper: \"When Liu takes Yi Province, Jingzhou returns.\" The treaty itself becomes the card for the next round.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "이 형식은 215년 노숙·관우의 \"단도부회(單刀赴會)\" 협상에서 부분적으로 실행되어 형주를 호수 동서로 절반씩 나누는 합의로 이어진다 (삼국지·노숙전).",
          "This form was partly enacted at the 215 Lu Su / Guan Yu sword-meeting, which produced a halving of Jingzhou along the Xiang River (Biography of Lu Su).",
        ),
        judgment: L(
          "당신은 분쟁 자체를 자산으로 운용한다. 외교에 시간 축을 더해 한 약정으로 두 번 협상하는 손 — 큰 그림 안에 한 수의 책략을 넣을 줄 아는 외교적 시야.",
          "You run the dispute itself as an asset. The hand that adds a time axis to diplomacy and negotiates a single treaty twice — a calculated move set inside the larger picture.",
        ),
        isCommanderChoice: true,
      },
    ],
    commanderActual: L(
      "주유는 강경안 — 유비를 오에 잡아두고 형주를 통째로 차지하라 — 을 손권에게 별도 진언했다. 손권은 노숙의 \"형주 대여\"안을 받아들였다. 다만 정사는 주유가 죽기 직전 손권에게 \"노숙의 안을 받되 시간차 분할 약정으로 정치 자산을 만들라\"는 취지의 유언을 남겼다고 기록한다 — 이것이 215년 단도부회 합의로 이어진다 (삼국지·주유전·노숙전; 자치통감 권65~66).",
      "Zhou Yu separately urged Sun Quan to take the hard line — keep Liu Bei in Wu, hold Jingzhou whole. Sun Quan instead adopted Lu Su's \"borrow\" arrangement. The Sanguozhi records that on his deathbed Zhou Yu still recommended that Sun accept Lu Su's plan but bind it inside a phased return — the form that resurfaces at the 215 sword-meeting between Lu Su and Guan Yu (Biographies of Zhou Yu and Lu Su; Zizhi Tongjian 65–66).",
    ),
    sources: L(
      "출처: 삼국지·오서·주유전·노숙전 · 자치통감 권65~66 · de Crespigny, Generals of the South (1990), pp. 230–245; Imperial Warlord (2010), pp. 280–292 · Achilles Fang tr., The Chronicle of the Three Kingdoms (1952).",
      "Sources: Sanguozhi, Wushu (Biographies of Zhou Yu and Lu Su); Zizhi Tongjian 65–66; de Crespigny, Generals of the South (1990), pp. 230–245; Imperial Warlord (2010), pp. 280–292; Achilles Fang tr., The Chronicle of the Three Kingdoms (1952).",
    ),
  },
];

export const RED_CLIFFS_ARCHETYPES: Archetype[] = [
  {
    id: "zhouyu",
    name: L("주유형 — 큰 그림 안의 한 수", "The Zhou Yu — A Single Move Inside the Big Picture"),
    signature: L(
      "당신은 사슬에 묶인 함대를 다시 한 번 태웠을 지휘관이다.",
      "You are the hand that would burn the chained fleet a second time.",
    ),
    desc: L(
      "직관과 공격성을 동시에 갖춘 드문 지휘관. 적의 약점 — 사슬, 풍향, 의심하지 않을 노장 — 을 한 점에 모아 한 수로 결판을 본다. 큰 그림을 그리되 결정적 순간에 망설이지 않는다.",
      "A rare hand that holds intuition and aggression at once. Gathers the enemy's weak points — chains, wind, the veteran whose surrender won't be doubted — into a single point and finishes there. Draws the big picture, but does not hesitate at the decisive instant.",
    ),
    strengths: [
      L("환경·심리·진형을 한 손으로 운용한다", "Runs environment, psychology, and formation in a single hand"),
      L("다수가 항복을 말할 때 약점 네 가지를 짚어 무게를 옮긴다", "When the room talks surrender, you tilt it with four sharp weak points"),
      L("불리한 숫자를 한 수의 책략으로 뒤집는다", "Flips bad odds with one calculated move"),
    ],
    watchOut: [
      L("승리 직후의 영토·동맹 분배에서 강경에 치우친다", "After victory, leans hard on the territorial and alliance settlement"),
      L("자기 부상·소모를 작전 안에 산입하지 않는다", "Doesn't price your own wounds and wear into the plan"),
      L("같은 책략은 다음 적이 학습한다", "The next enemy learns the same trick"),
    ],
    pairsWithId: "lusu",
    clashesWithId: "zhangzhao",
    profile: { AGG: 1, CAU: 0, DIP: 0, INT: 2 },
  },
  {
    id: "lusu",
    name: L("노숙형 — 동맹으로 시간을 만드는 손", "The Lu Su — The Hand That Makes Time Through Alliance"),
    signature: L(
      "당신은 적의 칼을 두 갈래로 가르는 한 수를 본다.",
      "You see the move that splits the enemy's sword in two.",
    ),
    desc: L(
      "외교와 신중을 우선한다. 결전을 거부하지 않지만, 결전의 모양을 외교로 다시 짠다. 단기 비용을 받아 장기 그림을 사는 사람.",
      "Diplomacy and caution come first. Doesn't refuse battle, but redesigns its shape through alliance. The hand that pays the short-term cost to buy the long-term picture.",
    ),
    strengths: [
      L("적의 칼이 떨어질 점을 두 갈래로 갈라놓는다", "Splits the point where the enemy's blade would fall"),
      L("약한 동맹의 가치를 그 약함 자체에서 본다", "Sees the value of the weak ally in his very weakness"),
      L("협상 한 번을 두 번의 자산으로 운용한다", "Runs one negotiation as two assets"),
    ],
    watchOut: [
      L("\"빌려준 영토\"가 영원히 돌아오지 않을 수 있다", "Lent ground sometimes never returns to the lender"),
      L("강경파에게 \"매국노\"로 몰리기 쉽다", "Easily branded a sellout by the war faction"),
      L("결정적 한 방의 짜릿함을 양보한다", "Yields the thrill of the decisive blow"),
    ],
    pairsWithId: "zhouyu",
    clashesWithId: "caocao",
    profile: { AGG: -1, CAU: 1, DIP: 2, INT: 1 },
  },
  {
    id: "zhugeliang",
    name: L("제갈량형 — 바람을 읽고 말로 부수는 손", "The Zhuge Liang — Reads the Wind, Breaks With Words"),
    signature: L(
      "당신은 다른 사람의 칼을 빌려 자기 그림을 그린다.",
      "You borrow someone else's sword and draw your own picture.",
    ),
    desc: L(
      "직관과 외교를 함께 운용한다. 자기 군이 아닌 자리에서 결판을 만들 줄 알며, 환경(풍향·지형·민심)을 무기 삼아 동맹의 합의를 끌어낸다.",
      "Holds intuition and diplomacy together. Can build the decisive moment in someone else's room, weaponising environment — wind, terrain, sentiment — to extract the alliance.",
    ),
    strengths: [
      L("자기 군이 약할 때 남의 군의 결단을 만들어낸다", "When your own force is weak, you make the other's force commit"),
      L("환경 변수를 정치 변수로 변환한다", "Converts environmental variables into political ones"),
      L("적이 보지 못한 길을 먼저 본다", "Sees roads the enemy has not seen"),
    ],
    watchOut: [
      L("자기 자원이 작아 결정의 실행을 남에게 맡긴다", "Your small resources force you to outsource execution"),
      L("동맹의 합의가 깨지면 무기 자체가 사라진다", "When the alliance breaks, the weapon goes with it"),
      L("말이 칼보다 빠르지 않은 순간이 온다", "There comes a moment when words can't keep up with steel"),
    ],
    pairsWithId: "lusu",
    clashesWithId: "caocao",
    profile: { AGG: 0, CAU: 0, DIP: 1, INT: 2 },
  },
  {
    id: "caocao",
    name: L("조조형 — 압도적 자원으로 정면을 부수려는 손", "The Cao Cao — Crushes the Front With Overwhelming Resources"),
    signature: L(
      "당신은 더 큰 숫자가 결국 결판을 낸다고 본다.",
      "You believe the bigger number, in the end, decides.",
    ),
    desc: L(
      "정복자의 시야. 화북 통일의 무게를 자기 자원으로 운용해 정면 결전을 강요한다. 적의 약점을 \"내 무게\"로 덮으려 한다 — 다만 그 무게가 자기 약점이 되는 순간을 종종 놓친다.",
      "The conqueror's eye. Wields the weight of a unified north, forces the pitched battle, covers the enemy's weak points with his own mass — and sometimes misses the moment when that mass becomes his own weak point.",
    ),
    strengths: [
      L("자원·인사·정치를 한 손에 모은다", "Gathers resources, personnel, and politics in one hand"),
      L("결판을 자기 시간표에 맞춘다", "Sets the timetable of the decisive battle"),
      L("패전 한 번에 무너지지 않는 두께를 가진다", "Has the depth not to break on a single defeat"),
    ],
    watchOut: [
      L("자기 군의 약점(수전·풍토병)을 자기 무게로 덮으려 한다", "Tries to cover his own weak points — naval combat, climate disease — with his own mass"),
      L("항복군의 얕은 충성을 정예와 같은 자원으로 친다", "Counts shallow-loyalty surrendered troops as if they were veterans"),
      L("의심하지 않을 노장의 거짓 항복에 약하다", "Vulnerable to a senior veteran's false surrender"),
    ],
    pairsWithId: "balanced",
    clashesWithId: "zhouyu",
    profile: { AGG: 2, CAU: -1, DIP: 0, INT: -1 },
  },
  {
    id: "zhangzhao",
    name: L("장소형 — 전쟁보다 봉공을 보는 손", "The Zhang Zhao — Sees Submission Before War"),
    signature: L(
      "당신은 칼을 빼기 전에 끝낼 수 있는 전쟁을 본다.",
      "You see the war that ends before the sword is drawn.",
    ),
    desc: L(
      "오 항복파의 영수. 명분 안에서 자치를 지키려는 매우 신중한 외교형. \"한실의 정통 승상에게 신하 되는 비용\"을 결전의 비용보다 작게 본다.",
      "Leader of Wu's surrender faction. Highly cautious — would protect autonomy by working inside legitimacy. Reckons the cost of submitting to the legitimate Han Chancellor as smaller than the cost of pitched war.",
    ),
    strengths: [
      L("싸우기 전에 끝낼 길을 본다", "Sees the road that ends the war before it begins"),
      L("국력을 칼날 아닌 그릇으로 본다", "Treats national strength as a vessel, not a blade"),
      L("명분을 외교의 근간으로 운용한다", "Runs legitimacy as the foundation of diplomacy"),
    ],
    watchOut: [
      L("신하인 우리는 자리를 지키지만 군주는 갈 곳이 없다", "Officials keep their posts; the lord has nowhere to go"),
      L("강경파에게 \"매국노\"로 몰리기 쉽다", "Easily branded a sellout by the war faction"),
      L("적의 합리성에 베팅한 외교가 적의 비합리성에 무너진다", "A diplomacy that bets on the enemy's reason breaks on the enemy's unreason"),
    ],
    pairsWithId: "balanced",
    clashesWithId: "zhouyu",
    profile: { AGG: -2, CAU: 2, DIP: 1, INT: -1 },
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
    pairsWithId: "zhouyu",
    clashesWithId: "caocao",
    profile: { AGG: 0.5, CAU: 0.5, DIP: 0.5, INT: 0.5 },
  },
];

export function getArchetypeById(id: string): Archetype | undefined {
  return RED_CLIFFS_ARCHETYPES.find((a) => a.id === id);
}

export function encodePicks(picks: Record<string, string>): string {
  return encodePicksFor(picks, RED_CLIFFS_DILEMMAS);
}

export function decodePicks(
  p: string | null | undefined,
): Record<string, string> | null {
  return decodePicksFor(p, RED_CLIFFS_DILEMMAS);
}

export function evaluate(picks: Record<string, string>): EvalResult {
  return evaluatePicks(picks, RED_CLIFFS_DILEMMAS, RED_CLIFFS_ARCHETYPES);
}
