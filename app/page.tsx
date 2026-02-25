"use client"

import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BarChart3, Shield, TrendingUp, User } from "lucide-react"

const DEMO_USERS = [
  { id: "u1", nombre: "Carlos Ramírez", rol: "Admin", icon: Shield, color: "bg-brand-orange", description: "Acceso total. Gestión y configuración." },
  { id: "u2", nombre: "María González", rol: "Manager", icon: TrendingUp, color: "bg-brand-blue", description: "Dashboard corporativo y rankings." },
  { id: "u3", nombre: "Andrés Torres", rol: "Empleado", icon: User, color: "bg-brand-dark", description: "Vista personal y estadísticas propias." },
]

export default function LoginPage() {
  const login = useAppStore(s => s.login)
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  const handleLogin = (userId: string) => {
    setSelected(userId)
    login(userId)
    router.replace("/dashboard")
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-brand-cream" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-cream tracking-widest">STATLINE</h1>
            <p className="text-xs text-brand-cream/40 tracking-wider">RENDIMIENTO EN TIEMPO REAL</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-brand-dark text-lg font-semibold mb-1 text-center">Selecciona un perfil de demo</h2>
          <p className="text-muted-foreground text-sm text-center mb-6">Accede con cualquiera de los roles disponibles</p>

          <div className="flex flex-col gap-3">
            {DEMO_USERS.map((user) => {
              const Icon = user.icon
              return (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                    selected === user.id
                      ? "border-brand-orange bg-brand-orange/10"
                      : "border-border hover:border-brand-blue hover:bg-brand-blue/5"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${user.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-brand-cream" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{user.nombre}</p>
                    <p className="text-sm text-muted-foreground">{user.description}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    user.rol === 'Admin' ? 'bg-brand-orange/15 text-brand-orange' :
                    user.rol === 'Manager' ? 'bg-brand-blue/15 text-brand-blue' :
                    'bg-brand-dark/10 text-brand-dark'
                  }`}>
                    {user.rol}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-center text-brand-cream/30 text-xs">
          Aplicación de demostración — datos simulados
        </p>
      </div>
    </div>
  )
}
