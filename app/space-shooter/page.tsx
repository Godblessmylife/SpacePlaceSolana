"use client"

import React from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Maximize2 } from "lucide-react"
import Link from "next/link"
import SpaceShooter from "@/components/space-shooter/space-shooter"
import AnimatedBackground from "@/components/space-shooter/animated-background"
import Head from "next/head"
import { useRouter } from "next/navigation"

// Функция для включения полноэкранного режима
const enterFullscreen = () => {
  if (typeof document !== "undefined") {
    const element = document.documentElement

    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`)
      })
    } else if ((element as any).webkitRequestFullscreen) {
      ;(element as any).webkitRequestFullscreen()
    } else if ((element as any).msRequestFullscreen) {
      ;(element as any).msRequestFullscreen()
    }
  }
}

export default function SpaceShooterPage() {
  const [highScore, setHighScore] = React.useState(0)
  const [isMobile, setIsMobile] = React.useState(false)
  const router = useRouter()

  // Загружаем рекорд из localStorage при первом рендере
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScore = localStorage.getItem("space_shooter_high_score")
      if (savedScore) {
        setHighScore(Number.parseInt(savedScore, 10))
      }
    }
  }, [])

  // Состояние для размеров окна
  const [windowSize, setWindowSize] = React.useState({ width: 1200, height: 800 })

  // Обновляем размеры окна после монтирования компонента
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      // Устанавливаем начальный размер
      updateSize()

      // Добавляем обработчик изменения размера окна
      window.addEventListener("resize", updateSize)

      // Очищаем обработчик при размонтировании
      return () => window.removeEventListener("resize", updateSize)
    }
  }, [])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)

      const handleResize = () => {
        setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleScoreUpdate = (score: number) => {
    if (score > highScore) {
      setHighScore(score)
      // Сохраняем рекорд в localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("space_shooter_high_score", score.toString())
      }
    }
  }

  // Функция для перехода в полноэкранный режим игры
  const goToFullscreenMode = () => {
    router.push("/fullscreen-game")
  }

  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <NavBar />

      <div className="flex-1 p-4 pb-24 relative z-10 bg-gradient-to-b from-black to-gray-900">
        {/* Анимированный космический фон */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1 }}>
          <AnimatedBackground width={windowSize.width} height={windowSize.height} />
        </div>

        <div className="w-full flex flex-col items-center mb-6">
          <div className="relative w-full max-w-[320px] h-[100px] mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Основной текст с градиентом и эффектами */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    textShadow: "0 0 10px rgba(255, 0, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5)",
                    fontFamily: "'Press Start 2P', monospace, system-ui",
                    transform: "perspective(500px) rotateX(10deg)",
                  }}
                >
                  <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 via-cyan-300 to-blue-600 text-4xl font-extrabold tracking-wider">
                    SOLANA
                  </h1>
                </div>

                {/* Текст Space Shooter с эффектами */}
                <div
                  className="absolute inset-0 flex items-center justify-center pt-12"
                  style={{
                    textShadow: "0 0 10px rgba(255, 0, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5)",
                    fontFamily: "'Press Start 2P', monospace, system-ui",
                    transform: "perspective(500px) rotateX(10deg)",
                  }}
                >
                  <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-blue-300 to-purple-500 text-5xl font-extrabold tracking-wider">
                    GALAGA
                  </h1>
                </div>

                {/* Обводка для текста */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    fontFamily: "'Press Start 2P', monospace, system-ui",
                    transform: "perspective(500px) rotateX(10deg)",
                    WebkitTextStroke: "1px #063f00",
                    opacity: 0.9,
                  }}
                >
                  <h1 className="text-transparent text-4xl font-extrabold tracking-wider">SOLANA</h1>
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center pt-12"
                  style={{
                    fontFamily: "'Press Start 2P', monospace, system-ui",
                    transform: "perspective(500px) rotateX(10deg)",
                    WebkitTextStroke: "1px #063f00",
                    opacity: 0.9,
                  }}
                >
                  <h1 className="text-transparent text-5xl font-extrabold tracking-wider">GALAGA</h1>
                </div>

                {/* Звезда в логотипе */}
                <div className="absolute top-2 right-16 animate-pulse">
                  <div className="w-6 h-6 relative">
                    <div className="absolute inset-0 rotate-0 scale-100 transition-transform">✦</div>
                    <div className="absolute inset-0 rotate-45 scale-75 transition-transform text-white">✦</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-sm">
              High Score: <span className="font-bold text-amber-500">{highScore}</span>
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={goToFullscreenMode} className="flex items-center">
              <Maximize2 className="h-4 w-4 mr-1" />
              {isMobile ? "Play Fullscreen" : "Fullscreen Mode"}
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className={isMobile ? "w-full" : "w-auto"}>
            <SpaceShooter onScoreUpdate={handleScoreUpdate} />
          </div>
        </div>

        <Card className="bg-black bg-opacity-80 border border-amber-500/30 max-w-lg mx-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Game Rewards</h2>
            <p className="text-sm text-muted-foreground mb-4">Earn Gold by achieving high scores in Solana Galaga!</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>1,000 points</span>
                <span className="font-bold text-amber-500">10 Gold</span>
              </div>
              <div className="flex justify-between items-center">
                <span>5,000 points</span>
                <span className="font-bold text-amber-500">50 Gold</span>
              </div>
              <div className="flex justify-between items-center">
                <span>10,000 points</span>
                <span className="font-bold text-amber-500">100 Gold</span>
              </div>
              <div className="flex justify-between items-center">
                <span>25,000 points</span>
                <span className="font-bold text-amber-500">250 Gold</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </main>
  )
}
