/**
 * Streams a release APK from this origin instead of redirecting to GitHub's
 * CDN.
 *
 * Why: Chrome on Android runs its Safe Browsing / "verify" step on a finished
 * APK download, and a brand-new app fetched via a redirect to
 * release-assets.githubusercontent.com often gets blocked right at 100% with
 * "failed". Served as an ordinary same-origin file from muvora.pages.dev, the
 * download looks normal and completes. The bytes still come from GitHub
 * Releases (always the latest), so nothing needs re-uploading per version.
 *
 * Route: /dl/<asset-name>.apk  ->  releases/latest/download/<asset-name>.apk
 */

const REPO = "Rituraj-Anos/Muvora"

// Only these exact names are proxied, so the route can't be used as an open
// relay to fetch arbitrary files.
const ALLOWED = new Set([
  "Muvora-arm64-v8a.apk",
  "Muvora-armeabi-v7a.apk",
  "Muvora-universal.apk",
])

export const onRequestGet: PagesFunction = async ({ params }) => {
  const name = String(params.name ?? "")
  if (!ALLOWED.has(name)) {
    return new Response("Not found", { status: 404 })
  }

  const upstream = `https://github.com/${REPO}/releases/latest/download/${name}`
  const res = await fetch(upstream, { redirect: "follow" })
  if (!res.ok || !res.body) {
    return new Response("Upstream unavailable", { status: 502 })
  }

  const headers = new Headers()
  headers.set("Content-Type", "application/vnd.android.package-archive")
  headers.set("Content-Disposition", `attachment; filename="${name}"`)
  const len = res.headers.get("content-length")
  if (len) headers.set("Content-Length", len)
  headers.set("Accept-Ranges", "bytes")
  // Let the browser/CDN cache the binary briefly; "latest" changes rarely.
  headers.set("Cache-Control", "public, max-age=900")
  headers.set("X-Content-Type-Options", "nosniff")

  return new Response(res.body, { status: 200, headers })
}
