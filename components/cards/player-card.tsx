"use client"

import { Profile, PlayerStats } from "@/lib/store"
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const SCORE_COLOR = (score: number) => {
  if (score >= 90) return { badge: "bg-yellow-400 text-yellow-900", label: "ÉLITE" }
  if (score >= 80) return { badge: "bg-emerald-500 text-emerald-950", label: "PLATA" }
  if (score >= 70) return { badge: "bg-brand-blue text-brand-cream", label: "BRONCE" }
  return { badge: "bg-muted text-muted-foreground", label: "BÁSICO" }
}

interface PlayerCardProps {
  profile: Profile
  stats: PlayerStats
  compact?: boolean
  className?: string
}

export function PlayerCard({ profile, stats, compact = false, className }: PlayerCardProps) {
  const tier = SCORE_COLOR(stats.puntuacion_global)
  const initials = profile.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2)

  const radarData = [
    { subject: "VEL", value: stats.velocidad, fullMark: 100 },
    { subject: "PRD", value: stats.productividad, fullMark: 100 },
    { subject: "RES", value: stats.resolucion, fullMark: 100 },
    { subject: "CMP", value: stats.cumplimiento, fullMark: 100 },
    { subject: "RND", value: stats.rendimiento, fullMark: 100 },
  ]

  if (compact) {
    return (
      <div className={cn("bg-card rounded-xl border border-border p-4 flex items-center gap-4 transition-all hover:border-brand-blue/40 hover:shadow-sm", className)}>
        <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-brand-cream">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{profile.nombre_completo}</p>
          <p className="text-xs text-muted-foreground">{profile.cargo}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", tier.badge)}>
            {tier.label}
          </span>
          <span className="text-lg font-bold font-mono text-foreground">{stats.puntuacion_global}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-md hover:-translate-y-0.5 duration-200",
      className
    )}>
      {/* Card header — dark gradient */}
      <div className="relative bg-brand-dark px-5 pt-5 pb-16">
        {/* Score badge */}
        <div className="flex items-start justify-between mb-3">
          <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", tier.badge)}>
            {tier.label}
          </span>
          <div className="text-right">
            <p className="text-3xl font-bold font-mono text-brand-cream leading-none">{stats.puntuacion_global}</p>
            <p className="text-xs text-brand-cream/40 mt-0.5">GLOBAL</p>
          </div>
        </div>
        {/* Avatar */}
        <div className="flex flex-col items-center mt-2">
          <div className="w-14 h-14 rounded-full bg-brand-blue border-2 border-brand-cream/20 flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-brand-cream">{initials}</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pt-4 pb-5 -mt-10 relative z-10">
        {/* Name plate */}
        <div className="bg-card rounded-xl border border-border p-3 mb-4 text-center shadow-sm">
          <p className="font-bold text-foreground text-base leading-tight">{profile.nombre_completo}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{profile.cargo ?? profile.rol.toUpperCase()}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-5 gap-1 mb-4">
          {[
            { label: "VEL", value: stats.velocidad },
            { label: "PRD", value: stats.productividad },
            { label: "RES", value: stats.resolucion },
            { label: "CMP", value: stats.cumplimiento },
            { label: "RND", value: stats.rendimiento },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span className={cn(
                "text-sm font-bold font-mono leading-none",
                value >= 85 ? "text-brand-orange" : value >= 70 ? "text-brand-blue" : "text-muted-foreground"
              )}>{value}</span>
              <span className="text-[9px] text-muted-foreground mt-0.5 font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#D6D8CC" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#6B7280", fontSize: 9, fontWeight: 600 }}
              />
              <Radar
                name={profile.nombre_completo}
                dataKey="value"
                stroke="#E18546"
                fill="#E18546"
                fillOpacity={0.25}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
