import { useRef } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { useHeroProgress } from "@/hooks/use-hero-progress"
import DownloadButton from "@/components/ui/button-download"
import { Wordmark } from "@/components/muvora-mark"
import { APK, FALLBACK_VERSION, IMAGES, MIN_ANDROID, REPO_URL, apkUrl } from "@/config"
import { useDownload } from "@/hooks/use-download"
import type { ReleaseInfo } from "@/hooks/use-latest-release"
import { formatSize } from "@/lib/utils"

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#download", label: "Install" },
  { href: "#legal", label: "Legal" },
]

// Three guides on a four-column grid: the last quarter belongs to the headline and "RA".
const COLUMNS = [
  { n: "001", label: "Stream" },
  { n: "002", label: "Offline" },
  { n: "003", label: "Lyrics" },
]

const CAPABILITIES = [
  "Stream YouTube Music",
  "Your local files",
  "Offline downloads",
  "Word-synced lyrics",
  "Free & open source",
]

export function Hero({ release }: { release: ReleaseInfo | null }) {
  const sectionRef = useRef<HTMLElement>(null)
  useHeroProgress(sectionRef)
  const { status, progress, start } = useDownload(apkUrl("arm64"))
  const version = release?.version ?? FALLBACK_VERSION
  const size = formatSize(release?.sizes[APK.arm64])

  return (
    <section id="top" ref={sectionRef} className="px-2.5 pt-2.5 sm:px-4 sm:pt-4">
      <div className="grain relative isolate flex min-h-[min(calc(100svh-1.25rem),58rem)] flex-col overflow-hidden rounded-[22px] border border-white/10 bg-black sm:min-h-[min(calc(100svh-2rem),62rem)] sm:rounded-[28px]">
        {/* Photograph, grayscale, pushed right like an editorial cover */}
        <picture className="absolute inset-0 -z-10 overflow-hidden">
          <source media="(min-width: 900px)" srcSet={IMAGES.hero} />
          <img
            src={IMAGES.heroSmall}
            alt=""
            fetchPriority="high"
            className="hero-photo ml-auto h-full w-full object-cover object-[58%_28%] brightness-[0.72] contrast-125 grayscale md:w-[70%] md:object-[68%_center] md:brightness-[0.62] md:[mask-image:linear-gradient(to_right,transparent,black_40%)]"
          />
        </picture>
        {/* Phones: light veil so the figure reads; desktop: heavy left fade under the type */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/25 to-black/10 md:from-black md:via-black/30 md:to-black/0" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-black/60 md:via-black/10 md:to-black/70" />

        {/* Hairline guide columns */}
        <div aria-hidden className="pointer-events-none absolute inset-x-8 top-[33%] bottom-[24%] -z-10 hidden grid-cols-4 lg:grid">
          {COLUMNS.map((c) => (
            <div key={c.n} className="relative border-l border-white/[0.09]">
              <span className="absolute bottom-0 left-2 flex flex-col gap-1 font-mono text-[9px] uppercase tracking-widest text-white/40">
                <span>
                  {c.n} Phase<span className="text-primary">/{c.label}</span>
                </span>
                <span className="h-[3px] w-3 bg-primary" />
              </span>
            </div>
          ))}
        </div>

        {/* Nav */}
        <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7">
          <a href="#top" aria-label="Muvora home">
            <Wordmark />
          </a>
          <nav aria-label="Primary" className="flex items-center gap-6">
            <ul className="hidden items-center gap-6 sm:flex">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/80 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80 transition-colors hover:text-primary"
                >
                  GitHub <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
            <a
              href="#download"
              className="rounded-full border border-primary/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-black sm:hidden"
            >
              Get APK
            </a>
          </nav>
        </header>

        {/* Giant wordmark + headline */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 pt-6 sm:px-7 lg:pt-4">
          {/* Phones size the type to the screen width so the staircase fills it;
              the trailing pr compensates negative tracking so "RA" never clips. */}
          <h1 className="hero-parallax-slow relative font-extrabold uppercase leading-[0.8] tracking-[-0.075em] text-primary text-[31vw] sm:text-[27vw] lg:text-[clamp(5.4rem,21vw,19rem)]">
            <span className="sr-only">Muvora, a music player for Android</span>
            <span aria-hidden className="rise-mask">
              <span className="rise">Mu</span>
            </span>
            <span aria-hidden className="rise-mask pl-[0.78em] lg:pl-[1.55em]">
              <span className="rise" style={{ animationDelay: "90ms" }}>vo</span>
            </span>
            <span aria-hidden className="rise-mask pr-[0.1em] text-right lg:pr-[0.15em]">
              <span className="rise" style={{ animationDelay: "180ms" }}>ra</span>
            </span>
          </h1>

          <div
            className="hero-parallax-fast fade-in mt-9 max-w-[34rem] lg:absolute lg:right-8 lg:top-2 lg:mt-0"
            style={{ animationDelay: "420ms" }}
          >
            <p className="text-[clamp(2.3rem,10.5vw,3.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.045em] lg:text-[clamp(2rem,4.2vw,3.6rem)]">
              <span className="block text-primary">Music,</span>
              <span className="block text-white">without the</span>
              <span className="block text-primary">noise.</span>
            </p>
            <div className="mt-4 border-l-[3px] border-primary pl-3">
              <p className="text-sm font-extrabold uppercase tracking-tight text-primary">Muvora for Android</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                A free, open-source music player
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="fade-in relative z-10 grid gap-9 px-5 pb-6 pt-10 sm:px-8 sm:pb-8 lg:grid-cols-[1fr_auto] lg:items-end"
          style={{ animationDelay: "600ms" }}
        >
          <div className="flex gap-4">
            <div className="flex flex-col font-mono text-[10px] uppercase tracking-widest">
              <span className="text-white/50">Build</span>
              <span className="text-primary">v{version}</span>
            </div>
            <ul className="border-l border-white/25 pl-4 text-[13px] font-extrabold uppercase leading-[1.35] tracking-tight text-white sm:text-[15px]">
              {CAPABILITIES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="order-first flex flex-col items-stretch gap-3 sm:items-start lg:order-none lg:items-end">
            <DownloadButton
              downloadStatus={status}
              progress={progress}
              onClick={start}
              idleLabel="Download APK"
              workingLabel="Starting"
              doneLabel="Check downloads"
              className="h-14 w-full rounded-2xl text-[15px] font-bold shadow-[0_18px_50px_-15px_rgba(200,255,61,0.6)] transition-shadow duration-300 hover:shadow-[0_22px_60px_-12px_rgba(200,255,61,0.75)] sm:w-60"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              {MIN_ANDROID} · arm64{size ? ` · ${size}` : ""}
              <span className="hidden sm:inline"> · always the latest build</span>
            </p>
            <a
              href="#download"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Other builds & install guide <ArrowDown className="h-3 w-3" />
            </a>
          </div>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {status === "downloading" ? "Download starting" : status === "downloaded" ? "Download started. Check your downloads." : ""}
        </p>
      </div>
    </section>
  )
}
