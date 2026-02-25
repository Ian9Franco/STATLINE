"use client"

import { useAppStore } from "@/lib/store"
import { useState } from "react"
import { Settings, Save, RotateCcw, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const DEFAULTS = {
  peso_velocidad: 0.30,
  peso_productividad: 0.30,
  peso_resolucion: 0.20,
  peso_cumplimiento: 0.20,
}

export default function ConfiguracionPage() {
  const config = useAppStore(s => s.config)
  const updateConfig = useAppStore(s => s.updateConfig)
  const currentUser = useAppStore(s => s.currentUser)

  const [local, setLocal] = useState({ ...config })
  const [saved, setSaved] = useState(false)

  const isAdmin = currentUser?.rol === "admin"

  const totalWeight = parseFloat(
    (local.peso_velocidad + local.peso_productividad + local.peso_resolucion + local.peso_cumplimiento).toFixed(2)
  )
  const isValid = Math.abs(totalWeight - 1.0) < 0.001

  const handleSave = () => {
    if (!isValid) return
    updateConfig(local)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setLocal({ ...DEFAULTS })
  }

  const WEIGHTS = [
    {
      key: "peso_velocidad" as const,
      label: "Velocidad",
      desc: "Eficiencia temporal vs. el tiempo estándar del producto",
      color: "bg-brand-orange",
    },
    {
      key: "peso_productividad" as const,
      label: "Productividad",
      desc: "Suma de valores de productos completados, normalizada",
      color: "bg-brand-blue",
    },
    {
      key: "peso_resolucion" as const,
      label: "Resolución",
      desc: "Puntuación de calidad y resolución de incidencias",
      color: "bg-brand-dark",
    },
    {
      key: "peso_cumplimiento" as const,
      label: "Cumplimiento",
      desc: "Puntualidad y cumplimiento de objetivos",
      color: "bg-muted-foreground",
    },
  ]

  // Example score preview
  const exampleScore = Math.round(
    85 * local.peso_velocidad +
    78 * local.peso_productividad +
    90 * local.peso_resolucion +
    88 * local.peso_cumplimiento
  )

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto pt-14 md:pt-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Configuración</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Pesos de métricas y sistema</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center">
          <Settings className="w-4 h-4 text-brand-blue" />
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">Solo los administradores pueden modificar la configuración del sistema.</p>
        </div>
      )}

      {/* Weights card */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-1">Pesos del Puntaje Global</h2>
        <p className="text-xs text-muted-foreground mb-5">La suma de todos los pesos debe ser exactamente 1.00 (100%)</p>

        <div className="flex flex-col gap-5">
          {WEIGHTS.map(({ key, label, desc, color }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-foreground w-12 text-right">
                    {Math.round(local[key] * 100)}%
                  </span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.05"
                  value={local[key]}
                  disabled={!isAdmin}
                  onChange={e => setLocal(l => ({ ...l, [key]: parseFloat(e.target.value) }))}
                  className="w-full accent-brand-orange disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                />
                <div
                  className={cn("h-1.5 rounded-full mt-1 transition-all", color)}
                  style={{ width: `${local[key] * 100}%`, maxWidth: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total indicator */}
        <div className={cn(
          "mt-5 p-3 rounded-xl flex items-center justify-between text-sm",
          isValid ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
        )}>
          <span className={isValid ? "text-emerald-700 font-medium" : "text-red-600 font-medium"}>
            {isValid ? "Pesos balanceados" : `Suma: ${Math.round(totalWeight * 100)}% (debe ser 100%)`}
          </span>
          <span className={cn("font-bold font-mono", isValid ? "text-emerald-700" : "text-red-600")}>
            {Math.round(totalWeight * 100)}%
          </span>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-4">
        <h2 className="text-sm font-semibold text-foreground mb-1">Vista Previa</h2>
        <p className="text-xs text-muted-foreground mb-4">Con las métricas de ejemplo: Vel 85 · Prod 78 · Res 90 · Cmp 88</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {WEIGHTS.map(({ key, label, color }) => (
              <div key={key} className="flex flex-col items-center">
                <div className={cn("w-1.5 h-8 rounded-full mb-1", color)} style={{ height: `${local[key] * 100}px`, minHeight: 8, maxHeight: 48 }} />
                <span className="text-[10px] text-muted-foreground">{label.slice(0, 3)}</span>
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Puntaje resultante</p>
            <p className="text-4xl font-bold font-mono text-brand-orange">{exampleScore}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isAdmin && (
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-sm border border-border rounded-xl px-4 py-2.5 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 text-sm rounded-xl px-4 py-2.5 font-semibold transition-all",
              saved
                ? "bg-emerald-500 text-white"
                : "bg-brand-orange text-brand-cream hover:bg-brand-orange/90 disabled:opacity-40"
            )}
          >
            <Save className="w-4 h-4" />
            {saved ? "Guardado" : "Guardar configuración"}
          </button>
        </div>
      )}
    </div>
  )
}
