# Muvora website

Single-page site for Muvora. Vite + React + TypeScript + Tailwind v4, using the
shadcn/ui layout (`src/components/ui`, `@/` alias, `components.json`).

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build into dist/
```

## Deploy on Cloudflare Pages

Workers & Pages → Create → Pages → Connect to Git → `Rituraj-Anos/Muvora`:

| Setting | Value |
| --- | --- |
| Framework preset | None (or Vite) |
| Root directory | `website` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION` = `22` |
| Environment variable (optional) | `VITE_FIREBASE_INVITE_URL` = your Firebase tester invite link |

Every push to `main` redeploys the site.

## How downloads stay current

Download buttons point at
`https://github.com/Rituraj-Anos/Muvora/releases/latest/download/Muvora-arm64-v8a.apk`.
GitHub resolves `latest` to the newest release, so publishing a release with
`scripts/release.ps1` updates every button with no site redeploy. Short links
in `public/_redirects`: `/download`, `/download/universal`, `/dmca`, `/source`.

Version, size and date are read live from the GitHub API; if it's unreachable
the page falls back to static text.

## Where the shadcn components are

- `src/components/ui/button.tsx`: shadcn Button
- `src/components/ui/button-download.tsx`: animated download button
- `src/components/ui/download-options-section.tsx`: download cards

Keep new shadcn components in `src/components/ui` so `npx shadcn add ...` and
the `@/components/ui/*` imports line up.
