"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export type VideoStory = {
  id: string
  name: string
  treatment: string
  duration: string
  quote: string
  poster: string
  src: string
}

const stories: VideoStory[] = [
  {
    id: "1",
    name: "Sarah M.",
    treatment: "Cosmetic refresh",
    duration: "0:45",
    quote: "I finally felt heard — not rushed — and the whole visit felt calm.",
    poster: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    src: "https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-4458-large.mp4",
  },
  {
    id: "2",
    name: "James T.",
    treatment: "Routine care",
    duration: "0:32",
    quote: "Booking was simple and the studio felt more like a lounge than a clinic.",
    poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    src: "https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-4458-large.mp4",
  },
  {
    id: "3",
    name: "Priya R.",
    treatment: "Hygiene visit",
    duration: "0:38",
    quote: "Clear explanations and a gentle touch — I left smiling.",
    poster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    src: "https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-4458-large.mp4",
  },
]

export function VideoTestimonialGrid() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<VideoStory | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const openStory = (story: VideoStory) => {
    setActive(story)
    setOpen(true)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) {
      videoRef.current?.pause()
      setActive(null)
    }
  }

  return (
    <div className="mb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Patient stories, in their own words
        </h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Short clips — tap to watch. (Illustrative footage; replace with your own patient-approved videos.)
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => openStory(story)}
            className="group text-left rounded-[1.75rem] overflow-hidden border border-border bg-card shadow-sm interactive-card-lift"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={story.poster}
                alt=""
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                </span>
              </div>
              <span className="absolute bottom-4 right-4 text-[11px] font-semibold uppercase tracking-wider text-white/90 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                {story.duration}
              </span>
            </div>
            <div className="p-6">
              <p className="font-semibold text-foreground">{story.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{story.treatment}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{story.quote}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden border-none bg-black">
          {active && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>Video story — {active.name}</DialogTitle>
                <DialogDescription>{active.quote}</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  key={active.src}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  poster={active.poster}
                  autoPlay
                >
                  <source src={active.src} type="video/mp4" />
                </video>
              </div>
              <div className="p-6 bg-card border-t border-border">
                <p className="font-semibold text-foreground">{active.name}</p>
                <p className="text-sm text-muted-foreground">{active.treatment}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{active.quote}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
