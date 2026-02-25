"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import {
  BarChart3, LayoutDashboard, Users, Package, Timer,
  Settings, LogOut, ChevronLeft, ChevronRight, Menu, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { GuideButton } from "@/components/layout/guide-button"

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "manager", "empleado"] },
  { href: "/dashboard/empleados", icon: Users, label: "Empleados", roles: ["admin", "manager"] },
  { href: "/dashboard/productos", icon: Package, label: "Productos", roles: ["admin", "manager"] },
  { href: "/dashboard/sesiones", icon: Timer, label: "Sesiones", roles: ["admin", "manager", "empleado"] },
  { href: "/dashboard/configuracion", icon: Settings, label: "Configuración", roles: ["admin"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const currentUser = useAppStore(s => s.currentUser)
  const logout = useAppStore(s => s.logout)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const filteredNav = NAV_ITEMS.filter(item =>
    currentUser && item.roles.includes(currentUser.rol)
  )

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-sidebar-border",
        collapsed && "justify-center px-3"
      )}>
        <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-4 h-4 text-brand-cream" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-base font-bold text-sidebar-foreground tracking-widest flex items-baseline gap-1.5">
              PaChef <span className="text-[10px] font-bold text-brand-orange tracking-widest uppercase">Statline</span>
            </span>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && currentUser && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-sidebar-foreground">
                {currentUser.nombre_completo.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.nombre_completo}</p>
              <p className="text-xs text-sidebar-foreground/50 capitalize">{currentUser.rol}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {filteredNav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              collapsed ? "justify-center px-2" : "",
              isActive(href)
                ? "bg-brand-orange text-sidebar-foreground shadow-sm"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-sidebar-border flex flex-col gap-1">
        <GuideButton />
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-150 w-full",
            collapsed ? "justify-center px-2" : ""
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden md:flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-all duration-150 w-full",
            collapsed ? "justify-center px-2" : ""
          )}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : (
            <>
              <ChevronLeft className="w-3 h-3" />
              <span>Colapsar</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-brand-dark border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-brand-cream" />
          </div>
          <span className="text-base font-bold text-brand-cream tracking-widest flex items-baseline gap-1.5">
            PaChef <span className="text-[10px] font-bold text-brand-orange tracking-widest uppercase">Statline</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-brand-cream/70 hover:text-brand-cream transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "md:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-brand-dark transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-brand-dark transition-all duration-300 flex-shrink-0",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile top spacer */}
      <div className="md:hidden h-14 flex-shrink-0 w-full absolute" />
    </>
  )
}
