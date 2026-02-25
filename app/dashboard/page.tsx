"use client"

import { useAppStore } from "@/lib/store"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { ManagerDashboard } from "@/components/dashboard/manager-dashboard"
import { EmpleadoDashboard } from "@/components/dashboard/empleado-dashboard"

export default function DashboardPage() {
  const currentUser = useAppStore(s => s.currentUser)

  if (!currentUser) return null

  return (
    <div className="md:pt-0 pt-14">
      {currentUser.rol === "admin" && <AdminDashboard />}
      {currentUser.rol === "manager" && <ManagerDashboard />}
      {currentUser.rol === "empleado" && <EmpleadoDashboard />}
    </div>
  )
}
