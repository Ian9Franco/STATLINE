import * as React from "react"
import { LucideProps } from "lucide-react"

export function ChefCoatIcon({ strokeWidth = 1.25, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Cuello trasero: Más estrecho */}
      <path d="M10 6V3h4v3" />
      {/* Cuerpo principal: Más esbelto y alto */}
      <path d="M5 6h14v11l-7 4-7-4z" />
      {/* Solapas cruzadas más marcadas hacia el centro */}
      <path d="M19 6l-7 6.5" />
      <path d="M5 6l4.5 4.2" />
      {/* Botones: Más separados y pequeños (radio 0.8) */}
      <circle cx="9" cy="13" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}
