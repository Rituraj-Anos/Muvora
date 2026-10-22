import { Compass, Home, Library, Pause, Search, SkipBack, SkipForward } from "lucide-react"
import { IMAGES } from "@/config"
import { cn } from "@/lib/utils"

/**
 * A drawn (not screenshotted) now-playing screen. Pure CSS, so it stays crisp
 * at any size and never goes stale against the real app.
 */
/** The full mockup laid out at 200px wide, then scaled, so small copies keep their proportions. */
export function MiniPhone({ scale = 0.45, className }: { scale?: number; className?: string }) {
  const width = 200
  const height = Math.round((width * 19) / 9)
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: width * scale, height: height * scale }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width, transform: `scale(${scale})` }}>
        <PhoneMockup />
      </div>
    </div>
  )
}

export function PhoneMockup({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-[9/19] w-full rounded-[2.4rem] border border-white/15 bg-[#0d0d0d] p-[7px] shadow-[0_50px_120px_-50px_rgba(200,255,61,0.45)]",
        className,
      )}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] bg-black">
        {/* status bar + camera */}
        <div className="flex items-center justify-between px-6 pt-3 font-mono text-[9px] text-white/70">
          <span>9:41</span>
          <span className="h-[14px] w-[14px] rounded-full bg-[#111] ring-1 ring-white/10" />
          <span>100%</span>
        </div>

        <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.25em] text-white/45">
          Playing from Liked songs
        </p>

        {/* artwork: grayscale photo multiplied over lime = brand duotone */}
        <div className="relative mx-5 mt-4 aspect-square overflow-hidden rounded-2xl bg-primary">
          <img
            src={IMAGES.mic}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover grayscale contrast-125 mix-blend-multiply"
          />
        </div>

        <div className="mx-5 mt-4">
          <p className="text-[15px] font-bold leading-tight tracking-tight text-white">Night Drive</p>
          <p className="text-[11px] text-white/50">Muvora Sessions</p>
        </div>

        <div className="mx-5 mt-3">
          <div className="h-[3px] w-full rounded-full bg-white/15">
            <div className="h-full w-[38%] rounded-full bg-primary" />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[8px] text-white/40">
            <span>1:24</span>
            <span>3:41</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-6 text-white">
          <SkipBack className="h-4 w-4 fill-current" />
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black">
            <Pause className="h-4 w-4 fill-current" />
          </span>
          <SkipForward className="h-4 w-4 fill-current" />
        </div>

        {!compact && (
          <div className="mx-5 mt-4 space-y-1 text-[11px] font-semibold leading-snug">
            <p className="text-white/30">we kept the radio low</p>
            <p className="text-[13px] text-white">and let the city hum</p>
            <p className="text-white/30">until the morning came</p>
          </div>
        )}

        {/* frosted bottom bar */}
        <div className="mt-auto mb-3 mx-3 flex items-center justify-around rounded-full border border-white/10 bg-white/[0.06] py-2.5 text-white/50 backdrop-blur">
          <Home className="h-3.5 w-3.5 text-primary" />
          <Compass className="h-3.5 w-3.5" />
          <Library className="h-3.5 w-3.5" />
          <Search className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  )
}
