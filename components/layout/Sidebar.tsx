import Link from "next/link"
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings,
  LogOut
} from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-border/50 bg-background/50 backdrop-blur-xl flex flex-col items-center py-8">
      <div className="text-2xl font-black tracking-tight mb-12 bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">
        STATLINE
      </div>

      <nav className="w-full flex-1 px-4 space-y-2">
        <Link href="/dashboard/employee" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <LayoutDashboard size={20} className="text-primary" />
          <span className="font-medium">Mis Stats</span>
        </Link>
        <Link href="/dashboard/manager" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <Users size={20} className="text-muted-foreground" />
          <span className="font-medium text-muted-foreground">Vista del Equipo</span>
        </Link>
        <Link href="/dashboard/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors">
          <ShieldCheck size={20} className="text-muted-foreground" />
          <span className="font-medium text-muted-foreground">Panel Admin</span>
        </Link>
      </nav>

      <div className="w-full px-4 mt-auto">
        <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors mb-2">
          <Settings size={20} className="text-muted-foreground" />
          <span className="font-medium text-muted-foreground">Configuración</span>
        </Link>
        <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}
