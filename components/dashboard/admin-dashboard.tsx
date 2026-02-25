"use client"

import { useAppStore, calculatePlayerStats } from "@/lib/store"
import { PlayerCard } from "@/components/cards/player-card"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Users, Package, Timer, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { NotesPanel } from "@/components/dashboard/notes-panel"

export function AdminDashboard() {
  const profiles = useAppStore(s => s.profiles)
  const products = useAppStore(s => s.products)
  const sessions = useAppStore(s => s.sessions)
  const evaluations = useAppStore(s => s.evaluations)
  const config = useAppStore(s => s.config)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

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

  const barData = employeeStats.map(({ profile, stats }) => ({
    name: profile.nombre_completo.split(' ')[0],
    score: stats.puntuacion_global,
    velocidad: stats.velocidad,
    productividad: stats.productividad,
  }))

  const selectedStats = selectedEmployee
    ? employeeStats.find(e => e.profile.id === selectedEmployee)
    : null

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Panel de Admin</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Vista completa del equipo en tiempo real</p>
        </div>
        <Link
          href="/dashboard/empleados"
          className="flex items-center gap-2 text-sm font-medium bg-brand-orange text-brand-cream px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo empleado</span>
        </Link>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Empleados" value={employees.length} icon={Users} color="brand-blue" />
        <KpiCard label="Productos Activos" value={activeProducts.length} icon={Package} color="brand-orange" />
        <KpiCard label="Sesiones Completadas" value={completedSessions.length} icon={Timer} color="brand-dark" />
        <KpiCard label="Puntaje Promedio" value={avgScore} icon={TrendingUp} color="brand-orange" suffix="pts" />
      </div>

      {/* Player Cards Grid */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3">Tarjetas de Jugador</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {employeeStats.map(({ profile, stats }, idx) => (
            <button
              key={profile.id}
              className="text-left"
              onClick={() => setSelectedEmployee(selectedEmployee === profile.id ? null : profile.id)}
            >
              <div className={`relative transition-transform duration-200 ${selectedEmployee === profile.id ? "scale-105" : "hover:scale-102"}`}>
                {idx === 0 && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    #1
                  </div>
                )}
                <PlayerCard profile={profile} stats={stats} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom grid: chart + notes */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Ranking de Rendimiento</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D6D8CC" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "#FEFEF3", border: "1px solid #D6D8CC", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v} pts`, "Puntaje"]}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#E18546" : "#3D4F7E"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notes Panel */}
        <NotesPanel selectedEmployeeId={selectedStats?.profile.id ?? null} />
      </div>
    </div>
  )
}
