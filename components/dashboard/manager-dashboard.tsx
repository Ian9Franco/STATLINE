"use client"

import { useAppStore, calculatePlayerStats } from "@/lib/store"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { PlayerCard } from "@/components/cards/player-card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, Legend
} from "recharts"
import { Users, Package, Timer, TrendingUp, Award, ChevronUp, ChevronDown, Minus } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

const PERIODS = ["Febrero 2025", "Enero 2025", "Diciembre 2024"]

export function ManagerDashboard() {
  const profiles = useAppStore(s => s.profiles)
  const products = useAppStore(s => s.products)
  const sessions = useAppStore(s => s.sessions)
  const evaluations = useAppStore(s => s.evaluations)
  const config = useAppStore(s => s.config)
  const [period, setPeriod] = useState(PERIODS[0])
  const [view, setView] = useState<"overview" | "products" | "rankings">("overview")

  const employees = profiles.filter(p => p.rol === "empleado")
  const activeProducts = products.filter(p => p.activo)
  const completedSessions = sessions.filter(s => s.finalizado_en)
  const allEmployeeIds = employees.map(e => e.id)

  const employeeStats = useMemo(() =>
    employees.map(emp => ({
      profile: emp,
      stats: calculatePlayerStats(emp.id, sessions, evaluations, products, config, allEmployeeIds)
    })).sort((a, b) => b.stats.puntuacion_global - a.stats.puntuacion_global),
    [employees, sessions, evaluations, products, config]
  )

  const avgScore = employeeStats.length > 0
    ? Math.round(employeeStats.reduce((a, e) => a + e.stats.puntuacion_global, 0) / employeeStats.length)
    : 0

  const topEmployee = employeeStats[0]

  // Product performance data
  const productData = activeProducts.map(prod => {
    const prodSessions = completedSessions.filter(s => s.producto_id === prod.id)
    const avgTime = prodSessions.length > 0
      ? Math.round(prodSessions.reduce((a, s) => a + s.total_segundos, 0) / prodSessions.length)
      : 0
    const efficiency = avgTime > 0 ? Math.min(Math.round((prod.tiempo_estandar_segundos / avgTime) * 100), 130) : 0
    return {
      name: prod.nombre.split(' ').slice(0, 2).join(' '),
      sesiones: prodSessions.length,
      eficiencia: efficiency,
      valor: prod.peso_valor,
    }
  })

  // Trend data (simulated weekly)
  const trendData = [
    { semana: "S1", velocidad: 72, productividad: 65, cumplimiento: 80 },
    { semana: "S2", velocidad: 75, productividad: 70, cumplimiento: 82 },
    { semana: "S3", velocidad: 80, productividad: 74, cumplimiento: 85 },
    { semana: "S4", velocidad: avgScore - 3, productividad: avgScore - 5, cumplimiento: avgScore },
  ]

  const getChangeIcon = (score: number) => {
    if (score >= 80) return <ChevronUp className="w-3 h-3 text-emerald-600" />
    if (score >= 70) return <Minus className="w-3 h-3 text-yellow-500" />
    return <ChevronDown className="w-3 h-3 text-red-500" />
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Panel de Gerencia</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitoreo de alto nivel del equipo</p>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue"
        >
          {PERIODS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Total Empleados" value={employees.length} icon={Users} color="brand-blue" />
        <KpiCard label="Productos Activos" value={activeProducts.length} icon={Package} color="brand-orange" />
        <KpiCard label="Sesiones Totales" value={completedSessions.length} icon={Timer} color="brand-dark" />
        <KpiCard label="Score Promedio" value={avgScore} icon={TrendingUp} color="brand-orange" suffix="pts" change="+3.2%" changeUp />
      </div>

      {/* View tabs */}
      <div className="flex gap-1 mb-5 bg-muted rounded-xl p-1 w-fit">
        {(["overview", "products", "rankings"] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-all",
              view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {v === "overview" ? "General" : v === "products" ? "Productos" : "Rankings"}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Trend chart */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Evolución Semanal</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E18546" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#E18546" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3D4F7E" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3D4F7E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6D8CC" vertical={false} />
                  <XAxis dataKey="semana" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                  <Tooltip contentStyle={{ background: "#FEFEF3", border: "1px solid #D6D8CC", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="velocidad" name="Velocidad" stroke="#E18546" fill="url(#velGrad)" strokeWidth={2} dot={{ r: 3, fill: "#E18546" }} />
                  <Area type="monotone" dataKey="productividad" name="Productividad" stroke="#3D4F7E" fill="url(#prodGrad)" strokeWidth={2} dot={{ r: 3, fill: "#3D4F7E" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top performer */}
          {topEmployee && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-orange" />
                Mejor Rendimiento del Período
              </h3>
              <div className="flex justify-center">
                <div className="w-52">
                  <PlayerCard profile={topEmployee.profile} stats={topEmployee.stats} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "products" && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Rendimiento por Producto</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D6D8CC" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} domain={[0, 130]} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} width={100} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#FEFEF3", border: "1px solid #D6D8CC", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Eficiencia"]} />
                <Bar dataKey="eficiencia" radius={[0, 6, 6, 0]}>
                  {productData.map((entry, i) => (
                    <Cell key={i} fill={entry.eficiencia >= 100 ? "#E18546" : entry.eficiencia >= 80 ? "#3D4F7E" : "#D6D8CC"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "rankings" && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Clasificación del Equipo</h3>
          <div className="flex flex-col gap-2">
            {employeeStats.map(({ profile, stats }, idx) => (
              <div key={profile.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <span className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0",
                  idx === 0 ? "bg-yellow-400 text-yellow-900" :
                  idx === 1 ? "bg-slate-300 text-slate-800" :
                  idx === 2 ? "bg-amber-600 text-amber-100" :
                  "bg-muted text-muted-foreground"
                )}>{idx + 1}</span>
                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-brand-cream">
                    {profile.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{profile.nombre_completo}</p>
                  <p className="text-xs text-muted-foreground">{profile.cargo}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {getChangeIcon(stats.puntuacion_global)}
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-foreground">{stats.puntuacion_global}</span>
                    <span className="text-xs text-muted-foreground ml-0.5">pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Avg line */}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Promedio del equipo</span>
            <span className="text-sm font-bold font-mono text-brand-blue">{avgScore} pts</span>
          </div>
        </div>
      )}
    </div>
  )
}
