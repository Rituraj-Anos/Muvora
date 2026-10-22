import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionLabel } from "@/components/section-label"
import { DMCA_URL, ISSUES_URL, LICENSE_URL, REPO_URL, UPSTREAM_URL } from "@/config"

const POINTS = [
  {
    title: "Muvora hosts nothing",
    body: "No audio is stored on or served from this website, the source repository or any Muvora release. Streams come straight from third-party services, at your request.",
  },
  {
    title: "The content isn't ours",
    body: "Every song, album cover, lyric and video belongs to its artists, labels and rights holders. Muvora claims no ownership of any of it.",
  },
  {
    title: "Not affiliated",
    body: "Muvora is not affiliated with, endorsed by or connected to YouTube, Google, Spotify or any other service it can talk to. Their names and marks belong to their owners.",
  },
  {
    title: "Personal use",
    body: "Built for personal, educational and fair-use listening. You're responsible for following your local copyright law and the terms of any service you connect.",
  },
  {
    title: "DMCA & takedowns",
    body: "If you believe something in this repository or its releases infringes your rights, send a notice as described in the DMCA policy and it will be handled promptly.",
  },
  {
    title: "Open source, GPLv3",
    body: "Muvora is a fork of BitChord by kushagrasinghx, released under the GNU GPL v3. The full source is public, as the licence requires.",
  },
]

export function Legal() {
  return (
    <section id="legal" className="scroll-mt-6 border-t border-white/10">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="04">Legal</SectionLabel>
          <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            The fine print, <span className="text-muted-foreground">in plain words.</span>
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild className="rounded-xl font-semibold">
              <a href={DMCA_URL} target="_blank" rel="noopener noreferrer">
                DMCA policy <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-xl font-semibold">
              <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
                Contact <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {POINTS.map((p, i) => (
            <div key={p.title} className="border-t border-white/10 py-7">
              <dt className="flex items-baseline gap-3 text-lg font-extrabold uppercase tracking-[-0.03em]">
                <span className="font-mono text-[11px] font-normal text-primary">{String(i + 1).padStart(2, "0")}</span>
                {p.title}
              </dt>
              <dd className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="sr-only">
        Source code: {REPO_URL}. Upstream project: {UPSTREAM_URL}. Licence: {LICENSE_URL}.
      </p>
    </section>
  )
}
