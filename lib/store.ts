"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = 'admin' | 'manager' | 'empleado'

export interface Profile {
  id: string
  nombre_completo: string
  rol: Role
  creado_en: string
  avatar?: string
  cargo?: string
}

export interface Product {
  id: number
  nombre: string
  peso_valor: number
  tiempo_estandar_segundos: number
  nivel_dificultad: number
  activo: boolean
  creado_en: string
}

export interface WorkSession {
  id: number
  empleado_id: string
  producto_id: number
  iniciado_en: string
  finalizado_en: string | null
  total_segundos: number
}

export interface Evaluation {
  id: number
  empleado_id: string
  puntuacion_resolucion: number
  puntuacion_cumplimiento: number
  tiempo_inactivo_segundos: number
  inicio_periodo: string
  fin_periodo: string
}

export interface InternalNote {
  id: number
  empleado_id: string
  nota: string
  creado_por: string
  privada: boolean
}

export interface SystemConfig {
  peso_velocidad: number
  peso_productividad: number
  peso_resolucion: number
  peso_cumplimiento: number
}

export interface PlayerStats {
  velocidad: number
  productividad: number
  resolucion: number
  cumplimiento: number
  rendimiento: number
  puntuacion_global: number
}

// ─── Initial mock data ────────────────────────────────────────────────────────

const INITIAL_PROFILES: Profile[] = [
  { id: 'u1', nombre_completo: 'ChangoNocturno', rol: 'admin', creado_en: '2024-01-15', cargo: 'Director Técnico' },
  { id: 'u2', nombre_completo: 'Castolo', rol: 'manager', creado_en: '2024-02-01', cargo: 'Capitán de Campo' },
  { id: 'u3', nombre_completo: 'Niellendner', rol: 'empleado', creado_en: '2024-03-10', cargo: 'Operario Senior' },
  { id: 'u4', nombre_completo: 'Diego Forlán', rol: 'empleado', creado_en: '2024-03-15', cargo: 'Goleador Elegante' },
  { id: 'u5', nombre_completo: 'Pupi Zanetti', rol: 'empleado', creado_en: '2024-04-01', cargo: 'Lateral Infatigable' },
  { id: 'u6', nombre_completo: 'Marcelo', rol: 'empleado', creado_en: '2024-04-10', cargo: 'Lateral Mágico' },
  { id: 'u7', nombre_completo: 'Van Basten', rol: 'empleado', creado_en: '2024-04-15', cargo: 'Goleador Elegante' },
  { id: 'u8', nombre_completo: 'Wayne Rooney', rol: 'empleado', creado_en: '2024-04-20', cargo: 'Bulls Terrier' },
  { id: 'u9', nombre_completo: 'Ashley Cole', rol: 'empleado', creado_en: '2024-05-01', cargo: 'Muro Defensivo' },
  { id: 'u10', nombre_completo: 'Andrés Iniesta', rol: 'empleado', creado_en: '2024-05-10', cargo: 'Cerebro' },
  { id: 'u11', nombre_completo: 'Pedro León', rol: 'empleado', creado_en: '2024-05-15', cargo: 'Especialista en Centros' },
  { id: 'u12', nombre_completo: 'Ogro Fabbiani', rol: 'empleado', creado_en: '2024-06-01', cargo: 'Tanque Creativo' },
  { id: 'u13', nombre_completo: 'Pisculichi', rol: 'empleado', creado_en: '2024-06-05', cargo: 'Guante en el Pie' },
  { id: 'u14', nombre_completo: 'Pepe Sand', rol: 'empleado', creado_en: '2024-06-10', cargo: 'Goleador Eterno' },
  { id: 'u15', nombre_completo: 'Agustín Orión', rol: 'empleado', creado_en: '2024-06-15', cargo: 'Arquero de Clásicos' },
  { id: 'u16', nombre_completo: 'Carlos Mayada', rol: 'empleado', creado_en: '2024-06-20', cargo: 'Polifuncional' },
  { id: 'u17', nombre_completo: 'Pulga Rodríguez', rol: 'empleado', creado_en: '2024-06-25', cargo: 'Magia de Simoca' },
]

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, nombre: 'Ensamblaje Complejo A', peso_valor: 3.5, tiempo_estandar_segundos: 1800, nivel_dificultad: 4, activo: true, creado_en: '2024-01-01' },
  { id: 2, nombre: 'Revisión Estándar B', peso_valor: 1.5, tiempo_estandar_segundos: 600, nivel_dificultad: 2, activo: true, creado_en: '2024-01-01' },
  { id: 3, nombre: 'Proceso Premium C', peso_valor: 5.0, tiempo_estandar_segundos: 3600, nivel_dificultad: 5, activo: true, creado_en: '2024-01-01' },
  { id: 4, nombre: 'Tarea Rutinaria D', peso_valor: 1.0, tiempo_estandar_segundos: 300, nivel_dificultad: 1, activo: true, creado_en: '2024-01-15' },
  { id: 5, nombre: 'Calibración E', peso_valor: 2.5, tiempo_estandar_segundos: 900, nivel_dificultad: 3, activo: false, creado_en: '2024-02-01' },
]

const INITIAL_SESSIONS: WorkSession[] = [
  { id: 1, empleado_id: 'u3', producto_id: 1, iniciado_en: '2025-02-01T08:00:00', finalizado_en: '2025-02-01T08:28:00', total_segundos: 1680 },
  { id: 2, empleado_id: 'u3', producto_id: 2, iniciado_en: '2025-02-01T09:00:00', finalizado_en: '2025-02-01T09:09:00', total_segundos: 540 },
  { id: 3, empleado_id: 'u4', producto_id: 1, iniciado_en: '2025-02-01T08:30:00', finalizado_en: '2025-02-01T09:10:00', total_segundos: 2400 },
  { id: 4, empleado_id: 'u5', producto_id: 3, iniciado_en: '2025-02-01T08:00:00', finalizado_en: '2025-02-01T09:05:00', total_segundos: 3900 },
  { id: 5, empleado_id: 'u6', producto_id: 2, iniciado_en: '2025-02-01T08:15:00', finalizado_en: '2025-02-01T08:23:00', total_segundos: 480 },
  { id: 6, empleado_id: 'u3', producto_id: 3, iniciado_en: '2025-02-02T08:00:00', finalizado_en: '2025-02-02T09:50:00', total_segundos: 6600 },
  { id: 7, empleado_id: 'u4', producto_id: 4, iniciado_en: '2025-02-02T10:00:00', finalizado_en: '2025-02-02T10:06:00', total_segundos: 360 },
  { id: 8, empleado_id: 'u6', producto_id: 1, iniciado_en: '2025-02-03T08:00:00', finalizado_en: '2025-02-03T08:27:00', total_segundos: 1620 },
]

const INITIAL_EVALUATIONS: Evaluation[] = [
  { id: 1, empleado_id: 'u3', puntuacion_resolucion: 88, puntuacion_cumplimiento: 92, tiempo_inactivo_segundos: 1200, inicio_periodo: '2025-02-01', fin_periodo: '2025-02-28' },
  { id: 2, empleado_id: 'u4', puntuacion_resolucion: 72, puntuacion_cumplimiento: 80, tiempo_inactivo_segundos: 2400, inicio_periodo: '2025-02-01', fin_periodo: '2025-02-28' },
  { id: 3, empleado_id: 'u5', puntuacion_resolucion: 65, puntuacion_cumplimiento: 70, tiempo_inactivo_segundos: 3600, inicio_periodo: '2025-02-01', fin_periodo: '2025-02-28' },
  { id: 4, empleado_id: 'u6', puntuacion_resolucion: 91, puntuacion_cumplimiento: 88, tiempo_inactivo_segundos: 900, inicio_periodo: '2025-02-01', fin_periodo: '2025-02-28' },
]

const INITIAL_NOTES: InternalNote[] = [
  { id: 1, empleado_id: 'u3', nota: 'Excelente desempeño en tareas complejas. Candidato para promoción.', creado_por: 'u1', privada: true },
  { id: 2, empleado_id: 'u4', nota: 'Necesita mejorar velocidad en ensamblaje. Programar capacitación.', creado_por: 'u1', privada: true },
  { id: 3, empleado_id: 'u5', nota: 'Periodo de adaptación. Monitorear próximo mes.', creado_por: 'u2', privada: false },
]

const INITIAL_CONFIG: SystemConfig = {
  peso_velocidad: 0.30,
  peso_productividad: 0.30,
  peso_resolucion: 0.20,
  peso_cumplimiento: 0.20,
}

// ─── Metric Calculation ───────────────────────────────────────────────────────

export function calculatePlayerStats(
  empleadoId: string,
  sessions: WorkSession[],
  evaluations: Evaluation[],
  products: Product[],
  config: SystemConfig,
  allEmployeeIds: string[]
): PlayerStats {
  const empSessions = sessions.filter(s => s.empleado_id === empleadoId && s.finalizado_en)
  const empEval = evaluations.find(e => e.empleado_id === empleadoId)

  // Velocity: average ratio (standard / actual), capped at 100
  let velocidadTotal = 0
  let velocidadCount = 0
  for (const s of empSessions) {
    const prod = products.find(p => p.id === s.producto_id)
    if (prod && s.total_segundos > 0) {
      const ratio = (prod.tiempo_estandar_segundos / s.total_segundos) * 100
      velocidadTotal += Math.min(ratio, 100)
      velocidadCount++
    }
  }
  const velocidad = velocidadCount > 0 ? Math.round(velocidadTotal / velocidadCount) : 50

  // Productivity: sum of peso_valor for this employee vs average
  const prodValue = empSessions.reduce((acc, s) => {
    const p = products.find(pr => pr.id === s.producto_id)
    return acc + (p?.peso_valor ?? 0)
  }, 0)
  // Normalize to 0–100 based on all employees
  const allProdValues = allEmployeeIds.map(id => {
    const eSessions = sessions.filter(s => s.empleado_id === id && s.finalizado_en)
    return eSessions.reduce((acc, s) => {
      const p = products.find(pr => pr.id === s.producto_id)
      return acc + (p?.peso_valor ?? 0)
    }, 0)
  })
  const maxProd = Math.max(...allProdValues, 1)
  const productividad = Math.round((prodValue / maxProd) * 100)

  const resolucion = empEval?.puntuacion_resolucion ?? 60
  const cumplimiento = empEval?.puntuacion_cumplimiento ?? 60

  const puntuacion_global = Math.round(
    velocidad * config.peso_velocidad +
    productividad * config.peso_productividad +
    resolucion * config.peso_resolucion +
    cumplimiento * config.peso_cumplimiento
  )

  const tiempoInactivo = empEval?.tiempo_inactivo_segundos ?? 0
  const tiempoTotal = empSessions.reduce((a, s) => a + s.total_segundos, 0)
  const tiempoEfectivo = Math.max(tiempoTotal - tiempoInactivo, 1)
  const rendimiento = Math.min(Math.round((prodValue / (tiempoEfectivo / 3600)) * 10), 100)

  return { velocidad, productividad, resolucion, cumplimiento, rendimiento, puntuacion_global }
}

// ─── Zustand Store ────────────────────────────────────────────────────────────

interface AppState {
  // Auth
  currentUser: Profile | null
  login: (userId: string) => void
  logout: () => void

  // Data
  profiles: Profile[]
  products: Product[]
  sessions: WorkSession[]
  evaluations: Evaluation[]
  notes: InternalNote[]
  config: SystemConfig

  // Active session (cronometer)
  activeSession: { sessionId: number; startedAt: number } | null

  // Profiles CRUD
  addProfile: (p: Omit<Profile, 'id' | 'creado_en'>) => void
  updateProfile: (id: string, data: Partial<Profile>) => void
  deleteProfile: (id: string) => void

  // Products CRUD
  addProduct: (p: Omit<Product, 'id' | 'creado_en'>) => void
  updateProduct: (id: number, data: Partial<Product>) => void
  deleteProduct: (id: number) => void

  // Sessions
  startSession: (empleadoId: string, productoId: number) => void
  stopSession: () => void

  // Notes
  addNote: (n: Omit<InternalNote, 'id'>) => void

  // Config
  updateConfig: (c: Partial<SystemConfig>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  currentUser: null,
  profiles: INITIAL_PROFILES,
  products: INITIAL_PRODUCTS,
  sessions: INITIAL_SESSIONS,
  evaluations: INITIAL_EVALUATIONS,
  notes: INITIAL_NOTES,
  config: INITIAL_CONFIG,
  activeSession: null,

  login: (userId) => {
    const profile = get().profiles.find(p => p.id === userId)
    if (profile) set({ currentUser: profile })
  },

  logout: () => set({ currentUser: null, activeSession: null }),

  addProfile: (p) => set(state => ({
    profiles: [...state.profiles, {
      ...p,
      id: `u${Date.now()}`,
      creado_en: new Date().toISOString().split('T')[0],
    }]
  })),

  updateProfile: (id, data) => set(state => ({
    profiles: state.profiles.map(p => p.id === id ? { ...p, ...data } : p)
  })),

  deleteProfile: (id) => set(state => ({
    profiles: state.profiles.filter(p => p.id !== id)
  })),

  addProduct: (p) => set(state => ({
    products: [...state.products, {
      ...p,
      id: Date.now(),
      creado_en: new Date().toISOString().split('T')[0],
    }]
  })),

  updateProduct: (id, data) => set(state => ({
    products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
  })),

  deleteProduct: (id) => set(state => ({
    products: state.products.filter(p => p.id !== id)
  })),

  startSession: (empleadoId, productoId) => {
    const sessionId = Date.now()
    const now = new Date().toISOString()
    set(state => ({
      sessions: [...state.sessions, {
        id: sessionId,
        empleado_id: empleadoId,
        producto_id: productoId,
        iniciado_en: now,
        finalizado_en: null,
        total_segundos: 0,
      }],
      activeSession: { sessionId, startedAt: Date.now() }
    }))
  },

  stopSession: () => {
    const { activeSession, sessions } = get()
    if (!activeSession) return
    const elapsed = Math.round((Date.now() - activeSession.startedAt) / 1000)
    set({
      sessions: sessions.map(s =>
        s.id === activeSession.sessionId
          ? { ...s, finalizado_en: new Date().toISOString(), total_segundos: elapsed }
          : s
      ),
      activeSession: null
    })
  },

  addNote: (n) => set(state => ({
    notes: [...state.notes, { ...n, id: Date.now() }]
  })),

  updateConfig: (c) => set(state => ({
    config: { ...state.config, ...c }
  })),
    }),
    {
      name: 'statline-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
)
