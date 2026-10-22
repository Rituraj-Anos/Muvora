import { useEffect, useState } from "react"
import { REPO } from "@/config"

export interface ReleaseInfo {
  version: string
  publishedAt: string
  url: string
  /** Asset name -> size in bytes. */
  sizes: Record<string, number>
}

interface GithubRelease {
  tag_name?: unknown
  published_at?: unknown
  html_url?: unknown
  assets?: unknown
}

const CACHE_KEY = "muvora:latest-release"

function readCache(): ReleaseInfo | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as ReleaseInfo) : null
  } catch {
    return null
  }
}

function parse(data: GithubRelease): ReleaseInfo | null {
  if (typeof data.tag_name !== "string") return null
  const sizes: Record<string, number> = {}
  if (Array.isArray(data.assets)) {
    for (const asset of data.assets) {
      if (asset && typeof asset.name === "string" && typeof asset.size === "number") {
        sizes[asset.name] = asset.size
      }
    }
  }
  return {
    version: data.tag_name.replace(/^v/, ""),
    publishedAt: typeof data.published_at === "string" ? data.published_at : "",
    url: typeof data.html_url === "string" ? data.html_url : "",
    sizes,
  }
}

/** Newest GitHub release, or null if there is none yet or the API is unreachable. */
export function useLatestRelease() {
  const [info, setInfo] = useState<ReleaseInfo | null>(readCache)

  useEffect(() => {
    if (info) return
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? (res.json() as Promise<GithubRelease>) : null))
      .then((data) => {
        const next = data && parse(data)
        if (!next) return
        setInfo(next)
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next))
        } catch {
          /* storage disabled: fine, just refetch next visit */
        }
      })
      .catch(() => {
        /* offline or rate-limited: the page falls back to static copy */
      })
    return () => controller.abort()
  }, [info])

  return info
}
