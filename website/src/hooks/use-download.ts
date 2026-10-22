import { useCallback, useEffect, useRef, useState } from "react"
import type { DownloadStatus } from "@/components/ui/button-download"

/** Starts a real browser download without leaving the page. */
function triggerDownload(url: string) {
  const a = document.createElement("a")
  a.href = url
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/**
 * Drives DownloadButton for a real file. The APK is served by GitHub on another
 * origin, so its true byte progress isn't readable from the page; the bar shows
 * a short "starting" phase while the browser's own download takes over.
 */
export function useDownload(url: string) {
  const [status, setStatus] = useState<DownloadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const statusRef = useRef<DownloadStatus>("idle")
  const timers = useRef<number[]>([])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const start = useCallback(() => {
    if (statusRef.current !== "idle") return
    triggerDownload(url)
    setStatus("downloading")
    setProgress(0)
    const steps = 20
    for (let i = 1; i <= steps; i++) {
      later(() => setProgress(Math.round((i / steps) * 100)), i * 60)
    }
    later(() => setStatus("downloaded"), steps * 60 + 150)
    later(() => setStatus("complete"), steps * 60 + 2800)
    later(() => {
      setStatus("idle")
      setProgress(0)
    }, steps * 60 + 2900)
  }, [url])

  return { status, progress, start }
}
