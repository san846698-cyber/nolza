"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { AdBottom, AdMobileSticky } from "@/app/components/Ads";
import RecommendedGames from "@/app/components/game/RecommendedGames";
import { useLocale, type SimpleLocale } from "@/hooks/useLocale";
import { trackResultView, trackShareClick, trackTestStart } from "@/lib/analytics";
import { buildShareUrl, decodeSharePayload } from "@/lib/share-result";

type LifeSharePayload = { v: 2; name: string; locale?: SimpleLocale };
type Pair = { ko: string; en: string };
type Archetype = {
  title: Pair;
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
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 24) return false;
  if (!/[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Za-z0-9]/u.test(trimmed)) return false;
  if (/^[\u3131-\u318e\u1100-\u11ff\u1160-\u11ff\s\W_]+$/u.test(trimmed)) return false;
  return true;
}

function getInitialSharedName(): string {
  if (typeof window === "undefined") return "";
  const payload = decodeSharePayload<LifeSharePayload>(new URLSearchParams(window.location.search).get("s"));
  return payload?.v === 2 && typeof payload.name === "string" && isNameLike(payload.name)
    ? payload.name.trim()
    : "";
}

function makeParagraphs(name: string, result: Omit<LifeResult, "paragraphs">): { ko: string[]; en: string[] } {
  const { archetype, birthYear, finalYear, region, role, remembered, season, finalObject } = result;
  return {
    ko: [
      `${name}은 ${birthYear}년, ${region.ko}의 작은 계절 속에서 태어났습니다. 그해 마을에는 유난히 바람이 오래 머물렀고, 사람들은 아이의 눈빛이 또렷하다고 말했습니다.`,
      archetype.child.ko,
      archetype.turn.ko,
      `그 뒤 ${name}은 ${role.ko}의 길을 걷기 시작했습니다. 처음에는 하루를 버티는 일만으로도 벅찼지만, 시간이 지날수록 그 길은 당신의 얼굴을 닮아갔습니다.`,
      archetype.hardship.ko,
      archetype.bond.ko,
      archetype.achievement.ko,
      archetype.later.ko,
      `${finalYear}년 ${season.ko}, ${name}은 ${finalObject.ko}을 곁에 두고 조용히 눈을 감았습니다. 방 안에는 오래 접어 둔 마음처럼 낮은 빛이 남아 있었습니다.`,
      `훗날 사람들은 ${name}을 크게 빛난 인물이라 부르지는 않았습니다. 다만 ${remembered.ko}으로, 누군가의 기억 속에 오래 남았다고 전해졌습니다.`,
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
    const trimmed = name.trim();
    if (!isNameLike(trimmed)) {
      setError(t("이름처럼 보이는 닉네임을 입력해주세요.", "Please enter a name-like nickname."));
      return;
    }
    setError("");
    setCopied(false);
    trackTestStart("joseon", "My Life in Joseon");
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
      <Link href="/" className="back-link">{t("← Nolza.fun으로 돌아가기", "← Back to Nolza.fun")}</Link>
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
            {t(
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
            <span>{t("마지막 기록", "Final Line")}</span>
            <strong>{locale === "ko" ? result.archetype.finalLine.ko : result.archetype.finalLine.en}</strong>
          </div>
          <div className="actions">
            <button className="primary" onClick={share}>{t("내 조선 일대기 공유하기", "Share my Joseon life")}</button>
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
      <RecommendedGames currentId="joseon" ids={["crush-type", "joseon-couple", "friend-match"]} />
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
          border: 1px solid rgba(96, 52, 33, 0.24);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255, 250, 234, 0.96), rgba(241, 220, 181, 0.94)),
            #f4dfb5;
          box-shadow: 0 30px 80px rgba(48, 23, 17, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }
        .hero-card {
          padding: clamp(32px, 6vw, 64px);
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
          font-size: clamp(36px, 7vw, 68px);
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
          border-radius: 18px;
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
          font-weight: 900;
        }
        .primary {
          min-height: 54px;
          margin-top: 24px;
          border-radius: 999px;
          padding: 0 28px;
          background: linear-gradient(135deg, #8f3425, #c8693c);
          color: #fff7e9;
          box-shadow: 0 18px 36px rgba(103, 39, 26, 0.26);
        }
        .secondary {
          min-height: 54px;
          margin-top: 24px;
          border-radius: 999px;
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
          border-radius: 18px;
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
          font: 900 13px/1.2 "Noto Sans KR", system-ui, sans-serif;
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
