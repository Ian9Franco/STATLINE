import { driver } from "driver.js"
import "driver.js/dist/driver.css"

type TourStepsMap = Record<string, Record<string, any[]>>;

export const tourSteps: TourStepsMap = {
  "/dashboard": {
    admin: [
      { element: "#admin-kpis", popover: { title: "Indicadores Clave", description: "Vista del resumen general del equipo, sesiones y el puntaje promedio actual.", side: "bottom", align: "start" } },
      { element: "#admin-player-cards", popover: { title: "Cartas de Jugador", description: "Estadísticas estilo deportivo. Hacé clic en un jugador para ver detalles y agregar notas.", side: "top", align: "start" } },
      { element: "#admin-ranking-chart", popover: { title: "Ranking Semanal", description: "Gráfico interactivo con el top de rendimiento desglosado.", side: "top", align: "start" } }
    ],
    manager: [
      { element: "#manager-view-tabs", popover: { title: "Vistas del Dashboard", description: "Navegá entre las vistas para analizar el rendimiento general, por producto o el ranking oficial.", side: "bottom", align: "center" } },
      { element: "#manager-kpis", popover: { title: "Métricas Generales", description: "Supervisá volúmenes de sesiones y la fluctuación porcentual del equipo.", side: "bottom", align: "start" } }
    ],
    empleado: [
      { element: "#empleado-stats", popover: { title: "Tus Estadísticas", description: "Mirá tu tarjeta y tu puntaje en tiempo real.", side: "bottom", align: "start" } },
      { element: "#empleado-radar", popover: { title: "Radar de Crecimiento", description: "Tu rendimiento superpuesto al promedio de tu equipo. ¡Fijate en qué podés mejorar!", side: "top", align: "start" } }
    ]
  },
  "/dashboard/empleados": {
    admin: [
      { element: "#empleados-search", popover: { title: "Buscador de Personal", description: "Filtrá al toque por nombre, cargo o rol.", side: "bottom", align: "start" } },
      { element: "#empleados-table", popover: { title: "Gestión de Personal", description: "Listado de todo el equipo. Hacé clic en cualquier fila para pispear su tarjeta interactiva.", side: "top", align: "center" } },
      { element: "#empleados-new-btn", popover: { title: "Nuevo Empleado", description: "Desde acá podés dar de alta perfiles nuevos y asignar roles.", side: "left", align: "start" } }
    ],
    manager: [
      { element: "#empleados-search", popover: { title: "Buscador de Personal", description: "Encontrá a los miembros de tu equipo rapidísimo.", side: "bottom", align: "start" } },
      { element: "#empleados-table", popover: { title: "Listado Oficial", description: "Monitoreá cargos y mirá las tarjetas de rendimiento haciendo clic en una fila.", side: "top", align: "center" } }
    ]
  },
  "/dashboard/productos": {
    admin: [
      { element: "#productos-search", popover: { title: "Buscador de Catálogo", description: "Encontrá productos por nombre facilísimo.", side: "bottom", align: "start" } },
      { element: "#productos-grid", popover: { title: "Configuración de Productos", description: "Controlá multiplicadores de valor, Tiempos Estándar (ideal) y Dificultades que impactan los puntajes.", side: "top", align: "center" } }
    ],
    manager: [
      { element: "#productos-search", popover: { title: "Buscador de Catálogo", description: "Encontrá productos rápidamente.", side: "bottom", align: "start" } },
      { element: "#productos-grid", popover: { title: "Listado de Productos", description: "Chequeá las expectativas de tiempos y dificultades para cada tarea.", side: "top", align: "center" } }
    ]
  },
  "/dashboard/sesiones": {
    admin: [
      { element: "#sesiones-timer", popover: { title: "Cronómetro de Producción", description: "Arrancá una sesión de tiempo para un empleado. Calcula eficiencia en tiempo real respecto al estándar.", side: "bottom", align: "start" } },
      { element: "#sesiones-history", popover: { title: "Historial de Resultados", description: "Registro histórico de todas las sesiones, coloreadas por eficiencia (verde, amarillo, rojo).", side: "top", align: "start" } }
    ],
    manager: [
      { element: "#sesiones-timer", popover: { title: "Cronómetro de Producción", description: "Simulá el arranque de sesión y observá la eficiencia de la tarea.", side: "bottom", align: "start" } },
      { element: "#sesiones-history", popover: { title: "Historial de Producción", description: "Monitoreá la eficiencia real vs esperada de todas las sesiones de laburo.", side: "top", align: "start" } }
    ],
    empleado: [
      { element: "#sesiones-timer", popover: { title: "Tu Cronómetro", description: "Elegí el producto que vas a ensamblar y largá la producción. ¡Tratá de mantenerte en verde!", side: "bottom", align: "center" } },
      { element: "#sesiones-history", popover: { title: "Tu Historial", description: "Lista de todos tus laburos recientes y tu eficiencia particular en cada uno.", side: "top", align: "start" } }
    ]
  },
  "/dashboard/configuracion": {
    admin: [
      { element: "#config-weights", popover: { title: "Motor del Puntaje", description: "Este es el cerebro del Dashboard. Ajustá cómo pega cada variable. ¡Acuérdate que la suma SIEMPRE tiene que ser 100%!", side: "right", align: "start" } },
      { element: "#config-preview", popover: { title: "Simulador Al Toque", description: "Revisá acá abajo el resultado teórico con datos prueba antes de mandar tus cambios.", side: "top", align: "start" } }
    ]
  }
}

export function initTour(role: string, pathname: string) {
  const pageSteps = tourSteps[pathname]
  
  // If the page isn't registered or the role doesn't have steps, fallback gracefully or do nothing
  if (!pageSteps) return
  
  // Try to find the role specifically, or default to admin if it's the only one (some generic cases)
  const steps = pageSteps[role] || pageSteps["admin"]
  
  if (!steps || steps.length === 0) return

  const tourObj = driver({
    showProgress: true,
    animate: true,
    nextBtnText: "Siguiente →",
    prevBtnText: "← Anterior",
    doneBtnText: "Finalizar",
    progressText: 'Paso {{current}} de {{total}}',
    allowClose: true,
    steps: steps as any
  })

  tourObj.drive()
}
