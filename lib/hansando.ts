// 한산도대첩 — your command-style assessment.
// Five independent dilemmas drawn from Yi Sun-sin's 1592 sea campaign.
//
// Sources: 이순신 『난중일기』 임진년 5–7월; 류성룡 『징비록』; 『이충무공전서』
// (정조 19년, 1795); 『선조실록』 권25–28.
// Modern: 이민웅 『임진왜란 해전사』 (2004); 김일환 『이순신과 임진왜란』;
// 노영구 외 『한국군사사』 (2012); Samuel Hawley, The Imjin War (2005);
// Stephen Turnbull, Samurai Invasion (2002).

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

export const HANSANDO_DILEMMAS: Dilemma[] = [
  {
    id: "battlefield",
    index: 1,
    era: L("1592년 7월 7일 (음력) — 임진년", "July 7, 1592 (lunar) — Imjin War, Year 1"),
    location: L("견내량 — 거제도와 통영 사이 좁은 해협", "Gyeonnaeryang — narrow strait between Geoje and Tongyeong"),
    scene: L(
      "임진왜란 발발 두 달 반. 옥포·합포·당포·당항포에서 잇따라 이긴 뒤, 일본 수군은 와키자카 야스하루 휘하 73척을 견내량에 집결시켰다. 폭 1.8km의 좁은 해협, 암초가 깔린 물길이다. 전라좌수영 23척, 전라우수영 25척, 경상우수영 7척 — 합 56척이 견내량 입구에 닿는다. 정찰선이 적의 위치를 보고한 새벽, 결전지를 정해야 한다.",
      "Two and a half months into the Imjin War. After victories at Okpo, Hapo, Dangpo, and Danghangpo, the Japanese have massed 73 ships under Wakizaka Yasuharu inside Gyeonnaeryang — a strait barely 1.8 km wide, full of reefs. Yi Sun-sin's 23 ships join Yi Eok-gi's 25 and Won Gyun's 7. Fifty-six in all reach the strait's mouth at dawn. The scouts have reported. The killing ground must be chosen.",
    ),
    briefing: [
      {
        label: L("병력 (난중일기 임진년 7월 8일)", "Forces (Nanjung Ilgi, 7th month, day 8)"),
        value: L(
          "조선 56척 — 전라좌수영 23척(거북선 3척 포함) + 전라우수영 25척 + 경상우수영 7척. 일본 73척 — 안택선(아타케부네) 36척, 세키부네 24척, 작은 배 13척.",
          "Joseon 56 — 23 from Left Jeolla (incl. 3 turtle ships) + 25 from Right Jeolla + 7 from Right Gyeongsang. Japan 73 — 36 atakebune, 24 sekibune, 13 smaller boats.",
        ),
      },
      {
        label: L("지형 (이민웅 2004, pp. 162–168)", "Terrain (Lee Min-ung 2004, pp. 162–168)"),
        value: L(
          "견내량은 폭 1.8km, 길이 약 4km. 암초가 다수. 판옥선의 기동·선회가 어렵고, 떼로 몰린 일본 함선은 백병전에 유리하다. 남쪽 한산도 앞바다는 폭이 넓어 진형 전개에 적합.",
          "Gyeonnaeryang: 1.8 km wide, ~4 km long, reef-strewn. The panokseon cannot turn or maneuver well; packed Japanese ships favor boarding combat. South of the strait, the open water off Hansando lets a fleet deploy.",
        ),
      },
      {
        label: L("적 지휘 (脇坂家文書·Hawley 2005)", "Enemy command (Wakizaka family records; Hawley 2005)"),
        value: L(
          "와키자카 야스하루(脇坂安治). 용인 전투에서 1,500으로 조선군 5만을 격파한 직후의 전공을 안고 단독 출진. 구키·가토 함대를 기다리지 않았다.",
          "Wakizaka Yasuharu — fresh from routing a far larger Korean force at Yongin with 1,500 men. He has sailed alone without waiting for Kuki Yoshitaka's or Kato Yoshiaki's squadrons.",
        ),
      },
      {
        label: L("화력·전술 격차", "Firepower and doctrine"),
        value: L(
          "조선 판옥선: 천·지·현·황자총통 다수 탑재, 원거리 포격 우위. 일본: 조총 사수와 백병전 의존, 함포 빈약. 좁은 곳에서 접현하면 조선 우위 소멸.",
          "Panokseon: cheonja, jija, hyeonja, hwangja cannon — heavy ranged firepower. Japan: arquebus and boarding, weak ship-borne guns. In tight water where boarding is forced, Joseon's advantage evaporates.",
        ),
      },
    ],
    prompt: L("결전지를 어디로 정할 것인가?", "Where will you fight this battle?"),
    choices: [
      {
        id: "narrows",
        label: L("견내량 안에서 즉시 기습한다", "Strike at once inside the narrows"),
        reasoning: L(
          "적이 정렬을 마치기 전에 친다. 좁은 곳에서 적 함대의 횡대 전개를 막을 수 있다.",
          "Hit before they form. The narrows prevent the enemy from spreading into a line.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: -1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "이민웅(2004)은 좁은 해협에서 백병전이 강요되면 \"판옥선 화력 우위가 무력화되고 와키자카가 옥포·당포의 손실을 만회했을 것\"이라 본다. 원균이 이 안을 주장했다 (난중일기 7월 7일).",
          "Lee Min-ung (2004) judges that forced boarding in the strait would have neutralized panokseon firepower and let Wakizaka recover his Okpo–Dangpo losses. Won Gyun pressed exactly this option (Nanjung Ilgi, 7/7).",
        ),
        judgment: L(
          "당신은 적을 기다리지 않는다. 시간을 적의 자원으로 보지 않는 결단형 — 다만 자기 무기의 사거리를 잠시 잊을 수 있는 손.",
          "You don't let the enemy keep time. The decisiveness that refuses to give the enemy a clock — though it can briefly forget its own weapon's reach.",
        ),
      },
      {
        id: "lure-out",
        label: L("한산도 앞바다로 유인해 학익진을 친다", "Lure them into the open sea off Hansando, set the crane-wing"),
        reasoning: L(
          "좁은 곳에서는 우리도 진형을 못 짠다. 5~6척으로 도발해 적을 끌어낸 뒤, 넓은 바다에서 학익진으로 감싸 화포로 부순다.",
          "Neither side can deploy in the narrows. Five or six ships bait Wakizaka out; then in open water the crane-wing closes and the cannon do the work.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "CAU", weight: 1 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "이순신의 실제 선택. 7월 8일 일본 함선 47척 격침, 12척 나포. 조선 측 손실은 미미했다 (이충무공전서 권2 장계 \"견내량파왜병장\").",
          "Yi Sun-sin's actual choice. On 7/8 the Japanese lost 47 ships sunk and 12 captured; Joseon losses were negligible (Yi Chungmugong Jeonseo, vol. 2, dispatch \"Gyeonnaeryang Pawaebyeong-jang\").",
        ),
        judgment: L(
          "당신은 자기 무기가 가장 잘 닿는 자리로 적을 옮길 줄 안다. 지형을 적의 짐으로 바꾸는 직관 — 결전을 자기 페이스로 가져오는 사람의 사고.",
          "You know how to move the enemy to the place your weapon reaches best. The intuition that turns terrain into the enemy's burden — the mind that pulls the decisive battle onto your own tempo.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "night-encircle",
        label: L("야간에 침투해 정박한 함대를 포위한다", "Slip in at night and surround the moored fleet"),
        reasoning: L(
          "적이 닻을 내린 사이 침투해 새벽에 친다. 도망갈 길 자체를 끊는다.",
          "Move in while they ride at anchor; strike at first light. Cut the escape before it begins.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
          { axis: "CAU", weight: -1 },
        ],
        shadowOutcome: L(
          "Hawley(2005, p. 198)는 \"이순신의 함대는 항해등·신호체계가 미숙해 야간 협수로 침투에 부적합\"이라 본다. 암초·조류 사고가 결전 전 자멸 위험.",
          "Hawley (2005, p. 198) judges Yi's fleet lacked the night signaling needed for a reef-laced strait — risk of self-destruction on rocks and tide before any battle began.",
        ),
        judgment: L(
          "당신은 적의 휴식 시간을 적의 약점으로 본다. 환경을 무기로 빌리는 직관 — 다만 자기 함대가 그 환경을 견딜 수 있는지를 묻는 손.",
          "You see the enemy's rest as the enemy's weakness. The intuition that borrows environment as weapon — though it must ask whether your own fleet can bear that same environment.",
        ),
      },
      {
        id: "blockade",
        label: L("해협 출구를 봉쇄해 굶긴다", "Seal the strait's exit, starve them out"),
        reasoning: L(
          "결전 없이 적을 가둔다. 보급이 끊긴 일본은 며칠 안에 무너진다.",
          "Pen them without a battle. Cut off, the Japanese collapse in days.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: 1 },
          { axis: "AGG", weight: -2 },
        ],
        shadowOutcome: L(
          "노영구 외 『한국군사사』(2012)는 \"구키·가토 본대(40척 이상)가 며칠 내 합류해 봉쇄가 도리어 협공받았을 것\"이라 본다. 시간은 일본 편이었다.",
          "Noh Young-gu et al., A Military History of Korea (2012), argue that Kuki and Kato's main squadrons (40+ ships) would have arrived within days, turning the blockade into a pincer. Time was on Japan's side.",
        ),
        judgment: L(
          "당신은 결판을 미루어 자기 손실을 줄이려 한다. 절제의 손 — 다만 적의 후속 함대가 같은 시계 안에 움직인다는 것을 살피는 판단력이 필요.",
          "You postpone the decision to spare your own losses. The hand of restraint — but it needs to track that the enemy's reinforcements move on the same clock.",
        ),
      },
    ],
    commanderActual: L(
      "이순신은 견내량의 좁은 해협을 거부했다. 7월 8일 새벽 판옥선 5~6척으로 일본 함대를 도발해 한산도 앞바다로 끌어낸 뒤, 학익진으로 감싸 천·지·현·황자총통으로 일제 사격했다. 일본 함선 47척 격침, 12척 나포, 와키자카는 가까스로 김해로 도주했다 (이충무공전서, 견내량파왜병장; 난중일기 임진년 7월 8일).",
      "Yi refused the strait. At dawn on 7/8 he sent five or six panokseon to provoke the Japanese, drew them into the open water off Hansando, and closed the crane-wing — every panokseon firing in concert. Forty-seven Japanese ships sunk, twelve taken; Wakizaka barely escaped to Gimhae (Yi Chungmugong Jeonseo, \"Gyeonnaeryang Pawaebyeong-jang\"; Nanjung Ilgi, 7/8 Imjin).",
    ),
    sources: L(
      "출처: 난중일기 임진년 7월 7~8일 · 이충무공전서 권2 장계 \"견내량파왜병장\" · 징비록 권1 · 이민웅 『임진왜란 해전사』(2004) pp. 158–175 · Hawley, The Imjin War (2005) pp. 195–202.",
      "Sources: Nanjung Ilgi, 7th month days 7–8 (Imjin); Yi Chungmugong Jeonseo vol. 2, \"Gyeonnaeryang Pawaebyeong-jang\"; Jingbirok vol. 1; Lee Min-ung (2004), pp. 158–175; Hawley (2005), pp. 195–202.",
    ),
  },

  {
    id: "formation",
    index: 2,
    era: L("1592년 7월 8일 정오 — 임진년", "Noon, July 8, 1592 — Imjin War"),
    location: L("한산도 앞바다 — 견내량 남쪽", "Open sea off Hansando — south of the strait"),
    scene: L(
      "유인책이 통했다. 일본 함대가 견내량을 빠져나와 추격해 온다. 이제 진형의 차례다. 와키자카의 안택선·세키부네는 정면으로 몰려오며 접현·백병을 노린다. 우리 56척, 적 73척. 깊고 넓은 바다, 시야는 맑다.",
      "The bait worked. Wakizaka's fleet has cleared the strait and is closing in pursuit. Now the formation. The atakebune and sekibune drive forward to grapple and board. Fifty-six against seventy-three. The water is deep, the line of sight clear.",
    ),
    briefing: [
      {
        label: L("학익진 (이충무공전서 권10)", "Crane-wing (Yi Chungmugong Jeonseo, vol. 10)"),
        value: L(
          "양 날개가 안쪽으로 굽어 적을 감싸는 반월형 진. 모든 판옥선의 측면 화포가 한 점을 향해 동시에 발사할 수 있다.",
          "A crescent in which both wings curve inward and embrace the enemy. Every panokseon's broadside cannon can fire on a single point at once.",
        ),
      },
      {
        label: L("일자진 vs 학익진 (이민웅 2004)", "Line vs crane-wing (Lee Min-ung 2004)"),
        value: L(
          "일자진은 정면 화력은 강하나 측면이 약하다. 학익진은 사격 각도가 분산되지만 적을 가둔다. 적이 정면 돌격형이면 학익진이 답.",
          "The line gives strong frontal fire but weak flanks. The crane-wing splits firing angles but cages the enemy — the answer when the foe charges head-on.",
        ),
      },
      {
        label: L("바람·조류", "Wind and tide"),
        value: L(
          "남동풍 약. 조류는 견내량에서 남쪽으로 흐른다. 적이 우리 방향으로 떠밀려 온다.",
          "Light southeasterly; tide running south out of the strait. The current carries the enemy toward us.",
        ),
      },
      {
        label: L("기록된 처음 (학계 평가)", "First in record (consensus)"),
        value: L(
          "함대 규모로 운용된 학익진은 한산도 해전이 사료상 첫 사례 (이민웅 2004, 노영구 2012). 이순신이 통영 두룡포에서 사전 훈련.",
          "Hansando is the first recorded fleet-scale crane-wing in the sources (Lee 2004; Noh 2012). Yi had drilled it beforehand at Duryongpo.",
        ),
      },
    ],
    prompt: L("어떤 진형으로 결판을 낼 것인가?", "What formation seals the day?"),
    choices: [
      {
        id: "crane-wing",
        label: L("학익진 — 양 날개로 감싸 일제 함포 사격", "Crane-wing — close the wings and fire all cannon together"),
        reasoning: L(
          "일본 함대가 정면으로 몰려온다. 양 날개를 굽혀 감싸면 도망길이 사라지고, 우리 함포 56문이 한 점에 닿는다.",
          "They drive straight at us. Curl the wings, and their road home vanishes; fifty-six broadsides converge on a single point.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "이순신의 실제 선택. 학익진은 일본 함대를 분쇄했다. 47척 격침·12척 나포의 결과는 이 진형이 직접 만든 것이다 (이충무공전서; 이민웅 2004 p. 173).",
          "Yi's actual choice. The crane-wing shattered the Japanese fleet — the 47 sunk and 12 captured were the formation's direct product (Yi Chungmugong Jeonseo; Lee 2004, p. 173).",
        ),
        judgment: L(
          "당신은 적의 정면 의지를 자기 함정으로 만든다. 적의 의지를 자원으로 채굴하는 직관 — 진형 자체가 결정인 사람의 손.",
          "You forge the enemy's frontward will into your own snare. The intuition that mines the enemy's commitment for ore — the hand whose decision is the formation itself.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "line",
        label: L("일자진 — 정면 화력 집중", "Line of battle — concentrate frontal fire"),
        reasoning: L(
          "정면 화력만으로 충분하다. 진형이 단순할수록 신호 오류가 없다.",
          "Frontal fire alone is enough. Simpler formation means fewer signaling errors.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: -1 },
        ],
        shadowOutcome: L(
          "이민웅(2004, p. 172)은 \"일자진은 적의 측면 우회를 허용해 일본 함대 절반 이상의 도주를 허용했을 것\"이라 본다. 격침수가 절반 이하로 떨어진다.",
          "Lee (2004, p. 172): a line lets the enemy slip past the flanks; over half of Wakizaka's ships likely escape. The kill total falls below half.",
        ),
        judgment: L(
          "당신은 단순한 무기를 신뢰한다. 정공법의 손 — 다만 단순함이 적의 길을 열어줄 수 있다는 점을 살피는 판단.",
          "You trust the plain weapon. The straightforward hand — though it must watch that simplicity does not open the enemy's road.",
        ),
      },
      {
        id: "turtle-charge",
        label: L("거북선 단독으로 적진 한복판을 뚫는다", "Send the turtle ships alone to pierce the enemy's heart"),
        reasoning: L(
          "신무기가 가장 강한 자리에서 가장 강한 일을 한다. 적 사령선을 단숨에 무너뜨린다.",
          "The new weapon at its strongest spot, doing its strongest work — break the flagship in one stroke.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -2 },
        ],
        shadowOutcome: L(
          "김일환은 거북선을 \"본대를 보호하는 돌격선\"으로 정의하며 단독 운용은 사상자 위험이 컸다고 본다. 3척 중 1척만 잃어도 임란 후반 명량(1597)에서 활용 불가.",
          "Kim Il-hwan reads the turtle ships as escort-strike vessels for the main fleet; solo deployment risked losses that would deny their use later, including Myeongnyang 1597.",
        ),
        judgment: L(
          "당신은 신무기에 결정의 무게를 모두 싣는다. 한 점 돌파의 결단형 — 다만 자원의 분포가 결정의 길이를 정한다는 것을 살펴야 하는 손.",
          "You stake the whole decision on the new weapon. The decisiveness of single-point breakthrough — though it must remember that distribution of force, not just its tip, sets the run of the war.",
        ),
      },
      {
        id: "decoy-ambush",
        label: L("분견대로 미끼를 두고 본대는 매복한다", "Detach a decoy, hide the main body in ambush"),
        reasoning: L(
          "적이 분견대를 추격하는 사이 본대로 측면을 친다.",
          "While they chase the decoy, the main fleet strikes the flank.",
        ),
        tags: [
          { axis: "INT", weight: 2 },
          { axis: "CAU", weight: 1 },
        ],
        shadowOutcome: L(
          "노영구 외(2012)는 \"한산도 앞바다는 매복지가 부족\"하다고 본다. 분견 매복은 트라시메누스형 지형이 필요하며, 한산도는 학익진형 지형.",
          "Noh et al. (2012) note Hansando lacks ambush terrain — that demands Trasimene-style geography, while Hansando is crane-wing geography.",
        ),
        judgment: L(
          "당신은 진형보다 기교를 신뢰한다. 매복의 직관 — 다만 지형이 그 기교를 받아주는지를 묻는 손.",
          "You trust the trick over the formation. The instinct of ambush — though it must ask whether the terrain itself accepts the trick.",
        ),
      },
    ],
    commanderActual: L(
      "이순신은 학익진을 명했다. 양 날개의 판옥선이 안쪽으로 굽어 일본 함대를 감쌌고, 56척이 동시에 천·지·현·황자총통을 발사했다. 일본 함선은 정면 돌격이 가능했던 단 한 방향이 막히자 무너졌다 (난중일기 7월 8일; 이민웅 2004 pp. 170–174).",
      "Yi ordered the crane-wing. Both wings curved inward; fifty-six panokseon fired their cheonja, jija, hyeonja, and hwangja cannon together. With their one path of frontal attack closed, the Japanese fleet broke (Nanjung Ilgi, 7/8; Lee 2004, pp. 170–174).",
    ),
    sources: L(
      "출처: 난중일기 임진년 7월 8일 · 이충무공전서 권2 \"견내량파왜병장\", 권10 \"진법\" · 이민웅 『임진왜란 해전사』(2004) pp. 170–174 · 노영구 외 『한국군사사』(2012) 제3권 임진왜란편.",
      "Sources: Nanjung Ilgi, 7/8 Imjin; Yi Chungmugong Jeonseo vol. 2 \"Gyeonnaeryang Pawaebyeong-jang\" and vol. 10 \"Jinbeop\"; Lee (2004), pp. 170–174; Noh et al. (2012), vol. 3 (Imjin).",
    ),
  },

  {
    id: "turtle",
    index: 3,
    era: L("1592년 7월 8일 — 결전 직전", "Just before contact, July 8, 1592"),
    location: L("학익진의 중심 — 본대 후방", "Center of the crane-wing — rear of the main body"),
    scene: L(
      "거북선 3척이 본대 뒤에서 명령을 기다린다. 갑판은 철판과 못으로 덮였고, 사방에 총통이 박혔다. 5월 옥포 이후 단 두 달 만에 실전 검증된 신무기. 어디에 둘 것인가가 학익진의 무게 자체를 정한다.",
      "Three turtle ships wait behind the main body. Iron plate and spikes cover the deck; cannon ports bristle on every side. Battle-proven only since Okpo two months ago. Where they go decides the weight of the crane-wing itself.",
    ),
    briefing: [
      {
        label: L("거북선 제원 (이충무공전서 권10 \"귀선도설\")", "Turtle ship specs (Yi Chungmugong Jeonseo vol. 10, \"Gwiseondoseol\")"),
        value: L(
          "전후좌우 함포, 갑판 철갑·송곳, 화살·조총 방어. 노 16~20개 양현 배치. 사령선 돌격 및 적 진형 교란 용도.",
          "Cannon on all four sides; iron-clad deck studded with spikes; arrow- and arquebus-proof. 16–20 oars per side. Designed to ram flagships and break enemy formation.",
        ),
      },
      {
        label: L("실전 기록", "Combat record so far"),
        value: L(
          "사천·당포·한산도. 사천 해전(5월 29일)에서 처음 투입 — 일본 사령선 격파. 학자 합의: \"본대를 보호하는 돌격선\".",
          "Sacheon, Dangpo, Hansando. First used at Sacheon (5/29) — broke a Japanese command ship. Scholarly consensus: an escort-strike vessel, not a solo raider.",
        ),
      },
      {
        label: L("일본의 대응 (Turnbull 2002)", "Japanese counter (Turnbull 2002)"),
        value: L(
          "거북선은 접현·백병이 불가능. 일본은 화공·조총 집중 사격 외 대응 수단이 사실상 없다.",
          "Boarding the turtle ship is impossible. The Japanese have no real answer beyond fire arrows and concentrated arquebus fire.",
        ),
      },
      {
        label: L("우리 보유", "Available"),
        value: L(
          "3척. 분견 가능 단위는 1·2·3.",
          "Three. Splittable into ones, twos, or kept whole.",
        ),
      },
    ],
    prompt: L("거북선 3척을 어디에 쓰겠는가?", "Where do you use the three turtle ships?"),
    choices: [
      {
        id: "escort",
        label: L("학익진 양 측면 호위로 본대를 보호한다", "Escort the wings — protect the main body"),
        reasoning: L(
          "본대 측면이 적의 접현 시도에 노출된다. 거북선이 측면을 막으면 학익진이 무너질 일이 없다.",
          "The wings are where enemy boarding could pry the line apart. With the turtle ships there, the crane-wing cannot break.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: 1 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "Hawley(2005, p. 200)는 \"호위 운용은 안전하나 결정적 충격을 만들지 못했을 것\"이라 본다. 격침수가 줄지만 조선 측 손실도 거의 없다.",
          "Hawley (2005, p. 200) judges that escort use is safe but creates no decisive shock — fewer Japanese ships sunk, but virtually no Joseon losses either.",
        ),
        judgment: L(
          "당신은 신무기를 \"부수는 손\"이 아닌 \"무너지지 않는 자리\"로 본다. 안정 우선의 손 — 다만 결정적 충격을 만들 카드를 자기 손에 쥐지 않는 판단.",
          "You see the new weapon not as a breaker but as a place that does not break. The hand that prefers stability — though it keeps no card for the decisive shock.",
        ),
      },
      {
        id: "ram",
        label: L("적 사령선·기함을 돌격해 부순다", "Ram the flagship — break the enemy's head"),
        reasoning: L(
          "와키자카의 기함이 무너지면 일본 함대 전체가 흔들린다. 신무기의 가장 강한 일.",
          "Smash Wakizaka's flagship and the whole fleet wavers. The new weapon's strongest task.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "사천 해전(5월 29일)의 기록 — 거북선이 사령선을 직접 부숴 적 진형이 무너졌다. 같은 효과를 한산도에서 노릴 수 있으나, 와키자카는 사천 적장보다 빠르게 도주.",
          "At Sacheon (5/29) the turtle ship broke a flagship and the formation collapsed. Repeatable here — though Wakizaka, unlike Sacheon's commander, fled faster.",
        ),
        judgment: L(
          "당신은 신무기를 가장 위험한 자리에 둔다. 결정적 충격의 손 — 사람의 머리를 노리고 진형 전체를 그 위에 놓는 직관.",
          "You put the new weapon at the most dangerous place. The hand of decisive shock — aiming at the head and laying the whole formation upon it.",
        ),
      },
      {
        id: "split",
        label: L("측면 호위 1척 + 돌격 2척으로 분리 운용", "Split — one escort, two for the strike"),
        reasoning: L(
          "균형. 한쪽이 실패해도 다른 쪽이 받쳐준다.",
          "Balance. If one task fails, the other carries.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
          { axis: "AGG", weight: 1 },
        ],
        shadowOutcome: L(
          "이순신의 실제 운용에 가장 가까운 안. 난중일기는 \"귀선이 적진 한가운데에 들어 천지현황 사방으로 발사\"라 적었다 — 본대 호위와 돌격을 함께 수행.",
          "Closest to Yi's actual deployment. The Nanjung Ilgi records that the turtle ships \"entered the heart of the enemy line and fired in all four directions\" — escort and strike at once.",
        ),
        judgment: L(
          "당신은 한 자원에 두 임무를 묶을 줄 안다. 분할의 직관 — 모든 결정을 한 점에 싣지 않는 사람의 사고.",
          "You can yoke two tasks to one resource. The intuition of division — the mind that does not load every decision onto a single point.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "reserve",
        label: L("후방 예비로 둔다", "Hold them in reserve at the rear"),
        reasoning: L(
          "결정적 순간에 투입한다. 신무기 3척을 모두 잃을 위험을 분산.",
          "Send them in at the decisive moment. Spread the risk of losing all three at once.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "이민웅(2004)은 \"한산도의 결정적 순간은 진형 형성 직후\"라고 본다. 예비 운용은 결정적 순간을 놓친 후 투입되어 격침수가 30~35척 수준에 그쳤을 것.",
          "Lee (2004) argues the decisive instant at Hansando came at the moment the formation closed. A reserve commitment arrives too late — kill total likely 30–35.",
        ),
        judgment: L(
          "당신은 신무기를 마지막 카드처럼 아낀다. 자원 보존의 손 — 다만 결정적 순간이 자기를 기다려 주지 않는다는 것을 알아야 하는 판단.",
          "You hoard the new weapon as a last card. The hand of conservation — though it must know the decisive moment does not wait.",
        ),
      },
    ],
    commanderActual: L(
      "이순신은 거북선을 본대 호위와 적진 돌격에 함께 투입했다. 난중일기 7월 8일은 \"귀선이 적진 한가운데에 들어 사방으로 발사하니 적이 어쩔 줄 몰랐다\"고 적는다. 거북선 3척은 모두 무사했다 (이충무공전서 권2).",
      "Yi used the turtle ships both as escort and as point of attack. Nanjung Ilgi for 7/8 records: \"the turtle ships entered the very heart of the enemy line and fired on all four sides; the enemy did not know what to do.\" All three came through unharmed (Yi Chungmugong Jeonseo, vol. 2).",
    ),
    sources: L(
      "출처: 난중일기 임진년 7월 8일 · 이충무공전서 권10 \"귀선도설\" · 김일환 『이순신과 임진왜란』 · Hawley, The Imjin War (2005) pp. 198–202 · Turnbull, Samurai Invasion (2002).",
      "Sources: Nanjung Ilgi, 7/8 Imjin; Yi Chungmugong Jeonseo vol. 10, \"Gwiseondoseol\"; Kim Il-hwan, Yi Sun-sin and the Imjin War; Hawley (2005), pp. 198–202; Turnbull, Samurai Invasion (2002).",
    ),
  },

  {
    id: "pursuit",
    index: 4,
    era: L("1592년 7월 8일 일몰", "Sunset, July 8, 1592"),
    location: L("한산도 앞바다 — 학살이 끝난 자리", "Open sea off Hansando — the killing-ground"),
    scene: L(
      "47척 격침, 12척 나포. 일본 측 패잔 함선 14척 정도가 견내량 북쪽·외해로 흩어져 도주한다. 와키자카는 작은 배로 갈아타고 김해 방향으로 빠졌다. 우리 함대는 손실은 미미하지만 화약·식수가 절반으로 줄었다. 추격할 것인가, 거둘 것인가.",
      "Forty-seven sunk, twelve taken. About fourteen surviving Japanese ships scatter — north of the strait, out to open sea. Wakizaka has changed to a small boat and fled toward Gimhae. Our losses are negligible, but powder and water are halved. Pursue, or break off?",
    ),
    briefing: [
      {
        label: L("우리 상태 (난중일기 7월 8일)", "Our state (Nanjung Ilgi, 7/8)"),
        value: L(
          "전사·실종 19, 부상 110여. 함선 손실 0. 화약·화살·식수 절반.",
          "Killed/missing 19, wounded ~110. Ships lost: 0. Powder, arrows, and water reduced by half.",
        ),
      },
      {
        label: L("적 잔여", "Enemy remnants"),
        value: L(
          "패잔 약 14척. 와키자카는 김해 방면으로. 부산 본진에는 구키·가토 휘하 함대 40척 이상이 남아 있다.",
          "About 14 surviving ships; Wakizaka heading toward Gimhae. The main Japanese base at Busan still holds 40+ under Kuki and Kato.",
        ),
      },
      {
        label: L("부산까지", "Distance to Busan"),
        value: L(
          "약 80~100km. 강행하면 하루 반. 야간 항행은 위험.",
          "80–100 km — a day and a half at forced pace. Night sailing is dangerous.",
        ),
      },
      {
        label: L("학자 견해 (Hawley 2005, 이민웅 2004)", "Scholarly views (Hawley 2005, Lee 2004)"),
        value: L(
          "Hawley는 \"부산 추격은 보급 없이 무리\"로 본다. 이민웅도 \"제해권 확보가 끝났으므로 결판의 압박은 풀렸다\"고 평가.",
          "Hawley judges a Busan pursuit was \"impossible without supply.\" Lee Min-ung notes that with sea command secured, the pressure for a finishing blow was already off.",
        ),
      },
    ],
    prompt: L("결판을 어디까지 끌고 갈 것인가?", "How far do you push this victory?"),
    choices: [
      {
        id: "to-busan",
        label: L("부산 본진까지 추격해 일본 수군 전체를 친다", "Pursue all the way to Busan, finish the entire fleet"),
        reasoning: L(
          "마하르발의 길. 다시 오지 않을 기회. 이번에 부산을 부수면 도요토미의 수륙합공 자체가 끝난다.",
          "Maharbal's road. The window will not open again. Break Busan and Toyotomi's land-sea linkup is finished.",
        ),
        tags: [
          { axis: "AGG", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "CAU", weight: -2 },
        ],
        shadowOutcome: L(
          "Hawley(2005, p. 202)는 \"보급 부재로 부산 외항에서 며칠 머무르다 후퇴, 그 사이 구키·가토 함대와 충돌해 한산도 전과의 일부를 토해낼 위험\"으로 본다. 1593년 부산포 해전에서 실제로 보급 한계가 드러났다.",
          "Hawley (2005, p. 202): without supply you camp off Busan a few days, then retreat — possibly clashing with Kuki and Kato and giving back part of the Hansando gain. The 1593 Busan engagement later showed those limits in fact.",
        ),
        judgment: L(
          "당신은 한 번 열린 창을 두 번 보지 않는다. 결정적 한 방의 손 — 다만 자기 화약이 그 결단까지 닿는지를 묻는 판단.",
          "You don't look twice at an opened window. The hand of the decisive blow — though it must ask whether your own powder reaches that far.",
        ),
      },
      {
        id: "to-strait-mouth",
        label: L("견내량 외해까지만 잔당을 토벌한다", "Mop up to the strait's mouth — no farther"),
        reasoning: L(
          "오늘의 결판은 오늘의 적까지. 부산은 다음 결정.",
          "Today's victory ends with today's enemy. Busan is the next decision.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "이순신의 실제 운용. 7월 9일 견내량 외해에서 잔당을 정리한 뒤 회군. 9일 후 안골포에서 구키·가토 함대를 별도 결전으로 격파 (이충무공전서 권2 \"안골포파왜병장\").",
          "Yi's actual handling. Cleared remnants outside the strait on 7/9, then withdrew. Nine days later he met Kuki and Kato in a separate decisive battle at Angolpo (Yi Chungmugong Jeonseo vol. 2, \"Angolpo Pawaebyeong-jang\").",
        ),
        judgment: L(
          "당신은 결판을 자기 시계 안에서 끊는다. 절제와 공격을 같이 쥐는 손 — 다음 결정을 위해 오늘의 결정을 끝내는 판단력.",
          "You end the decision inside your own clock. The hand that holds restraint and attack together — the judgment that finishes today's call so the next can be made.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "withdraw",
        label: L("즉시 회군해 보급을 확보한다", "Break off at once and reprovision"),
        reasoning: L(
          "오늘의 결과는 충분하다. 함대를 온전히 보전해야 다음 결전이 가능하다.",
          "Today's result is enough. The next battle requires the fleet intact.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "DIP", weight: 1 },
          { axis: "AGG", weight: -1 },
        ],
        shadowOutcome: L(
          "노영구 외(2012)는 즉시 회군은 잔당 14척이 외해로 빠져 다음 작전(안골포)의 부담을 키웠을 것으로 본다. 안골포 결전 규모가 더 커진다.",
          "Noh et al. (2012) argue an immediate withdrawal lets all 14 remnants reach open water, swelling the burden on the next operation at Angolpo.",
        ),
        judgment: L(
          "당신은 자기 자원을 가장 먼저 본다. 자원 우선의 손 — 다만 적의 잔여가 다음 결정의 짐이 된다는 것을 살피는 판단.",
          "You see your own resources first. The hand of resource-first — though it must reckon that the enemy's leftovers become the next decision's load.",
        ),
      },
      {
        id: "blockade-route",
        label: L("잔여 함대의 항로를 봉쇄해 천천히 토벌한다", "Seal the survivors' route, mop up at leisure"),
        reasoning: L(
          "부산까지 가지 않되, 잔여를 그냥 두지도 않는다. 항로를 막아 며칠에 걸쳐 토벌.",
          "Not to Busan, but not letting them go either. Seal the lane and clear them over days.",
        ),
        tags: [
          { axis: "CAU", weight: 1 },
          { axis: "INT", weight: 1 },
          { axis: "DIP", weight: 1 },
        ],
        shadowOutcome: L(
          "이민웅(2004)은 \"통영 인근 봉쇄는 가능하나 함대 분산이 불가피하고, 그 사이 구키·가토 본대가 합류 시 봉쇄선이 역으로 협공\"이라 평가.",
          "Lee (2004): a Tongyeong-area blockade is feasible but disperses the fleet — and if Kuki and Kato arrive in the interim, the blockade line itself gets pinched.",
        ),
        judgment: L(
          "당신은 결판과 회군 사이에 \"천천히 마무리\"의 길을 둔다. 시간으로 결판을 짜는 손 — 다만 적의 후속이 같은 시간을 쓴다는 것을 살펴야 하는 판단.",
          "You set a slow-finish road between decision and withdrawal. The hand that paces the kill in time — though it must watch that the enemy's reserves use the same time.",
        ),
      },
    ],
    commanderActual: L(
      "이순신은 부산까지 추격하지 않았다. 7월 9일 견내량 외해에서 잔당을 정리한 뒤 한산도에 일시 정박, 화약·식수를 보충했다. 9일 후 안골포에서 구키·가토 휘하 일본 함대 42척을 별도 결전으로 격파했다 (이충무공전서 권2 \"안골포파왜병장\"; 이민웅 2004 pp. 178–185).",
      "Yi did not pursue to Busan. On 7/9 he cleared remnants outside the strait, anchored briefly off Hansando, and replenished. Nine days later, at Angolpo, he broke 42 Japanese ships under Kuki and Kato in a separate decisive battle (Yi Chungmugong Jeonseo vol. 2, \"Angolpo Pawaebyeong-jang\"; Lee 2004, pp. 178–185).",
    ),
    sources: L(
      "출처: 난중일기 임진년 7월 8~10일 · 이충무공전서 권2 \"견내량파왜병장\"·\"안골포파왜병장\" · 이민웅(2004) pp. 175–185 · Hawley(2005) pp. 200–205.",
      "Sources: Nanjung Ilgi, 7/8–10 Imjin; Yi Chungmugong Jeonseo vol. 2, \"Gyeonnaeryang\" and \"Angolpo Pawaebyeong-jang\"; Lee (2004), pp. 175–185; Hawley (2005), pp. 200–205.",
    ),
  },

  {
    id: "after",
    index: 5,
    era: L("1592년 가을 — 한산도 진영", "Autumn 1592 — Hansando station"),
    location: L("한산도 통제영", "Yi's command station, Hansando"),
    scene: L(
      "한산도 승전 이후 조정의 분위기가 바뀌었다. 류성룡이 도체찰사로서 이순신을 \"수륙 양면을 모두 맡길 인재\"로 선조에게 천거한다는 소문이 들려온다. 한편 원균은 함대 지휘권을 \"경상도가 가져야 한다\"고 주장한다. 도원수직 — 육군 최고 사령관 — 의 권유가 비공식적으로 들어온다. 답을 정해야 한다.",
      "After Hansando, the political weather has shifted. Word arrives that the Chief Inspector Yu Seong-ryong has been recommending Yi to the king as \"a man fit for both land and sea.\" Meanwhile Won Gyun argues fleet command should sit with Gyeongsang Province. An informal offer — Field Marshal of the Land Armies — arrives. The answer must be set.",
    ),
    briefing: [
      {
        label: L("정사 기록 (선조실록 권28)", "Court record (Seonjo Sillok, vol. 28)"),
        value: L(
          "1592년 8월 선조는 이순신에게 정2품 정헌대부를 가자. 1593년 8월 \"삼도수군통제사\" 신설로 그를 임명. 도원수직은 권율(1593년 4월).",
          "In the 8th month of 1592 the king elevated Yi to senior 2nd rank (Jeongheon-daebu). In the 8th month of 1593 the new post of Samdo Sugun Tongjesa was created for him. The Field Marshal post went to Gwon Yul (4th month, 1593).",
        ),
      },
      {
        label: L("류성룡의 평 (징비록 권1)", "Yu Seong-ryong's view (Jingbirok, vol. 1)"),
        value: L(
          "\"순신은 바다에 두어야 한다. 육지에 올리면 그 자리는 반드시 누군가 흔든다.\"",
          "\"Yi must be kept at sea. Put him on land and someone will shake the seat from under him.\"",
        ),
      },
      {
        label: L("원균과의 갈등", "Friction with Won Gyun"),
        value: L(
          "옥포 이후 공적 분배·지휘권 갈등 지속. 1597년 원균이 통제사를 대신하면서 칠천량 패전. 이순신과의 결정적 차이는 \"공격 시점 판단\".",
          "Disputes over credit and command persisted from Okpo onward. In 1597 Won, replacing Yi, would lose the entire fleet at Chilcheollyang. The decisive difference between them was timing of attack.",
        ),
      },
      {
        label: L("육군 상황", "Land army"),
        value: L(
          "권율이 행주산성(1593년 2월)에서 일본군 격퇴 직전. 이몽학·정인홍 등 의병 지휘 정착. 이순신이 육군에 가도 자리는 권율 위.",
          "Gwon Yul is on the eve of Haengju Fortress (2nd month, 1593). Civilian militias under Yi Mong-hak and Jeong In-hong are settling. If Yi moves to land, his seat would sit above Gwon's.",
        ),
      },
    ],
    prompt: L("도원수직을 어떻게 답할 것인가?", "How do you answer the offer of Field Marshal?"),
    choices: [
      {
        id: "stay-navy",
        label: L("수군 사령관에 머문다", "Stay with the navy"),
        reasoning: L(
          "내 자리가 어디인지 안다. 바다를 떠나면 일본의 수륙합공이 다시 가능해진다.",
          "I know where my seat is. Leave the sea and Toyotomi's land-sea linkup becomes possible again.",
        ),
        tags: [
          { axis: "CAU", weight: 2 },
          { axis: "INT", weight: 1 },
          { axis: "DIP", weight: -1 },
        ],
        shadowOutcome: L(
          "이순신의 실제 선택. 1593년 8월 신설된 삼도수군통제사로 임명, 한산도에 통제영 설치. 명량(1597) 승전의 기반이 된다 (선조실록 권41; 이민웅 2004 pp. 220–230).",
          "Yi's actual choice. In the 8th month of 1593 the new Samdo Sugun Tongjesa post was created for him; the command station moved to Hansando — the foundation that would make Myeongnyang (1597) possible (Seonjo Sillok vol. 41; Lee 2004, pp. 220–230).",
        ),
        judgment: L(
          "당신은 자기 자리에서 끝까지 버틸 줄 안다. 자기 무기가 가장 잘 닿는 곳을 떠나지 않는 손 — 정치판의 유혹을 군사적 판단으로 끊는 사고.",
          "You can hold your own seat to the end. The hand that does not leave the place where its weapon reaches best — the mind that cuts through political flattery with a soldier's judgment.",
        ),
        isCommanderChoice: true,
      },
      {
        id: "take-marshal",
        label: L("도원수직을 받아 육군 전체를 지휘한다", "Take the Marshal post — command all land armies"),
        reasoning: L(
          "한산도의 공이 정점이라면, 다음은 큰 그림이다. 수륙 전체를 통합하면 임진왜란을 더 빨리 끝낼 수 있다.",
          "If Hansando is the peak, the next move is the larger picture. Unify land and sea and the whole war can end sooner.",
        ),
        tags: [
          { axis: "AGG", weight: 1 },
          { axis: "DIP", weight: 1 },
          { axis: "INT", weight: -1 },
        ],
        shadowOutcome: L(
          "류성룡 『징비록』은 \"순신이 육지로 올랐으면 바다는 원균에게 맡겨졌을 것\"이라 본다. 칠천량 패전이 1593년에 일어났을 가능성. 김일환은 \"임진왜란의 결정적 패배가 4년 앞당겨진다\"고 평가.",
          "Yu's Jingbirok holds that had Yi moved to land, the sea would have passed to Won Gyun — making a Chilcheollyang-style disaster plausible already in 1593. Kim Il-hwan calls it \"the decisive defeat of the Imjin War, brought four years forward.\"",
        ),
        judgment: L(
          "당신은 자기 자리를 큰 그림 위에 올려놓는다. 통합의 손 — 다만 자기 무기가 새 자리에서도 같은 무기인지를 묻지 않는 판단.",
          "You set your seat above the big picture. The hand of unification — though it does not ask whether your weapon is still the same weapon in the new seat.",
        ),
      },
      {
        id: "decline-and-resign",
        label: L("공을 부하에 돌리고 사직한다", "Pass the credit to subordinates and step aside"),
        reasoning: L(
          "큰 공 뒤에 큰 시기가 따른다. 한 발 물러서면 정치판이 나를 적으로 만들지 않는다.",
          "Great merit draws great envy. Step back and the court does not make me an enemy.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "CAU", weight: 1 },
          { axis: "AGG", weight: -2 },
        ],
        shadowOutcome: L(
          "선조실록은 \"조정의 시기가 1597년 백의종군의 직접 원인\"이라 적는다. 1592년 시점에 사직한다면 임란 후반의 결전(명량·노량)이 모두 사라진다 — 노영구 외(2012)는 \"수군 자체가 무너졌을 것\"으로 본다.",
          "The Seonjo Sillok records that court envy was the direct cause of Yi's 1597 demotion to the ranks. A resignation already in 1592 erases Myeongnyang and Noryang — Noh et al. (2012) judge \"the navy itself would have collapsed.\"",
        ),
        judgment: L(
          "당신은 시기 앞에서 자기를 비운다. 정치적 자기 보호의 손 — 다만 그 자리가 비면 누가 채울지를 살펴야 하는 판단.",
          "You empty yourself before envy. The hand of political self-defense — though it must ask who would fill that seat once vacated.",
        ),
      },
      {
        id: "nominal-marshal",
        label: L("명목상 도원수 + 실질 바다 지휘로 양립한다", "Nominal Marshal — but real command stays at sea"),
        reasoning: L(
          "직책은 받되, 현장은 바다에 둔다. 정치적 영향력은 키우고 현장은 잃지 않는다.",
          "Take the title, keep the deck. Grow political reach without losing the line at sea.",
        ),
        tags: [
          { axis: "DIP", weight: 2 },
          { axis: "AGG", weight: 1 },
          { axis: "INT", weight: 1 },
        ],
        shadowOutcome: L(
          "징비록은 류성룡 자신이 \"두 자리를 한 사람에 묶는 것은 결국 두 자리를 잃는 길\"이라 적었다. 학자(이민웅 2004; 김일환)는 \"명목 도원수는 권율과의 지휘권 충돌을 강제\"한다고 본다.",
          "Yu himself wrote in Jingbirok that \"binding two seats to one man is the road to losing both.\" Scholars (Lee 2004; Kim Il-hwan) judge that a nominal Marshal forces a command clash with Gwon Yul.",
        ),
        judgment: L(
          "당신은 직책과 현장을 동시에 쥐려 한다. 외교와 현장을 같이 묶는 손 — 다만 두 자리가 한 사람에게 모두 머무르지는 않는다는 것을 살피는 판단.",
          "You try to hold both the title and the deck. The hand that yokes diplomacy to the front line — though it must watch that two seats rarely stay seated under one man.",
        ),
      },
    ],
    commanderActual: L(
      "이순신은 수군에 머물렀다. 1593년 8월 조정은 그를 위해 \"삼도수군통제사\" 직책 자체를 신설했고, 그는 한산도에 통제영을 두고 명량(1597) · 노량(1598)으로 이어지는 작전 기반을 그곳에 만들었다. 도원수직은 같은 해 4월 권율에게 갔다 (선조실록 권41; 징비록 권1; 이민웅 2004 pp. 220–230).",
      "Yi stayed with the navy. In the 8th month of 1593 the court created the new post of Samdo Sugun Tongjesa specifically for him; he placed the command station at Hansando and built there the operational base that would carry through to Myeongnyang (1597) and Noryang (1598). The Field Marshal post went to Gwon Yul that 4th month (Seonjo Sillok vol. 41; Jingbirok vol. 1; Lee 2004, pp. 220–230).",
    ),
    sources: L(
      "출처: 선조실록 권25–28, 권41 · 류성룡 『징비록』 권1 · 이충무공전서 \"행록\" · 이민웅 『임진왜란 해전사』(2004) pp. 220–230 · 노영구 외 『한국군사사』(2012) 제3권 · 김일환 『이순신과 임진왜란』.",
      "Sources: Seonjo Sillok vols. 25–28 and 41; Yu Seong-ryong, Jingbirok vol. 1; Yi Chungmugong Jeonseo, \"Haengnok\"; Lee (2004), pp. 220–230; Noh et al. (2012), vol. 3; Kim Il-hwan, Yi Sun-sin and the Imjin War.",
    ),
  },
];

export const HANSANDO_ARCHETYPES: Archetype[] = [
  {
    id: "yi-sunsin",
    name: L("이순신형 — 자기 자리에서 끝까지 버티는 지휘관", "The Yi Sun-sin — Hold Your Own Seat to the End"),
    signature: L(
      "당신은 한산도 앞바다로 적을 끌어내는 손이다.",
      "You are the hand that draws the enemy out into the open water off Hansando.",
    ),
    desc: L(
      "직관과 신중을 함께 쥔 드문 지휘관. 자기 무기의 사거리를 정확히 알고, 그 사거리 안에서만 결판을 본다. 정치판의 유혹에 흔들리지 않으며 자기 자리에서 끝까지 버틴다.",
      "A rare hand that holds intuition and caution together. Knows exactly the reach of its own weapon and decides only inside that reach. Refuses political flattery and holds its own seat to the end.",
    ),
    strengths: [
      L("자기 무기가 가장 잘 닿는 자리로 적을 옮긴다", "Moves the enemy to the place its weapon reaches best"),
      L("결판을 자기 시계 안에서 끊는다", "Ends the decision inside its own clock"),
      L("정치판의 유혹을 군사적 판단으로 끊는다", "Cuts political flattery with a soldier's judgment"),
    ],
    watchOut: [
      L("자기 자리를 지키느라 큰 그림에서 한 수를 비울 수 있다", "May leave a move blank on the larger board to keep its seat"),
      L("외교적 우군을 충분히 만들지 못한다", "Builds too few diplomatic allies"),
      L("시기와 모함이 군사적 결정의 비용을 키운다", "Envy and slander raise the price of every military call"),
    ],
    pairsWithId: "ryu-seongryong",
    clashesWithId: "won-gyun",
    profile: { AGG: 0, CAU: 1.5, DIP: 0, INT: 1.5 },
  },
  {
    id: "won-gyun",
    name: L("원균형 — 용맹이 판단을 앞서는 지휘관", "The Won Gyun — Courage Before Judgment"),
    signature: L(
      "당신은 견내량 안에서 즉시 적을 치자고 외치는 손이다.",
      "You are the hand that cries to strike at once inside the narrows.",
    ),
    desc: L(
      "공격성과 직관이 판단의 무게를 앞선다. 기다림을 비겁이라 부르고, 좁은 곳에서도 결판을 본다. 1597년 칠천량의 길 — 용맹은 진짜이지만 자기 무기의 사거리를 잊는다.",
      "Aggression and instinct outrun judgment. Calls patience cowardice and seeks decision even in tight water. The road to Chilcheollyang in 1597 — courage real, but the reach of its own weapon forgotten.",
    ),
    strengths: [
      L("주저 없이 결전을 받아들인다", "Accepts the decisive fight without hesitation"),
      L("아군 사기가 흔들릴 때 앞장선다", "Steps forward when morale wavers"),
      L("적의 의지에 자기 의지로 정면 응한다", "Meets the enemy's will with its own will, head-on"),
    ],
    watchOut: [
      L("자기 무기의 사거리를 잊는다", "Forgets the reach of its own weapon"),
      L("좁은 자리에서도 결판을 보려 한다", "Seeks decision even in places too tight for it"),
      L("동료 지휘관을 경쟁자로 본다 — 칠천량의 길", "Sees fellow commanders as rivals — the road to Chilcheollyang"),
    ],
    pairsWithId: "gwon-yul",
    clashesWithId: "yi-sunsin",
    profile: { AGG: 2, CAU: -1.5, DIP: -1, INT: 0.5 },
  },
  {
    id: "gwon-yul",
    name: L("권율형 — 정면에서 시간을 버는 지휘관", "The Gwon Yul — Buy Time on the Front Line"),
    signature: L(
      "당신은 행주산성에서 적을 막아 시간을 버는 손이다.",
      "You are the hand that holds Haengju and buys time at the wall.",
    ),
    desc: L(
      "공격성과 신중을 같이 쥔 육군 지휘관. 결판이 아니라 시간을 자기 무기로 본다. 정면에서 무너지지 않는 자리를 만들고, 그 자리가 적의 시간을 깎는다.",
      "An army commander who holds aggression and caution at once. Not decision but time is the weapon. Builds a place on the front line that does not break, and lets that place erode the enemy's clock.",
    ),
    strengths: [
      L("정면에서 무너지지 않는 자리를 만든다", "Builds a place on the front that does not break"),
      L("적의 보급·시간을 자기 자원으로 깎는다", "Carves the enemy's supply and clock into its own resource"),
      L("동료 지휘관과 직책 충돌 없이 협력한다", "Cooperates with fellow commanders without title clash"),
    ],
    watchOut: [
      L("결정적 한 방을 자기 손에 두지 않는다", "Keeps no decisive single blow in its own hand"),
      L("정면 방어가 길어지면 자원이 먼저 무너진다", "If frontal defense drags, resources break before the line does"),
      L("우회·기습의 시야가 좁다", "Narrow vision for detour and ambush"),
    ],
    pairsWithId: "yi-sunsin",
    clashesWithId: "toyotomi",
    profile: { AGG: 1, CAU: 1.5, DIP: 0, INT: -0.5 },
  },
  {
    id: "ryu-seongryong",
    name: L("류성룡형 — 정치판에서 장수를 살리는 지휘관", "The Yu Seong-ryong — Keep the General Alive in Court"),
    signature: L(
      "당신은 \"순신을 바다에 두어야 한다\"고 적는 손이다.",
      "You are the hand that writes: \"Yi must be kept at sea.\"",
    ),
    desc: L(
      "외교와 신중을 함께 쥔 정치형 사령관. 칼이 아닌 자리 배치로 전쟁을 운영하며, 장수의 자리를 정치판의 칼날로부터 지킨다. 『징비록』의 손.",
      "A diplomatic strategist holding caution and statecraft together. Runs the war by who-sits-where rather than by sword, and shields the general from the court's blades. The hand that wrote Jingbirok.",
    ),
    strengths: [
      L("장수의 자리를 정치판으로부터 지킨다", "Shields the general's seat from the court"),
      L("외교·인사·보급을 한 손에 묶는다", "Binds diplomacy, personnel, and supply in one hand"),
      L("전쟁의 큰 그림을 글로 남긴다", "Leaves the big picture of the war in writing"),
    ],
    watchOut: [
      L("현장 결정에는 한 발 늦다", "One step behind on the deck"),
      L("정치판의 적이 자기 자리에 직접 닿는다", "The court's enemies reach its own seat directly"),
      L("자기 보호의 손이 사라지면 장수가 흔들린다", "Once the protective hand is gone, the general wavers"),
    ],
    pairsWithId: "yi-sunsin",
    clashesWithId: "toyotomi",
    profile: { AGG: -1, CAU: 1.5, DIP: 2, INT: 0 },
  },
  {
    id: "toyotomi",
    name: L("도요토미형 — 압도적 의지로 판을 다시 짜는 지휘관", "The Toyotomi — Will That Re-Draws the Board"),
    signature: L(
      "당신은 수륙합공으로 조선 전체를 한 번에 짜내는 손이다.",
      "You are the hand that tries to wring all of Joseon at once with a single land-sea grasp.",
    ),
    desc: L(
      "공격성과 직관을 극단으로 묶은 적장의 손. 한 번에 모든 것을 끝내려 하며, 자기 의지를 자원처럼 쓴다. 임진왜란을 일으킨 도요토미 히데요시의 사고 — 압도적이지만 자기 무기의 한계를 인정하지 않는다.",
      "Aggression and intuition bound to their extremes — the enemy commander's hand. Tries to end everything at one stroke and spends will itself as a resource. Toyotomi Hideyoshi's mind, the one that began the Imjin War — overwhelming, but unwilling to admit the limits of its own weapon.",
    ),
    strengths: [
      L("판 자체를 다시 짜려는 결단의 무게", "The decisiveness to re-draw the board itself"),
      L("자기 의지를 자원으로 쓴다", "Spends its own will as a resource"),
      L("한 번에 끝내는 결판을 두려워하지 않는다", "Does not fear an all-at-once decision"),
    ],
    watchOut: [
      L("자기 무기의 한계를 인정하지 않는다", "Will not admit the limits of its own weapon"),
      L("바다와 육지를 같은 자원으로 쓰려 한다", "Tries to spend sea and land as a single resource"),
      L("이순신 한 사람이 전 작전을 무너뜨릴 수 있다", "A single Yi Sun-sin can collapse the whole plan"),
    ],
    pairsWithId: "won-gyun",
    clashesWithId: "yi-sunsin",
    profile: { AGG: 2, CAU: -1.5, DIP: -1, INT: 1 },
  },
  {
    id: "balanced-admiral",
    name: L("균형 사령관형 — 어느 한 면에도 치우치지 않는다", "Balanced Admiral — No Single Tilt"),
    signature: L(
      "당신의 무기는 결정 자체가 아니라, 매번 다른 결정을 내리는 적응력이다.",
      "Your weapon is not any single decision — it is the hand that picks a new one each time.",
    ),
    desc: L(
      "공격성·신중·외교·직관 어느 축에도 크게 기울지 않는다. 견내량과 한산도, 화포와 거북선, 바다와 정치판 어디서도 적당한 답을 찾는다 — 결정 자체보다 적응을 무기로 삼는다.",
      "Tilts on no single axis. Finds an adequate answer in the strait or the open sea, with cannon or with turtle ships, on the deck or in the court — adaptation itself is the weapon.",
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
    pairsWithId: "yi-sunsin",
    clashesWithId: "toyotomi",
    profile: { AGG: 0.5, CAU: 0.5, DIP: 0.5, INT: 0.5 },
  },
];

export function getArchetypeById(id: string): Archetype | undefined {
  return HANSANDO_ARCHETYPES.find((a) => a.id === id);
}

export function encodePicks(picks: Record<string, string>): string {
  return encodePicksFor(picks, HANSANDO_DILEMMAS);
}

export function decodePicks(
  p: string | null | undefined,
): Record<string, string> | null {
  return decodePicksFor(p, HANSANDO_DILEMMAS);
}

export function evaluate(picks: Record<string, string>): EvalResult {
  return evaluatePicks(picks, HANSANDO_DILEMMAS, HANSANDO_ARCHETYPES);
}
