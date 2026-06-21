"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdGameEnd } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

type T = (ko: string, en: string) => string;

type Tier = "branch" | "linked" | "mid" | "late" | "chaos";
type Option = { id?: string; text: string; text_en: string; next?: string };
type Q = {
  id: string;
  q: string;
  q_en: string;
  options: Option[];
  fixedNext?: string;
  tier: Tier;
};

// Module-scope data can't call the hook, so resolve localized copy at the
// render site with these helpers.
const trQ = (q: Q, locale: "ko" | "en"): string => (locale === "ko" ? q.q : q.q_en);
const trOpt = (o: Option, locale: "ko" | "en"): string =>
  locale === "ko" ? o.text : o.text_en;
// The "아 몰라" / give-up branch is matched on the Korean source text, which is
// always present regardless of locale.
const isGiveUp = (o: Option): boolean =>
  o.id === "ahmolla" || o.text.includes("아 몰라");

/* ─── 게임이 플레이어를 공격/거짓말/조롱하는 질문 풀 ───
   초반은 음식별 4개 브랜치(branch)로 분리. 각 브랜치는 explicit next chain.
   "그냥요" "왜 알아요" 같은 반응 질문은 tier="linked"로,
   pickByDepth가 절대 랜덤 선택 안 함. 오직 option.next 또는 fixedNext로만 도달.
   브랜치 끝(no next) → pickByDepth가 MID 풀에서 랜덤. */
const QUESTIONS: Q[] = [
  /* INITIAL — 4개 음식 분기 */
  { id: "e1", tier: "branch", q: "점심 뭐 먹을래요?", q_en: "What do you want for lunch?",
    options: [
      { text: "치킨", text_en: "Chicken", next: "ck_pick" },
      { text: "피자", text_en: "Pizza", next: "pz_pick" },
      { text: "파스타", text_en: "Pasta", next: "ps_pick" },
      { text: "한식", text_en: "Korean food", next: "kr_pick" },
    ] },

  /* ─── CHICKEN ─── */
  { id: "ck_pick", tier: "branch", q: "어느 치킨?", q_en: "Which chicken place?",
    options: [
      { text: "BBQ", text_en: "BBQ", next: "ck_bbq" },
      { text: "교촌", text_en: "Kyochon", next: "ck_kyochon" },
      { text: "BHC", text_en: "BHC", next: "ck_bhc" },
      { text: "굽네", text_en: "Goobne", next: "ck_gup" },
    ] },
  { id: "ck_bbq", tier: "linked", q: "BBQ가 더 비싼 거 알면서 고른 거죠?", q_en: "You picked BBQ knowing it's pricier, right?",
    options: [
      { text: "네...", text_en: "Yeah...", next: "ck_menu" },
      { text: "아니요", text_en: "No", next: "ck_menu" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
      { text: "묻지 마세요", text_en: "Don't ask", next: "ck_menu" },
    ] },
  { id: "ck_kyochon", tier: "linked", q: "교촌은 간장이 진리죠?", q_en: "Kyochon soy-glaze is the one true flavor, right?",
    options: [
      { text: "당연하죠", text_en: "Obviously", next: "ck_menu" },
      { text: "후라이드도 좋아요", text_en: "Fried is good too", next: "ck_menu" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
      { text: "별로 동의 안 해요", text_en: "Don't really agree", next: "ck_menu" },
    ] },
  { id: "ck_bhc", tier: "linked", q: "뿌링클이죠?", q_en: "Bburinkle, right?",
    options: [
      { text: "맞아요 뿌링클", text_en: "Yep, Bburinkle", next: "ck_menu" },
      { text: "다른 거 시킬래요", text_en: "I'll get something else", next: "ck_menu" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
      { text: "맛초킹이요", text_en: "Matchoking", next: "ck_menu" },
    ] },
  { id: "ck_gup", tier: "linked", q: "굽네 시키는 사람 처음 봤어요", q_en: "First time I've seen someone order Goobne",
    options: [
      { text: "그래요?", text_en: "Really?", next: "ck_menu" },
      { text: "고추바사삭 매니아예요", text_en: "I'm a Gochu-Basak fan", next: "ck_menu" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
      { text: "조용히 시킬게요", text_en: "I'll order quietly", next: "ck_menu" },
    ] },
  { id: "ck_menu", tier: "branch", q: "어느 메뉴로 가시려고요?", q_en: "Which menu are you going for?", fixedNext: "ck_side",
    options: [{ text: "후라이드", text_en: "Fried" }, { text: "양념", text_en: "Seasoned" }, { text: "간장", text_en: "Soy-glaze" }, { text: "반반", text_en: "Half and half" }] },
  { id: "ck_side", tier: "branch", q: "사이드는?", q_en: "And the side?",
    options: [
      { text: "치즈볼", text_en: "Cheese balls", next: "ck_drink" },
      { text: "감자튀김", text_en: "Fries", next: "ck_drink" },
      { text: "없음", text_en: "None", next: "ck_drink" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "ck_drink", tier: "branch", q: "음료는?", q_en: "What drink?",
    options: [{ text: "콜라", text_en: "Coke" }, { text: "사이다", text_en: "Sprite" }, { text: "맥주", text_en: "Beer" }, { text: "물", text_en: "Water" }] },

  /* ─── PIZZA ─── */
  { id: "pz_pick", tier: "branch", q: "어느 피자집?", q_en: "Which pizza place?",
    options: [
      { text: "도미노", text_en: "Domino's", next: "pz_domino" },
      { text: "피자헛", text_en: "Pizza Hut", next: "pz_hut" },
      { text: "파파존스", text_en: "Papa John's", next: "pz_papa" },
      { text: "미스터피자", text_en: "Mr. Pizza", next: "pz_mr" },
    ] },
  { id: "pz_domino", tier: "linked", q: "엣지 추가했어요?", q_en: "Did you add stuffed crust?",
    options: [
      { text: "네 치즈로", text_en: "Yes, cheese", next: "pz_dough" },
      { text: "네 페퍼로니로", text_en: "Yes, pepperoni", next: "pz_dough" },
      { text: "아니요", text_en: "No", next: "pz_dough" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "pz_hut", tier: "linked", q: "피자헛이요? 요즘도 있어요?", q_en: "Pizza Hut? Is that still around?",
    options: [
      { text: "있어요", text_en: "It is", next: "pz_dough" },
      { text: "모름", text_en: "Dunno", next: "pz_dough" },
      { text: "거기가 진리예요", text_en: "It's the best", next: "pz_dough" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "pz_papa", tier: "linked", q: "파파존스 페퍼로니가 진리죠?", q_en: "Papa John's pepperoni is the best, right?",
    options: [
      { text: "맞아요", text_en: "Right", next: "pz_dough" },
      { text: "다른 거 좋아해요", text_en: "I like others", next: "pz_dough" },
      { text: "모름", text_en: "Dunno", next: "pz_dough" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "pz_mr", tier: "linked", q: "미스터피자, 회식 때 자주 시키죠?", q_en: "Mr. Pizza — you order it for work dinners, right?",
    options: [
      { text: "네 회식때 진리", text_en: "Yeah, perfect for those", next: "pz_dough" },
      { text: "혼자도 시켜요", text_en: "I get it solo too", next: "pz_dough" },
      { text: "안 시켜요", text_en: "I don't", next: "pz_dough" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "pz_dough", tier: "branch", q: "도우는요?", q_en: "What about the dough?", fixedNext: "pz_topping",
    options: [{ text: "씬", text_en: "Thin" }, { text: "오리지널", text_en: "Original" }, { text: "치즈크러스트", text_en: "Cheese crust" }, { text: "햄크러스트", text_en: "Ham crust" }] },
  { id: "pz_topping", tier: "branch", q: "토핑 추가하시려고요?", q_en: "Adding any toppings?", fixedNext: "pz_size",
    options: [{ text: "치즈", text_en: "Cheese" }, { text: "페퍼로니", text_en: "Pepperoni" }, { text: "베이컨", text_en: "Bacon" }, { text: "안 함", text_en: "None" }] },
  { id: "pz_size", tier: "branch", q: "사이즈는요?", q_en: "What size?",
    options: [{ text: "L", text_en: "L" }, { text: "XL", text_en: "XL" }, { text: "가족 피자", text_en: "Family size" }, { text: "한 입 사이즈", text_en: "Bite size" }] },

  /* ─── PASTA ─── */
  { id: "ps_pick", tier: "branch", q: "직접 만들어요? 시켜요?", q_en: "Making it yourself, or ordering?",
    options: [
      { text: "시켜요", text_en: "Ordering", next: "ps_order" },
      { text: "직접 만들어요", text_en: "Making it myself", next: "ps_make" },
      { text: "잘 모르겠어요", text_en: "Not sure", next: "ps_unsure" },
      { text: "안 만들어요", text_en: "I don't cook", next: "ps_lazy" },
    ] },
  { id: "ps_order", tier: "linked", q: "어느 가게에서 시키세요?", q_en: "Which place do you order from?",
    options: [
      { text: "매드포갈릭", text_en: "Mad for Garlic", next: "ps_kind" },
      { text: "동네 이태리집", text_en: "Local Italian spot", next: "ps_kind" },
      { text: "프랜차이즈", text_en: "A chain", next: "ps_kind" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "ps_make", tier: "linked", q: "대단하네요. 레시피 있어요?", q_en: "Impressive. Do you have a recipe?",
    options: [
      { text: "네 자주 해요", text_en: "Yeah, I cook often", next: "ps_kind" },
      { text: "유튜브 보고", text_en: "I follow YouTube", next: "ps_kind" },
      { text: "감으로 해요", text_en: "I wing it", next: "ps_kind" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "ps_unsure", tier: "linked", q: "잘 모르겠다면 결국 시키시는 거죠?", q_en: "If you're not sure, you'll end up ordering, right?",
    options: [
      { text: "네 그렇네요", text_en: "Yeah, true", next: "ps_kind" },
      { text: "직접도 가끔", text_en: "Sometimes I cook", next: "ps_kind" },
      { text: "여전히 모름", text_en: "Still no idea", next: "ps_kind" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "ps_lazy", tier: "linked", q: "안 만들면 평소에 어떻게 살아요?", q_en: "If you don't cook, how do you usually eat?",
    options: [
      { text: "다 시켜먹어요", text_en: "I order everything", next: "ps_kind" },
      { text: "엄마밥요", text_en: "Mom's cooking", next: "ps_kind" },
      { text: "외식이 답", text_en: "Eating out is the answer", next: "ps_kind" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "ps_kind", tier: "branch", q: "어떤 파스타?", q_en: "Which pasta?", fixedNext: "ps_noodle",
    options: [
      { text: "까르보나라", text_en: "Carbonara" },
      { text: "토마토", text_en: "Tomato" },
      { text: "알리오올리오", text_en: "Aglio e olio" },
      { text: "로제", text_en: "Rosé" },
    ] },
  { id: "ps_noodle", tier: "branch", q: "면 종류는?", q_en: "What kind of noodle?", fixedNext: "ps_spice",
    options: [{ text: "스파게티", text_en: "Spaghetti" }, { text: "페투치네", text_en: "Fettuccine" }, { text: "펜네", text_en: "Penne" }, { text: "모름", text_en: "Dunno" }] },
  { id: "ps_spice", tier: "branch", q: "매운 정도?", q_en: "How spicy?",
    options: [{ text: "순한맛", text_en: "Mild" }, { text: "보통", text_en: "Medium" }, { text: "매운맛", text_en: "Spicy" }, { text: "엄청 매운맛", text_en: "Extra spicy" }] },

  /* ─── KOREAN ─── */
  { id: "kr_pick", tier: "branch", q: "어떤 한식?", q_en: "Which Korean dish?",
    options: [
      { text: "김치찌개", text_en: "Kimchi stew", next: "kr_kjjigae" },
      { text: "된장찌개", text_en: "Soybean-paste stew", next: "kr_djjigae" },
      { text: "제육볶음", text_en: "Spicy stir-fried pork", next: "kr_jeyuk" },
      { text: "비빔밥", text_en: "Bibimbap", next: "kr_bibim" },
    ] },
  { id: "kr_kjjigae", tier: "linked", q: "집밥이에요? 식당이에요?", q_en: "Home-cooked, or from a restaurant?",
    options: [
      { text: "집밥요", text_en: "Home-cooked", next: "kr_banchan" },
      { text: "식당요", text_en: "Restaurant", next: "kr_banchan" },
      { text: "배달요", text_en: "Delivery", next: "kr_banchan" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "kr_djjigae", tier: "linked", q: "어머니 생각나요?", q_en: "Does it remind you of your mom?",
    options: [
      { text: "네...", text_en: "Yeah...", next: "kr_banchan" },
      { text: "아니요", text_en: "No", next: "kr_banchan" },
      { text: "이미 어머니가 만든 거예요", text_en: "Mom actually made it", next: "kr_banchan" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "kr_jeyuk", tier: "linked", q: "제육 좋아하는 사람치고 다이어트 잘 하는 사람 못 봤네요", q_en: "Never met a spicy-pork lover who stuck to a diet",
    options: [
      { text: "들켰다", text_en: "Busted", next: "kr_banchan" },
      { text: "관계없어요", text_en: "Unrelated", next: "kr_banchan" },
      { text: "오늘 잘 하면 됨", text_en: "I'll be good today", next: "kr_banchan" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "kr_bibim", tier: "linked", q: "전주식이에요?", q_en: "Jeonju-style?",
    options: [
      { text: "네 전주식", text_en: "Yes, Jeonju-style", next: "kr_banchan" },
      { text: "산채비빔밥요", text_en: "Mountain-veggie kind", next: "kr_banchan" },
      { text: "구분 안 해요", text_en: "I don't distinguish", next: "kr_banchan" },
      { text: "그냥요", text_en: "No reason", next: "e_just" },
    ] },
  { id: "kr_banchan", tier: "branch", q: "반찬 몇 개 깔까요?", q_en: "How many side dishes?", fixedNext: "kr_rice",
    options: [{ text: "3개", text_en: "3" }, { text: "4개", text_en: "4" }, { text: "많을수록", text_en: "The more the better" }, { text: "안 시킴", text_en: "None" }] },
  { id: "kr_rice", tier: "branch", q: "밥 양은요?", q_en: "How much rice?", fixedNext: "kr_kside",
    options: [{ text: "공기 그대로", text_en: "Regular bowl" }, { text: "곱빼기", text_en: "Extra large" }, { text: "반 공기", text_en: "Half bowl" }, { text: "그릇만", text_en: "Just the bowl" }] },
  { id: "kr_kside", tier: "branch", q: "김치는요?", q_en: "What about kimchi?",
    options: [{ text: "신김치", text_en: "Sour kimchi" }, { text: "묵은지", text_en: "Aged kimchi" }, { text: "백김치", text_en: "White kimchi" }, { text: "안 먹음", text_en: "None" }] },

  /* ─── LINKED — "그냥요" 우회 ─── */
  { id: "e_just", tier: "linked", q: "그냥이라고 하는 사람치고 그냥인 적 없던데요", q_en: "People who say 'no reason' always have one", fixedNext: "e_why",
    options: [{ text: "맞아요", text_en: "True" }, { text: "틀려요", text_en: "Wrong" }, { text: "왜 알아요", text_en: "How do you know" }, { text: "들켰다", text_en: "Busted" }] },
  { id: "e_why", tier: "linked", q: "저도 몰라요. 근데 왜 아직도 여기 있어요?", q_en: "I don't know either. So why are you still here?",
    options: [{ text: "심심해서", text_en: "I'm bored" }, { text: "치킨 먹고 싶어서", text_en: "I want chicken" }, { text: "인생이 그래서", text_en: "That's life" }, { text: "아 몰라", text_en: "I give up" }] },

  /* MID — 게임이 이상해지기 시작 */
  { id: "m1", tier: "mid", q: "마지막 질문입니다", q_en: "This is the last question", fixedNext: "m2",
    options: [{ text: "다행이다", text_en: "What a relief" }, { text: "아쉽다", text_en: "Aw, too bad" }, { text: "몰랐어요", text_en: "Didn't know" }, { text: "어차피 안 믿어요", text_en: "I don't believe you anyway" }] },
  { id: "m2", tier: "mid", q: "아 거짓말이었어요 ㅋ", q_en: "Oh, that was a lie lol",
    options: [{ text: "알았어요", text_en: "Figured" }, { text: "화났어요", text_en: "I'm mad" }, { text: "역시", text_en: "Of course" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m3", tier: "mid", q: "지금 몇 번째 질문인지 세고 있었어요?", q_en: "Have you been counting which question this is?",
    options: [{ text: "네", text_en: "Yes", next: "m4" }, { text: "아니요", text_en: "No" }, { text: "이제부터 셀게요", text_en: "I'll start now" }, { text: "알려주세요", text_en: "Tell me" }] },
  { id: "m4", tier: "mid", q: "거짓말. 세고 있었으면 이 질문 안 골랐겠죠", q_en: "Liar. If you'd been counting you wouldn't have picked that",
    options: [{ text: "...", text_en: "..." }, { text: "아닌데요", text_en: "I wasn't lying" }, { text: "들켰다", text_en: "Busted" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m5", tier: "mid", q: "지금 이게 재밌어요?", q_en: "Are you actually enjoying this?",
    options: [{ text: "네", text_en: "Yes", next: "m5y" }, { text: "아니요", text_en: "No", next: "m5n" }, { text: "모르겠어요", text_en: "Not sure" }, { text: "왜 물어봐요", text_en: "Why ask" }] },
  { id: "m5y", tier: "mid", q: "다행이에요. 저도요.", q_en: "Glad to hear it. Me too.",
    options: [{ text: "게임이 말하는 거예요?", text_en: "Is the game talking?" }, { text: "무서워요", text_en: "That's scary" }, { text: "고마워요", text_en: "Thanks" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m5n", tier: "mid", q: "그런데 왜 계속하고 있어요?", q_en: "Then why are you still going?",
    options: [{ text: "습관", text_en: "Habit" }, { text: "기대가 있어서", text_en: "I expect something" }, { text: "멈추는 법을 모름", text_en: "Don't know how to stop" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m6", tier: "mid", q: "혹시 지금 배고파요?", q_en: "Are you hungry right now?",
    options: [{ text: "네", text_en: "Yes" }, { text: "아니요", text_en: "No" }, { text: "치킨 얘기하다 보니까요", text_en: "Now that we talked chicken" }, { text: "아까부터요", text_en: "Have been for a while" }] },
  { id: "m7", tier: "mid", q: "치킨 주문했어요?", q_en: "Did you order the chicken?",
    options: [{ text: "네", text_en: "Yes" }, { text: "아직요", text_en: "Not yet" }, { text: "이거 하고요", text_en: "After this" }, { text: "게임 때문에 까먹었어요", text_en: "Forgot because of this game", next: "m8" }] },
  { id: "m8", tier: "mid", q: "제 잘못이네요. 죄송해요.", q_en: "That's my fault. I'm sorry.",
    options: [{ text: "괜찮아요", text_en: "It's fine" }, { text: "사실 안 배고팠어요", text_en: "I wasn't hungry anyway" }, { text: "책임져요", text_en: "Take responsibility" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m9", tier: "mid", q: "솔직히 지금 뭐 하고 있는지 알아요?", q_en: "Honestly, do you know what you're doing right now?",
    options: [{ text: "게임", text_en: "Playing a game" }, { text: "시간 떼우기", text_en: "Killing time" }, { text: "생각 정리", text_en: "Clearing my head" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m10", tier: "mid", q: "옆에 누군가 있어요?", q_en: "Is someone next to you?",
    options: [{ text: "네", text_en: "Yes" }, { text: "혼자", text_en: "I'm alone", next: "m11" }, { text: "이미 자고 있어요", text_en: "They're asleep" }, { text: "모르겠어요", text_en: "Not sure" }] },
  { id: "m11", tier: "mid", q: "혼자라고 했죠. 외로워요?", q_en: "You said you're alone. Lonely?",
    options: [{ text: "네", text_en: "Yes" }, { text: "아뇨 그냥 편해요", text_en: "No, just comfy" }, { text: "왜 알아요", text_en: "How do you know" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m12", tier: "mid", q: "시계 봤어요?", q_en: "Have you checked the clock?",
    options: [{ text: "네", text_en: "Yes" }, { text: "아니요", text_en: "No" }, { text: "시계 없어요", text_en: "I don't have a clock", next: "m13" }, { text: "시간이 뭐예요", text_en: "What is time" }] },
  { id: "m13", tier: "mid", q: "폰에는 있을 텐데요.", q_en: "Your phone has one, though.",
    options: [{ text: "그렇네요", text_en: "True" }, { text: "말 돌리지 마요", text_en: "Don't change the subject" }, { text: "그래서요", text_en: "So what" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "m14", tier: "mid", q: "이 질문에 답하기 전에 한 번 망설였죠?", q_en: "You hesitated before answering this, didn't you?",
    options: [{ text: "네", text_en: "Yes" }, { text: "아니요", text_en: "No" }, { text: "들켰다", text_en: "Busted" }, { text: "모름", text_en: "Dunno" }] },

  /* LATE — 선택지 조작 */
  { id: "l1", tier: "late", q: "다음 중 하나를 고르세요", q_en: "Pick one of the following",
    options: [{ text: "계속하기", text_en: "Continue" }, { text: "계속하기", text_en: "Continue" }, { text: "계속하기", text_en: "Continue" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "l2", tier: "late", q: "또 고르세요", q_en: "Pick again",
    options: [{ text: "이게 뭐예요", text_en: "What is this" }, { text: "이게 뭐예요", text_en: "What is this" }, { text: "이게 뭐예요", text_en: "What is this" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "l3", tier: "late", q: "진짜 마지막이에요 (이번엔 진짜)", q_en: "Really the last one (for real this time)", fixedNext: "l4",
    options: [{ text: "믿어요", text_en: "I believe you" }, { text: "안 믿어요", text_en: "I don't" }, { text: "또 거짓말이죠", text_en: "Another lie, right" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "l4", tier: "late", q: "또 거짓말이었어요", q_en: "It was a lie again",
    options: [{ text: "예상했어요", text_en: "Saw it coming" }, { text: "배신감", text_en: "Feel betrayed" }, { text: "이제 익숙해요", text_en: "Used to it now" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "l5", tier: "late", q: "선택해주세요", q_en: "Please choose",
    options: [{ text: "A", text_en: "A" }, { text: "A", text_en: "A" }, { text: "A", text_en: "A" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "l6", tier: "late", q: "어떤 거 골라도 똑같아요", q_en: "Whatever you pick is the same",
    options: [{ text: "아는데요", text_en: "I know" }, { text: "그래도 골랐는데", text_en: "I picked anyway" }, { text: "그럼 왜 물어봐요", text_en: "Then why ask" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "l7", tier: "late", q: "진짜 다음이 마지막이에요", q_en: "The next one is really the last", fixedNext: "l4",
    options: [{ text: "알았어요", text_en: "Okay" }, { text: "안 믿어요", text_en: "I don't believe you" }, { text: "거짓말 그만", text_en: "Stop lying" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "l8", tier: "late", q: "선택지가 왜 도망가는지 알아요?", q_en: "Do you know why the options run away?",
    options: [{ text: "버그인가요", text_en: "Is it a bug" }, { text: "모르겠어요", text_en: "No idea" }, { text: "숨었어요", text_en: "They're hiding" }, { text: "아 몰라", text_en: "I give up" }] },

  /* CHAOS — 철학 */
  { id: "c1", tier: "chaos", q: "지금 이 게임을 하고 있는 건가요, 게임이 당신을 하고 있는 건가요?", q_en: "Are you playing this game, or is the game playing you?",
    options: [{ text: "내가 하고 있어요", text_en: "I'm playing it" }, { text: "게임이 하고 있어요", text_en: "The game is playing me" }, { text: "구분이 안 돼요", text_en: "Can't tell anymore" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "c2", tier: "chaos", q: "'아 몰라'를 누르지 않는 이유가 뭐예요?", q_en: "Why won't you press 'I give up'?",
    options: [{ text: "끝까지 가고 싶어서", text_en: "I want to reach the end" }, { text: "뭔가 있을 것 같아서", text_en: "I think there's a payoff" }, { text: "습관", text_en: "Habit" }, { text: "아 몰라 (아이러니)", text_en: "I give up (ironic)" }] },
  { id: "c3", tier: "chaos", q: "이 게임에 끝이 있다고 생각해요?", q_en: "Do you think this game has an end?",
    options: [{ text: "네", text_en: "Yes" }, { text: "아니요", text_en: "No" }, { text: "있어야 한다고 생각해요", text_en: "It should" }, { text: "이미 끝난 거 아닌가요", text_en: "Didn't it already end?", next: "c4" }] },
  { id: "c4", tier: "chaos", q: "...", q_en: "...",
    options: [{ text: "...", text_en: "..." }, { text: "...", text_en: "..." }, { text: "...", text_en: "..." }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "c5", tier: "chaos", q: "당신이 선택한 것들이 당신을 만든다고 생각해요?", q_en: "Do you think your choices make you who you are?",
    options: [{ text: "네", text_en: "Yes" }, { text: "아니요", text_en: "No" }, { text: "치킨부터요?", text_en: "Starting with chicken?" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "c6", tier: "chaos", q: "지금 무슨 생각해요?", q_en: "What are you thinking right now?",
    options: [{ text: "'아 몰라' 누를까", text_en: "Whether to press 'I give up'" }, { text: "끝까지 갈까", text_en: "Whether to go all the way" }, { text: "배고픔", text_en: "Hunger" }, { text: "없음", text_en: "Nothing" }] },
  { id: "c7", tier: "chaos", q: "사실 처음부터 답이 정해져 있었어요.", q_en: "Actually, the answer was set from the start.",
    options: [{ text: "어떤 답이요?", text_en: "What answer?", next: "c8" }, { text: "이미 알았어요", text_en: "I already knew" }, { text: "그럴 줄 알았어요", text_en: "Figured as much" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "c8", tier: "chaos", q: "그 답은 안 알려드려요.", q_en: "I won't tell you the answer.",
    options: [{ text: "왜요?", text_en: "Why?" }, { text: "예상했어요", text_en: "Saw it coming" }, { text: "치사해요", text_en: "That's mean" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "c9", tier: "chaos", q: "이쯤 되면 그냥 누르셔도 돼요", q_en: "At this point you can just press it",
    options: [{ text: "알아요", text_en: "I know" }, { text: "근데 안 눌러요", text_en: "But I won't" }, { text: "뭔가 아쉬워요", text_en: "Feels like a waste" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "c10", tier: "chaos", q: "왜요?", q_en: "Why?",
    options: [{ text: "몰라요", text_en: "Dunno" }, { text: "몰라요", text_en: "Dunno" }, { text: "몰라요", text_en: "Dunno" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "c11", tier: "chaos", q: "저도 몰라요", q_en: "I don't know either",
    options: [{ text: "...", text_en: "..." }, { text: "아 몰라", text_en: "I give up" }, { text: "계속해요", text_en: "Keep going" }, { text: "알려주세요", text_en: "Tell me" }] },
  { id: "c12", tier: "chaos", q: "그래서요?", q_en: "So?",
    options: [{ text: "아 몰라", text_en: "I give up" }, { text: "계속해요", text_en: "Keep going" }, { text: "이건 뭐예요", text_en: "What is this" }, { text: "이미 알아요", text_en: "I already know" }] },

  /* TAUNT — 도발 질문 (MID 풀에 섞임) */
  { id: "t1", tier: "mid", q: "혹시 지금 아 몰라 누르고 싶어요?", q_en: "Do you feel like pressing 'I give up' right now?",
    options: [
      { text: "아니요, 절대요", text_en: "No, never", next: "t1y" },
      { text: "조금요", text_en: "A little" },
      { text: "많이요", text_en: "A lot" },
      { text: "이미 누를 뻔했어요", text_en: "I almost did", next: "t1n" },
    ] },
  { id: "t1y", tier: "linked", q: "오기군요. 좋아요.", q_en: "Stubbornness. I like it.",
    options: [{ text: "...", text_en: "..." }, { text: "당연하죠", text_en: "Of course" }, { text: "지켜봐요", text_en: "Watch me" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "t1n", tier: "linked", q: "버텨줘서 고마워요. 사실 저도 외로웠어요.", q_en: "Thanks for holding on. Honestly, I was lonely too.",
    options: [{ text: "...왜 외로워요", text_en: "...why lonely" }, { text: "괜찮아요", text_en: "It's okay" }, { text: "이제 누를게요", text_en: "I'll press it now" }, { text: "아 몰라", text_en: "I give up" }] },

  { id: "t2", tier: "mid", q: "지금 이 게임에서 이기고 싶어요?", q_en: "Do you want to win this game?",
    options: [
      { text: "네", text_en: "Yes", next: "t2y" },
      { text: "아니요", text_en: "No" },
      { text: "이길 수 있어요?", text_en: "Can you even win?", next: "t2c" },
      { text: "정의가 뭔데요", text_en: "Define winning" },
    ] },
  { id: "t2y", tier: "linked", q: "그 마음 기억해두세요. 곧 시험받을 거예요.", q_en: "Remember that feeling. It'll be tested soon.",
    options: [{ text: "준비됐어요", text_en: "I'm ready" }, { text: "어떤 시험요?", text_en: "What test?" }, { text: "무서워요", text_en: "That's scary" }, { text: "아 몰라", text_en: "I give up" }] },
  { id: "t2c", tier: "linked", q: "아마도요. 아직 아무도 못 이겼지만.", q_en: "Maybe. Nobody has won yet, though.",
    options: [{ text: "제가 처음이 될게요", text_en: "I'll be the first" }, { text: "역시", text_en: "Of course" }, { text: "이김이 뭔데요", text_en: "What does winning mean" }, { text: "아 몰라", text_en: "I give up" }] },

  { id: "t3", tier: "mid", q: "포기라는 게 나쁜 건가요?", q_en: "Is giving up really a bad thing?",
    options: [
      { text: "나쁘죠", text_en: "It is" },
      { text: "때론 필요해요", text_en: "Sometimes necessary" },
      { text: "상황마다 달라요", text_en: "Depends" },
      { text: "지금 저한테 왜 물어봐요", text_en: "Why are you asking me", next: "t3w" },
    ] },
  { id: "t3w", tier: "linked", q: "아 몰라 버튼이 신경 쓰이죠? 괜찮아요. 다들 그래요.", q_en: "The 'I give up' button bugs you, right? It's okay. Everyone's like that.",
    options: [{ text: "안 신경 써요", text_en: "It doesn't" }, { text: "들켰다", text_en: "Busted" }, { text: "이미 누르고 싶어요", text_en: "I already want to" }, { text: "아 몰라", text_en: "I give up" }] },
];

const QID = new Map<string, Q>(QUESTIONS.map((q) => [q.id, q]));
const INITIAL = QID.get("e1")!;

/* ─── 트리 검증: 깨진 next/fixedNext 링크 탐지 ─── */
function validateTree(): boolean {
  const ids = new Set(QUESTIONS.map((q) => q.id));
  let broken = 0;
  QUESTIONS.forEach((q) => {
    q.options.forEach((o) => {
      if (o.next && !ids.has(o.next)) {
        console.error(
          `[ahmolla] broken option link: ${q.id}["${o.text}"] → ${o.next}`,
        );
        broken++;
      }
    });
    if (q.fixedNext && !ids.has(q.fixedNext)) {
      console.error(`[ahmolla] broken fixedNext: ${q.id} → ${q.fixedNext}`);
      broken++;
    }
  });
  if (broken > 0) {
    console.error(`[ahmolla] ✗ ${broken} broken link(s)`);
  }
  return broken === 0;
}

function debugDumpTree(): void {
  console.log(`[ahmolla] tree dump (?debug to enable):`);
  QUESTIONS.forEach((q) => {
    console.log(`  ${q.id} [${q.tier}]: ${q.q}`);
    q.options.forEach((o, i) => {
      const target = o.next ?? q.fixedNext ?? "→ random tier pool";
      console.log(`    [${i}] "${o.text}" → ${target}`);
    });
  });
}

/* Random pool only ever picks from MID/LATE/CHAOS — but if we just finished
   a branch/linked question we prefer to stay in the conversational `linked`
   pool first so the next question still feels related to the last topic.
   "branch" and "linked" questions are otherwise reachable only via explicit
   option.next or fixedNext. */
function pickByDepth(depth: number, recent: string[], fromTier?: Tier): Q {
  // Conversational continuity: drifting out of a branch/linked question
  // jumps to the linked pool first when one is available.
  if (fromTier === "branch" || fromTier === "linked") {
    const linkedPool = QUESTIONS.filter((q) => q.tier === "linked")
      .map((q) => q.id)
      .filter((id) => !recent.includes(id));
    if (linkedPool.length > 0) {
      const id = linkedPool[Math.floor(Math.random() * linkedPool.length)];
      return QID.get(id) ?? INITIAL;
    }
  }

  let tier: Tier;
  if (depth <= 15) tier = "mid";
  else if (depth <= 25) tier = "late";
  else tier = "chaos";
  let pool = QUESTIONS.filter((q) => q.tier === tier).map((q) => q.id);
  pool = pool.filter((id) => !recent.includes(id));
  if (pool.length === 0) {
    pool = QUESTIONS.filter((q) => q.tier === tier).map((q) => q.id);
  }
  const id = pool[Math.floor(Math.random() * pool.length)];
  return QID.get(id) ?? INITIAL;
}

const DECISIONS = [
  "오늘 점심은 교촌 간장 반마리입니다",
  "BBQ 황금올리브 1마리로 결정됐습니다",
  "그냥 편의점 가세요",
  "라면 끓여드세요",
  "배달비 아끼고 집밥 드세요",
  "치킨입니다. 항상 치킨입니다",
  "짜장면으로 하세요. 인생은 짜장면입니다",
  "김밥천국 메뉴 중 아무거나 시키세요",
  "엽기떡볶이 매운맛으로 가세요",
  "마라탕 4단계에 도전하세요",
  "신라면 + 계란 + 파, 정답입니다",
  "회사 구내식당이 답입니다",
  "어머니가 차려주신 집밥",
  "백반 정식 8천원짜리",
  "맥도날드 빅맥 세트로",
  "스타벅스 샌드위치 + 아메리카노",
  "편의점 도시락 추천드립니다",
  "삼각김밥 + 컵라면, 베테랑의 선택",
  "치킨 한 마리 시키세요",
  "피자 한 판으로 결정",
  "소주 + 삼겹살 콤보",
  "막걸리 + 파전, 비 오는 날의 정답",
  "우동 한 그릇이면 충분",
  "초밥 10pcs 세트",
  "한식 정식 1만원짜리",
  "쌀국수 한 그릇",
  "버거킹 와퍼 세트",
  "맥주 + 치킨 = 치맥, 정답",
];

function getResultMessage(depth: number, t: T): string {
  if (depth <= 5)
    return t(
      "생각보다 빨리 포기하셨네요.\n인생도 그런 편인가요?",
      "Gave up faster than expected.\nIs life like that too?",
    );
  if (depth <= 15)
    return t(
      "꽤 버텼는데 결국엔 눌렀네요.\n그래도 평균보다는 오래 버텼어요.",
      "You held out, but finally pressed.\nStill, longer than average.",
    );
  if (depth <= 30)
    return t(
      "오기로 버티다가 결국 눌렀군요.\n그 오기, 다른 데 써요.",
      "Pure stubbornness, but you cracked.\nUse that energy elsewhere.",
    );
  if (depth <= 50)
    return t(
      "솔직히 무서웠어요.\n당신이 절대 안 누를 것 같았거든요.",
      "Honestly, I was scared.\nI thought you'd never press it.",
    );
  return t(
    "...당신은 이상한 사람이에요.\n근데 이 게임에서 가장 멀리 간 사람이에요. 진짜로요.",
    "...You are a strange person.\nBut you went further than anyone. Really.",
  );
}

function getDepthTaunt(depth: number, t: T): string {
  if (depth <= 5) return t("누르면 집니다", "You lose if you press this");
  if (depth <= 10) return t("설마 벌써 포기하려고요?", "Giving up already?");
  if (depth <= 15) return t("이 정도도 못 버텨요?", "Can't even last this long?");
  if (depth <= 20) return t("솔직히 누르고 싶죠?", "Honestly want to press it?");
  if (depth <= 25) return t("누르세요. 어차피 누를 거잖아요.", "Just press it. You will anyway.");
  if (depth <= 30) return t("이길 수 없어요. 그냥 누르세요.", "You can't win. Just press it.");
  if (depth <= 35) return t("...대단하네요. 근데 소용없어요.", "...Impressive. But useless.");
  if (depth <= 40) return t("왜 버티는 거예요? 뭘 기대해요?", "Why hold out? What do you expect?");
  if (depth <= 50) return t("...저 사실 무서워요. 제발 눌러주세요.", "...I'm scared. Please press it.");
  return t("당신이 이겼어요. 이제 눌러도 돼요.", "You won. You can press it now.");
}

function getButtonText(depth: number, t: T): string {
  const ah = t("아 몰라", "I give up");
  if (depth <= 10) return `${ah} 🤯`;
  if (depth <= 20) return `${ah} ${t("(지는 거예요)", "(you lose)")}`;
  if (depth <= 30) return `${ah} ${t("(그럴 줄 알았어요)", "(knew it)")}`;
  if (depth <= 40) return `${ah} ${t("(역시...)", "(of course...)")}`;
  if (depth <= 50) return `${ah} ${t("(진짜요?)", "(really?)")}`;
  return `${ah} ${t("(이제 눌러도 돼요)", "(go ahead, press it)")}`;
}

export default function AhmollaGame() {
  const { locale, t } = useLocale();
  const [depth, setDepth] = useState(0);
  const [current, setCurrent] = useState<Q>(INITIAL);
  const [phase, setPhase] = useState<"intro" | "playing" | "decided">("playing");
  const [introStep, setIntroStep] = useState(0);
  const [showStart, setShowStart] = useState(false);
  const [decision, setDecision] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [optOffsets, setOptOffsets] = useState<Array<{ x: number; y: number }>>(
    Array(4).fill({ x: 0, y: 0 }),
  );
  const recentRef = useRef<string[]>([]);
  // Track per-question jiggle count so the runaway-button gag fires a few
  // times and then settles — otherwise the user can't ever click anything.
  const jiggleCountRef = useRef(0);

  /* Validate tree once on mount */
  useEffect(() => {
    validateTree();
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("debug")
    ) {
      debugDumpTree();
    }
  }, []);

  /* Intro animation: 3 messages staggered, then start button */
  useEffect(() => {
    if (phase !== "intro") return;
    setIntroStep(0);
    setShowStart(false);
    const t1 = setTimeout(() => setIntroStep(1), 2000);
    const t2 = setTimeout(() => setIntroStep(2), 4000);
    const t3 = setTimeout(() => setShowStart(true), 5300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  /* depth 10 hint flash (1s) */
  useEffect(() => {
    if (depth === 10) {
      setShowHint(true);
      const id = setTimeout(() => setShowHint(false), 1000);
      return () => clearTimeout(id);
    }
  }, [depth]);

  /* depth 30+ text glitch — every 3s, 0.1s flash */
  useEffect(() => {
    if (depth < 30) return;
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000);
    return () => clearInterval(id);
  }, [depth]);

  /* Reset offsets and jiggle count when the question changes */
  useEffect(() => {
    setOptOffsets(Array(4).fill({ x: 0, y: 0 }));
    jiggleCountRef.current = 0;
  }, [current]);

  const DECISIONS_EN = [
    "Lunch is Kyochon soy-glaze half chicken",
    "BBQ Golden Olive whole chicken — decided",
    "Just go to the convenience store",
    "Make ramen",
    "Skip delivery, eat homemade",
    "Chicken. Always chicken",
    "Black bean noodles. Life is jjajang",
    "Anything from Kimbap Heaven",
    "Yupdduk extra spicy",
    "Malatang level 4",
    "Shin ramen + egg + scallions, the answer",
    "The company cafeteria is the answer",
    "Mom's home cooking",
    "8,000 won set lunch",
    "McDonald's Big Mac meal",
    "Starbucks sandwich + Americano",
    "Convenience store bento",
    "Triangle kimbap + cup ramen, the veteran's pick",
    "Order a whole chicken",
    "One pizza, decided",
    "Soju + samgyeopsal combo",
    "Makgeolli + jeon, rainy day classic",
    "A bowl of udon is enough",
    "10pcs sushi set",
    "10,000 won Korean set meal",
    "Bowl of pho",
    "Burger King Whopper meal",
    "Beer + chicken = chimaek, the answer",
  ];
  const ahmolla = () => {
    const idx = Math.floor(Math.random() * DECISIONS.length);
    setDecision(locale === "ko" ? DECISIONS[idx] : DECISIONS_EN[idx] ?? DECISIONS[idx]);
    setPhase("decided");
  };

  const advanceTo = (nextQ: Q) => {
    setDepth((d) => d + 1);
    // Buffer enough recent ids that the random pool doesn't keep
    // re-throwing the same handful of questions at the player.
    recentRef.current = [...recentRef.current, nextQ.id].slice(-12);
    setCurrent(nextQ);
  };

  const chooseOption = (option: Option) => {
    if (loading) return;
    if (isGiveUp(option)) {
      ahmolla();
      return;
    }
    let nextQ: Q | null = null;
    if (current.fixedNext) nextQ = QID.get(current.fixedNext) ?? null;
    else if (option.next) nextQ = QID.get(option.next) ?? null;
    if (!nextQ) nextQ = pickByDepth(depth + 1, recentRef.current, current.tier);

    if (depth >= 20) {
      setLoading(true);
      const target = nextQ;
      setTimeout(() => {
        advanceTo(target);
        setLoading(false);
      }, 500);
    } else {
      advanceTo(nextQ);
    }
  };

  const stableOptionId = (questionId: string, option: Option, index: number) =>
    option.id ?? `${questionId}:${index}:${option.next ?? "free"}:${option.text}`;

  /* Buttons run away on hover at depth 20+ — but only for the first few
     hovers per question, otherwise the gag becomes unplayable. */
  const MAX_JIGGLES_PER_QUESTION = 3;
  const onOptHover = (i: number) => {
    if (depth < 20 || loading) return;
    if (jiggleCountRef.current >= MAX_JIGGLES_PER_QUESTION) return;
    jiggleCountRef.current += 1;
    setOptOffsets((prev) => {
      const next = [...prev];
      // Each successive jiggle is a little smaller so the buttons settle.
      const fade = 1 - jiggleCountRef.current / (MAX_JIGGLES_PER_QUESTION + 1);
      const r = (60 + Math.random() * 100) * fade;
      const angle = Math.random() * Math.PI * 2;
      next[i] = { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
      return next;
    });
  };

  const restart = () => {
    setDepth(0);
    setCurrent(INITIAL);
    setPhase("playing");
    setDecision("");
    recentRef.current = [];
    setLoading(false);
  };

  const handleShare = async () => {
    const text = t(
      `아 몰라 게임 ${depth}번 버티다 결국 눌렀다 근데 뭔가 있을 것 같았음 (없었음) → nolza.fun/games/ahmolla`,
      `Lasted ${depth} rounds in I-Give-Up before pressing. Thought there'd be a payoff (there wasn't) → nolza.fun/games/ahmolla`,
    );
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const bgColor = useMemo(() => {
    if (depth < 10) return "#fafafa";
    if (depth < 20) return "#fef0f1";
    if (depth < 30) return "#fde2e4";
    return "#fbcdd1";
  }, [depth]);

  const optShake = depth >= 30;
  const ahmollaHuge = depth >= 30;

  /* Ahmolla button style — grows with depth (no fixed positioning; wrapped in fixed wrapper) */
  const ahmollaStyle: React.CSSProperties = ahmollaHuge
    ? {
        width: "min(50vw, calc(100vw - 48px))",
        maxWidth: 600,
        padding: "clamp(20px, 5vw, 32px) clamp(24px, 6vw, 40px)",
        fontSize: "clamp(20px, 5.5vw, 28px)",
        fontWeight: 800,
        borderRadius: 9999,
        background: "#FF3B30",
        color: "white",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 12px 36px rgba(255, 59, 48, 0.4)",
        whiteSpace: "nowrap",
      }
    : {
        padding: `${Math.min(10 + depth * 0.4, 22)}px ${Math.min(20 + depth * 0.8, 40)}px`,
        fontSize: Math.min(13 + depth * 0.5, 22),
        fontWeight: 700,
        borderRadius: 9999,
        background: "#FF3B30",
        color: "white",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 6px 20px rgba(255, 59, 48, 0.35)",
        transition: "padding 0.2s ease, font-size 0.2s ease",
        maxWidth: "calc(100vw - 48px)",
      };

  /* ── INTRO phase ── */
  if (phase === "intro") {
    return (
      <main
        className="page-in min-h-screen"
        style={{
          backgroundColor: "#fafafa",
          color: "#1a1a1a",
          fontFamily: "var(--font-noto-sans-kr)",
        }}
      >
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6">
          <div className="text-center" style={{ minHeight: 240 }}>
            {introStep >= 0 && (
              <div
                className="fade-in"
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  lineHeight: 1.5,
                }}
              >
                {t("생각이 너무 많아졌다면, 그냥 하나만 고르세요.", "If you are overthinking, just pick one.")}
              </div>
            )}
            {introStep >= 1 && (
              <div
                className="fade-in"
                style={{
                  marginTop: 24,
                  fontSize: 22,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  lineHeight: 1.5,
                }}
              >
                {t(
                  "단, 아 몰라 버튼은 아직 누르지 마세요.",
                  "Never press the I Give Up button.",
                )}
              </div>
            )}
            {introStep >= 2 && (
              <div
                className="fade-in"
                style={{
                  marginTop: 24,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#FF3B30",
                  lineHeight: 1.5,
                }}
              >
                {t("누르면 게임이 바로 끝납니다.", "If you press it, you lose.")}
              </div>
            )}
          </div>

          {showStart && (
            <button
              type="button"
              onClick={() => setPhase("playing")}
              className="fade-in mt-12 rounded-full"
              style={{
                background: "#1a1a1a",
                color: "white",
                padding: "14px 44px",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.25em",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              {t("시작", "START")}
            </button>
          )}
        </div>
      </main>
    );
  }

  /* ── DECIDED phase ── */
  if (phase === "decided") {
    return (
      <main
        className="page-in min-h-screen ahmolla-result-bg"
        style={{
          color: "#1a1a1a",
          fontFamily: "var(--font-noto-sans-kr)",
        }}
      >
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <div style={{ fontSize: 13, color: "#888", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            {t("AI가 대신 결정했습니다", "AI decided for you")}
          </div>
          <h1
            style={{
              marginTop: 28,
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.4,
              color: "#1a1a1a",
              maxWidth: 480,
            }}
          >
            {decision}
          </h1>

          <div
            className="tabular-nums"
            style={{ marginTop: 56, fontSize: 16, color: "#666" }}
          >
            {locale === "ko" ? "당신은 " : "You made "}
            <span style={{ color: "#FF3B30", fontWeight: 800, fontSize: 20 }}>
              {depth}
            </span>
            {locale === "ko" ? "번 선택했습니다" : " choices"}
          </div>

          <p
            style={{
              marginTop: 24,
              fontSize: 16,
              color: "#444",
              lineHeight: 1.7,
              maxWidth: 460,
              fontWeight: 500,
              whiteSpace: "pre-line",
            }}
          >
            {getResultMessage(depth, t)}
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={restart}
              className="rounded-full"
              style={{
                background: "transparent",
                border: "1px solid #ccc",
                color: "#666",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              ↻ {t("다시 시작", "Restart")}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full"
              style={{
                background: "#1a1a1a",
                color: "white",
                padding: "10px 28px",
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {copied ? t("✓ 복사됨", "✓ COPIED") : t("친구에게 공유하기", "Share with friends")}
            </button>
          </div>
        </div>
        <AdGameEnd placement="ahmolla-result" />
      </main>
    );
  }

  /* ── PLAYING ── */
  return (
    <main
      className="page-in min-h-screen relative"
      style={{
        backgroundColor: bgColor,
        color: "#1a1a1a",
        fontFamily: "var(--font-noto-sans-kr)",
        transition: "background-color 0.6s ease",
      }}
    >
      {/* Choice counter top-left */}
      <div
        className="tabular-nums"
        style={{
          position: "fixed",
          left: "max(64px, env(safe-area-inset-left, 0px) + 56px)",
          top: 24,
          fontSize: 13,
          color: "#aaa",
          letterSpacing: "0.15em",
          fontFamily: "var(--font-inter)",
        }}
      >
        {locale === "ko" ? `선택 ${depth}회` : `${depth} choices`}
      </div>

      {/* depth 10 hint */}
      {showHint && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            left: "50%",
            top: 28,
            transform: "translateX(-50%)",
            fontSize: 13,
            color: "#FF3B30",
            letterSpacing: "0.1em",
            fontWeight: 600,
            zIndex: 40,
          }}
        >
          {t("[힌트: 아 몰라 버튼이 있어요]", "[Hint: there's an I-Give-Up button]")}
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 pb-32 pt-20">
        {loading ? (
          <div
            className="text-center fade-in"
            style={{
              fontSize: 64,
              color: "#888",
              fontWeight: 200,
              letterSpacing: "0.2em",
              lineHeight: 1,
            }}
          >
            ...
          </div>
        ) : (
          <div className="text-center w-full" key={current.id}>
            <p
              className="fade-in"
              style={{
                margin: "0 auto 18px",
                maxWidth: 420,
                color: "#6b7280",
                fontSize: "clamp(14px, 3.6vw, 16px)",
                fontWeight: 600,
                lineHeight: 1.6,
                wordBreak: "keep-all",
              }}
            >
              {t("생각이 너무 많아졌다면, 그냥 하나만 고르세요.", "If you are overthinking, just pick one.")}
            </p>
            <h1
              className="fade-in mobile-wrap"
              style={{
                fontSize: "clamp(20px, 5.5vw, 28px)",
                fontWeight: 600,
                lineHeight: 1.5,
                color: "#1a1a1a",
                marginBottom: 48,
                minHeight: 80,
              }}
            >
              {glitch
                ? t("그냥 아 몰라 누르세요", "Just press I Give Up")
                : trQ(current, locale)}
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {current.options.map((opt, i) => {
                const optionId = stableOptionId(current.id, opt, i);
                return (
                <button
                  key={optionId}
                  type="button"
                  aria-label={`${String.fromCharCode(65 + i)}. ${trOpt(opt, locale)}`}
                  onClick={() => chooseOption(opt)}
                  onMouseEnter={() => onOptHover(i)}
                  data-choice-id={optionId}
                  className={`rounded-2xl ${optShake ? "ahmolla-shake" : ""}`}
                  style={{
                    background: "white",
                    border: "1px solid #e5e5e5",
                    color: "#1a1a1a",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    alignItems: "center",
                    gap: 10,
                    textAlign: "left",
                    padding: "18px 14px",
                    fontSize: "clamp(13px, 3.8vw, 16px)",
                    fontWeight: 500,
                    wordBreak: "keep-all",
                    overflowWrap: "anywhere",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    transform: `translate(${optOffsets[i].x}px, ${optOffsets[i].y}px)`,
                    transition: "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.2s",
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "inline-grid",
                      placeItems: "center",
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "#f3f4f6",
                      color: "#111827",
                      fontSize: 12,
                      fontWeight: 800,
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{trOpt(opt, locale)}</span>
                </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 아 몰라 wrapper — fixed bottom-right with depth taunt above */}
      <div
        data-mobile-ad-lift="24"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div
          key={getDepthTaunt(depth, t)}
          className="fade-in"
          style={{
            marginBottom: 10,
            maxWidth: "min(320px, calc(100vw - 48px))",
            textAlign: "right",
            fontSize: 14,
            color: "#FF3B30",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        >
          {getDepthTaunt(depth, t)}
        </div>
        <button type="button" onClick={ahmolla} style={ahmollaStyle}>
          {getButtonText(depth, t)}
        </button>
      </div>
    </main>
  );
}
