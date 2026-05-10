export type FishShape = 'porgy' | 'torpedo' | 'flatfish' | 'long' | 'squid' | 'ray' | 'shark' | 'whale' | 'sunfish' | 'marlin' | 'grouper' | 'rockfish' | 'bass' | 'jellyfish';

export interface FishDefinition {
    name: string;
    rarity: string;
    desc: string;
    iconColor: string;
    score: number;
    imageUrl: string;
    zone: number[]; // e.g. [1, 2] means can spawn in zone 1 and 2
    w: number;
    h: number;
    speedBase: number;
    noticeDist: number;
    shape: FishShape;
}

export const FISH_DATABASE: Record<string, FishDefinition> = {
    // 록피쉬 / 연안 바닥 어종 (12종)
    'rockfish': { name: '볼락', rarity: 'Common', desc: '큰 눈과 붉고 갈색인 보호색을 가진 갯바위 대표 어종.', iconColor: '#c2410c', score: 12, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Sebastes_inermis_.jpg', zone: [1], w: 30, h: 15, speedBase: 50, noticeDist: 40, shape: 'rockfish' },
    'korean_rockfish': { name: '우럭', rarity: 'Common', desc: '국민 횟감으로 불리는 쫄깃한 식감의 바닥 어종.', iconColor: '#334155', score: 15, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Sebastes_schlegelii_.jpg', zone: [1, 2], w: 35, h: 18, speedBase: 45, noticeDist: 45, shape: 'rockfish' },
    'black_porgy': { name: '감성돔', rarity: 'Rare', desc: '은비늘이 번쩍이는 바다의 왕자. 경계심이 대단히 높다.', iconColor: '#94a3b8', score: 60, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Acanthopagrus_schlegelii_1.jpg', zone: [1, 2], w: 40, h: 22, speedBase: 65, noticeDist: 70, shape: 'porgy' },
    'red_sea_bream': { name: '참돔', rarity: 'Epic', desc: '바다의 여왕이라 불리는 아름다운 붉은 빛의 돔.', iconColor: '#f43f5e', score: 120, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Red_sea_bream.jpg', zone: [2], w: 45, h: 25, speedBase: 70, noticeDist: 60, shape: 'porgy' },
    'yellowback_seabream': { name: '황돔', rarity: 'Rare', desc: '황금빛을 띠는 매력적인 돔. 수심 깊은곳을 선호한다.', iconColor: '#eab308', score: 80, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Dentex_tumifrons.jpg', zone: [2, 3], w: 42, h: 22, speedBase: 65, noticeDist: 65, shape: 'porgy' },
    'stone_porgy': { name: '돌돔', rarity: 'Epic', desc: '검은 줄무늬와 강한 턱을 지닌 갯바위의 폭군.', iconColor: '#1e293b', score: 150, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Oplegnathus_fasciatus_in_Kamo_Aquarium.jpg', zone: [1, 2], w: 45, h: 28, speedBase: 70, noticeDist: 60, shape: 'porgy' },
    'largescale_blackfish': { name: '벵에돔', rarity: 'Rare', desc: '갯바위 릴찌낚시의 최고봉. 힘이 장사다.', iconColor: '#0f172a', score: 90, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Girella_punctata.jpg', zone: [1], w: 38, h: 20, speedBase: 75, noticeDist: 60, shape: 'porgy' },
    'striped_mullet': { name: '숭어', rarity: 'Common', desc: '연안에서 흔히 볼 수 있으며 점프력이 뛰어나다.', iconColor: '#64748b', score: 20, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mugil_cephalus.jpg', zone: [1], w: 45, h: 15, speedBase: 80, noticeDist: 50, shape: 'torpedo' },
    'greenling': { name: '노래미', rarity: 'Common', desc: '해초 틈에 숨어 사는 얌전한 바닥 물고기.', iconColor: '#854d0e', score: 14, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Hexagrammos_agrammus.jpg', zone: [1, 2], w: 35, h: 12, speedBase: 45, noticeDist: 40, shape: 'rockfish' },
    'fat_greenling': { name: '쥐노래미', rarity: 'Uncommon', desc: '노래미보다 덩치가 크고 입맛도 좋은 어종.', iconColor: '#a16207', score: 25, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Hexagrammos_otakii.jpg', zone: [1, 2], w: 40, h: 14, speedBase: 50, noticeDist: 45, shape: 'rockfish' },
    'surf_perch': { name: '망상어', rarity: 'Common', desc: '새끼를 낳는 독특한 번식 방식을 가진 귀여운 물고기.', iconColor: '#cbd5e1', score: 8, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Ditrema_temminckii_temminckii.jpg', zone: [1], w: 25, h: 12, speedBase: 40, noticeDist: 40, shape: 'porgy' },
    'halfbeak': { name: '학공치', rarity: 'Uncommon', desc: '학처럼 긴 주둥이를 가진 표층어종. 튀김이 일품.', iconColor: '#e2e8f0', score: 18, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Hyporhamphus_sajori.jpg', zone: [1], w: 35, h: 6, speedBase: 55, noticeDist: 50, shape: 'long' },

    // 방파제 / 갯바위 어종 (10종)
    'mackerel': { name: '고등어', rarity: 'Common', desc: '국민 생선! 등푸른 줄무늬가 매력적인 성질 급한 녀석.', iconColor: '#0ea5e9', score: 15, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Trachurus_declivis.jpg', zone: [1], w: 38, h: 12, speedBase: 85, noticeDist: 50, shape: 'torpedo' },
    'horse_mackerel': { name: '전갱이', rarity: 'Common', desc: '고등어와 비슷하지만 꼬리의 모비늘이 특징. 루어(아징)에 인기.', iconColor: '#fbbf24', score: 15, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Trachurus_japonicus.jpg', zone: [1], w: 35, h: 11, speedBase: 80, noticeDist: 45, shape: 'torpedo' },
    'japanese_spanish_mackerel': { name: '삼치', rarity: 'Rare', desc: '수면 위를 차고 오르는 은빛 로켓. 날카로운 이빨을 주의.', iconColor: '#9ca3af', score: 50, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Scomberomorus_niphonius.jpg', zone: [1, 2], w: 50, h: 12, speedBase: 100, noticeDist: 60, shape: 'torpedo' },
    'japanese_sea_bass': { name: '농어', rarity: 'Epic', desc: '바늘을 털며 수면위로 솟구치는 손맛! 바다루어의 꽃.', iconColor: '#d1d5db', score: 110, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Lateolabrax_japonicus.jpg', zone: [1, 2], w: 60, h: 18, speedBase: 80, noticeDist: 60, shape: 'bass' },
    'flathead_grey_mullet': { name: '가숭어', rarity: 'Uncommon', desc: '겨울철 눈이 노랗게 변하는 참숭어. 회 맛이 좋다.', iconColor: '#78716c', score: 25, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Mugil_cephalus.jpg', zone: [1], w: 48, h: 16, speedBase: 78, noticeDist: 50, shape: 'torpedo' },
    'scorpionfish': { name: '쏨뱅이', rarity: 'Uncommon', desc: '독가시가 있는 암초 지대의 매복꾼.', iconColor: '#b91c1c', score: 30, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Scorpaenopsis_diabolus.jpg', zone: [1, 2], w: 30, h: 15, speedBase: 40, noticeDist: 40, shape: 'rockfish' },
    'wrasse': { name: '놀래기', rarity: 'Common', desc: '알록달록 아름다운 무늬를 자랑하는 호기심 많은 물고기.', iconColor: '#34d399', score: 12, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Halichoeres_tenuispinnis.jpg', zone: [1], w: 25, h: 10, speedBase: 50, noticeDist: 35, shape: 'porgy' },
    'eelpout': { name: '베도라치', rarity: 'Common', desc: '미꾸라지처럼 길쭉하고 미끌미끌한 방파제 터줏대감.', iconColor: '#84cc16', score: 10, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Pholis_nebulosa.jpg', zone: [1], w: 28, h: 6, speedBase: 30, noticeDist: 30, shape: 'long' },
    'flathead': { name: '양태', rarity: 'Rare', desc: '납작한 머리를 모래에 박고 사는 바닥 포식자.', iconColor: '#713f12', score: 45, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Platycephalus_indicus.jpg', zone: [1, 2], w: 50, h: 10, speedBase: 50, noticeDist: 45, shape: 'flatfish' },
    'giant_korean_rockfish': { name: '조피볼락(대형)', rarity: 'Rare', desc: '기본 우럭보다 훨씬 크게 자란 대물 개체. 끌어내는 맛이 좋다.', iconColor: '#1e293b', score: 70, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Sebastes_schlegelii_.jpg', zone: [2], w: 55, h: 25, speedBase: 55, noticeDist: 50, shape: 'rockfish' },

    // 선상낚시 / 원투낚시 어종 (12종)
    'skipjack_tuna': { name: '가다랑어', rarity: 'Epic', desc: '참치 통조림의 재료! 뜨거운 피를 가진 바다의 마라토너.', iconColor: '#1d4ed8', score: 120, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Katsuwonus_pelamis.jpg', zone: [2, 3], w: 55, h: 20, speedBase: 110, noticeDist: 70, shape: 'torpedo' },
    'yellowfin_tuna': { name: '황다랑어', rarity: 'Legendary', desc: '노란 지느러미가 매력적인 날쌘 참치. 거대한 체구의 대물.', iconColor: '#facc15', score: 350, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Thunnus_albacares.jpg', zone: [3], w: 80, h: 30, speedBase: 120, noticeDist: 80, shape: 'torpedo' },
    'yellowtail_amberjack': { name: '부시리', rarity: 'Epic', desc: '방어와 닮았지만 힘은 두 배! 여름철 지깅의 메인 타겟.', iconColor: '#f87171', score: 140, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Seriola_lalandi.jpg', zone: [2, 3], w: 70, h: 22, speedBase: 115, noticeDist: 65, shape: 'torpedo' },
    'japanese_amberjack': { name: '방어', rarity: 'Epic', desc: '겨울철 기름기가 차오르는 대형 회유어. 엄청난 저항을 보여준다.', iconColor: '#93c5fd', score: 130, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Seriola_quinqueradiata.jpg', zone: [2, 3], w: 75, h: 25, speedBase: 110, noticeDist: 65, shape: 'torpedo' },
    'greater_amberjack': { name: '참방어', rarity: 'Legendary', desc: '방어류 중 가장 거대하게 자라는 엄청난 폭군.', iconColor: '#dc2626', score: 300, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Seriola_dumerili.jpg', zone: [3], w: 90, h: 32, speedBase: 115, noticeDist: 75, shape: 'torpedo' },
    'pacific_cod': { name: '대구', rarity: 'Epic', desc: '깊은 바다에 사는 커다란 입의 소유자. 겨울바다의 보물.', iconColor: '#a8a29e', score: 100, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Atlantic_cod.jpg', zone: [3], w: 80, h: 25, speedBase: 60, noticeDist: 60, shape: 'bass' },
    'flounder': { name: '가자미', rarity: 'Common', desc: '바닥에 바짝 엎드린 납작한 녀석. 두 눈이 오른쪽에 모였다.', iconColor: '#d6d3d1', score: 20, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Pleuronectes_platessa.jpg', zone: [1, 2], w: 35, h: 20, speedBase: 40, noticeDist: 40, shape: 'flatfish' },
    'olive_flounder': { name: '광어', rarity: 'Rare', desc: '좌광우도! 왼쪽으로 쏠린 눈과 쩍 벌어지는 턱을 지닌 포식자.', iconColor: '#a1a1aa', score: 70, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Paralichthys_olivaceus.jpg', zone: [1, 2], w: 50, h: 25, speedBase: 50, noticeDist: 50, shape: 'flatfish' },
    'red_catfish': { name: '붉은메기', rarity: 'Rare', desc: '길쭉하고 붉은 체색. 심해에서 끌어올리는 특이한 녀석.', iconColor: '#f87171', score: 60, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Argyrosomus_japonicus.jpg', zone: [3], w: 55, h: 10, speedBase: 45, noticeDist: 50, shape: 'long' },
    'john_dory': { name: '달고기', rarity: 'Rare', desc: '몸통 중앙에 뚜렷한 검은 달 모양 반점이 있는 특이한 물고기.', iconColor: '#52525b', score: 85, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Zeus_faber_Aquarium_Finisterrae.jpg', zone: [2, 3], w: 45, h: 40, speedBase: 40, noticeDist: 45, shape: 'sunfish' },
    'tilefish': { name: '옥돔', rarity: 'Epic', desc: '머리가 툭 튀어나오고 붉은 빛을 띤 심해의 최고급 어종.', iconColor: '#fca5a5', score: 130, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Branchiostegus_japonicus_%28Tilefish%29.jpg', zone: [3], w: 45, h: 18, speedBase: 55, noticeDist: 60, shape: 'bass' },
    'skate_ray': { name: '홍어', rarity: 'Epic', desc: '거대한 날개를 펼치듯 유영한다. 꼬리의 독침을 조심하라!', iconColor: '#a3a3a3', score: 180, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Raja_clavata.jpg', zone: [2, 3], w: 70, h: 30, speedBase: 50, noticeDist: 70, shape: 'ray' },

    // 루어낚시 인기 어종 (8종)
    'sea_bass_lure': { name: '농어(루어)', rarity: 'Epic', desc: '날렵한 은빛 자태. 루어를 물고 수면을 차고 오르는 바늘털이 명수.', iconColor: '#e5e7eb', score: 110, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Lateolabrax_japonicus.jpg', zone: [1, 2], w: 60, h: 18, speedBase: 85, noticeDist: 65, shape: 'bass' },
    'olive_flounder_jigging': { name: '대광어', rarity: 'Epic', desc: '지깅으로 올리는 방석만한 거대한 광어.', iconColor: '#71717a', score: 140, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Paralichthys_olivaceus.jpg', zone: [2, 3], w: 80, h: 40, speedBase: 45, noticeDist: 55, shape: 'flatfish' },
    'bigfin_reef_squid': { name: '무늬오징어', rarity: 'Epic', desc: '투명하고 화려한 무늬. 에깅 낚시의 절대적인 인기를 자랑한다.', iconColor: '#2dd4bf', score: 160, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Sepioteuthis_sepioidea_%28Caribbean_Reef_Squid%29.jpg', zone: [1, 2], w: 50, h: 25, speedBase: 70, noticeDist: 65, shape: 'squid' },
    'hairtail': { name: '갈치', rarity: 'Epic', desc: '은빛 검처럼 길고 뾰족한 야행성 포식자. 수직으로 서서 헤엄친다.', iconColor: '#f1f5f9', score: 150, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Trichiurus_lepturus.jpg', zone: [2, 3], w: 90, h: 8, speedBase: 65, noticeDist: 60, shape: 'long' },
    'tuna_jigging': { name: '참치(지깅)', rarity: 'Legendary', desc: '메탈 지그를 물고 깊은 곳으로 내리꽂는 원양의 미사일.', iconColor: '#2563eb', score: 400, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Thunnus_albacares.jpg', zone: [3], w: 85, h: 32, speedBase: 130, noticeDist: 85, shape: 'torpedo' },
    'amberjack_jigging': { name: '부시리(지깅)', rarity: 'Legendary', desc: '거의 상어와 맞먹는 괴력. 대물 지깅의 최종 시험무대.', iconColor: '#fca5a5', score: 350, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Seriola_lalandi.jpg', zone: [3], w: 85, h: 28, speedBase: 125, noticeDist: 75, shape: 'torpedo' },
    'spotted_sea_bass': { name: '점농어', rarity: 'Rare', desc: '몸에 검은 점이 흩뿌려진 서해안의 대표 루어 타겟.', iconColor: '#94a3b8', score: 90, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Lateolabrax_japonicus.jpg', zone: [1, 2], w: 55, h: 17, speedBase: 75, noticeDist: 60, shape: 'bass' },
    'mandarin_fish': { name: '쏘가리', rarity: 'Epic', desc: '민물과 기수역을 오가는 표범 무늬 귀공자.', iconColor: '#ca8a04', score: 180, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Siniperca_scherzeri.jpg', zone: [1], w: 45, h: 20, speedBase: 70, noticeDist: 65, shape: 'bass' },

    // 희귀 / 대물 트로피 어종 (8종)
    'giant_grouper': { name: '돗돔', rarity: 'Mythic', desc: '전설의 심해어. 사람 체구만 한 압도적인 크기의 괴물.', iconColor: '#475569', score: 1500, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Epinephelus_lanceolatus.jpg', zone: [3], w: 120, h: 60, speedBase: 50, noticeDist: 90, shape: 'grouper' },
    'longtooth_grouper': { name: '자바리(다금바리)', rarity: 'Mythic', desc: '제주도의 황제. 바위틈에 숨어 엄청난 흡입력으로 먹이를 삼킨다.', iconColor: '#b45309', score: 1200, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Epinephelus_bruneus.jpg', zone: [2, 3], w: 90, h: 35, speedBase: 65, noticeDist: 85, shape: 'grouper' },
    'croaker': { name: '민어', rarity: 'Legendary', desc: '여름 보양식의 제왕. 울음보를 굴려 부욱 부욱 소리를 낸다.', iconColor: '#e7e5e4', score: 500, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Miichthys_miiuy.jpg', zone: [2], w: 75, h: 25, speedBase: 70, noticeDist: 65, shape: 'bass' },
    'trophy_sea_bass': { name: '따비(대물농어)', rarity: 'Legendary', desc: '미터급을 오버하는 어마어마한 몬스터 농어. 미터오버!', iconColor: '#cbd5e1', score: 600, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Lateolabrax_japonicus.jpg', zone: [1, 2], w: 100, h: 30, speedBase: 90, noticeDist: 75, shape: 'bass' },
    'bluefin_tuna': { name: '참다랑어', rarity: 'Mythic', desc: '바다의 검은 다이아몬드. 수억 원을 호가하는 참치의 왕.', iconColor: '#1e3a8a', score: 2000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Atlantic_bluefin_tuna.jpg', zone: [3], w: 110, h: 45, speedBase: 140, noticeDist: 100, shape: 'torpedo' },
    'blue_marlin': { name: '청새치', rarity: 'Mythic', desc: '거대한 뿔로 해수면을 가르는 궁극의 블루워터 트로피.', iconColor: '#3b82f6', score: 2500, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Makaira_nigricans.jpg', zone: [3], w: 140, h: 40, speedBase: 150, noticeDist: 110, shape: 'marlin' },
    'great_white_shark': { name: '백상아리', rarity: 'Mythic', desc: '바다 생태계의 정점. 당신이 낚는 것이 아니라 낚이는 것일수도...', iconColor: '#64748b', score: 3000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg', zone: [3], w: 150, h: 45, speedBase: 100, noticeDist: 120, shape: 'shark' },
    'ocean_sunfish': { name: '개복치', rarity: 'Mythic', desc: '너무나도 거대하고 납작한 햇살을 사랑하는 초특급 희귀 몬스터.', iconColor: '#cbd5e1', score: 1800, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Mola_mola.jpg', zone: [1, 2, 3], w: 100, h: 140, speedBase: 30, noticeDist: 80, shape: 'sunfish' },
    
    // 고래 / 상어 전설급
    'killer_whale': { name: '범고래', rarity: 'Legendary', desc: '바다의 최상위 포식자. 지능이 높고 카리스마 넘치는 바다의 깡패.', iconColor: '#000000', score: 4000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Killerwhales_jumping.jpg', zone: [3], w: 180, h: 60, speedBase: 130, noticeDist: 150, shape: 'whale' },
    'sperm_whale': { name: '향유고래', rarity: 'Mythic', desc: '거대한 머리와 심해를 오가는 엄청난 잠수력을 지닌 고래.', iconColor: '#334155', score: 5000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Sperm_whale_pod.jpg', zone: [3], w: 220, h: 70, speedBase: 80, noticeDist: 200, shape: 'whale' },
    'blue_whale': { name: '흰긴수염고래', rarity: 'Mythic', desc: '지구상에 존재하는 가장 거대한 생명체. 경이로움 그 자체.', iconColor: '#60a5fa', score: 10000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Blue_Whale_001_body_bw.jpg', zone: [3], w: 300, h: 80, speedBase: 70, noticeDist: 300, shape: 'whale' },
    'hammerhead_shark': { name: '귀상어', rarity: 'Legendary', desc: '망치 모양의 머리가 특징인 기묘하고 위험한 상어.', iconColor: '#64748b', score: 2500, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Hammerhead_shark_in_the_Galapagos.jpg', zone: [3], w: 140, h: 40, speedBase: 110, noticeDist: 130, shape: 'shark' },
    'whale_shark': { name: '고래상어', rarity: 'Mythic', desc: '상어지만 플랑크톤을 먹는 온순하고 거대한 바다의 별빛.', iconColor: '#1e3a8a', score: 3500, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Whale_shark_Georgia_aquarium.jpg', zone: [3], w: 250, h: 70, speedBase: 50, noticeDist: 180, shape: 'shark' },
};
