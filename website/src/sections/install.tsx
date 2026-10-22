import { ArrowUpRight, BellRing, Cpu, Download, Smartphone } from "lucide-react"
import { DownloadShowcase, type DownloadCardProps } from "@/components/ui/download-options-section"
import { MiniPhone } from "@/components/phone-mockup"
import { MuvoraMark } from "@/components/muvora-mark"
import { SectionLabel } from "@/components/section-label"
import { APK, FALLBACK_VERSION, FIREBASE_INVITE_URL, IMAGES, MIN_ANDROID, RELEASES_URL, apkUrl } from "@/config"
import type { ReleaseInfo } from "@/hooks/use-latest-release"
import { formatDate, formatSize } from "@/lib/utils"

const STEPS = [
  { title: "Download", body: "Grab the APK above. Most phones want the arm64 build." },
  {
    title: "Allow & install",
    body: "Open the file. Android asks once to allow installs from your browser or Files app.",
  },
  { title: "Press play", body: "Open Muvora, sign in with Google for your library, or skip and just search." },
]

function UpdatesMockup() {
  return (
    <div className="w-full max-w-[190px] rounded-2xl border border-white/15 bg-black/80 p-3 shadow-[0_30px_80px_-40px_rgba(200,255,61,0.5)] backdrop-blur">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#050505] ring-1 ring-white/10">
          <MuvoraMark className="h-3 text-primary" />
        </span>
        <div className="min-w-0 text-left">
          <p className="truncate text-[11px] font-bold text-white">New Muvora build</p>
          <p className="truncate text-[10px] text-white/50">Tap to install the update</p>
        </div>
      </div>
      <div className="mt-3 h-[3px] w-full rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-primary" />
      </div>
    </div>
  )
}

export function Install({ release }: { release: ReleaseInfo | null }) {
  const version = release?.version ?? FALLBACK_VERSION
  const date = formatDate(release?.publishedAt)
  const meta = (name: string) =>
    [`v${version}`, formatSize(release?.sizes[name]), date].filter(Boolean).join(" · ")

  const options: DownloadCardProps[] = [
    {
      title: "Most phones",
      badge: "Recommended",
      description: "The arm64 build. Right for nearly every phone from the last several years.",
      lightImage: IMAGES.decks,
      darkImage: IMAGES.decks,
      mockup: <MiniPhone scale={0.46} />,
      buttons: [
        { text: "Download arm64 APK", icon: <Download className="h-4 w-4" />, variant: "default", href: apkUrl("arm64") },
      ],
      meta: meta(APK.arm64),
    },
    {
      title: "Any device",
      description: "The universal build runs on every CPU. Use it if the first one won't install.",
      lightImage: IMAGES.crowd,
      darkImage: IMAGES.crowd,
      mockup: (
        <div className="flex items-end gap-2">
          <MiniPhone scale={0.38} className="opacity-60" />
          <Cpu className="mb-6 h-10 w-10 text-primary" strokeWidth={1.25} />
        </div>
      ),
      buttons: [
        { text: "Download universal APK", icon: <Smartphone className="h-4 w-4" />, href: apkUrl("universal") },
      ],
      meta: meta(APK.universal),
    },
    {
      title: "Auto-updates",
      description: "Join as a tester and get a notification on your phone each time a new build ships.",
      lightImage: IMAGES.lasers,
      darkImage: IMAGES.lasers,
      mockup: <UpdatesMockup />,
      buttons: FIREBASE_INVITE_URL
        ? [{ text: "Join the testers", icon: <BellRing className="h-4 w-4" />, href: FIREBASE_INVITE_URL, external: true }]
        : [{ text: "Invite link coming soon", icon: <BellRing className="h-4 w-4" />, disabled: true }],
      meta: "Delivered through Firebase App Distribution",
    },
  ]

  return (
    <section id="download" className="scroll-mt-6 border-t border-white/10">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <DownloadShowcase
          heading={
            <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel index="03">Install</SectionLabel>
                <h2 className="mt-6 max-w-[14ch] text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
                  Pick a build. <span className="text-primary">Play in a minute.</span>
                </h2>
              </div>
              <p className="max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground">
                Every button here always points at the newest release. No app store, no account
                required, {MIN_ANDROID}.
              </p>
            </div>
          }
          options={options}
          footer={
            <div className="w-full">
              <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="bg-background p-6 sm:p-8">
                    <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 text-xl font-extrabold uppercase tracking-[-0.03em]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>Updating? Install the new APK over the old one. Your library stays.</p>
                <a
                  href={RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  All releases & changelogs <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          }
        />
      </div>
    </section>
  )
}
