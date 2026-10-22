import { useEffect, type RefObject } from "react"

/**
 * Writes --hero-p (0 -> 1 as the element scrolls out of view) onto the element.
 * A rAF-throttled native scroll listener: Lenis scrolls the real window, and
 * touch scrolling stays native, so this one source works for every input.
 */
export function useHeroProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const h = el.offsetHeight || 1
      const p = Math.min(1, Math.max(0, window.scrollY / h))
      el.style.setProperty("--hero-p", p.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref])
}
