import {
  FB_POSITIONS,
  FB_QUESTIONS,
  FB_STYLES,
  FB_STYLES_EN,
  FB_STYLE_TIE,
  type FbPlayer,
  type FootballTestConfig,
} from "./engine";

// 글로벌 축구선수 성향 테스트 — 5포지션 × 5스타일 = 25명. 국가별 국기.
// 가장 원하는 결과(메시 D·호날두 A 등)를 가장 빛나는 축에 배치 = "당첨 결과"로 공유 유발.
// ko/en 양쪽 지원 (월드컵 시즌 해외 r/soccer 공략). 영어는 nameEn/descEn/tagsEn + config en 필드.
const PLAYERS: Record<string, FbPlayer> = {
  // ── GK ──
  neuer: { key: "neuer", name: "노이어", nameEn: "Neuer", pos: "gk", style: "A", flag: "de", jersey: "1", desc: "현대 골키퍼의 패러다임을 바꾼 '스위퍼 키퍼'. 골문 밖까지 나와 수비를 지휘하는 공격적 골키퍼의 정점.", descEn: "The keeper who rewrote the position. Storms off his line and commands the defense like a modern sweeper — the original of his kind.", tags: ["#스위퍼키퍼", "#현대GK", "#지휘관", "#공격적"], tagsEn: ["#SweeperKeeper", "#ModernKeeper", "#Commander", "#Aggressive"] },
  courtois: { key: "courtois", name: "쿠르투아", nameEn: "Courtois", pos: "gk", style: "B", flag: "be", jersey: "1", desc: "거대한 체구와 완벽한 위치 선정. 큰 무대에서도 흔들림 없는 안정의 끝판왕 수문장.", descEn: "A towering frame and flawless positioning. Unshakable on the biggest stage — the gold standard of a steady, classic keeper.", tags: ["#거미손", "#안정감", "#위치선정", "#끝판왕"], tagsEn: ["#SafeHands", "#Composed", "#Positioning", "#Rock"] },
  emartinez: { key: "emartinez", name: "E.마르티네스", nameEn: "Emiliano Martínez", pos: "gk", style: "C", flag: "ar", jersey: "23", desc: "2022 월드컵 우승의 승부차기 영웅. 큰 경기일수록 강해지는 멘탈 괴물, 빅매치 클러치 키퍼.", descEn: "The penalty-shootout hero of the 2022 World Cup. When the stakes are highest, he turns ice-cold — the ultimate big-game keeper.", tags: ["#월드컵우승", "#PK영웅", "#멘탈괴물", "#클러치"], tagsEn: ["#WorldCupWinner", "#PenaltyHero", "#IceCold", "#Clutch"] },
  ederson: { key: "ederson", name: "에데르송", nameEn: "Ederson", pos: "gk", style: "D", flag: "br", jersey: "12", desc: "발끝이 미드필더급인 빌드업의 혁명가. 정확한 롱패스로 공격을 시작하는 창의적 키퍼.", descEn: "A build-up revolution with a midfielder's feet. He starts attacks with pinpoint long passes — the creative modern keeper.", tags: ["#빌드업", "#롱패스", "#창의적", "#모던키퍼"], tagsEn: ["#BuildUp", "#LaserPass", "#Creative", "#ModernKeeper"] },
  donnarumma: { key: "donnarumma", name: "도나룸마", nameEn: "Donnarumma", pos: "gk", style: "E", flag: "it", jersey: "21", desc: "어린 나이부터 골문을 책임진 거대한 일꾼. 묵묵히 선방을 쌓아 올린 차세대 수문장.", descEn: "A giant who's manned the goal since his teens. Quietly stacking up saves — the relentless next-gen wall.", tags: ["#차세대", "#선방머신", "#헌신", "#거인"], tagsEn: ["#NextGen", "#SaveMachine", "#Relentless", "#Giant"] },

  // ── CB ──
  vandijk: { key: "vandijk", name: "판데이크", nameEn: "Van Dijk", pos: "cb", style: "A", flag: "nl", jersey: "4", desc: "압도적인 피지컬과 리더십으로 수비를 지배하는 월드클래스 센터백. 그가 서면 뒷문이 잠긴다.", descEn: "Dominates defending through sheer presence and leadership. When he's on the pitch, the back door stays locked.", tags: ["#월드클래스", "#지배자", "#피지컬", "#리더"], tagsEn: ["#WorldClass", "#Dominant", "#Commander", "#Leader"] },
  rubendias: { key: "rubendias", name: "R.디아스", nameEn: "Rúben Dias", pos: "cb", style: "B", flag: "pt", jersey: "3", desc: "침착함과 완벽한 커버링의 교과서. 화려하지 않아도 가장 믿음직한 정통파 수비수.", descEn: "A textbook of composure and perfect covering. Not flashy — just the most dependable defender you can field.", tags: ["#침착함", "#커버링", "#안정감", "#교과서"], tagsEn: ["#Composed", "#Covering", "#Dependable", "#Textbook"] },
  ramos: { key: "ramos", name: "라모스", nameEn: "Sergio Ramos", pos: "cb", style: "C", flag: "es", jersey: "4", desc: "결정적인 순간 골까지 넣는 우승 청부사. 빅매치에서 가장 빛난 수비 리더.", descEn: "The trophy-hunter who scores in the biggest moments. A defensive leader who shines brightest when it matters most.", tags: ["#우승청부사", "#빅매치", "#리더십", "#투지"], tagsEn: ["#TrophyHunter", "#BigGame", "#Leader", "#Warrior"] },
  alaba: { key: "alaba", name: "알라바", nameEn: "Alaba", pos: "cb", style: "D", flag: "at", jersey: "15", desc: "수비부터 빌드업, 프리킥까지 다 되는 만능 테크니션. 영리하고 창의적인 멀티 수비수.", descEn: "Defending, build-up, free-kicks — he does it all. A smart, creative, do-everything defender.", tags: ["#만능", "#빌드업", "#프리킥", "#테크니션"], tagsEn: ["#DoItAll", "#BuildUp", "#FreeKick", "#Technician"] },
  varane: { key: "varane", name: "바란", nameEn: "Varane", pos: "cb", style: "E", flag: "fr", jersey: "4", desc: "월드컵과 챔스를 모두 들어 올린 우승의 사나이. 묵묵히 뒷선을 받치는 헌신의 수비수.", descEn: "A serial winner of World Cups and Champions Leagues. Quietly holds the back line together — the selfless one.", tags: ["#우승복", "#헌신", "#안정", "#빅이어"], tagsEn: ["#SerialWinner", "#Selfless", "#Composed", "#Reliable"] },

  // ── FB ──
  davies: { key: "davies", name: "데이비스", nameEn: "Alphonso Davies", pos: "fb", style: "A", flag: "ca", jersey: "19", desc: "치타 같은 스피드로 측면을 폭격하는 공격형 윙백. 한 번 가속하면 아무도 못 따라온다.", descEn: "Cheetah pace down the flank — an attacking wing-back who bombs forward. Once he hits top gear, no one catches him.", tags: ["#치타스피드", "#폭격기", "#공격적", "#윙백"], tagsEn: ["#CheetahPace", "#Flyer", "#Attacking", "#WingBack"] },
  walker: { key: "walker", name: "워커", nameEn: "Kyle Walker", pos: "fb", style: "B", flag: "eng", jersey: "2", desc: "엄청난 스피드와 노련함을 겸비한 안정의 수비수. 어떤 윙어도 막아내는 정통파 풀백.", descEn: "Blistering pace and tactical savvy — the full-back who locks down any winger and reads the game ahead.", tags: ["#스피드", "#노련함", "#안정감", "#철벽"], tagsEn: ["#Pace", "#Savvy", "#Steady", "#Lockdown"] },
  carvajal: { key: "carvajal", name: "카르바할", nameEn: "Carvajal", pos: "fb", style: "C", flag: "es", jersey: "2", desc: "챔피언스리그 결승에서 골을 넣는 빅매치 사나이. 우승을 밥 먹듯 한 클러치 풀백.", descEn: "The man who scores in Champions League finals. A clutch full-back who wins trophies for fun.", tags: ["#챔스결승골", "#우승머신", "#빅매치", "#클러치"], tagsEn: ["#FinalGoal", "#TrophyMachine", "#BigGame", "#Clutch"] },
  taa: { key: "taa", name: "알렉산더아놀드", nameEn: "Alexander-Arnold", pos: "fb", style: "D", flag: "eng", jersey: "66", desc: "풀백이 아니라 플레이메이커. 환상적인 킥과 패스로 공격을 설계하는 창의의 화신.", descEn: "Not just a full-back — a playmaker. He designs attacks with sensational passing and delivery.", tags: ["#플레이메이커", "#킥장인", "#창의적", "#어시스트"], tagsEn: ["#Playmaker", "#PingMaster", "#Creative", "#Assists"] },
  azpilicueta: { key: "azpilicueta", name: "아스필리쿠에타", nameEn: "Azpilicueta", pos: "fb", style: "E", flag: "es", jersey: "18", desc: "어느 자리든 완벽히 소화하는 헌신의 멀티 수비수. 팀을 위해 모든 걸 내준 캡틴.", descEn: "Plays any role to perfection — the selfless utility defender. A captain who gives everything for the team.", tags: ["#멀티", "#헌신", "#캡틴", "#성실"], tagsEn: ["#Utility", "#Selfless", "#Captain", "#Reliable"] },

  // ── MF ──
  bellingham: { key: "bellingham", name: "벨링엄", nameEn: "Bellingham", pos: "mf", style: "A", flag: "eng", jersey: "10", desc: "공수 양면을 지배하는 차세대 끝판왕. 결정적인 순간 골까지 넣는 공격적 미드필더.", descEn: "Dominates both boxes — the next-gen complete midfielder who pops up with decisive goals.", tags: ["#차세대황제", "#박스투박스", "#골까지", "#주도적"], tagsEn: ["#NextGenKing", "#BoxToBox", "#Goals", "#TakesCharge"] },
  rodri: { key: "rodri", name: "로드리", nameEn: "Rodri", pos: "mf", style: "B", flag: "es", jersey: "16", desc: "발롱도르를 거머쥔 중원의 지휘자. 보이지 않게 모든 걸 컨트롤하는 정통파 수비형 MF.", descEn: "A Ballon d'Or-winning midfield anchor. He runs the show from deep — pure class in possession, invisible until you need him.", tags: ["#발롱도르", "#중원지휘", "#안정", "#컨트롤타워"], tagsEn: ["#BallonDor", "#Conductor", "#Steady", "#ControlTower"] },
  modric: { key: "modric", name: "모드리치", nameEn: "Modrić", pos: "mf", style: "C", flag: "hr", jersey: "10", desc: "큰 경기마다 빛나는 중원의 마에스트로. 나이를 잊은 빅매치 플레이어.", descEn: "Midfield maestro who owns the big stage. Ageless elegance — he plays like time doesn't touch him.", tags: ["#마에스트로", "#빅매치", "#우아함", "#레전드"], tagsEn: ["#Maestro", "#BigGame", "#Elegant", "#Legend"] },
  debruyne: { key: "debruyne", name: "데 브라위너", nameEn: "De Bruyne", pos: "mf", style: "D", flag: "be", jersey: "17", desc: "세계 최고의 킬패스. 환상적인 시야와 킥으로 기회를 창조하는 창의의 대명사.", descEn: "The best killer pass in the world. A god's-eye view of the pitch and passes that thread the needle — pure football artistry.", tags: ["#킬패스", "#시야만렙", "#창조자", "#킥장인"], tagsEn: ["#KillerPass", "#VisionMax", "#Creator", "#PingMaster"] },
  casemiro: { key: "casemiro", name: "카세미루", nameEn: "Casemiro", pos: "mf", style: "E", flag: "br", jersey: "5", desc: "중원을 청소하는 헌신의 파수꾼. 궂은일을 도맡아 팀의 균형을 지키는 일꾼.", descEn: "The enforcer who does the dirty work so others don't have to. Shields the back line with pure grit — selfless and unbreakable.", tags: ["#중원청소기", "#헌신", "#밸런스", "#파수꾼"], tagsEn: ["#Enforcer", "#Selfless", "#Balance", "#Shield"] },

  // ── FW ──
  haaland: { key: "haaland", name: "홀란드", nameEn: "Haaland", pos: "fw", style: "A", flag: "no", jersey: "9", desc: "압도적인 피지컬과 스피드로 골문을 폭격하는 득점 기계. 페널티박스를 지배하는 차세대 골 괴물.", descEn: "A goal machine who bullies defenses with freakish size and speed. The box is his — the unstoppable next-gen striker.", tags: ["#득점기계", "#피지컬괴물", "#박스지배", "#차세대"], tagsEn: ["#GoalMachine", "#Beast", "#BoxDominator", "#NextGen"] },
  ronaldo: { key: "ronaldo", name: "호날두", nameEn: "Ronaldo", pos: "fw", style: "B", flag: "pt", jersey: "7", desc: "득점 기계 그 자체. 압도적인 자기관리와 결정력으로 한 시대를 지배한 GOAT급 공격수, CR7.", descEn: "Pure goal machine — obsessive dedication and ruthless finishing that ruled a generation. The GOAT. CR7.", tags: ["#CR7", "#득점기계", "#자기관리", "#GOAT"], tagsEn: ["#CR7", "#GoalMachine", "#Dedication", "#GOAT"] },
  lewandowski: { key: "lewandowski", name: "레반도프스키", nameEn: "Lewandowski", pos: "fw", style: "E", flag: "pl", jersey: "9", desc: "끊임없는 움직임과 전방 압박, 꾸준한 골로 팀에 헌신하는 완성형 골잡이. 화려함보다 성실함으로 매 시즌 증명한다.", descEn: "A complete striker who presses from the front, runs the channels, and grinds out goals every season — selfless graft over flash.", tags: ["#전방압박", "#꾸준함", "#팀헌신", "#성실"], tagsEn: ["#HighPress", "#Consistent", "#TeamFirst", "#Relentless"] },
  mbappe: { key: "mbappe", name: "음바페", nameEn: "Mbappé", pos: "fw", style: "C", flag: "fr", jersey: "10", desc: "월드컵 결승 해트트릭의 사나이. 폭발적인 스피드로 큰 무대를 지배하는 클러치 슈퍼스타.", descEn: "The man with a World Cup final hat-trick. Explosive pace that takes over the biggest stages — a clutch superstar.", tags: ["#월드컵해트트릭", "#폭발스피드", "#빅매치", "#슈퍼스타"], tagsEn: ["#FinalHatTrick", "#Explosive", "#BigGame", "#Superstar"] },
  messi: { key: "messi", name: "메시", nameEn: "Messi", pos: "fw", style: "D", flag: "ar", jersey: "10", desc: "축구 그 자체, GOAT. 마법 같은 드리블과 패스로 모든 걸 해내는 창의의 신. 마침내 월드컵까지 들어 올렸다.", descEn: "Football itself — the GOAT. Magical dribbling and passing that does it all, the god of creativity. And finally, a World Cup.", tags: ["#GOAT", "#마법드리블", "#창의의신", "#월드컵우승"], tagsEn: ["#GOAT", "#MagicDribble", "#Creativity", "#WorldCupWinner"] },
};

export const FOOTBALL_GLOBAL_CONFIG: FootballTestConfig = {
  id: "football-global",
  path: "/tests/football-global",
  testName: "Global Football Player Test",
  eyebrowPill: "WORLD FOOTBALL TEST",
  accent: "#2FAE7A",
  accentInk: "#06241a",
  titleKo: "나랑 닮은 월드 클래스 축구선수는? | 포지션별 성향 테스트",
  metaDescription:
    "월드컵 시즌, 나랑 닮은 세계적인 축구선수는 누구? 포지션 고르고 5문항만 답하면 메시·호날두·음바페 등 글로벌 스타 25인 중 한 명을 찾아드립니다.",
  introTitleTop: "나랑 닮은 월드클래스 선수는?",
  introSub: "월드컵 시즌, 세계 최고들 중 너의 분신을 찾아라.",
  introDesc:
    "주 포지션을 고르고 5문항만 답하면, 너의 플레이 성향과 똑 닮은 세계적인 축구선수를 찾아드립니다. 포지션별 5명, 총 25명 중 한 명.",
  positions: FB_POSITIONS,
  styles: FB_STYLES,
  styleTie: FB_STYLE_TIE,
  grid: {
    gk: { A: "neuer", B: "courtois", C: "emartinez", D: "ederson", E: "donnarumma" },
    cb: { A: "vandijk", B: "rubendias", C: "ramos", D: "alaba", E: "varane" },
    fb: { A: "davies", B: "walker", C: "carvajal", D: "taa", E: "azpilicueta" },
    mf: { A: "bellingham", B: "rodri", C: "modric", D: "debruyne", E: "casemiro" },
    fw: { A: "haaland", B: "ronaldo", C: "mbappe", D: "messi", E: "lewandowski" },
  },
  players: PLAYERS,
  questions: FB_QUESTIONS,
  notice:
    "비공식 팬 콘텐츠로 만든 재미용 테스트이며, 언급된 선수·구단·협회·FIFA와 무관합니다. 선수명·등번호·국기는 정보 제공 목적으로만 사용되었고, 어떤 보증·후원 관계도 없습니다.",
  recommendIds: ["football-kr", "lol-playstyle", "valorant-playstyle", "kbti"],
  statsEndpoint: "/api/football-stats/football-global",
  ogKicker: "글로벌 축구선수 테스트",
  ogDefault: {
    title: "나랑 닮은 월드클래스 선수는?",
    sub: "월드컵 시즌, 세계 최고들 중 너의 분신을 찾아라.",
    line: "메시? 호날두? 아니면 음바페?",
  },
  ogDescriptionDefault:
    "월드컵 시즌, 나랑 닮은 세계적인 축구선수는? 포지션별 글로벌 스타 25인 중 너의 분신을 찾아라.",
  ogMotif: "🌍",
  ogTheme: { bg: "linear-gradient(135deg, #0b1a33 0%, #1c4f8a 58%, #12325c 100%)", accent: "#7CC4FF" },
  // ── 영어(en) ──
  localized: true,
  stylesEn: FB_STYLES_EN,
  titleEn: "Which World-Class Footballer Are You? | Position-Based Personality Test",
  metaDescriptionEn:
    "World Cup season — which world-class footballer are you? Pick a position, answer 5 questions, and find your match among 25 global stars like Messi, Ronaldo, and Mbappé.",
  introTitleTopEn: "Which world-class footballer are you?",
  introSubEn: "World Cup season — find your footballing alter ego among the world's best.",
  introDescEn:
    "Pick your main position and answer 5 quick questions to find the world-class footballer whose playstyle matches yours. Five per position, one of 25 in total.",
  noticeEn:
    "An unofficial, for-fun fan quiz. Not affiliated with or endorsed by any player, club, federation, or FIFA. Player names, numbers, and flags are used for informational purposes only.",
  ogKickerEn: "WORLD FOOTBALLER TEST",
  ogDefaultEn: {
    title: "Which world-class footballer are you?",
    sub: "Find your footballing alter ego among the world's best.",
    line: "Messi? Ronaldo? Or Mbappé?",
  },
  ogDescriptionDefaultEn:
    "World Cup season — which world-class footballer are you? Find your match among 25 global stars.",
};
