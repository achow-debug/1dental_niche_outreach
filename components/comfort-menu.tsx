"use client"

import { Headphones, Coffee, Wind, Utensils, Music, ConciergeBell } from "lucide-react"

const amenities = [
  {
    icon: Headphones,
    title: "Noise-Cancelling Headphones",
    description: "Tune out the clinic sounds with your favorite playlist or podcast during treatment."
  },
  {
    icon: Wind,
    title: "Aromatherapy",
    description: "Calming essential oils throughout the studio to help you relax from the moment you enter."
  },
  {
    icon: Coffee,
    title: "Artisan Refreshments",
    description: "Enjoy a selection of herbal teas, Nespresso coffee, or chilled mineral water in our lounge."
  },
  {
    icon: Utensils,
    title: "Warm Towels",
    description: "A soothing, lavender-scented warm towel to refresh yourself after your appointment."
  },
  {
    icon: Music,
    title: "Patient's Choice Playlist",
    description: "We'll play your preferred music genre to create an environment that feels familiar."
  },
  {
    icon: ConciergeBell,
    title: "Concierge Reception",
    description: "Dedicated support to help with parking, travel arrangements, or follow-up coordination."
  }
]

export function ComfortMenu() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full mb-6 inline-block">
              Total Patient Care
            </span>
            <h2 className="text-editorial text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Comfort Menu. <br />
              <span className="text-muted-foreground text-3xl md:text-4xl lg:text-5xl font-medium">Because you deserve it.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We've redesigned the dental experience around five-star hospitality. These amenities are complimentary for all patients because your comfort is a clinical priority.
            </p>
          </div>
          <div className="hidden lg:block text-right">
             <div className="inline-block p-1 bg-muted rounded-2xl rotate-3 shadow-lg">
                <div className="bg-white p-4 rounded-xl">
                   <p className="font-bold text-lg italic text-primary">"The most relaxing dentist I've ever visited."</p>
                   <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tight">— Sarah J., Patient</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((item, idx) => (idx < 6 && (
            <div 
              key={item.title} 
              className="p-8 glass-surface rounded-[2rem] hover:scale-[1.03] transition-all duration-500 group border-none shadow-sm hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          )))}
        </div>
      </div>
    </section>
  )
}
