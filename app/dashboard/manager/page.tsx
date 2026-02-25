export default function ManagerDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-2xl font-bold">Vista de Manager</h1>
      </header>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="glass-panel p-6 rounded-xl col-span-2 min-h-[300px]">
          <h2 className="text-xl font-semibold mb-4">Evolución del Equipo</h2>
          <div className="w-full h-[200px] bg-secondary/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Ranking</h2>
          <div className="space-y-4 flex-1">
             {[1,2,3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-secondary"></div>
                    <span className="font-medium">Empleado {i}</span>
                  </div>
                  <span className="font-bold text-primary">-- pts</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
