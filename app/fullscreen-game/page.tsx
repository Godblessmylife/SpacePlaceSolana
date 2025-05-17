"use client"

import { useEffect } from "react"
import SpaceShooter from "@/components/space-shooter/space-shooter"
import { useRouter } from "next/navigation"

export default function FullscreenGamePage() {
  const router = useRouter()

  // Обработчик для выхода из игры
  const handleExit = () => {
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error("Ошибка при выходе из полноэкранного режима:", err)
      })
    }
    router.push("/space-shooter")
  }

  // Обработчик клавиши Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <SpaceShooter fullscreenMode={true} />

      {/* Кнопка выхода (полупрозрачная) */}
      <button
        onClick={handleExit}
        className="fixed top-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-70 transition-all z-50"
      >
        Exit
      </button>
    </div>
  )
}
