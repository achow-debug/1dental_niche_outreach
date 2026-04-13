"use client"

export function AnimatedGradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-background to-background" />
      
      {/* Animated blob 1 - Top left, teal */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-30 blur-3xl animate-blob"
        style={{
          background: 'radial-gradient(circle, oklch(0.55 0.12 185 / 0.4) 0%, transparent 70%)',
          animationDelay: '0s',
          animationDuration: '20s',
        }}
      />
      
      {/* Animated blob 2 - Top right, lighter teal */}
      <div 
        className="absolute -top-[10%] -right-[15%] w-[45%] h-[45%] rounded-full opacity-25 blur-3xl animate-blob"
        style={{
          background: 'radial-gradient(circle, oklch(0.65 0.1 185 / 0.35) 0%, transparent 70%)',
          animationDelay: '-5s',
          animationDuration: '25s',
        }}
      />
      
      {/* Animated blob 3 - Center, soft cream */}
      <div 
        className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full opacity-20 blur-3xl animate-blob-reverse"
        style={{
          background: 'radial-gradient(circle, oklch(0.95 0.02 90 / 0.5) 0%, transparent 70%)',
          animationDelay: '-10s',
          animationDuration: '22s',
        }}
      />
      
      {/* Animated blob 4 - Bottom left, muted teal */}
      <div 
        className="absolute top-[40%] -left-[20%] w-[35%] h-[35%] rounded-full opacity-20 blur-3xl animate-blob"
        style={{
          background: 'radial-gradient(circle, oklch(0.6 0.08 185 / 0.3) 0%, transparent 70%)',
          animationDelay: '-15s',
          animationDuration: '28s',
        }}
      />
      
      {/* Subtle noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
