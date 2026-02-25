"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Stopwatch() {
  const [isActive, setIsActive] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center space-y-6">
      <div className="text-6xl font-mono tracking-widest text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">
        {formatTime(seconds)}
      </div>

      <div className="flex space-x-4">
        {!isActive ? (
          <Button 
            onClick={() => setIsActive(true)} 
            size="lg" 
            className="rounded-full w-16 h-16 shadow-lg shadow-primary/20"
          >
            <Play fill="currentColor" className="w-8 h-8 ml-1" />
          </Button>
        ) : (
          <Button 
            onClick={() => setIsActive(false)} 
            size="lg" 
            variant="secondary"
            className="rounded-full w-16 h-16 shadow-lg"
          >
            <Pause fill="currentColor" className="w-8 h-8" />
          </Button>
        )}
        
        <Button 
          onClick={() => {
            setIsActive(false)
            setSeconds(0)
            // Emitir evento de stop a la DB después
          }} 
          size="lg" 
          variant="destructive"
          className="rounded-full w-16 h-16 shadow-lg shadow-destructive/20"
          disabled={!isActive && seconds === 0}
        >
          <Square fill="currentColor" className="w-6 h-6" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
        {isActive ? "Midiendo Tiempo" : "Listo para arrancar"}
      </div>
    </div>
  )
}
