"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { NAV_ITEMS } from "@/components/layout/sidebar"

export function BottomNav() {
  const pathname = usePathname()
  const currentUser = useAppStore(s => s.currentUser)

  if (!currentUser) return null

  const filteredNav = NAV_ITEMS.filter(item =>
    item.roles.includes(currentUser.rol)
  )

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div className="bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <nav className="flex items-center justify-around px-1 py-1.5">
          {filteredNav.map(({ href, icon: Icon, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1.5"
                prefetch={true}
              >
                <div className="relative z-10 flex flex-col items-center justify-center p-1 rounded-xl transition-colors">
                  <Icon
                    className={cn(
                      "w-5 h-5 mb-1",
                      active ? "text-brand-orange" : "text-brand-cream/50"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[9px] font-medium leading-none",
                      active ? "text-brand-orange" : "text-brand-cream/50"
                    )}
                  >
                    {label}
                  </span>
                </div>
                
                {active && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-1 bg-white/5 rounded-xl z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
