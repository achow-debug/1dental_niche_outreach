"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { useClientNarrowViewport } from "@/lib/hooks/use-client-narrow-viewport"

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

function StoryPlayback({
  active,
  videoRef,
}: {
  active: VideoStory
  videoRef: RefObject<HTMLVideoElement | null>
}) {
  return (
    <>
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          key={active.src}
          className="h-full w-full object-cover"
          controls
          playsInline
          poster={active.poster}
          autoPlay
        >
          <source src={active.src} type="video/mp4" />
        </video>
      </div>
      <div className="border-t border-border bg-card p-4 md:p-6">
        <p className="font-semibold text-foreground">{active.name}</p>
        <p className="text-sm text-muted-foreground">{active.treatment}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3">{active.quote}</p>
      </div>
    </>
  )
}

export function VideoTestimonialGrid() {
  const narrow = useClientNarrowViewport()
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  /** Must match server HTML until mount, or hydration fails (Dialog vs Drawer DOM differs on narrow viewports). */
  const useMobileSheet = hasMounted && narrow

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

  const media = active ? <StoryPlayback active={active} videoRef={videoRef} /> : null

  return (
    <div className="mb-8 md:mb-12">
      <div className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
        <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl lg:text-3xl">
          Patient stories, in their own words
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          Short clips — tap to watch. (Illustrative footage; replace with your own patient-approved videos.)
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => openStory(story)}
            className="group overflow-hidden rounded-[1.75rem] border border-border bg-card text-left shadow-sm interactive-card-lift"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={story.poster}
                alt=""
                fill
                className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105 motion-reduce:group-hover:scale-100"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform motion-reduce:transition-none group-hover:scale-110 motion-reduce:group-hover:scale-100">
                  <Play className="ml-1 h-7 w-7 text-primary" fill="currentColor" />
                </span>
              </div>
              <span className="absolute bottom-4 right-4 rounded-full bg-black/40 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                {story.duration}
              </span>
            </div>
            <div className="p-5 md:p-6">
              <p className="font-semibold text-foreground">{story.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{story.treatment}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{story.quote}</p>
            </div>
          </button>
        ))}
      </div>

      {useMobileSheet ? (
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent className="max-h-[88dvh] gap-0 overflow-hidden border-none bg-black p-0">
            {active && (
              <>
                <DrawerHeader className="sr-only">
                  <DrawerTitle>Video story — {active.name}</DrawerTitle>
                  <DrawerDescription>{active.quote}</DrawerDescription>
                </DrawerHeader>
                {media}
              </>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="max-h-[min(92dvh,880px)] gap-0 overflow-y-auto border-none bg-black p-0 sm:max-w-2xl">
            {active && (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle>Video story — {active.name}</DialogTitle>
                  <DialogDescription>{active.quote}</DialogDescription>
                </DialogHeader>
                {media}
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
