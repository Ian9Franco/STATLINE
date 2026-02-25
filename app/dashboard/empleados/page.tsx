"use client"

import { useAppStore, Profile, calculatePlayerStats } from "@/lib/store"
import { useState, useMemo } from "react"
import { Plus, Search, Pencil, Trash2, X, Shield, TrendingUp, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlayerCard } from "@/components/cards/player-card"

type FormState = Omit<Profile, 'id' | 'creado_en'>

const ROLE_META = {
  admin: { label: "Admin", color: "bg-brand-orange/15 text-brand-orange", icon: Shield },
  manager: { label: "Manager", color: "bg-brand-blue/15 text-brand-blue", icon: TrendingUp },
  empleado: { label: "Empleado", color: "bg-brand-dark/10 text-brand-dark", icon: User },
}

const BLANK: FormState = { nombre_completo: "", rol: "empleado", cargo: "" }

export default function EmpleadosPage() {
  const profiles = useAppStore(s => s.profiles)
  const addProfile = useAppStore(s => s.addProfile)
  const updateProfile = useAppStore(s => s.updateProfile)
  const deleteProfile = useAppStore(s => s.deleteProfile)
  const sessions = useAppStore(s => s.sessions)
  const evaluations = useAppStore(s => s.evaluations)
  const products = useAppStore(s => s.products)
  const config = useAppStore(s => s.config)
  const currentUser = useAppStore(s => s.currentUser)

  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(BLANK)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const isAdmin = currentUser?.rol === "admin"

  const allEmployeeIds = useMemo(() => profiles.filter(p => p.rol === "empleado").map(p => p.id), [profiles])

  const filtered = profiles.filter(p =>
    p.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
    p.cargo?.toLowerCase().includes(search.toLowerCase()) ||
    p.rol.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm(BLANK)
    setShowModal(true)
  }

  const openEdit = (p: Profile) => {
    setEditing(p.id)
    setForm({ nombre_completo: p.nombre_completo, rol: p.rol, cargo: p.cargo ?? "" })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.nombre_completo.trim()) return
    if (editing) {
      updateProfile(editing, form)
    } else {
      addProfile(form)
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    deleteProfile(id)
    setDeleteConfirm(null)
  }

  const previewProfile = previewId ? profiles.find(p => p.id === previewId) : null
  const previewStats = previewId
    ? calculatePlayerStats(previewId, sessions, evaluations, products, config, allEmployeeIds)
    : null

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pt-14 md:pt-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Empleados</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{profiles.length} perfiles registrados</p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 text-sm font-semibold bg-brand-orange text-brand-cream px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre, cargo o rol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Cargo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Registrado</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile, idx) => {
                const meta = ROLE_META[profile.rol]
                const Icon = meta.icon
                return (
                  <tr
                    key={profile.id}
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                      previewId === profile.id && "bg-brand-blue/5"
                    )}
                    onClick={() => setPreviewId(previewId === profile.id ? null : profile.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-brand-cream">
                            {profile.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">{profile.nombre_completo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{profile.cargo ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1", meta.color)}>
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{profile.creado_en}</td>
                    <td className="px-4 py-3">
                      {isAdmin && (
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => openEdit(profile)}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-brand-blue transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {profile.id !== currentUser?.id && (
                            <button
                              onClick={() => setDeleteConfirm(profile.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No se encontraron perfiles</div>
          )}
        </div>
      </div>

      {/* Preview panel */}
      {previewProfile && previewStats && (
        <div className="mt-4 bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Vista previa — {previewProfile.nombre_completo}</h3>
            <button onClick={() => setPreviewId(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-center md:justify-start">
            <div className="w-52">
              <PlayerCard profile={previewProfile} stats={previewStats} />
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 glass rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground">{editing ? "Editar perfil" : "Nuevo perfil"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre completo</label>
                <input
                  type="text"
                  value={form.nombre_completo}
                  onChange={e => setForm(f => ({ ...f, nombre_completo: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue"
                  placeholder="Ej. Ana López"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Cargo</label>
                <input
                  type="text"
                  value={form.cargo ?? ""}
                  onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue"
                  placeholder="Ej. Operario Senior"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rol</label>
                <select
                  value={form.rol}
                  onChange={e => setForm(f => ({ ...f, rol: e.target.value as Profile['rol'] }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue"
                >
                  <option value="empleado">Empleado</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-sm border border-border rounded-lg py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.nombre_completo.trim()}
                  className="flex-1 text-sm bg-brand-orange text-brand-cream rounded-lg py-2.5 font-semibold hover:bg-brand-orange/90 disabled:opacity-40 transition-colors"
                >
                  {editing ? "Guardar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 glass rounded-2xl p-6 w-full max-w-xs shadow-xl text-center">
            <h2 className="text-base font-bold text-foreground mb-2">Eliminar perfil</h2>
            <p className="text-sm text-muted-foreground mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-sm border border-border rounded-lg py-2.5 text-muted-foreground">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 text-sm bg-destructive text-destructive-foreground rounded-lg py-2.5 font-semibold hover:opacity-90">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
