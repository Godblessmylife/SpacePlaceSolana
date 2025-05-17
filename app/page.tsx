"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Trophy } from "lucide-react"
import SpaceShooter from "@/components/space-shooter/space-shooter"
import AnimatedBackground from "@/components/space-shooter/animated-background"

export default function HomePage() {
  const [highScore, setHighScore] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 })

  // Обновляем размеры окна после монтирования компонента
  useEffect(() => {
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

  const handleScoreUpdate = (score: number) => {
    if (score > highScore) {
      setHighScore(score)

      // Сохраняем рекорд в localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("galaga_high_score", score.toString())
      }
    }
  }

  // Загружаем рекорд из localStorage при первом рендере
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScore = localStorage.getItem("galaga_high_score")
      if (savedScore) {
        setHighScore(Number.parseInt(savedScore, 10))
      }
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col relative overflow-hidden">
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

                {/* Текст Galaga с эффектами */}
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

        {showInstructions ? (
          <Card className="bg-black bg-opacity-80 border border-amber-500/30 mb-4 p-3 max-w-md mx-auto">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold mb-1">How to Play</h2>
              <p className="text-xs text-muted-foreground mb-2">
                Control your ship and destroy enemy invaders to earn points!
              </p>
            </div>

            <div className="space-y-2 mb-3">
              <div>
                <h3 className="font-bold text-sm mb-0.5">Controls:</h3>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <span className="bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded mr-1.5">←→</span>
                    <span>Move ship</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded mr-1.5">Space</span>
                    <span>Fire</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded mr-1.5">P/Esc</span>
                    <span>Pause</span>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded mr-1.5">Touch</span>
                    <span>Move & fire</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-0.5">Objectives:</h3>
                <div className="grid grid-cols-2 gap-x-2 text-xs text-muted-foreground">
                  <div>• Destroy enemy ships</div>
                  <div>• Avoid enemy fire</div>
                  <div>• Clear waves to advance</div>
                  <div>• Aim for high score!</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400 text-sm py-1 h-auto"
                onClick={() => setShowInstructions(false)}
              >
                Start Game
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm">
                  High Score: <span className="font-bold text-amber-500">{highScore}</span>
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowInstructions(true)}>
                Instructions
              </Button>
            </div>

            <div className="flex justify-center mb-6">
              <SpaceShooter onScoreUpdate={handleScoreUpdate} />
            </div>
          </>
        )}

        <Card className="bg-black bg-opacity-80 border border-amber-500/30 max-w-md mx-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Game Rewards</h2>
            <p className="text-sm text-muted-foreground mb-4">Earn Gold by achieving high scores in Solana Galaga!</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>1,000 points</span>
                <span className="font-bold text-amber-500">5 Gold</span>
              </div>
              <div className="flex justify-between items-center">
                <span>5,000 points</span>
                <span className="font-bold text-amber-500">25 Gold</span>
              </div>
              <div className="flex justify-between items-center">
                <span>10,000 points</span>
                <span className="font-bold text-amber-500">50 Gold</span>
              </div>
              <div className="flex justify-between items-center">
                <span>25,000 points</span>
                <span className="font-bold text-amber-500">100 Gold</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav activeTab="home" />
    </main>
  )
}
