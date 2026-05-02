"use client"

import { useEffect, useRef } from "react"
import { MARKETING_IMAGES } from "@/lib/marketing-placeholders"

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5 // Ultra-slow motion
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-10" />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-30 grayscale-[0.2] brightness-110"
        poster={MARKETING_IMAGES.clinicInterior}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patient-4458-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
