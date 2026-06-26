"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { AdBottom, AdMobileSticky } from "@/app/components/Ads";
import { homeBackLabel } from "@/app/components/BrandMark";
import RecommendedGames from "@/app/components/game/RecommendedGames";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import { trackResultView, trackShareClick, trackTestStart } from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";

type LifeSharePayload = { v: 2; name: string; locale?: SimpleLocale };
type Pair = { ko: string; en: string };
type LifeStoryContext = {
  name: string;
  birthYear: number;
  finalYear: number;
  region: Pair;
  role: Pair;
  remembered: Pair;
  season: Pair;
  finalObject: Pair;
};
type LifeStoryBuilder = (context: LifeStoryContext, locale: SimpleLocale) => string[];
type Archetype = {
  title: Pair;
  subtitle?: Pair;
  roles: Pair[];
  regions: Pair[];
  remembered: Pair[];
  finalObjects: Pair[];
  child: Pair;
  turn: Pair;
  hardship: Pair;
  bond: Pair;
  achievement: Pair;
  later: Pair;
  finalLine: Pair;
  lifeStory?: LifeStoryBuilder;
};
type LifeResult = {
  archetype: Archetype;
  birthYear: number;
  finalYear: number;
  region: Pair;
  role: Pair;
  remembered: Pair;
  season: Pair;
  finalObject: Pair;
  paragraphs: { ko: string[]; en: string[] };
};

const ARCHETYPES: Archetype[] = [
  {
    title: { ko: "시대보다 조금 빨리 태어난 사람", en: "The One Born a Little Ahead of Time" },
    roles: [{ ko: "역관", en: "interpreter" }, { ko: "기록관", en: "archivist" }, { ko: "서책가", en: "bookseller" }],
    regions: [{ ko: "한양 서촌", en: "Seochon, Hanyang" }, { ko: "평안도 의주", en: "Uiju, Pyeongan" }, { ko: "경상도 대구", en: "Daegu, Gyeongsang" }],
    remembered: [{ ko: "시대보다 먼저 물은 사람", en: "the person who asked before the age was ready" }, { ko: "낯선 생각을 두려워하지 않은 사람", en: "the one unafraid of unfamiliar ideas" }],
    finalObjects: [{ ko: "낡은 붓 한 자루", en: "a worn writing brush" }, { ko: "끝까지 고친 원고 몇 장", en: "a few pages corrected until the end" }],
    child: { ko: "어릴 적 당신은 남들이 그냥 지나치는 말을 오래 붙잡는 아이였습니다. 어른들이 쓸데없다 한 질문들이 당신에게는 세상을 여는 작은 문처럼 느껴졌습니다.", en: "As a child, you held on to questions others walked past. What adults called useless felt like small doors into the world." },
    turn: { ko: "열일곱이 되던 해, 당신은 낡은 책 한 권을 밤새 읽고 처음으로 고향 밖의 생각을 품었습니다.", en: "At seventeen, you read an old book through the night and first imagined a thought beyond your hometown." },
    hardship: { ko: "세상은 자주 느렸고, 당신의 마음은 자주 먼저 도착했습니다. 그래서 이해받지 못한 날들이 당신을 단단하게 만들었습니다.", en: "The world was often slow, and your heart often arrived early. The days of being misunderstood made you steadier." },
    bond: { ko: "당신의 삶에는 침묵으로 곁을 지켜준 한 사람이 있었습니다. 그 사람은 당신의 낯선 생각을 비웃지 않았습니다.", en: "There was one person who stayed beside you in silence. They never laughed at your unfamiliar ideas." },
    achievement: { ko: "당신은 이름을 크게 알리기보다, 언젠가 누군가 읽어줄 문장을 남기는 쪽을 택했습니다.", en: "You chose not to chase a loud name, but to leave sentences someone might understand one day." },
    later: { ko: "나이가 들수록 당신은 더 적게 말했습니다. 그러나 젊은 이들은 당신의 짧은 기록 앞에서 오래 멈춰 섰습니다.", en: "With age, you spoke less. Yet younger people often paused before your brief notes." },
    finalLine: { ko: "그 사람은 시대의 중심에 서지 않았지만, 뒤늦게 읽히는 질문 하나를 남겼다.", en: "They never stood at the center of the age, but left behind a question people understood later." },
  },
  {
    title: { ko: "한양으로 올라간 조용한 야심가", en: "The Quiet Ambition That Walked to Hanyang" },
    roles: [{ ko: "서리", en: "clerk" }, { ko: "상인", en: "merchant" }, { ko: "문서관", en: "record keeper" }],
    regions: [{ ko: "전라도 나주", en: "Naju, Jeolla" }, { ko: "충청도 공주", en: "Gongju, Chungcheong" }, { ko: "강원도 원주", en: "Wonju, Gangwon" }],
    remembered: [{ ko: "조용히 자기 자리를 만든 사람", en: "the one who quietly made a place" }, { ko: "이름보다 방향을 믿은 사람", en: "the one who trusted direction more than fame" }],
    finalObjects: [{ ko: "오래 쓴 장부", en: "a worn ledger" }, { ko: "접어 둔 고향 편지", en: "a folded letter from home" }],
    child: { ko: "어릴 때부터 당신은 칭찬을 크게 바라지는 않았지만, 마음속에는 늘 먼 곳을 향한 조용한 욕심이 있었습니다.", en: "Even as a child, you did not loudly ask for praise, but carried a quiet hunger for somewhere farther away." },
    turn: { ko: "스무 살이 되던 해, 당신은 작은 보따리 하나를 메고 한양으로 향했습니다.", en: "At twenty, you took one small bundle and walked toward Hanyang." },
    hardship: { ko: "한양에서의 첫해는 만만하지 않았습니다. 웃음 뒤에 숨은 계산과 두려움을 배우는 데 오래 걸렸습니다.", en: "The first year in the capital was not gentle. It took time to learn the calculation and fear hidden behind smiles." },
    bond: { ko: "당신을 버티게 한 것은 화려한 성공이 아니라, 아무 이유 없이 건네진 따뜻한 말 한마디였습니다.", en: "What helped you endure was not success, but one warm sentence offered for no reason." },
    achievement: { ko: "중년의 당신은 손에 쥔 일은 끝까지 해내는 사람으로 알려졌습니다.", en: "In middle age, you became known as someone who finished whatever was placed in your hands." },
    later: { ko: "돌아가고 싶은 계절도 있었지만, 당신은 돌아가는 대신 선 자리 위에 작은 기둥을 세웠습니다.", en: "There were seasons when you wished to return, but instead you built a small pillar where you stood." },
    finalLine: { ko: "그 이름은 크게 울리지 않았으나, 끝내 자신이 걸어갈 길을 잃지 않았다.", en: "The name was never loud, but it never lost the road it meant to walk." },
  },
  {
    title: { ko: "마을을 지킨 조용한 현자", en: "The Quiet Sage Who Kept the Village" },
    roles: [{ ko: "훈장", en: "village teacher" }, { ko: "약방 조력자", en: "apothecary aide" }, { ko: "마을 어른", en: "village elder" }],
    regions: [{ ko: "경기도 양평", en: "Yangpyeong, Gyeonggi" }, { ko: "전라도 순천", en: "Suncheon, Jeolla" }, { ko: "경상도 안동", en: "Andong, Gyeongsang" }],
    remembered: [{ ko: "사람들이 돌아오는 집 같은 사람", en: "the person people returned to like a house" }, { ko: "소란 없이 많은 것을 지킨 사람", en: "the one who protected much without noise" }],
    finalObjects: [{ ko: "마루 곁의 찻잔", en: "a teacup beside the wooden floor" }, { ko: "손때 묻은 약첩", en: "a well-worn packet of herbs" }],
    child: { ko: "어릴 적 당신은 늘 사람들의 뒤편에 있었습니다. 하지만 누가 울음을 참는지 가장 먼저 알아차렸습니다.", en: "As a child, you often stood at the edge of the room, yet noticed first who was holding back tears." },
    turn: { ko: "젊은 날, 당신은 멀리 떠날 기회 앞에서 마을에 남는 쪽을 택했습니다.", en: "In youth, you had chances to leave, but chose to remain in the village." },
    hardship: { ko: "남는다는 것은 쉬운 선택이 아니었습니다. 누군가의 무너진 하루를 반복해서 받아내는 일이었기 때문입니다.", en: "Staying was not easy. It meant receiving, again and again, the broken days of others." },
    bond: { ko: "당신의 인생에는 오래된 친구 같은 사랑이 있었습니다. 크게 불타오르지는 않았지만 해마다 같은 꽃처럼 돌아왔습니다.", en: "Your life held a love like an old friend. It did not burn loudly, but returned each year like the same flower." },
    achievement: { ko: "어려운 일이 생길 때마다 사람들은 당신의 집 문을 두드렸습니다.", en: "Whenever hardship came, people knocked at your door." },
    later: { ko: "나이가 들자 말은 더 짧아졌지만, 사람들은 그 짧은 말 속에서 길을 찾았습니다.", en: "As you aged, your words grew shorter, yet people found roads inside them." },
    finalLine: { ko: "그 사람은 세상을 바꾸지 않았지만, 많은 사람이 무너지지 않게 했다.", en: "They did not change the world, but kept many people from falling apart." },
  },
  {
    title: { ko: "기록으로 남은 서책가", en: "The Bookseller Who Remained as a Record" },
    roles: [{ ko: "서책가", en: "bookseller" }, { ko: "필사공", en: "copyist" }, { ko: "문집 편찬자", en: "editor of writings" }],
    regions: [{ ko: "한양 종로", en: "Jongno, Hanyang" }, { ko: "전라도 전주", en: "Jeonju, Jeolla" }, { ko: "충청도 청주", en: "Cheongju, Chungcheong" }],
    remembered: [{ ko: "잊힌 이야기를 붙잡은 사람", en: "the one who held forgotten stories" }, { ko: "사라지는 이름을 종이에 남긴 사람", en: "the one who kept fading names on paper" }],
    finalObjects: [{ ko: "끝내 묶지 못한 문집", en: "an unfinished collection of writings" }, { ko: "먹빛이 번진 편지", en: "a letter blurred with ink" }],
    child: { ko: "어릴 적 당신은 사람보다 종이 냄새에 먼저 마음이 갔습니다. 낡은 책장을 넘길 때마다 모르는 삶들이 조용히 말을 걸었습니다.", en: "As a child, you were drawn first to the smell of paper. Each old page seemed to speak with a life you had never known." },
    turn: { ko: "열아홉의 봄, 당신은 우연히 버려진 기록 묶음을 주웠고, 그날 이후 사라지는 것들을 그냥 두지 못했습니다.", en: "At nineteen, you found a bundle of discarded records, and after that could not leave vanishing things alone." },
    hardship: { ko: "기록하는 삶은 가난하고 느렸습니다. 어떤 이야기는 적는 것만으로도 누군가의 미움을 샀습니다.", en: "A life of recording was poor and slow. Some stories earned resentment simply by being written." },
    bond: { ko: "당신 곁에는 늘 글을 먼저 읽어주는 한 사람이 있었습니다. 그 사람의 침묵은 가장 정직한 비평이었습니다.", en: "Beside you was someone who always read your writing first. Their silence was the most honest criticism." },
    achievement: { ko: "당신은 억울한 사람의 사연과 잊힌 약속을 적어, 작은 책방 안에 한 시대의 뒷모습을 모았습니다.", en: "You wrote down wronged lives and forgotten promises, gathering the back of an age inside a small bookshop." },
    later: { ko: "말년의 당신은 책을 팔기보다 사람의 이야기를 들어주는 시간이 더 많았습니다.", en: "In later years, you spent more time listening to lives than selling books." },
    finalLine: { ko: "그 사람의 이름은 작았으나, 남긴 문장은 오래 사람들 곁을 걸었다.", en: "Their name was small, but the sentences they left walked beside people for a long time." },
  },
  {
    title: { ko: "장터에서 세상을 배운 상인", en: "The Merchant Who Learned the World in the Market" },
    roles: [{ ko: "보부상", en: "traveling merchant" }, { ko: "포목상", en: "cloth merchant" }, { ko: "장터 중개인", en: "market broker" }],
    regions: [{ ko: "경상도 밀양", en: "Miryang, Gyeongsang" }, { ko: "전라도 남원", en: "Namwon, Jeolla" }, { ko: "황해도 해주", en: "Haeju, Hwanghae" }],
    remembered: [{ ko: "사람의 마음값을 알던 사람", en: "the one who knew the worth of people's hearts" }, { ko: "웃음으로 길을 연 사람", en: "the one who opened roads with laughter" }],
    finalObjects: [{ ko: "손때 묻은 저울", en: "a hand-worn scale" }, { ko: "빛바랜 비단 조각", en: "a faded piece of silk" }],
    child: { ko: "어릴 적 당신은 사람 많은 곳에서 겁먹기보다 귀가 먼저 열리는 아이였습니다. 흥정하는 말투와 웃음의 결을 빠르게 배웠습니다.", en: "As a child, crowded places opened your ears instead of frightening you. You quickly learned the texture of bargaining and laughter." },
    turn: { ko: "스물둘의 여름, 당신은 처음으로 먼 장길에 올랐고, 길 위에서 세상이 책보다 넓다는 것을 알았습니다.", en: "At twenty-two, you took your first long market road and learned the world was wider than books." },
    hardship: { ko: "장터는 다정하면서도 냉정했습니다. 믿었던 약속이 깨진 날, 당신은 사람을 믿되 장부도 믿어야 한다는 것을 배웠습니다.", en: "The market was kind and cold at once. When a trusted promise broke, you learned to trust people and ledgers both." },
    bond: { ko: "당신에게는 먼 길을 함께 걸은 동무가 있었습니다. 둘은 말다툼을 자주 했지만, 비 오는 날이면 자연스레 같은 처마 아래 섰습니다.", en: "You had a companion who walked long roads with you. You argued often, yet always stood under the same eaves when rain came." },
    achievement: { ko: "중년의 당신은 물건보다 사람의 사정을 먼저 읽는 상인으로 알려졌습니다.", en: "In middle age, you became known as a merchant who read people's circumstances before their goods." },
    later: { ko: "나이가 들자 당신은 가장 좋은 물건을 팔기보다, 좋은 사람을 서로 이어주는 일을 더 즐겼습니다.", en: "With age, you enjoyed connecting good people more than selling the finest goods." },
    finalLine: { ko: "그 사람은 큰 재물을 남기지 않았지만, 많은 인연의 길목에 이름을 남겼다.", en: "They left no great wealth, but their name remained at the crossroads of many bonds." },
  },
  {
    title: { ko: "사랑보다 신념을 택한 사람", en: "The One Who Chose Conviction Over Love" },
    roles: [{ ko: "선비", en: "scholar" }, { ko: "상소문 필사자", en: "petition copyist" }, { ko: "향교 유생", en: "local academy student" }],
    regions: [{ ko: "경상도 진주", en: "Jinju, Gyeongsang" }, { ko: "충청도 예산", en: "Yesan, Chungcheong" }, { ko: "전라도 광주", en: "Gwangju, Jeolla" }],
    remembered: [{ ko: "마음을 쉽게 팔지 않은 사람", en: "the one who never sold their heart cheaply" }, { ko: "외로움 속에서도 뜻을 접지 않은 사람", en: "the one who kept conviction through loneliness" }],
    finalObjects: [{ ko: "보내지 못한 편지", en: "an unsent letter" }, { ko: "붉은 실로 묶은 서찰", en: "letters tied with red thread" }],
    child: { ko: "어릴 적 당신은 한 번 옳다고 믿은 일에서는 쉽게 물러서지 않는 아이였습니다.", en: "As a child, once you believed something was right, you did not step back easily." },
    turn: { ko: "열여덟의 겨울, 당신은 한 어른이 침묵으로 억울함을 삼키는 장면을 보았습니다. 그날 이후 당신은 조용한 불씨를 품었습니다.", en: "At eighteen, you saw an elder swallow injustice in silence. After that day, you carried a quiet ember." },
    hardship: { ko: "뜻을 지키는 삶은 자주 다정한 것들을 멀어지게 했습니다. 당신은 잃지 않기 위해 오히려 놓아야 하는 순간들을 배웠습니다.", en: "A life of conviction often pushed tender things away. You learned there are moments when keeping something means letting it go." },
    bond: { ko: "당신의 삶에는 끝내 다 말하지 못한 사랑이 있었습니다. 그 마음은 고백보다 오래 남아 당신의 선택을 비추었습니다.", en: "Your life held a love you never fully spoke. It lasted longer than confession and lit your choices." },
    achievement: { ko: "당신은 작은 글과 조용한 증언으로 누군가의 억울함을 덜어주었습니다.", en: "With small writings and quiet testimony, you eased someone else's injustice." },
    later: { ko: "말년의 당신은 더 부드러워졌지만, 끝내 자신의 기준을 버리지는 않았습니다.", en: "In later years, you became gentler, but never abandoned your standard." },
    finalLine: { ko: "그는 사랑을 잃은 사람이 아니라, 사랑으로도 꺾이지 않은 마음을 가진 사람이었다.", en: "They were not someone who lost love, but someone whose heart was not bent even by love." },
  },
  {
    title: { ko: "늦여름에 다시 피어난 사람", en: "The One Who Bloomed Again in Late Summer" },
    roles: [{ ko: "염색장", en: "dyer" }, { ko: "수공 장인", en: "artisan" }, { ko: "찻집 주인", en: "teahouse keeper" }],
    regions: [{ ko: "전라도 담양", en: "Damyang, Jeolla" }, { ko: "경기도 강화", en: "Ganghwa, Gyeonggi" }, { ko: "강원도 강릉", en: "Gangneung, Gangwon" }],
    remembered: [{ ko: "무너진 뒤 다시 빛을 낸 사람", en: "the one who shone again after falling" }, { ko: "늦게 피어 오래 남은 사람", en: "the one who bloomed late and remained long" }],
    finalObjects: [{ ko: "빛이 바랜 물감 접시", en: "a faded dish of pigment" }, { ko: "찻잎 향이 밴 상자", en: "a box scented with tea leaves" }],
    child: { ko: "어릴 적 당신은 손으로 무언가를 만드는 일을 좋아했습니다. 작은 색과 모양이 마음을 달래준다는 것을 일찍 알았습니다.", en: "As a child, you loved making things with your hands. You learned early that small colors and shapes could soothe the heart." },
    turn: { ko: "젊은 날의 한 실패는 당신을 오래 멈춰 세웠습니다. 그러나 멈춘 시간 속에서 당신은 자신을 다시 빚는 법을 배웠습니다.", en: "One failure in youth stopped you for a long time. In that stillness, you learned how to remake yourself." },
    hardship: { ko: "사람들은 늦은 시작을 쉽게 기다려주지 않았습니다. 당신은 서두르는 대신 하루에 하나씩 다시 쌓았습니다.", en: "People did not easily wait for a late beginning. Instead of rushing, you rebuilt one day at a time." },
    bond: { ko: "당신을 일으킨 것은 대단한 약속이 아니라, 매일 같은 시간 찾아온 조용한 손님이었습니다.", en: "What lifted you was not a grand promise, but a quiet guest who returned at the same hour each day." },
    achievement: { ko: "중년의 당신은 상처를 감추는 솜씨가 아니라, 상처 뒤의 색을 살리는 솜씨로 알려졌습니다.", en: "In middle age, you became known not for hiding wounds, but for bringing out the color after them." },
    later: { ko: "나이가 들수록 당신의 집에는 서두르지 않아도 된다는 공기가 머물렀습니다.", en: "As you aged, your house carried an air that said there was no need to hurry." },
    finalLine: { ko: "그 사람은 늦게 피었으나, 가장 오래 기억되는 계절이 되었다.", en: "They bloomed late, yet became the season remembered the longest." },
  },
  {
    title: { ko: "궁궐 밖의 숨은 조력자", en: "The Hidden Helper Outside the Palace" },
    roles: [{ ko: "의금부 서리", en: "bureau clerk" }, { ko: "궁 밖 심부름꾼", en: "palace errand runner" }, { ko: "문서 전달자", en: "document courier" }],
    regions: [{ ko: "한양 남산 아래", en: "below Namsan, Hanyang" }, { ko: "경기도 수원", en: "Suwon, Gyeonggi" }, { ko: "황해도 개성", en: "Gaeseong, Hwanghae" }],
    remembered: [{ ko: "앞에 서지 않고 많은 일을 바꾼 사람", en: "the one who changed much without standing in front" }, { ko: "그늘에서 길을 만든 사람", en: "the one who made roads from the shade" }],
    finalObjects: [{ ko: "봉인이 남은 문서끈", en: "a document cord with a seal mark" }, { ko: "작은 놋쇠 표식", en: "a small brass token" }],
    child: { ko: "어릴 적 당신은 눈에 띄는 아이는 아니었습니다. 그러나 누가 어떤 문을 지나 어디로 가는지 이상하게 잘 기억했습니다.", en: "As a child, you were not conspicuous. Yet you strangely remembered who passed which door and where they went." },
    turn: { ko: "스물넷의 봄, 당신은 우연히 한 문서를 제때 전해 한 사람의 운명을 바꾸었습니다.", en: "At twenty-four, you happened to deliver one document in time and changed a person's fate." },
    hardship: { ko: "숨은 자리에서 일하는 사람은 공을 쉽게 인정받지 못했습니다. 때로는 침묵이 당신의 가장 무거운 임무였습니다.", en: "Those who work from hidden places are rarely credited. Sometimes silence was your heaviest duty." },
    bond: { ko: "당신의 진짜 마음을 아는 사람은 많지 않았습니다. 다만 한 사람만은 당신이 왜 뒤에 서는지 알고 있었습니다.", en: "Few knew your true heart. Only one person understood why you stood behind others." },
    achievement: { ko: "당신은 큰 이름 없이도 누군가의 길을 열고, 막힌 문 앞에서 필요한 틈을 만들었습니다.", en: "Without a great name, you opened roads for others and made necessary gaps before closed doors." },
    later: { ko: "말년의 당신은 누구도 묻지 않는 일들을 조용히 정리했습니다.", en: "In later years, you quietly put in order matters nobody thought to ask about." },
    finalLine: { ko: "그 사람은 역사 앞면에 없었으나, 누군가의 삶에서는 가장 중요한 여백이었다.", en: "They were not on the front of history, but were the most important margin in someone's life." },
  },
  {
    title: { ko: "바람이 머문 길 위의 이야기꾼", en: "The Storyteller on the Road Where Wind Stayed" },
    roles: [{ ko: "이야기꾼", en: "storyteller" }, { ko: "길손", en: "traveler" }, { ko: "노래패 동행자", en: "troupe companion" }],
    regions: [{ ko: "강원도 평창", en: "Pyeongchang, Gangwon" }, { ko: "함경도 원산", en: "Wonsan, Hamgyeong" }, { ko: "충청도 보은", en: "Boeun, Chungcheong" }],
    remembered: [{ ko: "마을과 마을 사이에 마음을 전한 사람", en: "the one who carried hearts between villages" }, { ko: "남의 이야기를 자기처럼 품은 사람", en: "the one who held others' stories as their own" }],
    finalObjects: [{ ko: "닳은 짚신 한 켤레", en: "a worn pair of straw shoes" }, { ko: "손때 묻은 이야기책", en: "a hand-worn storybook" }],
    child: { ko: "어릴 적 당신은 한곳에 오래 앉아 있지 못했습니다. 바람 소리와 길 끝의 소문이 늘 당신을 불렀습니다.", en: "As a child, you could not sit still long. The sound of wind and rumors at the end of roads kept calling you." },
    turn: { ko: "열여덟의 어느 장날, 당신은 낯선 노인의 이야기를 듣고 처음으로 길 위의 삶을 꿈꾸었습니다.", en: "On a market day at eighteen, you heard an old stranger's story and first dreamed of life on the road." },
    hardship: { ko: "길 위의 삶은 자유로웠지만 외로웠습니다. 머문 곳마다 정이 생겼고, 떠날 때마다 마음 한 조각을 두고 와야 했습니다.", en: "Life on the road was free but lonely. You grew fond of each place and left a piece of your heart whenever you departed." },
    bond: { ko: "당신에게는 늘 다시 만나는 사람이 있었습니다. 약속한 적은 없지만, 이상하게 같은 계절 같은 길목에서 마주쳤습니다.", en: "There was someone you always met again. No promise was made, yet you met at the same roads in the same seasons." },
    achievement: { ko: "당신은 마을마다 사라질 뻔한 이야기를 듣고, 다른 마을의 밤에 다시 들려주었습니다.", en: "In each village, you heard stories nearly lost, then told them again in the night of another village." },
    later: { ko: "나이가 들어 걸음이 느려진 뒤에도 당신의 이야기는 더 멀리 갔습니다.", en: "Even after age slowed your steps, your stories traveled farther." },
    finalLine: { ko: "그 사람은 한곳에 묻히지 않고, 오래도록 사람들의 말끝에 머물렀다.", en: "They were not buried in one place, but lingered for a long time at the end of people's words." },
  },
  {
    title: { ko: "이름 없이 사람을 살린 의원", en: "The Healer Who Saved People Without a Name" },
    roles: [{ ko: "의원", en: "healer" }, { ko: "침술가", en: "acupuncturist" }, { ko: "약초꾼", en: "herb gatherer" }],
    regions: [{ ko: "제주 산방 아래", en: "below Sanbang, Jeju" }, { ko: "전라도 장흥", en: "Jangheung, Jeolla" }, { ko: "경상도 산청", en: "Sancheong, Gyeongsang" }],
    remembered: [{ ko: "아픈 사람 곁에 늦지 않게 도착한 사람", en: "the one who arrived in time beside the hurting" }, { ko: "자기 이름보다 사람의 숨을 먼저 본 사람", en: "the one who saw breath before their own name" }],
    finalObjects: [{ ko: "약초 향이 밴 주머니", en: "a pouch scented with herbs" }, { ko: "작은 침통", en: "a small needle case" }],
    child: { ko: "어릴 적 당신은 누군가 아프면 겁먹기보다 먼저 손을 내미는 아이였습니다.", en: "As a child, when someone was hurt, you reached out before you grew afraid." },
    turn: { ko: "스무 살 무렵, 당신은 한 생명을 가까스로 살려낸 의원을 보며 자신의 길을 알았습니다.", en: "Around twenty, you watched a healer barely save a life and understood your own path." },
    hardship: { ko: "살리는 일은 늘 고맙다는 말로 끝나지 않았습니다. 때로는 아무리 애써도 붙잡을 수 없는 날이 있었습니다.", en: "Healing did not always end with gratitude. Some days could not be held no matter how hard you tried." },
    bond: { ko: "당신 곁에는 약초를 함께 캐던 동무가 있었습니다. 말은 적었지만, 같은 산길을 오래 걸었습니다.", en: "Beside you was a companion who gathered herbs with you. You spoke little, but walked the same mountain paths for years." },
    achievement: { ko: "당신은 이름난 의원은 아니었으나, 밤길을 마다하지 않는 사람으로 알려졌습니다.", en: "You were not a famous healer, but became known as someone who did not refuse a night road." },
    later: { ko: "나이가 들자 당신은 처방보다 먼저 사람의 두려움을 듣는 법을 가르쳤습니다.", en: "As you aged, you taught others to hear fear before offering medicine." },
    finalLine: { ko: "그 사람은 이름보다 먼저 도착했고, 오래도록 누군가의 숨결 속에 남았다.", en: "They arrived before their name did, and remained for a long time in someone's breath." },
  },
  {
    title: { ko: "강가에 집을 지은 사람", en: "The One Who Built a House by the River" },
    roles: [{ ko: "나루터 지기", en: "ferry keeper" }, { ko: "목수", en: "carpenter" }, { ko: "작은 주막 주인", en: "small innkeeper" }],
    regions: [{ ko: "한강 나루", en: "a ferry on the Han River" }, { ko: "낙동강 물가", en: "the banks of the Nakdong River" }, { ko: "섬진강 어귀", en: "the mouth of the Seomjin River" }],
    remembered: [{ ko: "흐르는 것들 곁에 오래 선 사람", en: "the one who stood beside flowing things" }, { ko: "머무를 곳을 만들어준 사람", en: "the one who made a place to stay" }],
    finalObjects: [{ ko: "강물에 닳은 노", en: "an oar worn by river water" }, { ko: "직접 깎은 나무 의자", en: "a hand-carved wooden chair" }],
    child: { ko: "어릴 적 당신은 물소리를 들으면 마음이 가라앉는 아이였습니다. 흐르는 것을 보면 이상하게 오래 안심했습니다.", en: "As a child, the sound of water calmed you. Flowing things made you feel strangely safe." },
    turn: { ko: "스물다섯의 봄, 당신은 떠나는 삶보다 머물 곳을 만드는 삶을 택했습니다.", en: "At twenty-five, you chose a life of making a place to stay over a life of leaving." },
    hardship: { ko: "평온한 삶에도 풍랑은 있었습니다. 강물이 불어난 해에는 쌓아둔 것들이 하루아침에 떠내려가기도 했습니다.", en: "Even a peaceful life had storms. In years of swollen water, what you had built could float away overnight." },
    bond: { ko: "당신의 곁에는 늘 강을 건너오는 사람들이 있었습니다. 그중 한 사람은 떠나지 않고 저녁마다 같은 불빛을 바라보았습니다.", en: "People were always crossing the river to you. One of them stayed and watched the same evening light." },
    achievement: { ko: "당신은 큰 집을 짓지는 않았지만, 지친 이들이 잠시 마음을 내려놓을 자리를 만들었습니다.", en: "You did not build a grand house, but made a place where tired people could set down their hearts." },
    later: { ko: "말년의 당신은 강물의 높이만 보고도 다음 날의 날씨를 짐작했습니다.", en: "In later years, you could guess tomorrow's weather just by the height of the river." },
    finalLine: { ko: "그 사람은 멀리 가지 않았으나, 많은 이가 그 곁에서 다시 길을 떠났다.", en: "They did not travel far, but many people began again beside them." },
  },
  {
    title: { ko: "마지막 편지를 남긴 사람", en: "The One Who Left the Last Letter" },
    roles: [{ ko: "편지 대필가", en: "letter writer" }, { ko: "서간 보관자", en: "keeper of letters" }, { ko: "문방 주인", en: "stationery keeper" }],
    regions: [{ ko: "한양 북촌", en: "Bukchon, Hanyang" }, { ko: "충청도 부여", en: "Buyeo, Chungcheong" }, { ko: "전라도 목포", en: "Mokpo, Jeolla" }],
    remembered: [{ ko: "말하지 못한 마음을 대신 적은 사람", en: "the one who wrote unspoken hearts for others" }, { ko: "끝내 닿지 못한 말을 품은 사람", en: "the one who carried words that never arrived" }],
    finalObjects: [{ ko: "봉하지 못한 마지막 편지", en: "a final letter never sealed" }, { ko: "붉은 먹이 남은 벼루", en: "an inkstone stained with red ink" }],
    child: { ko: "어릴 적 당신은 말보다 글이 편한 아이였습니다. 마음은 입 밖으로 나오기 전에 늘 종이 위에 먼저 도착했습니다.", en: "As a child, writing felt easier than speech. Your heart always reached paper before it reached your mouth." },
    turn: { ko: "열아홉의 가을, 당신은 누군가의 고백 편지를 대신 써주고 글이 사람을 움직인다는 것을 알았습니다.", en: "At nineteen, you wrote a confession letter for someone and learned that writing could move people." },
    hardship: { ko: "남의 마음을 대신 적는 동안, 정작 자신의 마음은 자주 뒤로 밀렸습니다.", en: "While writing other people's hearts, your own was often pushed aside." },
    bond: { ko: "당신에게도 오래 품은 마음이 있었습니다. 그러나 그 마음은 늘 마지막 문장 앞에서 멈추었습니다.", en: "You also carried a long-held feeling. Yet it always stopped before the final sentence." },
    achievement: { ko: "당신이 써준 편지들 덕분에 많은 사람들이 사과하고, 다시 만나고, 늦게나마 진심을 전했습니다.", en: "Because of the letters you wrote, many people apologized, met again, and delivered truth late but honestly." },
    later: { ko: "말년의 당신은 더 이상 많은 글을 쓰지 않았지만, 젊은 사람들은 여전히 당신에게 첫 문장을 물었습니다.", en: "In later years, you wrote less, but young people still came to ask you for the first sentence." },
    finalLine: { ko: "그 사람은 끝내 모든 마음을 말하지 못했지만, 수많은 마음이 그 손을 지나 닿았다.", en: "They never spoke every feeling of their own, but countless hearts arrived through their hands." },
  },
  {
    title: { ko: "달빛 아래 길을 고른 사람", en: "The One Who Chose a Road Under Moonlight" },
    roles: [{ ko: "지도 제작자", en: "map maker" }, { ko: "역참 관리인", en: "station keeper" }, { ko: "길 안내자", en: "guide" }],
    regions: [{ ko: "강원도 영월", en: "Yeongwol, Gangwon" }, { ko: "경기도 파주", en: "Paju, Gyeonggi" }, { ko: "함경도 함흥", en: "Hamhung, Hamgyeong" }],
    remembered: [{ ko: "헤매는 사람에게 방향을 준 사람", en: "the one who gave direction to the lost" }, { ko: "밤길을 무서워하지 않은 사람", en: "the one unafraid of night roads" }],
    finalObjects: [{ ko: "손으로 그린 낡은 지도", en: "a hand-drawn old map" }, { ko: "달빛에 바랜 길표", en: "a road marker faded by moonlight" }],
    child: { ko: "어릴 적 당신은 길을 잃어도 크게 울지 않았습니다. 대신 돌아가는 길을 기억해두는 아이였습니다.", en: "As a child, you did not cry much when lost. You remembered the way back instead." },
    turn: { ko: "스무 살 무렵, 밤길에 헤맨 사람을 데려다준 일이 당신의 평생 방향을 정했습니다.", en: "Around twenty, guiding a lost person through the night set the direction of your life." },
    hardship: { ko: "길을 아는 사람도 자기 마음의 길은 자주 잃었습니다. 당신은 남을 안내하면서 자신도 조금씩 배웠습니다.", en: "Even someone who knew roads often lost the road of their own heart. By guiding others, you learned yourself." },
    bond: { ko: "당신 곁에는 늘 같은 달을 바라보던 사람이 있었습니다. 서로 멀리 있어도 밤이 되면 같은 빛 아래 있었습니다.", en: "There was someone who always looked at the same moon. Even far apart, you stood under the same light at night." },
    achievement: { ko: "당신이 남긴 지도는 화려하지 않았지만, 길 잃은 사람들의 품에서 오래 접혔다 펴졌습니다.", en: "The maps you left were not ornate, but were folded and unfolded for years by the lost." },
    later: { ko: "말년의 당신은 먼 길보다 집 앞의 짧은 길을 더 아꼈습니다.", en: "In later years, you cherished the short road before your house more than distant roads." },
    finalLine: { ko: "그 사람은 길 끝에 이름을 새기지 않았지만, 많은 이가 그 덕에 돌아왔다.", en: "They carved no name at the end of the road, but many returned because of them." },
  },
  {
    title: { ko: "눈 내리는 날에도 불씨를 지킨 사람", en: "The One Who Kept an Ember Even in Snow" },
    roles: [{ ko: "화로 장인", en: "brazier maker" }, { ko: "도공", en: "potter" }, { ko: "부엌 살림꾼", en: "keeper of the kitchen hearth" }],
    regions: [{ ko: "경기도 이천", en: "Icheon, Gyeonggi" }, { ko: "전라도 강진", en: "Gangjin, Jeolla" }, { ko: "충청도 괴산", en: "Goesan, Chungcheong" }],
    remembered: [{ ko: "추운 날에도 온기를 잃지 않은 사람", en: "the one who kept warmth in cold days" }, { ko: "작은 불씨를 크게 지킨 사람", en: "the one who guarded a small ember greatly" }],
    finalObjects: [{ ko: "금이 간 작은 화로", en: "a cracked small brazier" }, { ko: "손자국 남은 그릇", en: "a bowl marked by fingerprints" }],
    child: { ko: "어릴 적 당신은 추위를 많이 탔지만, 이상하게도 불 가까이에 있으면 마음이 또렷해졌습니다.", en: "As a child, you felt the cold sharply, yet near fire your heart became clear." },
    turn: { ko: "스물하나의 겨울, 당신은 무너진 집의 불씨를 살려 이웃들을 밤새 데웠습니다.", en: "At twenty-one, you saved the ember of a damaged house and warmed neighbors through the night." },
    hardship: { ko: "온기를 지키는 사람은 자주 가장 먼저 추위를 맞았습니다. 당신은 자신의 손이 갈라지는 것도 늦게 알아차렸습니다.", en: "Those who keep warmth often meet the cold first. You noticed your own cracked hands only late." },
    bond: { ko: "당신을 알아본 사람은 당신이 만든 그릇보다, 그 그릇을 건네는 손의 온기를 먼저 기억했습니다.", en: "The person who truly saw you remembered the warmth of your hands before the bowls you made." },
    achievement: { ko: "당신은 큰 가마보다 작은 집들의 밤을 지키는 물건을 더 많이 만들었습니다.", en: "You made more objects for small houses at night than pieces for grand kilns." },
    later: { ko: "나이가 들수록 당신은 더 천천히 불을 살폈고, 그 곁에 앉은 사람들은 쉽게 울 수 있었습니다.", en: "As you aged, you tended fire more slowly, and people beside it found it easy to cry." },
    finalLine: { ko: "그 사람은 큰 빛이 아니었으나, 가장 추운 밤에 꺼지지 않는 불씨였다.", en: "They were not a great light, but an ember that did not go out on the coldest night." },
  },
];

const JOSEON_LIFE_OVERRIDES: Array<
  Partial<Archetype> & {
    title: Pair;
    subtitle: Pair;
    roles: Pair[];
    remembered: Pair[];
    finalObjects: Pair[];
    finalLine: Pair;
    lifeStory: LifeStoryBuilder;
  }
> = [
  {
    title: { ko: "금서의 밤을 건넨 서책가", en: "The Bookseller Who Crossed a Forbidden Night" },
    subtitle: { ko: "금지된 문장 하나가 평생의 문이 된 삶", en: "A life opened by one forbidden sentence." },
    roles: [{ ko: "서책가", en: "bookseller" }, { ko: "역관 견습", en: "interpreter's apprentice" }, { ko: "비밀 필사공", en: "secret copyist" }],
    remembered: [{ ko: "시대보다 먼저 질문한 사람", en: "the one who questioned before the age was ready" }, { ko: "금지된 글을 밤새 지킨 사람", en: "the one who guarded forbidden pages through the night" }],
    finalObjects: [{ ko: "마룻장 밑의 금서 한 권", en: "a forbidden book under the floorboards" }, { ko: "끝까지 닳은 먹붓", en: "an ink brush worn down to the end" }],
    finalLine: { ko: "그 사람의 이름은 금서보다 오래, 누군가의 첫 질문으로 남았다.", en: "That name lasted longer than the banned book, as someone's first question." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 집안은 큰 벼슬도 큰 재산도 없었지만, 장터 끝 헌책 더미를 뒤지는 아이 하나만은 늘 사람들의 눈에 띄었다.`,
      `열일곱 되던 겨울, ${ctx.name}은 역관이 숨겨 둔 낡은 책에서 조정이 금한 문장을 읽었다. "사람은 태어난 자리보다 묻는 질문으로 멀리 간다"는 한 줄 때문에, 그날 밤 잠을 이루지 못했다.`,
      `이후 ${ctx.name}은 ${ctx.role.ko}로 살며 책을 팔고, 베끼고, 때로는 숨겼다. 어느 봄에는 젊은 선비에게 금지된 주석을 몰래 건넸고, 어느 장맛비 밤에는 관아의 수색을 피해 책 상자를 우물 뒤에 묻었다.`,
      `위험은 늘 가까웠다. 믿었던 손님 하나가 이름을 팔았고, ${ctx.name}은 사흘 동안 문초를 받았다. 하지만 함께 글을 읽던 어린 제자가 눈빛으로 "그 책을 제가 외웠습니다"라고 말했을 때, 두려움은 이상하게도 부끄러움보다 작아졌다.`,
      `말년의 ${ctx.name}은 가게 문을 일찍 닫고 마룻장 밑에 얇은 종이들을 숨겼다. 거기에는 남의 이름으로도 남기지 못한 질문, 반쯤 지워진 주석, 그리고 "언젠가 읽을 사람에게"라는 짧은 말이 있었다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 마지막 숨을 거두었다. 훗날 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. The family had no great office or fortune, but one child was always seen searching through old books at the end of the market.`,
      `In the winter at seventeen, ${ctx.name} read a banned line in a book hidden by an interpreter: "A person travels farther by the questions they ask than by the place they were born." Sleep did not come that night.`,
      `Later, ${ctx.name} lived as a ${ctx.role.en}, selling, copying, and sometimes hiding books. One spring, a forbidden annotation was passed to a young scholar; one rainy night, a box of books was buried behind a well to escape inspection.`,
      `Danger stayed close. A trusted customer sold the name, and ${ctx.name} was questioned for three days. But when a young pupil silently signaled, "I memorized the book," fear became smaller than shame.`,
      `In old age, ${ctx.name} closed the shop early and hid thin papers beneath the floor. They held questions that could not be signed, half-erased notes, and one short line: "For whoever reads later."`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} died beside ${ctx.finalObject.en}. Later, people remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "한양의 장부를 고친 실패한 선비", en: "The Failed Scholar Who Corrected Hanyang's Ledger" },
    subtitle: { ko: "과거에는 떨어졌지만, 숫자 사이의 억울함은 놓치지 않은 삶", en: "A failed exam life that still found injustice between numbers." },
    roles: [{ ko: "서리", en: "clerk" }, { ko: "장부 관리인", en: "ledger keeper" }, { ko: "낙방한 선비", en: "failed scholar" }],
    remembered: [{ ko: "이름보다 장부를 깨끗하게 남긴 사람", en: "the one who left the ledger cleaner than the name" }, { ko: "억울한 숫자를 그냥 넘기지 않은 사람", en: "the one who did not ignore unjust numbers" }],
    finalObjects: [{ ko: "붉은 먹으로 고친 장부", en: "a ledger corrected in red ink" }, { ko: "끝내 부치지 못한 고향 편지", en: "an unsent letter home" }],
    finalLine: { ko: "그는 높은 문턱을 넘지 못했으나, 낮은 사람들의 몫을 지켜 냈다.", en: "He never crossed the highest threshold, but protected the share of those below it." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 집안 어른들은 과거 급제를 기대했고, 어린 ${ctx.name}도 언젠가 한양의 큰길을 당당히 걷는 꿈을 품었다.`,
      `스물셋, 세 번째 낙방 뒤에 남은 것은 젖은 짚신과 빈 주머니뿐이었다. 돌아가면 실망한 얼굴들을 봐야 했기에, ${ctx.name}은 한양 작은 관청의 ${ctx.role.ko} 자리를 받아들였다.`,
      `일은 지루했지만 숫자는 거짓말을 했다. 쌀 스무 섬이 열다섯 섬으로 줄어 있었고, 어느 과부의 세금은 두 번 적혀 있었다. ${ctx.name}은 밤마다 촛불을 낮추고 붉은 먹으로 장부의 거짓을 고쳤다.`,
      `그 때문에 윗사람에게 미움을 샀고, 한때는 관청에서 쫓겨날 뻔했다. 그러나 세금을 돌려받은 노파가 새벽 문 앞에 콩 한 되를 놓고 갔을 때, ${ctx.name}은 처음으로 낙방이 인생의 끝이 아니었다는 사실을 믿었다.`,
      `말년에는 출세보다 기록의 정확함에 더 매달렸다. 고향에 보내려던 편지는 끝내 부치지 못했지만, 그 편지 한쪽에는 "나는 아직 부끄럽지 않게 살고 있다"는 문장이 남았다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 옆에서 조용히 생을 마쳤다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 불렀다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. The elders expected a civil service pass, and the child imagined walking Hanyang's broad roads with pride.`,
      `At twenty-three, after a third failed exam, only wet straw shoes and an empty purse remained. Rather than face disappointed eyes at home, ${ctx.name} accepted work as a ${ctx.role.en} in a small capital office.`,
      `The work was dull, but the numbers lied. Twenty sacks of rice became fifteen; one widow's tax appeared twice. Each night, ${ctx.name} lowered the candle and corrected the ledger in red ink.`,
      `Superiors grew hostile, and dismissal almost came. Yet when an old woman who received her tax back left a measure of beans at the door, ${ctx.name} first believed failure was not the end of a life.`,
      `In old age, accuracy mattered more than advancement. The letter to home was never sent, but one sentence remained: "I am still living without shame."`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} died beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "역병의 마을을 지킨 약방 사람", en: "The Healer Who Stayed During the Fever" },
    subtitle: { ko: "떠날 수 있었지만, 문을 잠그지 않은 사람", en: "A person who could have left, but did not lock the door." },
    roles: [{ ko: "약방 조력자", en: "apothecary aide" }, { ko: "마을 의원", en: "village healer" }, { ko: "아이들을 가르친 노인", en: "elder teacher" }],
    remembered: [{ ko: "문이 닫히지 않는 집 같던 사람", en: "the one whose door never closed" }, { ko: "열병의 밤에 이름을 불러 준 사람", en: "the one who called names through fevered nights" }],
    finalObjects: [{ ko: "마른 약초가 든 보자기", en: "a cloth bundle of dried herbs" }, { ko: "문턱에 놓인 찻잔", en: "a teacup left by the threshold" }],
    finalLine: { ko: "마을 사람들은 그가 살린 목숨보다, 끝까지 떠나지 않은 등을 더 오래 기억했다.", en: "The village remembered not only the lives saved, but the back that never left." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 어려서부터 울음소리의 높낮이만 듣고도 누가 아픈지, 누가 서러운지 먼저 알아차렸다.`,
      `젊은 시절 한양 약방으로 갈 기회가 있었지만, 아버지가 쓰러지고 마을에 열병이 돌기 시작했다. ${ctx.name}은 보따리를 풀고 ${ctx.role.ko}로 남았다.`,
      `그해 여름, ${ctx.name}은 논둑을 건너 열이 오른 아이에게 찬 수건을 갈아 주고, 밤에는 상여 소리를 피해 약초를 달였다. 어느 날은 살린 아이의 어머니가 절을 했고, 다음 날은 끝내 손을 놓은 아이의 이름을 혼자 불렀다.`,
      `사람을 살리는 일은 늘 고마움만 남기지 않았다. 약값을 두고 다투는 이도 있었고, 왜 우리 집부터 오지 않았느냐며 멱살을 잡는 이도 있었다. 그래도 ${ctx.name}은 다음 날 같은 길을 다시 걸었다.`,
      `말년에는 마을 아이들에게 글자를 가르쳤다. 아이들은 약초 이름보다 먼저 "아픈 사람 앞에서는 목소리를 낮춘다"는 말을 배웠다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 눈을 감았다. 훗날 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. Even as a child, ${ctx.name} could hear in a cry who was sick and who was grieving.`,
      `There was once a chance to go to a Hanyang apothecary, but a father collapsed and fever began moving through the village. ${ctx.name} unpacked the bundle and remained as a ${ctx.role.en}.`,
      `That summer, ${ctx.name} crossed rice paths to change cool cloths for burning children and boiled herbs at night while funeral sounds passed by. One day a mother bowed in thanks; the next, ${ctx.name} whispered the name of a child who did not survive.`,
      `Healing did not leave only gratitude. Some fought over payment, and some grabbed the collar asking why their house had not come first. Still, ${ctx.name} walked the same road again the next day.`,
      `In later years, village children learned letters from ${ctx.name}. Before herb names, they learned this: lower your voice before someone in pain.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} closed their eyes beside ${ctx.finalObject.en}. Later, people remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "사라진 이름을 베껴 둔 필사공", en: "The Copyist of Vanishing Names" },
    subtitle: { ko: "공식 기록 밖의 사람들을 종이에 남긴 삶", en: "A life that kept people outside official records on paper." },
    roles: [{ ko: "필사공", en: "copyist" }, { ko: "문집 편집자", en: "editor of writings" }, { ko: "서책가", en: "bookseller" }],
    remembered: [{ ko: "잊힌 이름을 종이에 붙잡은 사람", en: "the one who held forgotten names on paper" }, { ko: "기록되지 못한 사연의 편에 선 사람", en: "the one who stood with stories denied a record" }],
    finalObjects: [{ ko: "끈으로 묶은 이름 없는 문집", en: "an unsigned collection tied with cord" }, { ko: "먹 번진 청원서 한 장", en: "an ink-blurred petition" }],
    finalLine: { ko: "그가 남긴 책에는 왕의 이름보다, 사라질 뻔한 사람들의 숨이 더 많았다.", en: "The book held more breaths of nearly erased people than names of kings." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 어려서부터 말보다 글씨에 마음이 먼저 갔고, 남이 버린 종이 조각도 곧장 접어 품에 넣었다.`,
      `${ctx.role.ko}가 된 뒤, ${ctx.name}의 작은 방에는 이상한 부탁이 모였다. 억울하게 죽은 남편의 이름을 남기고 싶은 과부, 족보에 오르지 못한 아이, 관아 문턱을 넘지 못한 종의 사연이 밤마다 찾아왔다.`,
      `가장 위험했던 날은 수색이 있던 초겨울이었다. ${ctx.name}은 이름 없는 문집을 쌀독 아래 숨기고, 손님에게는 장부를 태운 척 재를 보여 주었다. 그날 이후 손끝의 떨림은 오래 갔다.`,
      `곁에는 매번 첫 독자가 되어 주는 사람이 있었다. 그 사람은 칭찬보다 더 자주 "이 문장은 너무 곱다. 이 사람은 이렇게 곱게만 살지 못했을 것이다"라고 말했다.`,
      `말년의 ${ctx.name}은 글씨가 흐려져도 이름만은 또박또박 썼다. 누군가를 아름답게 꾸미기보다, 그 사람이 실제로 견딘 날을 숨기지 않는 일이 더 중요해졌다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 옆에서 생을 마쳤다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. Writing reached the heart before speech did, and even discarded scraps of paper were folded and kept.`,
      `After becoming a ${ctx.role.en}, strange requests gathered in ${ctx.name}'s small room: a widow wanting her wrongly killed husband's name preserved, a child missing from a genealogy, a servant whose story could not cross the office threshold.`,
      `The most dangerous day came during an early winter search. ${ctx.name} hid the unsigned collection beneath a rice jar and showed ash as if the ledger had burned. The trembling in the fingers stayed for years.`,
      `There was someone nearby who always read first. More often than praise, they said, "This sentence is too pretty. This person could not have lived only prettily."`,
      `In old age, even as the handwriting blurred, names were written clearly. It became more important not to hide what people had endured than to make them beautiful.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} died beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "흉년의 장터를 건넌 보부상", en: "The Peddler Who Crossed a Famine Market" },
    subtitle: { ko: "이익보다 사람의 사정을 먼저 셈한 장사꾼", en: "A trader who counted people's circumstances before profit." },
    roles: [{ ko: "보부상", en: "traveling peddler" }, { ko: "무명 장사꾼", en: "cloth trader" }, { ko: "장터 중개인", en: "market broker" }],
    remembered: [{ ko: "굶주린 장터에서 값을 낮춘 사람", en: "the one who lowered prices in a hungry market" }, { ko: "길 위의 약속을 끝까지 갚은 사람", en: "the one who repaid promises made on the road" }],
    finalObjects: [{ ko: "손때 묻은 저울", en: "a hand-worn scale" }, { ko: "비에 젖어 바랜 비단 조각", en: "a rain-faded scrap of silk" }],
    finalLine: { ko: "그는 큰 부자가 되지 못했지만, 굶주린 해의 장터에서 사람값을 깎지 않았다.", en: "Great wealth never came, but in a hungry year, he never discounted a human life." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 말이 빠르고 귀가 밝아, 어른들은 장터에 나가면 굶지는 않겠다고 말했다.`,
      `${ctx.role.ko}가 된 ${ctx.name}은 봇짐 하나로 고개와 나루를 넘었다. 어느 해 홍수가 길을 끊자, 젖은 비단을 말리며 아이 업은 여인에게 외상으로 옷감을 내주었다.`,
      `흉년이 들자 장터는 웃음보다 한숨이 많아졌다. 곡식값은 뛰었고, 사람들은 그릇과 비녀를 팔아 하루를 버텼다. ${ctx.name}은 저울추를 속이지 않았고, 굶주린 집 앞에서는 이문을 거의 남기지 않았다.`,
      `동료 상인은 미련하다고 했다. 하지만 몇 해 뒤 눈보라 속에서 길을 잃었을 때, 예전에 외상으로 옷감을 받았던 여인이 ${ctx.name}을 자기 집 아랫목으로 데려갔다.`,
      `말년에는 장사보다 사람을 이어 주는 일을 더 많이 했다. 길을 잃은 장돌뱅이에게 새 길을 알려 주고, 서로 원수가 된 두 집안의 혼례 물목을 조용히 맞췄다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko}을 곁에 두고 떠났다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. Quick speech and sharp ears made elders say the child would never starve in a marketplace.`,
      `As a ${ctx.role.en}, ${ctx.name} crossed passes and ferries with one bundle. When a flood broke the road, wet silk was dried and cloth was given on credit to a woman carrying a child.`,
      `In famine years, the market held more sighs than laughter. Grain prices rose, and people sold bowls and hairpins to survive one more day. ${ctx.name} did not cheat the weights and left almost no profit at hungry doors.`,
      `Other merchants called it foolish. Years later, lost in a snowstorm, ${ctx.name} was led to a warm floor by the woman who had once received cloth on credit.`,
      `In old age, connecting people became more important than selling goods. Lost traders were shown new roads, and wedding goods were quietly arranged between families that had become enemies.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} departed beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "사랑보다 탄원을 택한 유배 선비", en: "The Exiled Scholar Who Chose Petition Over Love" },
    subtitle: { ko: "고백하지 못한 마음과 끝까지 접지 않은 신념", en: "An unconfessed love and a conviction never folded away." },
    roles: [{ ko: "상소문 필사공", en: "petition copyist" }, { ko: "향교 선생", en: "local academy teacher" }, { ko: "유배 선비", en: "exiled scholar" }],
    remembered: [{ ko: "사랑 앞에서도 글을 접지 않은 사람", en: "the one who did not fold the petition even before love" }, { ko: "외로움 속에서도 기준을 버리지 않은 사람", en: "the one who kept a standard inside loneliness" }],
    finalObjects: [{ ko: "부치지 못한 연서", en: "an unsent love letter" }, { ko: "붉은 실로 묶은 탄원문", en: "petitions tied with red thread" }],
    finalLine: { ko: "그가 잃은 것은 한 사람의 곁이었고, 지킨 것은 여러 사람의 억울함이었다.", en: "What was lost was one person's nearness; what was kept was the grievance of many." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 어릴 때부터 옳다고 믿은 일 앞에서는 목소리가 작아져도 물러서지 않았다.`,
      `젊은 ${ctx.name}은 ${ctx.role.ko}로 살며 억울한 사람들의 말을 상소문으로 옮겼다. 첫 번째 탄원은 매 맞아 죽은 노비의 누이를 위한 것이었고, 두 번째는 세금을 두 번 낸 마을을 위한 것이었다.`,
      `그 무렵 마음을 주고받던 사람이 있었다. 혼례 이야기가 오가던 밤, ${ctx.name}은 탄원문을 포기하면 함께 살 수 있다는 말을 들었다. 하지만 손에 쥔 붓을 끝내 내려놓지 못했다.`,
      `결국 유배 길이 열렸다. 바닷가 먼 마을에서 ${ctx.name}은 아이들에게 글을 가르치고, 밤마다 보내지 못한 편지를 다시 접었다. 사랑은 사라지지 않았지만, 더 이상 돌아갈 길을 요구하지 않았다.`,
      `말년에는 성난 글보다 정확한 글을 썼다. 누군가의 분노가 오래 버티려면, 문장이 먼저 무너지지 않아야 한다는 것을 배웠기 때문이다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 옆에서 눈을 감았다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 불렀다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. Since childhood, the voice could become small before what felt right, but the feet did not step back.`,
      `As a young ${ctx.role.en}, ${ctx.name} turned wronged voices into petitions. The first was for the sister of a servant beaten to death; the second for a village taxed twice.`,
      `There was someone exchanging affection then. On a night when marriage was being discussed, ${ctx.name} was told that life together was possible if the petition was abandoned. The brush could not be put down.`,
      `Exile followed. In a distant seaside village, ${ctx.name} taught children letters and refolded unsent letters each night. Love did not vanish, but it no longer demanded a road back.`,
      `In old age, the writing became more precise than angry. ${ctx.name} had learned that for anger to endure, the sentence must not collapse first.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} closed their eyes beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "늦게 물든 옷감을 팔던 차집 주인", en: "The Teahouse Keeper Who Dyed Cloth Late" },
    subtitle: { ko: "무너진 뒤에야 자기 색을 찾은 사람", en: "A person who found their own color only after breaking." },
    roles: [{ ko: "염색 장인", en: "dyer" }, { ko: "차집 주인", en: "teahouse keeper" }, { ko: "손재주 있는 과부", en: "widowed artisan" }],
    remembered: [{ ko: "늦게 피었지만 오래 향을 남긴 사람", en: "the one who bloomed late and left a long scent" }, { ko: "상처 뒤의 색을 꺼낸 사람", en: "the one who drew color out after wounds" }],
    finalObjects: [{ ko: "쪽빛 물감이 든 작은 접시", en: "a small dish of indigo pigment" }, { ko: "차 향이 밴 나무 상자", en: "a wooden box scented with tea" }],
    finalLine: { ko: "그 사람은 봄을 놓쳤지만, 늦여름의 색으로 오래 남았다.", en: "That life missed spring, but remained in the color of late summer." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 손끝이 야무져 천 조각, 찻잎, 작은 꽃잎만 있어도 금세 무언가를 만들어 냈다.`,
      `이른 혼인은 오래 가지 못했다. 시집의 빚과 상처만 남은 채 돌아온 ${ctx.name}은 한동안 사람들 눈을 피해 살았다. 그러다 비 오는 날, 버려진 흰 옷감을 쪽빛 물에 담갔다.`,
      `그 색이 마음을 붙잡았다. ${ctx.name}은 ${ctx.role.ko}로 다시 문을 열었고, 낮에는 옷감을 팔고 저녁에는 따뜻한 차를 냈다. 사람들은 물건을 사러 왔다가 말하지 못한 이야기를 놓고 갔다.`,
      `어느 겨울, 굶주린 아이 하나가 가게 처마 밑에서 잠들었다. ${ctx.name}은 그 아이에게 밥과 글자를 주었고, 훗날 아이는 가게의 색 이름을 새로 지어 주는 사람이 되었다.`,
      `말년의 가게에는 서두르는 말이 없었다. 실패한 혼인, 늦은 시작, 다시 사랑하지 못한 마음까지도 그곳에서는 이상하지 않았다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 조용히 떠났다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. Skillful hands made things from scraps of cloth, tea leaves, and tiny petals.`,
      `An early marriage did not last. Returning with only debt and wounds from the in-laws, ${ctx.name} avoided people's eyes for a long time. Then, on a rainy day, a discarded white cloth was lowered into indigo dye.`,
      `The color held the heart. ${ctx.name} reopened life as a ${ctx.role.en}, selling cloth by day and serving warm tea by evening. People came to buy goods and left behind stories they could not say elsewhere.`,
      `One winter, a hungry child fell asleep beneath the shop eaves. ${ctx.name} gave the child rice and letters; later, the child became the one who named the shop's colors anew.`,
      `In old age, no hurried words filled the shop. Failed marriage, late beginnings, and a heart that never loved again were not strange there.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} quietly departed beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "궁궐 문밖의 비밀 심부름꾼", en: "The Secret Runner Outside the Palace Gate" },
    subtitle: { ko: "권력의 그림자에서 약한 사람의 말을 옮긴 삶", en: "A life carrying fragile words through the shadow of power." },
    roles: [{ ko: "문서 전달꾼", en: "document courier" }, { ko: "궁 밖 심부름꾼", en: "palace errand runner" }, { ko: "관청 서리", en: "bureau clerk" }],
    remembered: [{ ko: "작은 쪽지로 큰 사람들을 흔든 사람", en: "the one who unsettled powerful people with small notes" }, { ko: "문밖에서 가장 위험한 말을 나른 사람", en: "the one who carried the most dangerous words outside the gate" }],
    finalObjects: [{ ko: "소매 안쪽의 비단 주머니", en: "a silk pouch sewn inside a sleeve" }, { ko: "접힌 쪽지 세 장", en: "three folded notes" }],
    finalLine: { ko: "그는 역사에 이름을 쓰지 못했지만, 역사가 숨긴 문장을 건넸다.", en: "The name was not written into history, but it carried sentences history tried to hide." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 발걸음이 가볍고 낯빛을 잘 숨겨, 어려서부터 심부름을 맡기면 실수가 없었다.`,
      `${ctx.role.ko}가 된 뒤, ${ctx.name}은 궁궐 문밖과 관청 골목을 오갔다. 처음에는 평범한 문서였지만, 곧 억울하게 쫓겨난 궁녀의 이름, 사라진 장부의 위치, 병든 세자의 소문 같은 것들이 소매 안으로 들어왔다.`,
      `가장 긴 밤은 눈발이 날리던 보름이었다. ${ctx.name}은 순라꾼을 피해 담장 밑을 기어가 한 장의 쪽지를 전했고, 그 쪽지 때문에 한 가문은 몰락했지만 한 아이는 목숨을 건졌다.`,
      `곁에는 이름을 묻지 않는 벗이 있었다. 둘은 서로의 과거를 거의 알지 못했지만, 위험한 일을 끝낸 새벽마다 같은 주막에서 식은 국을 나눠 먹었다.`,
      `말년의 ${ctx.name}은 더 이상 빠르게 걷지 못했다. 그래도 젊은 심부름꾼들에게 "말은 가볍게 들고, 사람의 목숨은 무겁게 들어라"라고 가르쳤다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko}을 남기고 떠났다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. Light feet and a guarded face made every errand reliable from childhood.`,
      `As a ${ctx.role.en}, ${ctx.name} moved between palace gates and office alleys. At first the documents were ordinary, but soon a dismissed court woman's name, the location of a missing ledger, and rumors of a sick crown prince slipped into the sleeve.`,
      `The longest night came under falling snow. ${ctx.name} crawled beneath a wall to avoid patrols and delivered one note; because of it, a family fell, but a child survived.`,
      `There was a friend who never asked for a name. They knew little of each other's past, but after dangerous work, they shared cold soup in the same tavern at dawn.`,
      `In old age, ${ctx.name} could no longer walk quickly. Still, young runners were taught, "Carry words lightly, but lives heavily."`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} departed leaving ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "길 위에서 소문을 노래로 바꾼 이야기꾼", en: "The Storyteller Who Turned Rumor Into Song" },
    subtitle: { ko: "떠도는 삶이 사람들의 기억을 묶어 준 여정", en: "A wandering life that tied people's memories together." },
    roles: [{ ko: "떠돌이 이야기꾼", en: "wandering storyteller" }, { ko: "광대패 서기", en: "troupe scribe" }, { ko: "장터 노래꾼", en: "market singer" }],
    remembered: [{ ko: "남의 슬픔을 노래로 돌려준 사람", en: "the one who returned sorrow as song" }, { ko: "소문을 사람의 이야기로 바꾼 사람", en: "the one who turned rumor into human story" }],
    finalObjects: [{ ko: "가죽끈으로 묶은 노래책", en: "a songbook tied with leather cord" }, { ko: "금 간 장구채", en: "a cracked janggu stick" }],
    finalLine: { ko: "그가 떠난 뒤에도 장터의 아이들은 모르는 사람의 슬픔을 흥얼거렸다.", en: "After leaving, market children still hummed the grief of strangers." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났지만, 오래 한곳에 머문 기억은 적었다. 어머니를 일찍 잃은 뒤, ${ctx.name}은 남의 이야기를 듣는 법부터 배웠다.`,
      `${ctx.role.ko}로 떠돈 세월 동안, ${ctx.name}은 마을마다 다른 소문을 들었다. 버림받은 신부, 돌아오지 않는 군역자, 굶주린 겨울에 쌀독을 나눈 이웃의 이야기가 노래가 되었다.`,
      `한 번은 양반가의 비밀을 노래했다가 매를 맞고 쫓겨났다. 하지만 그 노래를 들은 하녀가 밤새 울었다는 말을 듣고, ${ctx.name}은 웃기는 이야기만으로는 세상을 견딜 수 없다는 걸 알았다.`,
      `사랑은 늘 길 위에 잠깐 머물렀다. 주막집 딸과 함께 살자는 약속을 한 적도 있었지만, 봄 장이 열리자 ${ctx.name}은 다시 떠났다. 머무르면 이야기가 멈출까 두려웠다.`,
      `말년에는 아이들에게 노래의 끝을 바꾸게 했다. "네가 들은 슬픔이라면, 네가 살릴 수도 있다"는 말과 함께 장구채를 넘겼다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 조용히 사라졌다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 불렀다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}, but remembered little of staying anywhere long. After losing a mother early, listening to other people's stories became the first lesson.`,
      `As a ${ctx.role.en}, ${ctx.name} heard different rumors in every village. An abandoned bride, a conscript who never returned, neighbors sharing rice in a starving winter: all became songs.`,
      `Once, after singing a noble family's secret, ${ctx.name} was beaten and driven out. But hearing that a maid cried all night after the song, ${ctx.name} learned that jokes alone could not carry the world.`,
      `Love never stayed long off the road. There was once a promise to live with a tavern keeper's daughter, but when the spring market opened, ${ctx.name} left again, afraid that staying would stop the stories.`,
      `In old age, children were taught to change the endings of songs. "If it is a sorrow you heard, perhaps you can also save it," ${ctx.name} said, handing over the drumstick.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} quietly vanished beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "이름 없이 아이들을 살린 여의", en: "The Woman Healer Who Saved Children Without a Name" },
    subtitle: { ko: "공식 이름보다 살아남은 아이들의 숨으로 남은 삶", en: "A life remembered less by official name than by children's breath." },
    roles: [{ ko: "여의", en: "woman physician" }, { ko: "산파", en: "midwife" }, { ko: "약초꾼", en: "herb gatherer" }],
    remembered: [{ ko: "울음이 끊긴 집에 다시 숨을 돌려준 사람", en: "the one who returned breath to houses gone silent" }, { ko: "이름 없이 아이들을 살린 사람", en: "the one who saved children without a name" }],
    finalObjects: [{ ko: "작은 은침 꾸러미", en: "a small bundle of silver needles" }, { ko: "약초 냄새 밴 손수건", en: "a handkerchief scented with herbs" }],
    finalLine: { ko: "관청 기록에는 희미했으나, 살아남은 아이들의 이름 속에 그는 또렷했다.", en: "Faint in office records, she was clear in the names of surviving children." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 어릴 적 동생을 열병으로 잃은 뒤, ${ctx.name}은 아픈 숨소리를 외면하지 못하는 사람이 되었다.`,
      `${ctx.role.ko}가 된 ${ctx.name}은 밤마다 불려 다녔다. 비 오는 산길을 넘어 산모의 손을 잡았고, 새벽에는 파랗게 질린 아이의 입가에 따뜻한 물을 적셨다.`,
      `하지만 여자의 손이라는 이유로 문전박대를 당한 날도 많았다. 어느 양반집에서는 이름을 부르지 않고 "그 사람"이라 불렀고, 치료가 끝나자 뒷문으로 나가라고 했다.`,
      `가장 오래 남은 인연은 자신이 받아 낸 아이였다. 그 아이는 해마다 생일이면 약초 한 줌을 가져왔고, 자라서는 ${ctx.name}의 왕진길에 등불을 들었다.`,
      `말년의 ${ctx.name}은 누구의 공도 따지지 않았다. 다만 아이가 첫 울음을 터뜨리는 순간마다, 세상이 아주 잠깐 다시 시작된다고 믿었다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 숨을 거두었다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. After losing a younger sibling to fever, ${ctx.name} became unable to turn away from a struggling breath.`,
      `As a ${ctx.role.en}, ${ctx.name} was called out at night: over rainy mountain paths to hold a mother's hand, at dawn to wet the lips of a child gone blue.`,
      `Many doors still closed because the hands were a woman's. In one noble house, no name was used; after the treatment, ${ctx.name} was told to leave through the back gate.`,
      `The longest bond was with a child ${ctx.name} had delivered. Every birthday, the child brought a handful of herbs and later carried a lantern on house calls.`,
      `In old age, ${ctx.name} no longer measured credit. Each time a newborn cried, the world seemed to begin again for a moment.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} died beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "강을 건너 사람을 숨겨 준 뱃사공", en: "The Ferryman Who Hid People Across the River" },
    subtitle: { ko: "물길과 침묵으로 누군가의 도망을 지킨 삶", en: "A life protecting escape with river routes and silence." },
    roles: [{ ko: "뱃사공", en: "ferryman" }, { ko: "나루터 주인", en: "ferry crossing keeper" }, { ko: "강가 농부", en: "riverside farmer" }],
    remembered: [{ ko: "물살보다 조용히 사람을 건넨 사람", en: "the one who carried people more quietly than the current" }, { ko: "묻지 않는 나루터의 주인", en: "the keeper of the ferry that did not ask" }],
    finalObjects: [{ ko: "닳은 노 한 자루", en: "a worn wooden oar" }, { ko: "강물에 닳은 작은 돌", en: "a small stone smoothed by river water" }],
    finalLine: { ko: "그가 건넨 것은 강이 아니라, 돌아갈 수 없던 사람들의 다음 날이었다.", en: "What was crossed was not the river, but the next day of people who could not go back." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko} 강가에서 태어났다. 물소리를 들으면 날씨보다 사람의 마음이 먼저 읽히는 아이였다.`,
      `${ctx.role.ko}가 된 뒤, ${ctx.name}은 낮에는 장꾼과 농부를 건넸고 밤에는 말 없는 손님을 건넸다. 빚을 피해 도망친 종, 억울한 누명을 쓴 청년, 아이를 업은 과부가 그 배에 올랐다.`,
      `관아의 추격이 있던 밤, ${ctx.name}은 배를 일부러 모래톱에 걸린 듯 세웠다. 숨은 아이가 기침을 삼키는 동안, ${ctx.name}은 순라꾼에게 강물의 깊이를 오래 설명했다.`,
      `가족은 늘 불안했다. 왜 남의 일에 목숨을 거느냐는 말도 들었다. 하지만 ${ctx.name}은 언젠가 자기 집도 누군가의 침묵 덕분에 살아남았다는 사실을 잊지 않았다.`,
      `말년에는 배를 젊은이에게 넘기고 강가에 앉아 물살을 보았다. 묻지 말아야 살 수 있는 이야기가 있다는 것을, 그제야 마을 사람들도 알게 되었다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 생을 마쳤다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} beside the river in ${ctx.region.en}. Hearing the water, the child read people's hearts before the weather.`,
      `As a ${ctx.role.en}, ${ctx.name} ferried merchants and farmers by day and silent passengers by night: a servant escaping debt, a young man falsely accused, a widow carrying a child.`,
      `On a night of pursuit, ${ctx.name} made the boat seem stuck on a sandbar. While a hidden child swallowed a cough, the river depth was explained to patrolmen at great length.`,
      `Family lived with fear. Why risk life for strangers, they asked. But ${ctx.name} never forgot that one day, their own house had survived because someone else stayed silent.`,
      `In old age, the boat was handed to a younger person, and ${ctx.name} sat watching the current. Only then did the village understand that some stories survive because no one asks.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} died beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "마지막 편지를 품은 군역 파발", en: "The Military Messenger Who Carried the Last Letter" },
    subtitle: { ko: "전쟁 뒤의 말들을 끝까지 전달한 사람", en: "A life carrying words left after war." },
    roles: [{ ko: "군역 파발", en: "military messenger" }, { ko: "역참 마부", en: "post-station rider" }, { ko: "전장 기록 전달자", en: "battlefield courier" }],
    remembered: [{ ko: "돌아오지 못한 이들의 말을 끝까지 전한 사람", en: "the one who delivered words from those who could not return" }, { ko: "전쟁 뒤의 침묵을 건넌 사람", en: "the one who crossed the silence after war" }],
    finalObjects: [{ ko: "피 묻은 편지 주머니", en: "a bloodstained letter pouch" }, { ko: "말방울 하나", en: "a single horse bell" }],
    finalLine: { ko: "그는 승전보다, 기다리는 사람에게 도착한 한 줄의 말을 더 믿었다.", en: "More than victory, he trusted one line arriving to someone who waited." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 달리는 말소리에 가슴이 뛰었고, 길을 외우는 데에는 누구보다 빨랐다.`,
      `${ctx.role.ko}가 된 ${ctx.name}은 전쟁의 뒤편을 달렸다. 승전보보다 더 무거운 것은 부상자의 이름, 돌아오지 못한 아들의 편지, 마지막으로 부탁한 논밭의 위치였다.`,
      `어느 겨울 전투 뒤, ${ctx.name}은 죽어 가는 병사의 편지를 품고 사흘 밤을 달렸다. 집에 도착했을 때 어머니는 이미 소문을 알고 있었지만, 편지 첫 줄을 듣고서야 무너졌다.`,
      `그 뒤로 ${ctx.name}은 편지를 전할 때마다 문 앞에서 숨을 골랐다. 말 한 줄이 사람을 살리기도 하고, 남은 생을 완전히 바꾸기도 한다는 것을 알았기 때문이다.`,
      `말년에는 역참의 낡은 방에서 젊은 파발들에게 길보다 사람의 얼굴을 기억하라고 가르쳤다. 빠른 발보다 늦지 않는 마음이 더 중요하다고 했다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 눈을 감았다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. The sound of running horses quickened the heart, and roads were memorized faster than anyone else could.`,
      `As a ${ctx.role.en}, ${ctx.name} rode behind war. Heavier than victory reports were the names of the wounded, letters from sons who would not return, and the location of fields mentioned at the end.`,
      `After one winter battle, ${ctx.name} carried a dying soldier's letter for three nights. The mother already knew the rumor, but only collapsed when the first line was read aloud.`,
      `After that, ${ctx.name} paused at every door before delivering a letter. One line could save a person, or alter the rest of a life completely.`,
      `In old age, young messengers in the post-station room were taught to remember faces more than roads. A heart that did not arrive late mattered more than fast feet.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} closed their eyes beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "달빛 아래 도망친 노비", en: "The Runaway Servant Under Moonlight" },
    subtitle: { ko: "자유가 죄가 되던 밤에도 이름을 되찾으려 한 삶", en: "A life seeking a name on a night when freedom was treated as a crime." },
    roles: [{ ko: "도망친 노비", en: "runaway servant" }, { ko: "산골 농부", en: "mountain farmer" }, { ko: "숯 굽는 사람", en: "charcoal burner" }],
    remembered: [{ ko: "자기 이름을 끝내 되찾은 사람", en: "the one who reclaimed a name in the end" }, { ko: "달빛 아래 사라져 산이 된 사람", en: "the one who vanished under moonlight and became a mountain tale" }],
    finalObjects: [{ ko: "이름을 새긴 나무패", en: "a wooden tag carved with a name" }, { ko: "숯가루 묻은 헝겊", en: "a cloth stained with charcoal dust" }],
    finalLine: { ko: "공식 기록은 그를 도망자라 불렀지만, 산마을은 그를 처음으로 자기 이름을 가진 사람이라 불렀다.", en: "Official records called them a runaway; the mountain village called them a person with a name." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}의 남의 집 뒤꼍에서 태어났다. 이름은 있었지만 아무도 제대로 불러 주지 않았고, 명령이 이름보다 먼저 날아왔다.`,
      `스무 살 무렵, ${ctx.name}은 굶주린 동생이 매 맞는 것을 보고 밤에 도망쳤다. 달빛이 너무 밝아 들킬 것 같았지만, 그 밝음 덕분에 산길의 돌부리를 피할 수 있었다.`,
      `${ctx.role.ko}로 숨어 산 세월은 자유롭기만 하지 않았다. 추적꾼이 온다는 소문이 돌면 며칠씩 굴속에 숨었고, 장에 나갈 때마다 고개를 숙였다.`,
      `그래도 산마을 사람 하나가 ${ctx.name}을 이름으로 불러 주었다. 처음 들은 그 한마디 때문에, ${ctx.name}은 다시 붙잡히더라도 자신이 물건은 아니었다는 사실을 잊지 않게 되었다.`,
      `말년에는 숯을 팔아 굶주린 아이들을 거두었다. 아이들에게 가장 먼저 가르친 것은 글자가 아니라, 서로의 이름을 정확히 불러 주는 일이었다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko}을 남기고 떠났다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} behind another family's house in ${ctx.region.en}. There was a name, but no one used it properly; orders arrived before the name did.`,
      `Around twenty, after seeing a hungry younger sibling beaten, ${ctx.name} ran at night. The moon was so bright that discovery seemed certain, but that same brightness showed the stones on the mountain path.`,
      `Life as a ${ctx.role.en} was not only freedom. Whenever rumors of trackers came, ${ctx.name} hid in caves for days and lowered the head at every market.`,
      `Still, one mountain villager called ${ctx.name} by name. Because of that first true sound, ${ctx.name} never forgot, even if captured again, that they were not an object.`,
      `In old age, charcoal was sold to take in hungry children. The first lesson was not letters, but calling one another's names correctly.`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} departed leaving ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
  {
    title: { ko: "눈보라 속 가마 불을 지킨 옹기장이", en: "The Potter Who Kept the Kiln Fire in a Snowstorm" },
    subtitle: { ko: "큰 빛은 아니었지만 가장 추운 밤에 꺼지지 않은 삶", en: "Not a great light, but an ember that stayed alive on the coldest night." },
    roles: [{ ko: "옹기장이", en: "potter" }, { ko: "가마지기", en: "kiln keeper" }, { ko: "전란 뒤의 마을 일꾼", en: "village worker after war" }],
    remembered: [{ ko: "가장 추운 밤의 불씨를 지킨 사람", en: "the one who kept the ember on the coldest night" }, { ko: "깨진 그릇보다 사람을 먼저 붙인 사람", en: "the one who mended people before broken bowls" }],
    finalObjects: [{ ko: "금 간 밥그릇 하나", en: "one cracked rice bowl" }, { ko: "재 속에 남은 작은 불씨", en: "a small ember left in ash" }],
    finalLine: { ko: "그가 만든 그릇은 깨졌어도, 그가 지킨 밤들은 오래 식지 않았다.", en: "The bowls he made broke, but the nights he protected did not cool for a long time." },
    lifeStory: (ctx, locale) => locale === "ko" ? [
      `${ctx.name}은 ${ctx.birthYear}년 ${ctx.region.ko}에서 태어났다. 흙을 만지면 마음이 가라앉았고, 깨진 그릇을 보면 그냥 버리지 못했다.`,
      `전란 뒤 마을은 집보다 먼저 그릇이 모자랐다. ${ctx.name}은 ${ctx.role.ko}로 밤마다 가마 불을 지켰고, 피난 온 아이들에게는 밥그릇부터 만들어 주었다.`,
      `가장 혹독한 겨울, 눈보라가 가마 입구를 막았다. 사람들은 불을 포기하자고 했지만, ${ctx.name}은 젖은 장작을 잘게 쪼개 새벽까지 불씨를 살렸다. 그 가마에서 나온 항아리들은 다음 봄 굶주린 집들의 장독이 되었다.`,
      `가족을 잃은 죄책감은 오래 남았다. 그래서 ${ctx.name}은 버려진 아이 하나를 거두었고, 아이가 처음으로 "아버지"라고 부르던 날 혼자 가마 뒤에서 울었다.`,
      `말년에는 더 이상 큰 그릇을 만들지 못했다. 대신 금 간 그릇을 고쳐 주며 "깨진 자리가 있어야 오래 쓰는 법을 배운다"고 말했다.`,
      `${ctx.finalYear}년 ${ctx.season.ko}, ${ctx.name}은 ${ctx.finalObject.ko} 곁에서 마지막 숨을 쉬었다. 사람들은 ${ctx.name}을 ${ctx.remembered.ko}으로 기억했다.`,
    ] : [
      `${ctx.name} was born in ${ctx.birthYear} in ${ctx.region.en}. Touching clay settled the heart, and broken bowls could never simply be thrown away.`,
      `After war, the village lacked bowls before houses. As a ${ctx.role.en}, ${ctx.name} kept the kiln fire at night and made rice bowls first for refugee children.`,
      `In the harshest winter, snow blocked the kiln mouth. Others said to give up the fire, but ${ctx.name} split wet wood into thin pieces and kept the ember alive until dawn. The jars from that kiln became sauce jars for hungry homes the next spring.`,
      `Guilt over lost family remained long. So ${ctx.name} took in one abandoned child, and when the child first said "father," ${ctx.name} cried alone behind the kiln.`,
      `In old age, large vessels could no longer be made. Instead, cracked bowls were mended while ${ctx.name} said, "A broken place teaches something how to last."`,
      `In the ${ctx.season.en} of ${ctx.finalYear}, ${ctx.name} took a final breath beside ${ctx.finalObject.en}. People remembered ${ctx.name} as ${ctx.remembered.en}.`,
    ],
  },
];

ARCHETYPES.forEach((archetype, index) => {
  Object.assign(archetype, JOSEON_LIFE_OVERRIDES[index]);
});

const SEASONS: Pair[] = [
  { ko: "늦봄", en: "late spring" },
  { ko: "초여름", en: "early summer" },
  { ko: "늦여름", en: "late summer" },
  { ko: "늦가을", en: "late autumn" },
  { ko: "눈 내리는 겨울", en: "a snowy winter" },
];

function hashName(value: string): number {
  let hash = 2166136261;
  for (const char of value.trim()) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: number, offset: number): T {
  return items[(seed + offset) % items.length];
}

function isNameLike(value: string): boolean {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > 24) return false;

  if (/^[\u3131-\u318e\u1100-\u11ff\s]+$/u.test(trimmed)) return false;
  if (/^[ㅋㅎ\s]+$/u.test(trimmed)) return false;
  if (/^[0-9\s]+$/.test(trimmed)) return false;

  const words = trimmed.split(" ");
  if (words.length > 2) return false;
  if (words.some((word) => word.length > 18)) return false;

  const allowedChars = trimmed.match(/[\uac00-\ud7a3\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Za-z0-9 ._-]/gu) ?? [];
  if (allowedChars.length !== trimmed.length) return false;
  if (!/[\uac00-\ud7a3\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Za-z]/u.test(trimmed)) return false;

  const symbolCount = (trimmed.match(/[ ._-]/g) ?? []).length;
  if (symbolCount > Math.max(2, Math.floor(trimmed.length / 3))) return false;

  return true;
}

const EDGE_NAME_PUNCT_RE = /^[\s"'`“”‘’「」『』!?.,，。！？]+|[\s"'`“”‘’「」『』!?.,，。！？]+$/g;

function sanitizeDisplayName(value: string): string {
  return value
    .trim()
    .replace(EDGE_NAME_PUNCT_RE, "")
    .trim()
    .replace(/\s+/g, " ");
}

function finalConsonantIndex(value: string): number {
  const last = Array.from(value.trim()).reverse().find((char) => /\S/.test(char));
  if (!last) return 0;
  const code = last.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28;
  if (/x$/i.test(last)) return 0;
  return /[0-9bcdfghjklmnpqrstvwxyz]$/i.test(last) ? 1 : 0;
}

function withJosa(value: string, pair: "은/는" | "을/를" | "으로/로"): string {
  const jong = finalConsonantIndex(value);
  if (pair === "은/는") return `${value}${jong ? "은" : "는"}`;
  if (pair === "을/를") return `${value}${jong ? "을" : "를"}`;
  return `${value}${jong && jong !== 8 ? "으로" : "로"}`;
}

function getInitialSharedName(): string {
  if (typeof window === "undefined") return "";
  const payload = decodeSharePayload<LifeSharePayload>(new URLSearchParams(window.location.search).get("s"));
  const name = typeof payload?.name === "string" ? sanitizeDisplayName(payload.name) : "";
  return payload?.v === 2 && isNameLike(name)
    ? name
    : "";
}

function makeParagraphs(name: string, result: Omit<LifeResult, "paragraphs">): { ko: string[]; en: string[] } {
  const { archetype, birthYear, finalYear, region, role, remembered, season, finalObject } = result;
  const storyContext = { name, birthYear, finalYear, region, role, remembered, season, finalObject };
  if (archetype.lifeStory) {
    return {
      ko: archetype.lifeStory(storyContext, "ko"),
      en: archetype.lifeStory(storyContext, "en"),
    };
  }

  return {
    ko: [
      `${withJosa(name, "은/는")} ${birthYear}년, ${region.ko}의 작은 계절 속에서 태어났습니다. 그해 마을에는 유난히 바람이 오래 머물렀고, 사람들은 아이의 눈빛이 또렷하다고 말했습니다.`,
      archetype.child.ko,
      archetype.turn.ko,
      `그 뒤 ${withJosa(name, "은/는")} ${role.ko}의 길을 걷기 시작했습니다. 처음에는 하루를 버티는 일만으로도 벅찼지만, 시간이 지날수록 그 길은 당신의 얼굴을 닮아갔습니다.`,
      archetype.hardship.ko,
      archetype.bond.ko,
      archetype.achievement.ko,
      archetype.later.ko,
      `${finalYear}년 ${season.ko}, ${withJosa(name, "은/는")} ${withJosa(finalObject.ko, "을/를")} 곁에 두고 조용히 눈을 감았습니다. 방 안에는 오래 접어 둔 마음처럼 낮은 빛이 남아 있었습니다.`,
      `훗날 사람들은 ${withJosa(name, "을/를")} 크게 빛난 인물이라 부르지는 않았습니다. 다만 ${withJosa(remembered.ko, "으로/로")}, 누군가의 기억 속에 오래 남았다고 전해졌습니다.`,
    ],
    en: [
      `${name} was born in ${birthYear}, in a small season of ${region.en}. That year, wind lingered in the village for a long time, and people said the child's eyes were unusually clear.`,
      archetype.child.en,
      archetype.turn.en,
      `After that, ${name} began walking the path of a ${role.en}. At first, simply enduring each day was enough, but over time that road began to resemble your own face.`,
      archetype.hardship.en,
      archetype.bond.en,
      archetype.achievement.en,
      archetype.later.en,
      `In the ${season.en} of ${finalYear}, ${name} quietly closed your eyes with ${finalObject.en} beside you. A low light remained in the room, like a feeling folded away for years.`,
      `Later, people did not call ${name} a dazzling figure. They remembered you as ${remembered.en}, a presence that stayed for a long time in someone's memory.`,
    ],
  };
}

function makeResult(name: string): LifeResult {
  const seed = hashName(name);
  const archetype = pick(ARCHETYPES, seed, 0);
  const birthYear = 1600 + (seed % 271);
  const lifespan = 58 + ((seed >> 5) % 19);
  const partial = {
    archetype,
    birthYear,
    finalYear: birthYear + lifespan,
    region: pick(archetype.regions, seed, 7),
    role: pick(archetype.roles, seed, 11),
    remembered: pick(archetype.remembered, seed, 13),
    season: pick(SEASONS, seed, 17),
    finalObject: pick(archetype.finalObjects, seed, 19),
  };
  return { ...partial, paragraphs: makeParagraphs(name, partial) };
}

export default function JoseonLifePage(): ReactElement {
  const { locale, t } = useLocale();
  const initialName = useMemo(() => getInitialSharedName(), []);
  const [name, setName] = useState(initialName);
  const [submittedName, setSubmittedName] = useState<string | null>(initialName || null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => (submittedName ? makeResult(submittedName) : null), [submittedName]);

  useEffect(() => {
    if (result) {
      trackResultView("joseon", result.archetype.title.en);
    }
  }, [result]);

  const submit = () => {
    const trimmed = sanitizeDisplayName(name);
    if (!isNameLike(trimmed)) {
      setError(t("이름 또는 닉네임처럼 보이는 단어를 입력해주세요.", "Please enter a word that looks like a name or nickname."));
      return;
    }
    setError("");
    setCopied(false);
    trackTestStart("joseon", "My Life in Joseon");
    setName(trimmed);
    setSubmittedName(trimmed);
    window.history.replaceState(null, "", "/games/joseon");
  };

  const share = async () => {
    if (!submittedName || !result) return;
    const url = buildShareUrl("/games/joseon", { v: 2, name: submittedName, locale } satisfies LifeSharePayload);
    const text = t(
      `${submittedName}\uC758 \uC870\uC120 \uC77C\uB300\uAE30: \u300C${result.archetype.title.ko}\u300D\n${result.remembered.ko}\uC73C\uB85C \uB0A8\uC740 \uD55C \uC0AC\uB78C\uC758 \uAC00\uC0C1 \uC0DD\uC560 \uAE30\uB85D.\n\uB108\uB3C4 \uD574\uBD10.`,
      `${submittedName}'s Joseon life: "${result.archetype.title.en}"\nA fictional life remembered as ${result.remembered.en}.\nTry it yourself.`,
    );
    trackShareClick("joseon", "test", result.archetype.title.en);
    try {
      if (navigator.share) {
        await navigator.share({ title: t("\uB0B4 \uC870\uC120 \uC77C\uB300\uAE30", "My Life in Joseon"), text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }
  };

  return (
    <main className="joseon-life">
      {!result ? (
        <section className="hero-card">
          <p className="eyebrow">{t("가상의 조선 생애 기록", "Fictional Joseon Life Record")}</p>
          <h1>{t("조선시대 나의 일대기", "My Life in Joseon")}</h1>
          <p className="lead">
            {t("이름 하나로 열어보는, 당신의 가상 조선 생애 기록", "A fictional Joseon-era life record generated from your name.")}
          </p>
          <p className="description">
            {t(
              "당신이 조선에 태어났다면 어느 해에 태어나, 어떤 삶을 살고, 어떻게 기억되었을까요?",
              "If you were born in Joseon, what kind of life would you have lived?",
            )}
          </p>
          <label className="name-box">
            <span>{t("이름 또는 닉네임", "Name or nickname")}</span>
            <input
              value={name}
              maxLength={24}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder={t("예: 서연, 민준, 달빛", "e.g. Mina, Jisoo, Moonlight")}
            />
          </label>
          <p className="helper">{t("실명 대신 닉네임을 입력해도 좋아요.", "You can use a nickname instead of your real name.")}</p>
          {error ? <p className="error">{error}</p> : null}
          <button className="primary" onClick={submit}>{t("내 일대기 열어보기", "Open My Joseon Life")}</button>
          <p className="disclaimer">{t("이 콘텐츠는 재미를 위한 가상의 이야기입니다.", "This is a fictional entertainment experience.")}</p>
        </section>
      ) : (
        <section className="result-card">
          <p className="eyebrow">{t("가상의 조선 일대기", "Fictional Joseon Life")}</p>
          <h1>「{locale === "ko" ? result.archetype.title.ko : result.archetype.title.en}」</h1>
          <p className="lead">
            {result.archetype.subtitle
              ? (locale === "ko" ? result.archetype.subtitle.ko : result.archetype.subtitle.en)
              : t(
                `${submittedName}의 이름으로 남은, 한 사람의 가상 생애 기록입니다.`,
                `A fictional life record left under the name ${submittedName}.`,
              )}
          </p>
          <div className="record-grid">
            <span>{t("출생", "Born")}<strong>{result.birthYear}{t(`년, ${result.region.ko}`, `, ${result.region.en}`)}</strong></span>
            <span>{t("역할", "Role")}<strong>{locale === "ko" ? result.role.ko : result.role.en}</strong></span>
            <span>{t("기억된 이름", "Remembered as")}<strong>{locale === "ko" ? result.remembered.ko : result.remembered.en}</strong></span>
            <span>{t("마지막 기록", "Final record")}<strong>{result.finalYear}{t(`년, ${result.season.ko}`, `, ${result.season.en}`)}</strong></span>
          </div>
          <article className="story">
            <h2>{t("당신의 조선 일대기", "Your Joseon Life")}</h2>
            {(locale === "ko" ? result.paragraphs.ko : result.paragraphs.en).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <div className="final-line">
            <span>{t("마지막 문장", "Final Line")}</span>
            <strong>{locale === "ko" ? result.archetype.finalLine.ko : result.archetype.finalLine.en}</strong>
          </div>
          <div className="actions">
            <button className="primary" onClick={share}>{t("친구에게 공유하기", "Share with friends")}</button>
            <button
              className="secondary"
              onClick={() => {
                setSubmittedName(null);
                setName("");
                setCopied(false);
                window.history.replaceState(null, "", "/games/joseon");
              }}
            >
              {t("다시 쓰기", "Write again")}
            </button>
          </div>
          {copied ? <p className="helper">{t("링크를 복사했어요.", "Link copied.")}</p> : null}
        </section>
      )}
      <AdBottom />
      {result && (
        <RecommendedGames currentId="joseon" ids={["crush-type", "joseon-couple", "friend-match"]} />
      )}
      <AdMobileSticky />
      <style jsx>{`
        .joseon-life {
          min-height: 100vh;
          padding: 28px 18px 56px;
          color: #332319;
          background:
            radial-gradient(circle at 20% 0%, rgba(154, 57, 36, 0.18), transparent 32%),
            linear-gradient(135deg, #efe0c3 0%, #d8b985 48%, #6c2d22 100%);
          font-family: "Noto Serif KR", "Noto Serif", Georgia, serif;
        }
        .back-link {
          display: inline-flex;
          margin: 0 auto 22px;
          color: rgba(51, 35, 25, 0.78);
          text-decoration: none;
          font-weight: 800;
        }
        .hero-card,
        .result-card {
          width: min(920px, 100%);
          margin: 0 auto 28px;
        }
        .result-card {
          border: 1px solid rgba(96, 52, 33, 0.24);
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(255, 250, 234, 0.96), rgba(241, 220, 181, 0.94)),
            #f4dfb5;
          box-shadow: 0 30px 80px rgba(48, 23, 17, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }
        .hero-card {
          background: transparent;
          border: 0;
          box-shadow: none;
          padding: clamp(32px, 6vw, 64px) clamp(8px, 2vw, 16px);
          text-align: center;
        }
        .result-card {
          padding: clamp(26px, 5vw, 56px);
        }
        .eyebrow {
          margin: 0 0 14px;
          color: #9b472d;
          font: 800 13px/1.2 "Noto Sans KR", system-ui, sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        h1 {
          margin: 0;
          font-size: clamp(32px, 6vw, 56px);
          line-height: 1.05;
          color: #3b2117;
        }
        .lead,
        .description {
          max-width: 700px;
          margin: 18px auto 0;
          color: rgba(61, 37, 26, 0.78);
          font: 600 clamp(16px, 2.4vw, 20px)/1.7 "Noto Sans KR", system-ui, sans-serif;
        }
        .description {
          margin-top: 10px;
          font-size: clamp(15px, 2vw, 17px);
        }
        .name-box {
          display: grid;
          gap: 10px;
          max-width: 460px;
          margin: 34px auto 8px;
          text-align: left;
          font: 800 14px/1.3 "Noto Sans KR", system-ui, sans-serif;
        }
        input {
          width: 100%;
          min-height: 58px;
          border: 1px solid rgba(116, 62, 35, 0.24);
          border-radius: 14px;
          padding: 0 18px;
          background: rgba(255, 252, 241, 0.84);
          color: #3b2117;
          font: 800 18px/1 "Noto Sans KR", system-ui, sans-serif;
          outline: none;
        }
        input:focus {
          border-color: rgba(151, 64, 37, 0.62);
          box-shadow: 0 0 0 4px rgba(151, 64, 37, 0.12);
        }
        .helper,
        .disclaimer,
        .error {
          margin: 10px auto 0;
          color: rgba(61, 37, 26, 0.66);
          font: 700 14px/1.6 "Noto Sans KR", system-ui, sans-serif;
        }
        .error {
          color: #9b2f23;
        }
        button {
          border: 0;
          cursor: pointer;
          font-family: "Noto Sans KR", system-ui, sans-serif;
          font-weight: 800;
        }
        .primary {
          min-height: 54px;
          margin-top: 24px;
          border-radius: 10px;
          padding: 0 28px;
          background: linear-gradient(135deg, #8f3425, #c8693c);
          color: #fff7e9;
          box-shadow: 0 18px 36px rgba(103, 39, 26, 0.26);
        }
        .secondary {
          min-height: 54px;
          margin-top: 24px;
          border-radius: 10px;
          padding: 0 24px;
          background: rgba(63, 36, 25, 0.08);
          color: #4d3023;
        }
        .record-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 32px 0;
        }
        .record-grid span {
          display: grid;
          gap: 8px;
          min-height: 104px;
          border-radius: 14px;
          padding: 16px;
          background: rgba(94, 54, 31, 0.08);
          color: rgba(58, 36, 25, 0.62);
          font: 800 13px/1.3 "Noto Sans KR", system-ui, sans-serif;
        }
        .record-grid strong {
          color: #321f16;
          font-size: 16px;
          line-height: 1.45;
        }
        .story {
          max-width: 760px;
          margin: 0 auto;
        }
        .story h2 {
          margin: 0 0 22px;
          font-size: clamp(24px, 4vw, 34px);
        }
        .story p {
          margin: 0 0 18px;
          color: rgba(54, 33, 24, 0.88);
          font: 600 clamp(16px, 2vw, 18px)/1.9 "Noto Sans KR", system-ui, sans-serif;
        }
        .final-line {
          max-width: 760px;
          margin: 32px auto 0;
          border-top: 1px solid rgba(84, 47, 29, 0.18);
          padding-top: 24px;
        }
        .final-line span {
          display: block;
          margin-bottom: 8px;
          color: #9b472d;
          font: 800 13px/1.2 "Noto Sans KR", system-ui, sans-serif;
        }
        .final-line strong {
          color: #321f16;
          font-size: clamp(19px, 3vw, 26px);
          line-height: 1.6;
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 12px;
        }
        @media (max-width: 720px) {
          .joseon-life {
            padding: 18px 12px 44px;
          }
          .record-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 480px) {
          .record-grid {
            grid-template-columns: 1fr;
          }
          .primary,
          .secondary {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
