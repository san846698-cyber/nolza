LCK 프로게이머 성향 테스트 (역대 올타임 25인) — 선수 사진 폴더
===============================================================

이 폴더에 선수 사진 25장을 아래 파일명(소문자, .jpg)으로 넣으면 결과 화면에 표시됩니다.
파일명은 lib/playstyle/lck.ts 의 선수 키(GRID 값)와 1:1로 일치해야 합니다.

[탑]    khan.jpg     kiin.jpg     marin.jpg    smeb.jpg     zeus.jpg
[정글]  canyon.jpg   score.jpg    ambition.jpg peanut.jpg   bengi.jpg
[미드]  chovy.jpg    faker.jpg    pawn.jpg     zeka.jpg     showmaker.jpg
[원딜]  imp.jpg      ruler.jpg    bang.jpg     deft.jpg     pray.jpg
[서폿]  madlife.jpg  corejj.jpg   keria.jpg    mata.jpg     wolf.jpg

권장: 경기/방송 현장 컷(개인 사진 X). 은퇴 선수가 다수이므로 현역 시절 경기 컷 권장.
세로 비율(4:5 근처)이 결과 포스터에 가장 잘 맞음.

폴백 순서 (lib/playstyle/lck.ts):
1) /images/tests/lck/players/{key}.jpg   ← 이 폴더 (실제 사진)
2) /images/tests/lck/champ/{key}.jpg     ← 보험: 시그니처 챔프 아트(있으면)
3) 텍스트 카드 (선수명 + 포지션·스타일)  ← 둘 다 없으면 자동

전부 내리기(통보 시): lib/playstyle/lck.ts 에서  export const LCK_USE_PHOTOS = false;  로 바꾸면
모든 사진이 즉시 꺼지고 챔프 아트 → 텍스트 카드로 폴백됩니다. (재배포 필요)

사진 교체(같은 파일명 overwrite) 시: 프로덕션은 배포마다 새 빌드라 이미지 캐시가 자동 재생성됩니다(쿼리 캐시버스터 불필요).
로컬에서 옛 사진이 보이면  .next/cache/images  폴더 삭제 + 하드리프레시(Ctrl+Shift+R).
(주의: next/image 로컬 이미지에 ?v= 쿼리를 붙이면 next.config 의 images.localPatterns 설정 없이는 런타임 에러가 납니다.)

표지/저작권: 공식 LCK 로고 미사용(자체 폰트 텍스트 "LCK" + 블루/골드 오리지널 그래픽).
고지문: "비공식 팬 콘텐츠이며, 해당 선수·구단·리그와 무관합니다."
