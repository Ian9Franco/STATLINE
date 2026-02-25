import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color?: string
  suffix?: string
  change?: string
  changeUp?: boolean
}

export function KpiCard({ label, value, icon: Icon, color = "brand-blue", suffix, change, changeUp }: KpiCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          color === "brand-orange" ? "bg-brand-orange/10" :
          color === "brand-blue" ? "bg-brand-blue/10" :
          "bg-brand-dark/10"
        )}>
          <Icon className={cn(
            "w-4 h-4",
            color === "brand-orange" ? "text-brand-orange" :
            color === "brand-blue" ? "text-brand-blue" :
            "text-brand-dark"
          )} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold font-mono text-foreground leading-none">
          {value}{suffix && <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>}
        </p>
        {change && (
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded",
            changeUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
          )}>
            {changeUp ? "+" : ""}{change}
          </span>
        )}
      </div>
    </div>
  )
}
