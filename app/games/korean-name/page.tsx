"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { AdMobileSticky } from "../../components/Ads";
import { useLocale } from "@/hooks/useLocale";

/* ============================================================================
   Theme
   ============================================================================ */

const ACCENT = "#FF3B30";
const BG = "#faf8f3";
const INK = "#1f1b16";
const RULE = "rgba(31,27,22,0.12)";

/* ============================================================================
   Types
   ============================================================================ */

type CountryCode = "kr" | "jp" | "cn" | "us" | "es" | "br";
type Gender = "male" | "female";

type GeneratedName = {
  display: string;
  displayEn?: string;
  pronunciation: string;
  vibeKo?: string;
  vibeEn?: string;
  impressionKo?: string;
  impressionEn?: string;
  placeKo?: string;
  placeEn?: string;
  profileKo?: string;
  profileEn?: string;
};

type Celebrity = {
  name: string;
  role: string;
};

type Country = {
  code: CountryCode;
  flag: string;
  enName: string;
  koName: string;
  bg: string;
  ttsLang: string;
  malePool: GeneratedName[];
  femalePool: GeneratedName[];
  familyPool?: NamePart[];
  celebrities: Celebrity[];
  personalities: string[];
};

type NamePart = {
  display: string;
  pronunciation: string;
  displayEn?: string;
};

/* ============================================================================
   Seed-based deterministic picker
   ============================================================================ */

function seededIndex(input: string, salt: string, poolSize: number): number {
  if (poolSize <= 0) return 0;
  let seed = 0;
  const s = input.trim() + ":" + salt;
  for (let i = 0; i < s.length; i++) seed = (seed + s.charCodeAt(i)) | 0;
  return Math.abs(seed) % poolSize;
}

function pickSeeded<T>(items: T[], input: string, salt: string): T {
  return items[seededIndex(input, salt, items.length)];
}

const KO_FAMILY: NamePart[] = [
  { display: "김", pronunciation: "Kim" },
  { display: "이", pronunciation: "Lee" },
  { display: "박", pronunciation: "Park" },
  { display: "최", pronunciation: "Choi" },
  { display: "정", pronunciation: "Jung" },
  { display: "강", pronunciation: "Kang" },
  { display: "조", pronunciation: "Cho" },
  { display: "윤", pronunciation: "Yoon" },
  { display: "장", pronunciation: "Jang" },
  { display: "임", pronunciation: "Lim" },
  { display: "한", pronunciation: "Han" },
  { display: "오", pronunciation: "Oh" },
  { display: "서", pronunciation: "Seo" },
  { display: "신", pronunciation: "Shin" },
  { display: "권", pronunciation: "Kwon" },
  { display: "황", pronunciation: "Hwang" },
  { display: "안", pronunciation: "Ahn" },
  { display: "송", pronunciation: "Song" },
  { display: "류", pronunciation: "Ryu" },
  { display: "홍", pronunciation: "Hong" },
];

const JP_SURNAMES: NamePart[] = [
  { display: "佐藤", pronunciation: "Sato" },
  { display: "鈴木", pronunciation: "Suzuki" },
  { display: "高橋", pronunciation: "Takahashi" },
  { display: "田中", pronunciation: "Tanaka" },
  { display: "伊藤", pronunciation: "Ito" },
  { display: "渡辺", pronunciation: "Watanabe" },
  { display: "山本", pronunciation: "Yamamoto" },
  { display: "中村", pronunciation: "Nakamura" },
  { display: "小林", pronunciation: "Kobayashi" },
  { display: "加藤", pronunciation: "Kato" },
  { display: "吉田", pronunciation: "Yoshida" },
  { display: "山田", pronunciation: "Yamada" },
  { display: "佐々木", pronunciation: "Sasaki" },
  { display: "山口", pronunciation: "Yamaguchi" },
  { display: "松本", pronunciation: "Matsumoto" },
];

const JP_MALE_NATIVE: NamePart[] = [
  { display: "陽翔", pronunciation: "Haruto" },
  { display: "悠斗", pronunciation: "Yuto" },
  { display: "颯太", pronunciation: "Sota" },
  { display: "蓮", pronunciation: "Ren" },
  { display: "湊", pronunciation: "Minato" },
  { display: "陸", pronunciation: "Riku" },
  { display: "晴希", pronunciation: "Haruki" },
  { display: "悠真", pronunciation: "Yuma" },
  { display: "海斗", pronunciation: "Kaito" },
  { display: "蒼太", pronunciation: "Souta" },
];

const JP_FEMALE_NATIVE: NamePart[] = [
  { display: "結衣", pronunciation: "Yui" },
  { display: "葵", pronunciation: "Aoi" },
  { display: "陽菜", pronunciation: "Hina" },
  { display: "桜", pronunciation: "Sakura" },
  { display: "芽衣", pronunciation: "Mei" },
  { display: "凛", pronunciation: "Rin" },
  { display: "心春", pronunciation: "Koharu" },
  { display: "美緒", pronunciation: "Mio" },
  { display: "花", pronunciation: "Hana" },
  { display: "朱莉", pronunciation: "Akari" },
];

const CN_SURNAMES: NamePart[] = [
  { display: "王", pronunciation: "Wang" },
  { display: "李", pronunciation: "Li" },
  { display: "张", pronunciation: "Zhang" },
  { display: "刘", pronunciation: "Liu" },
  { display: "陈", pronunciation: "Chen" },
  { display: "杨", pronunciation: "Yang" },
  { display: "赵", pronunciation: "Zhao" },
  { display: "黄", pronunciation: "Huang" },
  { display: "周", pronunciation: "Zhou" },
  { display: "吴", pronunciation: "Wu" },
  { display: "徐", pronunciation: "Xu" },
  { display: "孙", pronunciation: "Sun" },
  { display: "胡", pronunciation: "Hu" },
  { display: "朱", pronunciation: "Zhu" },
  { display: "林", pronunciation: "Lin" },
];

const US_LAST_NAMES: NamePart[] = [
  { display: "Smith", pronunciation: "Smith" },
  { display: "Johnson", pronunciation: "Johnson" },
  { display: "Williams", pronunciation: "Williams" },
  { display: "Brown", pronunciation: "Brown" },
  { display: "Jones", pronunciation: "Jones" },
  { display: "Miller", pronunciation: "Miller" },
  { display: "Davis", pronunciation: "Davis" },
  { display: "Garcia", pronunciation: "Garcia" },
  { display: "Rodriguez", pronunciation: "Rodriguez" },
  { display: "Wilson", pronunciation: "Wilson" },
  { display: "Anderson", pronunciation: "Anderson" },
  { display: "Taylor", pronunciation: "Taylor" },
  { display: "Thomas", pronunciation: "Thomas" },
  { display: "Moore", pronunciation: "Moore" },
  { display: "Martin", pronunciation: "Martin" },
];

const ES_LAST_NAMES: NamePart[] = [
  { display: "García", pronunciation: "Garcia" },
  { display: "Rodríguez", pronunciation: "Rodriguez" },
  { display: "González", pronunciation: "Gonzalez" },
  { display: "Fernández", pronunciation: "Fernandez" },
  { display: "López", pronunciation: "Lopez" },
  { display: "Martínez", pronunciation: "Martinez" },
  { display: "Sánchez", pronunciation: "Sanchez" },
  { display: "Pérez", pronunciation: "Perez" },
  { display: "Gómez", pronunciation: "Gomez" },
  { display: "Martín", pronunciation: "Martin" },
  { display: "Jiménez", pronunciation: "Jimenez" },
  { display: "Ruiz", pronunciation: "Ruiz" },
];

const BR_LAST_NAMES: NamePart[] = [
  { display: "Silva", pronunciation: "Silva" },
  { display: "Santos", pronunciation: "Santos" },
  { display: "Oliveira", pronunciation: "Oliveira" },
  { display: "Souza", pronunciation: "Souza" },
  { display: "Pereira", pronunciation: "Pereira" },
  { display: "Costa", pronunciation: "Costa" },
  { display: "Rodrigues", pronunciation: "Rodrigues" },
  { display: "Almeida", pronunciation: "Almeida" },
  { display: "Lima", pronunciation: "Lima" },
  { display: "Gomes", pronunciation: "Gomes" },
  { display: "Ribeiro", pronunciation: "Ribeiro" },
  { display: "Carvalho", pronunciation: "Carvalho" },
  { display: "Fernandes", pronunciation: "Fernandes" },
];

const BR_MALE_COMPOUND: NamePart[] = [
  { display: "João Pedro", pronunciation: "João Pedro" },
  { display: "Pedro Henrique", pronunciation: "Pedro Henrique" },
  { display: "João Miguel", pronunciation: "João Miguel" },
  { display: "Luiz Felipe", pronunciation: "Luiz Felipe" },
  { display: "Lucas Gabriel", pronunciation: "Lucas Gabriel" },
];

const BR_FEMALE_COMPOUND: NamePart[] = [
  { display: "Maria Clara", pronunciation: "Maria Clara" },
  { display: "Ana Luiza", pronunciation: "Ana Luiza" },
  { display: "Maria Eduarda", pronunciation: "Maria Eduarda" },
  { display: "Ana Beatriz", pronunciation: "Ana Beatriz" },
  { display: "Maria Julia", pronunciation: "Maria Julia" },
];

/* ============================================================================
   🇰🇷 Korea
   ============================================================================ */

const KO_MALE: GeneratedName[] = [
  { display: "준서", pronunciation: "Jun-seo" },
  { display: "민준", pronunciation: "Min-jun" },
  { display: "서준", pronunciation: "Seo-jun" },
  { display: "도윤", pronunciation: "Do-yun" },
  { display: "시우", pronunciation: "Si-u" },
  { display: "주원", pronunciation: "Ju-won" },
  { display: "하준", pronunciation: "Ha-jun" },
  { display: "지호", pronunciation: "Ji-ho" },
  { display: "지후", pronunciation: "Ji-hu" },
  { display: "준우", pronunciation: "Jun-u" },
  { display: "도현", pronunciation: "Do-hyeon" },
  { display: "선우", pronunciation: "Seon-u" },
  { display: "우진", pronunciation: "U-jin" },
  { display: "민재", pronunciation: "Min-jae" },
  { display: "현우", pronunciation: "Hyeon-u" },
  { display: "지훈", pronunciation: "Ji-hun" },
  { display: "준혁", pronunciation: "Jun-hyeok" },
  { display: "승우", pronunciation: "Seung-u" },
  { display: "승민", pronunciation: "Seung-min" },
  { display: "재원", pronunciation: "Jae-won" },
  { display: "한결", pronunciation: "Han-gyeol" },
  { display: "윤호", pronunciation: "Yun-ho" },
  { display: "성민", pronunciation: "Seong-min" },
  { display: "진우", pronunciation: "Jin-u" },
  { display: "태양", pronunciation: "Tae-yang" },
  { display: "건우", pronunciation: "Geon-u" },
  { display: "민혁", pronunciation: "Min-hyeok" },
  { display: "정우", pronunciation: "Jeong-u" },
  { display: "재민", pronunciation: "Jae-min" },
  { display: "승현", pronunciation: "Seung-hyeon" },
];

const KO_FEMALE: GeneratedName[] = [
  { display: "서연", pronunciation: "Seo-yeon" },
  { display: "민서", pronunciation: "Min-seo" },
  { display: "하은", pronunciation: "Ha-eun" },
  { display: "지우", pronunciation: "Ji-u" },
  { display: "수아", pronunciation: "Su-a" },
  { display: "지유", pronunciation: "Ji-yu" },
  { display: "채원", pronunciation: "Chae-won" },
  { display: "수빈", pronunciation: "Su-bin" },
  { display: "지민", pronunciation: "Ji-min" },
  { display: "지아", pronunciation: "Ji-a" },
  { display: "하린", pronunciation: "Ha-rin" },
  { display: "나은", pronunciation: "Na-eun" },
  { display: "예은", pronunciation: "Ye-eun" },
  { display: "소율", pronunciation: "So-yul" },
  { display: "아린", pronunciation: "A-rin" },
  { display: "다은", pronunciation: "Da-eun" },
  { display: "예린", pronunciation: "Ye-rin" },
  { display: "수연", pronunciation: "Su-yeon" },
  { display: "지현", pronunciation: "Ji-hyeon" },
  { display: "유나", pronunciation: "Yu-na" },
  { display: "서아", pronunciation: "Seo-a" },
  { display: "민아", pronunciation: "Min-a" },
  { display: "하윤", pronunciation: "Ha-yun" },
  { display: "예나", pronunciation: "Ye-na" },
  { display: "소아", pronunciation: "So-a" },
  { display: "채윤", pronunciation: "Chae-yun" },
  { display: "지은", pronunciation: "Ji-eun" },
  { display: "나연", pronunciation: "Na-yeon" },
  { display: "서윤", pronunciation: "Seo-yun" },
  { display: "유진", pronunciation: "Yu-jin" },
];

/* ============================================================================
   🇯🇵 Japan
   ============================================================================ */

const JP_MALE: GeneratedName[] = [
  { display: "Haruto",  pronunciation: "Ha-ru-to" },
  { display: "Sota",    pronunciation: "So-ta" },
  { display: "Yuto",    pronunciation: "Yu-to" },
  { display: "Hayato",  pronunciation: "Ha-ya-to" },
  { display: "Kento",   pronunciation: "Ken-to" },
  { display: "Riku",    pronunciation: "Ri-ku" },
  { display: "Kaito",   pronunciation: "Kai-to" },
  { display: "Ren",     pronunciation: "Ren" },
  { display: "Ryota",   pronunciation: "Ryo-ta" },
  { display: "Sora",    pronunciation: "So-ra" },
  { display: "Takumi",  pronunciation: "Ta-ku-mi" },
  { display: "Yuki",    pronunciation: "Yu-ki" },
  { display: "Naoki",   pronunciation: "Na-o-ki" },
  { display: "Shota",   pronunciation: "Sho-ta" },
  { display: "Kenji",   pronunciation: "Ken-ji" },
  { display: "Tatsuya", pronunciation: "Ta-tsu-ya" },
  { display: "Hiroshi", pronunciation: "Hi-ro-shi" },
  { display: "Daiki",   pronunciation: "Dai-ki" },
  { display: "Kazuki",  pronunciation: "Ka-zu-ki" },
  { display: "Ryusei",  pronunciation: "Ryu-sei" },
  { display: "Akira",   pronunciation: "A-ki-ra" },
  { display: "Kohei",   pronunciation: "Ko-hei" },
  { display: "Yusei",   pronunciation: "Yu-sei" },
  { display: "Taiga",   pronunciation: "Tai-ga" },
  { display: "Makoto",  pronunciation: "Ma-ko-to" },
];

const JP_FEMALE: GeneratedName[] = [
  { display: "Yui",     pronunciation: "Yu-i" },
  { display: "Hana",    pronunciation: "Ha-na" },
  { display: "Sakura",  pronunciation: "Sa-ku-ra" },
  { display: "Aoi",     pronunciation: "A-o-i" },
  { display: "Yuna",    pronunciation: "Yu-na" },
  { display: "Rin",     pronunciation: "Rin" },
  { display: "Hina",    pronunciation: "Hi-na" },
  { display: "Saki",    pronunciation: "Sa-ki" },
  { display: "Nana",    pronunciation: "Na-na" },
  { display: "Miu",     pronunciation: "Mi-u" },
  { display: "Miyu",    pronunciation: "Mi-yu" },
  { display: "Koharu",  pronunciation: "Ko-ha-ru" },
  { display: "Riko",    pronunciation: "Ri-ko" },
  { display: "Noa",     pronunciation: "No-a" },
  { display: "Mei",     pronunciation: "Mei" },
  { display: "Akari",   pronunciation: "A-ka-ri" },
  { display: "Sana",    pronunciation: "Sa-na" },
  { display: "Haruka",  pronunciation: "Ha-ru-ka" },
  { display: "Momoko",  pronunciation: "Mo-mo-ko" },
  { display: "Ichika",  pronunciation: "I-chi-ka" },
  { display: "Kana",    pronunciation: "Ka-na" },
  { display: "Mana",    pronunciation: "Ma-na" },
  { display: "Nanami",  pronunciation: "Na-na-mi" },
  { display: "Shiori",  pronunciation: "Shi-o-ri" },
];

/* ============================================================================
   🇨🇳 China
   ============================================================================ */

const CN_MALE: GeneratedName[] = [
  { display: "伟", pronunciation: "Wěi" },
  { display: "雷", pronunciation: "Léi" },
  { display: "明", pronunciation: "Míng" },
  { display: "军", pronunciation: "Jūn" },
  { display: "浩", pronunciation: "Hào" },
  { display: "杰", pronunciation: "Jié" },
  { display: "鹏", pronunciation: "Péng" },
  { display: "超", pronunciation: "Chāo" },
  { display: "斌", pronunciation: "Bīn" },
  { display: "锋", pronunciation: "Fēng" },
  { display: "刚", pronunciation: "Gāng" },
  { display: "龙", pronunciation: "Lóng" },
  { display: "涛", pronunciation: "Tāo" },
  { display: "博", pronunciation: "Bó" },
  { display: "岩", pronunciation: "Yán" },
  { display: "凯", pronunciation: "Kǎi" },
  { display: "瑞", pronunciation: "Ruì" },
  { display: "晨", pronunciation: "Chén" },
  { display: "扬", pronunciation: "Yáng" },
  { display: "志", pronunciation: "Zhì" },
  { display: "翔", pronunciation: "Xiáng" },
  { display: "宇", pronunciation: "Yǔ" },
  { display: "恒", pronunciation: "Héng" },
];

const CN_FEMALE: GeneratedName[] = [
  { display: "秀", pronunciation: "Xiù" },
  { display: "芳", pronunciation: "Fāng" },
  { display: "燕", pronunciation: "Yàn" },
  { display: "丽", pronunciation: "Lì" },
  { display: "美", pronunciation: "Měi" },
  { display: "颖", pronunciation: "Yǐng" },
  { display: "晶", pronunciation: "Jīng" },
  { display: "花", pronunciation: "Huā" },
  { display: "心", pronunciation: "Xīn" },
  { display: "琳", pronunciation: "Lín" },
  { display: "云", pronunciation: "Yún" },
  { display: "霞", pronunciation: "Xiá" },
  { display: "慧", pronunciation: "Huì" },
  { display: "宁", pronunciation: "Níng" },
  { display: "清", pronunciation: "Qīng" },
  { display: "珊", pronunciation: "Shān" },
  { display: "薇", pronunciation: "Wēi" },
  { display: "丹", pronunciation: "Dān" },
  { display: "娟", pronunciation: "Juān" },
  { display: "萍", pronunciation: "Píng" },
  { display: "蕊", pronunciation: "Ruǐ" },
];

/* ============================================================================
   🇺🇸 USA
   ============================================================================ */

const US_MALE: GeneratedName[] = [
  { display: "Liam",      pronunciation: "Lee-uhm" },
  { display: "Noah",      pronunciation: "No-uh" },
  { display: "Oliver",    pronunciation: "Ol-ih-ver" },
  { display: "Elijah",    pronunciation: "Ee-lai-juh" },
  { display: "James",     pronunciation: "Jaymz" },
  { display: "Aiden",     pronunciation: "Ay-den" },
  { display: "Lucas",     pronunciation: "Loo-kus" },
  { display: "Mason",     pronunciation: "May-suhn" },
  { display: "Ethan",     pronunciation: "Ee-thun" },
  { display: "Jackson",   pronunciation: "Jak-suhn" },
  { display: "Sebastian", pronunciation: "Suh-bas-chuhn" },
  { display: "Mateo",     pronunciation: "Mah-tay-oh" },
  { display: "Jack",      pronunciation: "Jak" },
  { display: "Owen",      pronunciation: "Oh-wuhn" },
  { display: "Theodore",  pronunciation: "Thee-uh-dor" },
  { display: "Asher",     pronunciation: "Ash-er" },
  { display: "Henry",     pronunciation: "Hen-ree" },
  { display: "Hudson",    pronunciation: "Hud-suhn" },
  { display: "Alexander", pronunciation: "Al-ig-zan-der" },
  { display: "Logan",     pronunciation: "Lo-guhn" },
  { display: "Dylan",     pronunciation: "Dil-uhn" },
  { display: "Ryan",      pronunciation: "Rai-uhn" },
  { display: "Tyler",     pronunciation: "Tai-ler" },
  { display: "Nathan",    pronunciation: "Nay-thuhn" },
  { display: "Austin",    pronunciation: "Aw-stin" },
  { display: "Brandon",   pronunciation: "Bran-duhn" },
  { display: "Connor",    pronunciation: "Kon-er" },
  { display: "Caleb",     pronunciation: "Kay-lub" },
  { display: "Carter",    pronunciation: "Kar-ter" },
  { display: "Chase",     pronunciation: "Chays" },
];

const US_FEMALE: GeneratedName[] = [
  { display: "Olivia",    pronunciation: "Oh-liv-ee-uh" },
  { display: "Emma",      pronunciation: "Em-uh" },
  { display: "Charlotte", pronunciation: "Shar-luht" },
  { display: "Amelia",    pronunciation: "Uh-meel-yuh" },
  { display: "Sophia",    pronunciation: "So-fee-uh" },
  { display: "Isabella",  pronunciation: "Is-uh-bel-uh" },
  { display: "Mia",       pronunciation: "Mee-uh" },
  { display: "Evelyn",    pronunciation: "Ev-uh-lin" },
  { display: "Harper",    pronunciation: "Har-per" },
  { display: "Luna",      pronunciation: "Loo-nuh" },
  { display: "Camila",    pronunciation: "Kuh-meel-uh" },
  { display: "Gianna",    pronunciation: "Jee-ah-nuh" },
  { display: "Elizabeth", pronunciation: "Uh-liz-uh-buth" },
  { display: "Eleanor",   pronunciation: "El-uh-ner" },
  { display: "Ella",      pronunciation: "El-uh" },
  { display: "Abigail",   pronunciation: "Ab-uh-gayl" },
  { display: "Sofia",     pronunciation: "So-fee-uh" },
  { display: "Avery",     pronunciation: "Ay-vuh-ree" },
  { display: "Scarlett",  pronunciation: "Skar-let" },
  { display: "Emily",     pronunciation: "Em-uh-lee" },
  { display: "Aria",      pronunciation: "Ah-ree-uh" },
  { display: "Penelope",  pronunciation: "Puh-nel-uh-pee" },
  { display: "Chloe",     pronunciation: "Klo-ee" },
  { display: "Layla",     pronunciation: "Lay-luh" },
  { display: "Madison",   pronunciation: "Mad-ih-suhn" },
  { display: "Grace",     pronunciation: "Grays" },
  { display: "Zoey",      pronunciation: "Zo-ee" },
  { display: "Riley",     pronunciation: "Rai-lee" },
  { display: "Nora",      pronunciation: "Nor-uh" },
  { display: "Lily",      pronunciation: "Lil-ee" },
];

/* ============================================================================
   🇪🇸 Spain
   ============================================================================ */

const ES_MALE: GeneratedName[] = [
  { display: "Santiago",  pronunciation: "San-tee-ah-go" },
  { display: "Alejandro", pronunciation: "Ah-leh-han-dro" },
  { display: "Diego",     pronunciation: "Dee-eh-go" },
  { display: "Sebastián", pronunciation: "Seh-bas-tee-an" },
  { display: "Mateo",     pronunciation: "Mah-teh-o" },
  { display: "Nicolás",   pronunciation: "Nee-ko-las" },
  { display: "Samuel",    pronunciation: "Sah-mwel" },
  { display: "Pablo",     pronunciation: "Pah-blo" },
  { display: "Miguel",    pronunciation: "Mee-gel" },
  { display: "Javier",    pronunciation: "Hah-vee-er" },
  { display: "Fernando",  pronunciation: "Fer-nahn-do" },
  { display: "Rafael",    pronunciation: "Rah-fa-el" },
  { display: "Gabriel",   pronunciation: "Gah-bree-el" },
  { display: "Carlos",    pronunciation: "Kar-los" },
  { display: "Luis",      pronunciation: "Loo-ees" },
  { display: "Andrés",    pronunciation: "An-dres" },
  { display: "Eduardo",   pronunciation: "Eh-dwar-do" },
  { display: "Ricardo",   pronunciation: "Ree-kar-do" },
  { display: "Rodrigo",   pronunciation: "Roh-dree-go" },
  { display: "Antonio",   pronunciation: "An-toh-nee-o" },
  { display: "David",     pronunciation: "Dah-veed" },
  { display: "Marcos",    pronunciation: "Mar-kos" },
  { display: "Felipe",    pronunciation: "Feh-lee-peh" },
  { display: "Jorge",     pronunciation: "Hor-heh" },
  { display: "Sergio",    pronunciation: "Ser-hee-o" },
  { display: "Adrián",    pronunciation: "Ah-dree-an" },
  { display: "Iván",      pronunciation: "Ee-van" },
];

const ES_FEMALE: GeneratedName[] = [
  { display: "Sofía",     pronunciation: "So-fee-ah" },
  { display: "Valentina", pronunciation: "Vah-len-tee-nah" },
  { display: "Isabella",  pronunciation: "Ee-sah-beh-yah" },
  { display: "Camila",    pronunciation: "Kah-mee-lah" },
  { display: "Valeria",   pronunciation: "Vah-leh-ree-ah" },
  { display: "Lucía",     pronunciation: "Loo-thee-ah" },
  { display: "Mariana",   pronunciation: "Mah-ree-ah-nah" },
  { display: "Daniela",   pronunciation: "Dah-nee-eh-lah" },
  { display: "María",     pronunciation: "Mah-ree-ah" },
  { display: "Paula",     pronunciation: "Pow-lah" },
  { display: "Elena",     pronunciation: "Eh-leh-nah" },
  { display: "Andrea",    pronunciation: "An-dreh-ah" },
  { display: "Sara",      pronunciation: "Sah-rah" },
  { display: "Laura",     pronunciation: "Lau-rah" },
  { display: "Adriana",   pronunciation: "Ah-dree-ah-nah" },
  { display: "Carmen",    pronunciation: "Kar-men" },
  { display: "Natalia",   pronunciation: "Nah-tah-lee-ah" },
  { display: "Gloria",    pronunciation: "Glor-ee-ah" },
  { display: "Isabel",    pronunciation: "Ee-sah-bel" },
  { display: "Cristina",  pronunciation: "Krees-tee-nah" },
  { display: "Alejandra", pronunciation: "Ah-leh-han-drah" },
  { display: "Gabriela",  pronunciation: "Gah-bree-eh-lah" },
  { display: "Fernanda",  pronunciation: "Fer-nahn-dah" },
  { display: "Teresa",    pronunciation: "Teh-reh-sah" },
];

/* ============================================================================
   🇧🇷 Brazil
   ============================================================================ */

const BR_MALE: GeneratedName[] = [
  { display: "Gabriel",   pronunciation: "Gah-bree-el" },
  { display: "Arthur",    pronunciation: "Ar-toor" },
  { display: "Heitor",    pronunciation: "Ay-tor" },
  { display: "Davi",      pronunciation: "Dah-vee" },
  { display: "Lorenzo",   pronunciation: "Lo-ren-zo" },
  { display: "Théo",      pronunciation: "Tey-o" },
  { display: "Miguel",    pronunciation: "Mee-gel" },
  { display: "Pedro",     pronunciation: "Peh-dro" },
  { display: "Samuel",    pronunciation: "Sah-mwel" },
  { display: "Enzo",      pronunciation: "En-zo" },
  { display: "Lucas",     pronunciation: "Loo-kas" },
  { display: "Mateus",    pronunciation: "Mah-tay-oos" },
  { display: "Guilherme", pronunciation: "Gee-yer-mee" },
  { display: "Felipe",    pronunciation: "Feh-lee-pee" },
  { display: "Rafael",    pronunciation: "Hah-fa-el" },
  { display: "Bernardo",  pronunciation: "Ber-nar-do" },
  { display: "Eduardo",   pronunciation: "Eh-dwar-do" },
  { display: "Caio",      pronunciation: "Kai-o" },
  { display: "Vinicius",  pronunciation: "Vee-nee-see-oos" },
  { display: "Bruno",     pronunciation: "Broo-no" },
  { display: "Thiago",    pronunciation: "Tshee-ah-go" },
  { display: "Henrique",  pronunciation: "En-hee-kee" },
  { display: "Leonardo",  pronunciation: "Leh-o-nar-do" },
  { display: "Gustavo",   pronunciation: "Goos-tah-vo" },
  { display: "André",     pronunciation: "An-dreh" },
];

const BR_FEMALE: GeneratedName[] = [
  { display: "Alice",     pronunciation: "Ah-lee-see" },
  { display: "Sofia",     pronunciation: "So-fee-ah" },
  { display: "Valentina", pronunciation: "Vah-len-tee-nah" },
  { display: "Julia",     pronunciation: "Zhoo-lee-ah" },
  { display: "Isabela",   pronunciation: "Ee-zah-beh-lah" },
  { display: "Laura",     pronunciation: "Lau-rah" },
  { display: "Manuela",   pronunciation: "Mah-noo-eh-lah" },
  { display: "Giovanna",  pronunciation: "Zho-vah-nah" },
  { display: "Beatriz",   pronunciation: "Beh-ah-treesh" },
  { display: "Luisa",     pronunciation: "Loo-ee-zah" },
  { display: "Maria",     pronunciation: "Mah-ree-ah" },
  { display: "Ana",       pronunciation: "Ah-nah" },
  { display: "Camila",    pronunciation: "Kah-mee-lah" },
  { display: "Fernanda",  pronunciation: "Fer-nahn-dah" },
  { display: "Carolina",  pronunciation: "Ka-ro-lee-nah" },
  { display: "Gabriela",  pronunciation: "Gah-bree-eh-lah" },
  { display: "Natalia",   pronunciation: "Nah-tah-lee-ah" },
  { display: "Mariana",   pronunciation: "Mah-ree-ah-nah" },
  { display: "Letícia",   pronunciation: "Leh-tee-see-ah" },
  { display: "Rafaela",   pronunciation: "Hah-fa-eh-lah" },
  { display: "Clara",     pronunciation: "Klah-rah" },
  { display: "Helena",    pronunciation: "Eh-leh-nah" },
  { display: "Vitória",   pronunciation: "Vee-tor-ee-ah" },
  { display: "Bruna",     pronunciation: "Broo-nah" },
  { display: "Larissa",   pronunciation: "Lah-ree-sah" },
];

/* ============================================================================
   Celebrities per country
   ============================================================================ */

const KO_CELEBS: Celebrity[] = [
  { name: "BTS RM", role: "방탄소년단 리더·래퍼" },
  { name: "BTS Jin", role: "방탄소년단 보컬" },
  { name: "BTS Jungkook", role: "방탄소년단 메인보컬" },
  { name: "BLACKPINK Jisoo", role: "블랙핑크 보컬" },
  { name: "BLACKPINK Jennie", role: "블랙핑크 래퍼" },
  { name: "IU 아이유", role: "싱어송라이터" },
  { name: "박보검", role: "배우" },
  { name: "손흥민", role: "축구 선수" },
  { name: "김연아", role: "피겨 스케이팅 전설" },
  { name: "봉준호", role: "영화감독 (기생충)" },
  { name: "박서준", role: "배우" },
  { name: "NewJeans 하니", role: "뉴진스 멤버" },
  { name: "이민호", role: "배우" },
  { name: "차은우", role: "ASTRO 멤버·배우" },
];

const JP_CELEBS: Celebrity[] = [
  { name: "Hayao Miyazaki", role: "지브리 애니메이션 거장" },
  { name: "Haruki Murakami", role: "소설가 (1Q84)" },
  { name: "Takuya Kimura", role: "국민 배우" },
  { name: "Naomi Osaka", role: "테니스 선수" },
  { name: "Hideo Kojima", role: "메탈기어 게임 디자이너" },
  { name: "Akira Kurosawa", role: "전설의 영화감독" },
  { name: "Ryuichi Sakamoto", role: "작곡가·피아니스트" },
  { name: "Rui Hachimura", role: "NBA 농구 선수" },
  { name: "Yuzuru Hanyu", role: "피겨 스케이팅 챔피언" },
  { name: "Yui Aragaki", role: "여배우" },
  { name: "Ken Watanabe", role: "할리우드도 진출한 배우" },
];

const CN_CELEBS: Celebrity[] = [
  { name: "Jet Li 이연걸", role: "무술 액션 배우" },
  { name: "Jackie Chan 성룡", role: "쿵푸 액션 스타" },
  { name: "Yang Mi 양미", role: "톱 여배우" },
  { name: "Yao Ming 야오밍", role: "NBA 전설" },
  { name: "Fan Bingbing 판빙빙", role: "여배우" },
  { name: "Tony Leung 양조위", role: "홍콩 명배우" },
  { name: "Maggie Cheung 장만옥", role: "여배우 (화양연화)" },
  { name: "Andy Lau 유덕화", role: "가수·배우 슈퍼스타" },
  { name: "Liu Yifei 유역비", role: "여배우 (뮬란)" },
  { name: "Lang Lang 랑랑", role: "세계적 피아니스트" },
  { name: "Chow Yun-fat 주윤발", role: "전설의 액션 배우" },
];

const US_CELEBS: Celebrity[] = [
  { name: "Taylor Swift", role: "Pop 슈퍼스타" },
  { name: "LeBron James", role: "NBA 농구 황제" },
  { name: "Tom Cruise", role: "할리우드 액션 스타" },
  { name: "Beyoncé", role: "R&B 디바" },
  { name: "Michael Jordan", role: "농구의 신" },
  { name: "Oprah Winfrey", role: "미국 토크쇼의 전설" },
  { name: "Elon Musk", role: "테슬라·SpaceX CEO" },
  { name: "Brad Pitt", role: "할리우드 배우" },
  { name: "Lady Gaga", role: "팝 아티스트" },
  { name: "Steven Spielberg", role: "전설의 영화감독" },
  { name: "Serena Williams", role: "테니스 챔피언" },
  { name: "Barack Obama", role: "전 미국 대통령" },
];

const ES_CELEBS: Celebrity[] = [
  { name: "Rafa Nadal", role: "테니스 황제" },
  { name: "Penélope Cruz", role: "오스카 여배우" },
  { name: "Antonio Banderas", role: "할리우드도 정복한 배우" },
  { name: "Pablo Picasso", role: "20세기 화가의 거장" },
  { name: "Salvador Dalí", role: "초현실주의 화가" },
  { name: "Sergio Ramos", role: "축구 수비수 전설" },
  { name: "Javier Bardem", role: "오스카 남우조연상 배우" },
  { name: "Plácido Domingo", role: "오페라 테너" },
  { name: "Andrés Iniesta", role: "월드컵 우승 미드필더" },
  { name: "Enrique Iglesias", role: "라틴 팝 스타" },
];

const BR_CELEBS: Celebrity[] = [
  { name: "Neymar", role: "축구 슈퍼스타" },
  { name: "Anitta", role: "라틴 팝 디바" },
  { name: "Pelé", role: "축구의 신" },
  { name: "Ronaldinho", role: "축구 마법사" },
  { name: "Gisele Bündchen", role: "톱 모델" },
  { name: "Caetano Veloso", role: "MPB 음악의 전설" },
  { name: "Alessandra Ambrosio", role: "Victoria's Secret 모델" },
  { name: "Adriana Lima", role: "수퍼모델" },
  { name: "Camila Pitanga", role: "여배우" },
  { name: "Fernando Meirelles", role: "영화감독 (시티 오브 갓)" },
];

/* ============================================================================
   Personality pools
   ============================================================================ */

const KO_PERSONALITY = [
  "의리가 강하고 눈치가 빠릅니다. 치킨 앞에서 진심이 드러납니다. 🍗",
  "처음엔 차가워 보이지만 친해지면 세상 따뜻한 사람. 빨리빨리가 DNA에 새겨져 있습니다. ⚡",
  "열심히 사는 사람. 야근을 밥 먹듯 하지만 퇴근 후 치맥은 절대 포기 못합니다. 🍺",
  "눈치 100단. 분위기 파악은 기본, 눈빛만 봐도 상대방 마음을 읽습니다. 👁️",
  "정이 많아서 탈. 한번 친해지면 평생 챙겨줍니다. 카카오톡 답장은 1초. 💬",
  "주말이면 카페 투어. 인스타그램 스토리 업로드는 하루 평균 8개. 📸",
  "MBTI 얘기로 처음 만난 사람과도 30분은 떠들 수 있는 사람. 🧠",
  "밥 먹을 때 제일 빛납니다. 김치 없으면 밥이 안 넘어갑니다. 🍚",
];

const JP_PERSONALITY = [
  "혼자만의 시간을 소중히 여기는 타입. 줄 서는 것에 거부감이 없습니다. 🎌",
  "예의 바르고 섬세합니다. 사과를 3번 이상 하는 것은 기본. 🙇",
  "완벽주의 성향. 0.1mm도 어긋나면 처음부터 다시 합니다. ✏️",
  "조용하지만 깊은 생각을 가진 타입. 라멘은 꼭 혼자 먹습니다. 🍜",
  "계절을 사랑하는 사람. 벚꽃이 피면 전부 멈추고 하나미를 갑니다. 🌸",
  "정리정돈에 진심. 책상 위 펜은 항상 평행 정렬. 🖊️",
  "약속 시간 5분 전 도착이 진짜 정시. 1분 늦으면 사과 메시지 도착. ⏰",
  "남에게 폐 끼치는 것을 가장 싫어합니다. 만원 전철에서도 작아집니다. 🚃",
];

const CN_PERSONALITY = [
  "큰 그림을 보는 사람. 5년 계획은 기본, 50년 계획도 갖고 있습니다. 🐉",
  "가족을 위해서라면 무엇이든. 춘절에는 반드시 귀성합니다. 🏮",
  "협상의 달인. 시장에서 가격 깎는 건 기본, 호텔에서도 깎습니다. 💰",
  "차(茶) 한 잔으로 사람을 평가합니다. 좋은 차를 알아보는 안목이 있습니다. 🍵",
  "용의 기운을 타고난 사람. 새해 운세는 항상 대길. 🧧",
  "체면이 중요한 사람. 식사 자리에서는 무조건 결제 시도. 🍽️",
  "오랜 친구를 소중히 여깁니다. 어릴 적 친구와 30년째 연락 중. 📞",
  "건강에 진심. 매일 아침 태극권 또는 스트레칭은 기본. 🌅",
];

const US_PERSONALITY = [
  "어디서나 자신감이 넘칩니다. 처음 만나는 사람과 5분 만에 친구. 커피는 무조건 Grande 사이즈. ☕",
  "스몰토크의 달인. 날씨 얘기로 1시간 가능합니다. ⛅",
  "꿈을 크게 꿉니다. 언젠가 테슬라를 사겠다는 확신이 있어요. 🚗",
  "주말엔 반드시 바베큐. 옆집 사람도 초대합니다. 🔥",
  "감사 인사를 1분에 3번 합니다. 진심입니다. 🙏",
  "자유를 사랑합니다. 규칙은 필요할 때만 따릅니다. 🦅",
  "긍정 에너지로 가득. \"You got this!\"가 입에 붙어 있습니다. ✨",
  "Thanksgiving엔 무조건 가족 모임. 칠면조는 사랑입니다. 🦃",
];

const ES_PERSONALITY = [
  "시에스타 없이는 오후를 버틸 수 없습니다. 하지만 밤 10시부터 진짜 시작됩니다. 🌙",
  "열정이 넘칩니다. 축구 얘기만 나오면 목소리가 3배 커집니다. ⚽",
  "춤을 못 춰도 음악만 나오면 몸이 움직입니다. 점심은 2시간 이상. 💃",
  "가족과 친구가 인생의 전부. 주말은 무조건 다 같이. 🥘",
  "햇살 아래 와인 한 잔이면 세상이 평화롭습니다. 🍷",
  "포옹과 볼키스가 인사. 이메일보다는 전화, 전화보다는 직접 만남. 🤗",
  "내일 할 일을 굳이 오늘 하지 않습니다. Mañana 정신의 화신. ☀️",
  "토마토 축제든 황소 달리기든, 일단 즐기고 봅니다. 🍅",
];

const BR_PERSONALITY = [
  "에너지가 넘칩니다. 음악만 나오면 어디서든 춤을 춥니다. 🎵",
  "친구를 만나면 2시간 포옹 인사는 기본. 모든 것을 크게 표현합니다. 🤗",
  "어디서든 파티를 만들어내는 사람. 카니발은 1년 365일. 🎉",
  "축구를 못 해도 누구보다 열정적. 월드컵 시즌은 국가 공휴일급. ⚽",
  "낯선 사람과 5분이면 베프가 됩니다. 거리에서도 인사를 건넵니다. 👋",
  "햇살, 바다, 카이피리냐 한 잔이면 모든 게 해결. 🍹",
  "약속은 'Brazilian time'. 30분 늦는 게 정시입니다. ⏳",
  "삼바부터 보사노바까지 모든 리듬을 몸으로 압니다. 🎷",
];

/* ============================================================================
   Country definitions
   ============================================================================ */

const COUNTRIES: Country[] = [
  { code: "kr", flag: "🇰🇷", enName: "Korea",  koName: "한국",  bg: "#faf8f3", ttsLang: "ko-KR", malePool: KO_MALE, femalePool: KO_FEMALE, celebrities: KO_CELEBS, personalities: KO_PERSONALITY },
  { code: "jp", flag: "🇯🇵", enName: "Japan",  koName: "일본",  bg: "#fff0f3", ttsLang: "ja-JP", malePool: JP_MALE, femalePool: JP_FEMALE, celebrities: JP_CELEBS, personalities: JP_PERSONALITY },
  { code: "cn", flag: "🇨🇳", enName: "China",  koName: "중국",  bg: "#fff5f5", ttsLang: "zh-CN", malePool: CN_MALE, femalePool: CN_FEMALE, celebrities: CN_CELEBS, personalities: CN_PERSONALITY },
  { code: "us", flag: "🇺🇸", enName: "USA",    koName: "미국",  bg: "#f0f5ff", ttsLang: "en-US", malePool: US_MALE, femalePool: US_FEMALE, celebrities: US_CELEBS, personalities: US_PERSONALITY },
  { code: "es", flag: "🇪🇸", enName: "Spain",  koName: "스페인", bg: "#fffbf0", ttsLang: "es-ES", malePool: ES_MALE, femalePool: ES_FEMALE, celebrities: ES_CELEBS, personalities: ES_PERSONALITY },
  { code: "br", flag: "🇧🇷", enName: "Brazil", koName: "브라질", bg: "#f0fff8", ttsLang: "pt-BR", malePool: BR_MALE, femalePool: BR_FEMALE, celebrities: BR_CELEBS, personalities: BR_PERSONALITY },
];

const COUNTRY_BY_CODE: Record<CountryCode, Country> = COUNTRIES.reduce(
  (m, c) => ({ ...m, [c.code]: c }),
  {} as Record<CountryCode, Country>,
);

/* ============================================================================
   Profile builder — given name, gender, and country
   ============================================================================ */

type Profile = {
  country: Country;
  name: GeneratedName;
  celebrity: Celebrity;
  personality: string;
};

const COUNTRY_STORY: Record<CountryCode, {
  vibeKo: string[];
  vibeEn: string[];
  impressionKo: string[];
  impressionEn: string[];
  placeKo: string[];
  placeEn: string[];
  profileKo: string[];
  profileEn: string[];
}> = {
  kr: {
    vibeKo: ["단정하고 신뢰감 있는 이름", "요즘 감각과 익숙함이 함께 있는 이름", "차분하지만 존재감이 남는 이름"],
    vibeEn: ["A neat, trustworthy name", "A familiar modern Korean name", "Calm, current, and easy to remember"],
    impressionKo: ["처음에는 조용해 보여도 금방 믿음이 가는 사람", "말보다 행동이 먼저 보이는 사람", "자연스럽게 주변을 챙기는 사람"],
    impressionEn: ["Quiet at first, but easy to trust", "Someone whose actions speak first", "A person who naturally looks after people"],
    placeKo: ["서울 성수동", "부산 전포동", "전주 한옥마을 근처"],
    placeEn: ["Seongsu-dong, Seoul", "Jeonpo-dong, Busan", "near Jeonju Hanok Village"],
    profileKo: ["한국에서 태어났다면 당신은 익숙한 자리에서도 자기만의 취향을 또렷하게 남기는 사람으로 기억되었을지 모릅니다."],
    profileEn: ["If born in Korea, you might be remembered as someone with a clear personal taste even in familiar everyday places."],
  },
  jp: {
    vibeKo: ["차분하지만 또렷한 인상이 있는 이름", "섬세하고 오래 기억되는 이름", "도시적인 조용함이 느껴지는 이름"],
    vibeEn: ["Calm, clear, and memorable", "Delicate without feeling fragile", "Quietly urban and thoughtful"],
    impressionKo: ["말수는 많지 않지만 묘하게 기억에 남는 사람", "좋아하는 것에는 오래 집중하는 사람", "거리감은 있지만 무심하지 않은 사람"],
    impressionEn: ["Not loud, yet strangely memorable", "Someone who stays with what they love", "Reserved, but not indifferent"],
    placeKo: ["도쿄 시모키타자와", "교토 가모가와 근처", "후쿠오카 다이묘"],
    placeEn: ["Shimokitazawa, Tokyo", "near the Kamo River in Kyoto", "Daimyo, Fukuoka"],
    profileKo: ["일본에서 태어났다면 당신은 조용한 골목 카페를 자주 가고, 좋아하는 것에는 오래 집중하는 사람으로 기억되었을지 모릅니다."],
    profileEn: ["If born in Japan, you might be the kind of person who returns to the same quiet cafe and gives long attention to what you love."],
  },
  cn: {
    vibeKo: ["깔끔하고 힘이 있는 이름", "현실감과 성실함이 느껴지는 이름", "분명한 목표가 있을 것 같은 이름"],
    vibeEn: ["Clean, grounded, and strong", "Practical and steady", "A name with a sense of direction"],
    impressionKo: ["일을 맡기면 끝까지 해낼 것 같은 사람", "사람을 오래 보고 판단하는 사람", "차분하게 자기 길을 넓히는 사람"],
    impressionEn: ["Someone who finishes what they take on", "A careful judge of people", "Someone who steadily widens their path"],
    placeKo: ["상하이 징안", "베이징 차오양", "항저우 시후 근처"],
    placeEn: ["Jing'an, Shanghai", "Chaoyang, Beijing", "near West Lake, Hangzhou"],
    profileKo: ["중국에서 태어났다면 당신은 빠르게 변하는 도시 안에서도 자기 기준을 잃지 않는 사람으로 보였을지 모릅니다."],
    profileEn: ["If born in China, you might seem like someone who keeps a personal standard even in a fast-changing city."],
  },
  us: {
    vibeKo: ["친근하고 현대적인 이름", "자연스럽고 기억하기 쉬운 이름", "밝지만 과하지 않은 이름"],
    vibeEn: ["Friendly and modern", "Natural and easy to remember", "Bright without trying too hard"],
    impressionKo: ["처음 보는 사람도 편하게 만드는 사람", "자기 의견을 부드럽게 말할 줄 아는 사람", "새로운 곳에 빨리 적응하는 사람"],
    impressionEn: ["Someone who makes strangers comfortable", "A person who says what they think without making it heavy", "Someone who adapts quickly to new places"],
    placeKo: ["뉴욕 브루클린", "시애틀 캐피톨힐", "오스틴 사우스 콩그레스"],
    placeEn: ["Brooklyn, New York", "Capitol Hill, Seattle", "South Congress, Austin"],
    profileKo: ["미국에서 태어났다면 당신은 동네 카페에서 처음 만난 사람과도 자연스럽게 대화를 시작하는 사람으로 보였을지 모릅니다."],
    profileEn: ["If born in the United States, you might be the person who can start a natural conversation with someone at a neighborhood cafe."],
  },
  es: {
    vibeKo: ["따뜻하고 선명한 리듬이 있는 이름", "고전적이지만 낡지 않은 이름", "가족과 친구 사이에 잘 어울리는 이름"],
    vibeEn: ["Warm, rhythmic, and clear", "Classic without feeling old-fashioned", "A name that sits well among friends and family"],
    impressionKo: ["표현은 분명하지만 마음은 부드러운 사람", "좋아하는 것을 숨기지 않는 사람", "사람들과 함께 있을 때 더 빛나는 사람"],
    impressionEn: ["Expressive, but warm at heart", "Someone who does not hide what they love", "A person who shines more with others"],
    placeKo: ["마드리드 말라사냐", "바르셀로나 그라시아", "세비야 산타크루스"],
    placeEn: ["Malasaña, Madrid", "Gracia, Barcelona", "Santa Cruz, Seville"],
    profileKo: ["스페인에서 태어났다면 당신은 느긋한 오후와 긴 대화 속에서 사람들에게 편안한 기억으로 남았을지 모릅니다."],
    profileEn: ["If born in Spain, you might be remembered through long conversations and unhurried afternoons."],
  },
  br: {
    vibeKo: ["밝고 따뜻하며 사람들과 잘 어울리는 이름", "부드럽지만 생기가 있는 이름", "편안한 미소가 떠오르는 이름"],
    vibeEn: ["Warm, bright, and social", "Soft, lively, and familiar", "A name that feels like an easy smile"],
    impressionKo: ["처음 보는 사람도 편하게 만드는 사람", "분위기를 자연스럽게 풀어주는 사람", "가까운 사람을 오래 아끼는 사람"],
    impressionEn: ["Someone who makes new people feel at ease", "A person who loosens the room naturally", "Someone loyal to the people close to them"],
    placeKo: ["상파울루 빌라 마달레나", "리우데자네이루 보타포구", "살바도르 바라"],
    placeEn: ["Vila Madalena, São Paulo", "Botafogo, Rio de Janeiro", "Barra, Salvador"],
    profileKo: ["브라질에서 태어났다면 당신은 작은 모임도 따뜻하게 만드는 사람으로, 오래 알고 싶은 이름으로 기억되었을지 모릅니다."],
    profileEn: ["If born in Brazil, you might be remembered as someone who makes even a small gathering feel warmer."],
  },
};

function composeLocalName(country: Country, input: string, gender: Gender): GeneratedName {
  const givenPool = gender === "male" ? country.malePool : country.femalePool;
  const given = pickSeeded(givenPool, input, `${country.code}:${gender}:given`);
  const story = COUNTRY_STORY[country.code];
  const storyPick = (items: string[], salt: string) => pickSeeded(items, input, `${country.code}:${salt}`);
  const withStory = (base: GeneratedName): GeneratedName => ({
    ...base,
    vibeKo: storyPick(story.vibeKo, "vibe-ko"),
    vibeEn: storyPick(story.vibeEn, "vibe-en"),
    impressionKo: storyPick(story.impressionKo, "impression-ko"),
    impressionEn: storyPick(story.impressionEn, "impression-en"),
    placeKo: storyPick(story.placeKo, "place-ko"),
    placeEn: storyPick(story.placeEn, "place-en"),
    profileKo: storyPick(story.profileKo, "profile-ko"),
    profileEn: storyPick(story.profileEn, "profile-en"),
  });

  if (country.code === "kr") {
    const family = pickSeeded(KO_FAMILY, input, "kr:family");
    return withStory({
      display: `${family.display}${given.display}`,
      displayEn: `${family.pronunciation} ${given.pronunciation}`,
      pronunciation: `${family.pronunciation} ${given.pronunciation}`,
    });
  }

  if (country.code === "jp") {
    const surname = pickSeeded(JP_SURNAMES, input, "jp:surname");
    const nativeGiven = pickSeeded(
      gender === "male" ? JP_MALE_NATIVE : JP_FEMALE_NATIVE,
      input,
      `jp:${gender}:native-given`,
    );
    return withStory({
      display: `${surname.display} ${nativeGiven.display}`,
      displayEn: `${surname.pronunciation} ${nativeGiven.pronunciation}`,
      pronunciation: `${surname.pronunciation} ${nativeGiven.pronunciation}`,
    });
  }

  if (country.code === "cn") {
    const surname = pickSeeded(CN_SURNAMES, input, "cn:surname");
    return withStory({
      display: `${surname.display}${given.display}`,
      displayEn: `${surname.pronunciation} ${given.pronunciation}`,
      pronunciation: `${surname.pronunciation} ${given.pronunciation}`,
    });
  }

  if (country.code === "us") {
    const surname = pickSeeded(US_LAST_NAMES, input, "us:surname");
    return withStory({
      display: `${given.display} ${surname.display}`,
      pronunciation: `${given.display} ${surname.display}`,
    });
  }

  if (country.code === "es") {
    const surname = pickSeeded(ES_LAST_NAMES, input, "es:surname");
    return withStory({
      display: `${given.display} ${surname.display}`,
      pronunciation: `${given.display} ${surname.display}`,
    });
  }

  if (country.code === "br") {
    const useCompound = seededIndex(input, `br:${gender}:compound`, 3) !== 0;
    const first = useCompound
      ? pickSeeded(gender === "male" ? BR_MALE_COMPOUND : BR_FEMALE_COMPOUND, input, `br:${gender}:compound-name`)
      : given;
    const surname = pickSeeded(BR_LAST_NAMES, input, "br:surname");
    return withStory({
      display: `${first.display} ${surname.display}`,
      pronunciation: `${first.display} ${surname.display}`,
    });
  }

  return withStory(given);
}

function buildProfile(country: Country, input: string, gender: Gender): Profile {
  return {
    country,
    name: composeLocalName(country, input, gender),
    celebrity: country.celebrities[seededIndex(input, country.code + ":celeb", country.celebrities.length)],
    personality: country.personalities[seededIndex(input, country.code + ":pers", country.personalities.length)],
  };
}

/* ============================================================================
   Page
   ============================================================================ */

type Phase = "name" | "gender" | "origin" | "result";

export default function KoreanNamePage(): ReactElement {
  const { locale, t } = useLocale();
  const [phase, setPhase] = useState<Phase>("name");
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [origin, setOrigin] = useState<CountryCode | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [speakingCode, setSpeakingCode] = useState<CountryCode | null>(null);
  const [ttsAvailable, setTtsAvailable] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTtsAvailable(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll to top on phase change
  useEffect(() => {
    requestAnimationFrame(() => {
      if (typeof window !== "undefined") window.scrollTo(0, 0);
    });
  }, [phase, selectedCountry]);

  const visibleCountries = useMemo(
    () => (origin ? COUNTRIES.filter((c) => c.code !== origin) : COUNTRIES),
    [origin],
  );

  const currentProfile = useMemo<Profile | null>(() => {
    if (!selectedCountry || !gender || !submittedName) return null;
    const country = COUNTRY_BY_CODE[selectedCountry];
    return buildProfile(country, submittedName, gender);
  }, [selectedCountry, gender, submittedName]);

  const handleNameSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = name.trim();
      if (!trimmed) {
        inputRef.current?.focus();
        return;
      }
      setSubmittedName(trimmed);
      setPhase("gender");
    },
    [name],
  );

  const handleGenderPick = useCallback((g: Gender) => {
    setGender(g);
    setPhase("origin");
  }, []);

  const handleOriginPick = useCallback((c: CountryCode) => {
    setOrigin(c);
    setSelectedCountry(null);
    setPhase("result");
  }, []);

  const handleCountryPick = useCallback((c: CountryCode) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingCode(null);
    setSelectedCountry(c);
  }, []);

  const handleBackToPicker = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const handleReset = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingCode(null);
    setName("");
    setSubmittedName("");
    setGender(null);
    setOrigin(null);
    setSelectedCountry(null);
    setCopiedKey(null);
    setPhase("name");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const flashCopied = useCallback((key: string) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1800);
  }, []);

  const onShare = useCallback(async () => {
    if (!currentProfile) return;
    const p = currentProfile;
    const text = t(
      `내가 ${p.country.koName}에서 태어났다면:\n` +
        `${p.name.display}${p.name.pronunciation ? ` (${p.name.pronunciation})` : ""}\n` +
        `${p.name.vibeKo ?? p.personality}\n` +
        `${p.name.profileKo ?? p.personality}\n` +
        `나의 ${p.country.koName} 도플갱어: ${p.celebrity.name}\n` +
        `나는? → nolza.fun/games/korean-name`,
      `If I were born in ${p.country.enName}:\n` +
        `${p.name.displayEn ?? p.name.display}${p.name.pronunciation ? ` (${p.name.pronunciation})` : ""}\n` +
        `${p.name.vibeEn ?? p.personality}\n` +
        `${p.name.profileEn ?? p.personality}\n` +
        `My doppelgänger: ${p.celebrity.name}\n` +
        `Try yours → nolza.fun/games/korean-name`,
    );
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      /* ignore */
    }
    flashCopied(p.country.code);
  }, [currentProfile, flashCopied]);

  const speak = useCallback(
    (text: string, lang: string, code: CountryCode) => {
      if (!ttsAvailable || typeof window === "undefined") return;
      const synth = window.speechSynthesis;
      if (speakingCode === code) {
        synth.cancel();
        setSpeakingCode(null);
        return;
      }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.85;
      u.pitch = 1.0;
      u.onend = () => setSpeakingCode((c) => (c === code ? null : c));
      u.onerror = () => setSpeakingCode((c) => (c === code ? null : c));
      setSpeakingCode(code);
      synth.speak(u);
    },
    [ttsAvailable, speakingCode],
  );

  const stepNum =
    phase === "name" ? 1 : phase === "gender" ? 2 : phase === "origin" ? 3 : 4;

  return (
    <main
      style={{
        minHeight: "100svh",
        background: BG,
        color: INK,
        fontFamily: "var(--font-noto-serif-kr), 'Noto Sans KR', serif",
        position: "relative",
        paddingBottom: 100,
      }}
    >
      <Link
        href="/"
        aria-label="home"
        style={{
          position: "fixed",
          left: 20,
          top: 20,
          zIndex: 50,
          display: "inline-flex",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          fontSize: 22,
          color: "rgba(31,27,22,0.55)",
          textDecoration: "none",
          background: "rgba(255,253,247,0.7)",
          backdropFilter: "blur(6px)",
        }}
      >
        ←
      </Link>
      {/* Step indicator */}
      <div
        style={{
          position: "fixed",
          top: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 40,
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
        aria-label={`Step ${stepNum} of 4`}
      >
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            style={{
              width: n === stepNum ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: n <= stepNum ? ACCENT : "rgba(31,27,22,0.18)",
              transition: "width 0.25s ease, background 0.25s ease",
            }}
          />
        ))}
      </div>

      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: phase === "name" ? "center" : "flex-start",
          padding: "80px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        {phase === "name" && (
          <NameStep
            value={name}
            onChange={setName}
            onSubmit={handleNameSubmit}
            inputRef={inputRef}
            t={t}
          />
        )}

        {phase === "gender" && (
          <GenderStep onPick={handleGenderPick} t={t} />
        )}

        {phase === "origin" && (
          <OriginStep onPick={handleOriginPick} t={t} />
        )}

        {phase === "result" && gender && origin && (
          <ResultStep
            input={submittedName}
            gender={gender}
            origin={origin}
            visibleCountries={visibleCountries}
            selectedCountry={selectedCountry}
            currentProfile={currentProfile}
            copiedKey={copiedKey}
            speakingCode={speakingCode}
            ttsAvailable={ttsAvailable}
            onCountryPick={handleCountryPick}
            onBackToPicker={handleBackToPicker}
            onShare={onShare}
            onReset={handleReset}
            onSpeak={speak}
            t={t}
            locale={locale}
          />
        )}
      </div>

      <AdMobileSticky />
    </main>
  );
}

/* ============================================================================
   Step 1 — Name input
   ============================================================================ */

function NameStep({
  value,
  onChange,
  onSubmit,
  inputRef,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e?: FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  t: (ko: string, en: string) => string;
}): ReactElement {
  return (
    <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
      <StepEyebrow>{t("다른 나라에서 태어났다면 · 1 / 4 단계", "BORN ELSEWHERE  ·  STEP 1 / 4")}</StepEyebrow>
      <h1 style={titleStyle}>
        {t("당신의 이름은?", "What's your name?")}
      </h1>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 28 }}>
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="given-name"
          placeholder={t("이름을 입력하세요…", "Enter your name…")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={40}
          style={{
            background: "#fffdf7",
            color: INK,
            border: `1px solid ${RULE}`,
            borderRadius: 14,
            padding: "16px 18px",
            fontSize: 17,
            outline: "none",
            fontFamily: "'Inter', sans-serif",
            width: "100%",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        />
        <button type="submit" style={primaryButtonStyle}>
          {t("다음", "NEXT")}
        </button>
      </form>
    </div>
  );
}

/* ============================================================================
   Step 2 — Gender
   ============================================================================ */

function GenderStep({ onPick, t }: { onPick: (g: Gender) => void; t: (ko: string, en: string) => string }): ReactElement {
  return (
    <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
      <StepEyebrow>{t("2 / 4 단계", "STEP 2 / 4")}</StepEyebrow>
      <h1 style={titleStyle}>{t("성별을 선택해주세요", "Choose your gender")}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 32 }}>
        <ChoiceTile emoji="👨" en="Male" ko="남성" onClick={() => onPick("male")} />
        <ChoiceTile emoji="👩" en="Female" ko="여성" onClick={() => onPick("female")} />
      </div>
    </div>
  );
}

/* ============================================================================
   Step 3 — Origin country
   ============================================================================ */

function OriginStep({ onPick, t }: { onPick: (c: CountryCode) => void; t: (ko: string, en: string) => string }): ReactElement {
  return (
    <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
      <StepEyebrow>{t("3 / 4 단계", "STEP 3 / 4")}</StepEyebrow>
      <h1 style={titleStyle}>{t("당신은 어느 나라 사람인가요?", "Where are you from?")}</h1>
      <p
        style={{
          fontSize: 14,
          color: "rgba(31,27,22,0.45)",
          marginTop: 8,
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
        }}
      >
        {t("선택한 나라는 결과에서 제외돼요", "Your country will be excluded from results")}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 10,
          marginTop: 28,
        }}
      >
        {COUNTRIES.map((c) => (
          <CountryTile key={c.code} country={c} onClick={() => onPick(c.code)} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   Step 4 — Result (picker view & detail view)
   ============================================================================ */

function ResultStep({
  input,
  gender,
  origin,
  visibleCountries,
  selectedCountry,
  currentProfile,
  copiedKey,
  speakingCode,
  ttsAvailable,
  onCountryPick,
  onBackToPicker,
  onShare,
  onReset,
  onSpeak,
  t,
  locale,
}: {
  input: string;
  gender: Gender;
  origin: CountryCode;
  visibleCountries: Country[];
  selectedCountry: CountryCode | null;
  currentProfile: Profile | null;
  copiedKey: string | null;
  speakingCode: CountryCode | null;
  ttsAvailable: boolean;
  onCountryPick: (c: CountryCode) => void;
  onBackToPicker: () => void;
  onShare: () => void;
  onReset: () => void;
  onSpeak: (text: string, lang: string, code: CountryCode) => void;
  t: (ko: string, en: string) => string;
  locale: "ko" | "en";
}): ReactElement {
  const originCountry = COUNTRY_BY_CODE[origin];

  if (!selectedCountry || !currentProfile) {
    // Picker view
    return (
      <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
        <StepEyebrow>{t("4 / 4 단계", "STEP 4 / 4")}  ·  &ldquo;{input}&rdquo;</StepEyebrow>
        <h1 style={titleStyle}>
          {t("어느 나라에서 태어났다면?", "Born elsewhere…")}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "rgba(31,27,22,0.45)",
            marginTop: 8,
            fontFamily: "var(--font-noto-sans-kr), sans-serif",
          }}
        >
          {t(
            `나는 ${originCountry.flag} ${originCountry.koName} 사람 · ${gender === "male" ? "남성" : "여성"}`,
            `I'm from ${originCountry.flag} ${originCountry.enName} · ${gender === "male" ? "Male" : "Female"}`,
          )}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
            marginTop: 28,
          }}
        >
          {visibleCountries.map((c) => (
            <CountryTile key={c.code} country={c} onClick={() => onCountryPick(c.code)} />
          ))}
        </div>

        <button type="button" onClick={onReset} style={{ ...secondaryButtonStyle, marginTop: 28 }}>
          ↺ {t("처음부터", "Start over")}
        </button>
      </div>
    );
  }

  // Detail view
  const others = visibleCountries.filter((c) => c.code !== selectedCountry);
  return (
    <div style={{ maxWidth: 520, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <StepEyebrow>RESULT  ·  &ldquo;{input}&rdquo;</StepEyebrow>
      </div>

      <BigCard
        profile={currentProfile}
        speaking={speakingCode === currentProfile.country.code}
        ttsAvailable={ttsAvailable}
        onSpeak={() => onSpeak(currentProfile.name.display, currentProfile.country.ttsLang, currentProfile.country.code)}
        locale={locale}
      />

      <div style={{ marginTop: 28 }}>
        <p
          style={{
            textAlign: "center",
            fontSize: 15,
            color: "rgba(31,27,22,0.55)",
            fontFamily: "var(--font-noto-sans-kr), sans-serif",
            marginBottom: 12,
          }}
        >
          {t("다른 나라도 궁금해요?", "Curious about other countries?")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
            gap: 8,
          }}
        >
          {others.map((c) => (
            <CountryTile
              key={c.code}
              country={c}
              compact
              onClick={() => onCountryPick(c.code)}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 28,
        }}
      >
        <button
          type="button"
          onClick={onShare}
          style={primaryButtonStyle}
        >
          {copiedKey === currentProfile.country.code
            ? t("✓ 복사됨", "COPIED")
            : t("공유하기", "SHARE")}
        </button>
        <button type="button" onClick={onBackToPicker} style={secondaryButtonStyle}>
          ← {t("나라 다시 고르기", "Pick another country")}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button
          type="button"
          onClick={onReset}
          style={{
            background: "transparent",
            color: "rgba(31,27,22,0.5)",
            border: "none",
            fontSize: 14,
            letterSpacing: "0.15em",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            padding: "8px 14px",
          }}
        >
          ↺ {t("처음부터", "Start over")}
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   Big result card
   ============================================================================ */

function BigCard({
  profile,
  speaking,
  ttsAvailable,
  onSpeak,
  locale = "ko",
}: {
  profile: Profile;
  speaking: boolean;
  ttsAvailable: boolean;
  onSpeak: () => void;
  locale?: "ko" | "en";
}): ReactElement {
  const { country, name, celebrity } = profile;
  const displayName = locale === "en" && name.displayEn ? name.displayEn : name.display;
  const reading = name.displayEn && name.displayEn !== name.display ? name.displayEn : name.pronunciation;
  const vibe = locale === "ko" ? name.vibeKo : name.vibeEn;
  const impression = locale === "ko" ? name.impressionKo : name.impressionEn;
  const place = locale === "ko" ? name.placeKo : name.placeEn;
  const shortProfile = locale === "ko" ? name.profileKo : name.profileEn;
  return (
    <div
      style={{
        background: country.bg,
        border: `1px solid ${RULE}`,
        borderRadius: 24,
        padding: "30px 26px 24px",
        boxShadow: "0 18px 36px rgba(31,27,22,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 32 }} aria-hidden>
          {country.flag}
        </span>
        <div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              letterSpacing: "0.22em",
              color: ACCENT,
              fontWeight: 700,
            }}
          >
            {country.enName.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "var(--font-noto-sans-kr), sans-serif",
              fontSize: 15,
              color: "rgba(31,27,22,0.55)",
              marginTop: 1,
            }}
          >
            {locale === "ko"
              ? `${country.koName}에서 태어났다면`
              : `If born in ${country.enName}`}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            fontFamily: "var(--font-noto-serif-kr), serif",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.05,
            color: INK,
            letterSpacing: "-0.02em",
            wordBreak: "keep-all",
            flex: 1,
            minWidth: 0,
          }}
        >
          {displayName}
        </div>
        {ttsAvailable && (
          <button
            type="button"
            onClick={onSpeak}
            aria-label={speaking ? "Stop pronunciation" : "Play pronunciation"}
            title={speaking ? "Stop" : "Play"}
            style={{
              flexShrink: 0,
              background: speaking ? ACCENT : "rgba(31,27,22,0.06)",
              color: speaking ? "#fff" : INK,
              border: "none",
              borderRadius: "50%",
              width: 42,
              height: 42,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              cursor: "pointer",
              touchAction: "manipulation",
              transition: "background 0.2s ease, color 0.2s ease, transform 0.2s ease",
              transform: speaking ? "scale(1.06)" : "scale(1)",
              marginTop: 6,
            }}
          >
            {speaking ? "⏸" : "🔊"}
          </button>
        )}
      </div>

      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          color: "rgba(31,27,22,0.55)",
          letterSpacing: "0.04em",
          marginTop: -6,
        }}
      >
        &ldquo;{reading}&rdquo;
      </div>

      <div
        style={{
          fontFamily: "var(--font-noto-sans-kr), sans-serif",
          fontSize: 15,
          color: "rgba(31,27,22,0.8)",
          lineHeight: 1.75,
          paddingTop: 10,
          borderTop: `1px dashed ${RULE}`,
          display: "grid",
          gap: 12,
        }}
      >
        <ProfileRow
          label={locale === "ko" ? "이름 분위기" : "Name vibe"}
          value={vibe ?? ""}
        />
        <ProfileRow
          label={locale === "ko" ? "현지 첫인상" : "First impression"}
          value={impression ?? ""}
        />
        <ProfileRow
          label={locale === "ko" ? "어울리는 도시" : "Fitting city"}
          value={place ?? ""}
        />
        <ProfileRow
          label={locale === "ko" ? "짧은 프로필" : "Short profile"}
          value={shortProfile ?? ""}
        />
      </div>

      <div
        style={{
          paddingTop: 10,
          borderTop: `1px dashed ${RULE}`,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            letterSpacing: "0.22em",
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          ⭐ DOPPELGÄNGER
        </div>
        <div
          style={{
            fontFamily: "var(--font-noto-sans-kr), sans-serif",
            fontSize: 16,
            color: INK,
            lineHeight: 1.55,
          }}
        >
          <span style={{ fontWeight: 700 }}>{celebrity.name}</span>
          <span style={{ color: "rgba(31,27,22,0.55)", marginLeft: 6, fontSize: 14 }}>
            · {celebrity.role}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Small UI helpers
   ============================================================================ */

function ProfileRow({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          letterSpacing: "0.18em",
          color: ACCENT,
          fontWeight: 800,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "rgba(31,27,22,0.82)",
          wordBreak: "keep-all",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const titleStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
  marginBottom: 8,
  marginTop: 12,
  fontFamily: "var(--font-noto-serif-kr), serif",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 17,
  color: "rgba(31,27,22,0.62)",
  fontFamily: "var(--font-noto-sans-kr), sans-serif",
};

const primaryButtonStyle: React.CSSProperties = {
  background: ACCENT,
  color: "#fff",
  border: "none",
  padding: "16px 32px",
  borderRadius: 999,
  fontSize: 17,
  fontWeight: 700,
  letterSpacing: "0.18em",
  cursor: "pointer",
  touchAction: "manipulation",
  boxShadow: "0 8px 24px rgba(255,59,48,0.25)",
  fontFamily: "'Inter', sans-serif",
};

const secondaryButtonStyle: React.CSSProperties = {
  background: "transparent",
  color: INK,
  border: `1px solid ${RULE}`,
  padding: "16px 32px",
  borderRadius: 999,
  fontSize: 17,
  fontWeight: 600,
  letterSpacing: "0.18em",
  cursor: "pointer",
  touchAction: "manipulation",
  fontFamily: "'Inter', sans-serif",
};

function StepEyebrow({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <div
      style={{
        color: ACCENT,
        fontSize: 13,
        letterSpacing: "0.28em",
        fontWeight: 700,
        marginBottom: 10,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function ChoiceTile({
  emoji,
  en,
  ko,
  onClick,
}: {
  emoji: string;
  en: string;
  ko: string;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#fffdf7",
        color: INK,
        border: `1px solid ${RULE}`,
        borderRadius: 16,
        padding: "26px 18px",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        touchAction: "manipulation",
        fontFamily: "var(--font-noto-sans-kr), sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = ACCENT;
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(255,59,48,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = RULE;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: 44 }} aria-hidden>
        {emoji}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 17,
            letterSpacing: "0.18em",
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          {en.toUpperCase()}
        </span>
        <span style={{ fontSize: 17, color: "rgba(31,27,22,0.7)", fontWeight: 500 }}>{ko}</span>
      </div>
    </button>
  );
}

function CountryTile({
  country,
  onClick,
  compact = false,
}: {
  country: Country;
  onClick: () => void;
  compact?: boolean;
}): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: country.bg,
        color: INK,
        border: `1px solid ${RULE}`,
        borderRadius: 14,
        padding: compact ? "12px 10px" : "18px 14px",
        cursor: "pointer",
        touchAction: "manipulation",
        fontFamily: "var(--font-noto-sans-kr), sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: compact ? 4 : 8,
        transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = ACCENT;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(31,27,22,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = RULE;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: compact ? 22 : 32 }} aria-hidden>
        {country.flag}
      </span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: compact ? 10 : 11,
            letterSpacing: "0.18em",
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          {country.enName.toUpperCase()}
        </span>
        <span style={{ fontSize: compact ? 11 : 13, color: "rgba(31,27,22,0.65)" }}>
          {country.koName}
        </span>
      </div>
    </button>
  );
}
