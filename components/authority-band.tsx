"use client"

import { ShieldCheck } from "lucide-react"

export function AuthorityBand() {
  const associations = [
    { name: "General Dental Council", logo: "GDC" },
    { name: "British Dental Association", logo: "BDA" },
    { name: "Care Quality Commission", logo: "CQC Registered" },
    { name: "Invisalign Platinum Provider", logo: "Invisalign" }
  ]

  return (
    <div className="w-full bg-background border-y border-border/50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
            <ShieldCheck className="w-3 h-3" />
            Clinical Standards
          </div>
          {associations.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
               <span className="text-sm font-bold tracking-tighter text-foreground">{item.logo}</span>
               <span className="hidden md:block text-[10px] font-medium text-muted-foreground uppercase">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
