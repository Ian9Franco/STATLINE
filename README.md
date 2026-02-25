# STATLINE by PaChef

**STATLINE by PaChef** es una aplicación web enfocada a móviles (mobile-first) para la medición y análisis del rendimiento de la producción interna en tiempo real.

El sistema abandona el enfoque tradicional de "hojas de cálculo" para adoptar una experiencia de usuario gamificada y visual, inspirada en las métricas de rendimiento deportivo (estilo FIFA/PES), brindando motivación a los empleados y análisis claro y automatizado para los mánagers y administradores.

## Características Principales

- **Gestión Centralizada:** Registro rápido y estructurado de Empleados y Catálogo de Productos.
- **Cronómetro Integrado:** Herramienta en vivo para medir tiempos de producción, con comparador en tiempo real frente al "Tiempo Estándar" esperado.
- **Gamificación (Tarjetas de Jugador):** Perfiles dinámicos por colaborador evaluando Velocidad, Productividad, Resolución y Cumplimiento, dando un `Score Global` (0-100).
- **Roles Diferenciados:**
  - **Admin:** Acceso total, configuración de variables, edición de información y notas privadas.
  - **Manager:** Vistas analíticas sobre el rendimiento grupal, gráficos de tendencias y eficiencia por producto.
  - **Empleado:** Vista personal centrada en privacidad, métricas propias y comparación anónima contra el promedio del equipo.
- **Guía Interactiva (Tour UX):** Sistema de asistencia en pantalla con popups inteligentes impulsado por `driver.js`.

## Tecnologías (Stack Frontend)

- **Framework:** [Next.js](https://nextjs.org/) (App Router, v15+)
- **Lenguaje:** TypeScript, React 19
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualización de Datos:** [Recharts](https://recharts.org/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Guías de Usuario:** [Driver.js](https://driverjs.com/)
- **Gestión de Estado (Cliente):** [Zustand](https://zustand-demo.pmnd.rs/)

## Estructura del Proyecto

```
app/
├── dashboard/               # Modos de aplicación principal
│   ├── empleados/           # Lista y gestión de empleados (CRUD)
│   ├── productos/           # Catálogo de productos y pesos/tiempos (CRUD)
│   ├── sesiones/            # Cronómetro activo e historial de producciones
│   └── configuracion/       # Algoritmos de pesos y valores del Score Global
components/                  # UI, Layouts, Gráficos y Tarjetas gamificadas
lib/                         # Tienda global (Zustand) y lógica de cálculos (Stats)
```

## Guía Rápida de Inicio

1. **Instalar dependencias:** `npm install`
2. **Iniciar servidor de desarrollo:** `npm run dev`
3. **Acceder a la URL local:** Por defecto `http://localhost:3000`
4. **Login Simulado:** Podrás probar los distintos accesos haciendo clic en los perfiles `Admin`, `Manager` o `Empleado` de demostración en la pantalla de bienvenida.

## Sobre "El Motor" (Lógica de Rendimiento)

Puedes alterar o ajustar los pesos que determinan la puntuación global entrando como "Admin" y yendo a **Configuración**. La suma de los pesos asignados a cada métrica (Velocidad, Productividad, etc.) siempre debe dar 100% exacto para garantizar una fórmula precisa.

---

**STATLINE by PaChef** no es solo una aplicación decorativa; es un sistema de modelado cuantitativo. Muestra quién rinde mejor e identifica exactamente dónde debe desplegarse cada persona para lograr la máxima eficiencia.
