import { PhoneMockup } from "@/components/phone-mockup"
import { SectionLabel } from "@/components/section-label"

const FEATURES = [
  {
    title: "Stream",
    body: "Search and play the whole YouTube Music catalogue. Sign in to bring your library, mixes and recommendations.",
  },
  {
    title: "Offline",
    body: "Save tracks with cover art and tags embedded, then play them with no signal at all.",
  },
  {
    title: "Lyrics",
    body: "Word-by-word synced lyrics, pulled from a dozen providers so the right ones usually turn up.",
  },
  {
    title: "Sound",
    body: "Gapless playback, crossfade up to 12 seconds, a seven-band equalizer and speed control.",
  },
  {
    title: "Look",
    body: "Colours lifted from the artwork you're playing, under frosted, translucent bars.",
  },
  {
    title: "Yours",
    body: "Play the music already on your phone, import Spotify playlists, set a sleep timer.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1400px] scroll-mt-6 px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-10">
            <SectionLabel index="02">What's inside</SectionLabel>
            <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
              Everything a player should do.{" "}
              <span className="text-muted-foreground">Nothing it shouldn't.</span>
            </h2>
            <div className="mt-12 hidden w-60 lg:block">
              <PhoneMockup />
            </div>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {FEATURES.map((f, i) => (
            <li
              key={f.title}
              className="group grid grid-cols-[3rem_1fr] gap-x-4 border-t border-white/10 py-8 last:border-b sm:grid-cols-[4rem_12rem_1fr] sm:gap-x-6"
            >
              <span className="pt-1.5 font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-2xl font-extrabold uppercase tracking-[-0.04em] transition-colors duration-300 group-hover:text-primary sm:text-3xl">
                {f.title}
              </h3>
              <p className="col-start-2 mt-2 max-w-[44ch] text-[15px] leading-relaxed text-muted-foreground sm:col-start-3 sm:mt-1">
                {f.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
