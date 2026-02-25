"use client"

import { useAppStore, Product } from "@/lib/store"
import { useState } from "react"
import { Plus, Search, Pencil, Trash2, X, Star, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type FormState = Omit<Product, 'id' | 'creado_en'>

const BLANK: FormState = {
  nombre: "",
  peso_valor: 1,
  tiempo_estandar_segundos: 600,
  nivel_dificultad: 2,
  activo: true,
}

const DIFF_LABELS = ["", "Básico", "Fácil", "Medio", "Difícil", "Experto"]

export default function ProductosPage() {
  const products = useAppStore(s => s.products)
  const addProduct = useAppStore(s => s.addProduct)
  const updateProduct = useAppStore(s => s.updateProduct)
  const deleteProduct = useAppStore(s => s.deleteProduct)
  const currentUser = useAppStore(s => s.currentUser)

  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(BLANK)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const isAdmin = currentUser?.rol === "admin"

  const filtered = products.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm(BLANK)
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p.id)
    setForm({
      nombre: p.nombre,
      peso_valor: p.peso_valor,
      tiempo_estandar_segundos: p.tiempo_estandar_segundos,
      nivel_dificultad: p.nivel_dificultad,
      activo: p.activo,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.nombre.trim()) return
    if (editing !== null) {
      updateProduct(editing, form)
    } else {
      addProduct(form)
    }
    setShowModal(false)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m${s > 0 ? ` ${s}s` : ''}`
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pt-14 md:pt-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Productos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{products.filter(p => p.activo).length} activos de {products.length} totales</p>
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
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue"
        />
      </div>

      {/* Product cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(product => (
          <div
            key={product.id}
            className={cn(
              "bg-card rounded-xl border border-border p-4 flex flex-col gap-3 transition-all hover:shadow-sm",
              !product.activo && "opacity-60"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm leading-tight">{product.nombre}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {product.activo
                    ? <CheckCircle className="w-3 h-3 text-emerald-500" />
                    : <XCircle className="w-3 h-3 text-muted-foreground" />
                  }
                  <span className="text-xs text-muted-foreground">{product.activo ? "Activo" : "Inactivo"}</span>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-brand-blue transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-muted/60 rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Valor</p>
                <p className="font-bold font-mono text-sm text-brand-orange">{product.peso_valor}x</p>
              </div>
              <div className="bg-muted/60 rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Estándar</p>
                <p className="font-bold font-mono text-sm text-foreground">{formatTime(product.tiempo_estandar_segundos)}</p>
              </div>
              <div className="bg-muted/60 rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Dificultad</p>
                <div className="flex justify-center gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-2 h-2",
                        i < product.nivel_dificultad ? "fill-brand-orange text-brand-orange" : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-1.5">
              {DIFF_LABELS[product.nivel_dificultad]} · creado {product.creado_en}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">No se encontraron productos</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 glass rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground">{editing !== null ? "Editar producto" : "Nuevo producto"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre</label>
                <input type="text" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue" placeholder="Ej. Ensamblaje X" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Peso (valor)</label>
                  <input type="number" step="0.5" min="0.5" max="10" value={form.peso_valor}
                    onChange={e => setForm(f => ({ ...f, peso_valor: parseFloat(e.target.value) || 1 }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tiempo estándar (seg)</label>
                  <input type="number" step="60" min="60" value={form.tiempo_estandar_segundos}
                    onChange={e => setForm(f => ({ ...f, tiempo_estandar_segundos: parseInt(e.target.value) || 600 }))}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Dificultad: {DIFF_LABELS[form.nivel_dificultad]}</label>
                <input type="range" min="1" max="5" value={form.nivel_dificultad}
                  onChange={e => setForm(f => ({ ...f, nivel_dificultad: parseInt(e.target.value) }))}
                  className="w-full accent-brand-orange" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                  className="w-4 h-4 accent-brand-orange" />
                <span className="text-sm text-foreground">Producto activo</span>
              </label>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setShowModal(false)} className="flex-1 text-sm border border-border rounded-lg py-2.5 text-muted-foreground hover:text-foreground">Cancelar</button>
                <button onClick={handleSave} disabled={!form.nombre.trim()} className="flex-1 text-sm bg-brand-orange text-brand-cream rounded-lg py-2.5 font-semibold hover:bg-brand-orange/90 disabled:opacity-40">
                  {editing !== null ? "Guardar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 glass rounded-2xl p-6 w-full max-w-xs shadow-xl text-center">
            <h2 className="text-base font-bold text-foreground mb-2">Eliminar producto</h2>
            <p className="text-sm text-muted-foreground mb-5">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-sm border border-border rounded-lg py-2.5 text-muted-foreground">Cancelar</button>
              <button onClick={() => { deleteProduct(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 text-sm bg-destructive text-destructive-foreground rounded-lg py-2.5 font-semibold hover:opacity-90">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
