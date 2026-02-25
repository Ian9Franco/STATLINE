import Link from "next/link"
import { ShieldCheck, Users, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-panel w-full max-w-md p-8 rounded-3xl flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500 z-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">STATLINE</h1>
          <p className="text-muted-foreground font-medium">Medición de Rendimiento</p>
        </div>

        {/* Sección de Acceso para Desarrollo */}
        <div className="w-full space-y-4 pt-4 border-t border-border/50">
          <div className="text-center mb-6">
            <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Acceso de Desarrollo
            </span>
          </div>
          
          <Link href="/dashboard/admin" className="block w-full">
            <Button className="w-full h-12 text-lg justify-start" variant="default">
              <ShieldCheck className="mr-3 h-5 w-5" />
              Entrar como Admin
            </Button>
          </Link>

          <Link href="/dashboard/manager" className="block w-full">
            <Button className="w-full h-12 text-lg justify-start" variant="secondary">
              <Users className="mr-3 h-5 w-5" />
              Entrar como Manager
            </Button>
          </Link>

          <Link href="/dashboard/employee" className="block w-full">
            <Button className="w-full h-12 text-lg justify-start border border-border bg-background hover:bg-muted text-foreground">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Entrar como Empleado
            </Button>
          </Link>
        </div>
        
      </div>
    </div>
  )
}
