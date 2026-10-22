import { ArrowUp } from "lucide-react"
import { Wordmark } from "@/components/muvora-mark"
import { DMCA_URL, LICENSE_URL, REPO_URL, UPSTREAM_URL } from "@/config"

const LINKS = [
  { href: REPO_URL, label: "Source" },
  { href: `${REPO_URL}/releases`, label: "Releases" },
  { href: DMCA_URL, label: "DMCA" },
  { href: LICENSE_URL, label: "GPLv3" },
  { href: UPSTREAM_URL, label: "BitChord" },
]

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-white/10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 pt-14 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            An independent, non-commercial music player for Android. Not affiliated with YouTube or
            Google. All music belongs to its respective owners.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#top"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
              >
                Top <ArrowUp className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1400px] justify-between px-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 sm:px-8">
        <span>© {new Date().getFullYear()} Muvora</span>
        <span>Made for listening</span>
      </div>

      <p
        aria-hidden
        className="mt-4 select-none text-center font-extrabold uppercase leading-[0.74] tracking-[-0.08em] text-primary text-[clamp(4.5rem,23vw,22rem)] translate-y-[8%]"
      >
        Muvora
      </p>
    </footer>
  )
}
