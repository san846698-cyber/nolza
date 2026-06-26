import type { AnimeResult, AnimeQuestion, AnimeTestConfig } from "@/lib/anime-test";

// 일반 9명. 히든(애덤 스매셔)은 config.hidden 으로 분리 — results[] 에 넣지 않는다. (16문항)
const RESULTS: AnimeResult[] = [
  {
    key: "david",
    name: { ko: "데이비드 마르티네즈", en: "David Martinez" },
    oneLiner: { ko: "한계를 넘어서라도 위로 올라가는 야망의 화신", en: "Pure ambition — you climb higher even past your own limits." },
    description: {
      ko: "당신은 더 높은 곳을 향해 자신을 끝까지 몰아붙이는 야망가입니다. 무모할 만큼의 추진력으로 기회를 잡고, 소중한 사람을 위해서라면 한계까지 자신을 던지죠. 멈추는 법을 모르는 그 뜨거움이 사람들을 끌어당기지만, 가끔은 자신을 너무 갈아 넣는 게 흠이에요.",
      en: "You drive yourself to the very edge in pursuit of something higher. You seize chances with reckless momentum, and you'll throw yourself to the limit for the people you love. That can't-stop heat draws people in — though sometimes you grind yourself down too far.",
    },
    strength: { ko: "한계를 두려워하지 않는 야망과 추진력이 있습니다.", en: "Ambition and drive that fear no limit." },
    weakPoint: { ko: "위로만 달리다 자신을 갈아 넣을 수 있어요.", en: "Chasing higher can grind you down." },
    friendSays: { ko: "넌 진짜 멈추질 않더라… 그게 너야.", en: "You really never stop… that's just you." },
    shareLine: { ko: "나 사이버펑크 테스트에서 데이비드 나왔다. 야망 끝판왕ㄷㄷ", en: "I got David on the Cyberpunk test — pure ambition." },
    emoji: "🔥",
    color: "#FCEE0A",
  },
  {
    key: "lucy",
    name: { ko: "루시", en: "Lucy" },
    oneLiner: { ko: "차가운 껍데기 속, 간절한 꿈을 품은 몽상가", en: "A dreamer with a longing heart behind a cool shell." },
    description: {
      ko: "당신은 겉으론 차갑고 신비롭지만, 속에는 누구보다 간절한 꿈(자유, 떠나고 싶은 어딘가)을 품은 사람입니다. 경계심이 강해 쉽게 곁을 내주지 않지만, 한번 마음을 연 사람에겐 한없이 깊고 따뜻하죠. 위태로워 보이는 그 매력에서 사람들은 눈을 떼지 못합니다.",
      en: "On the surface you're cool and mysterious, but inside you hold a dream more urgent than anyone's — freedom, somewhere to escape to. You're guarded and slow to let people in, yet endlessly deep and warm with those you do. People can't look away from that fragile magnetism.",
    },
    strength: { ko: "독립심과 흔들리지 않는 자기만의 꿈이 있습니다.", en: "Independence and an unshakable dream of your own." },
    weakPoint: { ko: "경계심이 강해 마음 열기까지 오래 걸려요.", en: "Your guard makes it slow to truly open up." },
    friendSays: { ko: "넌 차가운 척하는데 사실 제일 여리더라.", en: "You act cold, but you're actually the softest." },
    shareLine: { ko: "나 사이버펑크 테스트에서 루시 나왔다. 꿈꾸는 몽상가래.", en: "I got Lucy on the Cyberpunk test — the guarded dreamer." },
    emoji: "🌙",
    color: "#00E5FF",
  },
  {
    key: "rebecca",
    name: { ko: "레베카", en: "Rebecca" },
    oneLiner: { ko: "작지만 누구보다 사나운, 의리의 폭탄", en: "Small, fierce, and loyal — a walking firecracker." },
    description: {
      ko: "당신은 거침없고 사납고 입은 거칠어도, 제 사람에겐 누구보다 충성스러운 사람입니다. 겁이 없고 화력 하나는 끝내주며, 신나면 끝까지 달리는 폭주 에너지의 소유자죠. 작아 보여도 절대 만만하지 않은, 미워할 수 없는 매력 덩어리예요.",
      en: "You're brash, fierce, and foul-mouthed — yet more loyal to your people than anyone. Fearless, with serious firepower, you run full-tilt the moment you're fired up. You may look small, but you're never an easy target — an impossible-to-dislike ball of charm.",
    },
    strength: { ko: "겁 없는 화력과 끝까지 가는 의리가 있습니다.", en: "Fearless firepower and loyalty that goes all the way." },
    weakPoint: { ko: "신나면 앞뒤 안 보고 폭주할 수 있어요.", en: "Once hyped, you can charge in without looking." },
    friendSays: { ko: "넌 입은 거친데 결국 제일 챙겨주더라ㅋㅋ", en: "You talk rough, but you've got everyone's back, lol." },
    shareLine: { ko: "나 사이버펑크 테스트에서 레베카 나왔다. 사나운 의리파ㄷㄷ", en: "I got Rebecca on the Cyberpunk test — fierce and loyal." },
    emoji: "💥",
    color: "#FF3CAC",
  },
  {
    key: "maine",
    name: { ko: "메인", en: "Maine" },
    oneLiner: { ko: "크루를 가족으로 끌어안는 든든한 큰형", en: "The big brother who holds the whole crew like family." },
    description: {
      ko: "당신은 함께하는 사람들을 가족처럼 품고 끝까지 챙기는 리더입니다. 정이 많고 든든해서 곁에 있으면 마음이 놓이고, 위기 앞에선 누구보다 먼저 앞에 서죠. 다만 모든 짐을 혼자 짊어지려다 자신을 너무 몰아붙이는 게 약점이에요.",
      en: "You embrace the people around you like family and look after them to the end. Warm and dependable, you put others at ease, and in a crisis you step to the front before anyone. Your weakness: you try to shoulder every burden alone and push yourself too hard.",
    },
    strength: { ko: "사람을 끌어안는 따뜻함과 든든한 리더십이 있습니다.", en: "Embracing warmth and dependable leadership." },
    weakPoint: { ko: "다 짊어지려다 무너질 수 있어요.", en: "Carrying it all alone can break you." },
    friendSays: { ko: "넌 진짜 큰형 같아. 다들 너만 믿잖아.", en: "You're like the big brother — everyone leans on you." },
    shareLine: { ko: "나 사이버펑크 테스트에서 메인 나왔다. 든든한 리더형ㄷㄷ", en: "I got Maine on the Cyberpunk test — the dependable leader." },
    emoji: "🛡️",
    color: "#FF6A00",
  },
  {
    key: "dorio",
    name: { ko: "도리오", en: "Dorio" },
    oneLiner: { ko: "흔들림 없이 팀을 받치는 단단한 기둥", en: "The solid pillar that holds the team steady." },
    description: {
      ko: "당신은 차분하고 강인하며 현실 감각이 또렷한 사람입니다. 감정에 휘둘리지 않고 묵묵히 중심을 잡아, 위태로운 순간에도 팀이 무너지지 않게 받쳐주죠. 화려하게 나서진 않아도 당신이 있어 모두가 안심하는, 진짜 단단한 사람이에요.",
      en: "You're calm, strong, and clear-eyed about reality. You don't get swept up in emotion — you quietly hold the center and keep the team from collapsing even in shaky moments. You don't grandstand, but your presence is exactly why everyone feels safe.",
    },
    strength: { ko: "흔들리지 않는 강인함과 현실적인 판단이 있습니다.", en: "Unshakable strength and grounded judgment." },
    weakPoint: { ko: "묵묵히 받치다 정작 본인 힘듦은 숨겨요.", en: "Holding it all up, you hide your own strain." },
    friendSays: { ko: "넌 있는 것만으로 든든해. 진짜 기둥이야.", en: "Just having you around is reassuring — a real pillar." },
    shareLine: { ko: "나 사이버펑크 테스트에서 도리오 나왔다. 단단한 기둥형.", en: "I got Dorio on the Cyberpunk test — the steady pillar." },
    emoji: "🗿",
    color: "#16C79A",
  },
  {
    key: "kiwi",
    name: { ko: "키위", en: "Kiwi" },
    oneLiner: { ko: "자기 앞가림 확실한 냉철한 실속파", en: "A cool pragmatist who always covers their own bases." },
    description: {
      ko: "당신은 실리적이고 자기 보호 본능이 강한 사람입니다. 감정보다 손익을 먼저 따지고, 위험은 누구보다 빨리 감지해 미리 피하죠. 쿨하고 거리감 있어 보여도 그건 자신을 지키는 방식일 뿐, 냉정한 판단력 하나는 누구도 못 따라가요.",
      en: "You're pragmatic with a strong instinct for self-preservation. You weigh gains and losses before emotion, and you sense danger faster than anyone and sidestep it early. You can seem cool and distant, but that's just how you protect yourself — and your cold-headed judgment is unmatched.",
    },
    strength: { ko: "빠른 위험 감지와 냉철한 손익 판단이 있습니다.", en: "Fast danger radar and cold cost-benefit judgment." },
    weakPoint: { ko: "자기 보호가 앞서 차갑게 비칠 수 있어요.", en: "Self-protection first can read as cold." },
    friendSays: { ko: "넌 쿨한데 결국 제일 똑똑하게 빠지더라.", en: "You're cool, and you always make the smart exit." },
    shareLine: { ko: "나 사이버펑크 테스트에서 키위 나왔다. 냉철한 실속파ㄷㄷ", en: "I got Kiwi on the Cyberpunk test — the cool pragmatist." },
    emoji: "🧊",
    color: "#A06BFF",
  },
  {
    key: "pilar",
    name: { ko: "필라르", en: "Pilar" },
    oneLiner: { ko: "허당 같아도 분위기를 살리는 낙천 에너자이저", en: "A goofy optimist who lights up the whole room." },
    description: {
      ko: "당신은 엉뚱하고 낙천적이며, 큰 꿈을 신나게 떠벌리는 분위기 메이커입니다. 어떤 상황에서도 웃음을 잃지 않고, 가벼운 듯해도 사람을 따뜻하게 챙기죠. 허당 같은 면이 매력이라, 당신만 있으면 어떤 자리든 금세 시끌벅적 즐거워져요.",
      en: "You're goofy, optimistic, and the kind of hype-man who happily talks up big dreams. You never lose your laugh, and beneath the lightness you warmly look after people. Your lovable klutz energy is the charm — any room turns lively the moment you're in it.",
    },
    strength: { ko: "어떤 상황도 밝게 만드는 낙천과 따뜻함이 있습니다.", en: "Optimism and warmth that brighten any room." },
    weakPoint: { ko: "들떠서 가끔 일을 키우기도 해요.", en: "Getting carried away can blow things up." },
    friendSays: { ko: "넌 있으면 그냥 다 재밌어져ㅋㅋ", en: "Everything's just more fun when you're around, lol." },
    shareLine: { ko: "나 사이버펑크 테스트에서 필라르 나왔다. 낙천 무드메이커ㅋ", en: "I got Pilar on the Cyberpunk test — the optimistic hype-man." },
    emoji: "🎉",
    color: "#B6FF3C",
  },
  {
    key: "falco",
    name: { ko: "팔코", en: "Falco" },
    oneLiner: { ko: "어떤 상황에도 침착하게 핸들을 잡는 베테랑", en: "The veteran who keeps a cool grip on the wheel, always." },
    description: {
      ko: "당신은 어떤 위기에도 흔들리지 않고 침착하게 상황을 끌고 가는 프로페셔널입니다. 요란하게 나서기보다 묵묵히 제 몫을 정확히 해내고, 모두가 당황할 때 빠져나갈 길을 가장 먼저 잡죠. 믿고 맡길 수 있는, 노련한 운전대 같은 사람이에요.",
      en: "You're the professional who stays calm and steers the situation no matter the crisis. Rather than make noise, you do your part precisely, and when everyone panics you're first to find the way out. You're the kind you can trust the wheel to — seasoned and steady.",
    },
    strength: { ko: "위기에도 흔들리지 않는 침착함과 노련함이 있습니다.", en: "Calm and seasoned even under pressure." },
    weakPoint: { ko: "속을 안 드러내 무심하게 보일 수 있어요.", en: "Keeping it in can come off as detached." },
    friendSays: { ko: "넌 진짜 위급할 때 제일 침착하더라.", en: "When things get hairy, you're the calmest one." },
    shareLine: { ko: "나 사이버펑크 테스트에서 팔코 나왔다. 침착한 베테랑형.", en: "I got Falco on the Cyberpunk test — the calm veteran." },
    emoji: "🚘",
    color: "#4D9DE0",
  },
  {
    key: "faraday",
    name: { ko: "파라데이", en: "Faraday" },
    oneLiner: { ko: "속을 안 보이고 판을 자기 쪽으로 굴리는 책략가", en: "The schemer who keeps a poker face and tilts the board their way." },
    description: {
      ko: "당신은 감정을 드러내지 않고 철저히 계산으로 움직이는 전략가입니다. 전체 판을 차갑게 읽고, 패를 쥐고 흔들며 상황을 자기에게 유리하게 만들죠. 속을 알 수 없어 신비롭게 느껴지고, 협상과 거래에서만큼은 누구도 당신을 쉽게 이기지 못해요.",
      en: "You move by cold calculation, never showing your hand. You read the whole board, hold the cards, and tilt every situation in your favor. Your inscrutability makes you mysterious — and when it comes to deals and negotiation, no one beats you easily.",
    },
    strength: { ko: "차갑게 판을 읽는 머리와 협상력이 있습니다.", en: "A cold read of the board and sharp negotiation." },
    weakPoint: { ko: "잇속을 챙기다 사람을 잃을 수 있어요.", en: "Playing your own angle can cost you people." },
    friendSays: { ko: "넌 무슨 생각인지 모르겠는데 결국 네 페이스더라.", en: "I can never read you, but it always ends up your pace." },
    shareLine: { ko: "나 사이버펑크 테스트에서 파라데이 나왔다. 냉정한 책략가ㄷㄷ", en: "I got Faraday on the Cyberpunk test — the cold schemer." },
    emoji: "♟️",
    color: "#8A929E",
  },
];

// 히든(레어) — '한계도 인간성도 버리고 정점을 좇는' 극단 선택지(hiddenWeight)의 합이 임계값 이상일 때만 등장.
const HIDDEN: AnimeResult = {
  key: "smasher",
  name: { ko: "애덤 스매셔", en: "Adam Smasher" },
  oneLiner: { ko: "한계도 인간성도 버리고 정점에 선 풀 크롬의 최강", en: "Full chrome, no limits, no humanity — the apex at the top." },
  description: {
    ko: "당신은 아주 드물게 나오는 '정점' 결과입니다. 한계를 모르고 끝까지 힘을 좇아 모두를 압도하는 존재. 무엇도 당신을 멈출 수 없고, 그 어떤 두려움도 망설임도 당신 앞에선 무의미하죠. 가장 위에서 모든 걸 내려다보는, 격이 다른 압도적인 유형입니다. (단, 인간다움까지 갈아 넣은 끝의 자리라는 건 잊지 말기를.)",
    en: "You're an extremely rare 'apex' result. Limitless, chasing power to the very end, overwhelming everyone in your path. Nothing stops you, and no fear or hesitation means a thing in front of you. The kind that looks down on everything from the very top — in a class entirely your own. (Just remember: it's the seat reached by grinding away even your humanity.)",
  },
  strength: { ko: "멈추지 않는 야망과 압도적인 힘을 지녔습니다.", en: "Unstoppable ambition and overwhelming power." },
  weakPoint: { ko: "정점을 좇다 인간다움까지 잃을 수 있어요.", en: "Chasing the apex can cost you your humanity." },
  friendSays: { ko: "넌… 진짜 멈출 생각이 없구나. 무섭다 야ㄷㄷ", en: "You… really have no intention of stopping. Kind of terrifying." },
  shareLine: { ko: "나 사이버펑크 테스트에서 '애덤 스매셔' 나왔다. 최강 히든이래 ㄷㄷㄷ", en: "I pulled 'Adam Smasher' on the Cyberpunk test — the apex hidden result. Insane." },
  emoji: "🤖",
  color: "#FF2A2A",
};

// 문항 설계: ① 한 문항의 4답 = 서로 뚜렷이 다른 성향. ② 같은 캐릭터는 매번 다른 상황·다른 면모로.
// 극단(한계 돌파/완전한 압도) 6선택지에만 hiddenWeight — 4개 이상 누적 시 히든(스매셔) 등장.
const QUESTIONS: AnimeQuestion[] = [
  {
    id: "q1",
    prompt: { ko: "큰 한탕, 큰 의뢰가 들어왔습니다.\n당신은?", en: "A big score, a major gig lands in your lap.\nYou…" },
    choices: [
      { id: "a", text: { ko: "위로 올라갈 기회다, 몸을 갈아서라도 잡는다", en: "A chance to climb — I take it even if it grinds me down." }, weights: { david: 2 }, hiddenWeight: 1 },
      { id: "b", text: { ko: "조용히 내 꿈에 한 발 가까워질 수단으로 본다", en: "Quietly, I see it as one step closer to my dream." }, weights: { lucy: 2 } },
      { id: "c", text: { ko: "위험해도 신나서 일단 질러본다ㅋㅋ", en: "Risky, but I'm hyped — I just send it, lol." }, weights: { rebecca: 2 } },
      { id: "d", text: { ko: "크루부터 불러 모아 같이 간다", en: "I round up the crew and we go together." }, weights: { maine: 2 } },
    ],
  },
  {
    id: "q2",
    prompt: { ko: "위험한 현장 한복판에 떨어졌습니다.\n당신은?", en: "You're dropped into the middle of a dangerous job.\nYou…" },
    choices: [
      { id: "a", text: { ko: "흔들림 없이 앞에 서서 팀을 막아선다", en: "Unshaken, I plant myself in front and shield the team." }, weights: { dorio: 2 } },
      { id: "b", text: { ko: "위험은 먼저 피하고 내 몫만 확실히 챙긴다", en: "I dodge the danger early and secure just my cut." }, weights: { kiwi: 2 } },
      { id: "c", text: { ko: "긴장을 농담으로 풀며 분위기를 띄운다", en: "I crack jokes to break the tension and lift the mood." }, weights: { pilar: 2 } },
      { id: "d", text: { ko: "침착하게 빠져나갈 동선부터 잡는다", en: "Calmly, I lock onto an escape route first." }, weights: { falco: 2 } },
    ],
  },
  {
    id: "q3",
    prompt: { ko: "사람들과 어울리는 당신의 방식은?", en: "Your way of getting along with people?" },
    choices: [
      { id: "a", text: { ko: "속을 안 보이고 적당히 거리를 둔다", en: "I keep my cards hidden and a measured distance." }, weights: { faraday: 2 } },
      { id: "b", text: { ko: "겉은 가벼워도, 위로 올라가려는 마음은 안 숨긴다", en: "Light on the surface, but I don't hide my drive to rise." }, weights: { david: 2 } },
      { id: "c", text: { ko: "차갑게 굴어도 마음 연 사람에겐 진심", en: "Cold to most, but real with the ones I let in." }, weights: { lucy: 2 } },
      { id: "d", text: { ko: "입은 거칠어도 내 사람은 끝까지 챙긴다", en: "Rough mouth, but I look after my people to the end." }, weights: { rebecca: 2 } },
    ],
  },
  {
    id: "q4",
    prompt: { ko: "갈등 상황에서 당신의 대응은?", en: "Your response in a conflict?" },
    choices: [
      { id: "a", text: { ko: "묵묵히 가운데서 중심을 잡는다", en: "I quietly hold the center and steady it." }, weights: { maine: 2 } },
      { id: "b", text: { ko: "감정에 휩쓸리지 않고 침착하게 가라앉힌다", en: "Unswayed by emotion, I calmly settle it down." }, weights: { dorio: 2 } },
      { id: "c", text: { ko: "엮이기 싫어서 슬쩍 발을 뺀다", en: "I'd rather not get tangled — I quietly step back." }, weights: { kiwi: 2 } },
      { id: "d", text: { ko: "일단 웃어넘기고 분위기부터 푼다", en: "I laugh it off first and ease the mood." }, weights: { pilar: 2 } },
    ],
  },
  {
    id: "q5",
    prompt: { ko: "사람들이 보는 당신의 첫인상은?", en: "What's your first impression on people?" },
    choices: [
      { id: "a", text: { ko: "어떤 상황에도 침착해 보이는 사람", en: "Someone calm in any situation." }, weights: { falco: 2 } },
      { id: "b", text: { ko: "속을 알 수 없어 신비로운 사람", en: "Inscrutable and mysterious." }, weights: { faraday: 2 } },
      { id: "c", text: { ko: "야망 가득하고 뜨거운 사람", en: "Full of ambition, burning hot." }, weights: { david: 2 } },
      { id: "d", text: { ko: "차갑지만 어딘가 위태로운 매력의 사람", en: "Cold, but with a fragile, magnetic edge." }, weights: { lucy: 2 } },
    ],
  },
  {
    id: "q6",
    prompt: { ko: "원하는 걸 얻는 당신만의 방식은?", en: "Your own way of getting what you want?" },
    choices: [
      { id: "a", text: { ko: "막아서는 건 전부 박살내고 힘으로 가져온다", en: "I smash through anything in the way and take it by force." }, weights: { rebecca: 2 }, hiddenWeight: 1 },
      { id: "b", text: { ko: "내 사람들과 힘을 합쳐 끝까지 밀고 간다", en: "I join forces with my people and push to the end." }, weights: { maine: 2 } },
      { id: "c", text: { ko: "흔들림 없이 버티며 기회를 기다린다", en: "I hold steady and wait for the opening." }, weights: { dorio: 2 } },
      { id: "d", text: { ko: "무리 안 한다, 안 되면 깔끔하게 접는다", en: "No overreaching — if it won't work, I fold clean." }, weights: { kiwi: 2 } },
    ],
  },
  {
    id: "q7",
    prompt: { ko: "스트레스를 푸는 방식은?", en: "How do you relieve stress?" },
    choices: [
      { id: "a", text: { ko: "크루 불러 다 같이 시끌벅적 놀아버린다", en: "I call the crew and we go loud together." }, weights: { pilar: 2 } },
      { id: "b", text: { ko: "조용히 정비하고 다음 판을 준비한다", en: "I quietly tune up and prep for the next run." }, weights: { falco: 2 } },
      { id: "c", text: { ko: "혼자 데이터를 뒤지며 머리를 식힌다", en: "I dig through data alone to cool my head." }, weights: { faraday: 2 } },
      { id: "d", text: { ko: "더 강해질 방법을 찾아 자신을 더 몰아붙인다", en: "I look for a way to get stronger and push myself harder." }, weights: { david: 2 } },
    ],
  },
  {
    id: "q8",
    prompt: { ko: "소중한 사람을 대하는 당신은?", en: "How are you with someone precious to you?" },
    choices: [
      { id: "a", text: { ko: "그 사람의 꿈까지 함께 지켜주고 싶다", en: "I want to protect their dream alongside them." }, weights: { lucy: 2 } },
      { id: "b", text: { ko: "욕하면서도 결국 제일 먼저 달려가 챙긴다", en: "I grumble, but I'm first to run over and have their back." }, weights: { rebecca: 2 } },
      { id: "c", text: { ko: "가족처럼 품고 무슨 일이든 다 짊어진다", en: "I hold them like family and shoulder whatever comes." }, weights: { maine: 2 } },
      { id: "d", text: { ko: "티 안 내고 옆에서 든든히 받쳐준다", en: "Without a word, I steady them from beside." }, weights: { dorio: 2 } },
    ],
  },
  {
    id: "q9",
    prompt: { ko: "결정적 순간, 당신의 무기는?", en: "At the decisive moment, your weapon is…" },
    choices: [
      { id: "a", text: { ko: "위험을 먼저 읽고 빠지는 냉철한 판단", en: "Cold judgment that reads danger early and pulls out." }, weights: { kiwi: 2 } },
      { id: "b", text: { ko: "어떤 자리든 밝게 만드는 낙천 에너지", en: "Optimist energy that lights up any room." }, weights: { pilar: 2 } },
      { id: "c", text: { ko: "끝까지 흔들리지 않는 침착함", en: "Composure that never wavers to the end." }, weights: { falco: 2 } },
      { id: "d", text: { ko: "냉정하게 판을 읽고, 방해되는 건 가차 없이 쳐낸다", en: "I read the board cold and cut down anything in the way without mercy." }, weights: { faraday: 2 }, hiddenWeight: 1 },
    ],
  },
  {
    id: "q10",
    prompt: { ko: "새로운 것에 도전할 때 당신은?", en: "Taking on something new, you…" },
    choices: [
      { id: "a", text: { ko: "무조건 위로, 더 강하게 자신을 밀어붙인다", en: "Always upward — I push myself harder, stronger." }, weights: { david: 2 }, hiddenWeight: 1 },
      { id: "b", text: { ko: "이게 내 자유에 가까워지는 길인지 먼저 본다", en: "I check first if it brings me closer to freedom." }, weights: { lucy: 2 } },
      { id: "c", text: { ko: "겁 없이 신나서 일단 뛰어든다", en: "Fearless and hyped, I just dive in." }, weights: { rebecca: 2 } },
      { id: "d", text: { ko: "동료들과 발을 맞춰 함께 움직인다", en: "I move in step with my crew." }, weights: { maine: 2 } },
    ],
  },
  {
    id: "q11",
    prompt: { ko: "가장 당신다운 한마디는?", en: "The line that's most you?" },
    choices: [
      { id: "a", text: { ko: "흔들리지 마, 내가 받쳐줄게.", en: "Don't waver — I've got you." }, weights: { dorio: 2 } },
      { id: "b", text: { ko: "무리하지 마, 손해 보는 짓은 안 한다.", en: "Don't overreach — I don't take losing bets." }, weights: { kiwi: 2 } },
      { id: "c", text: { ko: "야, 우리 언젠가 진짜 크게 한탕 하자!", en: "Hey — someday we pull off something huge!" }, weights: { pilar: 2 } },
      { id: "d", text: { ko: "당황하지 마, 길은 내가 뚫는다.", en: "Don't panic — I'll clear the way." }, weights: { falco: 2 } },
    ],
  },
  {
    id: "q12",
    prompt: { ko: "당신의 진짜 속마음은?", en: "What's really going on inside you?" },
    choices: [
      { id: "a", text: { ko: "다 부질없어, 결국 믿을 건 계산뿐이야", en: "It's all hollow — in the end only the math is real." }, weights: { faraday: 2 } },
      { id: "b", text: { ko: "멈추면 끝이다, 계속 위로 올라가야 해", en: "Stop and it's over — I have to keep climbing." }, weights: { david: 2 } },
      { id: "c", text: { ko: "사실은 조용히 쉴 수 있는 곳이 필요해", en: "Honestly, I just need somewhere quiet to rest." }, weights: { lucy: 2 } },
      { id: "d", text: { ko: "겉은 사나워도 속은 정 많아", en: "Fierce outside, but soft-hearted inside." }, weights: { rebecca: 2 } },
    ],
  },
  {
    id: "q13",
    prompt: { ko: "동료가 위기에 빠졌습니다.\n당신은?", en: "A teammate lands in danger.\nWhat do you do?" },
    choices: [
      { id: "a", text: { ko: "가족이니까 무조건 내가 앞을 막는다", en: "They're family — I block the front, no question." }, weights: { maine: 2 } },
      { id: "b", text: { ko: "묵묵히 곁을 지키며 끝까지 함께한다", en: "I quietly stay by their side to the very end." }, weights: { dorio: 2 } },
      { id: "c", text: { ko: "냉정하게 살릴 수 있는 길부터 계산한다", en: "Coldly, I calculate the path that gets them out alive." }, weights: { kiwi: 2 } },
      { id: "d", text: { ko: "너스레로 분위기 풀면서 같이 뛰어든다", en: "I crack the tension with banter and dive in with them." }, weights: { pilar: 2 } },
    ],
  },
  {
    id: "q14",
    prompt: { ko: "당신의 가장 큰 매력은?", en: "Your biggest charm?" },
    choices: [
      { id: "a", text: { ko: "위급할수록 더 빛나는 침착함", en: "Composure that shines brightest when it's dire." }, weights: { falco: 2 } },
      { id: "b", text: { ko: "판을 내 쪽으로 기울이는 빈틈없는 수완", en: "Airtight skill that tilts the board my way." }, weights: { faraday: 2 } },
      { id: "c", text: { ko: "한계 앞에서도 멈추지 않는 뜨거운 추진력", en: "Burning drive that doesn't stop even at the limit." }, weights: { david: 2 } },
      { id: "d", text: { ko: "위태로운데 자꾸 눈이 가는 분위기", en: "A fragile air you somehow can't stop watching." }, weights: { lucy: 2 } },
    ],
  },
  {
    id: "q15",
    prompt: { ko: "팀이 벼랑 끝에 몰렸습니다.\n당신은?", en: "Your team is backed to the edge of a cliff.\nYou…" },
    choices: [
      { id: "a", text: { ko: "모두를 압도할 때까지 끝까지 힘을 끌어올린다", en: "I crank my power up until I overwhelm them all." }, weights: { rebecca: 2 }, hiddenWeight: 1 },
      { id: "b", text: { ko: "가족 같은 팀, 내가 다 짊어지고 끝까지 간다", en: "My family of a team — I shoulder them all to the end." }, weights: { maine: 2 } },
      { id: "c", text: { ko: "흔들림 없이 버티며 반격 타이밍을 만든다", en: "I hold firm and make the moment to strike back." }, weights: { dorio: 2 } },
      { id: "d", text: { ko: "냉정하게 손익을 따져 최선의 수를 고른다", en: "Coolly, I weigh the odds and pick the best move." }, weights: { kiwi: 2 } },
    ],
  },
  {
    id: "q16",
    prompt: { ko: "사람들이 당신을 한마디로 이렇게 부릅니다.", en: "In one phrase, people call you this." },
    choices: [
      { id: "a", text: { ko: "어떤 자리든 분위기를 살리는 낙천 무드메이커", en: "The optimist hype-man who lights up any room." }, weights: { pilar: 2 } },
      { id: "b", text: { ko: "위급할 때 제일 믿음직한 침착한 베테랑", en: "The calm veteran you trust most when it's dire." }, weights: { falco: 2 } },
      { id: "c", text: { ko: "속을 안 보이고 판을 굴리는 냉정한 책략가", en: "The cold schemer who tilts the board, face unread." }, weights: { faraday: 2 } },
      { id: "d", text: { ko: "한계를 넘어서라도 위로 오르는 야망의 화신", en: "Ambition incarnate, climbing even past the limit." }, weights: { david: 2 } },
    ],
  },
];

export const CYBERPUNK_CONFIG: AnimeTestConfig = {
  testId: "cyberpunk",
  path: "/tests/cyberpunk",
  tone: "midnight",
  accent: "#FCEE0A",
  ogBg: "linear-gradient(135deg, #07070f 0%, #14122a 55%, #05060c 100%)",
  eyebrow: { ko: "나의 사이버펑크 캐릭터", en: "Your Cyberpunk Character" },
  gameName: { ko: "사이버펑크: 엣지러너", en: "Cyberpunk: Edgerunners" },
  title: { ko: "사이버펑크: 엣지러너 캐릭터 테스트", en: "Cyberpunk: Edgerunners Character Test" },
  subtitle: { ko: "너는 어떤 엣지러너일까?", en: "Which Edgerunner are you?" },
  description: {
    ko: "16개의 상황 선택으로 9명의 엣지러너 중 너와 가장 닮은 한 명을 찾아드립니다. 데이비드·루시·레베카·메인·키위·파라데이… 그리고 아주 드물게 나오는 숨은 결과까지!",
    en: "16 quick choices match you to one of 9 Edgerunners — David, Lucy, Rebecca, Maine, Kiwi, Faraday… plus an ultra-rare hidden result.",
  },
  metaTitle: { ko: "사이버펑크: 엣지러너 캐릭터 테스트 | 나는 어떤 캐릭터?", en: "Cyberpunk: Edgerunners Character Test | Which Character Are You?" },
  metaDescription: {
    ko: "16문항으로 알아보는 나의 사이버펑크: 엣지러너 캐릭터. 9명 중 나와 가장 닮은 캐릭터는? 아주 드물게 나오는 히든 결과도 숨어 있어요.",
    en: "Find your Cyberpunk: Edgerunners character in 16 questions — which of 9 characters are you? A rare hidden result awaits.",
  },
  ogKicker: "CYBERPUNK: EDGERUNNERS CHARACTER TEST",
  coverImage: "/images/tests/cyberpunk/cover-og.jpg",
  results: RESULTS,
  hidden: HIDDEN,
  // 히든(스매셔) 트리거: 5개 극단 선택지(데이비드2·레베카2·파라데이1) 중 4개 이상 누적 시 발동.
  // 한 캐릭만 밀어선 임계값 미달 → 여러 '최강·무자비' 답을 두루 골라야 발동 (균등 무작위 ≈ 1.6%, 레어 유지).
  hiddenThreshold: 4,
  questions: QUESTIONS,
  recommendedIds: ["chainsaw-man", "jujutsu-kaisen", "demon-slayer", "crush-type"],
};
