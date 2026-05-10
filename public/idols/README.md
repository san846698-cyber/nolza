# Idol photos for /games/bias

Place idol portrait images here, named `{group}-{en}.jpg` (matching the Idol `id` in `app/games/bias/page.tsx`).

Examples:
- `BTS-RM.jpg`
- `BTS-Jin.jpg`
- `BLACKPINK-Jisoo.jpg`
- `Stray-Kids-Bang-Chan.jpg`  (spaces in group/name become hyphens)

The bias tournament UI tries to load `/idols/{id}.jpg` for each matchup. If the file is missing, the card falls back to a colored gradient with the idol's initial — so adding photos is optional and incremental.

Recommended:
- Aspect ratio: portrait or square. The image is rendered with `object-fit: cover`.
- Resolution: at least 800×1200 for sharp display on retina screens.
- Format: JPG (smaller) or PNG.
- Source: Wikipedia Commons works well for Creative Commons photos. Always check the license before redistributing.
