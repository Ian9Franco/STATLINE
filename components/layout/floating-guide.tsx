"use client"

import { HelpCircle } from "lucide-react"
import { usePathname } from "next/navigation"
import { initTour } from "@/lib/tour-steps"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function FloatingGuide() {
  const pathname = usePathname()
  const currentUser = useAppStore(s => s.currentUser)
  const [isVisible, setIsVisible] = useState(true)

  if (!currentUser || !isVisible) return null

  // Only show on dashboard pages
  if (!pathname.startsWith("/dashboard")) return null

  const handleStartTour = () => {
    const role = currentUser.rol
    initTour(role, pathname)
  }

  const handleDragEnd = (event: any, info: any) => {
    // Si se arrastra horizontalmente o verticalmente lo suficiente, desaparecer de la pantalla
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.offset.y) > 150) {
      setIsVisible(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.button
        drag
        dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        onClick={handleStartTour}
        initial={{ opacity: 0, scale: 0.5, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.5, x: 200, rotate: 45 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed bottom-24 right-4 md:bottom-12 md:right-8 z-[60]", // Cambia el alto en mobile para no chocar con el bottomnav
          "flex items-center justify-center p-3.5 rounded-2xl",
          "bg-brand-dark/80 backdrop-blur-xl border border-white/10 shadow-xl",
          "text-brand-orange hover:text-brand-cream hover:bg-brand-orange transition-colors cursor-grab active:cursor-grabbing"
        )}
        title="Guía Interactiva (Arrastra para ocultar)"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>
    </AnimatePresence>
  )
}
