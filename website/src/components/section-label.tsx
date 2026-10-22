import { cn } from "@/lib/utils"

/** Editorial index label, e.g. "(02) / What's inside". */
export function SectionLabel({ index, children, className }: { index: string; children: string; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground", className)}>
      <span className="text-primary">({index})</span>
      <span className="h-px w-8 bg-white/20" />
      {children}
    </p>
  )
}
