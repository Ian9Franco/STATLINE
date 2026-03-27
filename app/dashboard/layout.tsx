"use client"

import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { FloatingGuide } from "@/components/layout/floating-guide"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = useAppStore(s => s.currentUser)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.replace("/")
    }
  }, [currentUser, router])

  if (!currentUser) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto max-md:pb-32">
        {children}
      </main>
      <FloatingGuide />
      <BottomNav />
    </div>
  )
}
