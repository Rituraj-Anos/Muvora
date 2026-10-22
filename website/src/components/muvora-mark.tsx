import { cn } from "@/lib/utils"

/** The Muvora mark: a rounded "M" between two pairs of equalizer bars. */
export function MuvoraMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="270 290 485 240"
      className={cn("h-6 w-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g fill="currentColor">
        <rect x="285" y="415" width="30" height="40" rx="15" />
        <rect x="345" y="380" width="30" height="110" rx="15" />
        <rect x="650" y="380" width="30" height="110" rx="15" />
        <rect x="710" y="415" width="30" height="40" rx="15" />
      </g>
      <path
        d="M400 500V320L512 455L625 320V500"
        fill="none"
        stroke="currentColor"
        strokeWidth="60"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <MuvoraMark className="h-5 text-primary" />
      <span className="text-[19px] font-bold lowercase tracking-[-0.04em]">muvora</span>
    </span>
  )
}
