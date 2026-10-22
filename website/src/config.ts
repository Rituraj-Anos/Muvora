export const REPO = "Rituraj-Anos/Muvora"
export const REPO_URL = `https://github.com/${REPO}`
export const RELEASES_URL = `${REPO_URL}/releases`
export const DMCA_URL = `${REPO_URL}/blob/main/DMCA.md`
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`
export const ISSUES_URL = `${REPO_URL}/issues`
export const UPSTREAM_URL = "https://github.com/kushagrasinghx/BitChord"

/**
 * Asset names the release script uploads. They never change between versions,
 * so GitHub's /releases/latest/download/<name> always serves the newest build
 * and this site never needs a redeploy to ship an update.
 */
export const APK = {
  arm64: "Muvora-arm64-v8a.apk",
  universal: "Muvora-universal.apk",
} as const

export type ApkKind = keyof typeof APK

export const apkUrl = (kind: ApkKind) => `${REPO_URL}/releases/latest/download/${APK[kind]}`

/** Empty until the Firebase tester invite link is set as a Pages env var. */
export const FIREBASE_INVITE_URL = (import.meta.env.VITE_FIREBASE_INVITE_URL ?? "").trim()

/** Shown before (or if) the GitHub API answers. */
export const FALLBACK_VERSION = "1.8.1"
export const MIN_ANDROID = "Android 8.0+"

/** Unsplash photography, all verified to resolve. */
const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export const IMAGES = {
  hero: unsplash("photo-1493225457124-a3eb161ffa5f", 1800),
  heroSmall: unsplash("photo-1493225457124-a3eb161ffa5f", 900),
  mic: unsplash("photo-1511671782779-c97d3d27a1d4", 600),
  decks: unsplash("photo-1470225620780-dba8ba36b745", 900),
  crowd: unsplash("photo-1459749411175-04bf5292ceea", 900),
  lasers: unsplash("photo-1514525253161-7a46d19cd819", 900),
}
