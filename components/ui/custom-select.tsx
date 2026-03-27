"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string | number
  label: string
}

interface CustomSelectProps {
  value: string | number | null
  onChange: (value: any) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  className,
  disabled = false
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.value === value)

  return (
    <div className={cn("relative w-full", className)} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between text-sm border rounded-xl px-4 py-3 transition-all text-left",
          "focus:outline-none focus:border-brand-orange disabled:opacity-50 disabled:cursor-not-allowed",
          open ? "border-brand-orange ring-1 ring-brand-orange/20 bg-brand-blue/30" : "border-brand-blue/30 bg-brand-blue/20"
        )}
      >
        <span className={selectedOption ? "text-brand-cream truncate pr-4" : "text-brand-cream/60 truncate pr-4"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-brand-cream/60 transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="absolute z-50 w-full bg-brand-dark/95 backdrop-blur-xl border border-brand-blue/40 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-white/10">
              {options.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between group",
                    value === option.value
                      ? "bg-brand-orange/20 text-brand-orange font-medium"
                      : "text-brand-cream/80 hover:bg-brand-blue/30 hover:text-brand-cream"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              ))}
              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-brand-cream/50">Sin opciones</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
