import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Defines the props for a single button within a card
export interface CardButton {
  text: string
  icon?: React.ReactNode
  variant?: "default" | "secondary" | "ghost" | "outline" | "link"
  onClick?: () => void
  /** Renders the button as a link (e.g. a direct APK download). */
  href?: string
  external?: boolean
  disabled?: boolean
}

// Defines the props for a single download card
export interface DownloadCardProps {
  title: string
  description: string
  lightImage?: string
  darkImage?: string
  /** Either an image URL or any node (e.g. a CSS phone mockup). */
  mockupImage?: string
  mockup?: React.ReactNode
  badge?: string
  meta?: string
  buttons: CardButton[]
}

// The reusable DownloadCard component with animation
export const DownloadCard: React.FC<DownloadCardProps> = ({
  title,
  description,
  lightImage,
  darkImage,
  mockupImage,
  mockup,
  badge,
  meta,
  buttons,
}) => {
  return (
    <div className="group relative flex w-full flex-col justify-between gap-6 overflow-hidden rounded-2xl border bg-card/40 p-6 transition-all duration-300 hover:border-primary/50">
      {/* Background images, toned down so the card stays readable */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {lightImage && (
          <img
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-20 grayscale transition-all duration-500 group-hover:scale-105 dark:hidden"
            src={lightImage}
          />
        )}
        {darkImage && (
          <img
            alt=""
            loading="lazy"
            className="hidden h-full w-full object-cover opacity-20 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-30 dark:block"
            src={darkImage}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      {/* Card content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {badge && (
          <span className="mb-3 rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
            {badge}
          </span>
        )}
        <h3 className="mb-1 text-lg font-semibold uppercase tracking-tight text-foreground">{title}</h3>
        <p className="max-w-[26ch] text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Animated mockup */}
      <div className="animate-float relative z-10 mx-auto flex aspect-square w-full max-w-[200px] items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {mockup ??
          (mockupImage && (
            <img
              alt={`${title} mockup`}
              loading="lazy"
              className="h-full w-full rounded-lg object-contain"
              src={mockupImage}
            />
          ))}
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex w-full flex-col gap-2">
        {buttons.map((button, index) => {
          const content = (
            <>
              {button.icon && <span className="mr-2 inline-flex h-4 w-4">{button.icon}</span>}
              {button.text}
            </>
          )
          const classes = "w-full rounded-xl font-semibold"
          if (button.href && !button.disabled) {
            return (
              <Button key={index} asChild variant={button.variant || "secondary"} className={classes}>
                <a
                  href={button.href}
                  onClick={button.onClick}
                  {...(button.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {content}
                </a>
              </Button>
            )
          }
          return (
            <Button
              key={index}
              variant={button.variant || "secondary"}
              className={classes}
              onClick={button.onClick}
              disabled={button.disabled}
            >
              {content}
            </Button>
          )
        })}
        {meta && <p className="pt-1 text-center font-mono text-[11px] text-muted-foreground">{meta}</p>}
      </div>
    </div>
  )
}

interface DownloadShowcaseProps {
  heading: React.ReactNode
  options: DownloadCardProps[]
  footer?: React.ReactNode
  className?: string
}

// The main component that lays out the download cards
export const DownloadShowcase = ({ heading, options, footer, className }: DownloadShowcaseProps) => {
  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-col items-center gap-10">
        {heading}
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          {options.map((card) => (
            <DownloadCard key={card.title} {...card} />
          ))}
        </div>
        {footer}
      </div>
    </div>
  )
}
