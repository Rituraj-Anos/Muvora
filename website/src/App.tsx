import { SmoothScroll } from "@/components/smooth-scroll"
import { useLatestRelease } from "@/hooks/use-latest-release"
import { Hero } from "@/sections/hero"
import { Marquee } from "@/sections/marquee"
import { Features } from "@/sections/features"
import { Install } from "@/sections/install"
import { Legal } from "@/sections/legal"
import { Footer } from "@/sections/footer"

export default function App() {
  // Fetched once and shared, so the hero and the install cards agree.
  const release = useLatestRelease()

  return (
    <SmoothScroll>
      <a
        href="#download"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
      >
        Skip to download
      </a>
      <main>
        <Hero release={release} />
        <Marquee />
        <Features />
        <Install release={release} />
        <Legal />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
