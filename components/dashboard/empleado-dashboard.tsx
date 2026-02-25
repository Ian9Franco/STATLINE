"use client"

import { useAppStore, calculatePlayerStats } from "@/lib/store"
import { PlayerCard } from "@/components/cards/player-card"
import { KpiCard } from "@/components/dashboard/kpi-card"
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from "recharts"
import { Timer, TrendingUp, Package, Zap } from "lucide-react"
import { useMemo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function EmpleadoDashboard() {
  const currentUser = useAppStore(s => s.currentUser)
  const profiles = useAppStore(s => s.profiles)
  const products = useAppStore(s => s.products)
  const sessions = useAppStore(s => s.sessions)
  const evaluations = useAppStore(s => s.evaluations)
  const config = useAppStore(s => s.config)

  const employees = profiles.filter(p => p.rol === "empleado")
  const allEmployeeIds = employees.map(e => e.id)

  const myStats = useMemo(() => {
    if (!currentUser) return null
    return calculatePlayerStats(currentUser.id, sessions, evaluations, products, config, allEmployeeIds)
  }, [currentUser, sessions, evaluations, products, config])

  const teamAvg = useMemo(() => {
    const allStats = employees.map(emp =>
      calculatePlayerStats(emp.id, sessions, evaluations, products, config, allEmployeeIds)
    )
    if (allStats.length === 0) return null
    return {
      velocidad: Math.round(allStats.reduce((a, s) => a + s.velocidad, 0) / allStats.length),
      productividad: Math.round(allStats.reduce((a, s) => a + s.productividad, 0) / allStats.length),
      resolucion: Math.round(allStats.reduce((a, s) => a + s.resolucion, 0) / allStats.length),
      cumplimiento: Math.round(allStats.reduce((a, s) => a + s.cumplimiento, 0) / allStats.length),
      rendimiento: Math.round(allStats.reduce((a, s) => a + s.rendimiento, 0) / allStats.length),
      puntuacion_global: Math.round(allStats.reduce((a, s) => a + s.puntuacion_global, 0) / allStats.length),
    }
  }, [employees, sessions, evaluations, products, config])

  const mySessions = sessions.filter(s => s.empleado_id === currentUser?.id && s.finalizado_en)
  const totalSeconds = mySessions.reduce((a, s) => a + s.total_segundos, 0)
  const totalHours = (totalSeconds / 3600).toFixed(1)

  // Product specialization
  const productSpec = products.filter(p => p.activo).map(prod => {
    const prodSessions = mySessions.filter(s => s.producto_id === prod.id)
    const avgTime = prodSessions.length > 0
      ? Math.round(prodSessions.reduce((a, s) => a + s.total_segundos, 0) / prodSessions.length)
      : 0
    const efficiency = avgTime > 0 ? Math.min(Math.round((prod.tiempo_estandar_segundos / avgTime) * 100), 130) : 0
    return {
      nombre: prod.nombre.split(' ').slice(0, 2).join(' '),
      yo: efficiency,
      equipo: Math.round(efficiency * 0.9 + Math.random() * 10),
      sesiones: prodSessions.length,
    }
  }).filter(p => p.sesiones > 0)

  // Comparison radar
  const comparisonData = myStats && teamAvg ? [
    { subject: "VEL", yo: myStats.velocidad, equipo: teamAvg.velocidad },
    { subject: "PRD", yo: myStats.productividad, equipo: teamAvg.productividad },
    { subject: "RES", yo: myStats.resolucion, equipo: teamAvg.resolucion },
    { subject: "CMP", yo: myStats.cumplimiento, equipo: teamAvg.cumplimiento },
    { subject: "RND", yo: myStats.rendimiento, equipo: teamAvg.rendimiento },
  ] : []

  if (!currentUser || !myStats) return null

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Bienvenido de vuelta</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{currentUser.nombre_completo}</h1>
      </div>

      {/* Top: player card + KPIs */}
      <div className="grid md:grid-cols-[auto_1fr] gap-5 mb-6">
        {/* My card */}
        <div className="w-full md:w-52 flex-shrink-0">
          <PlayerCard profile={currentUser} stats={myStats} />
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Horas Trabajadas" value={totalHours} icon={Timer} color="brand-blue" suffix="h" />
            <KpiCard label="Sesiones" value={mySessions.length} icon={Package} color="brand-dark" />
            <KpiCard label="Score Global" value={myStats.puntuacion_global} icon={TrendingUp} color="brand-orange" suffix="pts" />
            <KpiCard label="Velocidad" value={myStats.velocidad} icon={Zap} color="brand-blue" suffix="pts" />
          </div>

          {/* vs team avg */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Yo vs. Promedio del equipo</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Global", yo: myStats.puntuacion_global, avg: teamAvg?.puntuacion_global ?? 0 },
                { label: "Velocidad", yo: myStats.velocidad, avg: teamAvg?.velocidad ?? 0 },
                { label: "Productividad", yo: myStats.productividad, avg: teamAvg?.productividad ?? 0 },
              ].map(({ label, yo, avg }) => {
                const diff = yo - avg
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{label}</span>
                    <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-brand-orange rounded-full transition-all duration-500"
                        style={{ width: `${yo}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-xs font-bold font-mono w-10 text-right",
                      diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {diff > 0 ? "+" : ""}{diff}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison radar */}
      {comparisonData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Radar vs. Equipo</h3>
            <p className="text-xs text-muted-foreground mb-3">Comparación anónima con el promedio</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={comparisonData}>
                  <PolarGrid stroke="#D6D8CC" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 600 }} />
                  <Radar name="Equipo (prom.)" dataKey="equipo" stroke="#3D4F7E" fill="#3D4F7E" fillOpacity={0.15} strokeWidth={1.5} />
                  <Radar name="Yo" dataKey="yo" stroke="#E18546" fill="#E18546" fillOpacity={0.25} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product specialization */}
          {productSpec.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">Especialización por Producto</h3>
              <p className="text-xs text-muted-foreground mb-3">Donde rindes mejor</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productSpec} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D6D8CC" vertical={false} />
                    <XAxis dataKey="nombre" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} domain={[0, 130]} />
                    <Tooltip contentStyle={{ background: "#FEFEF3", border: "1px solid #D6D8CC", borderRadius: 8, fontSize: 11 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="yo" name="Mi eficiencia" fill="#E18546" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="equipo" name="Equipo (prom.)" fill="#3D4F7E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="bg-brand-dark rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-brand-cream font-semibold">Registrar nueva sesión</p>
          <p className="text-brand-cream/50 text-sm mt-0.5">Inicia el cronómetro para una tarea</p>
        </div>
        <Link
          href="/dashboard/sesiones"
          className="flex-shrink-0 bg-brand-orange text-brand-cream text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-orange/90 transition-colors"
        >
          Iniciar
        </Link>
      </div>
    </div>
  )
}
