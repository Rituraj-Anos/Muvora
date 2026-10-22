"use client"

import type { ReactNode } from "react"
import { Download, Loader2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type DownloadStatus = "idle" | "downloading" | "downloaded" | "complete"

interface DownloadButtonProps {
  downloadStatus: DownloadStatus
  progress: number
  onClick: () => void
  className?: string
  /** Optional overrides; without them the button behaves exactly like the original. */
  idleLabel?: ReactNode
  /** Shown instead of "{progress}%" while working, when the real progress is unknown. */
  workingLabel?: string
  doneLabel?: string
}

export default function DownloadButton({
  downloadStatus,
  progress,
  onClick,
  className,
  idleLabel = "Download",
  workingLabel,
  doneLabel = "Downloaded",
}: DownloadButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-disabled={downloadStatus !== "idle"}
      className={cn(
        "rounded-xl w-40 gap-2 relative overflow-hidden select-none",
        downloadStatus === "downloading" && "bg-primary/50 hover:bg-primary/50",
        downloadStatus !== "idle" && "pointer-events-none",
        className,
      )}
    >
      {downloadStatus === "idle" && (
        <>
          <Download className="h-4 w-4" />
          {idleLabel}
        </>
      )}
      {downloadStatus === "downloading" && (
        <div className="z-[5] flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {workingLabel ?? `${progress}%`}
        </div>
      )}
      {downloadStatus === "downloaded" && (
        <>
          <CheckCircle className="h-4 w-4" />
          <span>{doneLabel}</span>
        </>
      )}
      {downloadStatus === "complete" && <span className="text-primary">{idleLabel}</span>}
      {downloadStatus === "downloading" && (
        <div
          className="absolute bottom-0 z-[3] h-full left-0 bg-primary inset-0 transition-all duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      )}
    </Button>
  )
}
