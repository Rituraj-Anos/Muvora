const WORDS = [
  "Stream",
  "Download",
  "Synced lyrics",
  "Crossfade",
  "Gapless",
  "Equalizer",
  "Local files",
  "Sleep timer",
  "Spotify import",
  "Dynamic colour",
]

export function Marquee() {
  // Two identical halves; the track slides by -50% for a seamless loop.
  const row = [...WORDS, ...WORDS]
  return (
    <div aria-hidden className="mt-2.5 overflow-hidden bg-primary py-3.5 text-primary-foreground sm:mt-4">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {row.map((word, i) => (
          <span key={i} className="flex items-center text-[clamp(1.25rem,2.4vw,2rem)] font-extrabold uppercase tracking-[-0.04em]">
            <span className="px-6">{word}</span>
            <span className="h-2 w-2 rotate-45 bg-primary-foreground" />
          </span>
        ))}
      </div>
    </div>
  )
}
