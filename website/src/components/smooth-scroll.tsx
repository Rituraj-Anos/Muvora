import { useEffect, useState, type ReactNode } from "react"
import { ReactLenis } from "lenis/react"
import "lenis/dist/lenis.css"

function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)"
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return reduced
}

/**
 * Lenis smooth scrolling for the whole page.
 *
 * Wheel/trackpad input is smoothed. Touch keeps the phone's native momentum
 * (syncTouch: false) because emulated touch scrolling feels laggy on Android.
 * Anchor links (#download etc.) glide through Lenis. People who ask the OS for
 * reduced motion get plain native scrolling.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <>{children}</>
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
        anchors: { duration: 1.4 },
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
