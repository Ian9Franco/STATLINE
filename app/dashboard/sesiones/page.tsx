"use client"

import { useAppStore } from "@/lib/store"
import { useState, useEffect, useCallback } from "react"
import { Play, Square, Timer, Package, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SesionesPage() {
  const currentUser = useAppStore(s => s.currentUser)
  const profiles = useAppStore(s => s.profiles)
  const products = useAppStore(s => s.products)
  const sessions = useAppStore(s => s.sessions)
  const activeSession = useAppStore(s => s.activeSession)
  const startSession = useAppStore(s => s.startSession)
  const stopSession = useAppStore(s => s.stopSession)

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<string>(currentUser?.id ?? "")
  const [elapsed, setElapsed] = useState(0)

  const isAdmin = currentUser?.rol === "admin"
  const isEmployeeView = currentUser?.rol === "empleado"

  const activeProducts = products.filter(p => p.activo)
  const employees = profiles.filter(p => p.rol === "empleado")

  // Live ticker
  useEffect(() => {
    if (!activeSession) { setElapsed(0); return }
    const tick = () => setElapsed(Math.round((Date.now() - activeSession.startedAt) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [activeSession])

  const handleStart = () => {
    if (!selectedProduct) return
    const empId = isAdmin ? selectedEmployee : currentUser?.id ?? ""
    if (!empId) return
    startSession(empId, selectedProduct)
  }

  // Sessions to show
  const visibleSessions = isEmployeeView
    ? sessions.filter(s => s.empleado_id === currentUser?.id)
    : sessions

  const completedSessions = visibleSessions.filter(s => s.finalizado_en)
    .sort((a, b) => new Date(b.iniciado_en).getTime() - new Date(a.iniciado_en).getTime())

  const selectedProd = selectedProduct ? products.find(p => p.id === selectedProduct) : null
  const efficiency = selectedProd && elapsed > 0
    ? Math.min(Math.round((selectedProd.tiempo_estandar_segundos / elapsed) * 100), 999)
    : null

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto pt-14 md:pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Sesiones de Trabajo</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Control de tiempos y cronómetro</p>
      </div>

      {/* Cronometer card */}
      <div className="bg-brand-dark rounded-2xl p-6 mb-6 relative overflow-hidden">
        {/* Decorative ring */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-2 border-brand-blue/20 pointer-events-none" />
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full border-2 border-brand-orange/20 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-4 h-4 text-brand-orange" />
            <span className="text-sm font-medium text-brand-cream/70">Cronómetro</span>
          </div>

          {/* Timer display */}
          <div className="text-center mb-6">
            <div className={cn(
              "text-6xl font-bold font-mono tracking-wider transition-all duration-300",
              activeSession ? "text-brand-orange" : "text-brand-cream/30"
            )}>
              {formatDuration(elapsed)}
            </div>
            {activeSession && efficiency !== null && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className={cn(
                  "text-sm font-bold font-mono",
                  efficiency >= 100 ? "text-emerald-400" : efficiency >= 75 ? "text-yellow-400" : "text-red-400"
                )}>
                  {efficiency}% eficiencia
                </span>
                {selectedProd && (
                  <span className="text-xs text-brand-cream/40">
                    (std: {formatDuration(selectedProd.tiempo_estandar_segundos)})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          {!activeSession ? (
            <div className="flex flex-col gap-3">
              {isAdmin && (
                <select
                  value={selectedEmployee}
                  onChange={e => setSelectedEmployee(e.target.value)}
                  className="w-full text-sm border border-brand-blue/30 rounded-xl px-3 py-2.5 bg-brand-blue/20 text-brand-cream focus:outline-none focus:border-brand-orange"
                >
                  <option value="">Seleccionar empleado...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre_completo}</option>
                  ))}
                </select>
              )}
              <select
                value={selectedProduct ?? ""}
                onChange={e => setSelectedProduct(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full text-sm border border-brand-blue/30 rounded-xl px-3 py-2.5 bg-brand-blue/20 text-brand-cream focus:outline-none focus:border-brand-orange"
              >
                <option value="">Seleccionar producto...</option>
                {activeProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre} ({formatDuration(p.tiempo_estandar_segundos)} std)</option>
                ))}
              </select>
              <button
                onClick={handleStart}
                disabled={!selectedProduct || (isAdmin && !selectedEmployee)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-orange text-brand-cream font-semibold text-sm disabled:opacity-40 hover:bg-brand-orange/90 transition-all"
              >
                <Play className="w-4 h-4 fill-brand-cream" />
                Iniciar sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {selectedProd && (
                <div className="flex items-center gap-2 text-sm text-brand-cream/70">
                  <Package className="w-4 h-4" />
                  <span>{selectedProd.nombre}</span>
                </div>
              )}
              <button
                onClick={stopSession}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all"
              >
                <Square className="w-4 h-4 fill-white" />
                Detener sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sessions history */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Historial de sesiones
          <span className="text-xs font-normal text-muted-foreground">({completedSessions.length})</span>
        </h2>

        <div className="flex flex-col gap-2">
          {completedSessions.slice(0, 20).map(session => {
            const prod = products.find(p => p.id === session.producto_id)
            const emp = profiles.find(p => p.id === session.empleado_id)
            const eff = prod && session.total_segundos > 0
              ? Math.min(Math.round((prod.tiempo_estandar_segundos / session.total_segundos) * 100), 999)
              : 0
            return (
              <div key={session.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{prod?.nombre ?? "Producto desconocido"}</p>
                  {!isEmployeeView && (
                    <p className="text-xs text-muted-foreground truncate">{emp?.nombre_completo}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{session.iniciado_en.split('T')[0]}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-sm font-bold font-mono text-foreground">{formatDuration(session.total_segundos)}</span>
                  <span className={cn(
                    "text-xs font-bold px-1.5 py-0.5 rounded font-mono",
                    eff >= 100 ? "bg-emerald-100 text-emerald-700" :
                    eff >= 75 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-600"
                  )}>
                    {eff}%
                  </span>
                </div>
              </div>
            )
          })}
          {completedSessions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">Sin sesiones registradas</div>
          )}
        </div>
      </div>
    </div>
  )
}
