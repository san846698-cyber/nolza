# nolza.fun

Short, mobile-friendly interactive web games built with Next.js App Router.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Vercel-compatible runtime

## Local Development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```powershell
npm run typecheck
npm run lint
npm run build
```

On Windows PowerShell, use `npm.cmd` if the local execution policy blocks `npm.ps1`.

## Environment

Copy `.env.example` to `.env.local` when configuring production-like metadata or ads.

- `NEXT_PUBLIC_SITE_URL`: canonical production URL, defaults to `https://nolza.fun`
- `NEXT_PUBLIC_ADSENSE_CLIENT`: AdSense publisher id
- `NEXT_PUBLIC_ADSENSE_SLOT_TOP`: top ad slot id
- `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM`: bottom ad slot id
- `NEXT_PUBLIC_ADSENSE_SLOT_MOBILE`: mobile sticky ad slot id

All listed variables are intentionally public because they are used by client-rendered ad components or public metadata.

## Deployment Notes

- Vercel is the recommended target for the current Next.js setup.
- Ensure the build environment can reach Google Fonts, because `next/font/google` fetches font CSS during production builds.
- Set `NEXT_PUBLIC_SITE_URL=https://nolza.fun` before production deploys so canonical metadata and share previews use the correct host.
