// 25가지 오행 조합별 결과 텍스트.
// 키 형태: `${A의_오행}_${B의_오행}` (예: "wood_fire")
// 방향성이 있는 관계라서 wood_fire 와 fire_wood 는 의도적으로 다르게 쓰여 있다.

export type ElementKey = "wood" | "fire" | "earth" | "metal" | "water";

export const ELEMENT_KO_NAME: Record<ElementKey, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

export const ELEMENT_EN_NAME: Record<ElementKey, string> = {
  wood: "Wood",
  fire: "Fire",
  earth: "Earth",
  metal: "Metal",
  water: "Water",
};

export const ELEMENT_HANJA: Record<ElementKey, string> = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

export const ELEMENT_EMOJI: Record<ElementKey, string> = {
  wood: "🌿",
  fire: "🔥",
  earth: "🪨",
  metal: "⚡",
  water: "💧",
};

export function elementFromYear(year: number): ElementKey {
  const idx = ((year % 10) + 10) % 10;
  if (idx <= 1) return "wood";
  if (idx <= 3) return "fire";
  if (idx <= 5) return "earth";
  if (idx <= 7) return "metal";
  return "water";
}

export type PairCopy = {
  title: { ko: string; en: string };
  summary: { ko: string; en: string };
  friendship: { ko: string; en: string };
  conversation: { ko: string; en: string };
  synergy: { ko: string; en: string };
  growth: { ko: string; en: string };
  tags: { ko: [string, string, string]; en: [string, string, string] };
};

type Key = `${ElementKey}_${ElementKey}`;

export const PAIR_COPY: Record<Key, PairCopy> = {
  /* ============ 목 행 ============ */
  wood_wood: {
    title: { ko: "같은 숲에서 자란 두 그루", en: "Two saplings of the same grove" },
    summary: { ko: "결이 닮아서 굳이 설명할 게 없는 사이.", en: "So alike, you skip the explaining." },
    friendship: {
      ko: "같은 오행이 만나면 처음부터 결이 거의 같다. 새로운 모임에서도 둘은 비슷한 위치에 자리잡고, 같은 농담에 같은 박자로 웃는다. 화려한 사건 없이도 친밀해지는 종류라, 멀어졌다가도 한 번 연락하면 어제 본 사이처럼 돌아온다.",
      en: "Same element, same grain from the start. In a new room you both gravitate to similar corners, laughing on the same beat at the same jokes. Without any big drama you slide into closeness, and even after long silences a single message resets the friendship to ‘like we hung out yesterday.’",
    },
    conversation: {
      ko: "대화 톤과 속도가 거의 일치해서, 처음 보는 주제도 두세 마디 만에 같은 결론으로 향한다. 다만 너무 닮은 만큼 둘 다 모르는 영역에서는 함께 멈춰버리기 쉽다. 외부 자극이 들어오면 갑자기 같은 방향으로 폭발적으로 자란다는 점이 이 둘만의 묘미다.",
      en: "Tone and tempo align so closely that even fresh topics land at the same conclusion in two or three exchanges. The flip side: in territory neither of you knows, you stall together. The trick is that any outside spark makes you both grow in the same direction at once.",
    },
    synergy: {
      ko: "협업에서는 안정감이 무기다. 의견이 갈리는 일이 적어 같은 방향으로 꾸준히 힘을 보태는 데에 능하다. 단, 둘 다 비슷한 곳을 못 보기 때문에, 외부 시선이나 다른 결의 사람을 가끔 끌어들여야 가지치기가 된다.",
      en: "In collaboration, steadiness is the weapon — you rarely fight over direction, so you stack effort in the same line for a long time. The catch is that you share blind spots, so you’ll need an outside voice now and then to prune what you both keep missing.",
    },
    growth: {
      ko: "거울처럼 작동하는 관계라, 상대의 성장이 곧 내 성장의 예고편이 된다. 한 명이 책을 읽기 시작하면 다른 한 명도 자연스럽게 따라온다. 갈등으로 깎이는 성장이 아니라, 같이 천천히 단단해지는 종류의 성장이다.",
      en: "You mirror each other, so a friend’s growth often previews your own. When one starts reading something new, the other tends to drift toward the same shelf. Growth here doesn’t come from friction — it comes from quietly hardening side by side.",
    },
    tags: {
      ko: ["#말안해도_통함", "#같은_숲_같은_결", "#오래갈수록_좋아짐"],
      en: ["#unspoken_understanding", "#same_grain", "#better_with_time"],
    },
  },
  wood_fire: {
    title: { ko: "장작이 되어 불을 키우는 사이", en: "The log that feeds the flame" },
    summary: { ko: "내가 던진 한 마디가 너의 큰 일이 되는.", en: "Your line becomes their bigger thing." },
    friendship: {
      ko: "오행 상생의 정석. 목이 화를 키워주는 흐름이라, 내가 무심코 던진 농담이나 응원이 상대 안에서 큰 결심으로 자라는 경험을 자주 한다. 상대가 빛날 때 내 일처럼 기쁘고, 그게 다시 나에게도 에너지로 돌아온다는 걸 둘 다 안다.",
      en: "Textbook generative pairing — wood feeding fire. Throwaway lines or quiet encouragement from you grow into real decisions in them. When they shine you feel it as your own win, and you both notice that the warmth circles back to you in the end.",
    },
    conversation: {
      ko: "내가 차분하게 운을 띄우면, 상대가 그 위에 불을 붙이는 식으로 대화가 굴러간다. 한 사람의 정리된 사고가 다른 사람의 표현력으로 발화되기 때문에, 같이 이야기하면 이상하게 좋은 문장이 자주 나온다.",
      en: "You set out the kindling calmly, they light it — that’s the rhythm. Your organized thought becomes their expressive bursts, and somehow good sentences keep falling out of the conversation that neither of you would have produced alone.",
    },
    synergy: {
      ko: "이 조합은 1+1이 3을 넘어선다. 내 안의 깊이를 상대가 표현해주고, 상대의 표현을 내가 다시 단단하게 받쳐준다. 같이 시작하는 프로젝트는 출발이 가볍지만, 끝에 가서는 혼자였다면 절대 못 닿았을 자리에 가 있다.",
      en: "Here 1+1 climbs past 3. They voice the depth that lives inside you, and you anchor the things they fling out into the room. Anything you launch together starts light, but ends somewhere you alone could not have reached.",
    },
    growth: {
      ko: "내가 상대를 키워주는 만큼 나도 상대 덕분에 표현이 자란다. 묵혀두기만 했던 생각을 상대가 끌어내 주기 때문이다. 다만 나만 거름이 되는 듯한 시기가 있을 수 있으니, 그 흐름이 결국 돌아온다는 걸 믿는 게 이 우정의 핵심이다.",
      en: "While you nurture them, your own voice sharpens because they keep pulling out thoughts you had been hoarding. There may be stretches that feel one-way; trusting that the flow eventually returns is the spine of this friendship.",
    },
    tags: {
      ko: ["#내가_장작이_되는_사이", "#쟤가_빛나면_내가_뿌듯", "#찐_파트너십"],
      en: ["#i_am_the_kindling", "#their_shine_is_my_pride", "#real_partnership"],
    },
  },
  wood_earth: {
    title: { ko: "땅을 뚫고 자라는 나무", en: "Roots breaking through soil" },
    summary: { ko: "부딪히지만, 단단해지는 사이.", en: "You collide — and harden because of it." },
    friendship: {
      ko: "목이 토를 극하는 관계라, 나는 의도치 않게 상대의 안정된 영역을 자꾸 흔든다. 처음에는 ‘쟤는 나를 가만 안 둬’라는 인상이 강할 수 있다. 그런데 그 흔들림이 결국 상대의 땅을 더 단단히 다지게 만들고, 그 사실을 상대가 알아채는 순간 우정이 깊어진다.",
      en: "Wood overcomes earth — you keep shaking the steady ground they have built without meaning to. Their first impression may be ‘this person doesn’t let me settle.’ But the shaking ends up packing their soil tighter, and the friendship deepens the moment they realize that.",
    },
    conversation: {
      ko: "내 말은 상대의 익숙한 틀을 자주 건드린다. 상대는 내가 너무 들쑤신다고 느낄 때가 있고, 나는 상대가 너무 안 움직인다고 느낄 때가 있다. 그러나 결과적으로 상대는 내 한마디 덕분에 갇혀 있던 자리에서 나오고, 나는 상대의 차분함 덕분에 멈출 곳을 안다.",
      en: "Your words keep poking at the frames they’ve grown comfortable in. They sometimes feel rummaged; you sometimes feel they won’t budge. The net result, though, is that they leave a stuck place because of one line of yours, and you learn where to stop because of their calm.",
    },
    synergy: {
      ko: "단기적으로는 마찰 비용이 든다. 내가 새 길을 내자고 하면 상대는 ‘좀 천천히 가자’고 한다. 그런데 그 균형이 잡힌 결과물은 어느 한쪽 혼자였다면 절대 안 만들어졌을 단단한 형태로 남는다.",
      en: "Short-term, there is a friction tax. You push for a new path, they say ‘let’s slow down.’ But once that balance settles, the output has a solidity neither of you would have produced alone.",
    },
    growth: {
      ko: "이 관계에서 나는 ‘부드럽게 미는 법’을 배우고, 상대는 ‘제때 움직이는 법’을 배운다. 처음엔 둘 다 서로가 불편하지만, 1년쯤 지나서 돌아보면 그 친구 덕분에 한 단계 컸다는 걸 인정하게 된다.",
      en: "In this dynamic, you learn ‘how to push without bruising’ and they learn ‘how to move on time.’ Both of you find the other uncomfortable at first, but a year in you’ll admit aloud that this friend lifted you a level.",
    },
    tags: {
      ko: ["#티격태격하지만_찐", "#성장형_우정", "#쟤가_나를_단단하게_해"],
      en: ["#bicker_but_real", "#growth_friendship", "#they_make_me_solid"],
    },
  },
  wood_metal: {
    title: { ko: "다듬는 칼 앞의 나무", en: "Wood under a careful blade" },
    summary: { ko: "쟤 앞에서는 허세가 안 통한다.", en: "No bluffing works in front of them." },
    friendship: {
      ko: "금이 목을 극하는 관계라, 상대는 나를 자꾸 깎아낸다. 처음엔 그 직설이 차갑게 느껴진다. 하지만 시간이 지나면서, 다른 친구들은 못 본 척하던 내 약점을 정면으로 짚어주는 사람이 사실은 가장 진짜 친구라는 걸 알게 된다.",
      en: "Metal restrains wood — they keep planing you down. The bluntness can feel chilly at first. Over time, though, you realize the friend who points at the flaw everyone else politely overlooks is the one who actually treats you as real.",
    },
    conversation: {
      ko: "상대는 내 말의 군살을 잘라낸다. ‘그래서 결론이 뭔데?’라고 묻는 친구가 이런 부류다. 처음엔 답답할 수 있지만, 그 압박 덕분에 내 생각이 둥글어지지 않고 정확해진다. 가끔은 그 단호함이 위로보다 더 큰 위로가 된다.",
      en: "They trim the fat off your sentences. The ‘so what’s the actual conclusion?’ friend — that’s them. At first it feels stifling, but their pressure keeps your thinking sharp instead of round. Sometimes that bluntness comforts more than soft words ever could.",
    },
    synergy: {
      ko: "협업에서 상대는 내 아이디어의 약한 지점을 가장 먼저 발견한다. 내 입장에서는 김새는 일이지만, 그렇기 때문에 결과물이 단단하다. 상대 또한 내 유연함 덕분에 자기 칼날이 너무 차가워지지 않도록 조절할 수 있다.",
      en: "In collaboration they spot the weakest seam of your idea first. It’s deflating in the moment, which is exactly why the final result holds up. They benefit too — your flexibility keeps their blade from getting too cold.",
    },
    growth: {
      ko: "성장 폭이 크다. 듣고 싶지 않은 말을 자주 듣지만, 그게 다 내가 모른 척하고 있던 부분이라 부정할 수가 없다. 다만 너무 깎이기만 하면 위축되니, ‘오늘은 너 이거 잘했어’라는 한마디를 서로에게 남겨두는 게 이 우정의 룰이다.",
      en: "The growth arc is wide. You hear things you’d rather not, but they’re always things you were quietly avoiding, so there’s no honest rebuttal. Watch out for over-pruning — leaving each other one ‘you nailed this today’ line is the unspoken rule of this friendship.",
    },
    tags: {
      ko: ["#정직한_쓴소리", "#쟤가_있어서_안_삐뚤어짐", "#아픈_만큼_성숙"],
      en: ["#honest_critique", "#they_keep_me_straight", "#growth_through_grit"],
    },
  },
  wood_water: {
    title: { ko: "물길 옆에 키 큰 나무", en: "Tall tree beside a stream" },
    summary: { ko: "쟤 덕분에 내가 자란다.", en: "I grow because of them." },
    friendship: {
      ko: "수가 목을 키워주는 관계라, 나는 상대 옆에 있을 때 이상하게 더 쑥쑥 자란다. 상대는 큰 말을 잘 안 하지만, 그 조용한 흐름이 내게는 가장 큰 영양분이다. 내가 시들 무렵에 슬쩍 연락이 오는, 그런 친구다.",
      en: "Water nurtures wood — you grow strangely tall next to them. They don’t say much, but their quiet current is the nutrient that hits you hardest. They’re the friend whose message arrives right when you’re starting to wilt.",
    },
    conversation: {
      ko: "상대는 듣는 결이 깊다. 내가 하는 말이 어디로 가는지 자기보다 먼저 알아채는 듯한 인상까지 받는다. 그래서 별것 아닌 푸념을 했는데, 대화가 끝나면 마음 안의 흙이 한번 갈아엎혀 있는 느낌이 든다.",
      en: "They listen with depth. Sometimes you feel like they sense where your sentence is heading before you do. You start with a small complaint and the conversation ends with the soil inside you turned over once.",
    },
    synergy: {
      ko: "협업에서는 상대가 흐름을 만들고, 내가 그 위에서 형태를 만든다. 상대의 차분한 리서치나 정리력 위에서 내 추진력이 정확히 발휘되기 때문에, 같이 무언가를 만들면 결과물의 깊이가 깊다.",
      en: "In collaboration they shape the current and you give it form. Your drive lands precisely because their quiet research or structuring sits underneath it, so anything built together carries unusual depth.",
    },
    growth: {
      ko: "내가 가장 빨리 크는 우정 중 하나다. 내 안에 없던 차분함을 상대에게서 흡수하고, 상대는 내 활기 덕분에 자기 흐름이 고이지 않는다. 다만 너무 의지하지 말고, 가끔은 내가 먼저 상대에게 영양분이 되는 순간을 만들 것.",
      en: "One of the friendships where you grow fastest. You absorb the calm you didn’t have, and your liveliness keeps their stream from going stagnant. Just don’t lean too hard — find moments to be the nutrient first now and then.",
    },
    tags: {
      ko: ["#쟤_옆에서_내가_큰다", "#영양분_같은_사람", "#찐_멘토_친구"],
      en: ["#i_grow_beside_them", "#nutrient_friend", "#real_mentor_pal"],
    },
  },

  /* ============ 화 행 ============ */
  fire_wood: {
    title: { ko: "내 불에 장작을 던져주는 사람", en: "The one who feeds my flame" },
    summary: { ko: "쟤가 옆에 있으면 내가 더 잘 탄다.", en: "I burn brighter when they’re near." },
    friendship: {
      ko: "상대가 목, 내가 화. 즉 상대가 내 불을 키워주는 흐름이다. 상대의 차분한 기획력이나 묵묵한 응원이 내게는 가장 큰 연료가 된다. 화려한 친구는 많아도 ‘진짜로 나를 타게 해주는’ 친구는 드문데, 이 사람이 바로 그쪽이다.",
      en: "They’re wood, you’re fire — they keep your flame fed. Their quiet planning or steady cheerleading turns into your strongest fuel. Plenty of friends look bright, but the ones who actually make you burn are rare — and they’re one of those.",
    },
    conversation: {
      ko: "내가 빵 터지는 동안 상대는 차분히 듣고, 그러다 결정적인 한마디를 던진다. 그 한마디 덕분에 내 흥분이 그냥 흩어지지 않고 형태를 갖춘다. 대화의 마무리는 거의 항상 상대의 한 줄로 깔끔해진다.",
      en: "While you erupt, they listen quietly — then drop the line that lands. Because of that line your spark doesn’t scatter, it takes a shape. The closing tidy bow on most conversations comes from them.",
    },
    synergy: {
      ko: "내가 앞에서 추진하고, 상대가 뒤에서 받쳐주는 형태가 자연스럽다. 둘 다 그 역할에 자존심을 안 다치기 때문에 협업이 매끄럽다. 발표는 내가, 자료는 상대가 — 이런 분담이 이상하게 잘 굴러간다.",
      en: "You drive from the front, they support from the back, and neither of you bruises an ego over the split. Pitch in front of you, deck behind them — that division of labor runs strangely well.",
    },
    growth: {
      ko: "나는 상대를 통해 ‘차분함’을 배운다. 상대는 나를 통해 ‘그래도 한번 해볼까’라는 추진력을 얻는다. 둘 다 자기에게 부족한 결을 자연스럽게 흡수해서, 1년쯤 지나면 둘 다 약간 닮아 있다.",
      en: "You learn ‘calm’ from them; they pick up ‘might as well try’ momentum from you. Each absorbs the grain you lack without forcing it, and a year in you’ll notice you’ve started to resemble each other a little.",
    },
    tags: {
      ko: ["#내_뒤에_있어_주는_사람", "#쟤_덕분에_내가_탄다", "#든든한_조용함"],
      en: ["#has_my_back", "#they_make_me_burn", "#quiet_strength"],
    },
  },
  fire_fire: {
    title: { ko: "두 개의 불꽃", en: "Two flames in one room" },
    summary: { ko: "같이 있으면 한 시간이 십 분.", en: "An hour together feels like ten." },
    friendship: {
      ko: "둘 다 화의 기질이라, 만나면 첫 5분 만에 텐션이 올라간다. 농담의 회수율이 좋고, 둘만의 인사이드 조크가 빠르게 쌓인다. 다만 둘 다 강한 에너지를 가지고 있어서, 가끔 말다툼이 폭발하기도 하지만 회복 속도도 빠르다.",
      en: "Both fire-natured, you spike up within five minutes of meeting. Inside jokes accumulate fast and the rate of return on banter is high. The downside: with two strong currents in one room, blowups happen — but you recover from them just as quickly.",
    },
    conversation: {
      ko: "대화가 1.5배속으로 흐른다. 둘 다 말 끝을 자른다는 점이 외부에서 보면 어수선해 보일 수 있지만, 본인들은 그게 즐겁다. 침묵이 어색한 사이라, 만나는 동안에는 말이 끊기지 않는다.",
      en: "Conversation runs at 1.5×. From outside, the way you both finish each other’s sentences can look chaotic, but to you two it’s the fun part. Silence feels awkward to this pair, so words rarely stop while you’re together.",
    },
    synergy: {
      ko: "신규 사업, 이벤트, 즉흥 여행 — 시작하는 건 잘한다. 다만 디테일이나 마무리는 둘 다 약하기 때문에, 끝까지 가려면 다른 결의 사람이나 외부 시스템을 끌어들여야 한다.",
      en: "Launching things — new ventures, events, spontaneous trips — comes naturally. The weak spot is detail and follow-through, so seeing things to completion usually means pulling in someone of a different grain or an external system.",
    },
    growth: {
      ko: "혼자라면 안 했을 것을 같이라서 한다. 그게 이 조합의 가장 큰 성장이다. 다만 둘 다 빠르게 식기도 해서, 식어가는 순간을 ‘그래도 한번만 더’로 끌어주는 미니 룰을 정해두면 좋다.",
      en: "You do things together that neither of you would have done alone — that’s the biggest growth this pair offers. But you both cool quickly, so a tiny rule like ‘one more push before we drop it’ saves a lot of half-finished projects.",
    },
    tags: {
      ko: ["#불꽃놀이_케미", "#만나면_시간순삭", "#식기전에_저질러"],
      en: ["#fireworks_chemistry", "#time_disappears", "#do_it_before_it_cools"],
    },
  },
  fire_earth: {
    title: { ko: "재가 되어 흙을 살찌우는 사이", en: "Ash that nourishes the soil" },
    summary: { ko: "내 들끓음이 결국 너의 토양이 된다.", en: "My fire ends as your fertile ground." },
    friendship: {
      ko: "내가 화, 상대가 토. 화생토라, 내가 만들어내는 분위기와 추진력이 결국 상대가 단단하게 자리잡는 데에 도움이 된다. 같이 있으면 내가 흩뿌리고 상대가 챙겨두는 식이라, 사라질 뻔한 것들이 상대 덕분에 형태로 남는다.",
      en: "You’re fire, they’re earth — fire produces earth. The mood and drive you scatter end up helping them sink their roots. When you’re together, you fling things out and they quietly file them, so what would have evaporated stays as a record because of them.",
    },
    conversation: {
      ko: "내가 빠르게 말하면, 상대는 그걸 다시 정리해서 ‘너 아까 이런 말 했잖아’라며 돌려준다. 처음엔 그게 답답할 수 있지만, 가만히 듣다 보면 내가 뭘 말하고 싶었는지가 더 또렷해진다.",
      en: "You speed-talk; they reflect it back as ‘you said this earlier, right?’ It can feel slow at first, but listening through, you find out more clearly what you actually meant in the first place.",
    },
    synergy: {
      ko: "내 아이디어가 상대의 손을 거쳐 실제로 굴러간다. 나 혼자였다면 머릿속에서 끝났을 일이, 상대 덕분에 일정이 잡히고, 자료가 쌓이고, 결과물로 남는다. 의외로 사업 파트너로도 어울리는 조합이다.",
      en: "Your ideas reach the ground because they handle them. Things that would have died in your head become scheduled, documented, and shipped because of them. This pair turns out to suit business partnerships better than you’d guess.",
    },
    growth: {
      ko: "나는 상대 덕분에 ‘남기는 법’을 배우고, 상대는 나 덕분에 ‘움직이는 법’을 배운다. 한쪽만 자라는 게 아니라, 두 사람이 정확히 자기에게 부족한 부분을 가져가는 우정이다.",
      en: "Through them you learn ‘how to leave a trace’; through you they learn ‘how to move.’ It isn’t one-sided growth — each of you walks off with exactly the piece you were missing.",
    },
    tags: {
      ko: ["#쟤가_있어서_내_생각이_남는다", "#빠른_나_+_단단한_쟤", "#비즈니스도_가능"],
      en: ["#they_make_my_ideas_real", "#fast_me_solid_them", "#works_as_partners"],
    },
  },
  fire_metal: {
    title: { ko: "쇠를 녹이는 불", en: "The flame that melts the blade" },
    summary: { ko: "쟤의 단단함을 내가 풀어준다.", en: "I loosen what they’ve hardened." },
    friendship: {
      ko: "내가 화, 상대가 금. 화극금이라, 나는 상대의 단단하고 차가운 면을 자연스럽게 풀어주는 역할을 맡는다. 평소에는 흔들리지 않는 친구가 내 앞에서는 의외의 표정을 짓는데, 그게 이 우정의 가장 묘한 매력이다.",
      en: "You’re fire, they’re metal — fire overcomes metal. You loosen the hardened, cool side they keep up. The friend who never flinches will pull a surprising face only with you — that’s the strange charm of this bond.",
    },
    conversation: {
      ko: "상대는 정확하고 차분한 결을 가지고 있어서, 내 흥분이 그 옆에서 한번 식는다. 식는다는 게 차가워진다는 뜻이 아니라, 내가 진짜 하고 싶은 말이 무엇인지 정리된다는 뜻이다. 대화 후에 ‘아, 내 마음이 이거였구나’ 하는 순간이 잦다.",
      en: "Their grain is precise and cool, and your excitement gets a beat to settle next to it — not chilled, refined. After most conversations you’ll find yourself realizing ‘oh, that was the actual thing on my mind.’",
    },
    synergy: {
      ko: "내가 분위기를 만들고, 상대가 디테일을 잡는다. 내 추진력 덕분에 상대의 정밀함이 ‘쓸모’가 되고, 상대의 정밀함 덕분에 내 추진력이 ‘성과’가 된다. 둘 중 하나만 빠져도 안 되는 종류의 협업이다.",
      en: "You set the mood, they handle precision. Your drive makes their precision useful; their precision makes your drive into actual outcomes. Pull either one out and the collaboration breaks.",
    },
    growth: {
      ko: "나는 ‘날 선 정확함’을 배우고, 상대는 ‘유연함’을 배운다. 단, 내가 너무 강하게 굴면 상대가 식어버릴 수 있고, 상대가 너무 차가우면 내가 의욕을 잃을 수 있다. 둘 다 온도 조절이 이 관계의 핵심이다.",
      en: "You pick up ‘edge-on accuracy’ from them; they pick up ‘flexibility’ from you. The watchout: too much heat shuts them down; too much chill drains you. Temperature control is the central skill of this friendship.",
    },
    tags: {
      ko: ["#쟤가_내_앞에서_무장해제", "#열기와_정밀함", "#온도조절_필요"],
      en: ["#they_let_their_guard_down", "#heat_meets_precision", "#mind_the_temperature"],
    },
  },
  fire_water: {
    title: { ko: "내 불을 끄는 빗줄기", en: "Rain on a roaring flame" },
    summary: { ko: "쟤 앞에서는 내가 작아진다, 그리고 다행이다.", en: "I shrink near them — and I’m glad." },
    friendship: {
      ko: "내가 화, 상대가 수. 수극화라, 가끔 상대 앞에서 내가 멋쩍어지는 순간이 있다. 한껏 들떠있을 때 상대의 차분한 한마디가 내 텐션을 식히는 식이다. 그게 처음엔 김새지만, 곱씹으면 그때 식어준 게 다행이라는 결론에 자주 도달한다.",
      en: "You’re fire, they’re water — water restrains fire. There are moments your high gets dampened next to them. While you’re flying, one calm sentence from them cools the tension. It can sting at first, but on reflection you usually conclude it was lucky they intervened.",
    },
    conversation: {
      ko: "내가 빠르게 결정을 내리려 할 때 상대는 ‘그거 진짜 지금 결정해야 돼?’라고 묻는다. 그 한마디가 답답한 동시에 가장 필요한 질문이다. 혼자였다면 사고를 쳤을 결정을 상대 덕분에 한 번 더 거른 적이 한두 번이 아닐 것이다.",
      en: "When you’re about to decide fast, they ask ‘do you actually have to decide that right now?’ It’s annoying and exactly the question you needed. More than once, a decision that would have backfired solo passes through their filter and survives.",
    },
    synergy: {
      ko: "협업에서는 내가 너무 멀리 가지 않게 잡아주는 역할을 상대가 한다. 내 입장에선 브레이크처럼 느껴질 수 있지만, 둘이 만든 결과물은 어느 한쪽 혼자였다면 너무 과했거나 너무 잠잠했을 것이다.",
      en: "In collaboration they pull you back from going too far. It can feel like a brake to you, but anything you build together avoids the ‘too much’ or ‘too quiet’ extremes either of you would have hit alone.",
    },
    growth: {
      ko: "내 인생에 ‘쟤가 한번 식혀줘서 살았다’ 싶은 결정이 쌓인다. 동시에 상대에게는 내가 ‘그래도 한번 해보자’의 기억이 된다. 약간의 마찰을 견뎌내면 둘 다 인생 친구가 된다.",
      en: "Your life starts collecting decisions saved by their cooling. Meanwhile, you become their ‘okay, let’s actually try it’ memory. Push past a little friction and you both end up calling each other a life friend.",
    },
    tags: {
      ko: ["#쟤가_식혀줘서_안전", "#말리는_친구", "#사고_방지턱"],
      en: ["#they_save_me_from_myself", "#the_voice_of_reason", "#decision_speed_bump"],
    },
  },

  /* ============ 토 행 ============ */
  earth_wood: {
    title: { ko: "내 땅을 뚫고 자라는 나무", en: "A tree breaking through my ground" },
    summary: { ko: "흔들어주는데, 결국 고맙다.", en: "They shake me — and I end up grateful." },
    friendship: {
      ko: "상대가 목, 내가 토. 목극토라 상대가 내 안정된 자리를 자꾸 흔든다. 내 입장에서는 ‘쟤는 왜 이렇게 가만 안 두지’ 싶은 순간이 있지만, 시간이 지나서 보면 그 흔들림 덕분에 내 땅이 더 단단해졌다는 걸 인정하게 된다.",
      en: "They’re wood, you’re earth — wood overcomes earth. They keep shaking the steady place you have built. Your gut reaction is ‘why won’t this person leave me alone?’ But looking back you’ll admit your ground packed firmer because of those shakes.",
    },
    conversation: {
      ko: "상대는 내 익숙한 답변을 받아들이지 않는다. ‘근데 그게 정말 답이야?’라는 식으로 자꾸 질문을 던진다. 처음엔 피곤하지만, 그 덕분에 내가 안주해 있던 영역에서 살짝 빠져나오는 일이 생긴다.",
      en: "They don’t accept your usual stock answers. ‘But is that really the answer?’ keeps coming back at you. It is tiring, and because of it you keep getting pulled out of comfortable little ruts you’d forgotten you were in.",
    },
    synergy: {
      ko: "협업에서는 내가 ‘우리 그동안 이렇게 했잖아’를 들고 오면 상대가 ‘근데 다른 방법은?’을 들고 온다. 둘이 합치면 검증된 방식과 새로운 시도가 모두 살아 있는 결과물이 나온다.",
      en: "In work, you bring ‘this is how we’ve always done it’ and they bring ‘what about another way?’ Combine the two and the output keeps both the proven method and a fresh attempt alive at once.",
    },
    growth: {
      ko: "나는 ‘움직이는 법’을 배우고, 상대는 ‘무엇을 지킬지 아는 법’을 배운다. 처음엔 둘 다 서로가 거북하지만, 어느 시점부턴가 상대가 옆에 없으면 내 결정이 약간 게으르다고 느껴진다.",
      en: "You learn ‘how to move’; they learn ‘what is worth keeping.’ You both find each other prickly at first, then there comes a point when your decisions feel a little lazy whenever they’re not around.",
    },
    tags: {
      ko: ["#쟤가_나를_안주_못하게_해", "#불편한_고마움", "#성장형_친구"],
      en: ["#they_won't_let_me_settle", "#uncomfortable_gratitude", "#growth_friend"],
    },
  },
  earth_fire: {
    title: { ko: "내 위에 떨어진 따스한 재", en: "Warm ash settling on my soil" },
    summary: { ko: "쟤가 옆에 있으면 땅이 따뜻하다.", en: "Their warmth seeps into my ground." },
    friendship: {
      ko: "상대가 화, 내가 토. 화생토라 상대의 활기와 분위기가 내게는 영양분처럼 쌓인다. 평소엔 점잖던 내가 상대 옆에서는 좀 더 큰 소리로 웃고, 좀 더 큰 결정을 한다. 그게 이 우정의 진짜 선물이다.",
      en: "They’re fire, you’re earth — fire produces earth. Their liveliness lands as nutrients on you. The composed version of you laughs louder and decides bigger when they’re around — that is the real gift of this friendship.",
    },
    conversation: {
      ko: "상대가 빠르게 흩뿌리는 말 중에서, 내가 정말 필요한 한 줄을 골라 담는 식이다. 둘 사이에선 같은 말이 두 번씩 굴러간다 — 한 번은 상대 입에서, 한 번은 내 정리 안에서.",
      en: "Among the lines they fling out, you keep the one that mattered. The same sentence ends up running twice between you — once from their mouth, once inside your filing.",
    },
    synergy: {
      ko: "내 차분함과 상대의 추진력이 정확히 보완한다. 상대가 ‘하자!’라고 외칠 때 내가 ‘좋아, 그럼 이렇게 정리해두자’라고 받아주면, 둘이 만든 결과물은 흩어지지 않고 단단하게 남는다.",
      en: "Your steadiness and their drive plug into each other cleanly. When they shout ‘let’s do it!’ and you reply ‘okay, let me file it like this,’ the output stops scattering and starts holding shape.",
    },
    growth: {
      ko: "나는 ‘조금 더 움직여보는 법’을 배우고, 상대는 ‘쌓아두는 법’을 배운다. 둘 다 처음부터 서로가 편안한 건 아닐 수 있지만, 한 번 결이 맞춰지면 평생 가는 종류의 친구다.",
      en: "You learn ‘how to move a bit more’; they learn ‘how to keep something around.’ You may not click instantly, but once the grain aligns, this is a lifelong-kind of friendship.",
    },
    tags: {
      ko: ["#쟤_옆에서_내가_웃는다", "#영양분_같은_사람", "#오래갈_사이"],
      en: ["#i_laugh_more_with_them", "#nutrient_friend", "#built_to_last"],
    },
  },
  earth_earth: {
    title: { ko: "두 개의 들판", en: "Two open fields" },
    summary: { ko: "급할 게 없는 사이.", en: "Never in a rush." },
    friendship: {
      ko: "둘 다 토라 결이 비슷하게 무겁고 안정적이다. 자주 보는 친구는 아니어도, 한 번 만나면 몇 시간이 그냥 흐른다. 큰 사건이 없어도 ‘쟤가 내 사람 중 하나’라는 자각이 천천히 굳어가는 종류의 우정이다.",
      en: "Both earth, both heavy and steady in the same way. You’re not necessarily the most-seen-this-week friends, but when you do meet, hours dissolve. Without any dramatic moment, the certainty of ‘this is one of my people’ slowly hardens.",
    },
    conversation: {
      ko: "대화 톤이 비슷해서 침묵이 어색하지 않다. 둘 다 굳이 분위기를 띄우지 않아도 되는 사이라, 정말 피곤한 날 가장 만나기 편한 친구가 이쪽이다.",
      en: "The tone matches, so silences sit fine. Neither of you needs to perform up the mood, which makes this the friend you can stand to see on the most exhausted day of the week.",
    },
    synergy: {
      ko: "안정적인 운영, 꾸준한 모임 — 이런 일에 강하다. 변화나 모험은 둘 다 약하기 때문에, 누군가 한 명이 외부에서 ‘이거 한번 해볼래?’ 신호를 줘야 움직임이 시작된다.",
      en: "Steady operations and recurring gatherings are your strong suit. Both of you are weak at change and adventure, so movement usually starts only when someone outside drops in a ‘shall we?’ prompt.",
    },
    growth: {
      ko: "성장은 폭발적이지 않지만 깎이지도 않는다. 같이 천천히 단단해지는 종류의 성장이다. 다만 둘 다 안주에 약하다는 걸 인지하고, 가끔은 의식적으로 새로운 곳에 발을 들여놓는 약속을 하는 게 좋다.",
      en: "Growth here isn’t explosive, but nothing erodes either. You harden together, slowly. Just notice that ‘settling in’ is your shared weakness — and occasionally promise each other to step somewhere unfamiliar on purpose.",
    },
    tags: {
      ko: ["#디폴트_사람", "#피곤한_날의_친구", "#있는듯_없는듯_든든"],
      en: ["#default_person", "#tired_day_friend", "#quietly_dependable"],
    },
  },
  earth_metal: {
    title: { ko: "광맥을 품은 흙", en: "Soil that holds the ore" },
    summary: { ko: "내가 너의 단단함을 만든다.", en: "I am where your edge comes from." },
    friendship: {
      ko: "내가 토, 상대가 금. 토생금이라, 내 차분한 일상과 안정감이 상대의 단단함을 만들어낸다. 상대는 평소엔 표현이 적지만, 정말 흔들릴 땐 가장 먼저 나에게 연락한다. 그게 이 관계의 진짜 모습이다.",
      en: "You’re earth, they’re metal — earth produces metal. Your steady everyday life is the bedrock from which their hardness gets forged. They aren’t the most expressive friend, but when something truly shakes them you’re the first call. That is the real face of this bond.",
    },
    conversation: {
      ko: "상대는 결론을 빨리 짓는 결을 가지고 있다. 내 입장에서 ‘잠깐만, 좀 더 보자’ 하는 결을 더해주면, 상대는 평소에 못 보던 디테일을 발견한다. 둘이 같이 있을 때 가장 정확한 결정이 나오는 이유가 여기에 있다.",
      en: "They’re wired to land conclusions quickly. When you add ‘hang on, let’s look once more’ to that, they catch details they’d normally skip. That’s why decisions made together come out the most accurate.",
    },
    synergy: {
      ko: "내가 토양을 깔아주고, 상대가 그 위에서 정밀하게 다듬는다. 협업의 결과물은 단단하고 정확하다. 한 명만 빠지면 이 결과물의 균형이 무너지기 때문에, 서로가 서로를 ‘대체 불가’로 인식하기 쉽다.",
      en: "You lay the soil; they cut and finish on top of it. The output is firm and precise. Pull either of you out and the balance collapses, which is why you both end up seeing each other as ‘not replaceable.’",
    },
    growth: {
      ko: "내 안정감이 상대의 단단함을 키우고, 상대의 단단함이 다시 내 자존감을 단단하게 만든다. 가만히 있어도 서로의 결이 길게 자라는, 보기 드문 우정의 형태다.",
      en: "Your steadiness sharpens their edge, and that sharpened edge feeds your own sense of footing. Even sitting still, you each keep extending the other’s grain — a rare shape of friendship.",
    },
    tags: {
      ko: ["#내가_쟤의_바탕", "#말은_없어도_연결", "#대체_불가"],
      en: ["#i'm_their_bedrock", "#few_words_deep_link", "#not_replaceable"],
    },
  },
  earth_water: {
    title: { ko: "물길을 막는 둑", en: "A dike across the stream" },
    summary: { ko: "내가 너의 흐름을 정리해준다.", en: "I shape the way you flow." },
    friendship: {
      ko: "내가 토, 상대가 수. 토극수라, 자유롭게 흐르려는 상대를 내가 자꾸 잡아둔다. 상대 입장에서 답답할 수 있지만, 그렇기 때문에 상대의 흐름이 흩어지지 않고 어느 한 곳에 모인다.",
      en: "You’re earth, they’re water — earth restrains water. You keep holding back a friend who would rather flow freely. From their side it can feel hemmed in, but that’s exactly how their stream stops scattering and pools somewhere meaningful.",
    },
    conversation: {
      ko: "상대는 생각이 사방으로 퍼지는 결이고, 나는 그걸 정리해주는 결이다. 상대가 ‘이런 것도 있고, 저런 것도 있고’ 하면 내가 ‘그래서 우선순위가 뭐야?’를 묻는다. 둘이 같이 있을 때 그 산만함이 비로소 형태가 된다.",
      en: "They think in every direction at once; you’re the one who tidies. They lay out ‘this and this and this,’ you ask ‘so what’s the priority?’ Their scattered brilliance only becomes shaped when you’re sitting next to them.",
    },
    synergy: {
      ko: "협업에서는 상대의 아이디어 폭주를 내가 ‘이게 진짜 핵심이야’로 간추린다. 한 명만 있다면 결과는 흩어지거나 너무 단조로웠을 텐데, 같이 있으면 ‘넓고 단단한’ 결과가 나온다.",
      en: "In collaboration you trim their idea-flood down to ‘this is the actual point.’ Alone, the output would be scattered or flat. Together it lands ‘wide and firm’ — the rare combination.",
    },
    growth: {
      ko: "나는 ‘유연하게 흐르는 법’을 배우고, 상대는 ‘한 곳에 머무는 법’을 배운다. 단, 너무 막아두기만 하면 상대가 답답해하므로, 가끔은 일부러 흐름을 그대로 놓아주는 미덕이 필요하다.",
      en: "You learn ‘how to flow flexibly’; they learn ‘how to stay in one place.’ Watch out: if you only block, they suffocate. Sometimes the virtue is to let the current go where it wants to go.",
    },
    tags: {
      ko: ["#쟤의_생각을_정리해주는_사람", "#흐름과_뼈대", "#가끔은_놓아주기"],
      en: ["#i_organize_their_chaos", "#flow_meets_frame", "#sometimes_just_let_it_flow"],
    },
  },

  /* ============ 금 행 ============ */
  metal_wood: {
    title: { ko: "다듬어주는 칼", en: "The blade that shapes the wood" },
    summary: { ko: "내 직설이 너를 단단하게 한다.", en: "My bluntness makes you sturdy." },
    friendship: {
      ko: "내가 금, 상대가 목. 금극목이라, 나는 자연스럽게 상대의 거친 결을 다듬는 역할을 맡는다. 상대는 가끔 내 직설에 움찔하지만, 그 한마디 덕분에 자기 결을 더 분명하게 다듬게 된다.",
      en: "You’re metal, they’re wood — metal restrains wood. You naturally end up planing their rough grain. They flinch at your bluntness now and then, yet that single line is what helps them sharpen their own outline.",
    },
    conversation: {
      ko: "상대는 말이 길어지는 결이고, 나는 결론으로 가는 결이다. ‘그래서 핵심이 뭔데?’가 내 입버릇이다. 상대 입장에선 처음엔 답답할 수 있지만, 그 압박 덕분에 상대의 표현이 차차 정확해진다.",
      en: "They get talkative; you head straight for the point. ‘So what’s the actual core?’ is your default line. It can feel impatient to them at first, but the pressure sharpens their expression over time.",
    },
    synergy: {
      ko: "협업에서는 내가 정밀한 절단면을 만들고, 상대가 그 위에 자기만의 색을 입힌다. 둘 중 하나만 있어도 결과물이 안 산다. 내가 깎아내기만 하면 차갑고, 상대가 흩뿌리기만 하면 모양이 안 잡힌다.",
      en: "You make the clean cut; they paint their color over it. Pull either of you and the work loses life. Only your trimming would feel cold; only their scattering would never hold a shape.",
    },
    growth: {
      ko: "나는 ‘부드럽게 미는 법’을 배우고, 상대는 ‘제때 자르는 법’을 배운다. 둘 다 자기에게 부족한 결을 정확히 가진 사람을 만난 셈이라, 시간이 지나면 둘 다 외형이 더 분명해진다.",
      en: "You learn ‘how to push softly’; they learn ‘how to cut on time.’ Each of you happens to be the precise grain the other lacks, and over time both of your outlines come out sharper.",
    },
    tags: {
      ko: ["#내가_쟤를_다듬는다", "#쓴소리지만_사랑", "#성장형_파트너"],
      en: ["#i_shape_them", "#tough_love", "#growth_partner"],
    },
  },
  metal_fire: {
    title: { ko: "나를 녹이는 불", en: "The flame that softens my edge" },
    summary: { ko: "쟤 앞에서는 내가 풀어진다.", en: "I unclench around them." },
    friendship: {
      ko: "내가 금, 상대가 화. 화극금이라, 평소엔 단단하던 내가 상대 앞에서는 의외의 표정을 짓는다. 상대의 활기에 의해 내 차가운 결이 한 번 녹는데, 그게 내 인생에서 흔한 일이 아니라 더 소중하다.",
      en: "You’re metal, they’re fire — fire overcomes metal. Around them, the hardened version of you pulls expressions even close friends rarely see. Their warmth melts your cool grain, and because that doesn’t happen often in your life, this friendship lands as rare.",
    },
    conversation: {
      ko: "내가 결론으로 가려는 순간, 상대는 ‘근데 그거 진짜 재밌어?’라고 묻는다. 처음엔 김새지만, 그 질문 덕분에 내가 잊고 있던 ‘즐거움’이라는 결이 다시 살아난다.",
      en: "Right when you’re about to land a conclusion, they ask ‘but is that actually fun?’ It feels like a derailment, and exactly because of that question the ‘fun’ grain you had been ignoring comes back online.",
    },
    synergy: {
      ko: "내 정밀함이 상대 덕분에 ‘차가운 정확함’이 아니라 ‘따뜻한 정확함’으로 바뀐다. 결과물에 사람의 온도가 묻어 있어서, 같이 만든 일은 길게 살아남는다.",
      en: "Through them your precision turns from ‘cold accuracy’ into ‘warm accuracy.’ The body heat of a person lands inside the work, so what you build together tends to outlive what you build alone.",
    },
    growth: {
      ko: "나는 ‘즐기는 법’을 배우고, 상대는 ‘끝까지 다듬는 법’을 배운다. 다만 상대의 열기가 너무 세면 내 칼날이 약해질 수 있으니, 둘 다 약간의 거리도 인정해주는 게 이 관계의 룰이다.",
      en: "You learn ‘how to enjoy’; they learn ‘how to keep refining to the end.’ Too much of their heat will soften your edge, though, so allowing each other a little distance now and then is the unspoken rule.",
    },
    tags: {
      ko: ["#쟤_앞에서_내가_풀어짐", "#차가움이_따뜻해지는", "#적당한_거리_필요"],
      en: ["#i_soften_around_them", "#cold_turning_warm", "#need_some_distance_too"],
    },
  },
  metal_earth: {
    title: { ko: "땅이 만들어준 칼", en: "Forged from their earth" },
    summary: { ko: "쟤 덕분에 내 결이 단단해진다.", en: "Their ground makes my edge." },
    friendship: {
      ko: "내가 금, 상대가 토. 토생금이라, 상대의 차분한 일상이 내 단단함을 만들어낸다. 상대는 표 안 내고 챙기는 결이라, 내가 자주 의식하진 않지만, 어느 시점에 ‘쟤가 없었다면 내가 이만큼 못 컸겠다’를 깨닫게 된다.",
      en: "You’re metal, they’re earth — earth produces metal. Their unobtrusive everyday looking-after is what forges your hardness. They take care without making a show of it, so you don’t notice in real time. One day it hits you: ‘I wouldn’t have grown this far without them.’",
    },
    conversation: {
      ko: "상대는 결론을 서두르지 않는다. 그 차분함 덕분에 내가 ‘빨리 정리하자’ 모드에서 잠깐 빠져나와, 진짜 듣는 시간을 가질 수 있다. 그 시간에 내 결정의 정확도가 한 단계 올라간다.",
      en: "They don’t rush conclusions. That calm pulls you out of ‘let’s wrap this up’ mode for a moment, just long enough to actually listen. The accuracy of your decisions climbs one full level inside that pause.",
    },
    synergy: {
      ko: "내가 결과물의 날을 세우면, 상대가 그 결과물이 살아남는 토양을 마련한다. 화려한 협업은 아니지만, 결과물의 수명이 길다. 둘 다 외부에서 인정받기까지 시간이 걸리지만, 한번 인정받으면 흔들리지 않는다.",
      en: "You sharpen the edge of the work; they prepare the ground where it survives. The collaboration isn’t flashy, but the output lasts. External recognition arrives slowly, and once it does, it doesn’t wobble.",
    },
    growth: {
      ko: "내가 점점 둥글어지고, 상대도 점점 자기 결을 분명하게 다듬는다. 갈등이 거의 없어서 변화가 느리지만, 1년치를 묶어보면 둘 다 분명히 컸다.",
      en: "You round out a little, and they sharpen a little. There’s almost no conflict, so progress feels slow — but stacked over a year, both of you have clearly grown.",
    },
    tags: {
      ko: ["#말은_안해도_챙김", "#쟤_덕분에_내가_단단함", "#오래가는_조용한_사이"],
      en: ["#unspoken_caretaking", "#they_make_me_solid", "#quiet_lasting_bond"],
    },
  },
  metal_metal: {
    title: { ko: "두 자루의 칼", en: "Two blades on the same rack" },
    summary: { ko: "결론이 빨라서 시간이 안 든다.", en: "Decisions land fast — almost no time wasted." },
    friendship: {
      ko: "둘 다 금이라 결이 정확하고 군더더기가 적다. 만나면 안부보다 본론으로 빨리 들어가지만, 그게 차갑게 느껴지지 않는다. 서로의 결을 알아보는 사이라, 가끔 한 마디만 해도 ‘됐어, 알겠어’가 된다.",
      en: "Both metal — sharp grain, low filler. You skip the small talk and land on the topic fast, and somehow it doesn’t read as cold. You recognize each other’s edge, so a single line is often enough to settle a thing.",
    },
    conversation: {
      ko: "둘 다 결론을 빨리 짓는 결이라 회의가 짧다. 다만 너무 빨리 ‘끝났다’고 판단해서 디테일을 놓치는 일이 있을 수 있다. 한 명이 의도적으로 ‘근데 정말 이게 끝일까?’를 던지는 습관을 가지면 좋다.",
      en: "Both wired for fast conclusions, so meetings stay short. The risk: you label things ‘done’ too quickly and miss a detail. It helps if one of you keeps a deliberate ‘but is this really finished?’ habit.",
    },
    synergy: {
      ko: "협업에서는 결과물의 정밀도가 무섭게 높다. 단, 둘 다 차가운 결이라 사람을 챙기는 부분이 약할 수 있다. 외부에 한 명, 따뜻한 결을 가진 사람을 끌어들이면 그 약점을 덮을 수 있다.",
      en: "The output’s precision is intimidating. But with two cool grains in the room, the human side of work can get neglected. Pulling in one warmer-grained person from outside covers that weakness cleanly.",
    },
    growth: {
      ko: "마찰은 적지만 거울처럼 비추는 사이라, 자기 결의 단점을 가장 빨리 발견하는 친구가 이쪽이다. 너무 닮은 만큼, 의식적으로 ‘다른 결의 사람’과의 시간을 늘리는 게 둘에게 다 유익하다.",
      en: "Friction is low, but you mirror each other, so this is the friend through whom you spot your own flaws fastest. Because the resemblance is so close, deliberately spending time with a different-grained person benefits both of you.",
    },
    tags: {
      ko: ["#본론부터_시작", "#말이_짧아도_통함", "#정밀_듀오"],
      en: ["#straight_to_the_point", "#few_words_full_signal", "#precision_duo"],
    },
  },
  metal_water: {
    title: { ko: "광맥에서 솟아오른 샘", en: "A spring out of ore-rich rock" },
    summary: { ko: "내가 너의 흐름을 만든다.", en: "I’m where your flow begins." },
    friendship: {
      ko: "내가 금, 상대가 수. 금생수라, 내 단단한 결이 상대의 흐름을 만들어낸다. 상대는 평소엔 자유롭게 떠다니다가도, 내 한마디 덕분에 흐름이 ‘어디로 갈지’가 정해지는 경험을 자주 한다.",
      en: "You’re metal, they’re water — metal produces water. Your hardened grain is what shapes their stream. They drift freely most of the time, then a single line of yours decides ‘so this is where the flow goes,’ and that pattern keeps repeating.",
    },
    conversation: {
      ko: "상대의 사고가 사방으로 퍼질 때, 내가 정확한 한 줄로 ‘여기서 시작해보자’라고 잡아준다. 상대는 그 한 줄을 받아서, 자기 흐름의 방향을 정한다. 둘이 함께 쓰는 메모장이 있다면, 내 글씨는 짧고 상대 글씨는 길다.",
      en: "When their thinking sprays in every direction, your one precise line says ‘start here,’ and they pick the line up to set their direction. If you shared a notepad, your handwriting would be short and theirs would be long.",
    },
    synergy: {
      ko: "협업에서는 내가 뼈대를 깎고, 상대가 그 위에 흐름을 만든다. 결과물은 단단하면서도 부드럽고, 정확하면서도 사람을 끌어당긴다. 이 균형이 흔하지 않다는 걸 둘 다 점차 알게 된다.",
      en: "You carve the frame; they make it flow. The output is firm yet soft, precise yet pulling people in. Both of you eventually realize how rare that balance is.",
    },
    growth: {
      ko: "나는 ‘흐르는 법’을 배우고, 상대는 ‘기둥을 세우는 법’을 배운다. 한쪽이 너무 단단해지면 다른 쪽이 흩어지기 때문에, 둘은 서로를 균형추로 자연스럽게 인식한다.",
      en: "You learn ‘how to flow’; they learn ‘how to stand a pillar.’ When one side over-hardens, the other scatters, so you both come to read each other as a counterweight without anyone saying so.",
    },
    tags: {
      ko: ["#내가_쟤의_시작점", "#단단함과_흐름", "#균형추_같은_사이"],
      en: ["#i'm_their_starting_point", "#firmness_and_flow", "#counterweight_friend"],
    },
  },

  /* ============ 수 행 ============ */
  water_wood: {
    title: { ko: "나무를 키우는 물", en: "The water that grows the tree" },
    summary: { ko: "내 한마디가 쟤를 키운다.", en: "One line from me grows them." },
    friendship: {
      ko: "내가 수, 상대가 목. 수생목이라, 내 차분한 흐름이 상대의 성장을 받쳐준다. 화려하게 도와주는 게 아니라, 그냥 옆에 있는 것만으로 상대가 잘 자라는 종류의 우정이다. 상대도 그걸 본능적으로 안다.",
      en: "You’re water, they’re wood — water nurtures wood. Your calm current quietly props up their growth. It isn’t flashy support; just being beside them helps them grow. They sense it instinctively, even if they never name it.",
    },
    conversation: {
      ko: "내 말은 짧지만 깊다. 상대가 한껏 흥분해 떠들고 나면, 내 마지막 한 줄이 그 흥분을 ‘진짜 결정’으로 옮긴다. 상대 입장에서는 ‘쟤한테 말하면 이상하게 정리가 돼’라고 여기게 된다.",
      en: "Your lines are few and deep. After they’ve let out a wave of excited talk, your closing sentence is what shifts the excitement into an actual decision. From their side it becomes ‘weirdly, things settle when I tell them.’",
    },
    synergy: {
      ko: "협업에서는 내가 리서치와 정리를, 상대가 추진과 표현을 맡는 식이 자연스럽다. 내 깊이 위에서 상대의 성장이 빨라지고, 상대의 추진력 덕분에 내 차분함이 결과물로 남는다.",
      en: "In work, you handle research and structuring while they take drive and expression. Your depth speeds up their growth; their drive turns your calm into something that actually ships.",
    },
    growth: {
      ko: "내 입장에서 가장 보람 있는 우정이다. 상대가 자라는 모습을 옆에서 보는 일이 곧 내 만족이 되기 때문이다. 다만 너무 자기 흐름을 다 내주지 말고, 내 영양분도 챙겨두는 게 길게 가기 위한 조건이다.",
      en: "From your side, this is one of the most fulfilling friendships — watching them grow becomes part of your own satisfaction. The condition for it lasting: don’t give the whole stream away, keep some nutrients for yourself too.",
    },
    tags: {
      ko: ["#쟤가_크는_게_내_보람", "#멘토_같은_친구", "#영양분_듀오"],
      en: ["#their_growth_is_my_reward", "#mentor_friend", "#nutrient_duo"],
    },
  },
  water_fire: {
    title: { ko: "타오르는 불을 식히는 비", en: "Rain over a roaring fire" },
    summary: { ko: "내가 쟤의 사고를 막아준다.", en: "I keep them from going off." },
    friendship: {
      ko: "내가 수, 상대가 화. 수극화라, 상대가 들떠 폭주하려 할 때 내가 자연스럽게 식혀주는 역할을 맡는다. 상대 입장에서는 가끔 김새지만, 그 덕분에 사고를 안 친 결정이 한두 번이 아니다.",
      en: "You’re water, they’re fire — water restrains fire. When they’re about to over-rev, you reflexively cool them down. From their side it can feel deflating, and they will quietly admit later that more than one would-be disaster passed through your filter.",
    },
    conversation: {
      ko: "상대의 말이 빠를수록 내 한마디가 더 큰 무게로 떨어진다. ‘근데 그거 정말 지금 결정해야 돼?’라는 질문이 내 입에서 나오는 순간, 상대는 한 박자 멈춘다. 그 한 박자가 결과적으로 둘 모두에게 좋은 일이다.",
      en: "The faster they speak, the heavier your single sentence lands. The moment ‘do you actually have to decide that right now?’ leaves your mouth, they catch a beat. That beat ends up being good for both of you.",
    },
    synergy: {
      ko: "내가 위험을 미리 짚고, 상대가 그래도 한번 가보자고 밀고 나간다. 한 명이라도 빠지면 결과는 둘 중 하나다 — 너무 안전해서 아무것도 안 일어나거나, 너무 폭주해서 무너지거나.",
      en: "You flag the risk; they push us forward anyway. Pull either of you out and the result lands on one of two extremes — too safe to make anything happen, or too reckless to survive.",
    },
    growth: {
      ko: "나는 ‘그래도 한번 해보자’를 배우고, 상대는 ‘잠깐 멈춰보자’를 배운다. 둘이 서로의 부족한 결을 정확히 채우는 관계라, 마찰은 있어도 결국 깊은 친구가 된다.",
      en: "You learn ‘let’s actually try it’ from them; they learn ‘let’s pause for a second’ from you. You patch each other’s exact missing piece, and even with friction, this lands as a deep friendship.",
    },
    tags: {
      ko: ["#쟤_사고_방지턱", "#말리는_친구", "#균형이_생명"],
      en: ["#their_speed_bump", "#voice_of_reason", "#balance_is_everything"],
    },
  },
  water_earth: {
    title: { ko: "내 물길을 막는 둑", en: "A dike across my flow" },
    summary: { ko: "쟤가 옆에 없으면 내가 흩어진다.", en: "Without them, I scatter." },
    friendship: {
      ko: "내가 수, 상대가 토. 토극수라, 내 자유로운 흐름을 상대가 자꾸 한 곳에 모아둔다. 답답할 때도 있지만, 상대가 없으면 내 생각은 그냥 흩뿌려진 채 흘러갔을 거라는 걸 시간이 지날수록 인정하게 된다.",
      en: "You’re water, they’re earth — earth restrains water. They keep gathering your free-flowing self into one spot. You bristle at it sometimes, then admit, more and more as time passes, that without them your thoughts would just run off into nothing.",
    },
    conversation: {
      ko: "내가 ‘이런 것도 있고 저런 것도 있고’ 하면 상대가 ‘근데 그래서 너 뭐 하고 싶은 건데?’를 묻는다. 처음엔 답답하지만, 그 질문 덕분에 내가 진짜로 원하는 게 무엇인지 명확해진다.",
      en: "You list ‘this and this and this’; they ask ‘but what do you actually want to do?’ Stifling at first, and because of that question the thing you really want underneath finally surfaces.",
    },
    synergy: {
      ko: "내 아이디어가 상대의 손을 거치면 ‘실행 가능한 일’이 된다. 상대 입장에서도 내가 없으면 일이 단조로워진다는 걸 알기 때문에, 둘은 서로를 ‘없으면 안 되는 결’로 인식하기 쉽다.",
      en: "Your ideas turn into ‘things that can actually be done’ once they handle them. From their side, work without you tends to flatten. So you both come to see each other as a grain you can’t really do without.",
    },
    growth: {
      ko: "나는 ‘한 곳에 머무는 법’을 배우고, 상대는 ‘흘러가게 두는 법’을 배운다. 단, 너무 막아두기만 하면 내가 답답해지므로, 가끔은 일부러 내 흐름을 그대로 인정해주는 시간이 필요하다.",
      en: "You learn ‘how to stay in one place’; they learn ‘how to let things flow.’ The watchout: if they only block, you suffocate, so they need to let your current run as it wants from time to time.",
    },
    tags: {
      ko: ["#쟤_없으면_내가_흩어짐", "#답답하지만_고마운", "#실행해주는_친구"],
      en: ["#i_scatter_without_them", "#stifling_but_grateful", "#they_actually_ship_it"],
    },
  },
  water_metal: {
    title: { ko: "광맥에서 솟아오른 나의 샘", en: "My spring rising from their ore" },
    summary: { ko: "쟤 덕분에 내 흐름이 시작된다.", en: "My flow begins because of them." },
    friendship: {
      ko: "내가 수, 상대가 금. 금생수라, 상대의 단단한 결이 내 흐름을 만들어낸다. 상대는 평소엔 차갑게 보일 수 있지만, 그 단단함이 내게는 가장 안정된 시작점이 된다.",
      en: "You’re water, they’re metal — metal produces water. Their hardened grain is what shapes the start of your flow. They can look cool from outside, and to you that very hardness is the most stable starting point you have.",
    },
    conversation: {
      ko: "상대의 한 줄은 짧고 정확하다. 내가 사방으로 흐를 때, 그 한 줄이 ‘여기서 시작해’라고 알려주는 등대가 된다. 상대 입장에서도 내 흐름 덕분에 자기 결이 너무 차갑게만 굳지 않는다는 걸 안다.",
      en: "Their lines are short and exact. When you’re flowing in every direction, that one line works as the lighthouse saying ‘start here.’ They notice, too, that your current keeps their grain from freezing into something only cold.",
    },
    synergy: {
      ko: "협업에서는 상대가 뼈대를 깎고, 내가 그 위에 흐름을 채운다. 결과물은 단단하면서도 부드럽고, 표면은 매끄럽지만 그 아래 단단한 광맥이 보인다.",
      en: "In collaboration they carve the frame and you fill the flow over it. The output is firm yet soft, smooth on the surface with hard ore visible just underneath.",
    },
    growth: {
      ko: "나는 상대의 정밀함에서 ‘기둥 세우는 법’을 배우고, 상대는 내 흐름에서 ‘부드럽게 흐르는 법’을 배운다. 가만히 둬도 둘은 점점 닮아간다.",
      en: "You pick up ‘how to stand a pillar’ from their precision; they pick up ‘how to flow soft’ from yours. Left alone, the two of you slowly start to resemble each other.",
    },
    tags: {
      ko: ["#쟤가_내_시작점", "#정밀함_위의_흐름", "#말없이_닮아가는"],
      en: ["#they're_my_starting_point", "#flow_over_precision", "#growing_alike_in_silence"],
    },
  },
  water_water: {
    title: { ko: "두 개의 강", en: "Two rivers, one valley" },
    summary: { ko: "말이 적어도 다 안다.", en: "Few words, full understanding." },
    friendship: {
      ko: "둘 다 수라 결이 깊고 조용하다. 큰 사건이 없어도 만나면 마음이 많이 풀린다. 상대가 말 안 해도 내가 알고, 내가 말 안 해도 상대가 안다 — 그게 가장 자연스러운 사이가 이쪽이다.",
      en: "Both water — deep grain, quiet flow. You don’t need a big event for the meet-up to leave you lighter. They know without you saying, you know without them saying — and it really is that natural a friendship.",
    },
    conversation: {
      ko: "둘 다 침묵을 어색해하지 않는다. 카페에서 한참 말 없이 앉아 있다가 한 명이 ‘아까 그거 말이야’ 하면, 다른 한 명이 ‘응’으로 받는 식이다. 외부에선 이해가 안 가는 결이지만, 본인들은 그게 가장 편하다.",
      en: "Neither of you minds silence. You sit quiet in a café for a long stretch, one of you says ‘about earlier,’ and the other answers ‘yeah’ — and that’s the entire exchange. Outsiders don’t get it; you find nothing more comfortable.",
    },
    synergy: {
      ko: "둘 다 깊이가 있어서 함께 만든 결과물은 묵직하다. 다만 둘 다 외부 추진력은 약하기 때문에, 한 명이라도 의식적으로 ‘이걸 일정에 올리자’고 말하지 않으면 영원히 머릿속에서만 굴러간다.",
      en: "Both deep, so anything you build together carries weight. But neither of you generates much push, so unless one of you consciously says ‘let’s put this on the calendar,’ the project keeps living only inside your heads.",
    },
    growth: {
      ko: "성장은 폭발적이지 않지만, 결의 깊이는 둘 다 매년 깊어진다. 같이 보낸 시간이 길수록 ‘이 친구는 평생 친구겠구나’라는 자각이 점점 뚜렷해진다.",
      en: "Growth here isn’t explosive — but the depth of your grain keeps deepening year by year. The more time you log together, the more the realization sharpens: ‘this one’s a lifelong friend.’",
    },
    tags: {
      ko: ["#침묵이_안_어색한", "#말안해도_통함", "#평생_친구"],
      en: ["#silence_isn't_awkward", "#unspoken_understanding", "#lifelong_friend"],
    },
  },
};
