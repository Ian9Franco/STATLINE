export default function EmployeeDashboardPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-2xl font-bold">Mis Estadísticas Personales</h1>
        <div className="h-10 w-32 bg-primary animate-pulse rounded-md"></div>
      </header>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <div className="glass-panel p-6 rounded-xl flex items-center justify-center min-h-[250px] relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
           <div className="z-10 text-center">
             <div className="text-5xl font-black text-primary mb-2">94</div>
             <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Puntaje General</div>
           </div>
        </div>

        <div className="glass-panel p-6 rounded-xl min-h-[250px] relative">
          <h2 className="text-lg font-semibold mb-4">Sesión Actual</h2>
          <div className="flex flex-col items-center justify-center h-full space-y-4 pb-8">
            <div className="text-4xl font-mono tracking-widest text-foreground">00:00:00</div>
            <div className="text-sm text-muted-foreground">Listo para arrancar el producto</div>
          </div>
        </div>
      </div>
    </div>
  )
}
