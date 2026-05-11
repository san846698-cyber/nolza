export type FishShape = 'porgy' | 'torpedo' | 'flatfish' | 'long' | 'squid' | 'ray' | 'shark' | 'whale' | 'sunfish' | 'marlin' | 'grouper' | 'rockfish' | 'bass' | 'jellyfish';

export interface FishDefinition {
    name: string;
    nameEn: string;
    rarity: string;
    desc: string;
    descEn: string;
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
    // 연안 / 표층 어종
    'mackerel': { name: '고등어', nameEn: 'Mackerel', rarity: 'Common', desc: '국민 생선! 등푸른 줄무늬가 매력적인 성질 급한 녀석.', descEn: 'A beloved everyday fish with charming blue stripes and a restless temper.', iconColor: '#0ea5e9', score: 6, imageUrl: '/fish/mackerel.jpg', zone: [1], w: 38, h: 12, speedBase: 85, noticeDist: 50, shape: 'torpedo' },
    'japanese_sea_bass': { name: '농어', nameEn: 'Japanese Sea Bass', rarity: 'Epic', desc: '바늘을 털며 수면위로 솟구치는 손맛! 바다루어의 꽃.', descEn: 'A sea-lure favorite that leaps above the surface while shaking the hook.', iconColor: '#d1d5db', score: 35, imageUrl: '/fish/japanese_sea_bass.jpg', zone: [1, 2], w: 60, h: 18, speedBase: 80, noticeDist: 60, shape: 'bass' },
    'red_sea_bream': { name: '참돔', nameEn: 'Red Sea Bream', rarity: 'Epic', desc: '바다의 여왕이라 불리는 아름다운 붉은 빛의 돔.', descEn: 'The queen of the sea, admired for its beautiful crimson shine.', iconColor: '#f43f5e', score: 40, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Red_sea_bream.jpg', zone: [2], w: 45, h: 25, speedBase: 70, noticeDist: 60, shape: 'porgy' },
    'flounder': { name: '가자미', nameEn: 'Flounder', rarity: 'Common', desc: '바닥에 바짝 엎드린 납작한 녀석. 두 눈이 오른쪽에 모였다.', descEn: 'A flat bottom-dweller with both eyes gathered on one side.', iconColor: '#d6d3d1', score: 10, imageUrl: '/fish/flounder.jpg', zone: [1, 2], w: 35, h: 20, speedBase: 40, noticeDist: 40, shape: 'flatfish' },
    'olive_flounder': { name: '광어', nameEn: 'Olive Flounder', rarity: 'Rare', desc: '좌광우도! 왼쪽으로 쏠린 눈과 쩍 벌어지는 턱을 지닌 포식자.', descEn: 'Left-eyed predator with a wide jaw and excellent camouflage.', iconColor: '#a1a1aa', score: 22, imageUrl: '/fish/olive_flounder.jpg', zone: [1, 2], w: 50, h: 25, speedBase: 50, noticeDist: 50, shape: 'flatfish' },

    // 회유 / 원양 어종
    'skipjack_tuna': { name: '가다랑어', nameEn: 'Skipjack Tuna', rarity: 'Epic', desc: '참치 통조림의 재료! 뜨거운 피를 가진 바다의 마라토너.', descEn: 'The tuna-can classic: a warm-blooded marathoner of the sea.', iconColor: '#1d4ed8', score: 40, imageUrl: '/fish/skipjack_tuna.jpg', zone: [2, 3], w: 55, h: 20, speedBase: 110, noticeDist: 70, shape: 'torpedo' },
    'yellowfin_tuna': { name: '황다랑어', nameEn: 'Yellowfin Tuna', rarity: 'Legendary', desc: '노란 지느러미가 매력적인 날쌘 참치. 거대한 체구의 대물.', descEn: 'A swift tuna with striking yellow fins and a powerful body.', iconColor: '#facc15', score: 80, imageUrl: '/fish/yellowfin_tuna.jpg', zone: [3], w: 80, h: 30, speedBase: 120, noticeDist: 80, shape: 'torpedo' },
    'bluefin_tuna': { name: '참다랑어', nameEn: 'Bluefin Tuna', rarity: 'Mythic', desc: '바다의 검은 다이아몬드. 수억 원을 호가하는 참치의 왕.', descEn: 'The black diamond of the sea, the king of prized tuna.', iconColor: '#1e3a8a', score: 150, imageUrl: '/fish/bluefin_tuna.jpg', zone: [3], w: 110, h: 45, speedBase: 140, noticeDist: 100, shape: 'torpedo' },
    'japanese_amberjack': { name: '방어', nameEn: 'Japanese Amberjack', rarity: 'Epic', desc: '겨울철 기름기가 차오르는 대형 회유어. 엄청난 저항을 보여준다.', descEn: 'A large migratory fish that grows rich in winter and fights hard.', iconColor: '#93c5fd', score: 42, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Seriola_quinqueradiata.jpg', zone: [2, 3], w: 75, h: 25, speedBase: 110, noticeDist: 65, shape: 'torpedo' },
    'yellowtail_amberjack': { name: '부시리', nameEn: 'Yellowtail Amberjack', rarity: 'Epic', desc: '방어와 닮았지만 힘은 두 배! 여름철 지깅의 메인 타겟.', descEn: 'Looks like amberjack, but hits twice as hard: a summer jigging star.', iconColor: '#f87171', score: 45, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Seriola_lalandi.jpg', zone: [2, 3], w: 70, h: 22, speedBase: 115, noticeDist: 65, shape: 'torpedo' },
    'greater_amberjack': { name: '참방어', nameEn: 'Greater Amberjack', rarity: 'Legendary', desc: '방어류 중 가장 거대하게 자라는 엄청난 폭군.', descEn: 'The largest brute among amberjacks, a true ocean tyrant.', iconColor: '#dc2626', score: 70, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Seriola_dumerili.jpg', zone: [3], w: 90, h: 32, speedBase: 115, noticeDist: 75, shape: 'torpedo' },
    'pacific_cod': { name: '대구', nameEn: 'Pacific Cod', rarity: 'Epic', desc: '깊은 바다에 사는 커다란 입의 소유자. 겨울바다의 보물.', descEn: 'A big-mouthed deep-sea resident and winter-sea treasure.', iconColor: '#a8a29e', score: 32, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Atlantic_cod.jpg', zone: [3], w: 80, h: 25, speedBase: 60, noticeDist: 60, shape: 'bass' },
    'hairtail': { name: '갈치', nameEn: 'Hairtail', rarity: 'Epic', desc: '은빛 검처럼 길고 뾰족한 야행성 포식자. 수직으로 서서 헤엄친다.', descEn: 'A long silver predator like a blade, swimming upright in the dark.', iconColor: '#f1f5f9', score: 50, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Trichiurus_lepturus.jpg', zone: [2, 3], w: 90, h: 8, speedBase: 65, noticeDist: 60, shape: 'long' },

    // 심해 / 특이 어종
    'bigfin_reef_squid': { name: '무늬오징어', nameEn: 'Bigfin Reef Squid', rarity: 'Epic', desc: '투명하고 화려한 무늬. 에깅 낚시의 절대적인 인기를 자랑한다.', descEn: 'Transparent, patterned, and beloved by eging anglers.', iconColor: '#2dd4bf', score: 52, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Sepioteuthis_sepioidea_%28Caribbean_Reef_Squid%29.jpg', zone: [1, 2], w: 50, h: 25, speedBase: 70, noticeDist: 65, shape: 'squid' },
    'skate_ray': { name: '홍어', nameEn: 'Skate Ray', rarity: 'Epic', desc: '거대한 날개를 펼치듯 유영한다. 꼬리의 독침을 조심하라!', descEn: 'Gliding like giant wings unfurled. Mind the sting in its tail!', iconColor: '#a3a3a3', score: 58, imageUrl: '/fish/skate_ray.jpg', zone: [2, 3], w: 70, h: 30, speedBase: 50, noticeDist: 70, shape: 'ray' },
    'john_dory': { name: '달고기', nameEn: 'John Dory', rarity: 'Rare', desc: '몸통 중앙에 뚜렷한 검은 달 모양 반점이 있는 특이한 물고기.', descEn: 'An unusual fish marked by a bold dark spot at the center of its body.', iconColor: '#52525b', score: 27, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Zeus_faber_Aquarium_Finisterrae.jpg', zone: [2, 3], w: 45, h: 40, speedBase: 40, noticeDist: 45, shape: 'sunfish' },

    // 트로피급 대물
    'giant_grouper': { name: '돗돔', nameEn: 'Giant Grouper', rarity: 'Mythic', desc: '전설의 심해어. 사람 체구만 한 압도적인 크기의 괴물.', descEn: 'A legendary deep-sea beast with a body as imposing as a person.', iconColor: '#475569', score: 130, imageUrl: '/fish/giant_grouper.jpg', zone: [3], w: 120, h: 60, speedBase: 50, noticeDist: 90, shape: 'grouper' },
    'ocean_sunfish': { name: '개복치', nameEn: 'Ocean Sunfish', rarity: 'Mythic', desc: '너무나도 거대하고 납작한 햇살을 사랑하는 초특급 희귀 몬스터.', descEn: 'A huge flat sun-lover: an ultra-rare gentle monster.', iconColor: '#cbd5e1', score: 140, imageUrl: '/fish/ocean_sunfish.jpg', zone: [1, 2, 3], w: 100, h: 140, speedBase: 30, noticeDist: 80, shape: 'sunfish' },
    'blue_marlin': { name: '청새치', nameEn: 'Blue Marlin', rarity: 'Mythic', desc: '거대한 뿔로 해수면을 가르는 궁극의 블루워터 트로피.', descEn: 'The ultimate blue-water trophy, slicing the surface with its bill.', iconColor: '#3b82f6', score: 160, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Makaira_nigricans.jpg', zone: [3], w: 140, h: 40, speedBase: 150, noticeDist: 110, shape: 'marlin' },

    // 상어 / 고래 전설급
    'great_white_shark': { name: '백상아리', nameEn: 'Great White Shark', rarity: 'Mythic', desc: '바다 생태계의 정점. 당신이 낚는 것이 아니라 낚이는 것일수도...', descEn: 'The apex predator of the sea. Maybe you are the one being caught...', iconColor: '#64748b', score: 170, imageUrl: '/fish/great_white_shark.jpg', zone: [3], w: 150, h: 45, speedBase: 100, noticeDist: 120, shape: 'shark' },
    'hammerhead_shark': { name: '귀상어', nameEn: 'Hammerhead Shark', rarity: 'Legendary', desc: '망치 모양의 머리가 특징인 기묘하고 위험한 상어.', descEn: 'A strange and dangerous shark with its unmistakable hammer-shaped head.', iconColor: '#64748b', score: 115, imageUrl: '/fish/hammerhead_shark.jpg', zone: [3], w: 140, h: 40, speedBase: 110, noticeDist: 130, shape: 'shark' },
    'whale_shark': { name: '고래상어', nameEn: 'Whale Shark', rarity: 'Mythic', desc: '상어지만 플랑크톤을 먹는 온순하고 거대한 바다의 별빛.', descEn: 'A shark, yet gentle and vast, feeding on plankton like starlight.', iconColor: '#1e3a8a', score: 180, imageUrl: '/fish/whale_shark.jpg', zone: [3], w: 250, h: 70, speedBase: 50, noticeDist: 180, shape: 'shark' },
    'killer_whale': { name: '범고래', nameEn: 'Killer Whale', rarity: 'Legendary', desc: '바다의 최상위 포식자. 지능이 높고 카리스마 넘치는 바다의 깡패.', descEn: 'A charismatic, intelligent apex predator ruling the ocean.', iconColor: '#000000', score: 120, imageUrl: '/fish/killer_whale.jpg', zone: [3], w: 180, h: 60, speedBase: 130, noticeDist: 150, shape: 'whale' },
    'sperm_whale': { name: '향유고래', nameEn: 'Sperm Whale', rarity: 'Mythic', desc: '거대한 머리와 심해를 오가는 엄청난 잠수력을 지닌 고래.', descEn: 'A giant-headed whale with astonishing deep-diving power.', iconColor: '#334155', score: 190, imageUrl: '/fish/sperm_whale.jpg', zone: [3], w: 220, h: 70, speedBase: 80, noticeDist: 200, shape: 'whale' },
    'blue_whale': { name: '흰긴수염고래', nameEn: 'Blue Whale', rarity: 'Mythic', desc: '지구상에 존재하는 가장 거대한 생명체. 경이로움 그 자체.', descEn: 'The largest creature on Earth. Awe, made alive.', iconColor: '#60a5fa', score: 200, imageUrl: '/fish/blue_whale.jpg', zone: [3], w: 300, h: 80, speedBase: 70, noticeDist: 300, shape: 'whale' },
};
