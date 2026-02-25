import { cn } from "@/lib/utils"

interface PESCardProps {
  name: string
  role?: string
  overallScore: number
  stats: {
    speed: number
    prod: number
    res: number
    comp: number
  }
  className?: string
}

export function PESCard({ name, role, overallScore, stats, className }: PESCardProps) {
  // Determinar gradiente según puntaje, estilo juegos (Oro, Plata, Bronce, etc)
  const isElite = overallScore >= 90
  const isGold = overallScore >= 80 && overallScore < 90
  
  const cardGradient = isElite 
    ? "from-yellow-400 via-orange-300 to-yellow-600 border-yellow-300/50"
    : isGold 
    ? "from-amber-200 via-yellow-100 to-amber-400 border-amber-200/50"
    : "from-slate-300 via-slate-100 to-slate-400 border-slate-300/50"

  const textColor = isElite || isGold ? "text-slate-900" : "text-slate-800"

  return (
    <div className={cn(
      "relative w-64 h-96 rounded-t-[20%] rounded-b-[10%] p-1 overflow-hidden shadow-xl transition-transform hover:scale-105", 
      "bg-gradient-to-b",
      cardGradient,
      className
    )}>
      {/* Reflejo brilloso estilo carta */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Contenido interno de la tarjeta */}
      <div className={cn("h-full w-full rounded-t-[18%] rounded-b-[8%] border-[3px] border-white/20 p-4 flex flex-col items-center", textColor)}>
         
         <div className="w-full flex justify-between items-start">
           <div className="flex flex-col items-center">
             <span className="text-4xl font-black">{overallScore}</span>
             <span className="text-xs uppercase font-bold">{role?.substring(0,3) || 'EMP'}</span>
           </div>
           {/* Placeholder para foto del empleado */}
           <div className="w-20 h-20 bg-black/10 rounded-full blur-[2px]"></div>
         </div>

         <div className="mt-8 border-b-2 border-black/10 w-full text-center pb-2">
           <h2 className="text-xl font-bold uppercase tracking-tight">{name}</h2>
         </div>

         <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 w-full px-2 text-sm font-semibold">
           <div className="flex justify-between">
             <span>VEL</span>
             <span>{stats.speed}</span>
           </div>
           <div className="flex justify-between">
             <span>PRO</span>
             <span>{stats.prod}</span>
           </div>
           <div className="flex justify-between">
             <span>RES</span>
             <span>{stats.res}</span>
           </div>
           <div className="flex justify-between">
             <span>CUM</span>
             <span>{stats.comp}</span>
           </div>
         </div>
         
         <div className="mt-auto opacity-50 text-[10px] font-bold tracking-widest uppercase">
           Statline Auth
         </div>
      </div>
    </div>
  )
}
