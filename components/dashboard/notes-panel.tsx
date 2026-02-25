"use client"

import { useAppStore } from "@/lib/store"
import { useState } from "react"
import { Lock, Unlock, Plus, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface NotesPanelProps {
  selectedEmployeeId: string | null
}

export function NotesPanel({ selectedEmployeeId }: NotesPanelProps) {
  const notes = useAppStore(s => s.notes)
  const profiles = useAppStore(s => s.profiles)
  const currentUser = useAppStore(s => s.currentUser)
  const addNote = useAppStore(s => s.addNote)

  const [newNote, setNewNote] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [targetId, setTargetId] = useState(selectedEmployeeId ?? "")

  const employees = profiles.filter(p => p.rol === "empleado")

  const displayNotes = selectedEmployeeId
    ? notes.filter(n => n.empleado_id === selectedEmployeeId)
    : notes

  const handleAdd = () => {
    if (!newNote.trim() || !targetId) return
    addNote({
      empleado_id: targetId,
      nota: newNote.trim(),
      creado_por: currentUser?.id ?? "u1",
      privada: isPrivate,
    })
    setNewNote("")
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-blue" />
          Notas Internas
          {selectedEmployeeId && (
            <span className="text-xs font-normal text-muted-foreground">
              — {profiles.find(p => p.id === selectedEmployeeId)?.nombre_completo}
            </span>
          )}
        </h3>
        <span className="text-xs text-muted-foreground">{displayNotes.length} nota{displayNotes.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Notes list */}
      <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
        {displayNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Sin notas aún</p>
        ) : displayNotes.map(note => {
          const author = profiles.find(p => p.id === note.creado_por)
          const subject = profiles.find(p => p.id === note.empleado_id)
          return (
            <div key={note.id} className="rounded-lg bg-muted/60 p-3 flex gap-2 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {note.privada
                    ? <Lock className="w-3 h-3 text-brand-orange flex-shrink-0" />
                    : <Unlock className="w-3 h-3 text-brand-blue flex-shrink-0" />
                  }
                  <span className="text-xs font-medium text-foreground">{subject?.nombre_completo.split(' ')[0]}</span>
                  <span className="text-[10px] text-muted-foreground">· {author?.nombre_completo.split(' ')[0]}</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{note.nota}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add note form */}
      <div className="border-t border-border pt-3 flex flex-col gap-2">
        <select
          value={targetId}
          onChange={e => setTargetId(e.target.value)}
          className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:border-brand-blue"
        >
          <option value="">Seleccionar empleado...</option>
          {employees.map(e => (
            <option key={e.id} value={e.id}>{e.nombre_completo}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Escribir nota..."
            className="flex-1 text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue"
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={cn(
              "px-2.5 py-2 rounded-lg border transition-colors",
              isPrivate ? "border-brand-orange bg-brand-orange/10 text-brand-orange" : "border-border text-muted-foreground"
            )}
            title={isPrivate ? "Privada" : "Pública"}
          >
            {isPrivate ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
          <button
            onClick={handleAdd}
            disabled={!newNote.trim() || !targetId}
            className="px-2.5 py-2 rounded-lg bg-brand-orange text-brand-cream disabled:opacity-40 hover:bg-brand-orange/90 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
